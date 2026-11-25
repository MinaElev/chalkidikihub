// Guard: requireCronOrSuperAdmin — scheduled task (Bearer CRON_SECRET) or a superadmin.
import { NextResponse, type NextRequest } from 'next/server';
import { requireCronOrSuperAdmin } from '@/lib/route-guards';
import { runInquiryFollowups } from '@/lib/inquiry-followups';

export const maxDuration = 300;

/**
 * Reminders for unanswered listing requests (owner after 24 h, guest after
 * 48 h; see lib/inquiry-followups.ts). Also runs at the end of every
 * /api/cron/ical-sync, so no separate Plesk task is needed; this route is for
 * running it by hand or on its own schedule.
 */
async function run(request: NextRequest) {
  const auth = await requireCronOrSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json(await runInquiryFollowups(), { headers: { 'Cache-Control': 'no-store' } });
}

export const GET = run;
export const POST = run;
