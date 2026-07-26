'use client';

import Script from 'next/script';
import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  gaId?: string;
  gtmId?: string;
}

export function GoogleAnalytics({
  gaId = process.env.NEXT_PUBLIC_GA_ID,
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
}: GoogleAnalyticsProps) {

  useEffect(() => {
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
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 3. Google Tag Manager (GTM) */}
      {gtmId && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}
    </>
  );
}
