'use client';

import { GetServerSideProps } from 'next';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { getCategories } from '../lib/wordpress';
import type { WPCategory } from '../types/wordpress';
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaYoutube,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

interface Social {
  name: string;
  url: string;
  Icon: IconType;
  handle: string;
  colour: string;
}

const socials: Social[] = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/thesundaily',
    Icon: FaFacebookF,
    handle: '@thesundaily',
    colour: '#1877F2',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/thesundaily/',
    Icon: FaInstagram,
    handle: '@thesundaily',
    colour: '#E1306C',
  },
  {
    name: 'X',
    url: 'https://x.com/thesundaily',
    Icon: FaXTwitter,
    handle: '@thesundaily',
    colour: '#000000',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@thesundaily',
    Icon: FaTiktok,
    handle: '@thesundaily',
    colour: '#010101',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/theSunMedia',
    Icon: FaYoutube,
    handle: 'theSunMedia',
    colour: '#FF0000',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/thesunmalaysia',
    Icon: FaWhatsapp,
    handle: 'The Sun Malaysia',
    colour: '#25D366',
  },
  {
    name: 'Telegram',
    url: 'https://t.me/thesundaily',
    Icon: FaTelegram,
    handle: '@thesundaily',
    colour: '#0088CC',
  },
];

interface FollowUsPageProps {
  categories: WPCategory[];
}

export default function FollowUsPage({ categories }: FollowUsPageProps) {
  return (
    <Layout categories={categories} title="Follow Us | The Sun Malaysia">
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F3F4F6]">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] via-[#111827] to-[#030712]">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(rgba(227,6,19,0.8) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute -top-20 -left-16 w-80 h-80 bg-[#E30613]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E30613]/10 rounded-full blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
            <nav className="flex items-center gap-2 text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#E30613]">Follow Us</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight leading-[0.95]">
              Follow Us
            </h1>
            <p className="text-white/55 text-base md:text-lg mt-3 max-w-xl font-medium leading-relaxed">
              Stay connected with The Sun Malaysia across all platforms.
            </p>
          </div>
        </div>

        {/* Social cards */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]/50 focus-visible:ring-offset-2"
              >
                {/* Accent bar top */}
                <div
                  className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: social.colour }}
                />

                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${social.colour}12` }}
                  >
                    <social.Icon className="h-6 w-6 transition-colors duration-300" style={{ color: social.colour }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-gray-900">{social.name}</h3>
                    <p className="text-[12px] text-gray-400 truncate">{social.handle}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: social.colour }}>
                  <span>Follow</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* Newsletter / Subscribe strip */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#1F2937] to-[#111827] p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Never miss a story.</h2>
                <p className="text-white/50 text-sm mt-1">Get the latest news delivered straight to your inbox.</p>
              </div>
              <Link
                href="/subscribe-now"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#E30613]/25 transition-all duration-200 hover:bg-[#C00510] hover:shadow-xl hover:shadow-[#E30613]/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                Subscribe now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<FollowUsPageProps> = async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=600'
  );
  const categories = await getCategories().catch(() => [] as WPCategory[]);
  return { props: { categories } };
};
