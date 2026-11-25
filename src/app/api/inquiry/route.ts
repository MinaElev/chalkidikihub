import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { dbSlug } from '@/content/rewrites/slug-renames';
import { allowRequest } from '@/lib/rate-limit';
import { isLocale } from '@/i18n/config';
import { deliverInquiry, signOffer, similarFreeStays, type InquiryData } from '@/lib/inquiry';

/**
 * POST /api/inquiry — a visitor asks an owner about availability.
 * Guard: public form → honeypot + per-IP rate limit (5 per 30 min) + strict
 * validation. The owner's address is looked up server-side; nothing the
 * client sends decides who receives the email.
 *
 * Stored in contact_messages with v3's exact subject/body format, so owners'
 * existing inbox (and its read state in inquiry_reads) keeps working.
 *
 * The answer lists other stays free on the same dates, with a signed offer
 * that /api/inquiry/also accepts to send them the same request.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  // Bots fill every field, people never see this one.
  if (clip(body.website, 200)) return NextResponse.json({ ok: true });

  const slug = clip(body.slug, 200).replace(/[^a-z0-9-]/g, '');
  const d: InquiryData = {
    name: clip(body.name, 120),
    email: clip(body.email, 200).replace(/[\r\n]/g, ''),
    phone: clip(body.phone, 30).replace(/[^\d+()\s-]/g, ''),
    message: clip(body.message, 2000),
    checkIn: clip(body.checkIn, 10),
    checkOut: clip(body.checkOut, 10),
    guests: Math.min(Math.max(Number(body.guests) || 0, 1), 30),
    locale: isLocale(clip(body.locale, 5)) ? clip(body.locale, 5) : 'el',
  };

  if (!slug || !d.name || !EMAIL.test(d.email) || (d.checkIn && !DATE.test(d.checkIn)) || (d.checkOut && !DATE.test(d.checkOut))) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (d.checkIn && d.checkOut && d.checkOut <= d.checkIn) return NextResponse.json({ error: 'invalid-dates' }, { status: 400 });

  if (!(await allowRequest(request, 'inquiry', 5, 30))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }

  const db = adminDb();
  const { data: listing } = await db
    .from('listings')
    .select('id, slug, title_el, owner_id, contact_email, status, show_calendar')
    .eq('slug', dbSlug('listings', slug))
    .eq('status', 'published')
    .maybeSingle();
  if (!listing) return NextResponse.json({ error: 'not-found' }, { status: 404 });

  const source = body.source === 'calendar' ? 'calendar' : 'form';
  if (!(await deliverInquiry(db, listing, d, source))) return NextResponse.json({ error: 'store-failed' }, { status: 500 });

  // Never let the suggestions break a request that already went through.
  let similar: Awaited<ReturnType<typeof similarFreeStays>> = [];
  try {
    similar = await similarFreeStays(listing.id, d);
  } catch (e) {
    console.error('inquiry similar:', e instanceof Error ? e.message : e);
  }
  return NextResponse.json({
    ok: true,
    similar,
    offer: similar.length ? signOffer(d, similar.map((s) => s.slug)) : null,
  });
}
