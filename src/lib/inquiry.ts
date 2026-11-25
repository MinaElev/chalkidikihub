import 'server-only';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { after } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { emailLayout, escapeHtml, sendMail } from '@/lib/email/mailer';
import { getListings, getLiveCalendarListingIds } from '@/lib/db/content';
import { displayName } from '@/lib/content/nearby';
import { formatPrice } from '@/lib/content/format';
import { optimizedImage } from '@/lib/image-url';
import { hasCoords, nearest } from '@/lib/geo';
import { adminDb } from '@/lib/supabase/clients';

/**
 * Availability requests to a single listing ("Ask about availability" on its
 * page): stored for the owner's inbox, mailed to the owner with one-click
 * reply links, and offered on to similar stays that are free on the same dates.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

export type InquiryData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  locale: string;
};

export type InquiryListing = {
  id: string;
  slug: string;
  title_el: string | null;
  owner_id: string | null;
  contact_email: string | null;
  show_calendar: boolean | null;
};

export type InquirySource = 'form' | 'calendar' | 'similar' | 'favorites';

const BTN = 'display:inline-block;margin:12px 8px 0 0;padding:10px 16px;border-radius:8px;font-weight:600;text-decoration:none';

/** The owner's one-click answer buttons (request email and the 24-hour reminder). */
export function replyButtonsHtml(token: string): string {
  const reply = (a: string) => `${SITE_URL}/inquiry-reply/${token}?a=${a}`;
  return `<div style="margin-top:20px;padding:16px;border:1px solid #e2e8f0;border-radius:12px">
    <p style="margin:0 0 4px;font-weight:600">Απαντήστε με ένα κλικ</p>
    <p style="margin:0;color:#64748b;font-size:13px">Ο επισκέπτης παίρνει αμέσως email στη γλώσσα του. Μπορείτε να προσθέσετε τιμή ή μήνυμα.</p>
    <a href="${reply('available')}" style="${BTN};color:#fff;background:#059669">✓ Είναι διαθέσιμο</a><a href="${reply('unavailable')}" style="${BTN};color:#334155;background:#f1f5f9;border:1px solid #cbd5e1">✗ Δεν είναι διαθέσιμο</a>
  </div>`;
}

/** Call / WhatsApp buttons for a number sent in +international form. */
export function callButtonsHtml(phone: string | null): string {
  const digits = (phone ?? '').replace(/\D/g, '');
  return phone?.startsWith('+') && digits.length >= 8 && digits.length <= 15
    ? `<p><a href="tel:+${digits}" style="${BTN};color:#fff;background:#0369a1">📞 Κλήση</a><a href="https://wa.me/${digits}" style="${BTN};color:#fff;background:#16a34a">WhatsApp</a></p>`
    : '';
}

const nightsOf = (d: InquiryData) =>
  d.checkIn && d.checkOut ? Math.round((Date.parse(d.checkOut) - Date.parse(d.checkIn)) / 86_400_000) : null;

/** Are all requested nights free on the listing's public calendar? Checked here, never taken from the browser. */
async function freeOnCalendar(db: SupabaseClient, listing: InquiryListing, d: InquiryData): Promise<boolean> {
  if (!nightsOf(d) || !listing.show_calendar) return false;
  const { count } = await db
    .from('listing_availability')
    .select('date', { count: 'exact', head: true })
    .eq('listing_id', listing.id)
    .neq('status', 'available')
    .gte('date', d.checkIn)
    .lt('date', d.checkOut);
  return count === 0;
}

/**
 * Stores one request and mails the owner. Returns false only when it could
 * not be stored (the owner email goes out after the response).
 */
