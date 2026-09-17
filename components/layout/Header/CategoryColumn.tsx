import Link from 'next/link';
import { CategoryItem } from './types';
import { cleanHtmlContent } from '../../home/utils/contentCleaner';

interface CategoryColumnProps {
  category: CategoryItem;
  animationDelay?: number;
  onItemClick?: () => void;
}

export default function CategoryColumn({ 
  category,
  animationDelay = 0,
  onItemClick
}: CategoryColumnProps) {
  return (
    <div 
      className="animate-fadeInUp group/column"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Link
        href={category.name === 'Home' ? '/' : `/${category.slug}`}
        className="group block p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-red-600 hover:to-red-700 transition-all duration-500 transform hover:scale-105 border-2 border-slate-600 hover:border-red-400 hover:shadow-2xl hover:shadow-red-500/30 mb-4 relative overflow-hidden"
        onClick={onItemClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-500/5 transition-all duration-500 rounded-2xl"></div>
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-xl group-hover:text-white transition-colors duration-300 drop-shadow-lg">
               {cleanHtmlContent(category.name)}
            </h3>
            {category.hot && (
              <span className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full animate-pulse shadow-lg border border-red-400">
                HOT
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-slate-400 group-hover:text-red-200 text-sm transition-colors duration-300">
              {category.subItems && category.subItems.length > 0 
                ? `${category.subItems.length} subcategories` 
                : 'Explore more'
              }
            </div>
            <div className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300">
              <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      {category.subItems && category.subItems.length > 0 && (
        <div className="space-y-2 ml-1">
          {category.subItems.map((subItem: any, index: number) => (
            <Link
              key={subItem.id}
              href={subItem.href || (subItem.slug.startsWith('/') ? subItem.slug : `/${subItem.slug}`)}
              className="group/sub block p-4 rounded-xl bg-slate-800/80 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 transition-all duration-400 transform hover:scale-102 border border-slate-600/50 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-400/20 animate-fadeInUp backdrop-blur-sm"
              style={{ animationDelay: `${animationDelay + (index * 80)}ms` }}
              onClick={onItemClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full group-hover/sub:bg-red-400 group-hover/sub:animate-pulse transition-all duration-300"></div>
                  <span className="text-slate-300 group-hover/sub:text-white transition-colors duration-300 text-sm font-medium">
                     {cleanHtmlContent(subItem.name)}
                  </span>
                </div>
                <div className="opacity-0 group-hover/sub:opacity-100 transform translate-x-0 group-hover/sub:translate-x-1 transition-all duration-300">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}