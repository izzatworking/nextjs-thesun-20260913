export interface NavSubItem {
  name: string;
  slug: string;
  href: string;
}

export const NEWS_SUB_ITEMS: NavSubItem[] = [
  { name: 'Malaysia', slug: 'malaysia-news', href: '/news/malaysia' },
  { name: 'Asia', slug: 'asia', href: '/news/asia' },
  { name: 'World', slug: 'world-news', href: '/news/world' },
];

export const BUSINESS_SUB_ITEMS: NavSubItem[] = [
  { name: 'Local Business', slug: 'local-business', href: '/business/local-business' },
  { name: 'Global Business', slug: 'global-business', href: '/business/global-business' },
  { name: 'Corporate News', slug: 'corporate-news', href: '/business/corporate-news' },
];

export const LIFESTYLE_SUB_ITEMS: NavSubItem[] = [
  { name: 'Boo! and Beyond', slug: 'boo-and-beyond', href: '/lifestyle/boo-and-beyond' },
  { name: 'Technology & Social Media', slug: 'technology-social-media', href: '/lifestyle/technology-social-media' },
  { name: 'Family & Health', slug: 'family-health', href: '/lifestyle/family-health' },
  { name: 'Fashion & Beauty', slug: 'fashion-beauty', href: '/lifestyle/fashion-beauty' },
  { name: 'Home & Living', slug: 'home-living', href: '/lifestyle/home-living' },
  { name: 'Travel & Leisure', slug: 'travel-leisure', href: '/lifestyle/travel-leisure' },
  { name: 'Food & Beverage', slug: 'food-beverage', href: '/lifestyle/food-beverage' },
  { name: 'Culture', slug: 'culture', href: '/lifestyle/culture' },
  { name: 'Entertainment', slug: 'entertainment', href: '/lifestyle/entertainment' },
];

export const SPORTS_SUB_ITEMS: NavSubItem[] = [
  { name: 'All Sports', slug: 'sports', href: '/sports' },
  { name: 'Football', slug: 'football', href: '/sports/football' },
  { name: 'Badminton', slug: 'badminton', href: '/sports/badminton' },
  { name: 'Tennis', slug: 'tennis', href: '/sports/tennis' },
  { name: 'F1', slug: 'f1', href: '/sports/f1' },
  { name: 'Cricket', slug: 'cricket', href: '/sports/cricket' },
  { name: 'Golf', slug: 'golf', href: '/sports/golf' },
  { name: 'Other Sports', slug: 'other-sports', href: '/sports/other-sports' },
];

export const MORE_SUB_ITEMS: NavSubItem[] = [
  { name: 'Education', slug: 'education', href: '/education' },
  { name: 'Property', slug: 'property', href: '/property' },
  { name: 'Motoring', slug: 'motoring', href: '/motoring' },
  { name: 'People and Issues', slug: 'people-issues', href: '/people-issues' },
  { name: 'Most Viewed', slug: '/topstories', href: '/topstories' },
  { name: 'Latest News', slug: '/latest-news', href: '/latest-news' },
  { name: 'Top Stories', slug: '/topstories', href: '/topstories' },
];

export const FIXED_SUB_ITEMS: Record<string, NavSubItem[]> = {
  news: NEWS_SUB_ITEMS,
  business: BUSINESS_SUB_ITEMS,
  lifestyle: LIFESTYLE_SUB_ITEMS,
  sports: SPORTS_SUB_ITEMS,
  more: MORE_SUB_ITEMS,
};

// Maps clean (nested) nav URLs to the leaf WP category slug so the
// article catch-all route can pre-render and render those category pages.
export const NAV_CATEGORY_MAP: Record<string, string> = {
  '/news': 'news',
  '/news/malaysia': 'malaysia-news',
  '/news/asia': 'asia',
  '/news/world': 'world-news',
  '/business': 'business',
  '/business/local-business': 'local-business',
  '/business/global-business': 'global-business',
  '/business/corporate-news': 'corporate-news',
  '/lifestyle': 'lifestyle',
  '/lifestyle/boo-and-beyond': 'boo-and-beyond',
  '/lifestyle/technology-social-media': 'technology-social-media',
  '/lifestyle/family-health': 'family-health',
  '/lifestyle/fashion-beauty': 'fashion-beauty',
  '/lifestyle/home-living': 'home-living',
  '/lifestyle/travel-leisure': 'travel-leisure',
  '/lifestyle/food-beverage': 'food-beverage',
  '/lifestyle/culture': 'culture',
  '/lifestyle/entertainment': 'entertainment',
  '/sports': 'sports',
  '/sports/football': 'football',
  '/sports/badminton': 'badminton',
  '/sports/tennis': 'tennis',
  '/sports/f1': 'f1',
  '/sports/cricket': 'cricket',
  '/sports/golf': 'golf',
  '/sports/other-sports': 'other-sports',
  '/going-viral': 'going-viral',
  '/opinion': 'opinion',
  '/spotlight': 'spotlight',
  '/berita': 'berita',
  '/education': 'education',
  '/property': 'property',
  '/motoring': 'motoring',
  '/people-issues': 'people-issues',
};