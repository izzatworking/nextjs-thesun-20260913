'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import BreakingNews from './BreakingNews';
import DesktopNav from './DesktopNav';
import SearchModal from './SearchModal';
import type { CategoryItem, BreakingNews as BreakingNewsType } from './types';
import type { WPCategory } from '../../../types/wordpress';
import { getPostUrl } from '../../../lib/wordpress';

interface HeaderProps {
  categories?: WPCategory[];
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export default function Header({ categories = [], isSidebarOpen: externalIsOpen, onSidebarToggle }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isSidebarOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const [isPaused, setIsPaused] = useState(false);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWorldCup, setShowWorldCup] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Clean category names
  function cleanHtmlContent(html: string): string {
    if (!html || typeof html !== 'string') return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&#8217;/g, "'")
      .replace(/&#038;/g, '&')
      .replace(/&[#\w]+;/g, '')
      .trim();
  }

  // SIMPLE FETCH BREAKING NEWS - DIPERBAIKI UNTUK ROUTING YANG BETUL
  const fetchBreakingNews = async () => {
    try {
      setIsLoading(true);

      // Use only the public API - remove internal IP address
      const apiUrl = 'https://thesun.my/wp-json/wp/v2/posts';
      console.log('📡 Fetching breaking news from API:', apiUrl);

      let response;
      try {
        response = await fetch(
          `${apiUrl}?per_page=10&_embed=wp:term`,
          {
            cache: 'no-cache',
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        console.log('✅ API fetch successful');
      } catch (fetchError) {
        console.warn('⚠️ API fetch failed:', fetchError);
        // Return empty array instead of throwing error
        setBreakingNews([]);
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        console.warn(`⚠️ API response not OK: ${response.status} ${response.statusText}`);
        // Return empty array instead of throwing error
        setBreakingNews([]);
        setIsLoading(false);
        return;
      }
      
      let posts;
      try {
        posts = await response.json();
        console.log('✅ Received posts:', posts?.length || 0);
      } catch (jsonError) {
        console.warn('⚠️ Failed to parse JSON response:', jsonError);
        setBreakingNews([]);
        setIsLoading(false);
        return;
      }
      
      // Transform data ke format breaking news DENGAN LINK YANG BETUL
      const newsItems: BreakingNewsType[] = posts.map((post: any) => {
        // Dapatkan kategori
        let category = 'News';
        if (post._embedded?.['wp:term']?.[0]?.[0]?.name) {
          category = post._embedded['wp:term'][0][0].name;
        }
        
        // PENTING: Generate link yang match dengan pages/[category]/[slug].tsx
        // Format: /{shortenedCategorySlug}/{postSlug}
        let postLink = '';

        // Use getPostUrl untuk consistency
        postLink = getPostUrl(post);
        
        console.log('📝 Post:', {
          id: post.id,
          slug: post.slug,
          link: postLink,
          title: post.title?.rendered?.substring(0, 30)
        });
        
        return {
          id: post.id,
          title: cleanHtmlContent(post.title?.rendered || 'No title'),
          slug: post.slug,
          link: postLink, // PENTING: Link yang betul untuk routing
          category: category
        };
      });
      
      console.log('✅ Processed news items:', newsItems.length);
      console.log('🔗 First item link:', newsItems[0]?.link);
      setBreakingNews(newsItems);
      
    } catch (error) {
      console.error('❌ Error fetching breaking news:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('Non-Error object:', error);
      }
      
      // FALLBACK DATA dengan link yang betul
      const fallbackNews: BreakingNewsType[] = [
        {
          id: 1,
          title: "Unable to load breaking news - using cached data",
          slug: "api-unavailable",
          link: "#", // No link for fallback
          category: "System"
        },
        {
          id: 2,
          title: "PM Anwar umum cadangan kenaikan gaji minimum",
          slug: "pm-anwar-umum-cadangan-kenaikan-gaji-minimum",
          link: "/politik/pm-anwar-umum-cadangan-kenaikan-gaji-minimum", // Category-based format
          category: "Politik"
        },
        {
          id: 3,
          title: "Harga petrol, diesel turun mulai esok",
          slug: "harga-petrol-diesel-turun-mulai-esok",
          link: "/ekonomi/harga-petrol-diesel-turun-mulai-esok", // Category-based format
          category: "Ekonomi"
        },
        {
          id: 4,
          title: "Malaysia tuan rumah Piala Asia 2027",
          slug: "malaysia-tuan-rumah-piala-asia-2027",
          link: "/sukan/malaysia-tuan-rumah-piala-asia-2027", // Category-based format
          category: "Sukan"
        },
        {
          id: 5,
          title: "Pendakian Gunung Kinabalu dibuka semula",
          slug: "pendakian-gunung-kinabalu-dibuka-semula",
          link: "/pelancongan/pendakian-gunung-kinabalu-dibuka-semula", // Category-based format
          category: "Pelancongan"
        }
      ];

      console.log('⚠️ API fetch failed, using fallback data');
      setBreakingNews(fallbackNews);
      
    } finally {
      setIsLoading(false);
      console.log('🏁 Loading state set to false');
    }
  };

   // Auto update date and time - DIKECILKAN
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      };
      const timeString = now.toLocaleTimeString('en-US', timeOptions);
      setCurrentTime(`${timeString} • MY`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch breaking news pada mount
  useEffect(() => {
    console.log('🚀 Header mounted, fetching breaking news...');
    console.log('📍 Current route structure expects: /posts/[slug]');

    // Wrap in try-catch to prevent component crashes
    const safeFetchBreakingNews = async () => {
      try {
        await fetchBreakingNews();
      } catch (error) {
        console.error('💥 Critical error in fetchBreakingNews:', error);
        // Fallback is already handled inside fetchBreakingNews
      }
    };

    safeFetchBreakingNews();

    // Refresh setiap 5 minit
    const refreshInterval = setInterval(() => {
      safeFetchBreakingNews();
    }, 5 * 60 * 1000);

    return () => {
      console.log('🧹 Cleaning up header');
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Process categories to clean HTML entities
  const cleanCategories = categories.map(cat => ({
    ...cat,
    name: cleanHtmlContent(cat.name)
  }));

  // Group categories by parent
  const parentCategories = cleanCategories.filter(cat => cat.parent === 0);
  const childCategories = cleanCategories.filter(cat => cat.parent !== 0);

  // Function to get sub-categories for a parent
  const getSubCategories = (parentId: number) => {
    return childCategories.filter(cat => cat.parent === parentId);
  };

  // Helper function untuk mencari category ID berdasarkan nama
  const findCategoryId = (categoryName: string): number => {
    const category = parentCategories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : 0;
  };

  // Define main navbar items dengan sub-categories
  const mainNavItems: CategoryItem[] = [
    { name: 'Home', slug: '/', id: 0, hot: false },
    { 
      name: 'News', 
      slug: 'news', 
      id: 1, 
      hot: true,
      subItems: getSubCategories(findCategoryId('News'))
    },
    { 
      name: 'Going Viral', 
      slug: 'going-viral', 
      id: 7, 
      hot: true,
      subItems: getSubCategories(findCategoryId('Going Viral'))
    },
    { 
      name: 'Business', 
      slug: 'business', 
      id: 2, 
      hot: false,
      subItems: getSubCategories(findCategoryId('Business'))
    },
    { 
      name: 'Opinion', 
      slug: 'opinion', 
      id: 8, 
      hot: false,
    },
    { 
      name: 'Lifestyle', 
      slug: 'lifestyle', 
      id: 3, 
      hot: false,
      subItems: getSubCategories(findCategoryId('Lifestyle'))
    },
    { 
      name: 'Spotlight', 
      slug: 'spotlight', 
      id: 11, 
      hot: false,
    },
    { 
      name: 'Sports', 
      slug: 'sports', 
      id: 4, 
      hot: true,
      subItems: getSubCategories(findCategoryId('Sports'))
    },
    { 
      name: 'More', 
      slug: 'more', 
      id: 9, 
      hot: false,
      subItems: [
        { name: 'Berita', slug: 'berita', id: 5 },
        { name: 'Motoring', slug: 'motoring', id: 6 },
        { name: 'Most Viewed', slug: '/topstories', id: 16 },
        { name: 'Videos', slug: '/videos', id: 17 },
        { name: 'Classifieds', slug: 'classifieds', id: 10 },
        { name: 'Education', slug: 'education', id: 12 },
        { name: 'Our Team', slug: '/our-team', id: 14 }
      ]
    },
    { name: 'ipaper', slug: 'https://thesun-ipaper.cld.bz/', id: 13, hot: false, external: true },
  ];
  const canvasCategories = {
    row1: [
      { name: 'Home', slug: '/', id: 0, hot: false, subItems: [] },
      { name: 'News', slug: 'news', id: 1, hot: true, subItems: getSubCategories(findCategoryId('News')) },
      { name: 'Business', slug: 'business', id: 2, hot: false, subItems: getSubCategories(findCategoryId('Business')) },
      { name: 'Lifestyle', slug: 'lifestyle', id: 3, hot: false, subItems: getSubCategories(findCategoryId('Lifestyle')) },
      { name: 'Sports', slug: 'sports', id: 4, hot: true, subItems: getSubCategories(findCategoryId('Sports')) }
    ],
    row2: [
      { name: 'Berita', slug: 'berita', id: 5, hot: true, subItems: getSubCategories(findCategoryId('Berita')) },
      { name: 'Motoring', slug: 'motoring', id: 6, hot: false, subItems: getSubCategories(findCategoryId('Motoring')) },
      { name: 'Going Viral', slug: 'going-viral', id: 7, hot: true, subItems: getSubCategories(findCategoryId('Going Viral')) },
      { name: 'Opinion', slug: 'opinion', id: 8, hot: false, subItems: getSubCategories(findCategoryId('Opinion')) },
      { 
        name: 'More', 
        slug: 'more', 
        id: 9, 
        hot: false, 
        subItems: [
          { name: 'Motoring', slug: 'motoring', id: 6 },
          { name: 'Opinion', slug: 'opinion', id: 8 },
          { name: 'Most Viewed', slug: '/topstories', id: 16 },
          { name: 'Videos', slug: '/videos', id: 17 },
          { name: 'Classifieds', slug: 'classifieds', id: 10 },
          { name: 'Spotlight', slug: 'spotlight', id: 11 },
          { name: 'Education', slug: 'education', id: 12 },
          { name: 'Our Team', slug: '/our-team', id: 14 }
        ]
      }
    ]
  };

  const toggleDropdown = (categoryId: number) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  const toggleSidebar = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };
  const closeSidebar = () => {
    if (onSidebarToggle) {
      if (isSidebarOpen) onSidebarToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleBreakingNewsHover = (hovering: boolean) => {
    setIsPaused(hovering);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      
      <div className="relative z-20">
        <BreakingNews
          breakingNews={breakingNews}
          isLoading={isLoading}
          isPaused={isPaused}
          onHover={handleBreakingNewsHover}
          marqueeRef={undefined as any}
        />
        
        <div className="w-full">
          {/* Top row: hamburger + logo + actions */}
          <div className="flex items-center justify-between px-4 lg:px-6 h-20 lg:h-24">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={toggleSidebar}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Toggle menu"
                >
                  <div className="w-5 h-3.5 flex flex-col justify-between">
                    <span className={`block w-full h-[2px] bg-gray-600 rounded-full transition-all duration-200 origin-center ${
                      isSidebarOpen ? 'rotate-45 translate-y-[6px]' : ''
                    }`}></span>
                    <span className={`block w-full h-[2px] bg-gray-600 rounded-full transition-all duration-200 ${
                      isSidebarOpen ? 'opacity-0 scale-x-0' : ''
                    }`}></span>
                    <span className={`block w-[70%] h-[2px] bg-gray-600 rounded-full transition-all duration-200 origin-center ${
                      isSidebarOpen ? 'w-full -rotate-45 -translate-y-[6px]' : 'group-hover:w-full'
                    }`}></span>
                  </div>

                </button>
              </div>
              <Link href="/" className="flex-shrink-0">
                <img 
                  src="/images/thesun.png"
                  alt="THE SUN MALAYSIA"
                  className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden">
                  <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-xl">
                    THE SUN
                  </h1>
                </div>
              </Link>
            </div>

            <DesktopNav
              mainNavItems={mainNavItems}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              setActiveDropdown={setActiveDropdown}
              dropdownContainerRef={dropdownContainerRef}
            />

            <div className="flex items-center gap-2">
              <a
                href="https://thesun-ipaper.cld.bz/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
                aria-label="iPaper"
              >
                <img src="/images/ipaper2.png" alt="iPaper" className="h-6 w-auto" />
              </a>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div className="text-right hidden lg:block border-l border-gray-100 pl-3">
                <div className="text-xs font-medium text-gray-800" suppressHydrationWarning>
                  {currentDate || ''}
                </div>
                <div className="text-[11px] text-gray-400" suppressHydrationWarning>
                  {currentTime || ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}