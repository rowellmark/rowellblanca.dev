'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('cookie_consent');
    if (consent) {
      setAccepted(true);
      updateGoogleConsent(true, true);
    } else {
      setAccepted(false);
    }
  }, []);

  const updateGoogleConsent = (analyticsGranted: boolean, marketingGranted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
        ad_storage: marketingGranted ? 'granted' : 'denied',
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true }));
    setAccepted(true);
    setOpen(false);
    updateGoogleConsent(true, true);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  // Don't render until client-side mounted
  if (!mounted) return null;

  // Hide on admin and login pages
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const showBanner = !accepted || open;

  if (accepted && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Edit cookie preferences"
        className="fixed bottom-20 left-4 sm:left-6 z-[99999] p-3 rounded-full bg-slate-900/95 backdrop-blur-xl text-amber-400 border border-slate-800 shadow-2xl hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Cookie className="w-5 h-5" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="fixed bottom-20 left-4 sm:left-6 max-w-[calc(100vw-2rem)] sm:max-w-sm z-[99999]"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">We use cookies 🍪</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  We use cookies to improve your experience and measure site traffic.{' '}
                  <Link href="/privacy" className="text-amber-400 underline hover:text-amber-300 font-bold">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleAccept}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Accept Cookies
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
