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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Desktop: centered overlay card */}
      <div className={`
        fixed inset-0 z-[110] 
        hidden lg:flex items-center justify-center
        transition-all duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          w-[90vw] max-w-5xl max-h-[85vh] 
          bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden
          transform transition-all duration-300
          ${isOpen ? 'scale-100' : 'scale-90'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Explore</h2>
              <p className="text-sm text-gray-500 mt-0.5">Discover all categories</p>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 group">
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Grid */}
          <div className="p-8 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="grid grid-cols-3 gap-5 auto-rows-fr">
              {mainNavItems.map((item, idx) => (
                <div key={item.id} className="group/cat">
                  {item.external ? (
                    <a href={item.slug} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-orange-100 border border-gray-200 hover:border-yellow-300 transition-all duration-300 h-full"
                    >
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{item.name}</p>
                        <p className="text-xs text-gray-400">Digital edition</p>
                      </div>
                    </a>
                  ) : item.slug.startsWith('/') ? (
                    <Link href={item.slug} onClick={onClose}
                      className="flex items-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 h-full"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-lg group-hover/cat:text-blue-600 transition-colors">{item.name}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover/cat:text-blue-500 group-hover/cat:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <Link href={`/category/${item.slug}`} onClick={onClose}
                      className="flex items-center gap-3 p-5 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 h-full"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        item.hot ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {item.hot ? (
                          <span className="text-red-500 text-xs font-bold animate-pulse">HOT</span>
                        ) : (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-lg group-hover/cat:text-blue-300 transition-colors">{item.name}</p>
                        {item.subItems && item.subItems.length > 0 && (
                          <p className="text-xs text-slate-400 truncate">
                            {item.subItems.map(s => (s as any).name).join(' · ')}
                          </p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-slate-500 group-hover/cat:text-blue-400 group-hover/cat:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: sidebar from left */}
      <div className={`
        fixed top-0 left-0 h-full w-[80vw] max-w-sm bg-white backdrop-blur-xl z-[110] transform transition-transform duration-300 ease-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-50">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 h-[calc(100%-68px)] overflow-y-auto">
          <div className="space-y-2">
            <Link href="/" onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-gray-800 font-medium">Home</span>
            </Link>

            {mainNavItems.filter(i => i.name !== 'Home').map((item) => (
              <div key={item.id}>
                {item.external ? (
                  <a href={item.slug} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-600 text-xs font-bold">iP</span>
                      </div>
                      <span className="text-gray-800 font-medium">{item.name}</span>
                    </div>
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <>
                    {item.slug.startsWith('/') ? (
                      <Link href={item.slug} onClick={onClose}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-800 font-medium">{item.name}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <>
                        <Link href={`/category/${item.slug}`} onClick={onClose}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-800 font-medium">{item.name}</span>
                          </div>
                          {item.subItems && item.subItems.length > 0 ? (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </Link>
                        {item.subItems && item.subItems.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                            <Link href={`/category/${item.slug}`} onClick={onClose}
                              className="block p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-all duration-200"
                            >
                              <span className="text-blue-600 text-sm font-medium">All {item.name}</span>
                            </Link>
                            {item.subItems.map((sub: any) => {
                              const subSlug = sub.slug.startsWith('/') ? sub.slug : `/category/${sub.slug}`;
                              return (
                                <Link key={sub.id} href={subSlug} onClick={onClose}
                                  className="block p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                  <span className="text-gray-600 text-sm">{sub.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </>
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
