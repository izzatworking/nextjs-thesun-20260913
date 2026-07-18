'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface VideoPlayerModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

type Orientation = 'landscape' | 'portrait';

export default function VideoPlayerModal({ videoId, isOpen, onClose }: VideoPlayerModalProps) {
  const [showCTA, setShowCTA] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const stopVideo = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'pauseVideo',
        args: ''
      }), '*');
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !videoId) return;

    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (data.height && data.width) {
          setOrientation(data.height > data.width ? 'portrait' : 'landscape');
        }
      })
      .catch(() => setOrientation('landscape'));
  }, [isOpen, videoId]);

  useEffect(() => {
    if (isOpen) {
      setShowCTA(false);
      timerRef.current = setTimeout(() => {
        stopVideo();
        setShowCTA(true);
      }, 10000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, stopVideo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`relative bg-black rounded-2xl overflow-hidden shadow-2xl ${
        orientation === 'portrait'
          ? 'w-full max-w-[280px] max-h-[80vh]'
          : 'w-full max-w-4xl'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`relative ${orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&enablejsapi=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          {showCTA && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 p-6">
              <p className="text-white text-lg sm:text-xl font-semibold text-center">
                View more on our channel
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors active:scale-95"
              >
                Watch on YouTube
              </a>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white text-sm underline underline-offset-2 transition-colors"
              >
                Continue browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
