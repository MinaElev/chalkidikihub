import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { fetchTopPages, fetchTopQueries } from '@/lib/gsc';

// POST /api/admin/gsc/sync
//
// Pulls last-28-day Search Analytics data from Google Search Console
// and replaces the local cache. Idempotent — safe to call repeatedly.
//
// Trigger:
//   - Manual: from /admin/seo-gsc "Sync now" button
//   - Cron: schedule daily via vercel.json or an external scheduler

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const trigger = new URL(req.url).searchParams.get('trigger') === 'cron' ? 'cron' : 'manual';

  // Open run row
  const { data: run, error: runErr } = await supabase
    .from('gsc_sync_runs')
    .insert({ status: 'running', trigger })
    .select('id')
    .single();
  if (runErr || !run) {
    return NextResponse.json({ error: runErr?.message || 'cannot_open_run' }, { status: 500 });
  }
  const runId = run.id;

  const finishRun = async (status: 'success' | 'failed', extra: Record<string, unknown> = {}) => {
    await supabase
      .from('gsc_sync_runs')
      .update({ status, finished_at: new Date().toISOString(), ...extra })
      .eq('id', runId);
  };

  try {
    // Pull both in parallel
    const [pages, queries] = await Promise.all([
      fetchTopPages(supabase, 28, 1000),
      fetchTopQueries(supabase, 28, 1000),
    ]);

    // Replace pages_28d wholesale
    const pageRows = pages.map((row) => ({
      page: row.keys[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
      last_synced: new Date().toISOString(),
    })).filter((r) => r.page);

    // Replace queries_28d wholesale
    const queryRows = queries.map((row) => ({
      query: row.keys[0] || '',
      page: row.keys[1] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
      last_synced: new Date().toISOString(),
    })).filter((r) => r.query && r.page);

    // Wholesale replace: delete existing, insert fresh. Two short statements
    // are simpler than upsert + cleanup of stale rows.
    await supabase.from('gsc_pages_28d').delete().not('page', 'is', null);
    if (pageRows.length > 0) {
      // Chunk to stay under PostgREST size limits
      for (let i = 0; i < pageRows.length; i += 500) {
        const chunk = pageRows.slice(i, i + 500);
        const { error: insErr } = await supabase.from('gsc_pages_28d').insert(chunk);
        if (insErr) throw new Error(`pages insert: ${insErr.message}`);
      }
    }

    await supabase.from('gsc_queries_28d').delete().not('query', 'is', null);
    if (queryRows.length > 0) {
      for (let i = 0; i < queryRows.length; i += 500) {
        const chunk = queryRows.slice(i, i + 500);
        const { error: insErr } = await supabase.from('gsc_queries_28d').insert(chunk);
        if (insErr) throw new Error(`queries insert: ${insErr.message}`);
      }
    }

    await finishRun('success', {
      pages_synced: pageRows.length,
      queries_synced: queryRows.length,
    });

    return NextResponse.json({
      ok: true,
      pages_synced: pageRows.length,
      queries_synced: queryRows.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await finishRun('failed', { error: msg.slice(0, 500) });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
