import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

// GET /api/admin/gsc/status
//
// Returns connection state + last sync info + dashboard data, in one payload.
// The /admin/seo-gsc page reads this to render everything.

export async function GET() {
  const supabase = createAdminClient();

  const [credRes, lastRunRes, pagesRes, queriesRes] = await Promise.all([
    supabase.from('gsc_credentials').select('email, scope, updated_at').eq('id', 1).maybeSingle(),
    supabase.from('gsc_sync_runs').select('*').order('started_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('gsc_pages_28d').select('*').order('clicks', { ascending: false }).limit(1000),
    supabase.from('gsc_queries_28d').select('*').order('impressions', { ascending: false }).limit(2000),
  ]);

  const connected = !!credRes.data;
  const lastRun = lastRunRes.data;
  const pages = pagesRes.data || [];
  const queries = queriesRes.data || [];

  // Aggregate 28d totals
  const totalClicks = pages.reduce((s, p) => s + (p.clicks || 0), 0);
  const totalImpressions = pages.reduce((s, p) => s + (p.impressions || 0), 0);
  const overallCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const overallPosition = pages.length > 0
    ? pages.reduce((s, p) => s + (Number(p.position) || 0) * (p.impressions || 0), 0) / Math.max(totalImpressions, 1)
    : 0;

  // Top queries (by impressions)
  const topQueries = queries.slice(0, 50);

  // Top pages (by clicks)
  const topPages = pages.slice(0, 50);

  // Opportunities: queries at rank 11-20 with high impressions = quick wins
  // if you bump them into the top 10.
  const opportunities = queries
    .filter((q) => Number(q.position) >= 11 && Number(q.position) <= 20 && (q.impressions || 0) >= 50)
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 30);

  // CTR dive: queries at rank 1-10 with poor CTR (below ~3%) = title/meta fix wins.
  const ctrDive = queries
    .filter((q) => Number(q.position) <= 10 && (q.impressions || 0) >= 50 && (q.ctr || 0) < 0.03)
    .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
    .slice(0, 30);

  return NextResponse.json({
    connected,
    email: credRes.data?.email || null,
    last_run: lastRun || null,
    summary: {
      total_clicks: totalClicks,
      total_impressions: totalImpressions,
      overall_ctr: overallCtr,
      overall_position: overallPosition,
      page_count: pages.length,
      query_count: queries.length,
    },
    top_pages: topPages,
    top_queries: topQueries,
    opportunities,
    ctr_dive: ctrDive,
  });
}
