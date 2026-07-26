'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface GoogleAnalyticsProps {
  gaId?: string;
  gtmId?: string;
}

export function GoogleAnalytics({
  gaId: initialGaId,
  gtmId: initialGtmId,
}: GoogleAnalyticsProps) {
  const [activeGaId, setActiveGaId] = useState<string>(
    initialGaId || process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-XWQVTC4XWZ'
  );
  const [activeGtmId, setActiveGtmId] = useState<string>(
    initialGtmId || process.env.NEXT_PUBLIC_GTM_ID || ''
  );
  const [googleVerification, setGoogleVerification] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ''
  );

  useEffect(() => {
    // 1. Fetch live DB settings from Admin CRM API
    const fetchLiveSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.gaId) setActiveGaId(data.settings.gaId);
          if (data.settings.gtmId) setActiveGtmId(data.settings.gtmId);
          if (data.settings.googleVerification) setGoogleVerification(data.settings.googleVerification);
        }
      } catch (err) {
        console.warn('Analytics live settings fetch fallback:', err);
      }
    };

    fetchLiveSettings();

    // 2. Sync cookie consent state
    const syncConsent = () => {
      if (typeof window !== 'undefined') {
        const consent = localStorage.getItem('cookie_consent');
        if (consent) {
          try {
            const parsed = JSON.parse(consent);
            const analyticsGranted = parsed.analytics === true;
            const marketingGranted = parsed.marketing === true;
            if ((window as any).gtag) {
              (window as any).gtag('consent', 'update', {
                analytics_storage: analyticsGranted ? 'granted' : 'denied',
                ad_storage: marketingGranted ? 'granted' : 'denied',
              });
            }
          } catch {
            if (consent === 'all' && (window as any).gtag) {
              (window as any).gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
              });
            }
          }
        }
      }
    };

    syncConsent();
    window.addEventListener('cookie_consent_updated', syncConsent);
    return () => window.removeEventListener('cookie_consent_updated', syncConsent);
  }, []);

  return (
    <>
      {/* Search Console Meta Verification */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}

      {/* 1. Google Consent Mode v2 Default Settings (DENIED until user explicitly accepts) */}
      <Script id="google-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>

      {/* 2. Google Analytics GA4 (gtag.js) */}
      {activeGaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${activeGaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${activeGaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 3. Google Tag Manager (GTM) */}
      {activeGtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${activeGtmId}');
          `}
        </Script>
      )}
    </>
  );
}
