'use client';

import { useState, useEffect, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout/Layout';
import VideoPlayerModal from '../components/home/categories/VideoPlayerModal';
import { getCategories } from '../lib/wordpress';
import { getTopStories } from '../lib/queries';
import type { WPCategory } from '../types/wordpress';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      maxres?: { url: string };
      high: { url: string };
      medium: { url: string };
    };
    publishedAt: string;
    channelTitle: string;
  };
}

interface TopStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories?: { nodes: { slug: string; name: string }[] };
  featuredImage?: { node: { sourceUrl: string; altText: string } };
}

const YOUTUBE_API_KEY = 'AIzaSyCexcmkW5KuyPUttlLqK91-l0yZo-NI6iM';

type Tab = 'home' | 'videos' | 'shorts';

function getTopStoryPath(article: TopStory): string {
  const catSlug = article.categories?.nodes?.[0]?.slug;
  if (catSlug) return `/${catSlug}/${article.slug}`;
  return `/posts/${article.slug}`;
}

function cleanHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';
  let result = html;
  for (let pass = 0; pass < 3; pass++) {
    result = result
      .replace(/&#(\d+);/g, (_, dec) => { const code = parseInt(dec, 10); return code >= 0 && code <= 0x10FFFF ? String.fromCharCode(code) : ''; })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => { const code = parseInt(hex, 16); return code >= 0 && code <= 0x10FFFF ? String.fromCharCode(code) : ''; })
      .replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&apos;/g, "'").replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
      .replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')
      .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#8230;/g, '…')
      .replace(/&[a-zA-Z][a-zA-Z0-9]*;?/g, '');
  }
  return result.trim();
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'videos', label: 'Videos' },
  { id: 'shorts', label: 'Shorts' },
];

