// components/home/categories/NewsletterSubscribe.tsx
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  FiMail,
  FiArrowRight,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterSubscribeProps {
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    <div ref={cardRef} className={`w-full ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_-35px_rgba(0,0,0,0.35)] flex flex-col">
        {/* Editorial top accent */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e30613] via-[#e30613] to-[#9f0710]" />
        {/* Subtle background texture */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,6,19,0.06),transparent_55%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-6 text-center sm:px-8">
          {/* Logo */}
          <img
            src="/images/thesun.png"
            alt="theSun"
            className={`${reveal(0)} h-6 w-auto sm:h-7`}
            style={{ transitionDelay: '0ms' }}
          />

          {/* Eyebrow */}
          <span
            className={`${reveal(1)} mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#e30613]/15 bg-[#e30613]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e30613]`}
            style={{ transitionDelay: '60ms' }}
          >
            The Sun Newsletter
          </span>

          {/* Heading */}
          <h2
            className={`${reveal(2)} mt-3 text-2xl font-black leading-[1.05] tracking-tight text-gray-900 sm:text-3xl`}
            style={{ transitionDelay: '120ms' }}
          >
            Subscribe to our
            <span className="block text-[#e30613]">Top Stories</span>
          </h2>

          {/* Subtext */}
          <p
            className={`${reveal(3)} mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500`}
            style={{ transitionDelay: '180ms' }}
          >
            The latest breaking news and trending stories, delivered straight to your inbox.
          </p>

          {/* Form / success state */}
          <div className={`${reveal(4)} mt-5 w-full max-w-sm`} style={{ transitionDelay: '240ms' }}>
            {status === 'success' ? (
              <div role="status" aria-live="polite" className="rounded-2xl border border-[#005321]/15 bg-[#005321]/5 p-5">
                <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#005321] text-white">
                  <FiCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-bold text-[#005321]">You&apos;re subscribed!</p>
                <p className="mt-1 text-xs text-gray-600">Top stories are on their way to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
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
                      className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder-gray-400 transition-all duration-200 focus:border-[#e30613] focus:outline-none focus:ring-2 focus:ring-[#e30613]/20 disabled:opacity-60"
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

          {/* Trust row */}
          <div
            className={`${reveal(5)} mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400`}
            style={{ transitionDelay: '300ms' }}
          >
            <span>Breaking News</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Daily Digest</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>No Spam</span>
          </div>

          {/* Privacy */}
          <p className={`${reveal(6)} mt-2 text-[11px] text-gray-400`} style={{ transitionDelay: '340ms' }}>
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
