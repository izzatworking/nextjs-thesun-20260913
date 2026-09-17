// components/examples/PostLinkExample.tsx
// Example component showing correct Link usage with /[category]/[slug] URL structure

import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../types/wordpress';
import { generatePostUrlWithCategory } from '../../utils/postUrl';

interface PostLinkExampleProps {
  post: WPPostWithMedia;
  categories: WPCategory[];
}

export function PostLinkExample({ post, categories }: PostLinkExampleProps) {
  // Generate the correct URL: /[category-slug]/[post-slug]
  const postUrl = generatePostUrlWithCategory(post, categories);
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Post Link Example</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Generated URL:</strong> {postUrl}
        </p>
        
        <p className="text-sm text-gray-600">
          <strong>Post Slug:</strong> {post.slug}
        </p>
        
        <p className="text-sm text-gray-600">
          <strong>Post Title:</strong> {post.title.rendered.replace(/<[^>]*>/g, '')}
        </p>
        
        {post.categories && post.categories.length > 0 && (
          <p className="text-sm text-gray-600">
            <strong>Categories:</strong> {post.categories.join(', ')}
          </p>
        )}
      </div>
      
      {/* Correct Link usage */}
      <div className="mt-4">
        <Link
          href={postUrl}
          className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Read Article: {post.title.rendered.replace(/<[^>]*>/g, '').substring(0, 30)}...
        </Link>
      </div>
      
      {/* Example in a list */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-medium mb-2">Example in a post list:</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
            {post.featured_media_url && (
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={post.featured_media_url}
                  alt={post.featured_media_alt || ''}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Link
                href={postUrl}
                className="block group"
              >
                <h5 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {post.title.rendered.replace(/<[^>]*>/g, '')}
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Click to read full article at: {postUrl}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example of a post card component with correct URL
interface PostCardProps {
  post: WPPostWithMedia;
  categories: WPCategory[];
  showCategory?: boolean;
}

export function PostCard({ post, categories, showCategory = true }: PostCardProps) {
  const postUrl = generatePostUrlWithCategory(post, categories);
  
  // Get category name for display
  const firstCategoryId = post.categories && post.categories.length > 0 ? post.categories[0] : null;
  const category = firstCategoryId 
    ? categories.find(cat => cat.id === firstCategoryId)
    : null;
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.featured_media_url && (
        <Link href={postUrl} className="block">
          <div className="w-full h-48 relative">
            <img
              src={post.featured_media_url}
              alt={post.featured_media_alt || post.title.rendered.replace(/<[^>]*>/g, '')}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      )}
      
      <div className="p-4">
        {showCategory && category && (
          <Link
            href={`/${category.slug}`}
            className="inline-block mb-2"
          >
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {category.name.replace(/<[^>]*>/g, '')}
            </span>
          </Link>
        )}
        
        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">
          <Link
            href={postUrl}
            className="hover:text-red-600 transition-colors"
          >
            {post.title.rendered.replace(/<[^>]*>/g, '')}
          </Link>
        </h3>
        
        {post.excerpt?.rendered && (
          <div
            className="text-gray-600 text-sm mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            }}
          />
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <Link
            href={postUrl}
            className="text-red-600 font-medium hover:text-red-700 transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}