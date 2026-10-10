import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { requireSuperAdmin } from '@/lib/admin-auth';
import { resolveMonthWindow, buildOwnerReports, getSiteMonthlyStats, monthLabelGreek } from '@/lib/monthly-report';

// GET /api/admin/monthly-report/preview?month=YYYY-MM
// Returns the exact per-owner numbers the emails will contain (no sending).
export async function GET(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const sp = new URL(request.url).searchParams;
    const win = resolveMonthWindow(sp.get('month'));
    const boost = Math.max(0, Math.floor(Number(sp.get('boost')) || 0));
    const supabase = createAdminClient();
    const [owners, site] = await Promise.all([
      buildOwnerReports(supabase, win, boost),
      getSiteMonthlyStats(supabase, win),
    ]);

    const totals = owners.reduce(
      (acc, o) => {
        acc.impressions += o.totalImpressions;
        acc.clicks += o.totalClicks;
        acc.inquiries += o.totalInquiries;
        if (!o.alreadySentAt) acc.pendingOwners += 1;
        return acc;
      },
      { impressions: 0, clicks: 0, inquiries: 0, pendingOwners: 0 },
    );

    return NextResponse.json({
      month: win.monthKey,
      monthLabel: monthLabelGreek(win.monthKey),
      ownerCount: owners.length,
      boost,
      totals,
      site,
      owners,
    });
  } catch (err) {
    const msg = (err as Error).message;
    return NextResponse.json({ error: msg }, { status: msg === 'month must be YYYY-MM' ? 400 : 500 });
  }
}
