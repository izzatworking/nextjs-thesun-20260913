// components/home/categories/SportsSection.tsx
import CategoryLayout2 from './CategoryLayout2';
import NewsletterSubscribe from './NewsletterSubscribe';
import { WPPostWithMedia, WPCategory } from '../../../types/wordpress';

interface SportsSectionProps {
  posts: WPPostWithMedia[];
  categories: WPCategory[];
  isLast?: boolean;
}

export default function SportsSection({ posts, categories, isLast = false }: SportsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-16">
      {/* 60% - Sports stories */}
      <div className="lg:col-span-3 min-w-0">
        <CategoryLayout2
          name="Sports"
          slug="sports"
          posts={posts}
          categories={categories}
          isLast={false}
        />
      </div>

      {/* 40% - Newsletter subscription */}
      <div className="lg:col-span-2 min-w-0 h-auto">
        <NewsletterSubscribe className="h-full" />
      </div>

      {!isLast && <div className="col-span-full border-t border-gray-300 my-6 sm:mt-4" />}
    </div>
  );
}