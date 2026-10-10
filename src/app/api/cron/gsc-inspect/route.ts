// Guard: Vercel cron bearer secret.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { runInspectBatch } from '@/lib/gsc-inspect';

export const maxDuration = 300;

// ────────────────────────────────────────────────────────────────────────
// Daily cron — inspects the next batch of URLs against Google Search Console
// (URL Inspection API) and refreshes the indexing-coverage picture shown at
// /admin/seo-coverage. Seeds the URL universe from the current sitemap each
// run, then inspects up to ~1500 URLs (under the 2000/day quota). The first
// full sweep of the ~12k-URL universe takes several days; after that it just
// re-checks the oldest ones. Idempotent.
// ────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    // 250/run: measured Google URL-Inspection throughput is only ~1/s (Google
    // throttles per-site; higher concurrency just 429s), so a 300s function
    // does ~300 URLs max. 250 finishes with margin and never leaves a dangling
    // 'running' row. Full ~8.2k sweep takes ~33 daily runs, then it re-checks
    // the oldest — a rolling monitor, well under the 2000/day quota. Users can
    // click "Inspect next batch" in /admin/seo-coverage to advance faster.
    const result = await runInspectBatch(supabase, { trigger: 'cron', limit: 250, seed: true });

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: result.quota_hit ? 'warning' : 'info',
      message: `GSC URL inspection: ${result.inspected} inspected, ${result.seeded} seeded${result.quota_hit ? ' (daily quota reached)' : ''}`,
      details: result,
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
