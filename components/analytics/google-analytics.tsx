/* eslint-disable @next/next/next-script-for-ga */
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
  const defaultGaId = initialGaId || process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DGBTMRS9FN';
  const defaultGtmId = initialGtmId || process.env.NEXT_PUBLIC_GTM_ID || '';
  const defaultVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

  const [activeGaId, setActiveGaId] = useState<string>(defaultGaId);
  const [activeGtmId, setActiveGtmId] = useState<string>(defaultGtmId);
  const [googleVerification, setGoogleVerification] = useState<string>(defaultVerification);

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

  const currentGaId = activeGaId || defaultGaId;
  const currentGtmId = activeGtmId || defaultGtmId;

  return (
    <>
      {/* Search Console Meta Verification */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}

      {/* Google Analytics GA4 (gtag.js) - Standard Head Script */}
      {currentGaId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${currentGaId}`}></script>
          {/* eslint-disable-next-line @next/next/next-script-for-ga */}
          <script
            id="google-analytics-init"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'wait_for_update': 500
                });
                gtag('js', new Date());
                gtag('config', '${currentGaId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* Google Tag Manager (GTM) - Standard Head Script */}
      {currentGtmId && (
        <script
          id="google-gtm-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${currentGtmId}');
            `,
          }}
        />
      )}
    </>
  );
}
