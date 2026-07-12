'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { BreakingNews as BreakingNewsType } from './types';
import { cleanHtmlContent } from '../../home/utils/contentCleaner';

interface BreakingNewsProps {
  breakingNews: BreakingNewsType[];
  isLoading: boolean;
  isPaused: boolean;
  onHover: (hovering: boolean) => void;
  marqueeRef: React.RefObject<HTMLDivElement>;
}

const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/thesundaily', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { name: 'X', url: 'https://x.com/thesundaily', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { name: 'Instagram', url: 'https://www.instagram.com/thesundaily/', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>
  )},
  { name: 'TikTok', url: 'https://www.tiktok.com/@thesundaily', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.33 6.33 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
  )},
  { name: 'YouTube', url: 'https://www.youtube.com/theSunMedia', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  )},
];

export default function BreakingNews({
  breakingNews,
  isLoading,
  isPaused,
  onHover,
  marqueeRef
}: BreakingNewsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const animationRef = useRef<number>();

  const SPEED = 50;

  useEffect(() => {
    if (breakingNews.length > 0 && contentRef.current) {
      setTimeout(() => {
        const width = contentRef.current?.scrollWidth || 0;
        setContentWidth(width);
      }, 100);
    }
  }, [breakingNews]);

  useEffect(() => {
    if (isLoading || isPaused || breakingNews.length === 0 || contentWidth === 0) return;
    let lastTime: number;
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      setPosition(prev => {
        let newPos = prev - (SPEED * deltaTime) / 1000;
        if (newPos <= -contentWidth) newPos = 0;
        return newPos;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isLoading, isPaused, breakingNews.length, contentWidth]);

  useEffect(() => {
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full bg-[#DC2626] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-[#1E40AF] text-white px-2.5 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="ml-3 flex items-center flex-1">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-white text-sm">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) {
    return (
      <div className="w-full bg-[#DC2626] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-[#1E40AF] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="ml-3 text-white text-sm">No news available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full bg-[#DC2626] py-1.5 overflow-hidden relative"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-[#1E40AF] text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="flex-1 overflow-hidden ml-3 h-6">
              <div
                ref={marqueeRef}
                className="flex whitespace-nowrap h-full items-center"
                style={{ transform: `translateX(${position}px)`, willChange: 'transform' }}
              >
                <div ref={contentRef} className="flex items-center space-x-6 pr-6">
                  {breakingNews.map((news, index) => (
                    <div key={news.id} className="flex items-center">
                      {news.category && (
                        <span className="bg-white/15 border border-white/30 text-white px-2 py-0.5 rounded text-xs font-bold mr-2 whitespace-nowrap">
                          {cleanHtmlContent(news.category)}
                        </span>
                      )}
                      <Link href={news.link} className="text-white hover:text-yellow-300 text-sm font-medium whitespace-nowrap transition-colors">
                        {cleanHtmlContent(news.title)}
                      </Link>
                      {index < breakingNews.length - 1 && (
                        <span className="mx-3 text-white/50 text-sm">•</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-6 pr-6">
                  {breakingNews.map((news, index) => (
                    <div key={`dup-${news.id}`} className="flex items-center">
                      {news.category && (
                        <span className="bg-white/15 border border-white/30 text-white px-2 py-0.5 rounded text-xs font-bold mr-2 whitespace-nowrap">
                          {cleanHtmlContent(news.category)}
                        </span>
                      )}
                      <Link href={news.link} className="text-white hover:text-yellow-300 text-sm font-medium whitespace-nowrap transition-colors">
                        {cleanHtmlContent(news.title)}
                      </Link>
                      {index < breakingNews.length - 1 && (
                        <span className="mx-3 text-white/50 text-sm">•</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="hidden lg:flex items-center gap-1 ml-3 flex-shrink-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
