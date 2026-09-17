'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { CategoryItem } from './types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
}

export default function MobileSidebar({ isOpen, onClose, mainNavItems }: MobileSidebarProps) {
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
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div className={`
        fixed top-0 left-0 h-full w-[80vw] max-w-sm bg-slate-900 z-[110] transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-slate-700/50 bg-slate-800/50">
          <span className="text-lg font-bold text-white">Menu</span>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 h-[calc(100%-68px)] overflow-y-auto">
          <div className="space-y-2">
            <Link href="/" onClick={onClose}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 hover:bg-slate-700/50 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-white font-medium">Home</span>
            </Link>
            {mainNavItems.filter(i => i.name !== 'Home').map((item) => (
              <div key={item.id}>
                {item.external ? (
                  <a href={item.slug} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-yellow-500/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-yellow-400 text-xs font-bold">iP</span>
                      </div>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <>
                    <Link href={`/${item.slug}`} onClick={onClose}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 hover:bg-slate-700/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {item.hot && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">HOT</span>}
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      {item.subItems && item.subItems.length > 0 ? (
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                    {item.subItems && item.subItems.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-3">
                        <Link href={`/${item.slug}`} onClick={onClose}
                          className="block p-3 rounded-lg bg-slate-700/30 hover:bg-blue-500/10 transition-all duration-200"
                        >
                          <span className="text-blue-300 text-sm font-medium">All {item.name}</span>
                        </Link>
                        {item.subItems.map((sub: any) => (
                          <Link key={sub.id} href={sub.href || (sub.slug.startsWith('/') ? sub.slug : `/${sub.slug}`)} onClick={onClose}
                            className="block p-3 rounded-lg hover:bg-slate-700/30 transition-all duration-200"
                          >
                            <span className="text-slate-300 text-sm">{sub.name}</span>
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
