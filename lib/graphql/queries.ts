import { gql } from '@apollo/client';

// Fragments untuk reusable query parts
export const POST_FRAGMENT = gql`
  fragment PostFragment on Post {
    id
    slug
    title
    excerpt
    content
    date
    modified
  }
`;

export const POST_WITH_MEDIA_FRAGMENT = gql`
  fragment PostWithMediaFragment on Post {
    ...PostFragment
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
  }
  ${POST_FRAGMENT}
`;

export const POST_WITH_RELATIONS_FRAGMENT = gql`
  fragment PostWithRelationsFragment on Post {
    ...PostWithMediaFragment
    categories {
      nodes {
        id
        name
        slug
      }
    }
    tags {
      nodes {
        id
        name
        slug
      }
    }
    author {
      node {
        name
        description
        avatar {
          url
        }
      }
    }
  }
  ${POST_WITH_MEDIA_FRAGMENT}
`;

// Main Queries
export const GET_POSTS = gql`
  query GetPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        ...PostWithRelationsFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostWithRelationsFragment
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      ...PostWithRelationsFragment
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const GET_CATEGORIES = gql`
  query GetCategories($first: Int = 100) {
    categories(first: $first) {
      nodes {
        id
        name
        slug
        count
        parent {
          node {
            id
          }
        }
      }
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      count
      parent {
        node {
          id
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categoryId: Int!, $first: Int = 20, $after: String) {
    posts(where: { categoryId: $categoryId }, first: $first, after: $after) {
      nodes {
        ...PostWithRelationsFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const GET_TAGS = gql`
  query GetTags($first: Int = 100) {
    tags(first: $first) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const GET_TAG_BY_SLUG = gql`
  query GetTagBySlug($slug: ID!) {
    tag(id: $slug, idType: SLUG) {
      id
      name
      slug
    }
  }
`;

export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($tagId: Int!, $first: Int = 20, $after: String) {
    posts(where: { tagId: $tagId }, first: $first, after: $after) {
      nodes {
        ...PostWithRelationsFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($search: String!, $first: Int = 20, $after: String) {
    posts(where: { search: $search }, first: $first, after: $after) {
      nodes {
        ...PostWithRelationsFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_AUTHOR_BY_SLUG = gql`
  query GetAuthorBySlug($slug: ID!) {
    user(id: $slug, idType: SLUG) {
      id
      name
      description
      avatar {
        url
      }
    }
  }
`;

export const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($authorId: Int!, $first: Int = 20, $after: String) {
    posts(where: { author: $authorId }, first: $first, after: $after) {
      nodes {
        ...PostWithRelationsFragment
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${POST_WITH_RELATIONS_FRAGMENT}
`;