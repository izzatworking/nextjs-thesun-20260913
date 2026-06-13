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
}

export default function DesktopCanvasModal({ isOpen, onClose, canvasCategories }: DesktopCanvasModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className={`
      fixed inset-0 z-[110] 
      hidden lg:flex items-center justify-center
      transition-all duration-300
      ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        w-[90vw] max-w-5xl max-h-[85vh] 
        bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden
        transform transition-all duration-300
        ${isOpen ? 'scale-100' : 'scale-90'}
      `}>
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
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="space-y-5">
            <div className="grid grid-cols-5 gap-3">
              {canvasCategories.row1.map((item) => (
                <div key={item.id} className="group/cat">
                  {item.external ? (
                    <a href={item.slug} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-orange-100 border border-gray-200 hover:border-yellow-300 transition-all duration-300 text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">Digital edition</p>
                      </div>
                    </a>
                  ) : item.slug === '/' || item.slug.startsWith('/') ? (
                    <Link href={item.slug} onClick={onClose}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 text-center"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    </Link>
                  ) : (
                    <Link href={`/category/${item.slug}`} onClick={onClose}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 text-center"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.hot ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {item.hot ? (
                          <span className="text-red-500 text-xs font-bold">HOT</span>
                        ) : (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        {item.subItems && item.subItems.length > 0 && (
                          <p className="text-xs text-gray-400 truncate max-w-[100px]">
                            {item.subItems.map(s => (s as any).name).join(', ')}
                          </p>
                        )}
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-5">
              <div className="grid grid-cols-5 gap-3">
                {canvasCategories.row2.map((item) => (
                  <div key={item.id} className="group/cat">
                    <Link href={item.slug.startsWith('/') ? item.slug : `/category/${item.slug}`} onClick={onClose}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 border border-gray-200 hover:border-blue-300 transition-all duration-300 text-center"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.hot ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {item.hot ? (
                          <span className="text-red-500 text-xs font-bold">HOT</span>
                        ) : (
                          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                        {item.subItems && item.subItems.length > 0 && (
                          <p className="text-xs text-gray-400 truncate max-w-[100px]">
                            {item.subItems.map(s => (s as any).name).join(', ')}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
