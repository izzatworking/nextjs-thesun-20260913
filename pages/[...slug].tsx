// pages/[...slug].tsx - UPDATED WITH PARENT/CHILD CATEGORY URL STRUCTURE
// Supports: /{parent-category}/{child-category}/{post-slug}
// Also supports: /{category}/{post-slug} for backward compatibility
import {
  getPosts,
  getPost,
  getCategories,
  getTags,
  getTagsByIds,
  generatePostUrl,
  categoryPathFromSlugs,
  getTopStoriesWithCategories,
  getPostsByCategoryWithChildren,
  getShortenedCategorySlug,
  getOriginalCategorySlug,
  setCategoryCache
} from '@/lib/wordpress';
import { GetStaticProps, GetStaticPaths } from 'next';
import he from 'he';
import {
  WPPost,
  WPPostWithMedia,
  WPCategory,
  WPAuthor,
  WPTag
} from '@/types/wordpress';
import Layout from '@/components/layout/Layout';
import Breadcrumb from '@/components/common/Breadcrumb';
import NetworkImage from '@/components/common/NetworkImage';
import { TimeAgo } from '@/components/common/TimeAgo';
import { AdWidget } from '@/components/ads/AdWidget';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TopStories from '@/components/layout/Header/TopStories';
import CategoryPage from '@/components/category/CategoryPage';
import { NAV_CATEGORY_MAP } from '@/components/layout/Header/navConfig';

interface PostProps {
  post: WPPostWithMedia;
  latestPosts: WPPostWithMedia[];
  categories: WPCategory[];
  allTags: WPTag[];
  initialMorePosts: WPPostWithMedia[];
  authorSlug?: string; // TAMBAH INI
  currentCategory: WPCategory; // TAMBAH INI
}

// Helper function untuk extract author
function getAuthor(post: WPPostWithMedia): WPAuthor | string {
  if (post.authors && post.authors.length > 0) {
    return post.authors[0];
  }

  if (post._embedded?.author?.[0]) {
    return {
      term_id: post._embedded.author[0].id || post._embedded.author[0].term_id || 0,
      user_id: post._embedded.author[0].user_id || 0,
      is_guest: post._embedded.author[0].is_guest || 0,
      slug: post._embedded.author[0].slug || '',
      job_title: post._embedded.author[0].job_title || '',
      display_name: post._embedded.author[0].name || post._embedded.author[0].display_name || 'Penulis',
      avatar_url: {
        url: post._embedded.author[0].avatar_urls?.['96'] || post._embedded.author[0].avatar_url?.url || '',
        url2x: post._embedded.author[0].avatar_urls?.['2*96'] || post._embedded.author[0].avatar_url?.url2x || ''
      },
      author_category: post._embedded.author[0].author_category || '',
      first_name: post._embedded.author[0].first_name || '',
      last_name: post._embedded.author[0].last_name || '',
      description: post._embedded.author[0].description || post._embedded.author[0].bio || ''
    };
  }

  return 'The Sun Webdesk';
}

// Helper function untuk dapatkan author slug
function getAuthorSlug(post: WPPostWithMedia): string | null {
  const author = getAuthor(post);

  if (typeof author === 'string') {
    return 'the-sun-webdesk'; // Default slug untuk webdesk
  }

  return author.slug || null;
}

// Decode HTML entities and special characters from content with multiple passes
function cleanHtmlContent(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return he.decode(html).trim();
}

// Strip HTML tags and decode entities for plain text content
function cleanTextContent(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return cleanHtmlContent(text.replace(/<[^>]*>/g, ''));
}

