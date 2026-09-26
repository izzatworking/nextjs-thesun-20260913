// components/home/categories/CategoryLayoutVideo.tsx
import Link from 'next/link';
import { WPPost, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useState, useEffect, useRef } from 'react';
import VideoPlayerModal from './VideoPlayerModal';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
  };
}

interface CategoryLayout6Props {
  name: string;
  slug: string;
  categories: any[];
  isLast?: boolean;
}

export default function CategoryLayout6({
  name,
  slug,
  categories,
  isLast = false
}: CategoryLayout6Props) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const mockVideos: YouTubeVideo[] = [
    { id: { videoId: 'dQw4w9WgXcQ' }, snippet: { title: 'Breaking News: Major Event', thumbnails: { high: { url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' } }, publishedAt: new Date().toISOString() } },
    { id: { videoId: '9bZkp7q19f0' }, snippet: { title: 'World News Update', thumbnails: { high: { url: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg' } }, publishedAt: new Date().toISOString() } },
    { id: { videoId: 'jNQXAC9IVRw' }, snippet: { title: 'Sports Highlights', thumbnails: { high: { url: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg' } }, publishedAt: new Date().toISOString() } },
    { id: { videoId: 'hTWKbfoikeg' }, snippet: { title: 'Technology News', thumbnails: { high: { url: 'https://img.youtube.com/vi/hTWKbfoikeg/maxresdefault.jpg' } }, publishedAt: new Date().toISOString() } },
    { id: { videoId: 'kJQP7kiw5Fk' }, snippet: { title: 'Entertainment News', thumbnails: { high: { url: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg' } }, publishedAt: new Date().toISOString() } }
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube/videos?maxResults=10');
        const data = await response.json();
        if (Array.isArray(data.items) && data.items.length > 0) setVideos(data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closePlayer = () => {
    setSelectedVideo(null);
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const itemWidth = container.scrollWidth / Math.ceil(videos.length / 2);
      container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (videos.length === 0) return;
    const total = Math.ceil(videos.length / 2);
    const nextIndex = (currentIndex + 1) % total;
    scrollToIndex(nextIndex);
  };

  const handlePrev = () => {
    if (videos.length === 0) return;
    const total = Math.ceil(videos.length / 2);
    const prevIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const itemWidth = container.scrollWidth / Math.ceil(videos.length / 2);
      const newIndex = Math.round(container.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 h-full flex flex-col"
        style={{ background: 'linear-gradient(180deg, #FFBB66 0%, #FFBB66 40%, #ffffff 100%)' }}
      >
        <div className="animate-pulse flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full"></div>
          <div className="h-5 sm:h-6 w-20 sm:w-24 bg-orange-300/50 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] bg-orange-200/50 rounded-xl sm:rounded-2xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #FFBB66 0%, #FFBB66 40%, #ffffff 100%)' }}
      >
        <p className="text-orange-900/60 text-sm sm:text-base lg:text-lg">No videos available yet. Check back soon!</p>
      </section>
    );
  }

  const totalSlides = Math.ceil(videos.length / 2);

  return (
    <>
    <section className="relative overflow-hidden rounded-3xl p-4 sm:p-6 lg:p-8 h-full flex flex-col"
      style={{ background: 'linear-gradient(180deg, #FFBB66 0%, #FFBB66 40%, #ffffff 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-48 sm:w-64 h-48 sm:h-64 bg-orange-300/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-amber-300/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 sm:w-48 h-32 sm:h-48 bg-yellow-300/30 rounded-full blur-3xl"></div>

      {/* Floating grid dots */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-orange-700 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Watch Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-orange-900">
              {name}
            </h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button key={i} onClick={() => scrollToIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-6 h-2 bg-orange-600' : 'w-1.5 h-1.5 bg-orange-300 hover:bg-orange-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button onClick={handlePrev}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-200/50 hover:bg-orange-300/50 backdrop-blur-sm border border-orange-300/30 flex items-center justify-center transition-all duration-300 active:scale-90"
                aria-label="Previous">
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-200/50 hover:bg-orange-300/50 backdrop-blur-sm border border-orange-300/30 flex items-center justify-center transition-all duration-300 active:scale-90"
                aria-label="Next">
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="flex-1 relative">
          <div ref={carouselRef} onScroll={handleScroll}
            className="flex overflow-x-auto gap-2 sm:gap-3 lg:gap-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory h-full">
            {videos.map((video, index) => (
              <div key={video.id.videoId}
                className="flex-shrink-0 w-[40vw] sm:w-44 md:w-52 lg:w-64 snap-start"
              >
                <div className="relative cursor-pointer group h-full flex flex-col"
                  onClick={() => handleVideoClick(video.id.videoId)}
                >
                  {/* Thumbnail */}
                  <div className="relative flex-1 aspect-[9/16] overflow-hidden rounded-xl sm:rounded-2xl ring-1 ring-orange-300/30 group-hover:ring-orange-400/50 transition-all duration-500">
                    <img
                      src={video.snippet.thumbnails.high.url}
                      alt={video.snippet.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-amber-500/0 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-all duration-500" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-orange-200/50 backdrop-blur-md flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-orange-300/30 group-hover:border-orange-400/50">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Gradient bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Index badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-orange-200/40 backdrop-blur-sm text-orange-800 text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg border border-orange-300/30">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-orange-900 text-xs sm:text-sm font-semibold mt-2 sm:mt-3 leading-snug line-clamp-2 group-hover:text-orange-700 transition-colors duration-300 flex-shrink-0">
                    {video.snippet.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile dots indicator */}
          <div className="flex sm:hidden justify-center gap-1.5 mt-3 sm:mt-5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button key={i} onClick={() => scrollToIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 h-1.5 bg-orange-600' : 'w-1.5 h-1.5 bg-orange-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

      <VideoPlayerModal
        videoId={selectedVideo || ''}
        isOpen={!!selectedVideo}
        onClose={closePlayer}
      />
    </>
  );
}