export async function deliverInquiry(db: SupabaseClient, listing: InquiryListing, d: InquiryData, source: InquirySource): Promise<boolean> {
  const title = listing.title_el || listing.slug;
  const { error } = await db.from('contact_messages').insert({
    name: d.name,
    email: d.email,
    subject: `Αίτημα διαθεσιμότητας: ${title}`,
    message: `Κατάλυμα: ${title} (${listing.slug})\nCheck-in: ${d.checkIn || '-'}\nCheck-out: ${d.checkOut || '-'}\nΆτομα: ${d.guests}\nΤηλέφωνο: ${d.phone || '-'}\n\n${d.message}`,
    locale: d.locale,
  });
  if (error) return false;

  // The reply link. Until scripts/sql/2026-11-listing-inquiries.sql has run the
  // table is missing: the request still goes through, only without reply buttons.
  const token = randomBytes(24).toString('base64url');
  const { error: trackErr } = await db.from('listing_inquiries').insert({
    listing_id: listing.id,
    owner_id: listing.owner_id,
    guest_name: d.name,
    guest_email: d.email,
    guest_phone: d.phone || null,
    check_in: d.checkIn || null,
    check_out: d.checkOut || null,
    guests: d.guests,
    message: d.message || null,
    locale: d.locale,
    source,
    reply_token: token,
  });
  const replyToken = trackErr ? null : token;

  const { data: owner } = listing.owner_id
    ? await db.from('profiles').select('email, full_name').eq('id', listing.owner_id).maybeSingle()
    : { data: null };
  const to = owner?.email || listing.contact_email;
  if (!to) return true;

  const nights = nightsOf(d);
  const free = await freeOnCalendar(db, listing, d);
  const rows = [
    ['Κατάλυμα', title],
    ['Άφιξη', d.checkIn || '-'],
    ['Αναχώρηση', d.checkOut || '-'],
    ...(nights ? [['Βράδια', String(nights)]] : []),
    ...(free ? [['Ημερολόγιο', 'Οι ημερομηνίες είναι ελεύθερες στο ημερολόγιό σας']] : []),
    ['Άτομα', String(d.guests)],
    ['Όνομα', d.name],
    ['Email', d.email],
    ['Τηλέφωνο', d.phone || '-'],
    ['Γλώσσα επισκέπτη', d.locale.toUpperCase()],
  ];
  // The form sends the number with its country code (+…), so the owner can call or WhatsApp in one tap.
  const callButtons = callButtonsHtml(d.phone);
  const replyButtons = replyToken ? replyButtonsHtml(replyToken) : '';

  after(async () => {
    const ok = await sendMail({
      to,
      replyTo: d.email,
      subject: `Νέο αίτημα διαθεσιμότητας — ${title}`,
      html: emailLayout(
        'Νέο αίτημα διαθεσιμότητας',
        `<p>${owner?.full_name ? `Γεια σας, ${escapeHtml(owner.full_name)}.` : 'Γεια σας,'}</p>
         <p>Ένας επισκέπτης ρώτησε για διαθεσιμότητα μέσω του ChalkidikiHub. Απαντήστε απευθείας σε αυτό το email ή με τα κουμπιά παρακάτω.</p>
         <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px">${rows
           .map(([k, v]) => `<tr><td style="color:#64748b;width:40%">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
           .join('')}</table>
         ${callButtons}
         ${d.message ? `<p style="margin-top:16px;padding:12px;background:#f1f5f9;border-radius:8px">${escapeHtml(d.message).replace(/\n/g, '<br>')}</p>` : ''}
         ${replyButtons}`,
      ),
    });
    if (!ok) await db.from('activity_logs').insert({ type: 'error', severity: 'error', message: 'Inquiry email to owner failed', details: { slug: listing.slug, to } });
  });
  return true;
}

// ── Similar free stays ─────────────────────────────────────────────────────

export type SimilarStay = { slug: string; name: string; image: string | null; price: string | null; guests: string };

/**
 * Up to four other stays in the same area that sleep enough guests and are
 * free on every requested night, closest first. Only listings with a live
 * calendar (synced in the last day) count, so "free" is a fact, not a guess.
 */
export async function similarFreeStays(listingId: string, d: InquiryData, exclude: string[] = []): Promise<SimilarStay[]> {
  if (!nightsOf(d)) return [];
  const [all, liveIds] = await Promise.all([getListings(), getLiveCalendarListingIds()]);
  const self = all.find((l) => l.id === listingId);
  if (!self) return [];
  const live = new Set(liveIds);
  const pool = all.filter((l) => l.id !== listingId && !exclude.includes(l.id) && l.area === self.area && live.has(l.id) && (l.guests_max || 0) >= d.guests);
  if (!pool.length) return [];

  const { data } = await adminDb()
    .from('listing_availability')
    .select('listing_id')
    .in('listing_id', pool.map((l) => l.id))
    .neq('status', 'available')
    .gte('date', d.checkIn)
    .lt('date', d.checkOut)
    .limit(5000);
  const busy = new Set((data ?? []).map((r) => r.listing_id as string));
  const free = pool.filter((l) => !busy.has(l.id));

  const ordered = hasCoords(self)
    ? [...nearest(self, free.filter(hasCoords)).map((n) => n.item), ...free.filter((l) => !hasCoords(l))]
    : free;

  const locale = d.locale as Locale;
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  return ordered.slice(0, 4).map((l) => ({
    slug: l.slug,
    name: displayName(l, locale, 'listing'),
    image: l.cover_url ? optimizedImage(l.cover_url, 256) : null,
    price: l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${t('perNight')}` : null,
    guests: t('guests', { count: l.guests_max }),
  }));
}

// ── Signed offer: "send the same request to these too" ────────────────────

/**
 * The follow-up send reuses the guest's own request, signed by the server, so
 * the browser can neither change what is sent nor add listings that were not
 * offered. Valid for 30 minutes.
 */
type Offer = { d: InquiryData; slugs: string[]; exp: number };

const secret = () => process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';
const sign = (payload: string) => createHmac('sha256', secret()).update(`inquiry-offer:${payload}`).digest('base64url');

export function signOffer(d: InquiryData, slugs: string[]): string {
  const payload = Buffer.from(JSON.stringify({ d, slugs, exp: Date.now() + 30 * 60_000 } satisfies Offer)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readOffer(token: unknown): Offer | null {
  if (typeof token !== 'string' || token.length > 8000) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const want = Buffer.from(sign(payload));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  try {
    const offer = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Offer;
    return offer.exp > Date.now() ? offer : null;
  } catch {
    return null;
  }
}

// ── Reply speed badge ──────────────────────────────────────────────────────

/**
 * How fast the owner usually answers requests from the one-click buttons:
 * the median over the last 180 days, shown only with at least 3 answers and
 * only when it is within a day. "Already answered directly" doesn't count
 * (its time is when they clicked, not when they answered).
 */
export async function replySpeed(listingId: string): Promise<'hour' | 'hours' | 'day' | null> {
  try {
    const { data, error } = await adminDb()
      .from('listing_inquiries')
      .select('created_at, replied_at')
      .eq('listing_id', listingId)
      .in('reply_status', ['available', 'unavailable'])
      .gte('created_at', new Date(Date.now() - 180 * 86_400_000).toISOString())
      .limit(200);
    if (error || !data || data.length < 3) return null;
    const hours = data.map((r) => (Date.parse(r.replied_at as string) - Date.parse(r.created_at as string)) / 3_600_000).sort((a, b) => a - b);
    const median = hours[Math.floor(hours.length / 2)];
    return median <= 1 ? 'hour' : median <= 6 ? 'hours' : median <= 24 ? 'day' : null;
  } catch {
    return null;
  }
}