// Component untuk Author Section dengan Link
const AuthorSection = ({ post }: { post: WPPostWithMedia }) => {
  const author = getAuthor(post);
  const authorSlug = getAuthorSlug(post);

  // Check if author should be hidden
  const shouldHideAuthor = () => {
    if (typeof author === 'string') {
      return false; // The Sun Webdesk should not be hidden
    }
    
    const displayName = cleanTextContent(author.display_name);
    const hideAuthors = ['AFP', 'Reuters', 'Bernama'];
    
    return hideAuthors.some(hiddenAuthor => 
      displayName.toLowerCase().includes(hiddenAuthor.toLowerCase()) ||
      hiddenAuthor.toLowerCase().includes(displayName.toLowerCase())
    );
  };

  if (shouldHideAuthor()) {
    return null; // Return nothing to hide the author section
  }

  if (typeof author === 'string') {
    return (
      <div className="flex items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mr-2 border border-white shadow">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-900">The Sun Webdesk</span>
            <p className="text-xs text-gray-500">Editorial Team</p>
          </div>
        </div>
      </div>
    );
  }

  if (typeof author === 'string') {
    return (
      <div className="flex items-center">
        <span className="font-semibold text-sm text-gray-900">The Sun Webdesk</span>
      </div>
    );
  }

  const displayName = cleanTextContent(author.display_name);

  return (
    <div className="flex items-center">
      {authorSlug ? (
        <Link href={`/author/${authorSlug}`} className="hover:opacity-80 transition-opacity">
          <span className="font-semibold text-sm text-gray-900 hover:text-red-600 transition-colors">{displayName}</span>
        </Link>
      ) : (
        <span className="font-semibold text-sm text-gray-900">{displayName}</span>
      )}
    </div>
  );
};

