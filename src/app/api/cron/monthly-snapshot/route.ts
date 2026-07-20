import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { resolveMonthWindow, runSnapshot } from '@/lib/monthly-report';

export const maxDuration = 120;

// ────────────────────────────────────────────────────────────────────────
// Monthly cron — freezes the previous calendar month's per-listing stats into
// listing_monthly_stats so the owner report can say "πόσοι σε είδαν / πόσα
// αιτήματα" and compare month-over-month. Pass ?month=YYYY-MM to backfill a
// past month (GSC keeps ~16 months via the API). All logic lives in
// src/lib/monthly-report.ts so the admin UI shares it. Idempotent.
//
// Scheduled for the 3rd of each month so GSC's 2-3 day reporting delay has
// settled for the whole previous month.
// ────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const monthParam = new URL(request.url).searchParams.get('month');
    const win = resolveMonthWindow(monthParam);
    const { upserted, gscError } = await runSnapshot(supabase, win);

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: gscError ? 'warning' : 'info',
      message: `Monthly stats snapshot ${win.monthKey}: ${upserted} listing(s) recorded${gscError ? ' (GSC skipped)' : ''}`,
      details: { month: win.monthKey, startDate: win.startDate, endDate: win.endDate, upserted, gscError },
    });

    return NextResponse.json({ success: true, month: win.monthKey, upserted, gscError });
  } catch (err) {
    const msg = (err as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'month must be YYYY-MM' ? 400 : 500 });
  }
}
