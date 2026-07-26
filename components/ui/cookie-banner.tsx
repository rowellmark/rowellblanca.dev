'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, Check, X, SlidersHorizontal, Lock, RotateCcw } from 'lucide-react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentConsentStatus, setCurrentConsentStatus] = useState<string>('pending');

  // Category States (Strictly FALSE by default until user explicitly accepts)
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const loadConsent = () => {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        setShowBanner(true);
        setCurrentConsentStatus('pending');
        setAnalytics(false);
        setMarketing(false);
      } else {
        try {
          const parsed = JSON.parse(consent);
          if (typeof parsed === 'object' && parsed !== null) {
            setAnalytics(!!parsed.analytics);
            setMarketing(!!parsed.marketing);
            if (parsed.analytics && parsed.marketing) {
              setCurrentConsentStatus('all');
            } else if (!parsed.analytics && !parsed.marketing) {
              setCurrentConsentStatus('essential');
            } else {
              setCurrentConsentStatus('custom');
            }
          } else if (consent === 'all') {
            setAnalytics(true);
            setMarketing(true);
            setCurrentConsentStatus('all');
          } else {
            setAnalytics(false);
            setMarketing(false);
            setCurrentConsentStatus('essential');
          }
        } catch {
          if (consent === 'all') {
            setAnalytics(true);
            setMarketing(true);
            setCurrentConsentStatus('all');
          } else {
            setAnalytics(false);
            setMarketing(false);
            setCurrentConsentStatus('essential');
          }
        }
      }
    };

    loadConsent();
    window.addEventListener('cookie_consent_updated', loadConsent);
    return () => window.removeEventListener('cookie_consent_updated', loadConsent);
  }, []);

  const updateGoogleConsent = (analyticsGranted: boolean, marketingGranted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
        ad_storage: marketingGranted ? 'granted' : 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    const preferences = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setAnalytics(true);
    setMarketing(true);
    setCurrentConsentStatus('all');
    updateGoogleConsent(true, true);
    setShowBanner(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handleRejectAll = () => {
    const preferences = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setAnalytics(false);
    setMarketing(false);
    setCurrentConsentStatus('essential');
    updateGoogleConsent(false, false);
    setShowBanner(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handleSaveCustom = () => {
    const preferences = { necessary: true, analytics, marketing };
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setCurrentConsentStatus(analytics || marketing ? 'custom' : 'essential');
    updateGoogleConsent(analytics, marketing);
    setShowBanner(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handleResetConsent = () => {
    localStorage.removeItem('cookie_consent');
    setAnalytics(false);
    setMarketing(false);
    setCurrentConsentStatus('pending');
    updateGoogleConsent(false, false);
    setShowBanner(true);
    setShowPreferences(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  if (!showBanner) {
    return (
      <button
        type="button"
        onClick={() => setShowBanner(true)}
        aria-label="Cookie Preferences"
        title={`Cookie Preferences (${
          currentConsentStatus === 'all'
            ? 'Accepted All'
            : currentConsentStatus === 'essential'
            ? 'Essential Only'
            : currentConsentStatus === 'custom'
            ? 'Custom Preferences'
            : 'Action Required'
        })`}
        className="fixed bottom-5 left-5 z-50 h-12 w-12 rounded-full bg-slate-900/95 border border-slate-700 shadow-2xl flex items-center justify-center text-amber-400 hover:text-amber-300 hover:scale-110 hover:bg-slate-800 transition-all duration-300 group cursor-pointer relative"
      >
        <Cookie className="w-5 h-5 group-hover:rotate-12 transition-transform" />

        {/* Visual Badge Indicator on Button */}
        {currentConsentStatus === 'all' && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[9px] font-black text-slate-950 shadow-sm" title="All Cookies Accepted">
            ✓
          </span>
        )}
        {currentConsentStatus === 'essential' && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 border-2 border-slate-950 flex items-center justify-center text-[9px] font-black text-slate-950 shadow-sm" title="Essential Cookies Only">
            !
          </span>
        )}
        {currentConsentStatus === 'custom' && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-slate-950 flex items-center justify-center text-[9px] font-black text-white shadow-sm" title="Custom Preferences">
            ⚙
          </span>
        )}
        {currentConsentStatus === 'pending' && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-slate-950"></span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:max-w-lg z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Cookie Privacy Preferences</span>
                </h4>

                {/* Live Status Badge */}
                {currentConsentStatus === 'all' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    All Accepted
                  </span>
                )}
                {currentConsentStatus === 'essential' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Essential Only (Denied)
                  </span>
                )}
                {currentConsentStatus === 'custom' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                    Customized
                  </span>
                )}
                {currentConsentStatus === 'pending' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-amber-400 border border-amber-500/30">
                    Action Required (Not Accepted)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                We use essential cookies to run our portfolio and optional analytics cookies to measure site traffic under GDPR & ePrivacy regulations.{' '}
                <Link href="/privacy" className="text-amber-400 underline hover:text-amber-300 font-bold">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Granular Preferences Accordion/Panel */}
        {showPreferences && (
          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs animate-in fade-in duration-200">
            
            {/* 1. Necessary */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5 font-extrabold text-white">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Strictly Necessary Cookies</span>
                </div>
                <p className="text-[11px] text-slate-400">Required for security, navigation, and contact forms.</p>
              </div>
              <span className="px-2 py-1 rounded-md bg-slate-700 text-[10px] font-extrabold uppercase text-slate-300 border border-slate-600 shrink-0">
                Always Active
              </span>
            </div>

            {/* 2. Analytics */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="font-extrabold text-white">Analytics & Performance Cookies</div>
                <p className="text-[11px] text-slate-400">Google Analytics 4 & GTM traffic measurement.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
              />
            </div>

            {/* 3. Marketing */}
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="font-extrabold text-white">Marketing & Conversion Cookies</div>
                <p className="text-[11px] text-slate-400">Ad conversion tags & GTM marketing events.</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
              />
            </div>

          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {showPreferences ? (
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Save Preferences
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Reject Non-Essential
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="w-full sm:w-auto p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Customize Cookie Settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="sm:hidden">Customize</span>
              </button>
            </>
          )}
        </div>

        {/* Reset Choice Section */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Testing or changing consent?</span>
          <button
            type="button"
            onClick={handleResetConsent}
            className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Clear Saved Consent
          </button>
        </div>

      </div>
    </div>
  );
}
