'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CategoryItem } from './types';

interface DesktopCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasCategories: {
    row1: CategoryItem[];
    row2: CategoryItem[];
  };
  mainNavItems?: CategoryItem[];
}

export default function DesktopCanvasModal({ isOpen, onClose, canvasCategories, mainNavItems = [] }: DesktopCanvasModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const allNavItems = mainNavItems.filter(i => i.name !== 'Home' && i.name !== 'More');
  const moreSubItems = mainNavItems.find(i => i.name === 'More')?.subItems || [];

  return (
    <div className={`
      fixed inset-0 z-[110] 
      hidden lg:block
      transition-all duration-200
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        fixed top-[calc(100%+8px)] left-1/2 -translate-x-1/2
        w-[92vw] max-w-3xl
        bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden
        transform transition-all duration-200 origin-top
        ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
      `}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            </div>
            <span className="text-xs font-medium text-gray-400">Explore</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div>
              <div className="grid grid-cols-4 gap-2">
                {allNavItems.filter(i => !i.external && i.name !== 'More').map((item) => (
                  <Link
                    key={item.id}
                    href={item.slug === '/' ? '/' : `/category/${item.slug}`}
                    onClick={onClose}
                    className="group relative px-4 py-3.5 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-red-200 hover:from-red-50 hover:to-white transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.hot && (
                        <span className="text-[9px] font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 px-1.5 py-0.5 rounded-sm">HOT</span>
                      )}
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors">{item.name}</span>
                    </div>
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.subItems.slice(0, 2).map((sub: any) => (
                          <span key={sub.id} className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-50">
                            {sub.name}
                          </span>
                        ))}
                        {item.subItems.length > 2 && (
                          <span className="text-[10px] text-gray-300">+{item.subItems.length - 2}</span>
                        )}
                      </div>
                    )}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-50"></div>

            <div className="grid grid-cols-4 gap-2">
              {moreSubItems.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={sub.slug.startsWith('/') ? sub.slug : `/category/${sub.slug}`}
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
              {allNavItems.filter(i => i.external).map(item => (
                <a
                  key={item.id}
                  href={item.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 border border-yellow-100 hover:border-yellow-200 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
