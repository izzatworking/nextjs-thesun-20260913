import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../types/wordpress';
import { cleanTextContent } from './utils/contentCleaner';
import { formatRelativeTime } from './utils/timeFormatter';
import { getPostUrl } from '../../lib/wordpress';

interface LatestNewsProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
}

export default function LatestNews({ posts, categories }: LatestNewsProps) {
  const getPostCategoryName = (post: WPPostWithMedia): string => {
    if (!post.categories || post.categories.length === 0 || !post.categories[0]) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const latestPosts = posts.slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Latest</h2>
        </div>
        <Link href="/latest-news" className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all duration-200">
          View all
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {latestPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No latest news available</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-400 via-red-200 to-gray-100" />

          <div className="space-y-5">
            {latestPosts.map((post) => (
              <article key={post.id} className="group relative pl-7">
                <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-white border-2 border-red-500 z-10 group-hover:scale-125 transition-transform duration-300" />

                <Link href={getPostUrl(post)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">
                      {getPostCategoryName(post)}
                    </span>
                    <span className="text-gray-300 text-[6px]">|</span>
                    <span className="text-gray-400 text-xs">{formatRelativeTime(post.date)}</span>
                  </div>
                  <h4
                    className="text-base font-semibold text-gray-800 group-hover:text-red-600 transition-colors leading-snug"
                    dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }}
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
