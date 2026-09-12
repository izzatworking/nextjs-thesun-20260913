// pages/tag/[slug].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPostsByTagSlug, getTags, getCategories, getPostUrl, setCategoryCache } from '../../lib/wordpress';
import { WPPostWithMedia, WPCategory, WPTag } from '../../types/wordpress';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/common/Breadcrumb';
import Link from 'next/link';
import he from 'he';

interface TagPageProps {
  tag: WPTag | null;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  allTags: WPTag[];
}

// Function to clean HTML entities
function cleanHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return he.decode(html).trim();
}

function TagInner({ tag, posts, categories, allTags }: TagPageProps) {
  const [visiblePosts, setVisiblePosts] = useState(12);

  if (!tag) {
    return (
      <Layout 
        categories={categories}
        title="Tag Not Found | The Sun Malaysia"
        description="The tag you're looking for doesn't exist"
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tag Not Found</h1>
            <p className="text-gray-600 mb-6">The tag you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="text-red-600 hover:text-red-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const loadMore = () => {
    setVisiblePosts(prev => prev + 12);
  };

  return (
    <Layout 
      categories={categories}
      title={`${cleanHtmlContent(tag.name)} | The Sun Malaysia`}
      description={`Articles tagged with ${cleanHtmlContent(tag.name)} on The Sun Malaysia`}
    >
      <Breadcrumb categories={categories} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Tags</span>
            <span>/</span>
            <span className="text-red-600 font-medium">{tag.name}</span>
          </div>
          
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{tag.name}</h1>
            <p className="text-white/80 text-lg">
              {posts.length} article{posts.length !== 1 ? 's' : ''} with this tag
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.slice(0, visiblePosts).map((post) => {
                const category = post._embedded?.['wp:term']?.[0]?.[0];
                const categorySlug = category?.slug || 'news';
                
                return (
                  <article 
                    key={post.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image */}
                    <Link href={`/${categorySlug}/${post.slug}`}>
                      <div className="relative aspect-video overflow-hidden">
                        {post.featured_media_url ? (
                          <img 
                            src={post.featured_media_url}
                            alt={post.featured_media_alt || post.title.rendered}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </Link>
                    
                    <div className="p-5">
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-3">
                        {category && (
                          <Link 
                            href={`/category/${category.slug}`}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 uppercase tracking-wide"
                          >
                             {cleanHtmlContent(category.name)}
                          </Link>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-MY', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <Link href={getPostUrl(post, categories)}>
                        <h2 
                          className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors"
                          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                      </Link>
                      
                      {/* Excerpt */}
                      {post.excerpt?.rendered && (
                        <p 
                          className="text-sm text-gray-600 line-clamp-2 mb-4"
                          dangerouslySetInnerHTML={{ 
                            __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                          }}
                        />
                      )}
                      
                      {/* Read More */}
                      <Link 
                         href={getPostUrl(post, categories)}
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 group/link"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Button */}
            {visiblePosts < posts.length && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Load More Articles ({posts.length - visiblePosts} remaining)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No articles found</h2>
            <p className="text-gray-600 mb-6">There are no articles with this tag yet.</p>
            <Link href="/" className="text-red-600 hover:text-red-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        )}

        {/* Related Tags */}
        {allTags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((t) => (
                <Link
                  key={t.id}
                  href={`/tag/${t.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    t.id === tag.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function Tag() {
  const { query } = useRouter();
  const slug = String(Array.isArray(query.slug) ? query.slug[0] : query.slug) || '';
  const [data, setData] = useState<TagPageProps | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        console.log(`🏷️ Loading tag page for slug: ${slug}`);
        
        // Try to fetch tag directly from API first
        let tag: WPTag | null = null;
        let posts: WPPostWithMedia[] = [];
        let categories: WPCategory[] = [];
        let allTags: WPTag[] = [];
        
        try {
          // Fetch tag by slug
          const tagRes = await fetch(`https://thesun.my/wp-json/wp/v2/tags?slug=${slug}`);
          if (tagRes.ok) {
            const tagData = await tagRes.json();
            if (tagData && tagData.length > 0) {
              tag = {
                id: tagData[0].id,
                name: tagData[0].name,
                slug: tagData[0].slug,
              };
              console.log(`✅ Found tag: ${tag.name} (ID: ${tag.id})`);
            }
          }
        } catch (err) {
          console.error('Error fetching tag by slug:', err);
        }
        
        // If tag not found, show not-found state
        if (!tag) {
          console.log(`❌ Tag not found: ${slug}`);
          const result: TagPageProps = { tag: null, posts: [], categories: [], allTags: [] };
          if (active) setData(result);
          return;
        }
        
        // Fetch posts for this tag
        try {
          posts = await getPostsByTagSlug(slug, 100);
          console.log(`✅ Fetched ${posts.length} posts for tag: ${slug}`);
        } catch (err) {
          console.error('Error fetching posts by tag:', err);
          posts = [];
        }
        
        // Fetch categories and all tags in parallel
        try {
          const [catsData, tagsData] = await Promise.all([
            getCategories(),
            getTags(),
          ]);
          categories = catsData || [];
          allTags = tagsData || [];
          setCategoryCache(categories);
        } catch (err) {
          console.error('Error fetching categories/tags:', err);
        }

        const result: TagPageProps = {
          tag,
          posts: posts || [],
          categories: categories || [],
          allTags: allTags || [],
        };
        if (active) setData(result);
      } catch (error) {
        console.error('Error in getStaticProps for tag page:', error);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Memuatkan…</p>
      </div>
    );
  }

  return <TagInner {...data} />;
}

export const getStaticProps = async () => ({ props: {} });

export const getStaticPaths = async () => {
  const tags = await getTags();
  return { paths: tags.filter(t => t.slug).map(t => ({ params: { slug: t.slug } })), fallback: false };
};