type Orientation = 'landscape' | 'portrait' | 'auto';

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 border-b border-[#E89A2E]/20 pb-4">
      <div className="flex items-center gap-3">
        <span className="hidden sm:block w-1.5 self-stretch rounded-full bg-[#E89A2E]" />
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2b1c0a] tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#E89A2E] hover:text-[#c97700] transition-colors"
        >
          {action.label}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface VideosPageProps {
  categories: WPCategory[];
  videos: YouTubeVideo[];
  mostViewed: TopStory[];
}

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=the+sun+malaysia&type=video&part=snippet,id&order=date&maxResults=24`
    );
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.error('Failed to load videos:', e);
    return [];
  }
}

export default function VideosPage({ categories, videos, mostViewed }: VideosPageProps) {
  const loading = false;
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const nextCarousel = useCallback(() => {
    setCarouselIndex(prev => (prev + 1) % Math.min(videos.length, 10));
  }, [videos.length]);

  useEffect(() => {
    if (videos.length === 0) return;
    const timer = setInterval(nextCarousel, 4000);
    return () => clearInterval(timer);
  }, [videos.length, nextCarousel]);

  const carouselVideos = videos.slice(0, 5);
  const currentVideo = carouselVideos[carouselIndex];
  const heroVideo = videos[0];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Today';
    if (days < 2) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' });
  };

  const renderSkeleton = (orientation: Orientation = 'auto') => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className={`bg-[#FFBB66]/15 ${orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} rounded-2xl`} />
          <div className="mt-3 space-y-2">
            <div className="h-3 rounded-full bg-gray-200 w-2/3" />
            <div className="h-3 rounded-full bg-gray-200 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center py-24">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FFBB66]/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#E89A2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-400 text-base font-medium">No videos available</p>
    </div>
  );

  const renderVideoCard = (video: YouTubeVideo, index: number) => (
    <div key={video.id.videoId} className="group relative cursor-pointer" onClick={() => setSelectedVideo(video.id.videoId)}>
      <div className="aspect-video relative rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 ring-1 ring-[#FFBB66]/10 shadow-[0_12px_35px_-18px_rgba(120,60,0,0.35)] transition-all duration-500 group-hover:shadow-[0_25px_50px_-18px_rgba(120,60,0,0.5)]">
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-[#FFBB66] transition-colors duration-300">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#2b1c0a] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md">
          {`0${(index % 9) + 1}:${String(index % 60).padStart(2, '0')}`}
        </span>
      </div>
      <h3 className="text-xs sm:text-[13px] font-semibold text-[#2b1c0a] mt-2.5 leading-snug line-clamp-2 group-hover:text-[#c97700] transition-colors">
        {cleanHtmlContent(video.snippet.title)}
      </h3>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
        <span className="truncate max-w-[60%]">{video.snippet.channelTitle}</span>
        <span className="text-[#E89A2E]/50">•</span>
        <span>{formatDate(video.snippet.publishedAt)}</span>
      </div>
    </div>
  );

  const renderShortCard = (video: YouTubeVideo) => (
    <div key={video.id.videoId} className="group relative cursor-pointer" onClick={() => setSelectedVideo(video.id.videoId)}>
      <div className="aspect-[9/16] relative rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 ring-1 ring-[#FFBB66]/10 shadow-[0_12px_35px_-18px_rgba(120,60,0,0.4)] transition-all duration-500 group-hover:shadow-[0_25px_50px_-18px_rgba(120,60,0,0.55)]">
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-[#FFBB66] transition-colors duration-300">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-[#2b1c0a] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-widest text-[#FFBB66] bg-black/50 px-1.5 py-0.5 rounded">
          Short
        </span>
      </div>
      <h3 className="text-[11px] sm:text-xs font-semibold text-[#2b1c0a] mt-2 leading-snug line-clamp-2 group-hover:text-[#c97700] transition-colors">
        {cleanHtmlContent(video.snippet.title)}
      </h3>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
        <span>{formatDate(video.snippet.publishedAt)}</span>
      </div>
    </div>
  );

  return (
    <Layout categories={categories} title="Videos | The Sun Malaysia">
      <div className="min-h-screen bg-[#FDF8F0]">
        {/* ---------- Masthead / Header ---------- */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#211508] via-[#3a2710] to-[#8a5a10]">
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(rgba(255,187,102,0.9) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute -top-20 -left-16 w-96 h-96 bg-[#FFBB66]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E89A2E]/15 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
            <nav className="flex items-center gap-2 text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-5">
              <span className="hover:text-white cursor-pointer transition-colors">Home</span>
              <span>/</span>
              <span className="text-[#FFBB66]">Videos</span>
            </nav>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight leading-[0.95]">Videos</h1>
              <p className="text-white/60 text-base md:text-lg mt-2 font-medium leading-relaxed">
                Watch our latest coverage — from breaking reports to in-depth features and exclusive interviews.
              </p>
            </div>

            {/* Tab bar */}
            <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {TABS.map((tab, i) => {
                const active = activeTab === tab.id;
                return (
                  <div key={tab.id} className="flex items-center gap-2">
                    {i > 0 && <span className="hidden sm:block w-px h-5 bg-white/15" />}
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 active:scale-95 ${
                        active
                          ? 'bg-[#FFBB66] text-[#2b1c0a] shadow-[0_10px_25px_-8px_rgba(255,187,102,0.7)]'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {loading ? (
            <div className="space-y-12">
              <div className="aspect-video rounded-3xl animate-pulse bg-[#FFBB66]/15" />
              {renderSkeleton()}
            </div>
          ) : videos.length === 0 ? (
            renderEmpty()
          ) : activeTab === 'home' ? (
            /* ===================== HOME ===================== */
            <div className="space-y-12 md:space-y-14">
              {/* Lead story */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2">
                  {currentVideo && (
                    <div className="group relative cursor-pointer overflow-hidden rounded-3xl md:rounded-[32px] bg-black shadow-[0_35px_80px_-30px_rgba(120,60,0,0.6)]"
                      onClick={() => setSelectedVideo(currentVideo.id.videoId)}>
                      <div className="aspect-video relative">
                        <img
                          src={currentVideo.snippet.thumbnails.high.url}
                          alt={currentVideo.snippet.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-[#FFBB66] text-[#2b1c0a] px-2.5 py-1 rounded-md">
                          Featured
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-[#FFBB66] group-hover:scale-105 transition-all duration-300">
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:text-[#2b1c0a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                          <h2 className="text-white text-xl md:text-3xl font-serif font-bold leading-tight max-w-2xl line-clamp-2">
                            {cleanHtmlContent(currentVideo.snippet.title)}
                          </h2>
                          <p className="text-white/50 text-xs md:text-sm mt-2">{formatDate(currentVideo.snippet.publishedAt)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dots + nav */}
                  <div className="flex items-center justify-between mt-3.5 px-1">
                    <div className="flex items-center gap-2">
                      {carouselVideos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`rounded-full transition-all duration-300 ${
                            i === carouselIndex ? 'w-7 h-1.5 bg-[#E89A2E]' : 'w-1.5 h-1.5 bg-[#E89A2E]/30 hover:bg-[#E89A2E]/60'
                          }`}
                          aria-label={`Video ${i + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCarouselIndex(prev => prev === 0 ? carouselVideos.length - 1 : prev - 1)}
                        className="w-9 h-9 rounded-xl bg-white grid place-items-center text-[#8a5a1e] shadow-sm ring-1 ring-[#FFBB66]/20 hover:bg-[#FFBB66] hover:text-[#2b1c0a] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCarouselIndex(prev => (prev + 1) % carouselVideos.length)}
                        className="w-9 h-9 rounded-xl bg-white grid place-items-center text-[#8a5a1e] shadow-sm ring-1 ring-[#FFBB66]/20 hover:bg-[#FFBB66] hover:text-[#2b1c0a] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Most read / watched sidebar */}
                <div className="lg:col-span-1">
                  <div className="rounded-3xl bg-white ring-1 ring-[#FFBB66]/15 shadow-[0_20px_60px_-30px_rgba(120,60,0,0.5)] p-5 md:p-6 h-full flex flex-col">
                    <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#3a2410] pb-3 border-b border-[#FFBB66]/25 mb-4">
                      <span className="w-1.5 h-3.5 rounded-full bg-[#E89A2E]" />
                      Most Watched
                    </h2>
                    <div className="space-y-5 flex-1">
                      {mostViewed.slice(0, 5).map((post, i) => (
                        <article key={post.id} className="group flex gap-3">
                          <span className="text-lg font-black text-[#E89A2E]/35 leading-none mt-1 w-5 flex-shrink-0 font-serif">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <a href={getTopStoryPath(post)}>
                              <h3 className="text-[13px] font-semibold text-[#2b1c0a] leading-snug group-hover:text-[#c97700] transition-colors line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title) }} />
                            </a>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                              {post.categories?.nodes?.[0] && (
                                <span className="text-[#E89A2E] font-bold uppercase tracking-wider text-[10px]">{cleanHtmlContent(post.categories.nodes[0].name)}</span>
                              )}
                              <span className="text-[#E89A2E]/40">•</span>
                              <span>{formatTimeAgo(post.date)}</span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest videos */}
              <section>
                <SectionHeading
                  title="Latest Videos"
                  subtitle="Fresh coverage and headlines"
                  action={{ label: 'View all videos', onClick: () => setActiveTab('videos') }}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {videos.slice(0, 8).map((v, i) => renderVideoCard(v, i))}
                </div>
              </section>

              {/* Shorts preview */}
              <section>
                <SectionHeading
                  title="Shorts"
                  subtitle="Quick, on-the-go highlights"
                  action={{ label: 'View all shorts', onClick: () => setActiveTab('shorts') }}
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5">
                  {videos.slice(0, 6).map(renderShortCard)}
                </div>
              </section>
            </div>
          ) : activeTab === 'videos' ? (
            /* ===================== VIDEOS ===================== */
            <div>
              <SectionHeading title="All Videos" subtitle="Full-length stories, interviews and features" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {videos.map((v, i) => renderVideoCard(v, i))}
              </div>
            </div>
          ) : (
            /* ===================== SHORTS ===================== */
            <div>
              <SectionHeading title="Shorts" subtitle="Vertical stories made for your feed" />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-5">
                {videos.map(renderShortCard)}
              </div>
            </div>
          )}
        </div>
      </div>

      <VideoPlayerModal
        videoId={selectedVideo || ''}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<VideosPageProps> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );

  const [categories, videos, mostViewed] = await Promise.all([
    getCategories().catch(() => [] as WPCategory[]),
    fetchYouTubeVideos(),
    getTopStories().catch(() => [] as TopStory[]),
  ]);

  return { props: { categories, videos, mostViewed } };
};
