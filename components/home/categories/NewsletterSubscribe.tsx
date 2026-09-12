// components/home/categories/NewsletterSubscribe.tsx
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FiBell,
  FiMail,
  FiArrowRight,
  FiZap,
  FiPhone,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterSubscribeProps {
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURES = [
  { icon: FiZap, title: 'Breaking News', desc: 'As it happens', accent: 'bg-[#e30613]/10 text-[#e30613]' },
  { icon: FiPhone, title: 'Phone Alerts', desc: 'Straight to your inbox', accent: 'bg-[#005321]/10 text-[#005321]' },
];

export default function NewsletterSubscribe({ className = '' }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscribeStatus>('idle');
  const [error, setError] = useState('');
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = (i: number): string =>
    `${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100`;

  const validate = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(email);
    if (msg) {
      setError(msg);
      setStatus('idle');
      return;
    }
    setError('');
    setStatus('loading');

    // Simulate request — tukar dengan API sebenar nanti
    window.setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const loading = status === 'loading';

  return (
    <div ref={cardRef} className={className}>
      <div className="relative h-full overflow-hidden rounded-[28px] border border-[#005321]/10 bg-gradient-to-br from-white via-[#fdfcfb] to-[#f1f6f2] p-5 sm:p-7 shadow-[0_24px_70px_-30px_rgba(0,83,33,0.3)] flex flex-col">
        {/* Editorial top line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005321] via-[#e30613] to-[#005321]" />

        {/* Decorative arcs */}
        <svg className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 text-[#e30613]/10" viewBox="0 0 100 100" fill="none">
          <circle cx="90" cy="10" r="60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="140 240" />
        </svg>
        <svg className="pointer-events-none absolute -bottom-10 -left-10 h-44 w-44 text-[#005321]/10" viewBox="0 0 100 100" fill="none">
          <circle cx="10" cy="90" r="60" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray="120 260" />
        </svg>

        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-gradient-to-br from-[#e30613]/10 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-gradient-to-tr from-[#005321]/10 to-transparent blur-2xl" />

        {/* Editorial dots */}
        <div className="pointer-events-none absolute right-4 top-4 flex gap-1">
          <span className="h-1 w-1 rounded-full bg-[#005321]/20" />
          <span className="h-1 w-1 rounded-full bg-[#e30613]/20" />
          <span className="h-1 w-1 rounded-full bg-[#005321]/20" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          {/* Top: logo + badge */}
          <div className={`${reveal(0)} mb-5 flex items-center justify-between`} style={{ transitionDelay: '0ms' }}>
            <img src="/images/thesun.png" alt="theSun" className="h-6 w-auto sm:h-7" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#005321]/15 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#005321]">
              <FiBell className="h-3 w-3" aria-hidden="true" />
              Stay Informed
            </span>
          </div>

          {/* Heading */}
          <h2 className={`${reveal(1)} text-3xl font-black leading-none text-gray-900 xl:text-4xl`} style={{ transitionDelay: '70ms' }}>
            Subscribe to our
            <span className="block whitespace-nowrap bg-gradient-to-r from-[#e30613] to-[#005321] bg-clip-text text-transparent">
              Top Stories
            </span>
          </h2>

          {/* Subtext */}
          <p className={`${reveal(2)} mb-5 mt-3 text-sm leading-relaxed text-black-600`} style={{ transitionDelay: '140ms' }}>
            Get the latest breaking news, trending stories and important updates delivered straight to your inbox.
          </p>

          {/* Feature icons */}
          <ul className={`${reveal(3)} mb-6 flex flex-col gap-3`} style={{ transitionDelay: '210ms' }}>
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.accent}`}>
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Form / success state */}
          <div className={`${reveal(4)}`} style={{ transitionDelay: '280ms' }}>
            {status === 'success' ? (
              <div role="status" aria-live="polite" className="mb-5 rounded-2xl border border-[#005321]/15 bg-[#005321]/5 p-5 text-center">
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#005321] text-white">
                  <FiCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-bold text-[#005321]">You&apos;re subscribed!</p>
                <p className="mt-1 text-xs text-gray-600">The Sun&apos;s top stories are on their way to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mb-5">
                <div className="flex flex-col gap-3">
                  <div className="relative w-full">
                    <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="Enter your email address"
                      disabled={loading}
                      aria-invalid={!!error}
                      aria-describedby={error ? 'newsletter-error' : undefined}
                      className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder-gray-400 transition-all duration-200 focus:border-[#005321] focus:outline-none focus:ring-2 focus:ring-[#005321]/25 disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e30613] to-[#9f0710] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#e30613]/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#e30613]/30 hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                {(status === 'error' || error) && (
                  <p id="newsletter-error" role="alert" aria-live="assertive" className="mt-2 text-xs font-medium text-[#e30613]">
                    {error || 'Something went wrong. Please try again.'}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Privacy */}
          <p className={`${reveal(5)} text-xs text-gray-500`} style={{ transitionDelay: '350ms' }}>
            By subscribing, you agree to our{' '}
            <Link href="/privacy-policy" className="font-medium text-[#e30613] underline underline-offset-2 transition-colors hover:text-[#9f0710]">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}