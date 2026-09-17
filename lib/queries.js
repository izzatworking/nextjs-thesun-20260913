import { fetchAPI } from './wordpress';

export async function getTopStories() {
  try {
    const data = await fetchAPI(`
      query GetTopStories {
        posts(where: { isTopStories: true }) {
          nodes {
            id
            title
            slug
            excerpt
            date
            categories {
              nodes {
                slug
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `);

    return data?.posts?.nodes || [];
  } catch (error) {
    console.error('GraphQL getTopStories failed:', error);
    return [];
  }
}
