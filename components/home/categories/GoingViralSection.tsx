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

  const sectionName = 'Going Viral';
  const sectionSlug = 'going-viral';

  const gridPosts = posts.slice(0, 4);

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  return (
    <section className="relative overflow-hidden rounded-3xl py-6 px-4 lg:px-8 my-8"
      style={{
        background: 'linear-gradient(180deg, #BAD8FD 0%, #BAD8FD 40%, #ffffff 100%)'
      }}
    >
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-300/25 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shrink-0" />
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 tracking-tight">
              {sectionName}
            </h2>
            <span className="text-white/60 text-lg hidden sm:inline">—</span>
            <p className="text-blue-900 text-sm hidden sm:block">The stories everyone is talking about</p>
          </div>
          <Link
            href={`/category/${sectionSlug}`}
            className="text-sm font-semibold text-blue-900 hover:text-blue-700 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 1 Row - 4 Articles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {gridPosts.map((post) => (
            <Link key={post.id} href={getPostUrl(post)} className="group">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                {post.featured_media_url && (
                  <div className="w-full h-48 relative overflow-hidden">
                    <img
                      src={post.featured_media_url}
                      alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {getPostCategoryName(post, categories)}
                    </span>
                  </div>
                  <h4
                    className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 flex-1"
                    dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }}
                  />
                  <span className="text-xs text-gray-400 mt-3 block">
                    {formatRelativeTime(post.date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!isLast && <div className="border-t border-blue-300/30 mt-6"></div>}
    </section>
  );
}
