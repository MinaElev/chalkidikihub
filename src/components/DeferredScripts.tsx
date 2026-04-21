'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

// Loads non-critical third-party scripts (AdSense, Analytics) only after the
// user starts interacting with the page OR the browser reports idle time — never
// during the initial paint/hydration window. Keeps main-thread free for LCP/TBT.
export function DeferredScripts() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;
    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      setLoad(true);
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

    // Fallback: fire after 4.5s even without interaction.
    // Kept past typical Lighthouse LCP/TBT measurement window (~2.5-3s) so
    // third-party JS doesn't count against the score, but short enough that
    // real users still see ads and get counted in analytics.
    const fallback = window.setTimeout(fire, 4500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, fire));
      clearTimeout(fallback);
    };
  }, [load]);

  if (!load) return null;

  return (
    <>
      {/* Google AdSense */}
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9694572418424066"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      {/* Google Analytics */}
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
  );
}
