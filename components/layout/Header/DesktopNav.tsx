'use client';

import Link from 'next/link';
import { CategoryItem } from './types';
import { useState, useEffect, useRef } from 'react';

interface DesktopNavProps {
  mainNavItems: CategoryItem[];
  activeDropdown: number | null;
  toggleDropdown: (id: number) => void;
  setActiveDropdown: (id: number | null) => void;
  dropdownContainerRef: React.RefObject<HTMLDivElement>;
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
          className="relative z-50 group"
          key={item.id}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
           <button
            onClick={() => toggleDropdown(item.id)}
              className={`flex items-center font-medium py-1 px-1.5 lg:px-2 rounded-lg border ${
                isActive 
                  ? 'text-gray-900 bg-gray-100 border-red-400' 
                  : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-red-400'
              } text-sm relative z-10`}
          >
            <span className="relative whitespace-nowrap">
              {item.name}
            </span>
            <svg 
              className={`ml-1 w-3 h-3 ${
                isActive ? 'rotate-180 text-gray-500' : 'text-gray-400'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* Hover indicator line */}
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-500 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`} />
          </button>

          {(isActive) && item.subItems && (
             <div 
              ref={el => {
                if (el) dropdownRefs.current[item.id] = el;
              }}
              className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] overflow-hidden"
              style={{
                maxHeight: dropdownHeight > 250 ? '250px' : 'auto',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'top',
                transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
                 <div 
                  className="overflow-y-auto custom-scrollbar"
                  style={{ maxHeight: '250px' }}
                >
                <div className="p-3">
                  {/* All items link */}
                  <Link
                    href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`}
                    className="group/all block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg mb-2 border-b border-gray-200 bg-white hover:bg-gray-50"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold group-hover/all:text-gray-700 transition-colors duration-200">
                        All {item.name}
                      </span>
                      <svg className="w-4 h-4 text-gray-500 group-hover/all:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  
                  {/* Sub items */}
                  <div className="space-y-1">
                    {item.subItems.map((subItem: any) => {
                      const subHref = subItem.slug.startsWith('/') ? subItem.slug : `/category/${subItem.slug}`;
                      return (
                        <Link
                          key={subItem.id}
                          href={subHref}
                          className="group/sub block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-lg transform-gpu hover:scale-[1.02]"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 group-hover/sub:scale-125 transition-transform duration-200"></div>
                              <span className="text-sm truncate group-hover/sub:translate-x-1 transition-transform duration-200">
                                {subItem.name}
                              </span>
                            </div>
                            <svg className="flex-shrink-0 w-3 h-3 text-gray-400 group-hover/sub:text-gray-600 group-hover/sub:translate-x-1 transition-all duration-200 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              
               {/* Show indicator if there are many items */}
              {dropdownHeight > 250 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-center justify-center">
                  <div className="w-5 h-0.5 bg-gray-400/30 rounded-full"></div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
         <Link
            href={item.slug.startsWith('/') ? item.slug : item.name === 'Home' ? '/' : `/category/${item.slug}`}
              className="group relative flex items-center text-gray-700 hover:text-gray-900 py-1 px-1.5 lg:px-2 rounded-lg border border-transparent hover:border-red-400 text-sm"
            key={item.id}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="whitespace-nowrap">
              {item.name}
            </span>
            
            {/* Hover indicator line */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-500 opacity-0 group-hover:opacity-100" />
          </Link>
    );
  };

  const MoreDropdown = ({ item }: { item: CategoryItem }) => {
    const isActive = activeDropdown === item.id || hoverDropdown === item.id;
    const dropdownHeight = dropdownHeights[item.id] || 0;
    
    return (
      <div 
        className="relative z-50 group"
        key={item.id}
        onMouseEnter={() => handleMouseEnter(item.id)}
        onMouseLeave={handleMouseLeave}
      >
         <button
          onClick={() => toggleDropdown(item.id)}
className={`flex items-center font-medium py-1 px-1.5 lg:px-2 rounded-lg border ${
              isActive 
                ? 'text-gray-900 bg-gray-100 border-red-400' 
                : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-red-400'
            } text-xs relative z-10`}
        >
          <span className="whitespace-nowrap">{item.name}</span>
          <svg 
            className={`ml-1 w-3 h-3 ${
              isActive ? 'rotate-180 text-gray-500' : 'text-gray-400'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          
          {/* Hover indicator line */}
          <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-500 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
        </button>

        {(isActive) && item.subItems && (
             <div 
              ref={el => {
                if (el) dropdownRefs.current[item.id] = el;
              }}
              className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-2xl z-[9999] overflow-hidden"
              style={{
                maxHeight: dropdownHeight > 250 ? '250px' : 'auto',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'top',
                transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
                 <div 
                  className="overflow-y-auto custom-scrollbar"
                  style={{ maxHeight: '250px' }}
                >
              <div className="p-3">
                {item.subItems.map((subItem: any) => {
                  const subHref = subItem.slug.startsWith('/') ? subItem.slug : `/category/${subItem.slug}`;
                  return (
                    <Link
                      key={subItem.id}
                      href={subHref}
                      className="group/item block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 rounded-lg transform-gpu hover:scale-[1.02]"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="text-sm truncate group-hover/item:translate-x-1 transition-transform duration-200">
                            {subItem.name}
                          </span>
                        </div>
<svg className="flex-shrink-0 w-3 h-3 text-gray-400 group-hover/item:text-gray-600 group-hover/item:translate-x-1 transition-all duration-200 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
               {/* Show indicator if there are many items */}
              {dropdownHeight > 250 && (
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-center justify-center">
                  <div className="w-5 h-0.5 bg-gray-400/30 rounded-full"></div>
                </div>
              )}
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
          scrollbar-color: #4b5563 #1f2937;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 3px;
          transition: background 0.2s;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        @media (max-width: 1024px) {
          .transform-gpu {
            transform: none;
          }
        }
      `}</style>
      
      <nav className="flex items-center justify-center gap-0.5 lg:gap-1 relative z-40">
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
                  src="/images/ipaper.png"
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