import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import NetworkImage from '@/components/common/NetworkImage';
import { getTopStories } from '@/lib/queries';
import { WPCategory } from '@/types/wordpress';
import { getCategories } from '@/lib/wordpress';

interface TopStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories?: {
    nodes: { slug: string; name: string }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}

interface TopStoriesPageProps {
  articles: TopStory[];
  categories: WPCategory[];
}

function cleanText(text: string) {
  return text ? text.replace(/<[^>]*>/g, '') : '';
}

function getPostPath(article: TopStory): string {
  const catSlug = article.categories?.nodes?.[0]?.slug;
  if (catSlug) {
    return `/${catSlug}/${article.slug}`;
  }
  return `/posts/${article.slug}`;
}

function TopStoriesPageInner({ articles, categories }: TopStoriesPageProps) {
  if (articles.length === 0) {
    return (
      <Layout categories={categories} title="Top Stories | The Sun Malaysia" description="">
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-gray-400">No top stories found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      categories={categories}
      title="Top Stories | The Sun Malaysia"
      description="Most popular and trending stories on The Sun Malaysia"
    >
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 max-w-7xl py-10 md:py-16">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-5 bg-red-600 rounded-full" />
              <span className="text-xs font-semibold text-red-600 uppercase tracking-[0.15em]">Rankings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Top Stories</h1>
          </div>

          {/* Featured: #1 - horizontal split */}
          <div className="mb-12">
            <Link
              href={getPostPath(articles[0])}
              className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row-reverse">
                {/* Image right */}
                <div className="md:w-[55%] aspect-[4/3] md:aspect-auto md:min-h-[400px] relative bg-gray-50">
                  {articles[0].featuredImage?.node?.sourceUrl ? (
                    <NetworkImage
                      src={articles[0].featuredImage.node.sourceUrl}
                      alt={articles[0].featuredImage.node.altText || cleanText(articles[0].title)}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-200 text-6xl font-bold">1</span>
                    </div>
                  )}
                </div>
                {/* Content left */}
                <div className="md:w-[45%] p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">1</span>
                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Top Story</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {articles[0].categories?.nodes?.[0]?.name && (
                      <>
                        <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">{articles[0].categories.nodes[0].name}</span>
                        <span className="text-gray-300 text-[11px]">·</span>
                      </>
                    )}
                    <span className="text-gray-400 text-[11px]">{new Date(articles[0].date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                    {cleanText(articles[0].title)}
                  </h2>
                  {articles[0].excerpt && (
                    <p className="text-gray-500 text-sm mt-4 leading-relaxed line-clamp-3">
                      {cleanText(articles[0].excerpt)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Grid: #2 - #15 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {articles.slice(1).map((article, index) => (
              <Link
                key={article.id}
                href={getPostPath(article)}
                className="group block"
              >
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 mb-3">
                  {article.featuredImage?.node?.sourceUrl ? (
                    <NetworkImage
                      src={article.featuredImage.node.sourceUrl}
                      alt={article.featuredImage.node.altText || cleanText(article.title)}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-200 text-4xl font-bold">{index + 2}</span>
                    </div>
                  )}
                  {article.categories?.nodes?.[0]?.name && (
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-white uppercase tracking-wider bg-black/50 px-2 py-0.5 rounded">{article.categories.nodes[0].name}</span>
                  )}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold text-gray-700">{index + 2}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-gray-400 text-[11px]">{new Date(article.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {cleanText(article.title)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function TopStoriesPage() {
  const [data, setData] = useState<TopStoriesPageProps | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [articles, categories] = await Promise.all([
          getTopStories(),
          getCategories(),
        ]);

        const result: TopStoriesPageProps = {
          articles: (articles || []).slice(0, 15),
          categories: categories || [],
        };
        if (active) setData(result);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return <TopStoriesPageInner {...data} />;
}
