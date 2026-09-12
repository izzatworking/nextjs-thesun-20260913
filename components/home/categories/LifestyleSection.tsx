// components/home/categories/LifestyleSection.tsx
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import { getPostUrl } from '../../../lib/wordpress';

interface LifestyleSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function LifestyleSection({ posts, categories, isLast = false }: LifestyleSectionProps) {
  if (posts.length === 0) return null;

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const featured = posts[0];
  const smallPosts = posts.slice(1, 5);

  return (
    <section className="relative overflow-hidden rounded-3xl py-6 px-4 lg:px-8 my-8"
      style={{
        background: 'linear-gradient(180deg, #BEF8DA 0%, #BEF8DA 40%, #ffffff 100%)'
      }}
    >
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-400/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-green-300/25 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shrink-0" />

            <h2 className="text-xl sm:text-4xl font-black text-emerald-900 tracking-tight drop-shadow-lg">
              Lifestyle
            </h2>
            <span className="text-emerald-700/40 text-lg hidden sm:inline">—</span>
            <p className="text-emerald-800/60 text-sm hidden sm:block">Curated stories for the modern lifestyle</p>
          </div>
          <Link
            href="/category/lifestyle"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Kiri 2/4 (gambar kecil) + kanan 2/4 (2 row x 2 story) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Kiri — featured story, gambar kecilkan height & width */}
          <div className="lg:col-span-2 min-w-0">
            <Link href={getPostUrl(featured)} className="group block bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300 h-full">
              <div className="h-48 sm:h-52 lg:h-56 relative overflow-hidden bg-gray-100">
                {featured.featured_media_url && (
                  <img
                    src={featured.featured_media_url}
                    alt={cleanTextContent(featured.featured_media_alt || featured.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {getPostCategoryName(featured, categories)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(featured.date)}
                  </span>
                </div>
                <h3
                  className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: cleanTextContent(featured.title.rendered) }}
                />
                {featured.excerpt?.rendered && (
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mt-2">
                    {cleanTextContent(featured.excerpt.rendered)}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Kanan — 2 row x 2 story (4 kad dalam container), sentiasa 2 kolum */}
          <div className="lg:col-span-2 min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {smallPosts.map((post) => (
                <Link key={post.id} href={getPostUrl(post)} className="group block bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="h-32 sm:h-36 relative overflow-hidden bg-gray-100">
                    {post.featured_media_url && (
                      <img
                        src={post.featured_media_url}
                        alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-medium inline-block mb-1.5">
                      {getPostCategoryName(post, categories)}
                    </span>
                    <h4
                      className="font-bold text-gray-900 text-sm group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }}
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {formatRelativeTime(post.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isLast && <div className="border-t border-emerald-300/30 mt-6"></div>}
    </section>
  );
}