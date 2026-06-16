'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { ADSENSE_ENABLED } from '@/lib/feature-flags';

const ADS_PUB = 'ca-pub-9694572418424066';

// AdSense + Analytics both deferred to first user interaction or browser-idle
// fallback — keeps main thread free for LCP/TBT.
//
// AdSense is additionally gated by NEXT_PUBLIC_ADSENSE_ENABLED. While the
// site is under review (or rejected for low-value content), keep the flag
// off so the script doesn't ship to every visitor. Flip it on once the
// account is approved, or briefly when re-submitting for review so the
// AdSense crawler finds the script.
//
// Personalized vs non-personalized is gated by user consent via the NPA flag.
export function DeferredScripts() {
  const [deferred, setDeferred] = useState(false);
  const [consent, setConsent] = useState<'accepted' | 'rejected' | 'unknown'>('unknown');

  useEffect(() => {
    const read = () => {
      const c = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null;
      setConsent(c === 'accepted' ? 'accepted' : c === 'rejected' ? 'rejected' : 'unknown');
    };
    read();

    const onChange = () => read();
    const onStorage = (e: StorageEvent) => { if (e.key === 'cookie-consent') read(); };
    window.addEventListener('cookie-consent-change', onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cookie-consent-change', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (deferred) return;
    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      setDeferred(true);
    };

    const events: Array<keyof WindowEventMap> = [
      'scroll',
      'keydown',
      'pointerdown',
      'touchstart',
      'mousemove',
    ];
    events.forEach((e) =>
      window.addEventListener(e, fire, { once: true, passive: true }),
    );

    const fallback = window.setTimeout(fire, 4500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, fire));
      clearTimeout(fallback);
    };
  }, [deferred]);

  // 'unknown' = visitor hasn't chosen yet → default to non-personalized,
  // GDPR-safe behaviour. Only explicit 'accepted' enables personalized ads
  // and analytics.
  const npa = consent !== 'accepted';
  const allowAnalytics = consent === 'accepted';

  return (
    <>
      {deferred && ADSENSE_ENABLED && (
        <>
          <Script id="adsbygoogle-init" strategy="afterInteractive">
            {`(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = ${npa ? 1 : 0};`}
          </Script>
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_PUB}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </>
      )}
      {deferred && allowAnalytics && (
        <>
          <Script
            id="gtag-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-YKD6X4B919');`,
            }}
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-YKD6X4B919"
            strategy="lazyOnload"
          />
        </>
      )}
    </>
  );
}
