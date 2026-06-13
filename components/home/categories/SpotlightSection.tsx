import { getPostUrl } from '../../../lib/wordpress';
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useState, useRef, useEffect, useCallback } from 'react';

interface SpotlightSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function SpotlightSection({ posts, categories, isLast = false }: SpotlightSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (posts.length === 0) return null;

  const getCategoryName = (post: WPPostWithMedia): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    const id = typeof post.categories[0] === 'number' ? post.categories[0] : (post.categories[0] as any).id;
    const cat = categories.find(c => c.id === id);
    return cat ? cleanTextContent(cat.name) : 'Uncategorized';
  };

  const featured = posts[0];
  const sidePosts = posts.slice(1, 5);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 sm:w-1.5 sm:h-7 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900">
            Spotlight
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-90 ${showLeftArrow ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-90 ${showRightArrow ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
          <Link
            href="/category/spotlight"
            className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95"
          >
            See All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Link
          href={`${getPostUrl(featured)}`}
          className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 lg:col-span-2 min-h-[240px] xs:min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]"
        >
          {featured.featured_media_url && (
            <img
              src={featured.featured_media_url}
              alt={cleanTextContent(featured.featured_media_alt || featured.title.rendered)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-5 sm:p-6 lg:p-7">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="bg-purple-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md uppercase">{getCategoryName(featured)}</span>
            </div>
            <h3 className="text-white font-extrabold text-base xs:text-lg sm:text-xl lg:text-2xl leading-tight">
              {cleanTextContent(featured.title.rendered)}
            </h3>
          </div>
        </Link>

        <div className="flex flex-col gap-3 sm:gap-4">
          {sidePosts.map((post) => (
            <Link
              key={post.id}
              href={`${getPostUrl(post)}`}
              className="group flex items-start gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-20 h-16 xs:w-24 xs:h-18 sm:w-28 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {post.featured_media_url && (
                  <img
                    src={post.featured_media_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-xs font-semibold text-purple-600 uppercase tracking-wider">{getCategoryName(post)}</span>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-purple-700 transition-colors">
                  {cleanTextContent(post.title.rendered)}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!isLast && (
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-10 sm:my-12 lg:my-14" />
      )}
    </section>
  );
}
