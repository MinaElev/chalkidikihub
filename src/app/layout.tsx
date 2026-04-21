import './globals.css';
import { PWARegister } from '@/components/PWARegister';
import { DeferredScripts } from '@/components/DeferredScripts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default lang to Greek (primary market). The [locale] layout syncs it
  // with the URL's locale segment client-side via LangSync — the root
  // layout sits above [locale] and has no access to segment params during
  // static prerender.
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0891B2" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="google-site-verification" content="23O0hBvOmQHGLCg-_KCo_7HDlwNRkM-OMM7KYlFS8hY" />
        <meta name="format-detection" content="telephone=no, email=no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192.svg" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChalkidikiHub" />
        {/* Preconnect to Supabase (critical data source) + prefetch others */}
        <link rel="preconnect" href="https://bvwiwxmgbtklztgapxyp.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://bvwiwxmgbtklztgapxyp.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        {/* Hero image preload is emitted automatically by next/image with priority={true} + fetchPriority="high" (see HeroBackground.tsx) */}
        {/* RSS feed for blog content distribution */}
        <link rel="alternate" type="application/rss+xml" title="Chalkidiki Hub Blog" href="/feed.xml" />
      </head>
      <body>
        <PWARegister />
        {children}
        {/* AdSense + GTM/GA deferred to first user interaction or browser-idle
            (whichever comes first) — keeps main thread free for LCP/TBT. */}
        <DeferredScripts />
      </body>
    </html>
  );
}
