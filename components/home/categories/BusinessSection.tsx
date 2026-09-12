import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface BusinessSectionProps {
  categories: WPCategory[];
  corporatePosts: WPPostWithMedia[];
  globalPosts: WPPostWithMedia[];
  localPosts: WPPostWithMedia[];
  smePosts: WPPostWithMedia[];
}

const categoryBadge: Record<string, { label: string; class: string }> = {
  corporate: { label: 'Corporate', class: 'bg-[#1e40af]/10 text-[#1e40af]' },
  global: { label: 'Global', class: 'bg-[#047857]/10 text-[#047857]' },
  local: { label: 'Local', class: 'bg-[#b45309]/10 text-[#b45309]' },
  sme: { label: 'SMEs', class: 'bg-[#6d28d9]/10 text-[#6d28d9]' },
};

function getCategoryBadge(post: WPPostWithMedia, allCategories: WPCategory[]) {
  const catId = typeof post.categories?.[0] === 'number' ? post.categories[0] : (post.categories?.[0] as any)?.id;
  const cat = allCategories.find(c => c.id === catId);
  const slug = cat?.slug || '';
  if (slug.includes('corporate')) return categoryBadge.corporate;
  if (slug.includes('global')) return categoryBadge.global;
  if (slug.includes('local')) return categoryBadge.local;
  if (slug.includes('sme') || slug.includes('msme')) return categoryBadge.sme;
  return { label: cat?.name || 'Business', class: 'bg-gray-100 text-gray-600' };
}

export default function BusinessSection({ categories, corporatePosts, globalPosts, localPosts, smePosts }: BusinessSectionProps) {
  const allPosts = [...corporatePosts, ...globalPosts, ...localPosts, ...smePosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allPosts.length === 0) return null;

  const featured = allPosts[0];
  const rest = allPosts.slice(1, 5);

  return (
    <div className="mb-10">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-6 bg-[#1e40af] rounded-full" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Business
          </h2>
        </div>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Desktop: 60% content / 40% follow us image */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="lg:col-span-3 min-w-0">
          {featured && (
            <Link href={getPostUrl(featured, categories)} className="group block mb-3 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all">
              <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                {featured.featured_media_url ? (
                  <img
                    src={featured.featured_media_url}
                    alt={cleanTextContent(featured.featured_media_alt || featured.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${getCategoryBadge(featured, categories).class}`}>
                    {getCategoryBadge(featured, categories).label}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatRelativeTime(featured.date)}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#1e40af] transition-colors leading-snug">
                  {cleanTextContent(featured.title.rendered)}
                </h3>
              </div>
            </Link>
          )}

          {/* jarak 1px pada mobile, kecil sahaja pada sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px sm:gap-2">
            {rest.map((post) => {
              const badge = getCategoryBadge(post, categories);
              return (
                <Link key={post.id} href={getPostUrl(post, categories)} className="group flex items-start gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-gray-300 transition-all rounded-lg">
                  {post.featured_media_url && (
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 overflow-hidden rounded">
                      <img
                        src={post.featured_media_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[9px] font-semibold px-1 py-0.5 rounded ${badge.class} mb-1`}>
                      {badge.label}
                    </span>
                    <h4 className="text-xs font-semibold text-gray-900 group-hover:text-[#1e40af] transition-colors leading-snug line-clamp-2">
                      {cleanTextContent(post.title.rendered)}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      {formatRelativeTime(post.date)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 40% — Follow Us on Social Media (image) */}
        <div className="lg:col-span-2 min-w-0">
          <Link href="/follow-us" className="block relative overflow-hidden rounded-xl h-full min-h-[240px] bg-gray-100 group">
            <img
              src="/images/follow-us.png"
              alt="Follow Us on Social Media"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}