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
      <div className="w-full bg-[#307EDB] py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-[#DB5151] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="ml-3 flex items-center flex-1">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-white text-xs">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (breakingNews.length === 0) {
    return (
      <div className="w-full bg-[#307EDB] py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="bg-[#DB5151] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0">
              BREAKING
            </div>
            <div className="ml-3 text-white text-xs">No news available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[#307EDB] py-2 overflow-hidden relative"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="bg-[#DB5151] text-white px-3 py-1 font-bold text-xs uppercase tracking-wider flex-shrink-0">
            BREAKING
          </div>
          <div className="flex-1 overflow-hidden ml-3 h-5">
            <div
              ref={marqueeRef}
              className="flex whitespace-nowrap h-full items-center"
              style={{ transform: `translateX(${position}px)`, willChange: 'transform' }}
            >
              <div ref={contentRef} className="flex items-center space-x-6 pr-6">
                {breakingNews.map((news, index) => (
                  <div key={news.id} className="flex items-center">
                    {news.category && (
                      <span className="bg-[#307EDB]/40 text-white px-2 py-0.5 rounded text-[10px] font-bold mr-2 whitespace-nowrap">
                        {cleanHtmlContent(news.category)}
                      </span>
                    )}
                    <Link href={news.link} className="text-white hover:text-gray-200 text-xs font-medium whitespace-nowrap transition-colors">
                      {cleanHtmlContent(news.title)}
                    </Link>
                    {index < breakingNews.length - 1 && (
                      <span className="mx-3 text-white/50 text-xs">•</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-6 pr-6">
                {breakingNews.map((news, index) => (
                  <div key={`dup-${news.id}`} className="flex items-center">
                    {news.category && (
                      <span className="bg-[#307EDB]/40 text-white px-2 py-0.5 rounded text-[10px] font-bold mr-2 whitespace-nowrap">
                        {cleanHtmlContent(news.category)}
                      </span>
                    )}
                    <Link href={news.link} className="text-white hover:text-gray-200 text-xs font-medium whitespace-nowrap transition-colors">
                      {cleanHtmlContent(news.title)}
                    </Link>
                    {index < breakingNews.length - 1 && (
                      <span className="mx-3 text-white/50 text-xs">•</span>
                    )}
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
