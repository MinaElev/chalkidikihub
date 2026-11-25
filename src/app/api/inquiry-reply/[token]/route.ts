import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { allowRequest } from '@/lib/rate-limit';
import { listingTitle } from '@/lib/content/listing-title';
import { publicSlug } from '@/content/rewrites/slug-renames';
import { mailGuestReply } from '@/lib/emails/inquiry-reply';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';

/**
 * POST /api/inquiry-reply/[token] — the owner answers a listing request from
 * the buttons in their email; the guest is mailed the answer.
 * Guard: public by the unguessable per-request token (24 random bytes) +
 * per-IP rate limit. One answer per request: the update only matches a row
 * that has none yet, so a double click can't mail the guest twice.
 * GET does nothing: mail scanners open links, so only the page's POST sends.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token || token.length < 20) return NextResponse.json({ error: 'not-found' }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }
  const status = body.status === 'available' ? 'available' : body.status === 'unavailable' ? 'unavailable' : null;
  if (!status) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const priceNum = Number(body.price);
  const price = status === 'available' && Number.isFinite(priceNum) && priceNum > 0 && priceNum < 1_000_000 ? Math.round(priceNum) : null;
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : '';

  if (!(await allowRequest(request, 'inquiry-reply', 20, 30))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }

  const db = adminDb();
  const { data: row } = await db
    .from('listing_inquiries')
    .update({ reply_status: status, reply_price: price, reply_message: message || null, replied_at: new Date().toISOString() })
    .eq('reply_token', token)
    .is('reply_status', null)
    .select('listing_id, owner_id, guest_name, guest_email, check_in, check_out, locale')
    .maybeSingle();
  if (!row) return NextResponse.json({ error: 'already-answered' }, { status: 409 });

  const [{ data: listing }, { data: owner }] = await Promise.all([
    db.from('listings').select('*').eq('id', row.listing_id).maybeSingle(),
    row.owner_id ? db.from('profiles').select('email').eq('id', row.owner_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);
  if (!listing) return NextResponse.json({ ok: true });

  const locale = (isLocale(row.locale) ? row.locale : 'en') as Locale;
  const ok = await mailGuestReply({
    guestEmail: row.guest_email,
    guestName: row.guest_name,
    locale,
    ownerEmail: owner?.email || listing.contact_email || null,
    listingName: listingTitle(listing, locale),
    listingSlug: publicSlug('listings', String(listing.slug)),
    checkIn: row.check_in,
    checkOut: row.check_out,
    available: status === 'available',
    price,
    message,
  });
  if (!ok) {
    await db.from('activity_logs').insert({ type: 'error', severity: 'error', message: 'Inquiry reply email to guest failed', details: { listing: listing.slug } });
    return NextResponse.json({ error: 'mail-failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
