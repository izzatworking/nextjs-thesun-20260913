import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface GoingViralSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function GoingViralSection({ posts, categories, isLast = false }: GoingViralSectionProps) {
  if (posts.length === 0) return null;

  const firstPost = posts[0];
  let sectionName = 'Going Viral';
  let sectionSlug = 'viral';

  if (firstPost.categories && firstPost.categories.length > 0) {
    const categoryId = typeof firstPost.categories[0] === 'number'
      ? firstPost.categories[0]
      : (firstPost.categories[0] as any).id;

    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      sectionName = cleanTextContent(category.name);
      sectionSlug = category.slug;
    }
  }

  const main = posts[0];
  const rest = posts.slice(1, 7);

  return (
    <div className="relative bg-gradient-to-b from-[#3b82f6] via-[#60a5fa] to-[#93c5fd] w-screen left-1/2 -translate-x-1/2 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="flex items-center gap-4 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-white/60 rounded-full" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {sectionName}
            </h2>
          </div>
          <div className="flex-1 h-px bg-white/20" />
          <Link
            href={`/category/${sectionSlug}`}
            className="text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            View all
          </Link>
        </div>

        {main && (
          <Link href={getPostUrl(main)} className="group block mb-10 sm:mb-14">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-3 bg-gray-100 overflow-hidden">
                  <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                    {main.featured_media_url ? (
                      <img
                        src={main.featured_media_url}
                        alt={cleanTextContent(main.featured_media_alt || main.title.rendered)}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="text-[11px] font-semibold text-[#3b82f6] uppercase tracking-wider mb-2">
                    {sectionName}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-[#3b82f6] transition-colors leading-tight mb-3">
                    {cleanTextContent(main.title.rendered)}
                  </h3>
                  {main.excerpt?.rendered && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                      {cleanTextContent(main.excerpt.rendered)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{formatRelativeTime(main.date)}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs font-medium text-[#3b82f6] group-hover:gap-2 transition-all inline-flex items-center gap-1">
                      Read full story
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rest.slice(0, 6).map((post) => (
            <Link key={post.id} href={getPostUrl(post)} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                  {post.featured_media_url ? (
                    <img
                      src={post.featured_media_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <span className="text-[10px] font-semibold text-[#3b82f6] uppercase tracking-wider mb-1.5">
                    {sectionName}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#3b82f6] transition-colors leading-snug line-clamp-2 flex-1">
                    {cleanTextContent(post.title.rendered)}
                  </h4>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    {formatRelativeTime(post.date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 sm:mt-14">
          <Link
            href={`/category/${sectionSlug}`}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 px-6 sm:px-8 py-3 sm:py-3.5 rounded-sm font-medium text-sm sm:text-base transition-all duration-300 group"
          >
            More from {sectionName}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {!isLast && (
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  );
}
