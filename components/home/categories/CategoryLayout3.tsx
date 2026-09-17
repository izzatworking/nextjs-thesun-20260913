import { getPostUrl } from '../../../lib/wordpress';
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';

interface CategoryLayout3Props {
  name: string;
  slug: string;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategoryLayout3({
  name,
  slug,
  posts,
  categories,
  isLast = false
}: CategoryLayout3Props) {
  if (posts.length === 0) return null;

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const gridPosts = posts.slice(3, 7);

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
              {name}
            </h2>
            <span className="text-emerald-700/40 text-lg hidden sm:inline">—</span>
            <p className="text-emerald-800/60 text-sm hidden sm:block">Curated stories for the modern lifestyle</p>
          </div>
          <Link
            href={`/${slug}`}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Magazine Layout with glassmorphism cards */}
        <div>
          {/* Featured + Secondary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300">
                {featuredPost.featured_media_url && (
                  <div className="w-full h-64 relative overflow-hidden">
                    <img
                      src={featuredPost.featured_media_url}
                      alt={cleanTextContent(featuredPost.featured_media_alt || featuredPost.title.rendered)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">{getPostCategoryName(featuredPost, categories)}</span>
                  </div>

                  <Link href={`${getPostUrl(featuredPost)}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors cursor-pointer" dangerouslySetInnerHTML={{ __html: cleanTextContent(featuredPost.title.rendered) }} />
                  </Link>


                </div>
              </div>
            </div>

            {/* Secondary Articles - 2 cols on mobile/tablet, stacked on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-0 lg:space-y-4">
              {secondaryPosts.map((post) => (
                <div key={post.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group">
                  {post.featured_media_url && (
                    <div className="w-full h-28 lg:h-36 relative overflow-hidden">
                      <img src={post.featured_media_url} alt={cleanTextContent(post.featured_media_alt || post.title.rendered)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">{getPostCategoryName(post, categories)}</span>
                    </div>
                    <Link href={`${getPostUrl(post)}`}>
                      <h4 className="font-semibold text-gray-900 text-xs hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2" dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Row */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {gridPosts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group">
                {post.featured_media_url && (
                  <div className="w-full h-32 relative overflow-hidden">
                    <img src={post.featured_media_url} alt={cleanTextContent(post.featured_media_alt || post.title.rendered)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">{getPostCategoryName(post, categories)}</span>
                  </div>
                  <Link href={`${getPostUrl(post)}`}>
                    <h4 className="font-semibold text-gray-900 text-xs hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2" dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isLast && <div className="border-t border-emerald-300/30 mt-6"></div>}
    </section>
  );
}
