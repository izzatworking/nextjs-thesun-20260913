// components/common/Breadcrumb.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { WPCategory } from '../../types/wordpress';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  categories?: WPCategory[];
  currentCategory?: WPCategory;
}

export default function Breadcrumb({ items = [], currentPage, categories = [], currentCategory }: BreadcrumbProps) {
  const router = useRouter();
  const { pathname, query } = router;

  // Helper function to find category by slug
  const findCategoryBySlug = (slug: string): WPCategory | undefined => {
    return categories.find(cat => 
      cat.slug === slug || 
      cat.slug === slug.replace(/-/g, ' ') ||
      cat.name.toLowerCase().replace(/\s+/g, '-') === slug
    );
  };

  // Helper function to find category by ID
  const findCategoryById = (id: number): WPCategory | undefined => {
    return categories.find(cat => cat.id === id);
  };

  // Generate breadcrumb items based on current route
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    
    // Start with Home
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    // Handle dynamic routes
    if (pathname.startsWith('/category/')) {
      const categorySlug = query.slug as string;
      if (categorySlug) {
        // Try to find the category
        const category = currentCategory || findCategoryBySlug(categorySlug);
        
        if (category) {
          // If category has parent, add parent first
          if (category.parent && category.parent > 0) {
            const parentCategory = findCategoryById(category.parent);
            if (parentCategory) {
              breadcrumbs.push({
                label: parentCategory.name,
                href: `/${parentCategory.slug}`
              });
            }
          }
          
          // Add current category
          breadcrumbs.push({
            label: category.name,
            href: `/${category.slug}`
          });
        } else {
          // Fallback to slug-based name
          breadcrumbs.push({
            label: categorySlug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            href: `/${categorySlug}`
          });
        }
      }
    } else if (pathname.startsWith('/tag/')) {
      const tagSlug = query.slug as string;
      if (tagSlug) {
        breadcrumbs.push({
          label: 'Tags',
          href: '/tags'
        });
        breadcrumbs.push({
          label: tagSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          href: `/tag/${tagSlug}`
        });
      }
    } else if (pathname === '/author') {
      breadcrumbs.push({ label: 'Authors' });
    } else if (pathname.startsWith('/author/') && query.slug) {
      const authorSlug = query.slug as string;
      if (authorSlug) {
        breadcrumbs.push({
          label: 'Authors',
          href: '/author'
        });
        breadcrumbs.push({
          label: authorSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          href: `/author/${authorSlug}`
        });
      }
    } else if (pathname.startsWith('/[category]/[slug]')) {
      // Handle post pages with category context
      const categorySlug = query.category as string;
      const postSlug = query.slug as string;
      
      if (categorySlug) {
        // Try to find the category
        const category = findCategoryBySlug(categorySlug);
        
        if (category) {
          // If category has parent, add parent first
          if (category.parent && category.parent > 0) {
            const parentCategory = findCategoryById(category.parent);
            if (parentCategory) {
              breadcrumbs.push({
                label: parentCategory.name,
                href: `/${parentCategory.slug}`
              });
            }
          }
          
          // Add current category
          breadcrumbs.push({
            label: category.name,
            href: `/${category.slug}`
          });
        } else {
          // Fallback to slug-based name
          breadcrumbs.push({
            label: categorySlug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            href: `/${categorySlug}`
          });
        }
        
        // Add post title (not clickable)
        if (postSlug) {
          breadcrumbs.push({
            label: postSlug.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
          });
        }
      }
    } else if (pathname.startsWith('/[...slug]')) {
      // Handle catch-all post pages e.g. /news/some-article
      const slugArray = query.slug as string[] | undefined;
      
      if (slugArray && slugArray.length >= 2) {
        // Last segment is post slug, rest is category path
        const postSlug = slugArray[slugArray.length - 1];
        const categoryPath = slugArray.slice(0, -1);
        
        // Build category breadcrumbs from the path
        for (let i = 0; i < categoryPath.length; i++) {
          const segment = categoryPath[i];
          const category = findCategoryBySlug(segment);
          const href = '/' + categoryPath.slice(0, i + 1).join('/');
          
          breadcrumbs.push({
            label: category ? category.name : (segment.charAt(0).toUpperCase() + segment.slice(1)),
            href
          });
        }
        
        // Add post title
        breadcrumbs.push({
          label: postSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
        });
      }
    } else if (pathname.startsWith('/posts/') || pathname.startsWith('/post/')) {
      const postSlug = query.slug as string;
      if (postSlug) {
        breadcrumbs.push({
          label: 'Posts',
          href: '/posts'
        });
        breadcrumbs.push({
          label: postSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
        });
      }
    } else if (pathname === '/about-us') {
      breadcrumbs.push({ label: 'About Us' });
    } else if (pathname === '/contact-us') {
      breadcrumbs.push({ label: 'Contact Us' });
    } else if (pathname === '/privacy-policy') {
      breadcrumbs.push({ label: 'Privacy Policy' });
    } else if (pathname === '/disclaimer') {
      breadcrumbs.push({ label: 'Disclaimer' });
    } else if (pathname === '/advertise-with-us') {
      breadcrumbs.push({ label: 'Advertise With Us' });
    } else if (pathname === '/subscribe-now') {
      breadcrumbs.push({ label: 'Subscribe Now' });
    } else if (pathname === '/subscriptions') {
      breadcrumbs.push({ label: 'Subscriptions' });
    } else if (pathname.startsWith('/advertising/')) {
      breadcrumbs.push({ label: 'Advertising', href: '/advertising' });
      if (pathname.includes('ratecard')) {
        breadcrumbs.push({ label: 'Rate Card' });
      }
    } else if (pathname.startsWith('/company/')) {
      breadcrumbs.push({ label: 'Company', href: '/company' });
      if (pathname.includes('about-us')) {
        breadcrumbs.push({ label: 'About Us' });
      } else if (pathname.includes('contact-us')) {
        breadcrumbs.push({ label: 'Contact Us' });
      } else if (pathname.includes('privacy-policy')) {
        breadcrumbs.push({ label: 'Privacy Policy' });
      } else if (pathname.includes('disclaimer')) {
        breadcrumbs.push({ label: 'Disclaimer' });
      }
    } else if (pathname.startsWith('/ipaper/')) {
      breadcrumbs.push({ label: 'iPaper', href: '/ipaper' });
      if (pathname.includes('admin')) {
        breadcrumbs.push({ label: 'Admin' });
      }
    }

    // Make sure all items except the last one have href
    // Remove href from last item (current page)
    if (breadcrumbs.length > 0) {
      delete breadcrumbs[breadcrumbs.length - 1].href;
    }
    
    // Add href to all other items that don't have it
    for (let i = 0; i < breadcrumbs.length - 1; i++) {
      if (!breadcrumbs[i].href) {
        // Generate href from label for static pages
        const label = breadcrumbs[i].label.toLowerCase().replace(/\s+/g, '-');
        breadcrumbs[i].href = `/${label}`;
      }
    }

    // Add custom items if provided
    if (items.length > 0) {
      return [...breadcrumbs, ...items];
    }

    // Add current page if specified
    if (currentPage) {
      breadcrumbs.push({ label: currentPage });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Don't show breadcrumb on homepage
  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-2.5">
      <div className="container-optimized">
        <ol className="flex items-center text-xs sm:text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-1.5 sm:mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              
               {item.href ? (
                <Link 
                  href={item.href}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}