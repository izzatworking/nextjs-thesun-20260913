import { getPostUrl } from '../../../lib/wordpress';
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useState, useEffect, useCallback } from 'react';

interface CategoryLayout2Props {
  name: string;
  slug: string;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategoryLayout2({
  name,
  slug,
  posts,
  categories,
  isLast = false
}: CategoryLayout2Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const postsPerView = 5;

  const totalSlides = Math.ceil(Math.min(posts.length, 20) / postsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  if (posts.length === 0) return null;

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const limitedPosts = posts.slice(0, 20);
  const visiblePosts = limitedPosts.slice(
    currentIndex * postsPerView,
    (currentIndex + 1) * postsPerView
  );

  return (
    <div className="relative">
      <div className="flex flex-col xs:flex-row xs:items-end justify-between gap-3 xs:gap-0 mb-4 sm:mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1 sm:w-1.5 h-5 sm:h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full shrink-0" />
            <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase truncate">
              {name}
            </h2>
          </div>
          <p className="hidden xs:block text-gray-500 text-[10px] sm:text-sm mt-0.5 sm:mt-1 ml-3 sm:ml-5">Trending stories & highlights</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-5 md:w-6 h-1.5 md:h-2 bg-orange-500 rounded-full'
                    : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-0.5 sm:gap-1">
            <button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-8 sm:h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              aria-label="Previous"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-8 sm:h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              aria-label="Next"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <Link
            href={`/category/${slug}`}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all active:scale-95 shadow-md"
          >
            <span className="hidden xs:inline">All</span> Stories
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {visiblePosts.map((post, index) => {
            const isFirst = index === 0;
            return (
              <Link
                key={post.id}
                href={`${getPostUrl(post)}`}
                className={`group relative overflow-hidden rounded-lg xs:rounded-xl bg-gray-900 ${
                  isFirst ? 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' : 'col-span-1'
                } ${isFirst ? 'min-h-[300px] xs:min-h-[340px] sm:min-h-[400px] md:min-h-[460px]' : 'min-h-[130px] xs:min-h-[150px] sm:min-h-[190px] md:min-h-[220px]'}`}
              >
                {post.featured_media_url && (
                  <img
                    src={post.featured_media_url}
                    alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent ${isFirst ? 'via-black/30' : 'via-black/20'}`} />

                <div className={`relative flex flex-col justify-end h-full ${isFirst ? 'p-3 xs:p-4 sm:p-5 md:p-6' : 'p-2.5 xs:p-3 sm:p-4'}`}>
                  <div className="flex items-center gap-1.5 xs:gap-2 mb-1 xs:mb-2">
                    <span className="bg-orange-500 text-white text-[9px] xs:text-[10px] sm:text-xs font-bold px-1.5 xs:px-2 sm:px-2.5 py-0.5 xs:py-1 rounded sm:rounded-md uppercase tracking-wider">
                      {getPostCategoryName(post, categories)}
                    </span>
                  </div>

                  <h3
                    className={`font-extrabold text-white leading-tight ${
                      isFirst
                        ? 'text-xs xs:text-sm sm:text-lg md:text-xl lg:text-2xl'
                        : 'text-[10px] xs:text-xs sm:text-sm md:text-base'
                    }`}
                  >
                    {cleanTextContent(post.title.rendered)}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex md:hidden justify-center mt-3 xs:mt-4 sm:mt-5 gap-1 xs:gap-1.5">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-4 xs:w-5 h-1.5 xs:h-2 bg-orange-500 rounded-full'
                : 'w-1.5 xs:w-2 h-1.5 xs:h-2 bg-gray-300 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex sm:hidden justify-center mt-3 xs:mt-4">
        <Link
          href={`/category/${slug}`}
          className="inline-flex items-center gap-1 text-xs xs:text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 px-4 xs:px-5 py-2 xs:py-2.5 rounded-lg xs:rounded-xl hover:from-orange-600 hover:to-red-700 transition-all active:scale-95 shadow-md"
        >
          All Stories
          <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {!isLast && (
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8 xs:my-10 sm:my-12" />
      )}
    </div>
  );
}
