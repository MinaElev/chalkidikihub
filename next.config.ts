import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Content-Security-Policy — allowlists every external origin the app actually uses.
// Kept as a single joined string to avoid string-concat errors in headers().
const csp = [
  "default-src 'self'",
  // Next.js hydration + GA require inline/eval. Without SSR nonces we keep unsafe-inline.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  // Tailwind/Next.js inject styles at runtime; unsafe-inline is required.
  "style-src 'self' 'unsafe-inline'",
  // Images: own domain, data/blob (previews + og), Supabase CDN, DALL-E blob, Unsplash, partner, OSM tiles, GA pixel.
  "img-src 'self' data: blob: https://*.supabase.co https://oaidalleapiprodscus.blob.core.windows.net https://greece-moments.com https://images.unsplash.com https://*.tile.openstreetmap.org https://www.openstreetmap.org https://*.google-analytics.com",
  // Fonts: self + data (inlined woff2 in OG routes via fontsource).
  "font-src 'self' data: https://cdn.jsdelivr.net",
  // API + analytics + OSM geocoding.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://nominatim.openstreetmap.org https://*.google-analytics.com https://analytics.google.com https://cdn.jsdelivr.net",
  // OSM iframe embeds on village + monastery pages.
  "frame-src 'self' https://www.openstreetmap.org",
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
  experimental: {
    optimizePackageImports: ['lucide-react', 'leaflet', 'react-leaflet'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: 'greece-moments.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year — images rarely change
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [45, 50, 60, 75], // Next 16 requires explicit qualities allowlist
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
    ];
  },
};

export default withNextIntl(nextConfig);
