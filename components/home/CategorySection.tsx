/// components/home/utils/category section.tsx ///

import Link from 'next/link';
import { WPPost, WPCategory } from '../../types/wordpress';
import CategoryFeatured from './CategoryFeatured';
import CategoryGrid from './CategoryGrid';

interface CategorySectionProps {
  name: string;
  slug: string;
  posts: WPPost[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function CategorySection({ 
  name, 
  slug, 
  posts, 
  categories, 
  isLast = false 
}: CategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {name}
        </h2>
        <Link 
          href={`/${slug}`}
          className="text-red-600 hover:text-red-700 font-semibold text-sm"
        >
          View All →
        </Link>
      </div>

      {/* Content Grid - 3/5 left, 2/5 right */}
      <div className="grid grid-cols-5 gap-6 items-stretch mb-16">
        {/* Featured Article - Left 3/5 */}
        <div className="col-span-3">
          <CategoryFeatured 
            post={posts[0]} 
            categories={categories} 
          />
        </div>

        {/* Next Articles - Right 2/5 */}
        <div className="col-span-2">
          <CategoryGrid 
            posts={posts.slice(1, 5)} 
            categories={categories} 
          />
        </div>
      </div>

      {/* Line break antara sections (kecuali section terakhir) */}
      {!isLast && (
        <div className="border-t border-gray-300 my-12"></div>
      )}
    </div>
  );
}