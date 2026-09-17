'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopStories } from '@/lib/queries';
import { categoryPathFromSlugs } from '@/lib/wordpress';

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
  const catSlugs = (article.categories?.nodes || []).map(node => node.slug);
  const path = categoryPathFromSlugs(catSlugs);
  if (path) {
    return `/${path}/${article.slug}`;
  }
  return `/posts/${article.slug}`;
}

export default function MostViewsSidebar() {
  const [articles, setArticles] = useState<TopStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getTopStories();
        setArticles(data.slice(0, 5));
      } catch (e) {
        console.error('Failed to load most views:', e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 bg-gray-100 rounded animate-pulse shrink-0" />
              <div className="flex-1 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Most Viewed</h3>
        </div>
        <Link
          href="/topstories"
          className="text-[10px] font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {articles.map((article, index) => {
          const cleanTitle = article.title
            ? article.title.replace(/<[^>]*>/g, '')
            : '';
          return (
            <Link
              key={article.id}
              href={getPostPath(article)}
              className="flex items-start gap-3 group"
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                <span className={`text-xs font-bold ${index === 0 ? 'text-orange-500' : 'text-gray-300'}`}>{index + 1}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {article.categories?.nodes?.[0]?.name && (
                    <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">{article.categories.nodes[0].name}</span>
                  )}
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{new Date(article.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {cleanTitle}
                </h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
