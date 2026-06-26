import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getPosts, getCategories, getPostUrl, setCategoryCache } from '../lib/wordpress';
import { WPPostWithMedia, WPCategory } from '../types/wordpress';
import Layout from '../components/layout/Layout';
import { cleanTextContent } from '../components/home/utils/contentCleaner';
import { formatRelativeTime } from '../components/home/utils/timeFormatter';

interface LatestNewsPageProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
}

export default function LatestNewsPage({ posts, categories }: LatestNewsPageProps) {
  const currentPosts = posts.slice(0, 10);

  const getPostCategoryName = (post: WPPostWithMedia): string => {
    if (!post.categories || post.categories.length === 0 || !post.categories[0]) return 'Uncategorized';
    const categoryId = typeof post.categories[0] === 'number'
      ? post.categories[0]
      : (post.categories[0] as any).id;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  return (
    <Layout
      title="Latest News | The Sun Malaysia"
      description="Latest breaking news from The Sun Malaysia"
      categories={categories}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-red-600 text-xs font-semibold uppercase tracking-[0.15em]">Live Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Latest News</h1>
          <p className="text-gray-400 text-sm mt-1">Stay up to date with the latest stories from The Sun</p>
        </div>

        <div className="relative">
          <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-red-500 via-red-300 to-gray-200" />

          <div className="space-y-8">
            {currentPosts.map((post, index) => (
              <article key={post.id} className="group relative pl-10 sm:pl-14">
                <div className="absolute left-[7px] sm:left-[11px] top-1.5 w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] rounded-full bg-white border-[3px] border-red-500 z-10 group-hover:scale-125 transition-transform duration-300 shadow-sm" />

                <Link href={getPostUrl(post, categories)} className="flex gap-4 sm:gap-6">
                  <div className="w-28 h-20 sm:w-40 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {post.featured_media_url ? (
                      <img
                        src={post.featured_media_url}
                        alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-red-600 text-[11px] font-semibold uppercase tracking-wide">
                        {getPostCategoryName(post)}
                      </span>
                      <span className="text-gray-300 text-[8px]">|</span>
                      <span className="text-gray-400 text-xs">{formatRelativeTime(post.date)}</span>
                    </div>
                    <h2
                      className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug"
                      dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }}
                    />
                    {post.excerpt?.rendered && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2 hidden sm:block">
                        {cleanTextContent(post.excerpt.rendered)}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const categories = await getCategories();
  setCategoryCache(categories);
  const posts = await getPosts(20);

  return {
    props: {
      posts,
      categories,
    },
  };
};