// Component untuk Latest Stories
const LatestStories = ({ posts }: { posts: WPPostWithMedia[] }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 tracking-wide flex items-center gap-2">
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
          </svg>
          Latest Stories
        </h2>
      </div>
      <div className="divide-y divide-gray-50">
        {posts.slice(0, 5).map((post, index) => {
          return (
            <div key={post.id} className="flex gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-20 h-16">
                {post.featured_media_url ? (
                  <NetworkImage
                    src={post.featured_media_url}
                    alt={post.featured_media_alt || cleanTextContent(post.title.rendered)}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-[10px]">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 hover:text-red-600 transition-colors">
                   <Link href={generatePostUrl(post)}>
                     {cleanTextContent(post.title.rendered)}
                   </Link>
                 </h3>

                 <div className="flex items-center text-[11px] text-gray-400 mt-1.5">
                   <TimeAgo dateString={post.date} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component untuk Browse Categories (red card, sama macam di homepage)
const PopularCategories = ({ categories }: { categories: WPCategory[] }) => {
  const allCategories = (categories || [])
    .filter((cat) => cat.parent === 0 && cat.name && cat.slug)
    .slice(0, 16)
    .map((cat) => ({
      name: cleanTextContent(cat.name),
      slug: cat.slug,
    }));

  return (
    <div className="mt-6">
      <aside className="relative w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#CB3534] via-[#a91f2a] to-[#8E0320] shadow-[0_28px_70px_-35px_rgba(142,3,32,0.85)] flex flex-col">
        {/* Top green → red hairline */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005321] via-[#CB3534] to-transparent" />

        {/* Decorative arcs */}
        <svg className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 text-[#8E0320]/60" viewBox="0 0 100 100" fill="none">
          <circle cx="90" cy="10" r="60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeDasharray="160 240" />
        </svg>
        <svg className="pointer-events-none absolute -bottom-14 -left-12 h-52 w-52 text-white/5" viewBox="0 0 100 100" fill="none">
          <circle cx="10" cy="90" r="60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="110 270" />
        </svg>

        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -top-16 left-1/3 h-56 w-56 rounded-full bg-[#8E0320]/50 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#005321]/15 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col p-7">
          {/* Overline */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-0.5 w-8 bg-[#005321]" />
            <span className="h-0.5 w-8 bg-[#005321]/50" />
            <p className="text-[11px] font-semibold text-white/70 uppercase tracking-[0.25em]">
              Explore More
            </p>
          </div>

          {/* Heading */}
          <h3 className="text-4xl font-black leading-none text-white">
            Browse
            <span className="block text-white/90">Categories</span>
          </h3>

          <p className="mt-4 mb-8 text-sm leading-relaxed text-white/70">
            Discover in-depth coverage across every section of The Sun.
          </p>

          {/* All categories — 2 per row */}
          <ul className="grid grid-cols-2 gap-3">
            {allCategories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="group/cat flex h-full items-center justify-center rounded-xl border border-white/20 bg-white/[0.07] px-2 py-3.5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EEB3B5] hover:border-transparent hover:shadow-lg hover:shadow-black/10"
                >
                  <span className="truncate text-xs font-semibold text-white transition-colors duration-300 group-hover/cat:text-[#8E0320]">
                    {cat.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

// Component untuk More Stories
const MoreStoriesSection = ({
  initialPosts,
  currentPostId,
  categories
}: {
  initialPosts: WPPostWithMedia[],
  currentPostId: number,
  categories: WPCategory[]
}) => {
  const [posts, setPosts] = useState<WPPostWithMedia[]>(initialPosts.filter(p => p.id !== currentPostId).slice(0, 8));
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);

  const loadMore = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const nextPosts = initialPosts
        .filter(p => p.id !== currentPostId)
        .slice(visibleCount, visibleCount + 8);

      setPosts(prev => [...prev, ...nextPosts]);
      setVisibleCount(prev => prev + 8);

      if (visibleCount + 8 >= initialPosts.filter(p => p.id !== currentPostId).length) {
        setAllPostsLoaded(true);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasMore = visibleCount < initialPosts.filter(p => p.id !== currentPostId).length;

  return (
    <div className="w-full py-10 bg-gray-50 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-5 bg-red-500 rounded-full"></span>
          <h2 className="text-lg font-bold text-gray-900">More Stories You Might Like</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post) => {
            return (
              <article key={post.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all h-full">
                {post.featured_media_url && (
                  <div className="w-full h-40 relative">
                    <NetworkImage
                      src={post.featured_media_url}
                      alt={post.featured_media_alt || cleanTextContent(post.title.rendered)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}

                <div className="p-3.5">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug hover:text-red-600 transition-colors line-clamp-2">
                    <Link href={generatePostUrl(post, categories)}>
                      {cleanTextContent(post.title.rendered)}
                    </Link>
                  </h3>

                  <div className="flex items-center text-xs text-gray-400 mt-2">
                    <TimeAgo dateString={post.date} />
                  </div>

                  {post.excerpt?.rendered && (
                    <div
                      className="text-gray-600 text-sm leading-relaxed line-clamp-3 content-font"
                      dangerouslySetInnerHTML={{
                        __html: cleanHtmlContent(
                          post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                        )
                      }}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && !allPostsLoaded && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full max-w-[200px] mx-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {allPostsLoaded && (
          <div className="text-center mt-8 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">You&apos;ve reached the end of the articles</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Social Share Component - minimal and modern
const SocialShare = ({ title, post }: { title: string, post: WPPostWithMedia }) => {
  const articlePath = generatePostUrl(post);
  const articleUrl = `https://thesun.my${articlePath}`;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(articleUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=theSundaily`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20article:%20${encodedUrl}`
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <div className="flex items-center gap-0.5 sm:gap-1">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          aria-label="Share on Facebook"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Share on X"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-colors"
          aria-label="Share on WhatsApp"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.436 9.88-9.885 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
          </svg>
        </a>

        <a
          href={shareLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
          aria-label="Share on Telegram"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>

        <a
          href={shareLinks.email}
          target="_blank"
          rel="noopener noreferrer"
          className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Share via Email"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

// Component untuk Tags dengan nama sebenar
const PostTags = ({ tags, allTags }: { tags: number[], allTags: WPTag[] }) => {
  const tagsToHide = ['pin', 'exclusive', 'top stories', 'topstories', 'top-stories'];

  // Filter tags - show all except hidden ones
  const postTags = allTags.filter(tag => {
    // Check if tag is in the post's tag list
    if (!tags.includes(tag.id)) return false;
    
    // Check if tag should be hidden
    const shouldHide = tagsToHide.some(hiddenTag =>
      tag.name.toLowerCase() === hiddenTag.toLowerCase() ||
      tag.slug.toLowerCase() === hiddenTag.toLowerCase()
    );
    
    return !shouldHide;
  });

  if (postTags.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {postTags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="group relative inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-md overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10 group-hover:text-red-600 transition-colors duration-300">{cleanTextContent(tag.name)}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 via-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        ))}
      </div>
    </div>
  );
};

function Post({
  post,
  latestPosts,
  categories,
  allTags,
  initialMorePosts,
  currentCategory
}: PostProps) {
  const [content, setContent] = useState('');
  
  const articlePath = generatePostUrl(post, categories);
  const articleUrl = `https://thesun.my${articlePath}`;

  useEffect(() => {
    if (post.content.rendered) {
      // First clean HTML entities, then process HTML tags
      let processedContent = cleanHtmlContent(post.content.rendered);

      processedContent = processedContent.replace(
        /<img/g,
        '<img class="max-w-[800px] w-full h-auto rounded-lg my-4 mx-auto"'
      );
      
      // Add styling for image captions (figcaption elements)
      processedContent = processedContent.replace(
        /<figcaption>/g,
        '<figcaption class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">'
      );
      
      // Also handle common caption patterns like div with class wp-caption-text
      processedContent = processedContent.replace(
        /<div class="wp-caption-text">/g,
        '<div class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">'
      );
      
      // Handle p tags that might contain captions
      processedContent = processedContent.replace(
        /<p class="wp-caption-text">/g,
        '<p class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">'
      );
      
      // Add space after image caption (one line break)
      processedContent = processedContent.replace(
        /<\/figcaption>/g,
        '</figcaption><div class="mb-8"></div>'
      );
      
      // Add space after wp-caption-text div
      processedContent = processedContent.replace(
        /<div class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">(.*?)<\/div>/g,
        '<div class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">$1</div><div class="mb-8"></div>'
      );
      
      // Add space after wp-caption-text p
      processedContent = processedContent.replace(
        /<p class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">(.*?)<\/p>/g,
        '<p class="text-center text-sm text-gray-500 mt-2 italic max-w-4xl mx-auto content-font">$1</p><div class="mb-8"></div>'
      );

      processedContent = processedContent.replace(
        /<p>/g,
        '<p class="text-gray-700 leading-relaxed mb-4 text-sm max-w-4xl mx-auto content-font">'
      );

      processedContent = processedContent.replace(
        /<h1>/g,
        '<h1 class="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 max-w-4xl mx-auto">'
      );
      processedContent = processedContent.replace(
        /<h2>/g,
        '<h2 class="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3 max-w-4xl mx-auto">'
      );
      processedContent = processedContent.replace(
        /<h3>/g,
        '<h3 class="text-lg font-bold text-gray-900 mt-5 mb-2 max-w-4xl mx-auto">'
      );

      processedContent = processedContent.replace(
        /<ul>/g,
        '<ul class="list-disc list-inside mb-4 text-gray-700 text-sm max-w-4xl mx-auto content-font">'
      );
      processedContent = processedContent.replace(
        /<ol>/g,
        '<ol class="list-decimal list-inside mb-4 text-gray-700 text-sm max-w-4xl mx-auto content-font">'
      );

      processedContent = processedContent.replace(
        /<blockquote>/g,
        '<blockquote class="border-l-4 border-red-500 pl-4 italic text-gray-600 my-5 text-sm max-w-4xl mx-auto content-font">'
      );

      // Check if author is AFP, Reuters, or Bernama and add suffix to content
      const author = getAuthor(post);
      if (typeof author !== 'string') {
        const displayName = cleanTextContent(author.display_name);
        const hideAuthors = ['AFP', 'Reuters', 'Bernama'];
        
        // Find which hidden author matches
        const matchedHiddenAuthor = hideAuthors.find(hiddenAuthor => 
          displayName.toLowerCase().includes(hiddenAuthor.toLowerCase()) ||
          hiddenAuthor.toLowerCase().includes(displayName.toLowerCase())
        );
        
        if (matchedHiddenAuthor) {
          // Debug log untuk melihat author details
          console.log('🔍 Hidden author detected:', {
            displayName,
            rawDisplayName: author.display_name,
            hideAuthors,
            matchedHiddenAuthor,
            authorSuffix: `-${matchedHiddenAuthor}`
          });
          
          // Add author suffix at the end of the content
          // Use the matched hidden author name (AFP, Reuters, or Bernama) not the full displayName
          const authorSuffix = `-${matchedHiddenAuthor}`;
          
          // Find the last closing </p> tag and add suffix before it
          // If there are multiple paragraphs, add to the last one
          const lastParagraphIndex = processedContent.lastIndexOf('</p>');
          if (lastParagraphIndex !== -1) {
            // Insert suffix before the closing </p> tag
            processedContent = processedContent.substring(0, lastParagraphIndex) + 
                              authorSuffix + 
                              processedContent.substring(lastParagraphIndex);
          } else {
            // If no </p> tag found, append suffix at the end
            processedContent += `<p class="text-gray-700 leading-relaxed mb-4 text-sm max-w-4xl mx-auto content-font">${authorSuffix}</p>`;
          }
        }
      }

      setContent(processedContent);
    }
  }, [post, post.content.rendered]);

  const cleanTitle = cleanTextContent(post.title.rendered);

  return (
    <Layout 
      categories={categories}
      title={`${cleanTitle} | The Sun Malaysia`}
      description={cleanTextContent(post.excerpt.rendered) || 'Read this article on The Sun Malaysia'}
    >
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[62.5%]">
              <article className="bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto pt-8 px-4 md:px-0">
                  {/* 1. Category Tags */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {post.categories.map((categoryId: number, index: number) => {
                          const category = categories.find(cat => cat.id === categoryId);
                          if (!category) return null;

                          const parentCategory = category.parent && category.parent > 0
                            ? categories.find(cat => cat.id === category.parent)
                            : null;

                          return (
                            <div key={index} className="flex items-center gap-1.5">
                              {index > 0 && (
                                <span className="text-gray-300 mx-0.5">|</span>
                              )}
                              {parentCategory && (
                                <>
                                  <Link
                                    href={`/${parentCategory.slug}`}
                                    className="text-[11px] font-medium text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                                  >
                                    {cleanTextContent(parentCategory.name)}
                                  </Link>
                                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </>
                              )}
                              <Link
                                href={`/${category.slug || 'news'}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors"
                              >
                                {cleanTextContent(category.name)}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Title + Share inline */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight md:flex-1 mb-3 md:mb-0">
                      {cleanTitle}
                    </h1>
                    <div className="flex-shrink-0 self-start md:self-auto md:pt-1.5">
                      <SocialShare title={cleanTitle} post={post} />
                    </div>
                  </div>

                  {/* 3. Byline + Date row */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 mb-2 pb-4 border-b border-gray-200">
                    <AuthorSection post={post} />
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center text-gray-500">
                      <svg className="w-3.5 h-3.5 text-red-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium"><TimeAgo dateString={post.date} format="full" /></span>
                    </div>
                  </div>
                </div>

                {/* 4. Featured Image */}
                {post.featured_media_url && (
                  <div className="w-full max-w-[1200px] mx-auto px-4 md:px-0 mt-6">
                    <NetworkImage
                      src={post.featured_media_url}
                      alt={post.featured_media_alt || cleanTitle}
                      width={1200}
                      height={post.featured_media_height || 675}
                      className="w-full h-auto max-h-[500px] object-contain mx-auto rounded-lg"
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 1200px"
                    />
                    {post.featured_media_caption && (
                      <div 
                        className="text-center text-xs text-gray-500 mt-1 italic"
                        dangerouslySetInnerHTML={{ __html: post.featured_media_caption }}
                      />
                    )}
                  </div>
                )}

                <div className="max-w-4xl mx-auto px-4 md:px-0 mt-6">

                  {/* 5. Content */}
                  {content && (
                    <div
                      className="prose max-w-none content-font 
                        prose-p:text-sm prose-p:leading-relaxed prose-p:mb-4
                        prose-h3:text-lg prose-h3:leading-normal prose-h3:mb-2 prose-h3:mt-5
                        prose-h4:text-base prose-h4:leading-normal prose-h4:mb-2 prose-h4:mt-4
                        prose-h5:text-sm prose-h5:leading-relaxed prose-h5:mb-1.5 prose-h5:mt-3
                        prose-h6:text-xs prose-h6:leading-relaxed prose-h6:mb-1.5 prose-h6:mt-2.5
                        prose-ul:text-sm prose-ul:leading-relaxed prose-ul:mb-4
                        prose-ol:text-sm prose-ol:leading-relaxed prose-ol:mb-4
                        prose-li:mb-1
                        prose-blockquote:text-sm prose-blockquote:leading-relaxed prose-blockquote:my-5
                        prose-figcaption:text-xs prose-figcaption:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}

                  {/* 6. Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <PostTags tags={post.tags} allTags={allTags} />
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                  </div>
                </div>
              </article>
            </div>

            <div className="lg:w-[37.5%]">
              <LatestStories posts={latestPosts} />
              <div className="mt-6">
                <TopStories />
              </div>
              <PopularCategories categories={categories} />
              <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              </div>
              <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
                <div id="mg-ad-placeholder-2"></div>
              </div>
            </div>
          </div>
        </div>

        {initialMorePosts.length > 1 && (
          <MoreStoriesSection
            initialPosts={initialMorePosts}
            currentPostId={post.id}
            categories={categories}
          />
        )}
       </div>
     </Layout>
   );
}

export default function ArticleRoute(ssgProps: Partial<PostProps> = {}) {
  const router = useRouter();
  const [data, setData] = useState<PostProps | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const ssgPost = ssgProps?.post || null;

  useEffect(() => {
    if (!router.isReady) return;
    if ((ssgProps as any)?.categorySlug) return;

    const asPath = router.asPath.split('?')[0].replace(/\/+$/, '');
    const slugArray = asPath.split('/').filter(Boolean);

    if (!slugArray || slugArray.length < 2) {
      setNotFound(true);
      return;
    }

    const urlSlug = slugArray[slugArray.length - 1];
    const cleanUrlSlug = urlSlug.toLowerCase().replace(/[^\w\-]/g, '').trim();
    setCurrentSlug(urlSlug);

    // If this path was statically pre-rendered (SSG data available for the
    // exact slug), skip the client fetch to avoid a duplicate request.
    if (ssgPost && (urlSlug === ssgPost.slug || cleanUrlSlug === ssgPost.slug)) {
      setData(null);
      setNotFound(false);
      return;
    }

    setData(null);
    setNotFound(false);

    let active = true;
    let attempt = 0;

    const load = async () => {
      try {
        let post = await getPost(cleanUrlSlug);
        if (!post) post = await getPost(urlSlug);

        if (!post) {
          const allPosts = await getPosts(100);
          const foundPost = allPosts.find(p => {
            const postSlug = p.slug.toLowerCase();
            const urlSlugLower = urlSlug.toLowerCase();
            return postSlug === urlSlugLower ||
                   postSlug === cleanUrlSlug ||
                   postSlug.includes(urlSlugLower.replace(/-/g, '')) ||
                   p.title.rendered.toLowerCase().includes(urlSlugLower.replace(/-/g, ' '));
          });
          if (foundPost) post = foundPost;
        }

        if (!post) {
          if (active) setNotFound(true);
          return;
        }

        const [categories, allPosts] = await Promise.all([
          getCategories(),
          getPosts(50),
        ]);

        setCategoryCache(categories);

        const postTagIds = post.tags || [];
        const postTags = postTagIds.length > 0 ? await getTagsByIds(postTagIds) : [];

        const firstCategoryId = post.categories?.[0];
        let currentCategory = categories[0];

        if (firstCategoryId) {
          const foundCategory = categories.find(cat => cat.id === firstCategoryId);
          if (foundCategory) {
            currentCategory = foundCategory;
          }
        }

        const latestPosts = allPosts
          .filter((p: WPPostWithMedia) => p.id !== post.id)
          .slice(0, 5);

        const initialMorePosts = allPosts
          .filter((p: WPPostWithMedia) => p.id !== post.id)
          .slice(0, 24);

        if (active) {
          setData({
            post,
            latestPosts,
            categories,
            allTags: postTags,
            initialMorePosts,
            currentCategory,
          });
        }
      } catch (error) {
        console.error('💥 Error fetching post:', error);
        if (active && attempt < 3) {
          attempt += 1;
          setTimeout(load, 1200 * attempt);
        } else if (active) {
          setNotFound(true);
        }
      }
    };

    load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.asPath, ssgPost]);

  const showSSG = ssgPost && (!currentSlug || currentSlug === ssgPost.slug);
  const resolvedData = data ?? (showSSG ? (ssgProps as PostProps) : null);

  const categorySlug = (ssgProps as any)?.categorySlug as string | undefined;
  if (categorySlug) {
    return <CategoryPage slug={categorySlug} />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Article Not Found</h1>
        <p className="text-gray-500 text-sm mb-6 item-center text-center">The article you&apos;re looking for has been moved or no longer exists.</p>
        <Link href="/" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg">
          Back to main page
        </Link>
      </div>
    );
  }

  if (!resolvedData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading article…</p>
      </div>
    );
  }

  return <Post {...resolvedData} />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const segments = (params?.slug as string[]) || [];
  const urlSlug = segments[segments.length - 1] || '';

  // The catch-all shell used by the SPA fallback (.htaccess / Cloudflare Pages
  // function). Keep it as a pure client-side shell — no server data.
  if (urlSlug === 'article-shell') {
    return { props: {} };
  }

  // Clean category URLs (no /category/ prefix) are handled category-first:
  // nav paths like /news/malaysia map via NAV_CATEGORY_MAP, and flat paths
  // like /going-viral or /education resolve against the WP category tree.
  const pathKey = segments.join('/');
  let categorySlug: string | undefined = NAV_CATEGORY_MAP[`/${pathKey}`];
  if (!categorySlug) {
    try {
      const categories = await getCategories();
      if (segments.length === 1) {
        const seg = segments[0];
        const flat =
          categories.find(c => c.slug === seg) ||
          categories.find(c => c.slug.toLowerCase() === seg.toLowerCase()) ||
          categories.find(c => getShortenedCategorySlug(c.slug) === seg) ||
          categories.find(c => getOriginalCategorySlug(seg) === c.slug);
        if (flat) categorySlug = flat.slug;
      }
    } catch {
      // ignore; fall back to article lookup below
    }
  }
  if (categorySlug) {
    return { props: { categorySlug } };
  }

  try {
    const post = await getPost(urlSlug);

    if (!post) {
      return { notFound: true };
    }

    // Auxiliary data (categories, latest posts, all tags) is identical for
    // every article page, so memoise it for the whole build instead of
    // re-fetching it hundreds of times.
    const { categories, allPosts, allTags } = await getSharedBuildData();

    setCategoryCache(categories);

    const postTagIds = post.tags || [];
    const postTags = postTagIds.length > 0
      ? allTags.filter((tag: WPTag) => postTagIds.includes(tag.id))
      : [];

    const firstCategoryId = post.categories?.[0];
    let currentCategory = categories[0];

    if (firstCategoryId) {
      const foundCategory = categories.find((cat) => cat.id === firstCategoryId);
      if (foundCategory) {
        currentCategory = foundCategory;
      }
    }

    const latestPosts = allPosts
      .filter((p: WPPostWithMedia) => p.id !== post.id)
      .slice(0, 5);

    const initialMorePosts = allPosts
      .filter((p: WPPostWithMedia) => p.id !== post.id)
      .slice(0, 24);

    return {
      props: {
        post,
        latestPosts,
        categories,
        allTags: postTags,
        initialMorePosts,
        currentCategory,
      },
    };
  } catch (error) {
    console.error('Error fetching post for /[...slug] SSG:', error);
    return { notFound: true };
  }
};

let sharedBuildDataPromise: Promise<{
  categories: WPCategory[];
  allPosts: WPPostWithMedia[];
  allTags: WPTag[];
}> | null = null;

function getSharedBuildData() {
  if (!sharedBuildDataPromise) {
    sharedBuildDataPromise = Promise.all([
      getCategories(),
      getPosts(50),
      getTags(),
    ]).then(([categories, allPosts, allTags]) => ({
      categories,
      allPosts,
      allTags,
    }));
  }
  return sharedBuildDataPromise;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string[] } }[] = [];
  const uniquePaths = new Set<string>();
  const categoryKey = new Set<string>();

  const addCategory = (segments: string[]) => {
    const key = segments.join('/');
    if (!key || categoryKey.has(key)) return;
    categoryKey.add(key);
    uniquePaths.add(key);
    paths.push({ params: { slug: segments } });
  };

  const addPost = (post: WPPostWithMedia) => {
    if (!post || !post.slug) return;
    const url = generatePostUrl(post);
    const segments = url
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
    if (segments.length < 2) return;
    const key = segments.join('/');
    if (categoryKey.has(key) || uniquePaths.has(key)) return;
    uniquePaths.add(key);
    paths.push({ params: { slug: segments } });
  };

  const addPostBySegments = (categoryPath: string, postSlug: string) => {
    if (!categoryPath || !postSlug) return;
    const segments = `${categoryPath}/${postSlug}`
      .replace(/^\/+|\/+$/g, '')
      .split('/')
      .filter(Boolean);
    if (segments.length < 2) return;
    const key = segments.join('/');
    if (categoryKey.has(key) || uniquePaths.has(key)) return;
    uniquePaths.add(key);
    paths.push({ params: { slug: segments } });
  };

  try {
    const categories = await getCategories();
    setCategoryCache(categories);

    // Clean category URLs (category-first, no /category/ prefix): every
    // category as a flat /{slug} page plus the nested nav paths like
    // /news/malaysia. Article paths below are kept out of these keys.
    categories.forEach((cat) => {
      if (!cat?.slug) return;
      addCategory([getShortenedCategorySlug(cat.slug)]);
    });
    Object.keys(NAV_CATEGORY_MAP).forEach((navPath) => {
      const segments = navPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
      if (segments.length >= 1) addCategory(segments);
    });

    const [posts, topStories] = await Promise.all([
      getPosts(100),
      getTopStoriesWithCategories().catch(() => [] as WPPostWithMedia[]),
    ]);

    posts.forEach(addPost);
    topStories.forEach(addPost);

    // The header/most-viewed widgets fetch top stories from GraphQL directly
    // (lib/queries), so pre-render those URLs too.
    try {
      const { getTopStories } = await import('@/lib/queries');
      const graphTopStories: { slug: string; categories?: { nodes: { slug: string }[] } }[] =
        (await getTopStories().catch(() => [])) as { slug: string; categories?: { nodes: { slug: string }[] } }[];
      graphTopStories.forEach((t) => {
        if (!t?.slug) return;
        const slugs = (t.categories?.nodes || []).map((n) => n.slug);
        addPostBySegments(categoryPathFromSlugs(slugs), t.slug);
      });
    } catch {
      // ignore GraphQL top-stories failures
    }

    // Cover the homepage's per-section rails (opinion, asia, motoring,
    // education, etc.). Include child categories (e.g. asia/football) whose
    // posts are also linked from the homepage.
    await Promise.all(categories.map(async (cat) => {
      try {
        const perPage = /opinion|pendapat/i.test(cat.name + ' ' + cat.slug) ? 60 : 20;
        const sectionPosts = await getPostsByCategoryWithChildren(cat.id, perPage);
        sectionPosts.forEach(addPost);
      } catch {
        // ignore section fetch failures
      }
    }));
  } catch (error) {
    console.error('Error generating paths for /[...slug]:', error);
  }

  // Keep the catch-all shell path for the SPA fallback (Cloudflare function /
  // .htaccess both rewrite unknown article URLs to this shell).
  paths.push({ params: { slug: ['article-shell'] } });

  return {
    paths,
    fallback: false,
  };
};