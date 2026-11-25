// Guard: requireCronOrSuperAdmin — scheduled task (Bearer CRON_SECRET) or a superadmin.
import { NextResponse, type NextRequest } from 'next/server';
import { requireCronOrSuperAdmin } from '@/lib/route-guards';
import { adminDb } from '@/lib/supabase/clients';
import { syncFeeds } from '@/lib/availability/ical-sync';
import { runInquiryFollowups } from '@/lib/inquiry-followups';

export const maxDuration = 300;

/** Feeds synced more recently than this are skipped (the owner may have pressed "sync now"). */
const MIN_AGE_MS = 2 * 60 * 60 * 1000;

/**
 * Pull every owner's Airbnb / Booking.com iCal feed into listing_availability.
 * Not run by vercel.json on Plesk: schedule it as a Plesk task, e.g. every 3 h:
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://chalkidikihub.gr/api/cron/ical-sync
 * `?force=1` ignores the 2-hour minimum age.
 */
async function run(request: NextRequest) {
  const auth = await requireCronOrSuperAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { data: feeds, error } = await adminDb().from('listing_ical_feeds').select('id, listing_id, url, last_synced_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const force = request.nextUrl.searchParams.get('force') === '1';
  const due = (feeds ?? []).filter(
    (f) => force || !f.last_synced_at || Date.now() - new Date(f.last_synced_at).getTime() > MIN_AGE_MS,
  );
  const results = await syncFeeds(due);
  const failed = results.filter((r) => !r.ok);
  // Same schedule for the request reminders (owner after 24 h, guest after 48 h):
  // calendars are fresh right now, so "free on your dates" in the guest email is too.
  const followups = await runInquiryFollowups().catch((e: unknown) => ({ error: e instanceof Error ? e.message : String(e) }));
  return NextResponse.json(
    {
      feeds: feeds?.length ?? 0,
      synced: results.length,
      changed: results.filter((r) => r.changed).length,
      failed: failed.map((r) => ({ feedId: r.feedId, error: r.error })),
      followups,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export const GET = run;
export const POST = run;
