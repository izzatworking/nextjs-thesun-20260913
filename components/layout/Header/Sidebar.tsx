'use client';

import { useEffect } from 'react';
import type { CategoryItem } from './types';
import type { WPCategory } from '../../../types/wordpress';
import SidebarMenu from './SidebarMenu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
  categories?: WPCategory[];
}

export default function Sidebar({ isOpen, onClose, mainNavItems, categories = [] }: SidebarProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#1a0507]/70 backdrop-blur-sm z-[110] transition-opacity duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Floating panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          fixed top-3 bottom-3 left-3 z-[120] lg:hidden
          w-auto
          transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0'}
        `}
      >
        <div className="h-full w-[86vw] max-w-[400px] md:max-w-[460px] overflow-hidden rounded-[28px] md:rounded-[32px] shadow-[0_30px_80px_-20px_rgba(60,10,15,0.5)] ring-1 ring-red-900/10 bg-gradient-to-br from-[#fffaf5] via-[#ffffff] to-[#fdecef]">
          <SidebarMenu isOpen={isOpen} onClose={onClose} mainNavItems={mainNavItems} categories={categories} />
        </div>
      </div>
    </>
  );
}