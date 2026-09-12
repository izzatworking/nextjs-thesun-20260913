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
  { name: 'WhatsApp', url: 'https://wa.me/thesunmalaysia', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  )},
  { name: 'Telegram', url: 'https://t.me/thesundaily', icon: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
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
  const animationRef = useRef<number | null>(null);

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
            <div className="bg-black text-white px-2.5 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0">
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
            <div className="bg-black text-white px-3 py-1.5 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="ml-3 text-white text-sm">No news available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="w-full bg-[#DC2626] py-2 overflow-hidden relative"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-black text-white px-3 py-2 md:py-1.5 font-bold text-xs uppercase tracking-wider flex-shrink-0">
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
