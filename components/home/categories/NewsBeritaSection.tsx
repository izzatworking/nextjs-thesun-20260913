import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface NewsBeritaSectionProps {
  beritaPosts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function NewsBeritaSection({ beritaPosts, categories, isLast = false }: NewsBeritaSectionProps) {
  const beritaCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('berita') ||
    cat.name.toLowerCase().includes('berita')
  );

  const name = cleanTextContent(beritaCategory?.name || 'Berita');
  const slug = beritaCategory?.slug || 'berita';
  const posts = beritaPosts.slice(0, 4);

  if (posts.length === 0) return null;

  const getCategoryName = (post: WPPostWithMedia): string => {
    const catId = typeof post.categories?.[0] === 'number' ? post.categories[0] : (post.categories?.[0] as any)?.id;
    return catId ? cleanTextContent(categories.find((c) => c.id === catId)?.name || '') : '';
  };

  return (
    <div className="mb-16">
      {/* Section header — accent bar + title, no container */}
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-7 w-1.5 shrink-0 rounded-full bg-[#e30613]" />
          <h2 className="min-w-0 truncate text-2xl font-black uppercase tracking-tight text-gray-900 sm:text-3xl">
            {name}
          </h2>
        </div>
        <Link
          href={`/${slug}`}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#e30613] transition-colors hover:text-[#9f0710]"
        >
          View all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* 4 stories — mobile/tablet 2 per row, desktop 4 across */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {posts.map((post) => {
          const catName = getCategoryName(post);
          return (
            <Link key={post.id} href={getPostUrl(post)} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 mb-3">
                {post.featured_media_url ? (
                  <img
                    src={post.featured_media_url}
                    alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {catName && (
                  <span className="absolute top-2 left-2 rounded bg-[#e30613] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    {catName}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#e30613] transition-colors leading-snug line-clamp-2">
                {cleanTextContent(post.title.rendered)}
              </h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="h-1 w-1 rounded-full bg-[#e30613]" />
                {formatRelativeTime(post.date)}
              </div>
            </Link>
          );
        })}
      </div>

      {!isLast && <div className="border-t border-gray-300 my-12" />}
    </div>
  );
}
