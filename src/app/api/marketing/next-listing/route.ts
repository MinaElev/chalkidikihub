import { NextRequest, NextResponse } from 'next/server';
import { getListingRotationKeys, getListingBySlug } from '@/lib/data';
import { buildListingCaption } from '@/lib/marketing/listing-caption';

/**
 * "One accommodation per day" feed for make.com (Facebook Page auto-poster).
 *
 * Design: STATELESS day-based rotation. No DB column, no write-back — the
 * listing for a given day is picked deterministically from the day number, so
 * make.com just does a plain HTTP GET and posts what it gets. Over N published
 * listings the feed cycles through all of them, one per day, then repeats.
 *
 * Query params (all optional):
 *   key    — must match MARKETING_FEED_KEY env var when that var is set (auth).
 *   area   — restrict rotation to one area (kassandra|sithonia|athos|mainland).
 *   offset — day offset, for previewing upcoming days (e.g. offset=1 = tomorrow).
 *   slug   — force a specific listing (testing/manual override).
 */
export const dynamic = 'force-dynamic';

// Whole-day number in Europe/Athens, so the pick flips at local midnight
// regardless of the server's UTC clock.
function athensDayNumber(): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  // parts = "YYYY-MM-DD"
  return Math.floor(Date.parse(`${parts}T00:00:00Z`) / 86_400_000);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // ── Auth (optional but recommended) ──
  const requiredKey = process.env.MARKETING_FEED_KEY;
  if (requiredKey && searchParams.get('key') !== requiredKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const area = searchParams.get('area');
  const forcedSlug = searchParams.get('slug');
  const offset = Number(searchParams.get('offset')) || 0;

  // Lightweight rotation index (oldest first) — just enough to pick the day's
  // slug without pulling every listing's full row.
  const pool = await getListingRotationKeys(area);
  if (!pool.length) {
    return NextResponse.json({ error: 'No published listings' }, { status: 404 });
  }

  let chosenSlug: string;
  if (forcedSlug) {
    if (!pool.some((l) => l.slug === forcedSlug)) {
      return NextResponse.json({ error: `Listing not found: ${forcedSlug}` }, { status: 404 });
    }
    chosenSlug = forcedSlug;
  } else {
    const index = (((athensDayNumber() + offset) % pool.length) + pool.length) % pool.length;
    chosenSlug = pool[index].slug;
  }

  // Fetch the single chosen listing in full (cached per-slug).
  const listing = await getListingBySlug(chosenSlug);
  if (!listing) {
    return NextResponse.json({ error: `Listing unavailable: ${chosenSlug}` }, { status: 404 });
  }

  const payload = buildListingCaption(listing);

  return NextResponse.json(
    {
      ...payload,
      rotation: { total: pool.length, area: area || 'all', offset },
    },
    // No CDN caching: the pick is date-dependent and make.com hits it once/day.
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
