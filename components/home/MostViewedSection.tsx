import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { getPostUrl } from '../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../types/wordpress';
import { cleanHtmlContent } from './utils/contentCleaner';

interface MostViewedSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
}

export default function MostViewedSection({ posts, categories }: MostViewedSectionProps) {
  if (!posts || posts.length === 0) return null;

  const getCategoryName = (post: WPPostWithMedia): string => {
    const catId =
      typeof post.categories?.[0] === 'number'
        ? post.categories[0]
        : (post.categories?.[0] as any)?.id;
    const name = catId ? categories.find((c) => c.id === catId)?.name : '';
    return cleanHtmlContent(name || '');
  };

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });

  const featured = posts[0];
  const rest = posts.slice(1, 6);

  return (
    <div className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1 h-6 bg-red-600 rounded-full shrink-0" />
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Most Viewed
          </h2>
          <span className="hidden sm:block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em] self-end mb-1 shrink-0">
            / topstories
          </span>
        </div>
        <Link
          href="/topstories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors shrink-0"
        >
          View all
          <FiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Featured #1 */}
      <Link
        href={getPostUrl(featured, categories)}
        className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8"
      >
        <div className="flex flex-col md:flex-row-reverse">
          {/* Image right */}
          <div className="md:w-[55%] aspect-[16/10] md:aspect-auto md:min-h-[380px] relative bg-gray-50 overflow-hidden">
            {featured.featured_media_url ? (
              <img
                src={featured.featured_media_url}
                alt={featured.featured_media_alt || cleanHtmlContent(featured.title.rendered)}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-200 text-7xl font-black">1</span>
              </div>
            )}
          </div>
          {/* Content left */}
          <div className="md:w-[45%] p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e30613] to-[#9f0710] text-base font-black text-white shadow-lg shadow-red-600/25">
                1
              </span>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Top Story</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getCategoryName(featured) && (
                <>
                  <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">
                    {getCategoryName(featured)}
                  </span>
                  <span className="text-gray-300 text-[11px]">·</span>
                </>
              )}
              <span className="text-[11px] text-gray-400">{formatDate(featured.date)}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
              {cleanHtmlContent(featured.title.rendered)}
            </h3>
            {featured.excerpt?.rendered && (
              <p className="text-sm text-gray-500 mt-4 leading-relaxed line-clamp-3">
                {cleanHtmlContent(featured.excerpt.rendered)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Grid #2 - #6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {rest.map((post, index) => {
          const rank = index + 2;
          return (
            <Link key={post.id} href={getPostUrl(post, categories)} className="group block">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 mb-3">
                {post.featured_media_url ? (
                  <img
                    src={post.featured_media_url}
                    alt={post.featured_media_alt || cleanHtmlContent(post.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-200 text-4xl font-black">{rank}</span>
                  </div>
                )}
                {getCategoryName(post) && (
                  <span className="absolute top-3 left-3 text-[10px] font-semibold text-white uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded">
                    {getCategoryName(post)}
                  </span>
                )}
                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                  <span className="text-xs font-black text-[#e30613]">{rank}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] text-gray-400">
                  {new Date(post.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                {cleanHtmlContent(post.title.rendered)}
              </h4>
            </Link>
          );
        })}
      </div>
    </div>
  );
}