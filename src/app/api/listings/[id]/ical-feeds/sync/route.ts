// Guard: requireListingOwner — the owner (or a superadmin) re-syncs their own listing's feeds on demand.
import { NextResponse, type NextRequest } from 'next/server';
import { requireListingOwner } from '@/lib/auth/guards';
import { adminDb } from '@/lib/supabase/clients';
import { syncFeeds } from '@/lib/availability/ical-sync';

/** A button press should not hammer Airbnb / Booking.com. */
const COOLDOWN_MS = 2 * 60 * 1000;

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  const auth = await requireListingOwner(id);
  if (auth instanceof NextResponse) return auth;

  const { data: feeds, error } = await adminDb()
    .from('listing_ical_feeds')
    .select('id, listing_id, url, last_synced_at')
    .eq('listing_id', id);
  if (error) return NextResponse.json({ error: 'not_configured' }, { status: 500 });

  const due = (feeds ?? []).filter((f) => !f.last_synced_at || Date.now() - new Date(f.last_synced_at).getTime() > COOLDOWN_MS);
  const results = await syncFeeds(due);
  return NextResponse.json({ synced: results.length, skipped: (feeds ?? []).length - due.length, results }, { headers: { 'Cache-Control': 'no-store' } });
}
