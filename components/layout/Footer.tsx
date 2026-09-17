'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
} from 'react-icons/fa6';

const HOME_URL = '/';

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/thesundaily/', Icon: FaInstagram },
  { name: 'Facebook', url: 'https://www.facebook.com/thesundaily', Icon: FaFacebookF },
  { name: 'X', url: 'https://x.com/thesundaily', Icon: FaXTwitter },
  { name: 'TikTok', url: 'https://www.tiktok.com/@thesundaily', Icon: FaTiktok },
  { name: 'WhatsApp', url: 'https://wa.me/thesunmalaysia', Icon: FaWhatsapp },
  { name: 'Telegram', url: 'https://t.me/thesundaily', Icon: FaTelegram },
  { name: 'YouTube', url: 'https://www.youtube.com/theSunMedia', Icon: FaYoutube },
];

interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const columns: FooterColumn[] = [
  {
    title: 'News',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Malaysia', href: '/news/malaysia' },
      { label: 'Asia', href: '/news/asia' },
      { label: 'World', href: '/news/world' },
      { label: 'Going Viral', href: '/going-viral' },
      { label: 'Business', href: '/business' },
      { label: 'Opinion', href: '/opinion' },
      { label: 'Berita', href: '/berita' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Lifestyle', href: '/lifestyle' },
      { label: 'Spotlight', href: '/spotlight' },
      { label: 'Sports', href: '/sports' },
      { label: 'Education', href: '/education' },
      { label: 'Property', href: '/property' },
      { label: 'Motoring', href: '/motoring' },
      { label: 'Videos', href: '/videos' },
      { label: 'Latest News', href: '/latest-news' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Company', href: '/about-us' },
      { label: 'Contact', href: '/contact-us' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Advertising', href: '/advertise' },
    ],
  },
  {
    title: 'Subscriptions',
    links: [
      { label: 'Newspaper', href: '/subscriptions' },
      { label: 'Subscribe Now', href: '/subscribe-now' },
      { label: 'iPaper', href: '/ipaper' },
      { label: 'iPaper Digital', href: 'https://thesun-ipaper.cld.bz/', external: true },
    ],
  },
  {
    title: 'Advertise',
    links: [
      { label: 'Advertising', href: '/advertise' },
      { label: 'Classifieds', href: 'https://sunmedia.com.my/', external: true },
    ],
  },
];

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const className =
    'inline-flex items-center gap-1 text-[13px] text-[#525252] py-1 transition-colors duration-200 hover:text-[#E30613] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/40 focus-visible:rounded';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${label} (opens in a new tab)`}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function Footer() {
  const [openCol, setOpenCol] = useState<number | null>(null);

  const toggleCol = (i: number) => setOpenCol(openCol === i ? null : i);

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F3F4F6] text-[#1F2937]">
      {/* Top accent rule */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E30613] via-[#E30613]/60 to-[#005321]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ============ Main footer ============ */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 py-12 md:py-16 lg:grid-cols-12">
          {/* Brand / App download */}
          <div className="lg:col-span-4 xl:col-span-4">
            <Link href={HOME_URL} className="inline-block" aria-label="The Sun Malaysia — Home">
              <img
                src="/images/thesun.png"
                alt="The Sun Malaysia"
                className="h-12 md:h-14 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#525252]">
              Independent Malaysian Journalism.
            </p>

            <div className="mt-7 border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F2937]">
                Download our app now
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#525252]">
                Your trusted source for news that matters.
              </p>
            </div>
          </div>

          {/* Navigation columns */}
          <div className="lg:col-span-8 xl:col-span-8">
            <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-5 gap-8">
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F2937] pb-2.5 mb-1 border-b border-[#E5E7EB] relative">
                    {col.title}
                  </h3>
                  <ul className="mt-3 space-y-0.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink label={link.label} href={link.href} external={link.external} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile accordion */}
            <div className="md:hidden divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
              {columns.map((col, i) => {
                const open = openCol === i;
                return (
                  <div key={col.title}>
                    <button
                      onClick={() => toggleCol(i)}
                      className="flex w-full items-center justify-between py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/40"
                      aria-expanded={open}
                      aria-controls={`footer-col-${i}`}
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F2937]">
                        {col.title}
                      </span>
                      <svg
                        className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {open && (
                      <div id={`footer-col-${i}`} className="pb-4">
                        <ul className="space-y-1">
                          {col.links.map((link) => (
                            <li key={link.label}>
                              {link.external ? (
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenCol(null)}
                                  className="inline-flex items-center gap-1 text-[13px] text-[#525252] py-1 transition-colors duration-200 hover:text-[#E30613]"
                                >
                                  {link.label}
                                </a>
                              ) : (
                                <Link
                                  href={link.href}
                                  onClick={() => setOpenCol(null)}
                                  className="inline-flex items-center gap-1 text-[13px] text-[#525252] py-1 transition-colors duration-200 hover:text-[#E30613]"
                                >
                                  {link.label}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============ Follow us / social strip ============ */}
        <div className="flex flex-col items-start justify-between gap-5 border-t border-[#E5E7EB] py-7 md:flex-row md:items-center">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F2937]">Follow Us</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {socialLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                title={name}
                className="group flex h-9 w-9 items-center justify-center rounded-md bg-[#E5E7EB] text-[#374151] transition-all duration-200 hover:bg-[#E30613] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/50"
              >
                <Icon className="h-[15px] w-[15px]" />
              </a>
            ))}
          </div>
        </div>

        {/* ============ Bottom bar ============ */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#E5E7EB] py-6 md:flex-row">
          <p className="text-center text-xs text-[#525252] md:text-left">
            © 1993-2026 All Rights Reserved.
          </p>
          <p className="text-center text-xs text-[#525252] md:text-right">
            <Link
              href={HOME_URL}
              className="font-semibold text-[#E30613] hover:text-[#b30310] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/40 rounded"
            >
              The Sun Malaysia
            </Link>{' '}
            — A Publication of Sun Media Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
