'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CategoryItem } from './types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
}

export default function Sidebar({ isOpen, onClose, mainNavItems }: SidebarProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-[100] transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Desktop modal is now handled by DesktopCanvasModal */}

      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white z-[110] transform transition-transform duration-300 ease-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-12 px-4 border-b border-gray-50">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-[calc(100%-48px)] overflow-y-auto p-3">
          <div className="space-y-0.5">
            <Link href="/" onClick={onClose}
              className="flex items-center gap-2.5 px-3 h-9 rounded-md hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>

            {mainNavItems.filter(i => i.name !== 'Home').map((item) => (
              <div key={item.id}>
                {item.external ? (
                  <a href={item.slug} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 h-9 rounded-md hover:bg-yellow-50 text-sm text-gray-700 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{item.name}</span>
                    </div>
                    <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <>
                    <Link href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`} onClick={onClose}
                      className="flex items-center justify-between px-3 h-9 rounded-md hover:bg-gray-50 text-sm text-gray-700 font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.hot && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                        <span>{item.name}</span>
                      </div>
                      {item.subItems && item.subItems.length > 0 && (
                        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="ml-4 border-l border-gray-100 pl-3 pb-1 space-y-0.5">
                        <Link href={`/category/${item.slug}`} onClick={onClose}
                          className="block px-3 h-8 leading-8 text-xs text-red-500 hover:bg-gray-50 rounded-md font-medium transition-colors"
                        >
                          All {item.name}
                        </Link>
                        {item.subItems.map((sub: any) => (
                          <Link key={sub.id} href={sub.slug.startsWith('/') ? sub.slug : `/category/${sub.slug}`} onClick={onClose}
                            className="block px-3 h-8 leading-8 text-xs text-gray-500 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
