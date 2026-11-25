import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { dbSlug } from '@/content/rewrites/slug-renames';
import { allowRequest } from '@/lib/rate-limit';
import { deliverInquiry, readOffer } from '@/lib/inquiry';

/**
 * POST /api/inquiry/also — "send the same request to these stays too", right
 * after a request on a listing page.
 * Guard: only with the server-signed offer that /api/inquiry returned (30 min,
 * the guest's own request, only the stays it listed) + per-IP rate limit.
 * The visitor picks which of the offered stays; nothing else can change.
 */
/** Offers already used (signature → expiry). In memory: the site runs as one process. */
const used = new Map<string, number>();

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }
  const offer = readOffer(body.offer);
  if (!offer) return NextResponse.json({ error: 'expired' }, { status: 400 });
  // One use per offer, so a copied request can't be replayed to the same owners.
  const key = String(body.offer).slice(-43);
  for (const [k, exp] of used) if (exp < Date.now()) used.delete(k);
  if (used.has(key)) return NextResponse.json({ error: 'already-sent' }, { status: 409 });

  const chosen = [...new Set(Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === 'string') : [])]
    .filter((s) => offer.slugs.includes(s))
    .slice(0, 4);
  if (!chosen.length) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  if (!(await allowRequest(request, 'inquiry-also', 3, 30))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }
  used.set(key, offer.exp);

  const db = adminDb();
  const { data: listings } = await db
    .from('listings')
    .select('id, slug, title_el, owner_id, contact_email, status, show_calendar')
    .in('slug', chosen.map((s) => dbSlug('listings', s)))
    .eq('status', 'published');

  let sent = 0;
  for (const listing of listings ?? []) {
    if (await deliverInquiry(db, listing, offer.d, 'similar')) sent++;
  }
  return NextResponse.json({ ok: sent > 0, sent }, { status: sent > 0 ? 200 : 500 });
}
