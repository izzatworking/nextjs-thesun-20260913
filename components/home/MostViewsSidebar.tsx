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
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
          <span className="w-1 h-4 bg-gray-200 rounded-full" />
          <div className="h-3.5 bg-gray-100 rounded w-24 animate-pulse" />
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <div className="w-7 h-7 bg-gray-100 rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-3.5 bg-gray-100 rounded w-2/3 animate-pulse" />
              </div>
              <div className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 bg-red-600 rounded-full" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Most Viewed</h3>
        </div>
        <Link
          href="/topstories"
          className="text-[10px] font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Ranked list */}
      <div className="divide-y divide-gray-100">
        {articles.map((article, index) => {
          const cleanTitle = article.title
            ? article.title.replace(/<[^>]*>/g, '')
            : '';
          const image = article.featuredImage?.node?.sourceUrl;
          return (
            <Link
              key={article.id}
              href={getPostPath(article)}
              className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`text-2xl font-black leading-none tabular-nums shrink-0 w-7 transition-colors ${
                  index === 0 ? 'text-red-600' : 'text-gray-200 group-hover:text-red-600'
                }`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                {article.categories?.nodes?.[0]?.name && (
                  <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">
                    {article.categories.nodes[0].name}
                  </span>
                )}
                <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mt-0.5">
                  {cleanTitle}
                </h4>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {new Date(article.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {image && (
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
