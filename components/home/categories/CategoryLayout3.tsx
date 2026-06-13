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
    <section className="relative overflow-hidden rounded-3xl py-12 px-4 lg:px-8 my-12"
      style={{
        background: 'linear-gradient(180deg, #83F2B9 0%, #83F2B9 40%, #ffffff 100%)'
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-400/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-green-300/25 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      {/* Floating elements for Gen Z vibe */}
      <div className="absolute top-8 left-12 text-emerald-700/30 text-2xl">✦</div>
      <div className="absolute bottom-8 right-16 text-emerald-700/30 text-2xl">✦</div>
      <div className="absolute top-20 right-32 text-emerald-700/20 text-xl">♥</div>
      <div className="absolute bottom-16 left-20 text-emerald-700/20 text-xl">♥</div>
      <div className="absolute top-1/3 left-1/4 text-teal-600/40 text-3xl">✦</div>
      <div className="absolute bottom-1/3 right-1/4 text-teal-600/35 text-2xl">✦</div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            <span className="text-emerald-900 font-semibold uppercase tracking-widest text-sm">Your Daily Dose of Chill</span>
          </div>
          <h2 className="text-5xl font-black text-emerald-900 mb-2 tracking-tight drop-shadow-lg">
            {name}
          </h2>
          <p className="text-emerald-800/80 text-lg font-medium">Curated stories for the modern lifestyle — fashion, wellness, and beyond</p>
          <div className="w-32 h-1.5 bg-emerald-400/60 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Magazine Layout with glassmorphism cards */}
        <div className="mb-16">
          {/* Featured + Secondary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Featured Article */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300">
                {featuredPost.featured_media_url && (
                  <div className="w-full h-96 relative overflow-hidden">
                    <img
                      src={featuredPost.featured_media_url}
                      alt={cleanTextContent(featuredPost.featured_media_alt || featuredPost.title.rendered)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">{getPostCategoryName(featuredPost, categories)}</span>
                  </div>

                  <Link href={`${getPostUrl(featuredPost)}`}>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 hover:text-emerald-600 transition-colors cursor-pointer" dangerouslySetInnerHTML={{ __html: cleanTextContent(featuredPost.title.rendered) }} />
                  </Link>

                  {featuredPost.excerpt?.rendered && (
                    <div className="text-gray-600 text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: cleanTextContent(featuredPost.excerpt.rendered) }} />
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Articles */}
            <div className="space-y-6">
              {secondaryPosts.map((post) => (
                <div key={post.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group">
                  {post.featured_media_url && (
                    <div className="w-full h-48 relative overflow-hidden">
                      <img src={post.featured_media_url} alt={cleanTextContent(post.featured_media_alt || post.title.rendered)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">{getPostCategoryName(post, categories)}</span>
                    </div>
                    <Link href={`${getPostUrl(post)}`}>
                      <h4 className="font-semibold text-gray-900 text-sm hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2" dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridPosts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/50 hover:shadow-xl transition-all duration-300 group">
                {post.featured_media_url && (
                  <div className="w-full h-40 relative overflow-hidden">
                    <img src={post.featured_media_url} alt={cleanTextContent(post.featured_media_alt || post.title.rendered)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">{getPostCategoryName(post, categories)}</span>
                  </div>
                  <Link href={`${getPostUrl(post)}`}>
                    <h4 className="font-semibold text-gray-900 text-sm hover:text-emerald-600 transition-colors cursor-pointer line-clamp-2" dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link href={`/category/${slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-400/80">
              <span>Explore More {name}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {!isLast && <div className="border-t border-emerald-300/30 my-12"></div>}
    </section>
  );
}
