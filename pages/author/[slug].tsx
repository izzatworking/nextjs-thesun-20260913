import { getCategories, getPosts, getPostUrl, setCategoryCache, getAllAuthors } from '../../lib/wordpress';
import { WPAuthor, WPPostWithMedia, WPCategory } from '../../types/wordpress';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const he = require('he');

interface Props {
  author: WPAuthor | null;
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  latestPosts: WPPostWithMedia[];
  error?: string;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function cleanTextContent(text: string): string {
  if (!text) return '';
  return he.decode(text.replace(/<[^>]*>/g, '')).trim();
}

function AuthorProfilePageInner({ author, posts, categories, latestPosts, error }: Props) {
  const [visibleCount, setVisibleCount] = useState(12);

  if (error && !author) {
    return (
      <Layout categories={categories} title="Error | The Sun Malaysia">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Author Not Found</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link href="/" className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Back to Home</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout categories={categories} title="Not Found | The Sun Malaysia">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Author Not Found</h1>
            <p className="text-gray-500 mb-6">This author profile does not exist.</p>
            <Link href="/" className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Back to Home</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const displayName = cleanTextContent(author.display_name) || 'Author';
  const description = author.description ? cleanTextContent(author.description) : '';
  const avatarUrl = author.avatar_url?.url || '';
  const postsToShow = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <Layout categories={categories} title={`${displayName} | The Sun Malaysia`} description={description || `Articles by ${displayName}`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="px-8 pb-8 -mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {displayName.charAt(0)}
                </div>
              </div>
              <div className="flex-1 pt-3 sm:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayName}</h1>
                {author.job_title && <p className="text-gray-500 text-sm mt-0.5">{cleanTextContent(author.job_title)}</p>}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    {posts.length} articles
                  </span>
                </div>
              </div>
            </div>
            {description && <p className="text-gray-600 mt-6 max-w-3xl leading-relaxed">{description}</p>}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
            Articles
          </h2>

          {postsToShow.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <p className="text-gray-500 text-sm">No articles published yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {postsToShow.map(post => {
                  const title = cleanTextContent(post.title.rendered || '');
                  const excerpt = post.excerpt?.rendered ? cleanTextContent(post.excerpt.rendered) : '';
                  const img = (post as any).featured_media_url || '';
                  return (
                    <Link key={post.id} href={getPostUrl(post, categories)} className="group block">
                      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full">
                        <div className="aspect-[16/10] bg-gray-50 overflow-hidden">
                          {img ? (
                            <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                          )}
                        </div>
                        <div className="p-5">
                          <time className="text-xs text-gray-400">{formatDate(post.date)}</time>
                          <h3 className="font-semibold text-gray-900 text-sm mt-2 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
                          {excerpt && <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{excerpt}</p>}
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
              {hasMore && (
                <div className="text-center mt-10">
                  <button onClick={() => setVisibleCount(c => c + 12)} className="px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">Show More Articles</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => ({ props: {} });

export const getStaticPaths = async () => {
  const authors = await getAllAuthors();
  return { paths: authors.filter(a => a.slug).map(a => ({ params: { slug: a.slug } })), fallback: false };
};

export default function AuthorProfilePage() {
  const { query } = useRouter();
  const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
  const [data, setData] = useState<Props | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        if (!slug) {
          if (active) setData({ author: null, posts: [], categories: [], latestPosts: [], error: 'Author not found' });
          return;
        }

        let author: WPAuthor | null = null;
        let posts: WPPostWithMedia[] = [];
        const WORDPRESS_API_URL = 'https://thesun.my/wp-json/wp/v2';

        // Step 1: Find author by searching in 100 posts
        const postsRes = await fetch(`${WORDPRESS_API_URL}/posts?per_page=100`);
        if (postsRes.ok) {
          const rawPosts = await postsRes.json();
          if (Array.isArray(rawPosts)) {
            for (const p of rawPosts) {
              const postAuthors = p.authors;
              if (postAuthors && Array.isArray(postAuthors) && postAuthors.length > 0) {
                for (const a of postAuthors) {
                  if (a && a.slug === slug && !author) {
                    author = {
                      term_id: a.term_id || 0, user_id: a.user_id || 0, is_guest: a.is_guest || 1,
                      slug: a.slug || slug, job_title: a.job_title || '',
                      display_name: a.display_name || a.name || slug,
                      avatar_url: { url: a.avatar_url?.url || '', url2x: a.avatar_url?.url2x || '' },
                      author_category: a.author_category || '', first_name: a.first_name || '',
                      last_name: a.last_name || '', description: a.description || a.bio || ''
                    };
                    break;
                  }
                }
                if (author) break;
              }
            }
          }
        }

        if (!author) {
          if (active) setData({ author: null, posts: [], categories: [], latestPosts: [], error: `Author "${slug}" not found` });
          return;
        }

        // Step 2: Fetch ALL posts by this author using ppma_author (gets all posts regardless of position)
        const authorTermId = author.term_id || 0;
        if (authorTermId > 0) {
          const allRes = await fetch(`${WORDPRESS_API_URL}/posts?ppma_author=${authorTermId}&_embed=wp:featuredmedia&per_page=100`);
          if (allRes.ok) {
            const allPosts = await allRes.json();
            if (Array.isArray(allPosts)) {
              posts = allPosts.map((p: any) => ({
                ...p,
                featured_media_url: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                authors: p.authors || []
              }));
            }
          }
        }

        const [categories, latestPosts] = await Promise.all([getCategories(), getPosts(6)]);
        setCategoryCache(categories);

        if (active) {
          setData({ author, posts: posts || [], categories: categories || [], latestPosts: latestPosts || [] });
        }
      } catch (err) {
        console.error('❌ Error loading author profile:', err);
        if (active) setData({ author: null, posts: [], categories: [], latestPosts: [], error: err instanceof Error ? err.message : 'Unknown error' });
      }
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

  return <AuthorProfilePageInner {...data} />;
}