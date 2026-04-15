import './globals.css';
import Script from 'next/script';
import { PWARegister } from '@/components/PWARegister';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0891B2" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="google-site-verification" content="23O0hBvOmQHGLCg-_KCo_7HDlwNRkM-OMM7KYlFS8hY" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192.svg" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChalkidikiHub" />
        {/* DNS prefetch for origins used after initial load (not preconnect — avoids unused-connection penalty) */}
        <link rel="dns-prefetch" href="https://bvwiwxmgbtklztgapxyp.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body>
        <PWARegister />
        {children}
        {/* Google AdSense - lazy loaded, non-critical */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9694572418424066"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        {/* Google Analytics - after interactive for tracking accuracy */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
            gtag('js',new Date());gtag('config','G-YKD6X4B919');
          ` }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YKD6X4B919"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
