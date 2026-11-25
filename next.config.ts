import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { buildRedirects } from './src/lib/seo/redirects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const csp = [
  "default-src 'self'",
  // Next hydration needs inline scripts until nonces are wired; no third-party ads.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  // openweathermap.org: weather icons; Google: GA4 collection pixels (v3's analytics, restored).
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://openweathermap.org https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://nominatim.openstreetmap.org https://api.open-meteo.com https://marine-api.open-meteo.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-src 'self' https://www.openstreetmap.org https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://www.vivapayments.com https://demo.vivapayments.com",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  // Self-contained server bundle (.next/standalone) for Node hosts such as Plesk/Passenger; Vercel ignores it.
  output: 'standalone',
  poweredByHeader: false,
  compiler: { removeConsole: { exclude: ['error', 'warn'] } },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // inlineCss is deliberately OFF: it embeds the stylesheet three times per
    // page (once in <style>, twice in the RSC payload) — 235 KB of a 425 KB
    // beach page. A linked, immutable CSS file is fetched once per visit.
  },
  images: {
    // Next's own optimizer, on our server. Self-hosted it has no quota; Supabase's
    // render endpoint (used while on Vercel) bills every distinct photo it resizes
    // per month, and 1,800 photos ran far past the Pro plan's 100. Each size is
    // made once and kept in .next/cache/images; Supabase only serves originals.
    // WebP only: AVIF encoding costs several times the CPU on a shared host.
    formats: ['image/webp'],
    // One working quality: next/image asks for 75 by default and snaps to the nearest
    // allowed value, so every photo is made at 65 (as before) and cached once.
    qualities: [50, 60, 65],
    // Uploads get timestamped names, so a cached size never goes stale.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      // Only public Storage objects, so the optimizer can't be used as an open proxy.
      { protocol: 'https', hostname: 'bvwiwxmgbtklztgapxyp.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return buildRedirects();
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // The service worker must never be cached, or a fix to it would take days to reach visitors.
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache, max-age=0' }] },
      {
        // Owner-facing promo material linked from emails — reachable, never indexed.
        source: '/(marketing/.*|email-template-owners.html)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(sitemap.xml|sitemaps/:path*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
