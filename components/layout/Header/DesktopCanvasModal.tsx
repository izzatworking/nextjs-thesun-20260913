'use client';

import { useEffect } from 'react';
import type { CategoryItem } from './types';
import type { WPCategory } from '../../../types/wordpress';
import SidebarMenu from './SidebarMenu';

interface DesktopCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
  categories?: WPCategory[];
}

export default function DesktopCanvasModal({ isOpen, onClose, mainNavItems, categories = [] }: DesktopCanvasModalProps) {
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

  return (
    <div
      className={`
        fixed inset-0 z-[110]
        hidden lg:block
        transition-all duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1a0507]/70 backdrop-blur-md" onClick={onClose} />

      {/* Floating panel */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.97] opacity-0'
        }`}
      >
        <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] md:rounded-[32px] bg-gradient-to-br from-[#fffaf5] via-[#ffffff] to-[#fdecef] shadow-[0_40px_100px_-20px_rgba(60,10,15,0.6)] ring-1 ring-red-900/10">
          <SidebarMenu
            isOpen={isOpen}
            onClose={onClose}
            mainNavItems={mainNavItems}
            categories={categories}
            wide
          />
        </div>
      </div>
    </div>
  );
}