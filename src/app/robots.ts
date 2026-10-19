import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/site';

// /book/* is crawlable on purpose: every URL there now 308s to its listing, and
// Google can only follow (and drop) old booking URLs it is allowed to fetch.
const PRIVATE = ['dashboard', 'auth', 'admin', 'requests', 'r', 'guest'];
const PREFIXES = ['', '/en', '/de', '/ro', '/bg', '/sr', '/ru'];

export default function robots(): MetadataRoute.Robots {
  // Exact path ("$") plus subtree ("/") — a bare "/auth" prefix also blocked
  // /authors in v3, and "/r" would block /restaurants.
  const disallow = [
    '/api/',
    ...PREFIXES.flatMap((p) => PRIVATE.flatMap((b) => [`${p}/${b}$`, `${p}/${b}/`])),
    '/*?*sort=',
    '/*?*q=',
  ];
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/api/og'], disallow },
      // Bandwidth-heavy crawlers with no referral value for a travel site.
      { userAgent: ['Bytespider', 'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot', 'DataForSeoBot', 'PetalBot'], disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
