import { GetStaticProps, GetStaticPaths } from 'next';
import {
  getCategories,
  getPostsByCategory,
  getPostsByCategoryWithChildren,
  extractFeaturedMedia,
  getPostUrl,
  setCategoryCache
} from '../../lib/wordpress';
import { 
  WPPost, 
  WPPostWithMedia,
  WPCategory 
} from '../../types/wordpress';
import Layout from '../../components/layout/Layout';
import NetworkImage from '../../components/common/NetworkImage';
import Link from 'next/link';
import { useState } from 'react';

interface CategoryWithCount extends WPCategory {
  count: number;
  parent: number;
}

interface CategoryProps {
  category: CategoryWithCount;
  subCategories: CategoryWithCount[];
  featuredPost: WPPostWithMedia | null;
  categoryPosts: WPPostWithMedia[];
  allCategories: CategoryWithCount[];
  totalPostsCount: number;
  allPosts: WPPostWithMedia[];
}

function cleanHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';
  let result = html;
  for (let pass = 0; pass < 3; pass++) {
    result = result
      .replace(/&#(\d+);/g, (_, dec) => { const code = parseInt(dec, 10); return code >= 0 && code <= 0x10FFFF ? String.fromCharCode(code) : ''; })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => { const code = parseInt(hex, 16); return code >= 0 && code <= 0x10FFFF ? String.fromCharCode(code) : ''; })
      .replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&apos;/g, "'").replace(/&#8216;/g, "'").replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"')
      .replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')
      .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#8230;/g, '…')
      .replace(/&[a-zA-Z][a-zA-Z0-9]*;?/g, '');
  }
  return result.trim();
}

