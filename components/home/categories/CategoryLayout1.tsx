import { getPostUrl } from '../../../lib/wordpress';
// components/home/categories/CategoryLayout1.tsx
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import { useState, useEffect } from 'react';

interface CategoryLayout1Props {
  name: string;
  slug: string;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategoryLayout1({ 
  name, 
  slug, 
  posts, 
  categories, 
  isLast = false 
}: CategoryLayout1Props) {


  if (posts.length === 0) return null;

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    
    const categoryId = typeof post.categories[0] === 'number' 
      ? post.categories[0] 
      : (post.categories[0] as any).id;
    
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const featuredPost = posts[0];
  const bottomPosts = posts.slice(1, 5);

  // Gunakan format date yang sederhana dan konsisten
  const formatDateSafe = (dateString: string) => {
    // Always use simple format to avoid hydration mismatch
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
             {name}
          </h2>
          <div className="w-20 h-1 bg-red-600 rounded-full mt-2"></div>
        </div>
        <Link 
          href={`/${slug}`}
          className="text-red-600 hover:text-red-700 font-semibold text-sm hover:underline transition-colors"
        >
         Explore More {name}  →
        </Link>
      </div>

      {/* Featured Article - Full Width */}
      <div className="mb-8">
        <article>
          {/* Featured Image */}
          {featuredPost.featured_media_url && (
            <div className="w-full h-96 relative overflow-hidden rounded-lg mb-4">
              <img 
                src={featuredPost.featured_media_url} 
                alt={cleanTextContent(featuredPost.featured_media_alt || featuredPost.title.rendered)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          <div>
            {/* Category & Time - Compact */}
            <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap">
              <span className="text-red-600 font-medium mr-3">
                {getPostCategoryName(featuredPost, categories)}
              </span>
              <span className="text-gray-500">
                {formatDateSafe(featuredPost.date)}
              </span>
              {featuredPost.authors && featuredPost.authors.length > 0 && (
                <>
                  <span className="mx-3 text-gray-400">•</span>
                  <span className="text-gray-700">
                    {featuredPost.authors[0].display_name}
                  </span>
                </>
              )}
            </div>
            
            {/* Title */}
            <Link href={`${getPostUrl(featuredPost)}`}>
              <h3 
                className="text-3xl font-bold text-gray-900 mb-4 hover:text-red-600 transition-colors cursor-pointer leading-tight"
                dangerouslySetInnerHTML={{ __html: cleanTextContent(featuredPost.title.rendered) }} 
              />
            </Link>
            
            {/* Excerpt */}
            {featuredPost.excerpt?.rendered && (
              <div 
                className="text-gray-700 text-base mb-4 leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: cleanTextContent(
                    featuredPost.excerpt.rendered.substring(0, 300) + '...'
                  )
                }} 
              />
            )}
            
            {/* Read More Link */}
            <Link 
              href={`${getPostUrl(featuredPost)}`}
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
            >
              Read full story
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </article>
      </div>

      {/* Bottom Section: 4 Artikel dalam Grid */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bottomPosts.map((post) => (
            <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Image */}
              {post.featured_media_url && (
                <div className="w-full h-40 relative overflow-hidden">
                  <img 
                    src={post.featured_media_url} 
                    alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-4">
                {/* Category & Time */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{formatDateSafe(post.date)}</span>
                  <span className="text-red-600 font-medium">
                    {getPostCategoryName(post, categories)}
                  </span>
                </div>
                
                {/* Title */}
                <Link href={`${getPostUrl(post)}`}>
                  <h4 
                    className="font-bold text-gray-900 text-sm hover:text-red-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} 
                  />
                </Link>
                
                {/* Author - Simple */}
                {post.authors && post.authors.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {post.authors[0].display_name}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

   

      {/* Line break antara sections (kecuali section terakhir) */}
      {!isLast && (
        <div className="border-t border-gray-300 my-10"></div>
      )}
    </div>
  );
}