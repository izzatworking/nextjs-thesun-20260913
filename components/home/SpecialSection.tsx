import { getPostUrl } from '../../lib/wordpress';
// components/home/SpecialSection.tsx
import Link from 'next/link';
import { WPPostWithMedia, WPCategory } from '../../types/wordpress';
import { cleanTextContent } from './utils/contentCleaner';
import { formatRelativeTime } from './utils/timeFormatter';

interface SpecialSectionProps {
  section: {
    name: string;
    slug: string;
    tagline?: string;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  featuredPost: WPPostWithMedia;
}

export default function SpecialSection({ 
  section, 
  posts, 
  categories, 
  featuredPost 
}: SpecialSectionProps) {
  const getPostCategoryName = (post: WPPostWithMedia, allCategories: WPCategory[]): string => {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    
    const categoryId = typeof post.categories[0] === 'number' 
      ? post.categories[0] 
      : (post.categories[0] as any).id;
    
    const category = allCategories.find(cat => cat.id === categoryId);
    return category ? cleanTextContent(category.name) : 'Uncategorized';
  };

  // PASTI PAKAI BACKGROUND COLOR BIRU GELAP
  const backgroundColor = section.backgroundColor || '#0f172a'; // slate-900
  const accentColor = section.accentColor || '#3b82f6'; // blue-500
  const textColor = section.textColor || '#ffffff';

  return (
    <section 
      className="relative overflow-hidden rounded-2xl shadow-2xl my-16"
      style={{ 
        backgroundColor,
        background: `linear-gradient(135deg, ${backgroundColor} 0%, #1e293b 100%)`
      }}
    >
      {/* Gradient overlay untuk depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-20 h-20">
        <div 
          className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg"
          style={{ borderColor: accentColor }}
        ></div>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20">
        <div 
          className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 rounded-br-lg"
          style={{ borderColor: accentColor }}
        ></div>
      </div>

      {/* Floating dots pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8">
        {/* Section Header - DESIGN YANG LEBIH MENARIK */}
        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center">
            {/* Accent bar atas */}
            <div 
              className="w-24 h-1 rounded-full mb-3"
              style={{ backgroundColor: accentColor }}
            ></div>
            
            <div 
              className="px-8 py-3 rounded-full mb-3 shadow-lg"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 4px 20px ${accentColor}40`
              }}
            >
              <h2 
                className="text-3xl font-bold tracking-wide"
                style={{ color: textColor }}
              >
                {section.name}
              </h2>
            </div>
            
            {/* Accent bar bawah */}
            <div 
              className="w-16 h-1 rounded-full mb-4"
              style={{ backgroundColor: accentColor }}
            ></div>
            
            {section.tagline && (
              <p 
                className="text-xl font-light max-w-2xl mx-auto leading-relaxed"
                style={{ color: textColor }}
              >
                {section.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Featured Article - Left 3/5 */}
          <div className="lg:col-span-3">
            {featuredPost && (
              <div 
                className="rounded-xl p-6 border-2 backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: accentColor + '40',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                {featuredPost.featured_media_url && (
                  <div className="w-full h-64 rounded-lg overflow-hidden mb-6 relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <img 
                      src={featuredPost.featured_media_url} 
                      alt={cleanTextContent(featuredPost.featured_media_alt || featuredPost.title.rendered)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay category pada image */}
                    <div className="absolute bottom-4 left-4 z-20">
                      <span 
                        className="text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                        style={{ 
                          backgroundColor: accentColor + '40',
                          color: textColor,
                          border: `1px solid ${accentColor}60`
                        }}
                      >
                        {getPostCategoryName(featuredPost, categories)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80" style={{ color: textColor }}>
                      {formatRelativeTime(featuredPost.date)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: accentColor + '20',
                          color: textColor,
                          border: `1px solid ${accentColor}40`
                        }}
                      >
                        Featured
                      </span>
                    </div>
                  </div>
                </div>
                
                <Link href={`${getPostUrl(featuredPost)}`}>
                  <h3 
                    className="text-2xl font-bold mb-4 hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ color: textColor }}
                    dangerouslySetInnerHTML={{ __html: cleanTextContent(featuredPost.title.rendered) }} 
                  />
                </Link>
                
                <div 
                  className="text-base leading-relaxed opacity-90 mb-6 line-clamp-3"
                  style={{ color: textColor }}
                  dangerouslySetInnerHTML={{ 
                    __html: cleanTextContent(
                      featuredPost.excerpt?.rendered || 
                      featuredPost.content?.rendered?.substring(0, 200) || 
                      ''
                    ) + '...'
                  }} 
                />
                
                <div className="flex items-center justify-between">
                  <Link 
                    href={`${getPostUrl(featuredPost)}`}
                    className="inline-flex items-center text-sm font-semibold hover:translate-x-1 transition-transform"
                    style={{ color: accentColor }}
                  >
                    Read Full Story
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      <svg className="w-5 h-5" style={{ color: textColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      <svg className="w-5 h-5" style={{ color: textColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Latest Articles - Right 2/5 */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {posts.slice(0, 4).map((post, index) => (
                <div 
                  key={post.id} 
                  className="rounded-lg p-4 border-l-4 transition-all duration-300 hover:scale-[1.02] group"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderLeftColor: accentColor,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex gap-4">
                    {post.featured_media_url && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                        <img 
                          src={post.featured_media_url} 
                          alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs opacity-75" style={{ color: textColor }}>
                          {formatRelativeTime(post.date)}
                        </span>
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: accentColor + '20',
                            color: textColor,
                            border: `1px solid ${accentColor}40`
                          }}
                        >
                          {getPostCategoryName(post, categories)}
                        </span>
                      </div>
                      
                      <Link href={`${getPostUrl(post)}`}>
                        <h4 
                          className="font-semibold text-sm mb-2 group-hover:opacity-90 transition-opacity cursor-pointer line-clamp-2"
                          style={{ color: textColor }}
                          dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} 
                        />
                      </Link>
                      
                      {/* Mini stats */}
                      <div className="flex items-center space-x-3 text-xs opacity-60">
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                         views
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          comments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
              <Link 
                href={`/${section.slug}`}
                className="inline-flex items-center justify-center w-full py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                style={{ 
                  backgroundColor: accentColor,
                  color: textColor,
                  boxShadow: `0 6px 20px ${accentColor}40`
                }}
              >
                Explore All {section.name} Coverage
                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <p className="text-sm opacity-75 mt-3" style={{ color: textColor }}>
                {posts.length}+ stories and counting
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}