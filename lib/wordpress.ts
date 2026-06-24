// lib/wordpress.ts - Rewritten with GraphQL (Apollo Client) + REST fallback
import {
  WPPost,
  WPPostWithMedia,
  WPMedia,
  WPTag,
  WPAuthor,
  WPCategory
} from '../types/wordpress';
import { graphqlToWpPost, graphqlToWpCategories, graphqlToWpTags, graphqlToWpPosts } from './graphql/utils';
import client from './graphql/client';
import {
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_CATEGORIES,
  GET_POSTS_BY_CATEGORY,
  SEARCH_POSTS,
  GET_POSTS_BY_TAG,
  GET_TAGS,
  GET_PAGE_BY_SLUG,
  GET_AUTHOR_BY_SLUG,
  GET_POSTS_BY_AUTHOR,
} from './graphql/queries';
import type {
  GraphQLPostsResponse,
  GraphQLPostResponse,
  GraphQLCategoriesResponse,
  GraphQLTagsResponse,
} from './graphql/types';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_REST_URL || 'https://thesun.my/wp-json/wp/v2';
const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://thesun.my/thesun-api';

export async function fetchAPI(query: string, variables: Record<string, any> = {}) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

let cachedCategories: WPCategory[] | null = null;

export function setCategoryCache(categories: WPCategory[]): void {
  cachedCategories = categories;
}

export function getCategoryCache(): WPCategory[] | null {
  return cachedCategories;
}

function resolvePostCategoryPath(post: WPPostWithMedia | WPPost, allCategories?: WPCategory[]): string {
  const postCategoryIds = (post as WPPost).categories || [];
  const categories = allCategories || cachedCategories;
  if (categories && postCategoryIds.length > 0) {
    const postCategories = categories.filter(cat => postCategoryIds.includes(cat.id));
    if (postCategories.length > 0) {
      const sorted = sortCategoriesByHierarchy(postCategories);
      return sorted.map(cat => getShortenedCategorySlug(cat.slug)).join('/');
    }
  }
  if ((post as WPPostWithMedia)._embedded?.['wp:term']?.[0]) {
    const categoryTerms = (post as WPPostWithMedia)._embedded!['wp:term']![0] as WPCategory[];
    const postCategories = categoryTerms.filter(cat => postCategoryIds.includes(cat.id));
    if (postCategories.length > 0) {
      const sorted = sortCategoriesByHierarchy(postCategories);
      return sorted.map(cat => getShortenedCategorySlug(cat.slug)).join('/');
    }
  }
  return 'news';
}

function processRESTPost(post: WPPost): WPPostWithMedia {
  const categories = Array.isArray(post.categories)
    ? post.categories.map(cat => typeof cat === 'object' ? (cat as WPCategory).id : cat)
    : [];

  const tags = Array.isArray(post.tags)
    ? post.tags.map(tag => typeof tag === 'object' ? (tag as WPTag).id : tag)
    : [];

  let featured_media_url: string | undefined = undefined;
  let featured_media_alt: string | undefined = undefined;
  let featured_media_width: number | undefined = undefined;
  let featured_media_height: number | undefined = undefined;

  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    featured_media_url = media.source_url;
    featured_media_alt = media.alt_text || post.title.rendered;
    featured_media_width = media.media_details?.width;
    featured_media_height = media.media_details?.height;
  }

  const { _embedded, ...rest } = post;
  const postWithMedia: WPPostWithMedia = {
    ...rest,
    categories,
    tags,
    authors: post.authors || post._embedded?.author || []
  };

  if (featured_media_url) postWithMedia.featured_media_url = featured_media_url;
  if (featured_media_alt) postWithMedia.featured_media_alt = featured_media_alt;
  if (featured_media_width) postWithMedia.featured_media_width = featured_media_width;
  if (featured_media_height) postWithMedia.featured_media_height = featured_media_height;

  return postWithMedia;
}

async function fetchRESTPosts(url: string): Promise<WPPostWithMedia[]> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Referer': 'https://thesun.my/',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    },
  });
  if (!res.ok) throw new Error(`REST API error: ${res.status} ${res.statusText}`);
  const posts: WPPost[] = await res.json();
  return posts.map(processRESTPost);
}

export function extractFeaturedMedia(post: WPPost): WPPostWithMedia {
  const { _embedded, ...rest } = post;
  const postWithMedia: WPPostWithMedia = { ...rest };

  if (_embedded?.['wp:featuredmedia']?.[0]) {
    const media = _embedded['wp:featuredmedia'][0];
    postWithMedia.featured_media_url = media.source_url || null;
    postWithMedia.featured_media_alt = media.alt_text || null;
    postWithMedia.featured_media_caption = media.caption?.rendered || null;
    postWithMedia.featured_media_width = media.media_details?.width || null;
    postWithMedia.featured_media_height = media.media_details?.height || null;
  }

  if (_embedded?.author?.[0]) {
    postWithMedia.authors = [_embedded.author[0]];
  }

  return postWithMedia;
}

