import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { buildRedirects } from './src/lib/seo/redirects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const csp = [
  "default-src 'self'",
  // Next hydration needs inline scripts until nonces are wired; no third-party ads.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://nominatim.openstreetmap.org https://api.open-meteo.com https://marine-api.open-meteo.com",
  "frame-src 'self' https://www.openstreetmap.org https://www.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
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
  poweredByHeader: false,
  compiler: { removeConsole: { exclude: ['error', 'warn'] } },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // inlineCss is deliberately OFF: it embeds the stylesheet three times per
    // page (once in <style>, twice in the RSC payload) — 235 KB of a 425 KB
    // beach page. A linked, immutable CSS file is fetched once per visit.
  },
  images: {
    // Vercel's optimizer is capped on the Hobby plan (402 once exceeded);
    // Supabase Storage resizes on delivery instead. See src/lib/image-loader.ts.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    qualities: [50, 65, 75],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return buildRedirects();
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
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
