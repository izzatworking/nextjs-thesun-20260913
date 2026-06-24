import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopStories } from '@/lib/queries';

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

function getPostPath(article: TopStory): string {
  const catSlug = article.categories?.nodes?.[0]?.slug;
  if (catSlug) {
    return `/${catSlug}/${article.slug}`;
  }
  return `/posts/${article.slug}`;
}

export default function FloatingTopStories() {
  const [articles, setArticles] = useState<TopStory[]>([]);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getTopStories();
        setArticles(data.slice(0, 3));
      } catch (e) {
        console.error('Failed to load top stories:', e);
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible || dismissed || articles.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 z-40 w-72 animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-bold text-gray-900 tracking-wide">Most Views</span>
          </div>
          <Link
            href="/topstories"
            className="text-[10px] font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            View more
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="ml-1.5 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {articles.map((article, index) => {
            const cleanTitle = article.title
              ? article.title.replace(/<[^>]*>/g, '')
              : '';
            return (
              <Link
                key={article.id}
                href={getPostPath(article)}
                className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors group"
              >
                <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <span className={`text-xs font-bold ${index === 0 ? 'text-orange-500' : 'text-gray-300'}`}>{index + 1}</span>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {article.categories?.nodes?.[0]?.name && (
                      <span className="text-[9px] font-semibold text-red-500 uppercase tracking-wider">{article.categories.nodes[0].name}</span>
                    )}
                    <span className="text-[9px] text-gray-300">·</span>
                    <span className="text-[9px] text-gray-400">{new Date(article.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <h3 className="text-xs font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {cleanTitle}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
