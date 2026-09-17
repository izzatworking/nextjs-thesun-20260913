'use client';

import { useEffect, useRef, useState } from 'react';
import { FiMail, FiArrowRight, FiCheck, FiLoader, FiX } from 'react-icons/fi';

export type SubscribeMode = 'newsletter' | 'ipaper';

interface SubscribeModalProps {
  mode: SubscribeMode;
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeModal({ mode, isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isNewsletter = mode === 'newsletter';

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setStatus('idle');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={isNewsletter ? 'Subscribe to theSun newsletter' : 'Subscribe to iPaper'}>
      <div className="absolute inset-0 bg-[#1a0507]/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_40px_100px_-20px_rgba(30,10,15,0.55)] ring-1 ring-gray-100">
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E30613] via-[#E30613]/60 to-[#005321]" />

        <button
          onClick={onClose}
          aria-label="Close subscribe popup"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition hover:bg-red-50 hover:text-[#E30613] active:scale-95"
        >
          <FiX className="h-4 w-4" />
        </button>

        <div className="p-7 sm:p-8">
          {status === 'success' ? (
            <div className="text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#005321] text-white">
                <FiCheck className="h-6 w-6" />
              </span>
              <h3 className="text-xl font-black text-gray-900">
                You&apos;re subscribed!
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {isNewsletter
                  ? 'The Sun&apos;s top stories are on their way to your mailbox.'
                  : 'iPaper notifications are on their way to your mailbox.'}
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-gradient-to-r from-[#E30613] to-[#9f0710] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#E30613]/25 transition hover:brightness-110 active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                  <img
                    src={isNewsletter ? '/images/thesun.png' : '/images/ipaper2.png'}
                    alt={isNewsletter ? 'theSun' : 'iPaper'}
                    className={isNewsletter ? 'h-7 w-auto object-contain' : 'h-7 w-auto object-contain'}
                  />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E30613]">
                    theSun Malaysia
                  </p>
                  <h3 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                    {isNewsletter ? 'theSun Newsletter' : 'Subscribe to iPaper'}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-600">
                {isNewsletter
                  ? 'Subscribe to our Newsletter and get news delivered to your mailbox.'
                  : 'Subscribe to receive instant notifications of our iPaper edition.'}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6">
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <label htmlFor={`subscribe-${mode}`} className="sr-only">Email address</label>
                  <input
                    id={`subscribe-${mode}`}
                    ref={inputRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    placeholder="Enter your email address"
                    aria-invalid={!!error}
                    aria-describedby={error ? `subscribe-error-${mode}` : undefined}
                    className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-[#E30613] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E30613]/20"
                  />
                </div>

                {error && (
                  <p id={`subscribe-error-${mode}`} role="alert" className="mt-2 pl-4 text-xs font-medium text-[#E30613]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E30613] to-[#9f0710] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E30613]/25 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? (
                    <>
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <FiArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-[11px] text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}