'use client';

import Link from 'next/link';

export default function Footer() {
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

  return (
    <footer className="border-t border-gray-200" style={{background: '#e5e7eb'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Logo + About */}
          <div className="md:col-span-12 lg:col-span-4">
            <img src="/images/thesun.png" alt="The Sun Malaysia" className="h-14 sm:h-16 md:h-20 w-auto mb-3 md:mb-4" />
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Malaysia&apos;s leading news source delivering accurate, timely, and comprehensive coverage of news, sports, entertainment, and current events.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-7 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
            <div>
              <h4 className="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-1.5">
                <li><Link href="/about-us" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About Us</Link></li>
                <li><Link href="/contact-us" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact Us</Link></li>
                <li><Link href="/our-team" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Our Team</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-1.5">
                <li><Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Disclaimer</Link></li>
                <li><Link href="/advertise" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Advertise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">More</h4>
              <ul className="space-y-1.5">
                <li><Link href="/subscribe-now" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Subscribe</Link></li>
                <li><Link href="/ipaper" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">iPaper</Link></li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-5 lg:col-span-3">
            <h4 className="text-[11px] md:text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Follow Us</h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-200/70 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-300/50 mt-8 md:mt-10 pt-6 md:pt-7 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">&copy; 2025 The Sun Malaysia. All rights reserved.</p>
          <p className="text-xs text-gray-500">Built with integrity, driven by truth.</p>
        </div>
      </div>
    </footer>
  );
}
