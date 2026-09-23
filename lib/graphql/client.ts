import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Default GraphQL endpoint - akan override dengan environment variable
const DEFAULT_GRAPHQL_URL = 'https://thesun.my/thesun-api';

// Get GraphQL URL from environment variable or use default
const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || DEFAULT_GRAPHQL_URL;

console.log('🔗 GraphQL URL:', graphqlUrl);

// Create HTTP link
const httpLink = new HttpLink({
  uri: graphqlUrl,
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  fetch: (uri: string | URL | Request, options?: RequestInit) => {
    const url = typeof uri === 'string' ? uri : uri.toString();
    const cacheBuster = url.includes('?') ? '&_=' + Date.now() : '?_=' + Date.now();
    const finalUri = typeof uri === 'string' ? url + cacheBuster : uri;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    return fetch(finalUri, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 0 },
      headers: {
        ...(options?.headers as Record<string, string>),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Referer': 'https://thesun.my/',
        'Accept-Language': 'en-US,en;q=0.9,ms;q=0.8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    }).finally(() => clearTimeout(timeout));
  },
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    // Optional: Customize cache configuration
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Merge function untuk pagination
            keyArgs: false,
            merge(existing = {}, incoming) {
              return {
                ...existing,
                ...incoming,
                nodes: [...(existing.nodes || []), ...(incoming.nodes || [])],
              };
            },
          },
        },
      },
    },
  }),
  // Default options
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});

export default client;