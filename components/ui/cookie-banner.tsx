'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

type Consent = { necessary: true; analytics: boolean; marketing: boolean };

const updateGoogleConsent = (analyticsGranted: boolean, marketingGranted: boolean) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: marketingGranted ? 'granted' : 'denied',
    });
  }
};

export function CookieBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [decided, setDecided] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('cookie_consent');
    if (raw) {
      setDecided(true);
      try {
        const consent = JSON.parse(raw) as Consent;
        updateGoogleConsent(Boolean(consent.analytics), Boolean(consent.marketing));
      } catch {
        updateGoogleConsent(true, true);
      }
    }
  }, []);

  const showBanner = mounted && (!decided || open);

  // Publish the banner's height so the RowBot dock can sit above it on phones.
  useEffect(() => {
    const root = document.documentElement;
    const el = panelRef.current;
    if (!showBanner || !el) {
      root.style.setProperty('--cookie-offset', '0px');
      delete root.dataset.cookieOpen;
      return;
    }
    root.dataset.cookieOpen = 'true';
    const sync = () => root.style.setProperty('--cookie-offset', `${el.offsetHeight + 12}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty('--cookie-offset', '0px');
      delete root.dataset.cookieOpen;
    };
  }, [showBanner]);

  const save = (consent: Consent) => {
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setDecided(true);
    setOpen(false);
    updateGoogleConsent(consent.analytics, consent.marketing);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  if (!mounted) return null;

  // Hide on admin and login pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <>
      {decided && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Cookie preferences"
          className="fixed left-4 sm:left-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-6 z-[99999] h-11 w-11 rounded-full bg-brand-ink/90 backdrop-blur-xl text-amber-400 border border-white/10 hover:border-amber-400/60 shadow-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <Cookie className="w-[18px] h-[18px]" aria-hidden="true" />
        </button>
      )}

      {showBanner && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Cookie preferences"
            className="motion-fade fixed z-[99999] inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[400px]"
          >
            <div className="rounded-[22px] bg-brand-ink/95 backdrop-blur-xl text-white border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3.5">
                <span className="h-10 w-10 shrink-0 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center" aria-hidden="true">
                  <Cookie className="w-5 h-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="m-0 font-extrabold">Cookies, the useful kind</p>
                  <p className="m-0 text-sm text-slate-300 leading-relaxed">
                    Analytics cookies help me see what&apos;s working on this site. Essential cookies are always on.{' '}
                    <Link href="/privacy" className="motion-underline text-amber-400 hover:text-amber-300 font-semibold">
                      Privacy policy
                    </Link>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                  className="min-h-[44px] px-4 rounded-full border border-white/20 hover:border-white/50 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Essential only
                </button>
                <button
                  type="button"
                  onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                  className="min-h-[44px] px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-sm font-bold text-brand-ink transition-colors cursor-pointer"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
      )}
    </>
  );
}
