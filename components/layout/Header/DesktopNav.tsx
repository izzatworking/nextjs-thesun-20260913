'use client';

import Link from 'next/link';
import { CategoryItem } from './types';
import { useState, useEffect, useRef } from 'react';

interface DesktopNavProps {
  mainNavItems: CategoryItem[];
  activeDropdown: number | null;
  toggleDropdown: (id: number) => void;
  setActiveDropdown: (id: number | null) => void;
  dropdownContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function DesktopNav({
  mainNavItems,
  activeDropdown,
  toggleDropdown,
  setActiveDropdown,
  dropdownContainerRef
}: DesktopNavProps) {
  const [hoverDropdown, setHoverDropdown] = useState<number | null>(null);
  const [dropdownHeights, setDropdownHeights] = useState<Record<number, number>>({});
  const dropdownRefs = useRef<Record<number, HTMLDivElement>>({});
  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  // Measure dropdown heights on mount and when activeDropdown changes
  useEffect(() => {
    const heights: Record<number, number> = {};
    Object.keys(dropdownRefs.current).forEach(key => {
      const id = parseInt(key);
      const element = dropdownRefs.current[id];
      if (element) {
        heights[id] = element.scrollHeight;
      }
    });
    setDropdownHeights(heights);
  }, [activeDropdown]);

  const handleMouseEnter = (id: number) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => {
      setHoverDropdown(id);
      setActiveDropdown(id);
    }, 30);
  };

  const handleMouseLeave = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      setHoverDropdown(null);
      setActiveDropdown(null);
    }, 80);
  };

  // Cleanup timeout pada unmount
  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const NavItemWithDropdown = ({ item }: { item: CategoryItem }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = activeDropdown === item.id || hoverDropdown === item.id;
    const dropdownHeight = dropdownHeights[item.id] || 0;

    if (hasSubItems) {
      return (
        <div 
          className="relative"
          key={item.id}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
           <button
            onClick={() => toggleDropdown(item.id)}
               className={`flex items-center font-medium py-2 px-3 rounded-lg text-base transition-colors ${
                 isActive 
                   ? 'text-red-600 bg-red-50' 
                   : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
               }`}
          >
            <span>{item.name}</span>
            <svg 
              className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${
                isActive ? 'rotate-180' : ''
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {(isActive) && item.subItems && (
             <div 
              ref={el => { if (el) dropdownRefs.current[item.id] = el; }}
              className={`absolute top-full left-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-[9999] ${item.slug === 'sports' ? 'w-64 overflow-y-auto custom-scrollbar' : 'w-56 overflow-hidden'}`}
              style={{
                maxHeight: item.slug === 'sports' ? '400px' : (dropdownHeight > 280 ? '280px' : 'auto'),
              }}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="py-1.5">
                {item.subItems.map((subItem: any) => (
                  <Link
                    key={subItem.id}
                    href={subItem.href || (subItem.slug.startsWith('/') ? subItem.slug : `/${subItem.slug}`)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.slug.startsWith('/') ? item.slug : item.name === 'Home' ? '/' : `/${item.slug}`}
        className="flex items-center font-medium py-2 px-3 rounded-lg text-base text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
        key={item.id}
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={handleMouseLeave}
      >
        <span>{item.name}</span>
      </Link>
    );
  };

  const MoreDropdown = ({ item }: { item: CategoryItem }) => {
    const isActive = activeDropdown === item.id || hoverDropdown === item.id;
    const dropdownHeight = dropdownHeights[item.id] || 0;
    
    return (
      <div 
        className="relative"
        key={item.id}
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={handleMouseLeave}
      >
         <button
          onClick={() => toggleDropdown(item.id)}
          className={`flex items-center font-medium py-2.5 px-4 rounded-lg text-lg transition-colors ${
              isActive 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
            }`}
        >
          <span>{item.name}</span>
          <svg 
            className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${
              isActive ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {(isActive) && item.subItems && (
          <div 
            ref={el => { if (el) dropdownRefs.current[item.id] = el; }}
            className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-[9999] overflow-hidden"
          >
            <div className="py-1.5">
              {item.subItems.map((subItem: any) => (
                <Link
                  key={subItem.id}
                  href={subItem.href || (subItem.slug.startsWith('/') ? subItem.slug : `/${subItem.slug}`)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveDropdown(null)}
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{subItem.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden lg:flex flex-1 items-center justify-center overflow-visible relative px-2" ref={dropdownContainerRef}>
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      
      <nav className="flex items-center justify-evenly gap-0.5 w-full relative z-40">
        {mainNavItems.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.slug}
                target="_blank"
                rel="noopener noreferrer"
                className="group/paper inline-block transition-all duration-200 hover:opacity-90 hover:scale-105 relative z-30 transform-gpu"
              >
                  <img 
                  src="/images/ipaper2.png"
                  alt="iPaper"
                  className="h-7 w-auto group-hover/paper:brightness-110 transition-all duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105';
                    fallback.textContent = 'iPAPER';
                    e.currentTarget.parentNode?.appendChild(fallback);
                  }}
                />
              </a>
            );
          } else if (item.name === 'More') {
            return <MoreDropdown key={item.id} item={item} />;
          } else {
            return <NavItemWithDropdown key={item.id} item={item} />;
          }
        })}
      </nav>
    </div>
  );
}