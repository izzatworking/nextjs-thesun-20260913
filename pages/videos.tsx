'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function VideosPage() {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [mostViewed, setMostViewed] = useState<TopStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTopStories().then(setMostViewed).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=the+sun+malaysia&type=video&part=snippet,id&order=date&maxResults=24`
        );
        const data = await res.json();
        if (data.items) setVideos(data.items);
      } catch (e) {
        console.error('Failed to load videos:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const nextCarousel = useCallback(() => {
    setCarouselIndex(prev => (prev + 1) % Math.min(videos.length, 10));
  }, [videos.length]);

  useEffect(() => {
    if (videos.length === 0) return;
    const timer = setInterval(nextCarousel, 3000);
    return () => clearInterval(timer);
  }, [videos.length, nextCarousel]);

  const carouselVideos = videos.slice(0, 5);
  const currentVideo = carouselVideos[carouselIndex];

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

  return (
    <Layout categories={categories} title="Videos | The Sun Malaysia">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        {/* Simple header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full mb-4 border border-white/20">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-[10px] font-semibold uppercase tracking-widest">Watch Now</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tight">Videos</h1>
            <p className="text-white/70 text-base md:text-lg mt-2 max-w-xl font-medium">Stories that move, inspire, and inform.</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200" />
                  <div className="mt-2 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded-full w-1/3" />
                    <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-base font-medium">No videos available</p>
            </div>
          ) : (
            <>
              {/* Featured Carousel + Most Viewed Row */}
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Featured Carousel */}
                <div className="lg:w-3/4">
                  <div className="relative bg-black rounded-2xl overflow-hidden">
                    {currentVideo && (
                      <div className="relative cursor-pointer" onClick={() => setSelectedVideo(currentVideo.id.videoId)}>
                        <div className="aspect-video relative">
                          <img
                            src={currentVideo.snippet.thumbnails.high.url}
                            alt={currentVideo.snippet.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center transform hover:scale-110 hover:rotate-12 transition-all duration-500 border border-white/30">
                              <svg className="w-6 h-6 md:w-7 md:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                            <h2 className="text-white text-base md:text-xl font-bold leading-snug max-w-2xl">
                              {currentVideo.snippet.title}
                            </h2>
                            <p className="text-white/50 text-xs md:text-sm mt-1">{formatDate(currentVideo.snippet.publishedAt)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Carousel dots + nav */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black/80">
                      <div className="flex items-center gap-1.5">
                        {carouselVideos.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCarouselIndex(i)}
                            className={`rounded-full transition-all duration-300 ${
                              i === carouselIndex ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Video ${i + 1}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCarouselIndex(prev => prev === 0 ? carouselVideos.length - 1 : prev - 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCarouselIndex(prev => (prev + 1) % carouselVideos.length)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Viewed sidebar */}
                <div className="lg:w-1/4">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-200">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Most Viewed</h2>
                  </div>
                  <div className="space-y-3">
                    {mostViewed.slice(0, 5).map((post, i) => (
                      <article key={post.id} className="group flex gap-2.5">
                        <span className="text-base font-bold text-gray-200 leading-none mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <a href={getTopStoryPath(post)}>
                            <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title) }} />
                          </a>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                            {post.categories?.nodes?.[0] && (
                              <span className="text-red-500 font-semibold uppercase tracking-wider">{cleanHtmlContent(post.categories.nodes[0].name)}</span>
                            )}
                            <span>·</span>
                            <span>{formatTimeAgo(post.date)}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* Video grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className="group relative cursor-pointer"
                    onClick={() => setSelectedVideo(video.id.videoId)}
                  >
                    <div className="aspect-video relative rounded-lg md:rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200/50 group-hover:ring-purple-300/50 transition-all duration-500">
                      <img
                        src={video.snippet.thumbnails.high.url}
                        alt={video.snippet.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Duration placeholder */}
                      <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                        HD
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mt-1.5 leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {video.snippet.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">{video.snippet.channelTitle}</span>
                      <span className="text-gray-300 text-[10px]">·</span>
                      <span className="text-[10px] text-gray-400">{formatDate(video.snippet.publishedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
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
