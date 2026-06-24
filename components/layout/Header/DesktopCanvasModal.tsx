'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CategoryItem } from './types';

interface DesktopCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
}

export default function DesktopCanvasModal({ isOpen, onClose, mainNavItems }: DesktopCanvasModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const moreItem = mainNavItems.find(i => i.name === 'More');
  const externalItems = mainNavItems.filter(i => i.external);

  return (
    <div className={`
      fixed inset-0 z-[110]
      hidden lg:block
      transition-all duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className={`
        absolute inset-0
        flex items-center justify-center
        transform transition-all duration-300
        ${isOpen ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0 pointer-events-none'}
      `}>
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-10 h-20 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-[0.2em]">Explore all sections</span>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
              <div className="p-10">
                {/* Categories grid */}
                <div className="grid grid-cols-3 gap-4">
                  {mainNavItems.filter(i => i.name !== 'Home' && i.name !== 'More' && !i.external).map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-red-200 hover:from-red-50 hover:to-red-50/30 transition-all duration-200 p-5"
                    >
                      <Link
                        href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 mb-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-red-100 group-hover:bg-red-50 transition-all duration-200">
                          <span className="text-base font-bold text-gray-400 group-hover:text-red-500 transition-colors">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                            {item.name}
                          </span>
                          {item.hot && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="space-y-0.5 ml-[3.25rem]">
                          <Link
                            href={`/category/${item.slug}`}
                            onClick={onClose}
                            className="block text-xs font-medium text-red-500 hover:text-red-600 transition-colors py-1"
                          >
                            All {item.name}
                          </Link>
                          {item.subItems.map((sub: any) => (
                            <Link
                              key={sub.id}
                              href={sub.slug.startsWith('/') ? sub.slug : `/category/${sub.slug}`}
                              onClick={onClose}
                              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/60"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* More section */}
                {moreItem && moreItem.subItems && moreItem.subItems.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 my-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em]">More Categories</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {moreItem.subItems.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={sub.slug.startsWith('/') ? sub.slug : `/category/${sub.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all duration-200"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">{sub.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {/* External section */}
                {externalItems.length > 0 && (
                  <>
                    <div className="flex items-center gap-4 my-8">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em]">External Links</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {externalItems.map((item) => (
                        <a
                          key={item.id}
                          href={item.slug}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="group inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100 hover:border-yellow-200 hover:from-yellow-100 hover:to-amber-100 transition-all duration-200"
                        >
                          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{item.name}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
