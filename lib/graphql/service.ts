import { gql } from '@apollo/client';
import client from './client';
import * as queries from './queries';
import { 
  graphqlToWpPosts, 
  graphqlToWpPost, 
  graphqlToWpCategories, 
  graphqlToWpTags 
} from './utils';
import { 
  GraphQLPostsResponse, 
  GraphQLPostResponse, 
  GraphQLCategoriesResponse,
  GraphQLTagsResponse 
} from './types';
import { WPPostWithMedia, WPCategory, WPTag } from '../../types/wordpress';

/**
 * Get posts using GraphQL
 */
export async function getPostsGraphQL(
  first: number = 20, 
  after?: string
): Promise<WPPostWithMedia[]> {
  try {
    console.log('🔗 GraphQL: Fetching posts', { first, after });
    
    const result = await client.query<GraphQLPostsResponse>({
      query: queries.GET_POSTS,
      variables: { first, after },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Posts fetched', result.data.posts.nodes.length);
    return graphqlToWpPosts(result.data.posts.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error fetching posts:', error);
    return [];
  }
}

/**
 * Get single post by slug using GraphQL
 */
export async function getPostBySlugGraphQL(slug: string): Promise<WPPostWithMedia | null> {
  try {
    console.log('🔗 GraphQL: Fetching post by slug', slug);
    
    const result = await client.query<GraphQLPostResponse>({
      query: queries.GET_POST_BY_SLUG,
      variables: { slug },
    });
    
    if (!result.data || !result.data.post) {
      console.log('⚠️ GraphQL: Post not found', slug);
      return null;
    }
    
    console.log('✅ GraphQL: Post fetched', result.data.post.title);
    return graphqlToWpPost(result.data.post);
  } catch (error) {
    console.error('💥 GraphQL Error fetching post:', error);
    return null;
  }
}

/**
 * Get categories using GraphQL
 */
export async function getCategoriesGraphQL(first: number = 100): Promise<WPCategory[]> {
  try {
    console.log('🔗 GraphQL: Fetching categories');
    
    const result = await client.query<GraphQLCategoriesResponse>({
      query: queries.GET_CATEGORIES,
      variables: { first },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Categories fetched', result.data.categories.nodes.length);
    return graphqlToWpCategories(result.data.categories.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error fetching categories:', error);
    return [];
  }
}

/**
 * Get tags using GraphQL
 */
export async function getTagsGraphQL(first: number = 100): Promise<WPTag[]> {
  try {
    console.log('🔗 GraphQL: Fetching tags');
    
    const result = await client.query<GraphQLTagsResponse>({
      query: queries.GET_TAGS,
      variables: { first },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Tags fetched', result.data.tags.nodes.length);
    return graphqlToWpTags(result.data.tags.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error fetching tags:', error);
    return [];
  }
}

/**
 * Get posts by category using GraphQL
 */
export async function getPostsByCategoryGraphQL(
  categoryId: number, 
  first: number = 20, 
  after?: string
): Promise<WPPostWithMedia[]> {
  try {
    console.log('🔗 GraphQL: Fetching posts by category', categoryId);
    
    const result = await client.query<GraphQLPostsResponse>({
      query: queries.GET_POSTS_BY_CATEGORY,
      variables: { categoryId, first, after },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Category posts fetched', result.data.posts.nodes.length);
    return graphqlToWpPosts(result.data.posts.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error fetching category posts:', error);
    return [];
  }
}

/**
 * Get posts by tag using GraphQL
 */
export async function getPostsByTagGraphQL(
  tagId: number, 
  first: number = 20, 
  after?: string
): Promise<WPPostWithMedia[]> {
  try {
    console.log('🔗 GraphQL: Fetching posts by tag', tagId);
    
    const result = await client.query<GraphQLPostsResponse>({
      query: queries.GET_POSTS_BY_TAG,
      variables: { tagId, first, after },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Tag posts fetched', result.data.posts.nodes.length);
    return graphqlToWpPosts(result.data.posts.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error fetching tag posts:', error);
    return [];
  }
}

/**
 * Search posts using GraphQL
 */
export async function searchPostsGraphQL(
  searchTerm: string, 
  first: number = 20, 
  after?: string
): Promise<WPPostWithMedia[]> {
  try {
    console.log('🔗 GraphQL: Searching posts', searchTerm);
    
    const result = await client.query<GraphQLPostsResponse>({
      query: queries.SEARCH_POSTS,
      variables: { search: searchTerm, first, after },
    });
    
    if (!result.data) {
      console.error('❌ GraphQL: No data returned');
      return [];
    }
    
    console.log('✅ GraphQL: Search results', result.data.posts.nodes.length);
    return graphqlToWpPosts(result.data.posts.nodes);
  } catch (error) {
    console.error('💥 GraphQL Error searching posts:', error);
    return [];
  }
}

/**
 * Get page by slug using GraphQL
 */
export async function getPageBySlugGraphQL(slug: string): Promise<WPPostWithMedia | null> {
  try {
    console.log('🔗 GraphQL: Fetching page by slug', slug);
    
    const result = await client.query<any>({
      query: queries.GET_PAGE_BY_SLUG,
      variables: { slug },
    });
    
    if (!result.data || !result.data.page) {
      console.log('⚠️ GraphQL: Page not found', slug);
      return null;
    }
    
    // Convert page to WPPostWithMedia format
    const page: WPPostWithMedia = {
      id: parseInt(result.data.page.id),
      slug: result.data.page.slug,
      title: {
        rendered: result.data.page.title,
      },
      content: {
        rendered: result.data.page.content,
        protected: false,
      },
      excerpt: {
        rendered: '',
        protected: false,
      },
      date: '',
      date_gmt: '',
      modified: '',
      modified_gmt: '',
      status: 'publish',
      type: 'page',
      link: `/${result.data.page.slug}`,
      author: 0,
      featured_media: 0,
      comment_status: 'closed',
      ping_status: 'closed',
      sticky: false,
      template: '',
      format: 'standard',
      meta: {
        footnotes: '',
      },
      categories: [],
      tags: [],
      authors: [],
    };
    
    if (result.data.page.featuredImage) {
      page.featured_media_url = result.data.page.featuredImage.node.sourceUrl;
      page.featured_media_alt = result.data.page.featuredImage.node.altText;
    }
    
    console.log('✅ GraphQL: Page fetched', result.data.page.title);
    return page;
  } catch (error) {
    console.error('💥 GraphQL Error fetching page:', error);
    return null;
  }
}

/**
 * Test GraphQL connection
 */
export async function testGraphQLConnection(): Promise<{success: boolean; message: string; data?: any}> {
  try {
    console.log('🧪 Testing GraphQL connection...');
    
    const result = await client.query({
      query: gql`
        query TestConnection {
          posts(first: 1) {
            nodes {
              id
              title
            }
          }
        }
      `,
    });
    
    if (!result.data) {
      return {
        success: false,
        message: '❌ GraphQL: No data returned'
      };
    }
    
    const data = result.data as any;
    
    return {
      success: true,
      message: `✅ GraphQL Connected! Found ${data.posts.nodes.length} posts`,
      data: data.posts.nodes
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ GraphQL Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}