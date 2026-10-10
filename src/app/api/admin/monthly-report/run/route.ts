import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import { resolveMonthWindow, runSnapshot } from '@/lib/monthly-report';

export const maxDuration = 120;

// POST /api/admin/monthly-report/run   body: { month?: 'YYYY-MM' }
// Admin-triggered snapshot: pulls GSC + inquiries for the month and (re)freezes
// listing_monthly_stats. Same engine as the cron. Safe to re-run (idempotent).
export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({}));
    const win = resolveMonthWindow(body?.month);
    const supabase = createAdminClient();
    const { upserted, gscError } = await runSnapshot(supabase, win);

    await supabase.from('activity_logs').insert({
      type: 'admin_action',
      severity: gscError ? 'warning' : 'info',
      message: `Monthly report snapshot (manual) ${win.monthKey}: ${upserted} listing(s)${gscError ? ' — GSC skipped' : ''}`,
      details: { month: win.monthKey, upserted, gscError, by: auth.userId },
    });

    return NextResponse.json({ success: true, month: win.monthKey, upserted, gscError });
  } catch (err) {
    const msg = (err as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'month must be YYYY-MM' ? 400 : 500 });
  }
}
