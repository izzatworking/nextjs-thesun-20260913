import {
  getCategories,
  getPostsByCategory,
  getPostsByCategoryWithChildren,
  extractFeaturedMedia,
  getPostUrl,
  setCategoryCache,
  getShortenedCategorySlug,
  getOriginalCategorySlug
} from '../../lib/wordpress';
import { getTopStories } from '../../lib/queries';
import {
  WPPostWithMedia,
  WPCategory
} from '../../types/wordpress';
import Layout from '../layout/Layout';
import NetworkImage from '../common/NetworkImage';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MAIN_SPORTS } from '../layout/Header/sportsUtils';

interface CategoryWithCount extends WPCategory {
  count: number;
  parent: number;
}

interface TopStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories?: { nodes: { slug: string; name: string }[] };
  featuredImage?: { node: { sourceUrl: string; altText: string } };
}

export interface CategoryProps {
  category: CategoryWithCount;
  subCategories: CategoryWithCount[];
  featuredPost: WPPostWithMedia | null;
  categoryPosts: WPPostWithMedia[];
  allCategories: CategoryWithCount[];
  totalPostsCount: number;
  allPosts: WPPostWithMedia[];
  mostViewed: TopStory[];
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

function getTopStoryPath(article: TopStory): string {
  const catSlug = article.categories?.nodes?.[0]?.slug;
  if (catSlug) return `/${catSlug}/${article.slug}`;
  return `/posts/${article.slug}`;
}

export async function getCategoryContent(slug: string): Promise<CategoryProps | null> {
  try {
    const allCategoriesData = await getCategories();
    const allCategories: CategoryWithCount[] = allCategoriesData.map(c => ({ ...c, count: c.count || 0, parent: c.parent || 0 }));
    let category = allCategories.find(c => c.slug === slug);
    if (!category) category = allCategories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
    if (!category) {
      const mappedSlug = getShortenedCategorySlug(slug);
      if (mappedSlug !== slug) {
        category = allCategories.find(c => c.slug === mappedSlug);
      }
    }
    if (!category) {
      const originalSlug = getOriginalCategorySlug(slug);
      if (originalSlug !== slug) {
        category = allCategories.find(c => c.slug === originalSlug);
      }
    }
    if (!category) return null;

    const subCategories: CategoryWithCount[] = allCategories.filter(c => c.parent === category.id).map(c => ({ ...c, count: c.count || 0, parent: c.parent || 0 }));
    const allPostsData = category.parent === 0 ? await getPostsByCategoryWithChildren(category.id, 50) : await getPostsByCategory(category.id, 50);
    setCategoryCache(allCategories);
    const allPosts = allPostsData.map(p => extractFeaturedMedia(p));
    const mostViewed = await getTopStories();
    return {
      category,
      subCategories,
      featuredPost: allPosts[0] || null,
      categoryPosts: allPosts.slice(1, 10),
      allCategories,
      totalPostsCount: allPosts.length,
      allPosts,
      mostViewed,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function CategoryInner({
  category,
  subCategories,
  allCategories,
  allPosts,
  mostViewed
}: CategoryProps) {
  const [displayCount, setDisplayCount] = useState(12);
  const [openOtherSports, setOpenOtherSports] = useState(false);
  const mainPost = allPosts[0];
  const gridPosts = allPosts.slice(1, displayCount + 1);
  const hasMore = displayCount < allPosts.length - 1;
  const parentCategory = category.parent !== 0 ? allCategories.find(cat => cat.id === category.parent) : null;
  const siblingCategories = parentCategory ? allCategories.filter(cat => cat.parent === parentCategory.id && cat.id !== category.id) : [];
  const isSports = category.slug === 'sports';
  const sportsMain = isSports ? subCategories.filter(cat => MAIN_SPORTS.includes(cat.slug)) : [];
  const sportsOther = isSports ? subCategories.filter(cat => !MAIN_SPORTS.includes(cat.slug)) : [];

  const renderCategoryChip = (cat: CategoryWithCount) => (
    <Link key={cat.id} href={`/${cat.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
      <span className="relative z-10">{cleanHtmlContent(cat.name)}</span>
      <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
    </Link>
  );

  return (
    <Layout
      categories={allCategories}
      title={`${cleanHtmlContent(category.name)} | The Sun Malaysia`}
      description={`Latest news and articles in ${cleanHtmlContent(category.name)} category on The Sun Malaysia`}
    >
      <div className="container mx-auto px-1 sm:px-2 lg:px-3 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          {parentCategory && (
            <Link href={`/${parentCategory.slug}`} className="text-[10px] md:text-xs font-medium text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors">
              {cleanHtmlContent(parentCategory.name)}
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
            {cleanHtmlContent(category.name)}
          </h1>
          {(subCategories.length > 0 || siblingCategories.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-3 md:mt-4">
              {category.parent !== 0 && parentCategory && (
                <Link href={`/${parentCategory.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
                  <span className="relative z-10">All {cleanHtmlContent(parentCategory.name)}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                </Link>
              )}
              {siblingCategories.map(cat => (
                <Link key={cat.id} href={`/${cat.slug}`} className="group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-white text-gray-400 hover:text-white border border-gray-200 hover:border-red-500 transition-colors inline-flex items-center overflow-hidden">
                  <span className="relative z-10">{cleanHtmlContent(cat.name)}</span>
                  <div className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                </Link>
              ))}
              {category.parent === 0 && isSports && (
                <>
                  {sportsMain.map(renderCategoryChip)}
                  <button
                    onClick={() => setOpenOtherSports(prev => !prev)}
                    className={`group relative px-2 h-5 md:px-2.5 md:h-6 text-[9px] md:text-[10px] font-medium rounded-md bg-red-50 text-red-600 border border-red-200 transition-colors inline-flex items-center gap-1 overflow-hidden ${
                      openOtherSports ? 'border-red-500' : ''
                    }`}
                  >
                    <span className="relative z-10">Other Sports</span>
                    <svg
                      className={`relative z-10 w-2.5 h-2.5 md:w-3 md:h-3 transition-transform duration-200 ${
                        openOtherSports ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openOtherSports && sportsOther.map(renderCategoryChip)}
                </>
              )}
              {category.parent === 0 && !isSports && subCategories.map(renderCategoryChip)}
            </div>
          )}
        </div>

        {allPosts.length === 0 && (
          <div className="text-center py-16 md:py-20"><p className="text-gray-400 text-sm">No stories yet.</p></div>
        )}

        {/* Featured + Most Viewed Row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 md:mb-12">
          {/* Featured Hero Card */}
          {mainPost && (
            <div className="lg:w-3/4">
              <article className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-3/5 relative">
                    <Link href={getPostUrl(mainPost, allCategories)}>
                      <div className="aspect-[16/9] md:aspect-[2/1] lg:aspect-auto lg:h-full relative min-h-[200px] md:min-h-[320px] lg:min-h-[300px]">
                        {mainPost.featured_media_url ? (
                          <NetworkImage src={mainPost.featured_media_url} alt={mainPost.featured_media_alt || cleanHtmlContent(mainPost.title.rendered)} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 60vw" />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center"><span className="text-gray-300 text-sm">No image</span></div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="lg:w-2/5 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2.5 text-xs text-gray-400 mb-3">
                      <span className="px-2.5 py-1 bg-red-50 text-red-600 font-semibold rounded-md text-[10px] uppercase tracking-wider">{cleanHtmlContent(category.name)}</span>
                      <span className="text-gray-300">·</span>
                      <span>{formatTimeAgo(mainPost.date)}</span>
                    </div>
                    <Link href={getPostUrl(mainPost, allCategories)}>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors mb-3"
                          dangerouslySetInnerHTML={{ __html: cleanHtmlContent(mainPost.title.rendered) }} />
                    </Link>
                    {mainPost.excerpt?.rendered && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{cleanTextContent(mainPost.excerpt.rendered.substring(0, 200) + '...')}</p>
                    )}
                    <Link href={getPostUrl(mainPost, allCategories)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                      Read article
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Most Viewed sidebar */}
          <div className="lg:w-1/4">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Most Viewed</h2>
            </div>
            <div className="space-y-4">
              {mostViewed.slice(0, 5).map((post, i) => (
                <article key={post.id} className="group flex gap-3">
                  <span className="text-lg font-bold text-gray-200 leading-none mt-0.5 w-5 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={getTopStoryPath(post)}>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title) }} />
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                      {post.categories?.nodes?.[0] && (
                        <span className="text-red-500 font-semibold uppercase tracking-wider">{cleanHtmlContent(post.categories.nodes[0].name)}</span>
                      )}
                      <span>·</span>
                      <span>{formatTimeAgo(post.date)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Stories */}
        <div className="mb-10">
            <div className="flex items-center gap-2 pb-3 mb-5 border-b border-gray-100">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
              </svg>
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Latest Stories</h2>
            </div>
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {gridPosts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200">
                    {post.featured_media_url && (
                      <Link href={getPostUrl(post, allCategories)}>
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <NetworkImage src={post.featured_media_url} alt={post.featured_media_alt || cleanHtmlContent(post.title.rendered)} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                        </div>
                      </Link>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-1.5">
                        <span className="text-red-500 font-semibold uppercase tracking-wider">{cleanHtmlContent(category.name)}</span>
                        <span>·</span>
                        <span>{formatTimeAgo(post.date)}</span>
                      </div>
                      <Link href={getPostUrl(post, allCategories)}>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: cleanHtmlContent(post.title.rendered) }} />
                      </Link>
                      {post.excerpt?.rendered && (
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{cleanTextContent(post.excerpt.rendered.substring(0, 100) + '...')}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16"><p className="text-gray-400 text-sm">No more stories.</p></div>
            )}
        </div>

        {hasMore && (
          <div className="text-center pb-10">
            <button onClick={() => setDisplayCount(prev => prev + 12)} className="px-5 h-9 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 hover:border-red-200 transition-colors inline-flex items-center gap-1.5">
              <span>Load More</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function CategoryPage({ slug }: { slug: string }) {
  const [data, setData] = useState<CategoryProps | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const result = await getCategoryContent(slug);
      if (active) setData(result);
    })();
    return () => { active = false; };
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  return <CategoryInner {...data} />;
}