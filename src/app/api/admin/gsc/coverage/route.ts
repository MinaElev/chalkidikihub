import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { classifyState, type CoverageCategory } from '@/lib/gsc-coverage';
import { requireSuperAdmin } from '@/lib/admin-auth';

// GET /api/admin/gsc/coverage
//
// Reconstructs the "Page indexing" picture from the per-URL verdicts stored in
// gsc_url_index (there is no API for the aggregate report). Returns the reason
// breakdown WITH sample URLs, an in-sitemap split (real problems vs orphans),
// progress of the inspection sweep, and heuristic red-flag counts.

export const dynamic = 'force-dynamic';

type Row = {
  url: string;
  coverage_state: string | null;
  verdict: string | null;
  robots_txt_state: string | null;
  page_fetch_state: string | null;
  google_canonical: string | null;
  user_canonical: string | null;
  in_sitemap: boolean;
  is_indexed: boolean;
  last_inspected_at: string | null;
  referring_urls: number | null;
};

const SAMPLES_PER_STATE = 40;

export async function GET() {
  const __auth = await requireSuperAdmin(); if (__auth instanceof NextResponse) return __auth;
  const supabase = createAdminClient();

  const [credRes, lastRunRes] = await Promise.all([
    supabase.from('gsc_credentials').select('email').eq('id', 1).maybeSingle(),
    supabase.from('gsc_inspect_runs').select('*').order('started_at', { ascending: false }).limit(1).maybeSingle(),
  ]);

  // Fetch the whole index in pages (PostgREST caps at 1000/req).
  const rows: Row[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('gsc_url_index')
      .select('url, coverage_state, verdict, robots_txt_state, page_fetch_state, google_canonical, user_canonical, in_sitemap, is_indexed, last_inspected_at, referring_urls')
      .order('url', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) break;
    rows.push(...(data as Row[]));
    if (data.length < PAGE) break;
  }

  const total = rows.length;
  const inspected = rows.filter((r) => r.last_inspected_at).length;
  const uninspected = total - inspected;
  const indexed = rows.filter((r) => r.is_indexed).length;
  const nonIndexed = rows.filter((r) => r.last_inspected_at && !r.is_indexed).length;
  const inSitemap = rows.filter((r) => r.in_sitemap).length;
  const inSitemapNonIndexed = rows.filter((r) => r.in_sitemap && r.last_inspected_at && !r.is_indexed).length;

  // Group by coverageState.
  type Group = {
    state: string;
    count: number;
    in_sitemap_count: number;
    samples: Array<Pick<Row, 'url' | 'in_sitemap' | 'page_fetch_state' | 'google_canonical' | 'user_canonical'>>;
  };
  const groups = new Map<string, Group>();
  const catCount = new Map<CoverageCategory, number>();

  for (const r of rows) {
    if (!r.last_inspected_at) continue; // uninspected handled via progress
    const key = r.coverage_state || '(unknown)';
    let g = groups.get(key);
    if (!g) { g = { state: key, count: 0, in_sitemap_count: 0, samples: [] }; groups.set(key, g); }
    g.count++;
    if (r.in_sitemap) g.in_sitemap_count++;
    // Prefer in-sitemap URLs as samples (the actionable ones).
    if (g.samples.length < SAMPLES_PER_STATE && (r.in_sitemap || g.samples.length < SAMPLES_PER_STATE / 2)) {
      g.samples.push({ url: r.url, in_sitemap: r.in_sitemap, page_fetch_state: r.page_fetch_state, google_canonical: r.google_canonical, user_canonical: r.user_canonical });
    }
    const cat = classifyState(r.coverage_state).category;
    catCount.set(cat, (catCount.get(cat) || 0) + 1);
  }

  const states = Array.from(groups.values())
    .map((g) => {
      const info = classifyState(g.state);
      return { ...g, ...info };
    })
    .sort((a, b) => b.count - a.count);

  const categories = Array.from(catCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // ── Heuristic red flags (straight from the data) ──
  const flags: Array<{ code: string; severity: string; count: number; messageEl: string }> = [];
  const sitemapDisallowed = rows.filter((r) => r.in_sitemap && r.robots_txt_state === 'DISALLOWED').length;
  if (sitemapDisallowed > 0) {
    flags.push({ code: 'sitemap_robots_conflict', severity: 'critical', count: sitemapDisallowed, messageEl: 'URLs που είναι στο sitemap αλλά μπλοκάρονται από robots.txt — σύγκρουση. Ξεμπλόκαρέ τα ή βγάλ’ τα από το sitemap.' });
  }
  if (inSitemapNonIndexed > 0) {
    flags.push({ code: 'sitemap_non_indexed', severity: 'warn', count: inSitemapNonIndexed, messageEl: 'URLs στο sitemap που ΔΕΝ είναι ευρετηριασμένα — τα πραγματικά προβλήματα προτεραιότητας.' });
  }
  const canonicalMismatch = rows.filter((r) => r.google_canonical && r.user_canonical && r.google_canonical !== r.user_canonical).length;
  if (canonicalMismatch > 0) {
    flags.push({ code: 'canonical_mismatch', severity: 'info', count: canonicalMismatch, messageEl: 'URLs όπου το Google επέλεξε διαφορετικό canonical από αυτό που δηλώνεις.' });
  }

  return NextResponse.json({
    connected: !!credRes.data,
    last_run: lastRunRes.data || null,
    progress: { total, inspected, uninspected, pct: total > 0 ? Math.round((inspected / total) * 100) : 0 },
    totals: { indexed, non_indexed: nonIndexed, in_sitemap: inSitemap, in_sitemap_non_indexed: inSitemapNonIndexed },
    states,
    categories,
    flags,
  });
}
