import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Content-Security-Policy — allowlists every external origin the app actually uses.
// Kept as a single joined string to avoid string-concat errors in headers().
const csp = [
  "default-src 'self'",
  // Next.js hydration + GA require inline/eval. Without SSR nonces we keep unsafe-inline.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://fundingchoicesmessages.google.com https://www.google.com",
  // Tailwind/Next.js inject styles at runtime; unsafe-inline is required.
  "style-src 'self' 'unsafe-inline'",
  // Images: own domain, data/blob (previews + og), Supabase CDN, DALL-E blob, Unsplash, partner, OSM tiles, GA pixel, AdSense creatives.
  "img-src 'self' data: blob: https://*.supabase.co https://oaidalleapiprodscus.blob.core.windows.net https://greece-moments.com https://images.unsplash.com https://*.tile.openstreetmap.org https://www.openstreetmap.org https://*.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
  // Fonts: self + data (inlined woff2 in OG routes via fontsource).
  "font-src 'self' data: https://cdn.jsdelivr.net",
  // API + analytics + OSM geocoding.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://nominatim.openstreetmap.org https://*.google-analytics.com https://analytics.google.com https://cdn.jsdelivr.net",
  // OSM iframe embeds + AdSense/Funding Choices (GDPR consent) + DoubleClick ad iframes.
  "frame-src 'self' https://www.openstreetmap.org https://fundingchoicesmessages.google.com https://*.googlesyndication.com https://*.doubleclick.net https://www.google.com",
  // Harden against clickjacking (complements X-Frame-Options).
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  // Prevent MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Block XSS in older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // HTTPS only (1 year, include subdomains, preload-ready)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Control browser features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()' },
  // Prevent embedding except same-origin
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Content-Security-Policy — defense in depth against XSS / data injection
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  compiler: {
    // Strip console.log/debug/info/warn from production builds; keep console.error so
    // real crashes still surface in Sentry/server logs.
    removeConsole: { exclude: ['error'] },
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'leaflet', 'react-leaflet'],
    // Inline CSS <style> tag in HTML instead of <link>. Eliminates the
    // render-blocking stylesheet request — ~22KB Tailwind bundle arrives with
    // the HTML, so first paint happens without a round-trip. Biggest win for
    // first-time visitors (which is what PSI measures).
    inlineCss: true,
  },
  images: {
    // Hobby plan caps image optimizations per month; once exceeded /_next/image
    // returns HTTP 402 and every <Image> on the site breaks. Originals in
    // Supabase Storage are already compressed (WebP, ~200KB after the
    // re-encode pass), so the optimizer's marginal benefit doesn't justify
    // burning the quota. Serve source URLs directly instead.
    unoptimized: true,
    // Allowed quality values for <Image quality={...}>. Next 16 ships with a
    // default of [75] only and emits a warning for anything else — the codebase
    // uses 45, 50, 60 in various places (hero, areas, beaches, listings) so we
    // list them here. With unoptimized:true the values are effectively no-ops
    // at runtime, but declaring them silences the dev/prod warnings and keeps
    // the door open for enabling the optimizer later without code changes.
    qualities: [45, 50, 60, 75],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: 'greece-moments.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    // Duplicate-article consolidation (2026-07-10): each pair competed for the
    // same query (keyword cannibalization). Content merged into the surviving
    // slug; the DB rows of the sources are deleted, so these 301s are the only
    // thing keeping old URLs/backlinks alive. Default locale (el) is unprefixed.
    const mergedArticles: Array<[string, string]> = [
      ['odigos-gia-afytos', 'afytos-village-guide'],
      ['odigos-gia-sikia', 'sykia-chalkidiki'],
      ['odigos-gia-pyrgadikia-mainland', 'odigos-gia-pyrgadikia'],
      ['when-to-visit-halkidiki', 'best-time-to-visit-halkidiki'],
      ['family-vacation-halkidiki', 'halkidiki-with-kids-complete-guide'],
      // Admin-authored 2026-07-10, competed with the strengthened keyword guide
      // for the exact same query. Unique image kept; text offered nothing new.
      ['oi-kalyteres-paralies-kassandras', 'keyword-oi-kalyteres-paralies-kassandras'],
      // Ghost URL found via Bing WMT 2026-07-16: row long gone but Bing (and
      // stale ISR cache) still served a zombie 200 shell for the old slug.
      ['odigos-gia-ammouliani', 'ammouliani-island-complete-guide'],
    ];
    // Single-beach blog posts that competed with the (richer) beach detail
    // pages for the same queries — folded into /beaches/[slug].
    const articlesToBeaches: Array<[string, string]> = [
      ['paralia-sani-kassandra', 'sani-kassandra'],
      ['paralia-sithonia-klimataria-beach', 'sithonia-klimataria-beach'],
      ['paralia-sarti-athos', 'sarti-sithonia'],
    ];
    // Renamed beach slugs — old URLs still crawled by Bing (ghost 200s).
    const renamedBeaches: Array<[string, string]> = [
      ['vourvourou-beach-sithonia', 'vourvourou-sithonia'],
    ];
    return [
      ...mergedArticles.flatMap(([from, to]) => [
        { source: `/blog/${from}`, destination: `/blog/${to}`, permanent: true },
        {
          source: `/:locale(en|de|bg|ru|ro|sr)/blog/${from}`,
          destination: `/:locale/blog/${to}`,
          permanent: true,
        },
      ]),
      ...articlesToBeaches.flatMap(([from, to]) => [
        { source: `/blog/${from}`, destination: `/beaches/${to}`, permanent: true },
        {
          source: `/:locale(en|de|bg|ru|ro|sr)/blog/${from}`,
          destination: `/:locale/beaches/${to}`,
          permanent: true,
        },
      ]),
      ...renamedBeaches.flatMap(([from, to]) => [
        { source: `/beaches/${from}`, destination: `/beaches/${to}`, permanent: true },
        {
          source: `/:locale(en|de|bg|ru|ro|sr)/beaches/${from}`,
          destination: `/:locale/beaches/${to}`,
          permanent: true,
        },
      ]),
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache icons/manifest
        source: '/icons/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Sitemap responses — explicit Cache-Control so polite bots
        // (Googlebot, Bingbot) and the Vercel edge respect a long TTL
        // matching the ISR revalidate in src/app/sitemap.ts (48h).
        //   max-age=86400        → bots cache locally for 24h
        //   s-maxage=172800      → CDN holds the response for 48h
        //   stale-while-revalidate=604800 → on cache miss serve the stale
        //                                   copy instantly while regen runs,
        //                                   smoothing the spike when TTL flips
        source: '/(sitemap.xml|image-sitemap.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=172800, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