function cleanTextContent(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return cleanHtmlContent(text.replace(/<[^>]*>/g, ''));
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CategoryPage({ 
  category, 
  subCategories, 
  allCategories,
  allPosts
}: CategoryProps) {
  const [displayCount, setDisplayCount] = useState(12);
  const mainPost = allPosts[0];
  const sidePosts = allPosts.slice(1, 4);
  const gridPosts = allPosts.slice(4, displayCount + 4);
  const hasMore = displayCount < allPosts.length - 4;
  const parentCategory = category.parent !== 0 ? allCategories.find(cat => cat.id === category.parent) : null;
  const siblingCategories = parentCategory ? allCategories.filter(cat => cat.parent === parentCategory.id && cat.id !== category.id) : [];

  return (
    <Layout 
      categories={allCategories}
      title={`${cleanHtmlContent(category.name)} | The Sun Malaysia`}
      description={`Latest news and articles in ${cleanHtmlContent(category.name)} category on The Sun Malaysia`}
    >
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 py-6 lg:py-8 lg:max-w-7xl">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          {parentCategory && (
            <Link href={`/category/${parentCategory.slug}`} className="text-[10px] md:text-xs font-medium text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors">
              {cleanHtmlContent(parentCategory.name)}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
            {cleanHtmlContent(category.name)}
          </h1>
          {(subCategories.length > 0 || siblingCategories.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-3 md:mt-4">
              {category.parent !== 0 && parentCategory && (
                <Link href={`/category/${parentCategory.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
                  <span className="relative z-10">All {cleanHtmlContent(parentCategory.name)}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                </Link>
              )}
              {siblingCategories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
                  <span className="relative z-10">{cleanHtmlContent(cat.name)}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                </Link>
              ))}
              {category.parent === 0 && subCategories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
                  <span className="relative z-10">{cleanHtmlContent(cat.name)}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-16 md:py-20"><p className="text-gray-400 text-sm">No stories yet.</p></div>
        )}

        {/* Featured Hero Card */}
        {mainPost && (
          <div className="mb-6 md:mb-10">
            <article className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-3/5 relative">
                  <Link href={getPostUrl(mainPost, allCategories)}>
                    <div className="aspect-[16/9] md:aspect-[2/1] lg:aspect-auto lg:h-full relative min-h-[200px] md:min-h-[300px] lg:min-h-[280px]">
                      {mainPost.featured_media_url ? (
                        <NetworkImage src={mainPost.featured_media_url} alt={mainPost.featured_media_alt || cleanHtmlContent(mainPost.title.rendered)} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 60vw" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center"><span className="text-gray-400 text-xs">No image</span></div>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="lg:w-2/5 p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 mb-2 md:mb-3">
                    <span className="text-red-500 font-semibold uppercase tracking-wider text-[10px] md:text-[11px]">{cleanHtmlContent(category.name)}</span>
                    <span className="text-gray-300">·</span>
                    <span>{formatTimeAgo(mainPost.date)}</span>
                  </div>
                  <Link href={getPostUrl(mainPost, allCategories)}>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors mb-2 md:mb-3"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlContent(mainPost.title.rendered) }} />
                  </Link>
                  {mainPost.excerpt?.rendered && (
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2 md:line-clamp-3">{cleanTextContent(mainPost.excerpt.rendered.substring(0, 200) + '...')}</p>
                  )}
                  <Link href={getPostUrl(mainPost, allCategories)} className="mt-3 md:mt-4 text-[11px] md:text-xs font-medium text-red-500 hover:text-red-600 transition-colors inline-flex items-center gap-1">
                    Read article
                    <svg className="w-3 md:w-3.5 h-3 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Side + Grid */}
        <div className="flex flex-col lg:flex-row gap-5 mb-8">
          {/* Side column - horizontal on mobile */}
          <div className="lg:w-1/4">
            <div className="border-b border-gray-100 pb-2.5 mb-4 lg:hidden">
              <h2 className="text-xs font-bold text-gray-900">Side Stories</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
              {sidePosts.map((post, i) => (
                <article key={post.id} className="group bg-white rounded-lg border border-gray-100 p-2 md:p-2.5 hover:shadow-sm transition-shadow">
                  {post.featured_media_url && (
                    <Link href={getPostUrl(post, allCategories)}>
                      <div className="aspect-[16/9] relative rounded-md overflow-hidden mb-2">
                        <NetworkImage src={post.featured_media_url} alt={post.featured_media_alt || cleanHtmlContent(post.title.rendered)} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                      </div>
                    </Link>
                  )}
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-gray-400 mb-1">
                    <span className="text-red-500 font-semibold uppercase tracking-wider">{cleanHtmlContent(category.name)}</span>
                    <span>·</span>
                    <span>{formatTimeAgo(post.date)}</span>
                  </div>
                  <Link href={getPostUrl(post, allCategories)}>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 md:line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title.rendered) }} />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Grid column */}
          <div className="lg:w-3/4">
            <div className="border-b border-gray-100 pb-2.5 mb-4 md:mb-6">
              <h2 className="text-xs md:text-sm font-bold text-gray-900">Latest Stories</h2>
            </div>
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {gridPosts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
                    {post.featured_media_url && (
                      <Link href={getPostUrl(post, allCategories)}>
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <NetworkImage src={post.featured_media_url} alt={post.featured_media_alt || cleanHtmlContent(post.title.rendered)} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        </div>
                      </Link>
                    )}
                    <div className="p-3 md:p-4">
                      <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 mb-1 md:mb-1.5">
                        <span className="text-red-500 font-semibold uppercase tracking-wider">{cleanHtmlContent(category.name)}</span>
                        <span>·</span>
                        <span>{formatTimeAgo(post.date)}</span>
                      </div>
                      <Link href={getPostUrl(post, allCategories)}>
                        <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title.rendered) }} />
                      </Link>
                      {post.excerpt?.rendered && (
                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-1.5 leading-relaxed line-clamp-2">{cleanTextContent(post.excerpt.rendered.substring(0, 100) + '...')}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16"><p className="text-gray-400 text-sm">No more stories.</p></div>
            )}
          </div>
        </div>

        {hasMore && (
          <div className="text-center pb-6 md:pb-8">
            <button onClick={() => setDisplayCount(prev => prev + 12)} className="px-4 md:px-5 h-8 md:h-9 text-[11px] md:text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const allCategories = await getCategories();
    return { paths: allCategories.map((c: WPCategory) => ({ params: { slug: c.slug } })), fallback: 'blocking' };
  } catch { return { paths: [], fallback: 'blocking' }; }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const allCategoriesData = await getCategories();
    const allCategories: CategoryWithCount[] = allCategoriesData.map(c => ({ ...c, count: c.count || 0, parent: c.parent || 0 }));
    let category = allCategories.find(c => c.slug === slug);
    if (!category) category = allCategories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    if (!category) return { notFound: true };

    const subCategories: CategoryWithCount[] = allCategories.filter(c => c.parent === category.id).map(c => ({ ...c, count: c.count || 0, parent: c.parent || 0 }));
    const allPostsData = category.parent === 0 ? await getPostsByCategoryWithChildren(category.id, 50) : await getPostsByCategory(category.id, 50);
    setCategoryCache(allCategories);
    const allPosts = allPostsData.map(p => extractFeaturedMedia(p));

    return { props: { category, subCategories, featuredPost: allPosts[0] || null, categoryPosts: allPosts.slice(1, 10), allCategories, totalPostsCount: allPosts.length, allPosts }, revalidate: 60 };
  } catch { return { notFound: true }; }
};
