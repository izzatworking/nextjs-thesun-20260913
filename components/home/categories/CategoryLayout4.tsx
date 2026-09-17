import { getPostUrl } from '../../../lib/wordpress';
// components/home/categories/CategoryLayout4.tsx
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';

interface CategoryLayout4Props {
  name: string;
  slug: string;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategoryLayout4({ 
  name, 
  slug, 
  posts, 
  categories, 
  isLast = false 
}: CategoryLayout4Props) {
  if (posts.length === 0) return null;

  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    
    const categoryId = typeof post.categories[0] === 'number' 
      ? post.categories[0] 
      : (post.categories[0] as any).id;
    
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  const getFullParagraphExcerpt = (content: string): string => {
    // Cek apakah kita di client-side
    if (typeof document === 'undefined') {
      // Fallback untuk server-side rendering
      // Hapus tag HTML dan ambil 200 karakter pertama
      const plainText = content.replace(/<[^>]*>/g, '');
      return plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }
    
    // Client-side rendering
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const firstParagraph = tempDiv.querySelector('p');
    if (firstParagraph) {
      return firstParagraph.innerHTML;
    }
    
    return content.substring(0, 200) + (content.length > 200 ? '...' : '');
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {name}
        </h2>
        <Link 
          href={`/${slug}`}
          className="text-red-600 hover:text-red-700 font-semibold text-sm"
        >
          View All →
        </Link>
      </div>

      {/* Content Grid - 3/5 left, 2/5 right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch mb-16">
        {/* Featured Article - Left 3/5 */}
        <div className="lg:col-span-3">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
            {/* Featured image */}
            {posts[0]?.featured_media_url && (
              <div className="w-full h-80 flex-shrink-0 relative overflow-hidden">
                <img 
                  src={posts[0].featured_media_url} 
                  alt={cleanTextContent(posts[0].featured_media_alt || posts[0].title.rendered)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-blue-100');
                  }}
                />
              </div>
            )}
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 text-sm">
                    {formatRelativeTime(posts[0].date)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    {getPostCategoryName(posts[0], categories)}
                  </span>
                </div>
                
                {/* Optional: Author info */}
                {posts[0].authors && posts[0].authors.length > 0 && (
                  <span className="text-gray-500 text-xs">
                    By {posts[0].authors[0].display_name}
                  </span>
                )}
              </div>
              
              <Link href={`${getPostUrl(posts[0])}`}>
                <h3 
                  className="text-2xl font-bold text-gray-900 mb-4 hover:text-red-600 transition-colors cursor-pointer flex-1"
                  dangerouslySetInnerHTML={{ __html: cleanTextContent(posts[0].title.rendered) }} 
                />
              </Link>
              
              <div 
                className="text-gray-600 leading-relaxed text-base mb-6 line-clamp-3"
                dangerouslySetInnerHTML={{ 
                  __html: getFullParagraphExcerpt(
                    posts[0].excerpt?.rendered || 
                    posts[0].content?.rendered?.substring(0, 200) || 
                    ''
                  )
                }} 
              />
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link 
                  href={`${getPostUrl(posts[0])}`}
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-semibold transition-colors"
                >
                  Read full story
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </div>

        {/* Next Articles - Right 2/5 */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 h-full">
            {posts.slice(1, 5).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                {post.featured_media_url && (
                  <div className="w-full h-40 flex-shrink-0 relative overflow-hidden">
                    <img 
                      src={post.featured_media_url} 
                      alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('bg-gray-100');
                      }}
                    />
                  </div>
                )}
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-500 text-xs">
                      {formatRelativeTime(post.date)}
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                      {getPostCategoryName(post, categories)}
                    </span>
                  </div>
                  
                  <Link href={`${getPostUrl(post)}`}>
                    <h4 
                      className="font-semibold text-gray-900 text-sm hover:text-red-600 transition-colors cursor-pointer leading-tight line-clamp-3 flex-1"
                      dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} 
                    />
                  </Link>
                  
                  {/* Optional: Add excerpt for longer content */}
                  {post.excerpt?.rendered && (
                    <div 
                      className="text-gray-600 text-xs mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: cleanTextContent(
                          post.excerpt.rendered.substring(0, 80) + '...'
                        )
                      }} 
                    />
                  )}
                  
                  {/* Read more link */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Link 
                      href={`${getPostUrl(post)}`}
                      className="text-red-600 hover:text-red-800 text-xs font-medium inline-flex items-center transition-colors"
                    >
                      Read more
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line break antara sections (kecuali section terakhir) */}
      {!isLast && (
        <div className="border-t border-gray-300 my-12"></div>
      )}
    </div>
  );
}