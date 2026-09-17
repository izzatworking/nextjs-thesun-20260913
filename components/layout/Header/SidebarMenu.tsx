'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMail, FiBell, FiArrowRight } from 'react-icons/fi';
import type { CategoryItem } from './types';
import type { WPCategory } from '../../../types/wordpress';
import { cleanHtmlContent } from '../../home/utils/contentCleaner';
import { getShortenedCategorySlug } from '../../../lib/wordpress';
import SubscribeModal, { SubscribeMode } from '../../common/SubscribeModal';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: CategoryItem[];
  categories?: WPCategory[];
  wide?: boolean;
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

export default function SidebarMenu({
  isOpen,
  onClose,
  mainNavItems,
  categories = [],
  wide = false,
}: SidebarMenuProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [subscribeMode, setSubscribeMode] = useState<SubscribeMode | null>(null);

  // Reset accordion when panel closes
  useEffect(() => {
    if (!isOpen) {
      setExpanded(null);
    }
  }, [isOpen]);

  // Build child-category lookup from the WP category tree (by parent slug)
  const byId = new Map(categories.map((c) => [c.id, c]));
  const childrenBySlug: Record<string, WPCategory[]> = {};
  for (const c of categories) {
    if (c.parent !== undefined && c.parent !== 0 && byId.has(c.parent)) {
      const parentSlug = byId.get(c.parent)!.slug;
      (childrenBySlug[parentSlug] ||= []).push(c);
    }
  }

  const hasChildren = (item: CategoryItem) =>
    (item.subItems && item.subItems.length > 0) || (childrenBySlug[item.slug] || []).length > 0;

  const getChildren = (item: CategoryItem) => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.map((s: any, i: number) => ({
        id: typeof s.id === 'number' ? s.id : i + 1000,
        name: s.name,
        slug: s.slug,
        href: s.href,
        parent: 0,
      } as WPCategory & { href?: string }));
    }
    return childrenBySlug[item.slug] || [];
  };

  const hrefFor = (slug: string) => `/${getShortenedCategorySlug(slug.replace(/^\/+/, ''))}`;
  const toggle = (id: number) => setExpanded(expanded === id ? null : id);

  const navItems = mainNavItems.filter((i) => i.name !== 'Home');
  const topItems = navItems.filter((i) => !i.external);
  const externalItems = navItems.filter((i) => i.external);

  const childrenRows = (item: CategoryItem) => {
    const children = getChildren(item);
    const childLink = (sub: WPCategory & { href?: string }) => (
      <Link
        key={sub.id}
        href={(sub as any).href || hrefFor(sub.slug)}
        onClick={onClose}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-[#5d3a40] transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-200" />
        {cleanHtmlContent(sub.name)}
      </Link>
    );

    return children.map(childLink);
  };

  const renderRow = (item: CategoryItem) => {
    const children = getChildren(item);

    if (hasChildren(item)) {
      return (
        <div key={item.id} className="rounded-2xl px-1 py-0.5">
          <button
            onClick={() => toggle(item.id)}
            className="group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-[#2b0a0e] transition-colors hover:bg-white/70"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span className="text-[15px] font-bold tracking-tight group-hover:text-red-600 transition-colors">
              {cleanHtmlContent(item.name)}
            </span>
            <svg
              className={`ml-auto h-4 w-4 text-[#b98f96] transition-transform duration-300 ${
                expanded === item.id ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expanded === item.id ? 'max-h-[480px]' : 'max-h-0'
            }`}
          >
            <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-red-100 pb-1 pl-4">
              {childrenRows(item)}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={hrefFor(item.slug)}
        onClick={onClose}
        className="group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[#2b0a0e] transition-colors hover:bg-white/70"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400 group-hover:bg-red-600" />
        <span className="text-[15px] font-bold tracking-tight group-hover:text-red-600 transition-colors">
          {cleanHtmlContent(item.name)}
        </span>
        <svg
          className="ml-auto h-4 w-4 text-[#d3b6bb] transition-transform group-hover:translate-x-1 group-hover:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* ---------- Header ---------- */}
      <div className="relative overflow-hidden px-6 md:px-8 pt-7 pb-6">
        <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-gradient-to-br from-red-500/25 to-red-300/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-52 w-52 rounded-full bg-gradient-to-tr from-red-600/10 to-transparent blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-red-600/70 font-semibold">
              The Sun Malaysia
            </p>
            <p className="mt-1.5 text-[26px] md:text-[28px] font-extrabold leading-none text-[#2b0a0e] tracking-tight">
              Categories
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 backdrop-blur ring-1 ring-red-200/50 text-[#3a1217] shadow-[0_8px_24px_-12px_rgba(180,40,50,0.4)] transition hover:bg-red-600 hover:text-white hover:ring-red-500 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className={`relative mt-4 leading-relaxed text-[#6b4a4f] text-[12.5px] md:text-[13px] ${wide ? 'max-w-none' : 'max-w-[220px]'}`}>
          Explore the latest news, business, sports and lifestyle from across the nation.
        </p>
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-4 scrollbar-hide">
        {/* Home highlight */}
        <div className={`${wide ? 'px-1 ' : 'px-2 md:px-3 '}pt-2 pb-1`}>
          <Link
            href="/"
            onClick={onClose}
            className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_18px_40px_-18px_rgba(220,38,38,0.7)] transition-transform active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight">Home</span>
              <span className="text-[11px] font-medium text-white/70">Top stories &amp; headlines</span>
            </div>
            <svg className="ml-auto h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Sections */}
        {wide ? (
          <div className="mt-3 grid grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-1">
            {topItems.map(renderRow)}
          </div>
        ) : (
          <div className="mt-4 space-y-1.5">
            {topItems.map(renderRow)}
          </div>
        )}
      </div>

      {/* ---------- Footer / external + social ---------- */}
      <div className="relative px-5 md:px-6 py-5">
        <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-transparent to-[#fdf3f5]" />

        {externalItems.length > 0 && (
          <div className={`mb-4 flex gap-2.5 ${wide ? 'flex-col sm:flex-row' : 'flex-col'}`}>
            {externalItems.map((item) => (
              <a
                key={item.id}
                href={item.slug}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl border border-white bg-white/70 px-4 py-3 text-[#2b0a0e] ring-1 ring-red-100/60 shadow-[0_12px_30px_-18px_rgba(120,40,20,0.5)] transition hover:border-red-200 hover:bg-white active:scale-[0.98] ${wide ? 'flex-1' : ''}`}
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-red-100/60">
                  <img
                    src={item.name === 'ipaper' ? '/images/ipaper2.png' : '/images/classifieds.png'}
                    alt={cleanHtmlContent(item.name)}
                    className={
                      item.name === 'ipaper'
                        ? 'h-6 w-6 object-contain'
                        : 'h-4 w-full object-contain'
                    }
                  />
                </span>
                <span className="text-[14px] font-bold tracking-tight">{cleanHtmlContent(item.name)}</span>
                <svg className="ml-auto h-4 w-4 text-[#c4a6ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Subscribe cards */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white/80 p-3.5 shadow-[0_12px_30px_-18px_rgba(120,40,20,0.5)] ring-1 ring-red-100/60">
            <div className="min-w-0">
              <img src="/images/thesun.png" alt="theSun" className="h-5 w-auto" />
              <p className="mt-1.5 text-[13px] font-bold leading-tight text-[#2b0a0e]">Subscribe to theSun</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[#6b4a4f]">
                Get the latest headlines delivered to you daily
              </p>
            </div>
            <button
              onClick={() => setSubscribeMode('newsletter')}
              className="shrink-0 rounded-full bg-gradient-to-r from-[#E30613] to-[#9f0710] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#E30613]/25 transition hover:brightness-110 active:scale-95"
            >
              Subscribe
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white/80 p-3.5 shadow-[0_12px_30px_-18px_rgba(120,40,20,0.5)] ring-1 ring-red-100/60">
            <div className="min-w-0">
              <img src="/images/ipaper2.png" alt="iPaper" className="h-5 w-auto" />
              <p className="mt-1.5 text-[13px] font-bold leading-tight text-[#2b0a0e]">Subscribe to iPaper</p>
              <p className="mt-0.5 text-[11px] leading-snug text-[#6b4a4f]">
                Receive instant notifications of our iPaper edition.
              </p>
            </div>
            <button
              onClick={() => setSubscribeMode('ipaper')}
              className="shrink-0 rounded-full bg-gradient-to-r from-[#005321] to-[#013e1a] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#005321]/25 transition hover:brightness-110 active:scale-95"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Social media */}
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-600/60">
            Follow Us
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                title={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white bg-white/80 text-[#4a2530] ring-1 ring-red-100/60 shadow-[0_8px_20px_-12px_rgba(120,40,20,0.4)] transition hover:bg-red-600 hover:text-white hover:ring-red-500 active:scale-95"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <SubscribeModal
        mode={subscribeMode ?? 'newsletter'}
        isOpen={subscribeMode !== null}
        onClose={() => setSubscribeMode(null)}
      />
    </div>
  );
}