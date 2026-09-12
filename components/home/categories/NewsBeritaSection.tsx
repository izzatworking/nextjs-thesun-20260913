import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface NewsBeritaSectionProps {
  newsPosts: WPPostWithMedia[];
  beritaPosts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function NewsBeritaSection({ newsPosts, beritaPosts, categories, isLast = false }: NewsBeritaSectionProps) {
  const newsCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('news') ||
    cat.name.toLowerCase().includes('news')
  );
  const beritaCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('berita') ||
    cat.name.toLowerCase().includes('berita')
  );

  const columns = [
    {
      name: newsCategory?.name || 'News',
      slug: newsCategory?.slug || 'news',
      posts: newsPosts.slice(0, 2),
      accent: 'bg-red-600',
    },
    {
      name: beritaCategory?.name || 'Berita',
      slug: beritaCategory?.slug || 'berita',
      posts: beritaPosts.slice(0, 2),
      accent: 'bg-blue-600',
    },
  ];

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
          News &amp; Berita
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {columns.map((col) => (
          <div key={col.slug} className="min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-5 rounded-full ${col.accent}`} />
                <Link href={`/category/${col.slug}`}>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight hover:text-red-600 transition-colors">
                    {col.name}
                  </h3>
                </Link>
              </div>
              <Link
                href={`/category/${col.slug}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                View all
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="space-y-4">
              {col.posts.map((post) => {
                const catId = typeof post.categories?.[0] === 'number' ? post.categories[0] : (post.categories?.[0] as any)?.id;
                const catName = catId ? cleanTextContent(categories.find(c => c.id === catId)?.name || '') : '';
                return (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="group flex items-start gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <div className="flex-shrink-0 w-28 h-20 sm:w-36 sm:h-24 bg-gray-100 overflow-hidden rounded-lg">
                      {post.featured_media_url ? (
                        <img
                          src={post.featured_media_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        {catName && (
                          <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider whitespace-nowrap">{catName}</span>
                        )}
                        <span className="text-[10px] text-gray-300">|</span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatRelativeTime(post.date)}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm leading-snug">
                        {cleanTextContent(post.title.rendered)}
                      </h4>
                      {post.excerpt?.rendered && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {cleanTextContent(post.excerpt.rendered).substring(0, 100)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!isLast && <div className="border-t border-gray-300 my-12" />}
    </div>
  );
}