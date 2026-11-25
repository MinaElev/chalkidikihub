import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminDb } from '@/lib/supabase/clients';
import { dbSlug } from '@/content/rewrites/slug-renames';
import { allowRequest } from '@/lib/rate-limit';
import { isLocale } from '@/i18n/config';
import { deliverInquiry, type InquiryData } from '@/lib/inquiry';

/**
 * POST /api/inquiry/favorites — one availability request to several of the
 * signed-in visitor's favourite stays at once (the favourites page).
 * Guard: signed-in user only; only stays in that user's own favourites
 * (checked here, not trusted from the browser); at most 10; per-IP rate
 * limit (3 per 30 min); same validation as /api/inquiry.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export async function POST(request: NextRequest) {
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

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
  if (!d.name || !EMAIL.test(d.email) || !DATE.test(d.checkIn) || !DATE.test(d.checkOut) || d.checkOut <= d.checkIn) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const wanted = [...new Set(Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === 'string') : [])];

  const db = adminDb();
  const { data: favs } = await db.from('favorites').select('item_slug').eq('user_id', user.id).eq('item_type', 'listing');
  const own = new Set((favs ?? []).map((f) => f.item_slug as string));
  const slugs = wanted.filter((s) => own.has(s)).slice(0, 10);
  if (!slugs.length) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  if (!(await allowRequest(request, 'inquiry-favorites', 3, 30))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }

  const { data: listings } = await db
    .from('listings')
    .select('id, slug, title_el, owner_id, contact_email, status, show_calendar')
    .in('slug', slugs.map((s) => dbSlug('listings', s)))
    .eq('status', 'published');

  let sent = 0;
  for (const listing of listings ?? []) {
    if (await deliverInquiry(db, listing, d, 'favorites')) sent++;
  }
  return NextResponse.json({ ok: sent > 0, sent }, { status: sent > 0 ? 200 : 500 });
}