export async function getPosts(perPage = 20, page = 1): Promise<WPPostWithMedia[]> {
  try {
    console.log('Fetching posts (GraphQL):', { perPage, page });
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_POSTS,
      variables: { first: perPage },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return graphqlToWpPosts(data.posts.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      return await fetchRESTPosts(
        `${WORDPRESS_API_URL}/posts?_embed=wp:featuredmedia,author,wp:term&per_page=${perPage}&page=${page}`
      );
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPost(slug: string): Promise<WPPostWithMedia | null> {
  try {
    console.log('Fetching post by slug (GraphQL):', slug);
    const { data } = await client.query<GraphQLPostResponse>({
      query: GET_POST_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });
    if (data?.post) {
      return graphqlToWpPost(data.post);
    }
    throw new Error('Post not found via GraphQL');
  } catch (graphqlError) {
    console.log('GraphQL error, falling back to REST for slug:', slug, graphqlError);
    try {
      const slugVariations = [
        slug,
        slug.replace(/-+/g, ' ').trim(),
        slug.replace(/[^\w\s-]/g, ''),
        encodeURIComponent(slug),
      ];
      const uniqueSlugs = Array.from(new Set(slugVariations.filter(s => s && s.length > 0)));

      let post: WPPost | null = null;

      for (const slugVar of uniqueSlugs) {
        try {
          const res = await fetch(
            `${WORDPRESS_API_URL}/posts?slug=${slugVar}&_embed=wp:featuredmedia,author,wp:term`, {
            cache: 'no-store'
          });
          if (res.ok) {
            const posts: WPPost[] = await res.json();
            if (posts.length > 0) {
              post = posts[0];
              break;
            }
          }
        } catch {
          continue;
        }
      }

      if (!post) {
        try {
          const res = await fetch(
            `${WORDPRESS_API_URL}/posts?search=${encodeURIComponent(slug.replace(/-/g, ' '))}&per_page=50&_embed=wp:featuredmedia,author,wp:term`, {
            cache: 'no-store'
          });
          if (res.ok) {
            const posts: WPPost[] = await res.json();
            const foundPost = posts.find(p =>
              p.slug.toLowerCase().includes(slug.toLowerCase().replace(/-/g, '')) ||
              p.title.rendered.toLowerCase().includes(slug.toLowerCase().replace(/-/g, ' '))
            );
            if (foundPost) post = foundPost;
          }
        } catch {
          // ignore
        }
      }

      if (!post) return null;
      return processRESTPost(post);
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return null;
    }
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    console.log('Fetching categories (GraphQL)...');
    const { data } = await client.query<GraphQLCategoriesResponse>({
      query: GET_CATEGORIES,
      variables: { first: 100 },
      fetchPolicy: 'no-cache',
    });
    if (data?.categories?.nodes) {
      return graphqlToWpCategories(data.categories.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      const res = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100&orderby=count&order=desc`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
      const categories = await res.json();
      return categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        link: cat.link,
        count: cat.count || 0,
        parent: cat.parent || 0,
      }));
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPostsByCategory(categoryId: number, perPage = 20): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Fetching posts for category ${categoryId} (GraphQL)`);
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_POSTS_BY_CATEGORY,
      variables: { categoryId: String(categoryId), first: perPage },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return graphqlToWpPosts(data.posts.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      return await fetchRESTPosts(
        `${WORDPRESS_API_URL}/posts?categories=${categoryId}&_embed=wp:featuredmedia,author&per_page=${perPage}`
      );
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPostsByCategoryWithChildren(parentCategoryId: number, perPage = 50): Promise<WPPostWithMedia[]> {
  try {
    const allCategories = await getCategories();
    const childCategories = allCategories.filter(cat => cat.parent === parentCategoryId);
    const allCategoryIds = [parentCategoryId, ...childCategories.map(cat => cat.id)];
    const perCategory = Math.max(1, Math.ceil(perPage / allCategoryIds.length));

    const results = await Promise.allSettled(
      allCategoryIds.map(id => getPostsByCategory(id, perCategory))
    );

    const allPosts = results
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => (r as PromiseFulfilledResult<WPPostWithMedia[]>).value);

    const seen = new Set<number>();
    return allPosts.filter(post => {
      if (seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    }).slice(0, perPage);
  } catch (error) {
    console.error('Error fetching parent category posts with children:', error);
    return [];
  }
}

export async function getMediaById(mediaId: number): Promise<WPMedia | null> {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/media/${mediaId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching media ${mediaId}:`, error);
    return null;
  }
}
export async function getTopStories(): Promise<WPPostWithMedia[]> {
  try {
    console.log('Fetching top stories from custom API...');
    const res = await fetch('https://thesun.my/wp-json/thesun/v1/top-stories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`Failed to fetch top stories: ${res.status}`);
    const posts: WPPost[] = await res.json();
    return posts.map((post: WPPost): WPPostWithMedia => {
      const categories = Array.isArray(post.categories)
        ? post.categories.map(cat => typeof cat === 'object' ? (cat as WPCategory).id : cat)
        : [];
      const tags = Array.isArray(post.tags)
        ? post.tags.map(tag => typeof tag === 'object' ? (tag as WPTag).id : tag)
        : [];
      let featured_media_url: string | undefined = undefined;
      let featured_media_alt: string | undefined = undefined;
      let featured_media_width: number | undefined = undefined;
      let featured_media_height: number | undefined = undefined;
      if (post._embedded?.['wp:featuredmedia']?.[0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        featured_media_url = media.source_url;
        featured_media_alt = media.alt_text || post.title.rendered;
        featured_media_width = media.media_details?.width;
        featured_media_height = media.media_details?.height;
      }
      const { _embedded: _emb, ...restPost } = post;
      const postWithMedia: WPPostWithMedia = { ...restPost, categories, tags, authors: post.authors || _emb?.author || [] };
      if (featured_media_url) postWithMedia.featured_media_url = featured_media_url;
      if (featured_media_alt) postWithMedia.featured_media_alt = featured_media_alt;
      if (featured_media_width) postWithMedia.featured_media_width = featured_media_width;
      if (featured_media_height) postWithMedia.featured_media_height = featured_media_height;
      return postWithMedia;
    });
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return await getPosts(10);
  }
}

export async function searchPosts(searchTerm: string, perPage = 20): Promise<WPPostWithMedia[]> {
  try {
    console.log('Searching posts (GraphQL):', searchTerm);
    const { data } = await client.query<GraphQLPostsResponse>({
      query: SEARCH_POSTS,
      variables: { search: searchTerm, first: perPage },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return graphqlToWpPosts(data.posts.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      return await fetchRESTPosts(
        `${WORDPRESS_API_URL}/posts?search=${encodeURIComponent(searchTerm)}&_embed=wp:featuredmedia,author&per_page=${perPage}`
      );
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPostsByAuthor(authorId: number, perPage = 20): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Fetching posts by author ${authorId} (GraphQL)`);
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_POSTS_BY_AUTHOR,
      variables: { authorId: String(authorId), first: perPage },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return graphqlToWpPosts(data.posts.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      return await fetchRESTPosts(
        `${WORDPRESS_API_URL}/posts?ppma_author=${authorId}&_embed=wp:featuredmedia,author,wp:term&per_page=${perPage}`
      );
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPage(slug: string): Promise<WPPostWithMedia | null> {
  try {
    console.log('Fetching page by slug (GraphQL):', slug);
    const { data } = await client.query<{ page: { id: string; slug: string; title: string; content: string; featuredImage?: { node: { sourceUrl: string; altText: string } } } }>({
      query: GET_PAGE_BY_SLUG,
      variables: { slug },
      fetchPolicy: 'no-cache',
    });
    if (data?.page) {
      const page = data.page;
      const pageWithMedia: WPPostWithMedia = {
        id: parseInt(page.id),
        slug: page.slug,
        title: { rendered: page.title },
        content: { rendered: page.content, protected: false },
        excerpt: { rendered: '', protected: false },
        date: '',
        date_gmt: '',
        modified: '',
        modified_gmt: '',
        status: 'publish',
        type: 'page',
        link: `/${page.slug}`,
        author: 0,
        featured_media: 0,
        comment_status: 'closed',
        ping_status: 'closed',
        sticky: false,
        template: '',
        format: 'standard',
        meta: { footnotes: '' },
        categories: [],
        tags: [],
        featured_media_url: page.featuredImage?.node?.sourceUrl || null,
        featured_media_alt: page.featuredImage?.node?.altText || null,
      };
      return pageWithMedia;
    }
    throw new Error('Page not found via GraphQL');
  } catch (graphqlError) {
    console.log('GraphQL error, falling back to REST for page slug:', slug, graphqlError);
    try {
      const res = await fetch(
        `${WORDPRESS_API_URL}/pages?slug=${slug}&_embed=wp:featuredmedia,author`, {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      const pages: WPPost[] = await res.json();
      if (!pages.length) return null;
      return processRESTPost(pages[0]);
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return null;
    }
  }
}
export async function getTags(): Promise<WPTag[]> {
  try {
    console.log('Fetching tags (GraphQL)...');
    const { data } = await client.query<GraphQLTagsResponse>({
      query: GET_TAGS,
      variables: { first: 100 },
      fetchPolicy: 'no-cache',
    });
    if (data?.tags?.nodes) {
      return graphqlToWpTags(data.tags.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      const res = await fetch(`${WORDPRESS_API_URL}/tags?per_page=100&orderby=count&order=desc`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Failed to fetch tags: ${res.status}`);
      const tags = await res.json();
      return tags.map((tag: any) => ({ id: tag.id, name: tag.name, slug: tag.slug }));
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getTagsByIds(tagIds: number[]): Promise<WPTag[]> {
  try {
    if (!tagIds || tagIds.length === 0) return [];
    console.log(`Fetching ${tagIds.length} tags by ID...`);
    const ids = tagIds.join(',');
    const res = await fetch(`${WORDPRESS_API_URL}/tags?include=${ids}&per_page=${tagIds.length}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return [];
    const tags = await res.json();
    return tags.map((tag: any) => ({ id: tag.id, name: tag.name, slug: tag.slug }));
  } catch (error) {
    console.error('Error fetching tags by IDs:', error);
    return [];
  }
}

export async function getPostsByTag(tagId: number, perPage = 10): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Fetching posts for tag ${tagId} (GraphQL)`);
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_POSTS_BY_TAG,
      variables: { tagId: String(tagId), first: perPage },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return graphqlToWpPosts(data.posts.nodes);
    }
    throw new Error('No data from GraphQL');
  } catch (graphqlError) {
    console.error('GraphQL error, falling back to REST:', graphqlError);
    try {
      return await fetchRESTPosts(
        `${WORDPRESS_API_URL}/posts?tags=${tagId}&_embed=wp:featuredmedia,author&per_page=${perPage}&orderby=date&order=desc`
      );
    } catch (restError) {
      console.error('REST fallback also failed:', restError);
      return [];
    }
  }
}

export async function getPostsByTagSlug(tagSlug: string, perPage = 10): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Looking for tag with slug: "${tagSlug}"`);
    const tagsResponse = await fetch(`${WORDPRESS_API_URL}/tags?slug=${tagSlug}`);
    if (!tagsResponse.ok) return [];
    const tags = await tagsResponse.json();
    if (tags.length === 0) return [];
    const tagId = tags[0].id;
    return await getPostsByTag(tagId, perPage);
  } catch (error) {
    console.error('Error fetching posts by tag slug:', error);
    return [];
  }
}

export async function getExclusivePosts(perPage = 10): Promise<WPPostWithMedia[]> {
  try {
    console.log('Fetching exclusive posts...');
    const possibleTagSlugs = ['exclusive', 'exclusive-story', 'exclusive-news', 'the-sun-exclusive', 'sun-exclusive'];
    let exclusivePosts: WPPostWithMedia[] = [];
    for (const tagSlug of possibleTagSlugs) {
      const posts = await getPostsByTagSlug(tagSlug, perPage);
      if (posts.length > 0) { exclusivePosts = posts; break; }
    }
    if (exclusivePosts.length === 0) {
      const allTags = await getTags();
      const exclusiveTags = allTags.filter(tag =>
        tag.name.toLowerCase().includes('exclusive') || tag.slug.toLowerCase().includes('exclusive')
      );
      if (exclusiveTags.length > 0) {
        exclusivePosts = await getPostsByTag(exclusiveTags[0].id, perPage);
      }
    }
    return exclusivePosts;
  } catch (error) {
    console.error('Error fetching exclusive posts:', error);
    return [];
  }
}

export async function getLatestExclusivePost(): Promise<WPPostWithMedia | null> {
  try {
    console.log('Fetching latest exclusive post...');
    const exclusivePosts = await getExclusivePosts(1);
    return exclusivePosts.length > 0 ? exclusivePosts[0] : null;
  } catch (error) {
    console.error('Error getting latest exclusive post:', error);
    return null;
  }
}

export function hasExclusiveTag(post: WPPostWithMedia): boolean {
  if (!post.tags || post.tags.length === 0) return false;
  return post.tags.length > 0;
}

export async function getPostsByMultipleTags(tagIds: number[], perPage = 10): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Fetching posts with tags: ${tagIds.join(', ')}`);
    const tagQuery = tagIds.map(id => `tags[]=${id}`).join('&');
    const res = await fetch(
      `${WORDPRESS_API_URL}/posts?${tagQuery}&_embed=wp:featuredmedia,author&per_page=${perPage}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch posts by multiple tags: ${res.status}`);
    const posts: WPPost[] = await res.json();
    return posts.map(processRESTPost);
  } catch (error) {
    console.error('Error fetching posts by multiple tags:', error);
    return [];
  }
}

export async function testWordPressAPI(): Promise<{success: boolean; message: string; data?: any}> {
  try {
    console.log('Testing GraphQL API connection...');
    const { data } = await client.query<GraphQLPostsResponse>({
      query: GET_POSTS,
      variables: { first: 1 },
      fetchPolicy: 'no-cache',
    });
    if (data?.posts?.nodes) {
      return { success: true, message: 'GraphQL Connected!', data };
    }
    throw new Error('GraphQL returned no data');
  } catch (graphqlError) {
    console.log('GraphQL failed, trying REST:', graphqlError);
    try {
      const res = await fetch(`${WORDPRESS_API_URL}/posts?per_page=1&_embed=wp:featuredmedia`);
      if (!res.ok) return { success: false, message: `API Error: ${res.status} ${res.statusText}` };
      const data = await res.json();
      return { success: true, message: `REST API Connected! Found ${data.length} posts`, data };
    } catch (error) {
      return { success: false, message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
}

export async function getPopularPosts(limit = 10): Promise<WPPostWithMedia[]> {
  try {
    return await getPosts(limit);
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

export async function getTrendingPosts(limit = 10): Promise<WPPostWithMedia[]> {
  try {
    const allPosts = await getPosts(50);
    const shuffled = [...allPosts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}
export async function getTagByName(tagName: string): Promise<WPTag | null> {
  try {
    const tags = await getTags();
    const tag = tags.find(t =>
      t.name.toLowerCase() === tagName.toLowerCase() ||
      t.slug.toLowerCase() === tagName.toLowerCase()
    );
    return tag || null;
  } catch (error) {
    console.error('Error getting tag by name:', error);
    return null;
  }
}

export async function searchTags(searchTerm: string): Promise<WPTag[]> {
  try {
    const tags = await getTags();
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching tags:', error);
    return [];
  }
}

export function getShortenedCategorySlug(categorySlug: string): string {
  if (!categorySlug) return 'news';
  const cleanSlug = categorySlug.toLowerCase().trim();
  const slugMappings: Record<string, string> = {
    'berita-nasional': 'news',
    'berita-internasional': 'world',
    'sukan': 'sports',
    'hiburan': 'entertainment',
    'gaya-hidup': 'lifestyle',
    'teknologi': 'tech',
    'ekonomi': 'business',
    'politik': 'politics',
    'kesihatan': 'health',
    'pendidikan': 'education',
    'agama': 'religion',
    'travel': 'travel',
    'makanan': 'food',
    'fesyen': 'fashion',
    'otomotif': 'automotive',
    'jenayah': 'crime',
    'pendapat': 'opinion',
    'going-viral': 'going-viral',
    'sedang-viral': 'going-viral',
    'malaysia': 'malaysia-news',
    'malaysia-news': 'malaysia-news',
    'malaysia news': 'malaysia-news',
    'people & issues': 'people-issues',
    'food & beverage': 'food-beverage',
    'health & wellness': 'health-wellness',
    'business': 'business',
    'finance': 'business',
    'economy': 'business',
    'local': 'news',
    'national': 'news',
    'international': 'world',
    'world': 'world',
    'entertainment': 'entertainment',
    'lifestyle': 'lifestyle',
    'sports': 'sports',
    'tech': 'tech',
    'technology': 'tech',
    'health': 'health',
    'education': 'education',
    'religion': 'religion',
    'food': 'food',
    'fashion': 'fashion',
    'automotive': 'automotive',
    'crime': 'crime',
    'opinion': 'opinion'
  };
  const mappedSlug = slugMappings[cleanSlug];
  if (mappedSlug) return mappedSlug;
  return cleanSlug
    .replace(/&/g, '-and-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'news';
}

export function getOriginalCategorySlug(shortSlug: string): string {
  if (!shortSlug) return 'berita-nasional';
  const cleanShortSlug = shortSlug.toLowerCase().trim();
  const reverseMappings: Record<string, string> = {
    'news': 'berita-nasional',
    'world': 'berita-internasional',
    'sports': 'sukan',
    'entertainment': 'hiburan',
    'lifestyle': 'gaya-hidup',
    'tech': 'teknologi',
    'business': 'ekonomi',
    'politics': 'politik',
    'health': 'kesihatan',
    'education': 'pendidikan',
    'religion': 'agama',
    'travel': 'travel',
    'food': 'makanan',
    'fashion': 'fesyen',
    'automotive': 'otomotif',
    'crime': 'jenayah',
    'opinion': 'pendapat',
    'going-viral': 'going-viral',
    'malaysia-news': 'malaysia',
    'malaysia news': 'malaysia',
    'people-issues': 'people & issues',
    'food-beverage': 'food & beverage',
    'health-wellness': 'health & wellness',
    'finance': 'business',
    'economy': 'business',
    'local': 'news',
    'national': 'news',
    'international': 'world',
    'technology': 'tech'
  };
  const originalSlug = reverseMappings[cleanShortSlug];
  if (originalSlug) return originalSlug;
  return cleanShortSlug;
}

export async function getCategoryById(categoryId: number): Promise<WPCategory | null> {
  try {
    const categories = await getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    return category || null;
  } catch (error) {
    console.error('Error getting category by ID:', error);
    return null;
  }
}

export async function getCategoryHierarchy(categoryId: number): Promise<WPCategory[]> {
  try {
    const categories = await getCategories();
    const hierarchy: WPCategory[] = [];
    let currentId: number | undefined = categoryId;
    while (currentId) {
      const category = categories.find(cat => cat.id === currentId);
      if (!category) break;
      hierarchy.unshift(category);
      currentId = category.parent && category.parent > 0 ? category.parent : undefined;
    }
    return hierarchy;
  } catch (error) {
    console.error('Error getting category hierarchy:', error);
    return [];
  }
}

export async function getParentCategories(): Promise<WPCategory[]> {
  try {
    const categories = await getCategories();
    return categories.filter(cat => !cat.parent || cat.parent === 0);
  } catch (error) {
    console.error('Error getting parent categories:', error);
    return [];
  }
}

export async function getChildCategories(parentId: number): Promise<WPCategory[]> {
  try {
    const categories = await getCategories();
    return categories.filter(cat => cat.parent === parentId);
  } catch (error) {
    console.error('Error getting child categories:', error);
    return [];
  }
}
export function generatePostUrl(post: WPPostWithMedia, allCategories?: WPCategory[]): string {
  if (!post) return '/';
  const categoryPath = resolvePostCategoryPath(post, allCategories);
  const cleanCategoryPath = cleanCategoryPathForUrl(categoryPath);
  const cleanPostSlug = post.slug.toLowerCase().replace(/[^\w\-]/g, '').trim();
  return `/${cleanCategoryPath}/${cleanPostSlug}`;
}

function sortCategoriesByHierarchy(categories: WPCategory[]): WPCategory[] {
  const rootCategories = categories.filter(cat => !cat.parent || cat.parent === 0);
  const childCategories = categories.filter(cat => cat.parent && cat.parent > 0);
  const sorted: WPCategory[] = [];
  sorted.push(...rootCategories);
  for (const child of childCategories) {
    const parentIndex = sorted.findIndex(cat => cat.id === child.parent);
    if (parentIndex !== -1) {
      sorted.splice(parentIndex + 1, 0, child);
    } else {
      sorted.push(child);
    }
  }
  return sorted;
}

function cleanCategoryPathForUrl(path: string): string {
  return path
    .toLowerCase()
    .replace(/&/g, '-and-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\/]/g, '')
    .replace(/\/+/g, '/')
    .replace(/^-+|-+$/g, '')
    .replace(/^\/+|\/+$/g, '') || 'news';
}

export function getPostUrl(post: WPPostWithMedia | WPPost, allCategories?: WPCategory[]): string {
  if (!post) return '/';
  const categoryPath = resolvePostCategoryPath(post, allCategories);
  const cleanCategoryPath = cleanCategoryPathForUrl(categoryPath);
  const cleanPostSlug = post.slug.toLowerCase().replace(/[^\w\-]/g, '').trim();
  const url = `/${cleanCategoryPath}/${cleanPostSlug}`;
  if (process.env.NODE_ENV === 'development') {
    console.log('getPostUrl generated:', {
      postId: post.id,
      postSlug: post.slug,
      categoryPath,
      cleanCategoryPath,
      cleanPostSlug,
      finalUrl: url,
      hasEmbedded: !!(post as WPPostWithMedia)._embedded,
      categories: post.categories
    });
  }
  return url;
}

export async function getTopStoriesWithCategories(): Promise<WPPostWithMedia[]> {
  try {
    console.log('Fetching top stories with categories...');
    const res = await fetch('https://thesun.my/wp-json/thesun/v1/top-stories', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error(`Failed to fetch top stories: ${res.status}`);
    const posts: WPPost[] = await res.json();
    const allCategories = await getCategories();
    return posts.map((post: WPPost): WPPostWithMedia => {
      let categories: number[] = [];
      if (Array.isArray(post.categories)) {
        categories = post.categories.map(cat => {
          if (typeof cat === 'number') return cat;
          else if (typeof cat === 'object' && cat !== null) {
            const categoryObj = cat as any;
            return categoryObj.id || categoryObj.term_id || 0;
          }
          return 0;
        }).filter(id => id !== 0);
      }
      const tags = Array.isArray(post.tags)
        ? post.tags.map(tag => typeof tag === 'object' ? (tag as WPTag).id : tag)
        : [];
      let featured_media_url: string | undefined = undefined;
      let featured_media_alt: string | undefined = undefined;
      if (post._embedded?.['wp:featuredmedia']?.[0]) {
        const media = post._embedded['wp:featuredmedia'][0];
        featured_media_url = media.source_url;
        featured_media_alt = media.alt_text || post.title.rendered;
      }
      const { _embedded: _emb, ...restPost } = post;
      const postWithMedia: WPPostWithMedia = { ...restPost, categories, tags, authors: post.authors || _emb?.author || [] };
      if (featured_media_url) postWithMedia.featured_media_url = featured_media_url;
      if (featured_media_alt) postWithMedia.featured_media_alt = featured_media_alt;
      if (process.env.NODE_ENV === 'development' && categories.length > 0) {
        const firstCategoryId = categories[0];
        const categoryInfo = allCategories.find(c => c.id === firstCategoryId);
        console.log(`Post ${post.id} category mapping:`, {
          postId: post.id,
          originalCategories: post.categories,
          mappedCategoryIds: categories,
          categoryName: categoryInfo?.name || 'Not found'
        });
      }
      return postWithMedia;
    });
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return await getPosts(10);
  }
}
export async function getAuthorBySlug(slug: string): Promise<WPAuthor | null> {
  try {
    console.log(`Looking for author with slug: "${slug}"`);
    const url = `${WORDPRESS_API_URL}/users?slug=${slug}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return null;
    const users = await res.json();
    if (users.length === 0) {
      return await getAuthorBySlugFallback(slug);
    }
    const user = users[0];
    const author: WPAuthor = {
      term_id: user.id || 0,
      user_id: user.id || 0,
      is_guest: 0,
      slug: user.slug || slug,
      job_title: user.description || '',
      display_name: user.name || '',
      avatar_url: {
        url: user.avatar_urls?.['96'] || '/default-avatar.png',
        url2x: user.avatar_urls?.['192'] || '/default-avatar.png'
      },
      author_category: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      description: user.description || user.bio || ''
    };
    return author;
  } catch (err) {
    console.error('Error getAuthorBySlug:', err);
    return null;
  }
}

async function getAuthorBySlugFallback(slug: string): Promise<WPAuthor | null> {
  try {
    console.log(`Fallback: Looking for author via posts with slug: "${slug}"`);
    const url = `${WORDPRESS_API_URL}/posts?author_slug=${slug}&per_page=1&_embed=author`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const posts = await res.json();
    if (posts.length === 0 || !posts[0]._embedded?.author?.[0]) return null;
    const rawAuthor = posts[0]._embedded.author[0];
    return {
      term_id: rawAuthor.id || rawAuthor.term_id || 0,
      user_id: rawAuthor.user_id || 0,
      is_guest: rawAuthor.is_guest || 0,
      slug: rawAuthor.slug || slug,
      job_title: rawAuthor.job_title || '',
      display_name: rawAuthor.name || rawAuthor.display_name || 'Penulis',
      avatar_url: {
        url: rawAuthor.avatar_urls?.['96'] || rawAuthor.avatar_url?.url || '/default-avatar.png',
        url2x: rawAuthor.avatar_urls?.['192'] || rawAuthor.avatar_url?.url2x || ''
      },
      author_category: rawAuthor.author_category || '',
      first_name: rawAuthor.first_name || '',
      last_name: rawAuthor.last_name || '',
      description: rawAuthor.description || rawAuthor.bio || ''
    };
  } catch (err) {
    console.error('Error getAuthorBySlugFallback:', err);
    return null;
  }
}

export async function getPostsByAuthorSlug(
  authorSlug: string,
  perPage: number = 12,
  page: number = 1
): Promise<WPPostWithMedia[]> {
  try {
    console.log(`Fetching posts by author slug: "${authorSlug}"`);
    const author = await getAuthorBySlug(authorSlug);
    if (!author?.term_id) return [];
    const posts = await getPostsByAuthor(author.term_id, perPage);
    return posts;
  } catch (err) {
    console.error('Error getPostsByAuthorSlug:', err);
    return [];
  }
}

export async function getAllAuthors(): Promise<WPAuthor[]> {
  try {
    console.log('Fetching authors from posts data...');
    const authors = new Map<string, { author: WPAuthor; postCount: number }>();
    let page = 1;
    const perPage = 50;
    let hasMore = true;
    while (hasMore && page <= 10) {
      try {
        const postsRes = await fetch(
          `https://thesun.my/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 3600 }
          }
        );
        if (!postsRes.ok) break;
        const posts = await postsRes.json();
        if (posts.length === 0) { hasMore = false; break; }
        posts.forEach((post: any) => {
          if (post.authors && Array.isArray(post.authors) && post.authors.length > 0) {
            post.authors.forEach((rawAuthor: any) => {
              const authorSlug = rawAuthor.slug ||
                rawAuthor.display_name?.toLowerCase().replace(/\s+/g, '-') ||
                `author-${rawAuthor.term_id}`;
              if (!authorSlug) return;
              const existing = authors.get(authorSlug);
              const postCount = (existing?.postCount || 0) + 1;
              const author: WPAuthor = {
                term_id: rawAuthor.term_id || 0,
                user_id: rawAuthor.user_id || 0,
                is_guest: rawAuthor.is_guest || 0,
                slug: authorSlug,
                job_title: rawAuthor.job_title || '',
                display_name: rawAuthor.display_name || 'Penulis',
                avatar_url: {
                  url: rawAuthor.avatar_url?.url || '',
                  url2x: rawAuthor.avatar_url?.url2x || ''
                },
                author_category: rawAuthor.author_category || '',
                first_name: rawAuthor.first_name || '',
                last_name: rawAuthor.last_name || '',
                description: rawAuthor.description || ''
              };
              authors.set(authorSlug, { author, postCount });
            });
          } else if (post._embedded?.author?.[0]) {
            const rawAuthor = post._embedded.author[0];
            const authorSlug = rawAuthor.slug ||
              rawAuthor.name?.toLowerCase().replace(/\s+/g, '-') ||
              `author-${rawAuthor.id || rawAuthor.term_id}`;
            if (!authorSlug) return;
            const existing = authors.get(authorSlug);
            const postCount = (existing?.postCount || 0) + 1;
            const author: WPAuthor = {
              term_id: rawAuthor.id || rawAuthor.term_id || 0,
              user_id: rawAuthor.user_id || 0,
              is_guest: rawAuthor.is_guest || 0,
              slug: authorSlug,
              job_title: rawAuthor.job_title || '',
              display_name: rawAuthor.name || rawAuthor.display_name || 'Penulis',
              avatar_url: {
                url: rawAuthor.avatar_urls?.['96'] || rawAuthor.avatar_url?.url || '',
                url2x: rawAuthor.avatar_urls?.['192'] || rawAuthor.avatar_url?.url2x || ''
              },
              author_category: rawAuthor.author_category || '',
              first_name: rawAuthor.first_name || '',
              last_name: rawAuthor.last_name || '',
              description: rawAuthor.description || ''
            };
            authors.set(authorSlug, { author, postCount });
          }
          if (post.ppma_author && Array.isArray(post.ppma_author) && post.ppma_author.length > 0) {
            post.ppma_author.forEach((ppmaId: number) => {
              const authorSlug = `ppma-${ppmaId}`;
              const existing = authors.get(authorSlug);
              const postCount = (existing?.postCount || 0) + 1;
              if (!existing) {
                const author: WPAuthor = {
                  term_id: ppmaId, user_id: ppmaId, is_guest: 1,
                  slug: authorSlug, job_title: '',
                  display_name: `Author ${ppmaId}`,
                  avatar_url: { url: '', url2x: '' },
                  author_category: '', first_name: '', last_name: '', description: ''
                };
                authors.set(authorSlug, { author, postCount });
              } else {
                authors.set(authorSlug, { ...existing, postCount });
              }
            });
          }
        });
        const totalPages = postsRes.headers.get('X-WP-TotalPages');
        if (totalPages && parseInt(totalPages) <= page) hasMore = false;
        page++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        hasMore = false;
      }
    }
    const authorsArray = Array.from(authors.values())
      .map(item => item.author)
      .filter(author => {
        const slug = author.slug.toLowerCase();
        const name = author.display_name.toLowerCase();
        const isAdminLike =
          slug.includes('admin') || name.includes('admin') ||
          slug.includes('web') || slug.includes('dev') ||
          slug.includes('sys') || slug.includes('tech') ||
          slug.includes('test') ||
          author.display_name === 'Penulis' || author.display_name === 'Author';
        return !isAdminLike;
      });
    return authorsArray;
  } catch (error) {
    console.error('Error fetching authors from posts:', error);
    return [];
  }
}

export async function getAuthorPostCount(authorId: number, authorSlug?: string): Promise<number> {
  try {
    const methods = [
      async () => {
        const res = await fetch(
          `https://thesun.my/wp-json/wp/v2/posts?ppma_author=${authorId}&per_page=1`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' }, next: { revalidate: 300 } }
        );
        if (res.ok) {
          const total = res.headers.get('X-WP-Total');
          if (total) { const count = parseInt(total); if (count > 0) return count; }
        }
        return 0;
      },
      async () => {
        const res = await fetch(
          `https://thesun.my/wp-json/wp/v2/posts?author=${authorId}&per_page=1`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' }, next: { revalidate: 300 } }
        );
        if (res.ok) {
          const total = res.headers.get('X-WP-Total');
          if (total) { const count = parseInt(total); if (count > 0) return count; }
        }
        return 0;
      },
      async () => {
        if (!authorSlug) return 0;
        const res = await fetch(
          `https://thesun.my/wp-json/wp/v2/posts?author_slug=${authorSlug}&per_page=1`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' }, next: { revalidate: 300 } }
        );
        if (res.ok) {
          const total = res.headers.get('X-WP-Total');
          if (total) { const count = parseInt(total); if (count > 0) return count; }
        }
        return 0;
      }
    ];
    for (const method of methods) {
      try {
        const count = await Promise.race([
          method(),
          new Promise<number>(resolve => setTimeout(() => resolve(0), 2000))
        ]);
        if (count > 0) return count;
      } catch {
        continue;
      }
    }
    return 0;
  } catch (error) {
    console.error(`Error getting post count for author ${authorId}:`, error);
    return 0;
  }
}
