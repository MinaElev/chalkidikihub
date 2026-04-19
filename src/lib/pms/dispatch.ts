/**
 * PMS message-template dispatch
 * -----------------------------------------------------------------------
 * A template stores subject + body as locale-keyed JSONB (el/en/de/fr/it/es)
 * plus a `trigger` (manual | on_inquiry | on_book | 3days_before | 1day_before
 * | on_checkin | on_checkout | 7days_after | on_cancel) and an optional
 * listing scope. This module has the pure helpers — locale fallback,
 * `{{variable}}` substitution, recipient-email guard, and the actual
 * Gmail/nodemailer send. The cron route (`/api/cron/pms-dispatch`) and the
 * manual "send with template" API import from here so the logic stays in one
 * place.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export type TemplateTrigger =
  | 'manual' | 'on_inquiry' | 'on_book'
  | '3days_before' | '1day_before'
  | 'on_checkin' | 'on_checkout'
  | '7days_after' | 'on_cancel';

export interface DispatchTemplate {
  id: string;
  owner_id: string;
  name: string;
  trigger: TemplateTrigger;
  subject_locales: Record<string, string> | null;
  body_locales: Record<string, string> | null;
  active: boolean;
  listing_ids: string[] | null;
}

export interface DispatchBooking {
  id: string;
  listing_id: string;
  owner_id: string;
  status: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_country: string | null;
  check_in: string;
  check_out: string;
  total_amount: number | null;
  nightly_rate: number | null;
  currency: string | null;
  num_guests: number | null;
}

export interface DispatchListing {
  id: string;
  slug: string | null;
  title_el: string | null;
  title_en: string | null;
}

// ─── Locale selection ────────────────────────────────────────────────
// Try the guest's preferred locale, fall back to EN, then EL, then whatever
// has content. Returns null if every locale slot is empty.
export function pickLocale(
  locales: Record<string, string> | null | undefined,
  preferred: string | null | undefined,
): { locale: string; text: string } | null {
  if (!locales) return null;
  const order = [preferred, 'en', 'el'].filter(Boolean) as string[];
  for (const code of order) {
    const v = locales[code];
    if (v && v.trim()) return { locale: code, text: v };
  }
  for (const [k, v] of Object.entries(locales)) {
    if (v && v.trim()) return { locale: k, text: v };
  }
  return null;
}

// Extremely rough guest-locale guess from ISO country code. Owners can always
// override via a future per-booking locale field; this is just a "better than
// always-English" default.
export function guessGuestLocale(country: string | null | undefined): string {
  if (!country) return 'en';
  const c = country.trim().toUpperCase();
  if (c === 'GR' || c === 'CY') return 'el';
  if (c === 'DE' || c === 'AT' || c === 'CH') return 'de';
  if (c === 'FR' || c === 'BE' || c === 'LU') return 'fr';
  if (c === 'IT') return 'it';
  if (c === 'ES' || c === 'MX' || c === 'AR') return 'es';
  return 'en';
}

// ─── Variable substitution ───────────────────────────────────────────
// `{{key}}` → vars[key]. Unknown keys are left as-is so owners see what didn't
// resolve instead of a mysterious empty slot.
export function renderTemplate(
  subjectTpl: string,
  bodyTpl: string,
  vars: Record<string, string>,
): { subject: string; body: string } {
  const apply = (s: string) =>
    s.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => {
      const v = vars[k];
      return v == null ? `{{${k}}}` : v;
    });
  return { subject: apply(subjectTpl || ''), body: apply(bodyTpl || '') };
}

export function buildTemplateVars(
  booking: DispatchBooking,
  listing: DispatchListing,
  owner: { name?: string | null; phone?: string | null; email?: string | null } = {},
): Record<string, string> {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86_400_000,
    ),
  );
  const currency = booking.currency || 'EUR';
  const total = booking.total_amount != null ? `${Number(booking.total_amount).toFixed(2)} ${currency}` : '';
  const listingName = listing.title_el || listing.title_en || '';
  return {
    guest_name: booking.guest_name || '',
    listing_name: listingName,
    check_in: booking.check_in,
    check_out: booking.check_out,
    nights: String(nights),
    total,
    owner_name: owner.name || '',
    owner_phone: owner.phone || '',
    owner_email: owner.email || '',
  };
}

// Plain-text message body → minimal HTML (paragraphs from blank lines, linebreaks
// preserved). No CSS frameworks, just inline styles so Gmail/Outlook render it
// the same as nodemailer's raw transport would.
export function bodyToHtml(body: string, listingName: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const paragraphs = body
    .split(/\n\s*\n/)
    .map(p => `<p style="margin:0 0 14px;">${escape(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e5e7eb;color:#111827;font-size:15px;line-height:1.7;">
    ${paragraphs}
    <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
      ${escape(listingName)}
    </div>
  </div>
</div></body></html>`;
}

// ─── SMTP credentials ────────────────────────────────────────────────
// Reads the Gmail address + app-password from site_settings first (so a super-
// admin can rotate keys from the dashboard) and falls back to env vars.
export async function loadGmailCreds(supabase: SupabaseClient): Promise<{ user: string; pass: string } | null> {
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['gmail_address', 'gmail_app_password']);
  const map: Record<string, string> = {};
  settings?.forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
  const user = map.gmail_address || process.env.GMAIL_ADDRESS || '';
  const pass = map.gmail_app_password || process.env.GMAIL_APP_PASSWORD || '';
  if (!user || !pass) return null;
  return { user, pass };
}

export async function sendTemplateEmail(opts: {
  to: string;
  subject: string;
  html: string;
  fromName: string;
  creds: { user: string; pass: string };
  replyTo?: string | null;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: opts.creds.user, pass: opts.creds.pass.replace(/\s/g, '') },
  });
  await transporter.sendMail({
    from: `${opts.fromName} <${opts.creds.user}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo || undefined,
  });
}

// ─── Main entry: send one template to one booking ────────────────────
// Returns:
//  - { ok: true, messageId } on success
//  - { ok: false, skipped: '...' } when we intentionally skipped (no email, no body, already sent)
//  - { ok: false, error: '...' } on hard failure
// The cron route loops over (template, booking) pairs and calls this per pair;
// the manual API does the same for a single pair after an owner clicks "Send".
export async function dispatchTemplateToBooking(
  supabase: SupabaseClient,
  template: DispatchTemplate,
  booking: DispatchBooking,
  opts: {
    creds: { user: string; pass: string };
    listing: DispatchListing;
    owner: { name?: string | null; phone?: string | null; email?: string | null };
    locale?: string | null;
    skipIdempotency?: boolean;
  },
): Promise<
  | { ok: true; messageId: string; locale: string }
  | { ok: false; skipped?: string; error?: string }
> {
  if (!booking.guest_email) return { ok: false, skipped: 'no_guest_email' };

  if (!opts.skipIdempotency) {
    const { data: existing } = await supabase
      .from('pms_messages')
      .select('id')
      .eq('template_id', template.id)
      .eq('booking_id', booking.id)
      .limit(1);
    if (existing && existing.length > 0) return { ok: false, skipped: 'already_sent' };
  }

  const locale = opts.locale || guessGuestLocale(booking.guest_country);
  const bodyLoc = pickLocale(template.body_locales, locale);
  if (!bodyLoc) return { ok: false, skipped: 'no_body_in_any_locale' };
  const subjLoc = pickLocale(template.subject_locales, locale);

  const vars = buildTemplateVars(booking, opts.listing, opts.owner);
  const defaultSubject = `${opts.listing.title_en || opts.listing.title_el || 'Booking'} — ${template.name}`;
  const { subject, body } = renderTemplate(subjLoc?.text || defaultSubject, bodyLoc.text, vars);

  try {
    await sendTemplateEmail({
      to: booking.guest_email,
      subject,
      html: bodyToHtml(body, opts.listing.title_el || opts.listing.title_en || ''),
      fromName: opts.listing.title_el || opts.listing.title_en || 'ChalkidikiHub',
      creds: opts.creds,
      replyTo: opts.owner.email || null,
    });
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  const { data: inserted, error: insErr } = await supabase
    .from('pms_messages')
    .insert({
      owner_id: template.owner_id,
      listing_id: booking.listing_id,
      booking_id: booking.id,
      direction: 'outbound',
      channel: 'email',
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      subject,
      body,
      is_automated: true,
      template_id: template.id,
    })
    .select('id')
    .single();

  if (insErr || !inserted) return { ok: false, error: insErr?.message || 'insert_failed' };
  return { ok: true, messageId: inserted.id, locale: bodyLoc.locale };
}

// ─── Trigger → booking query filter ──────────────────────────────────
// Given a trigger type and today's date, returns the Supabase filter criteria
// identifying bookings that currently match. Caller composes the final query
// (owner scope, listing scope, guest_email NOT NULL).
export interface TriggerWindow {
  statusIn?: string[];
  status?: string;
  checkInGte?: string;
  checkInLte?: string;
  checkInEq?: string;
  checkOutEq?: string;
  checkOutGte?: string;
  checkOutLte?: string;
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function triggerToWindow(trigger: TemplateTrigger, today: string): TriggerWindow | null {
  switch (trigger) {
    case 'on_inquiry':   return { status: 'inquiry' };
    case 'on_book':      return { statusIn: ['confirmed', 'checked_in', 'checked_out'] };
    case 'on_cancel':    return { status: 'cancelled' };
    case '3days_before': return { statusIn: ['confirmed', 'checked_in'], checkInEq: addDays(today, 3) };
    case '1day_before':  return { statusIn: ['confirmed', 'checked_in'], checkInEq: addDays(today, 1) };
    case 'on_checkin':   return { statusIn: ['confirmed', 'checked_in'], checkInEq: today };
    case 'on_checkout':  return { statusIn: ['checked_in', 'checked_out', 'confirmed'], checkOutEq: today };
    case '7days_after':  return { statusIn: ['checked_out', 'confirmed'], checkOutEq: addDays(today, -7) };
    case 'manual':       return null;
  }
}
