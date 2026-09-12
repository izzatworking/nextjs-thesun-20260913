import { getPostUrl } from '../../../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface CombinedSectionProps {
  motoringPosts: WPPostWithMedia[];
  educationPosts: WPPostWithMedia[];
  peopleIssuesPosts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CombinedSection({
  motoringPosts,
  educationPosts,
  peopleIssuesPosts,
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
  const peopleIssuesCategory = categories.find((cat: WPCategory) =>
    cat.slug.toLowerCase().includes('people') ||
    cat.name.toLowerCase().includes('people') ||
    cat.slug.toLowerCase().includes('issues')
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
    {
      name: peopleIssuesCategory?.name || 'People & Issues',
      slug: peopleIssuesCategory?.slug || 'people-issues',
      posts: peopleIssuesPosts,
    },
  ];

  const allCategories = categories
    .filter((cat) => cat.parent === 0 && cat.name && cat.slug)
    .slice(0, 30)
    .map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));

  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
          Latest Updates
        </h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* 60% - Motoring / Education / People & Issues */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 min-w-0 sm:gap-8">
          {columns.map((col) => {
            const featured = col.posts[0];
            const list = col.posts.slice(1, 4);
            return (
              <div key={col.slug} className="min-w-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-0.5 h-5 bg-gray-900" />
                  <Link href={`/category/${col.slug}`}>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight hover:text-red-600 transition-colors xl:text-3xl">
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
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
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

        {/* 40% - Browse Categories */}
        <div className="lg:col-span-2 min-w-0 flex">
          <aside className="relative w-full h-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#CB3534] via-[#a91f2a] to-[#8E0320] shadow-[0_28px_70px_-35px_rgba(142,3,32,0.85)] flex flex-col">
            {/* Top green → red hairline */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005321] via-[#CB3534] to-transparent" />

            {/* Decorative arcs */}
            <svg className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 text-[#8E0320]/60" viewBox="0 0 100 100" fill="none">
              <circle cx="90" cy="10" r="60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeDasharray="160 240" />
            </svg>
            <svg className="pointer-events-none absolute -bottom-14 -left-12 h-52 w-52 text-white/5" viewBox="0 0 100 100" fill="none">
              <circle cx="10" cy="90" r="60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="110 270" />
            </svg>

            {/* Gradient blobs */}
            <div className="pointer-events-none absolute -top-16 left-1/3 h-56 w-56 rounded-full bg-[#8E0320]/50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#005321]/15 blur-3xl" />

            <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-9">
              {/* Overline */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-0.5 w-8 bg-[#005321]" />
                <span className="h-0.5 w-8 bg-[#005321]/50" />
                <p className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.25em]">
                  Explore More
                </p>
              </div>

              {/* Heading */}
              <h3 className="text-4xl font-black leading-none text-white xl:text-5xl">
                Browse
                <span className="block text-white/90">Categories</span>
              </h3>

              <p className="mt-4 mb-8 text-sm leading-relaxed text-white/70">
                Discover in-depth coverage across every section of The Sun.
              </p>

              {/* All categories — 2 per row */}
              <ul className="grid grid-cols-2 gap-3">
                {allCategories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group/cat flex h-full items-center justify-center rounded-xl border border-white/20 bg-white/[0.07] px-2 py-3.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EEB3B5] hover:border-transparent hover:shadow-lg hover:shadow-black/10"
                    >
                      <span className="truncate text-xs font-semibold text-white transition-colors duration-300 group-hover/cat:text-[#8E0320]">
                        {cat.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {!isLast && <div className="border-t border-gray-300 my-12" />}
    </div>
  );
}