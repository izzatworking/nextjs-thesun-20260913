import { GraphQLPost, GraphQLCategory, GraphQLTag } from './types';
import { WPPost, WPCategory, WPTag, WPAuthor, WPPostWithMedia } from '../../types/wordpress';

/**
 * Convert GraphQL Post to WordPress Post
 */
function decodeBase64Id(encoded: string): number {
  try {
    const decoded = atob(encoded);
    const match = decoded.match(/\d+/);
    return match ? parseInt(match[0]) : NaN;
  } catch {
    return parseInt(encoded);
  }
}

export function graphqlToWpPost(graphqlPost: GraphQLPost): WPPostWithMedia {
  // Convert categories
  const categoryNodes = graphqlPost.categories?.nodes || [];
  const categories = categoryNodes.map(cat => decodeBase64Id(cat.id)) || [];
  
  // Convert tags
  const tags = graphqlPost.tags?.nodes.map(tag => decodeBase64Id(tag.id)) || [];
  
  // Convert author
  const authors: WPAuthor[] = [];
  if (graphqlPost.author) {
    authors.push({
      term_id: 0, // GraphQL tidak provide term_id
      user_id: 0,
      is_guest: 0,
      slug: graphqlPost.author.node.name.toLowerCase().replace(/\s+/g, '-'),
      job_title: '',
      display_name: graphqlPost.author.node.name,
      avatar_url: {
        url: graphqlPost.author.node.avatar?.url || '',
        url2x: graphqlPost.author.node.avatar?.url || '',
      },
      author_category: '',
      first_name: '',
      last_name: '',
      description: graphqlPost.author.node.description,
    });
  }
  
  // Create WPPostWithMedia object
  const wpPost: WPPostWithMedia = {
    id: decodeBase64Id(graphqlPost.id),
    slug: graphqlPost.slug,
    title: {
      rendered: graphqlPost.title,
    },
    content: {
      rendered: graphqlPost.content,
      protected: false,
    },
    excerpt: {
      rendered: graphqlPost.excerpt,
      protected: false,
    },
    date: graphqlPost.date,
    date_gmt: graphqlPost.date,
    modified: graphqlPost.modified,
    modified_gmt: graphqlPost.modified,
    status: 'publish',
    type: 'post',
    link: `/${graphqlPost.slug}`,
    author: authors.length > 0 ? authors[0].user_id : 0,
    featured_media: 0, // GraphQL tidak provide media ID
    comment_status: 'open',
    ping_status: 'open',
    sticky: false,
    template: '',
    format: 'standard',
    meta: {
      footnotes: '',
    },
    categories,
    tags,
    authors,
  };

  // Keep raw category slugs from GraphQL so URL generation works on the
  // client too (where the global category list is not available).
  if (categoryNodes.length > 0) {
    wpPost.category_slugs = categoryNodes.map(cat => cat.slug).filter(Boolean);
  }
  
  // Add featured media properties
  if (graphqlPost.featuredImage) {
    wpPost.featured_media_url = graphqlPost.featuredImage.node.sourceUrl;
    wpPost.featured_media_alt = graphqlPost.featuredImage.node.altText;
    wpPost.featured_media_width = graphqlPost.featuredImage.node.mediaDetails?.width || null;
    wpPost.featured_media_height = graphqlPost.featuredImage.node.mediaDetails?.height || null;
  }
  
  return wpPost;
}

/**
 * Convert GraphQL Category to WordPress Category
 */
export function graphqlToWpCategory(graphqlCategory: GraphQLCategory['node']): WPCategory {
  return {
    id: decodeBase64Id(graphqlCategory.id),
    name: graphqlCategory.name,
    slug: graphqlCategory.slug,
    count: graphqlCategory.count || 0,
    parent: graphqlCategory.parent?.node ? decodeBase64Id(graphqlCategory.parent.node.id) : 0,
  };
}

/**
 * Convert GraphQL Tag to WordPress Tag
 */
export function graphqlToWpTag(graphqlTag: GraphQLTag['node']): WPTag {
  return {
    id: decodeBase64Id(graphqlTag.id),
    name: graphqlTag.name,
    slug: graphqlTag.slug,
  };
}

/**
 * Convert multiple GraphQL Posts to WordPress Posts
 */
export function graphqlToWpPosts(graphqlPosts: GraphQLPost[]): WPPostWithMedia[] {
  return graphqlPosts.map(graphqlToWpPost);
}

/**
 * Convert multiple GraphQL Categories to WordPress Categories
 */
export function graphqlToWpCategories(graphqlCategories: GraphQLCategory['node'][]): WPCategory[] {
  return graphqlCategories.map(graphqlToWpCategory);
}

/**
 * Convert multiple GraphQL Tags to WordPress Tags
 */
export function graphqlToWpTags(graphqlTags: GraphQLTag['node'][]): WPTag[] {
  return graphqlTags.map(graphqlToWpTag);
}