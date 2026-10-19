'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** The live site's GA4 property, so reports continue without a break. */
const GA_ID = 'G-YKD6X4B919';

type DataLayerWindow = Window & { dataLayer?: unknown[] };

function gtagPush(...args: unknown[]) {
  const w = window as DataLayerWindow;
  (w.dataLayer = w.dataLayer || []).push(args);
}

// Survives re-mounts: the first path of a page load is counted by gtag('config').
let lastTrackedPath: string | null = null;

/**
 * Google Analytics 4 with Consent Mode v2. v3 granted analytics storage to
 * everyone before any choice, while its cookie bar promised "Essential only"
 * collects nothing; here storage is denied until the visitor accepts.
 * Without consent GA still receives cookieless pings it uses to model
 * traffic, so totals stay comparable with v3's reports.
 */
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const apply = () => {
      if (localStorage.getItem('cookie-consent') === 'accepted') gtagPush('consent', 'update', { analytics_storage: 'granted' });
    };
    window.addEventListener('cookie-consent-change', apply);
    return () => window.removeEventListener('cookie-consent-change', apply);
  }, []);

  // Client-side navigations are page views too; gtag only counts the landing page itself.
  useEffect(() => {
    if (lastTrackedPath === null) {
      lastTrackedPath = pathname;
      return;
    }
    if (pathname === lastTrackedPath) return;
    lastTrackedPath = pathname;
    setTimeout(() => gtagPush('event', 'page_view', { page_path: pathname, page_location: window.location.href, page_title: document.title }), 0);
  }, [pathname]);

  return (
    <>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}' +
            "var c=null;try{c=localStorage.getItem('cookie-consent')}catch(e){}" +
            "gtag('consent','default',{analytics_storage:c==='accepted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});" +
            "gtag('js',new Date());" +
            `gtag('config','${GA_ID}');`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
