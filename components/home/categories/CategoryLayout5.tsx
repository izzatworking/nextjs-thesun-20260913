import { getPostUrl } from '../../../lib/wordpress';
// components/home/categories/CategoryLayout5.tsx
import { useState, useEffect } from 'react';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface CategoryColumn {
  name: string;
  slug: string;
  posts: WPPostWithMedia[];
  category: WPCategory;
}

interface CategoryLayout5Props {
  categoryColumns: CategoryColumn[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategoryLayout5({ categoryColumns, categories, isLast = false }: CategoryLayout5Props) {
  const [currentRow, setCurrentRow] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rowsPerColumn = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!categoryColumns || categoryColumns.length === 0) return null;

  const totalRows = Math.min(...categoryColumns.map(col => col.posts?.length || 0));
  const maxRows = Math.min(totalRows, rowsPerColumn * 3);
  
  const displayCurrentRow = mounted ? currentRow : 0;

  const handleNext = () => {
    if (displayCurrentRow + rowsPerColumn < totalRows) {
      setCurrentRow(prev => prev + rowsPerColumn);
    }
  };

  const handlePrevious = () => {
    if (displayCurrentRow - rowsPerColumn >= 0) {
      setCurrentRow(prev => prev - rowsPerColumn);
    }
  };

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="mb-8 border-b border-gray-300 pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Latest Updates</h2>
        <p className="text-gray-600 mt-2">Quick glance at what&apos;s happening around the world</p>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {categoryColumns.map((column, colIndex) => {
          const columnPosts = (column.posts || []).slice(displayCurrentRow, displayCurrentRow + rowsPerColumn);
          
          return (
            <div key={column.slug} className="space-y-6">
              {/* Column Header */}
              <div className="pb-2 border-b-2 border-gray-800">
                <Link href={`/${column.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                    {column.name}
                  </h3>
                </Link>
              </div>

              {/* Posts List */}
              <div className="space-y-6">
                {columnPosts.map((post, index) => (
                  <article key={post.id} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail Image - Kiri */}
                      {post.featured_media_url && (
                        <div className="flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-md">
                          <img 
                            src={post.featured_media_url} 
                            alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.classList.add('bg-gray-100');
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Content - Kanan */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          {/* Number Indicator */}
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
                              {displayCurrentRow + index + 1}
                            </div>
                          </div>
                          
                          {/* Time */}
                          <div className="text-xs text-gray-500 ml-2">
                            {formatRelativeTime(post.date)}
                          </div>
                        </div>
                        
                        {/* Title */}
                        <Link href={`${getPostUrl(post)}`}>
                          <h4 
                            className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 mb-2 leading-tight mt-1"
                            dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} 
                          />
                        </Link>
                        
                        {/* Category & Author */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Author */}
                          {post.authors && post.authors.length > 0 && (
                            <span className="flex items-center text-xs text-gray-600">
                              <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {post.authors[0].display_name}
                            </span>
                          )}
                          
                          {/* Read time indicator */}
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {(post.id % 5) + 1} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* View All Link */}
              <div className="pt-4">
                <Link 
                  href={`/${column.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  More {column.name} stories
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {totalRows > rowsPerColumn && (
        <div className="flex items-center justify-center space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={displayCurrentRow === 0}
            className={`flex items-center justify-center w-10 h-10 rounded-full border ${
              displayCurrentRow === 0 
                ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-600'
            } transition-colors`}
            aria-label="Previous posts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-sm text-gray-600">
            Showing {displayCurrentRow + 1}-{Math.min(displayCurrentRow + rowsPerColumn, totalRows)} of {totalRows} stories
          </div>
          
          <button
            onClick={handleNext}
            disabled={displayCurrentRow + rowsPerColumn >= totalRows}
            className={`flex items-center justify-center w-10 h-10 rounded-full border ${
              displayCurrentRow + rowsPerColumn >= totalRows
                ? 'border-gray-300 text-gray-300 cursor-not-allowed' 
                : 'border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-600'
            } transition-colors`}
            aria-label="Next posts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Line break */}
      {!isLast && (
        <div className="border-t border-gray-300 my-12"></div>
      )}
    </div>
  );
}