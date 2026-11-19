// Guard: requireListingOwner — only the listing's owner (or a superadmin) sees or changes its iCal feeds.
import { NextResponse, type NextRequest } from 'next/server';
import { requireListingOwner } from '@/lib/auth/guards';
import { adminDb } from '@/lib/supabase/clients';
import { checkIcalUrl, maskIcalUrl } from '@/lib/availability/ical';
import { revalidateListings, syncFeed } from '@/lib/availability/ical-sync';

const MAX_FEEDS = 5;
const UUID = /^[0-9a-f-]{36}$/i;

type Ctx = { params: Promise<{ id: string }> };

const noStore = { headers: { 'Cache-Control': 'no-store' } };

async function listFeeds(listingId: string) {
  const { data, error } = await adminDb()
    .from('listing_ical_feeds')
    .select('id, source, url, last_synced_at, last_status, last_error, busy_days')
    .eq('listing_id', listingId)
    .order('created_at');
  if (error) return null;
  // Never send the full URL back: it carries the platform's private token.
  return (data ?? []).map(({ url, ...f }) => ({ ...f, url: maskIcalUrl(url) }));
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  const auth = await requireListingOwner(id);
  if (auth instanceof NextResponse) return auth;
  const feeds = await listFeeds(id);
  if (!feeds) return NextResponse.json({ error: 'not_configured' }, { status: 500, ...noStore });
  return NextResponse.json({ feeds }, noStore);
}

export async function POST(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  const auth = await requireListingOwner(id);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const check = checkIcalUrl(String(body?.url ?? ''));
  if (!check.ok) return NextResponse.json({ error: check.reason }, { status: 400 });

  const db = adminDb();
  const { count } = await db.from('listing_ical_feeds').select('id', { count: 'exact', head: true }).eq('listing_id', id);
  if ((count ?? 0) >= MAX_FEEDS) return NextResponse.json({ error: 'too_many' }, { status: 400 });

  const url = check.url.toString();
  const { data: feed, error } = await db
    .from('listing_ical_feeds')
    .insert({ listing_id: id, source: check.source, url })
    .select('id, listing_id, url')
    .single();
  if (error) {
    return NextResponse.json({ error: error.code === '23505' ? 'duplicate' : 'save_failed' }, { status: error.code === '23505' ? 409 : 500 });
  }

  const result = await syncFeed(feed);
  if (result.changed) await revalidateListings([id]);
  return NextResponse.json({ feeds: await listFeeds(id), result }, noStore);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const feedId = request.nextUrl.searchParams.get('feed') ?? '';
  if (!UUID.test(id) || !UUID.test(feedId)) return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  const auth = await requireListingOwner(id);
  if (auth instanceof NextResponse) return auth;

  // feed_id has ON DELETE CASCADE, so the imported days go with the feed.
  const { error } = await adminDb().from('listing_ical_feeds').delete().eq('id', feedId).eq('listing_id', id);
  if (error) return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
  await revalidateListings([id]);
  return NextResponse.json({ feeds: await listFeeds(id) }, noStore);
}
