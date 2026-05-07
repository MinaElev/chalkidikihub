import { NextRequest, NextResponse } from 'next/server';
import { createApiClient } from '@/lib/api-helpers';
import { crawlBatch, type PageCheck } from '@/lib/seo-health';

// Trigger:
//   POST /api/admin/seo-health
// Optional query params:
//   ?sample=20    sample size per dynamic bucket (listings, beaches, etc.)
//   ?locales=el,en,de   restrict to a subset of locales
//
// Same auth model as the rest of /api/admin/* (no token check —
// security flagged for separate review).

export const maxDuration = 300;

const ALL_LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

const STATIC_PATHS = [
  '',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/listings',
  '/beaches',
  '/restaurants',
  '/activities',
  '/areas',
  '/blog',
  '/faq',
  '/sales',
  '/places',
  '/best',
  '/from/sofia',
  '/from/thessaloniki',
];

const RAW_FILES = ['/sitemap.xml', '/robots.txt', '/feed.xml', '/llms.txt'];

function localePath(locale: string, path: string): string {
  if (locale === 'el') return path || '/';
  return `/${locale}${path}`;
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const sample = Math.max(2, Math.min(20, Number(url.searchParams.get('sample')) || 5));
  const localesParam = url.searchParams.get('locales');
  const locales = localesParam
    ? localesParam.split(',').filter((l) => ALL_LOCALES.includes(l))
    : ALL_LOCALES;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;

  const supabase = createApiClient();

  // Pull random sample slugs from each dynamic content table.
  const [listings, beaches, restaurants, activities, villages] = await Promise.all([
    supabase.from('listings').select('slug').eq('status', 'published').limit(sample),
    supabase.from('beaches').select('slug').limit(sample),
    supabase.from('restaurants').select('slug').limit(sample),
    supabase.from('activities').select('slug').limit(sample),
    supabase.from('villages').select('slug').limit(sample),
  ]);

  const targets: Array<{ url: string; bucket: string }> = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      targets.push({ url: `${baseUrl}${localePath(locale, path)}`, bucket: 'static' });
    }
  }

  for (const row of listings.data || []) {
    targets.push({ url: `${baseUrl}/listings/${row.slug}`, bucket: 'listing' });
    targets.push({ url: `${baseUrl}/stay/${row.slug}`, bucket: 'stay' });
  }
  for (const row of beaches.data || []) {
    targets.push({ url: `${baseUrl}/beaches/${row.slug}`, bucket: 'beach' });
  }
  for (const row of restaurants.data || []) {
    targets.push({ url: `${baseUrl}/restaurants/${row.slug}`, bucket: 'restaurant' });
  }
  for (const row of activities.data || []) {
    targets.push({ url: `${baseUrl}/activities/${row.slug}`, bucket: 'activity' });
  }
  for (const row of villages.data || []) {
    targets.push({ url: `${baseUrl}/places/${row.slug}`, bucket: 'place' });
  }

  for (const f of RAW_FILES) {
    targets.push({ url: `${baseUrl}${f}`, bucket: 'raw' });
  }

  const t0 = Date.now();
  const results: PageCheck[] = await crawlBatch(targets, 10);
  const ms = Date.now() - t0;

  // Aggregate stats
  const total = results.length;
  const withCriticals = results.filter((r) =>
    r.issues.some((i) => i.startsWith('critical:')),
  ).length;
  const withWarnings = results.filter((r) =>
    r.issues.some((i) => i.startsWith('warning:')),
  ).length;
  const clean = results.filter((r) => r.issues.length === 0).length;

  // Issue frequency
  const codeFreq = new Map<string, number>();
  for (const r of results) {
    for (const issue of r.issues) {
      const code = issue.split(':')[1] || 'unknown';
      codeFreq.set(code, (codeFreq.get(code) || 0) + 1);
    }
  }

  return NextResponse.json({
    duration_ms: ms,
    summary: {
      total,
      clean,
      with_warnings: withWarnings,
      with_criticals: withCriticals,
    },
    top_issues: Array.from(codeFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => ({ code, count })),
    results,
  });
}
