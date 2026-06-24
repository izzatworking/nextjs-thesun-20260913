'use client';

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

export default function TopStories() {
  const [articles, setArticles] = useState<TopStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getTopStories();
        setArticles(data.slice(0, 5));
      } catch (e) {
        console.error('Failed to load top stories:', e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
        </div>
        <div className="p-5 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 bg-gray-100 rounded-lg animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h2 className="text-base font-bold text-gray-900 tracking-wide">Top Stories</h2>
        </div>
        <Link
          href="/topstories"
          className="text-[11px] font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          View all
        </Link>
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
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                index === 0
                  ? 'bg-red-600 text-white'
                  : index === 1
                  ? 'bg-gray-800 text-white'
                  : index === 2
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {article.categories?.nodes?.[0]?.name && (
                    <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">{article.categories.nodes[0].name}</span>
                  )}
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{new Date(article.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {cleanTitle}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
