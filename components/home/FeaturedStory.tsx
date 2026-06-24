// components/home/FeaturedStory.tsx
import Link from 'next/link';
import { WPPostWithMedia, WPCategory, WPAuthor } from '../../types/wordpress';
import { cleanTextContent, getFullParagraphExcerpt } from './utils/contentCleaner';
import { formatRelativeTime } from './utils/timeFormatter';
import NetworkImage from '../common/NetworkImage';
import { useState } from 'react';
import { getPostUrl } from '../../lib/wordpress';

interface FeaturedStoryProps {
  pinnedPost: WPPostWithMedia | null; // Post dengan tag "pin", boleh null jika tiada
  categories: WPCategory[];
}

export default function FeaturedStory({ pinnedPost, categories }: FeaturedStoryProps) {
  const [imageError, setImageError] = useState(false);
  
  // Jika tiada pinned post, jangan render apa-apa
  if (!pinnedPost) {
    return null;
  }
  
  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    
    const categoryId = typeof post.categories[0] === 'number' 
      ? post.categories[0] 
      : (post.categories[0] as any).id;
    
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const cleanTitle = cleanTextContent(pinnedPost.title.rendered);
  const cleanAlt = cleanTextContent(pinnedPost.featured_media_alt || pinnedPost.title.rendered);
  const categoryName = getPostCategoryName(pinnedPost, categories);

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 w-full">
          <div className="h-64 lg:h-full relative bg-gradient-to-br from-gray-100 to-gray-200">
            {pinnedPost.featured_media_url && !imageError ? (
              <NetworkImage
                src={pinnedPost.featured_media_url}
                alt={cleanAlt}
                fill={true}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                onError={() => {
                  console.warn(`Failed to load image: ${pinnedPost.featured_media_url}`);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{cleanTitle}</h3>
                <p className="text-gray-500 text-sm">{categoryName}</p>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full p-6 lg:p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <span className="text-gray-500 text-sm">
              {formatRelativeTime(pinnedPost.date)}
            </span>
            {categoryName && (
              <span className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full font-medium border border-red-100">
                {categoryName}
              </span>
            )}
          </div>

          <Link href={`${getPostUrl(pinnedPost)}`}>
            <h2
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-red-600 transition-colors cursor-pointer leading-tight"
              dangerouslySetInnerHTML={{ __html: cleanTitle }}
            />
          </Link>

          <div className="text-gray-700 leading-relaxed text-lg mb-6 line-clamp-3">
            {pinnedPost.excerpt?.rendered ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: getFullParagraphExcerpt(pinnedPost.excerpt.rendered)
                }}
              />
            ) : pinnedPost.content?.rendered ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: getFullParagraphExcerpt(pinnedPost.content.rendered.substring(0, 300) + '...')
                }}
              />
            ) : (
              <p className="text-gray-500 italic">No content preview available...</p>
            )}
          </div>

          {pinnedPost.authors && pinnedPost.authors.length > 0 && (
            <div className="mb-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{pinnedPost.authors[0].display_name}</span>
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <Link
              href={`${getPostUrl(pinnedPost)}`}
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span>Read Full Story</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}