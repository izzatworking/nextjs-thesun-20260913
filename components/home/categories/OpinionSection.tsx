// components/home/categories/OpinionSection.tsx
import Link from 'next/link';
import { useRef, useState } from 'react';
import { WPPost, WPCategory } from '../../../types/wordpress';
import { getPostUrl } from '../../../lib/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';

interface OpinionSectionProps {
  posts: WPPost[];
  categories: WPCategory[];
  isLast?: boolean;
}

const SWIPE_THRESHOLD = 60;

export default function OpinionSection({ posts, categories, isLast = false }: OpinionSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  if (posts.length === 0) return null;

  const formatDateSafe = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % posts.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);

  const finishDrag = (delta: number) => {
    if (delta < -SWIPE_THRESHOLD) {
      next();
    } else if (delta > SWIPE_THRESHOLD) {
      prev();
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 5) {
      setDragOffset(delta);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    finishDrag(e.clientX - dragStartX.current);
  };

  const onPointerCancel = () => {
    finishDrag(0);
  };

  const trackTransform = `translateX(calc(${-currentIndex * 100}% + ${dragOffset}px))`;
  const transitionClass = isDragging ? '' : 'transition-transform duration-500 ease-out';

  return (
    <section className="relative overflow-hidden rounded-3xl h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, #fff5f5, #fce4ec, #f8e8ff)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col h-full p-5 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-pink-600 text-xs font-semibold uppercase tracking-widest">Perspectives</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
            Speak Up
          </h2>
        </div>

        {/* Content - flex-1 to fill remaining height */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Swipeable track */}
          <div
            className="flex-1 overflow-hidden rounded-2xl touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div className={`flex h-full ${transitionClass}`} style={{ transform: trackTransform }}>
              {posts.map((post, index) => (
                <div key={post.id} className="w-full flex-shrink-0 flex items-stretch">
                  <div className="flex-1 bg-white/70 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-pink-200/50 hover:border-pink-300 transition-all duration-500 flex flex-col shadow-lg shadow-pink-200/30">
                    {/* Featured image */}
                    {(post as any).featured_media_url && (
                      <div className="mb-4 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 overflow-hidden rounded-t-2xl">
                        <img
                          src={(post as any).featured_media_url}
                          alt={cleanTextContent(post.title.rendered)}
                          className="w-full h-40 sm:h-48 object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* Author */}
                    {post.authors && post.authors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-gray-700 text-xs sm:text-sm font-semibold uppercase tracking-wide">
                          {post.authors[0].display_name}
                        </p>
                      </div>
                    )}

                    {/* Title */}
                    <Link href={getPostUrl(post)} className="block mb-auto">
                      <h4
                        className="text-lg sm:text-xl font-bold text-gray-900 hover:text-pink-600 transition-colors cursor-pointer line-clamp-2 mb-3 leading-tight"
                        dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }}
                      />
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt?.rendered && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3 flex-shrink-0"
                        dangerouslySetInnerHTML={{ __html: cleanTextContent(post.excerpt.rendered) }} />
                    )}

                    {/* Date + counter */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-pink-100 flex-shrink-0">
                      <span className="text-gray-400 text-xs font-medium">{formatDateSafe(post.date)}</span>
                      <span className="text-gray-400 text-xs font-mono">{index + 1} / {posts.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 gap-3">
            <div className="flex gap-2">
              <button onClick={prev}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm"
                aria-label="Previous">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={next}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm"
                aria-label="Next">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link href="/category/opinion"
              className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-600 text-xs font-medium transition-colors group">
              View all
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}