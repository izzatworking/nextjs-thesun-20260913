import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface CombinedSectionProps {
  motoringPosts: WPPostWithMedia[];
  educationPosts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CombinedSection({
  motoringPosts,
  educationPosts,
  categories,
  isLast = false
}: CombinedSectionProps) {
  const motoringCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('motoring') ||
    cat.name.toLowerCase().includes('motoring')
  );
  const educationCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('education') ||
    cat.name.toLowerCase().includes('education')
  );

  const columns = [
    {
      name: motoringCategory?.name || 'Motoring',
      slug: motoringCategory?.slug || 'motoring',
      posts: motoringPosts,
    },
    {
      name: educationCategory?.name || 'Education',
      slug: educationCategory?.slug || 'education',
      posts: educationPosts,
    },
  ];

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
          Latest Updates
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {columns.map((col) => {
          const featured = col.posts[0];
          const list = col.posts.slice(1, 4);
          return (
            <div key={col.slug} className="min-w-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-0.5 h-5 bg-gray-900" />
                <Link href={`/category/${col.slug}`}>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] hover:text-red-600 transition-colors">
                    {col.name}
                  </h3>
                </Link>
              </div>

              {featured && (
                <Link href={getPostUrl(featured)} className="group block mb-6">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden mb-4 rounded">
                    {featured.featured_media_url ? (
                      <img
                        src={featured.featured_media_url}
                        alt={cleanTextContent(featured.featured_media_alt || featured.title.rendered)}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                      {formatRelativeTime(featured.date)}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                      {cleanTextContent(featured.title.rendered)}
                    </h4>
                    {featured.excerpt?.rendered && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {cleanTextContent(featured.excerpt.rendered)}
                      </p>
                    )}
                  </div>
                </Link>
              )}

              <div className="space-y-0">
                {list.map((post, i) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="group flex items-start gap-4 py-3.5 border-t border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <span className="text-xs font-mono text-gray-300 tabular-nums mt-0.5 w-4 flex-shrink-0">
                      {String(i + 2).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                        {cleanTextContent(post.title.rendered)}
                      </h5>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        {formatRelativeTime(post.date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <Link
                  href={`/category/${col.slug}`}
                  className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-red-600 transition-colors gap-1.5 group/link"
                >
                  View all {col.name} stories
                  <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {!isLast && <div className="border-t border-gray-300 my-12" />}
    </div>
  );
}
