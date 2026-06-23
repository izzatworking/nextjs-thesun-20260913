import { getPostUrl } from '../../../lib/wordpress';
// components/home/categories/GoingViralSection.tsx
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';
import { cleanTextContent } from '../utils/contentCleaner';
import { formatRelativeTime } from '../utils/timeFormatter';
import Link from 'next/link';

interface GoingViralSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function GoingViralSection({ posts, categories, isLast = false }: GoingViralSectionProps) {
  if (posts.length === 0) return null;

  // Jika posts memiliki kategori, ambil dari post pertama
  const firstPost = posts[0];
  let sectionName = 'Going Viral';
  let sectionSlug = 'viral';
  
  if (firstPost.categories && firstPost.categories.length > 0) {
    const categoryId = typeof firstPost.categories[0] === 'number' 
      ? firstPost.categories[0] 
      : (firstPost.categories[0] as any).id;
    
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      sectionName = cleanTextContent(category.name);
      sectionSlug = category.slug;
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#63B8EB] via-[#63B8EB]/70 to-white rounded-3xl p-8 mb-16 shadow-2xl">
      {/* Section Header dengan gaya viral/meme - Kekalkan warna oren */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-gradient-to-r from-[#5266FF] to-[#52FFEB] px-8 py-4 rounded-full mb-4 shadow-xl">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            {sectionName}
          </h2>
        </div>
        <p className="text-blue-900/70 text-lg font-medium">Trending topics everyone is talking about</p>
        <div className="w-32 h-1 bg-gradient-to-r from-[#5266FF] to-[#52FFEB] rounded-full mx-auto mt-4"></div>
      </div>

      {/* Viral Grid - Compact dengan icon viral */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post, index) => (
            <div key={post.id} className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 group border border-white/50">
              {/* Viral Badge - Kekalkan warna oren/merah */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-[#5266FF] to-[#52FFEB] text-white text-xs px-4 py-2 rounded-full font-bold flex items-center shadow-lg">
                  <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  VIRAL
                </div>
              </div>
              
              {post.featured_media_url && (
                <div className="w-full h-48 relative overflow-hidden">
                  <img 
                    src={post.featured_media_url} 
                    alt={cleanTextContent(post.featured_media_alt || post.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90"
                  />
                  {/* Overlay gradient gelap */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#5266FF]/10 to-[#52FFEB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}
              
              <div className="p-6 bg-gradient-to-b from-white to-blue-50">
                <div className="mb-4">
                  <span className="text-gray-500 text-xs font-medium">
                    {formatRelativeTime(post.date)}
                  </span>
                </div>
                
                <Link href={`${getPostUrl(post)}`}>
                  <h4 
                    className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 mb-4 leading-tight"
                    dangerouslySetInnerHTML={{ __html: cleanTextContent(post.title.rendered) }} 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - Kekalkan warna oren */}
        <div className="text-center mt-12">
          <Link 
            href={`/category/${sectionSlug}`}
            className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-[#5266FF] to-[#52FFEB] text-white rounded-xl font-bold hover:from-[#3B4FE8] hover:to-[#3BE8D4] transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(82,102,255,0.5)] transform hover:scale-105 shadow-xl border border-[#5266FF]/30"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            EXPLORE VIRAL STORIES
            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Line break - gradient gelap */}
      {!isLast && (
        <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mt-8"></div>
      )}
    </div>
  );
}