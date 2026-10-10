// Guard: public form → honeypot, minimum fill time and per-IP daily cap.
import { NextRequest, NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/api-helpers';
import {
  prepareBroadcast,
  sendBroadcast,
  sendGuestConfirmation,
  generatePublicToken,
  MAX_REQUESTS_PER_DAY,
  type AvailabilityRequestRow,
} from '@/lib/availability/dispatch';

// Owner matching runs inline (a few fast queries) so we can tell the visitor how
// many owners will be notified. The slow half — up to 50 sequential Gmail sends
// (~25-40s) plus the guest confirmation email — runs AFTER the response via
// `after()`, so the visitor gets an instant reply instead of watching a spinner.
// `after` still honours this maxDuration, and the send loop fits comfortably.
export const maxDuration = 60;

const SUPPORTED_LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'];

// Small list — extend over time. Cheap disposable-mail block.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'throwawaymail.com',
  'sharklasers.com',
  'getairmail.com',
  'mailnesia.com',
]);

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];
const PROPERTY_TYPES = ['rooms', 'studio', 'apartment', 'house', 'villa'];

function clean(s: unknown, max = 200): string {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function isValidPhone(p: string): boolean {
  // Accept any international format: digits, optional leading +, allow
  // spaces/dashes/parens in input. Require 6–18 digits total (covers every
  // E.164 country plus short local-only numbers).
  const digits = p.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 18;
}

function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + (process.env.NEXT_PUBLIC_SITE_URL || ''))
    .digest('hex')
    .slice(0, 32);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ─── Honeypot + min-time anti-bot ─────────────────────────────────
    if (body.website) {
      // bot filled hidden field
      return NextResponse.json({ success: true }, { status: 200 });
    }
    const elapsed = Number(body.elapsed || 0);
    if (elapsed > 0 && elapsed < 3000) {
      return NextResponse.json({ error: 'submitted_too_fast' }, { status: 400 });
    }

    // ─── Validate ─────────────────────────────────────────────────────
    const guest_name = clean(body.guest_name, 120);
    const guest_email = clean(body.guest_email, 200).toLowerCase();
    const guest_phone = clean(body.guest_phone, 30);
    const area = clean(body.area, 20);
    const check_in = clean(body.check_in, 10);
    const check_out = clean(body.check_out, 10);
    const adults = Math.max(1, Math.min(20, parseInt(body.adults, 10) || 0));
    const children = Math.max(0, Math.min(15, parseInt(body.children, 10) || 0));
    const budget_min = body.budget_min ? Math.max(0, Number(body.budget_min)) : null;
    const budget_max = body.budget_max ? Math.max(0, Number(body.budget_max)) : null;
    const property_type = clean(body.property_type, 30);
    const notes = clean(body.notes, 1000);
    const locale = SUPPORTED_LOCALES.includes(body.locale) ? body.locale : 'el';

    if (!guest_name || guest_name.length < 2) {
      return NextResponse.json({ error: 'missing_name' }, { status: 400 });
    }
    if (!isValidEmail(guest_email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }
    const emailDomain = guest_email.split('@')[1] || '';
    if (DISPOSABLE_DOMAINS.has(emailDomain)) {
      return NextResponse.json({ error: 'disposable_email' }, { status: 400 });
    }
    if (!isValidPhone(guest_phone)) {
      return NextResponse.json({ error: 'invalid_phone' }, { status: 400 });
    }
    if (!AREAS.includes(area)) {
      return NextResponse.json({ error: 'invalid_area' }, { status: 400 });
    }
    if (property_type && !PROPERTY_TYPES.includes(property_type)) {
      return NextResponse.json({ error: 'invalid_property_type' }, { status: 400 });
    }
    if (budget_min !== null && budget_max !== null && budget_max < budget_min) {
      return NextResponse.json({ error: 'budget_order' }, { status: 400 });
    }

    const ci = new Date(check_in);
    const co = new Date(check_out);
    if (isNaN(ci.getTime()) || isNaN(co.getTime())) {
      return NextResponse.json({ error: 'invalid_dates' }, { status: 400 });
    }
    if (co.getTime() <= ci.getTime()) {
      return NextResponse.json({ error: 'checkout_before_checkin' }, { status: 400 });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (ci.getTime() < today.getTime()) {
      return NextResponse.json({ error: 'checkin_in_past' }, { status: 400 });
    }
    const oneYear = 365 * 86_400_000;
    if (ci.getTime() - today.getTime() > oneYear) {
      return NextResponse.json({ error: 'checkin_too_far' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // ─── Rate limits ──────────────────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const ipHash = hashIp(ip);

    const day = new Date(Date.now() - 86_400_000).toISOString();
    const month = new Date(Date.now() - 30 * 86_400_000).toISOString();

    const [emailDayRes, ipDayRes, emailMonthRes, totalDayRes] = await Promise.all([
      supabase
        .from('availability_requests')
        .select('id', { count: 'exact', head: true })
        .eq('guest_email', guest_email)
        .gte('created_at', day),
      supabase
        .from('availability_requests')
        .select('id', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', day),
      supabase
        .from('availability_requests')
        .select('id', { count: 'exact', head: true })
        .eq('guest_email', guest_email)
        .gte('created_at', month),
      supabase
        .from('availability_requests')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', day),
    ]);

    if ((emailDayRes.count || 0) >= 1) {
      return NextResponse.json(
        { error: 'rate_limit_email_day', message: 'Έχεις ήδη στείλει αίτημα τις τελευταίες 24 ώρες.' },
        { status: 429 },
      );
    }
    if ((ipDayRes.count || 0) >= 3) {
      return NextResponse.json(
        { error: 'rate_limit_ip_day', message: 'Πολλά αιτήματα από αυτή τη συσκευή. Δοκίμασε ξανά αύριο.' },
        { status: 429 },
      );
    }
    if ((emailMonthRes.count || 0) >= 5) {
      return NextResponse.json(
        { error: 'rate_limit_email_month', message: 'Έχεις ξεπεράσει το όριο αιτημάτων ανά μήνα.' },
        { status: 429 },
      );
    }
    if ((totalDayRes.count || 0) >= MAX_REQUESTS_PER_DAY) {
      return NextResponse.json(
        {
          error: 'platform_daily_cap',
          message: 'Η πλατφόρμα δέχεται περιορισμένο αριθμό αιτημάτων ημερησίως. Δοκίμασε ξανά αύριο.',
        },
        { status: 429 },
      );
    }

    // ─── Insert request ───────────────────────────────────────────────
    const public_token = generatePublicToken();
    const expires_at = new Date(co.getTime() + 7 * 86_400_000).toISOString();

    const { data: inserted, error: insErr } = await supabase
      .from('availability_requests')
      .insert({
        public_token,
        guest_name,
        guest_email,
        guest_phone,
        area,
        check_in,
        check_out,
        adults,
        children,
        budget_min,
        budget_max,
        property_type: property_type || null,
        notes: notes || null,
        status: 'active',
        expires_at,
        ip_hash: ipHash,
        locale,
      })
      .select('id, public_token, guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children, budget_min, budget_max, property_type, notes, locale')
      .single();

    if (insErr || !inserted) {
      return NextResponse.json({ error: 'insert_failed', detail: insErr?.message }, { status: 500 });
    }

    const requestRow = inserted as AvailabilityRequestRow;

    // ─── Match owners (inline, fast) ─────────────────────────────────
    // Only the matching runs synchronously so we can report the count. The
    // actual email sending is deferred to `after()` below.
    const { creds, candidates } = await prepareBroadcast(supabase, requestRow);
    const recipientCount = candidates.length;

    // Record the intended recipient count now so the guest dashboard shows the
    // right "waiting" number immediately, even before the emails finish sending.
    if (recipientCount > 0) {
      await supabase
        .from('availability_requests')
        .update({ recipients_count: recipientCount })
        .eq('id', inserted.id);
    }

    // ─── Send emails + guest confirmation + log AFTER responding ─────
    after(async () => {
      try {
        let sent = 0;
        let failed = 0;
        if (creds && candidates.length > 0) {
          const r = await sendBroadcast(supabase, requestRow, candidates, creds);
          sent = r.sent;
          failed = r.failed;
          // Correct the count if some sends failed (recipients_count = actually sent).
          if (sent !== recipientCount) {
            await supabase
              .from('availability_requests')
              .update({ recipients_count: sent })
              .eq('id', inserted.id);
          }
        }

        await sendGuestConfirmation(supabase, requestRow, sent).catch(() => {});

        await supabase.from('activity_logs').insert({
          type: 'user_action',
          severity: 'info',
          message: `Availability request submitted (${area}, ${sent} owners notified)`,
          details: { request_id: inserted.id, area, sent, failed },
        });
      } catch {
        // Swallow — the request row is already saved; the guest can still track
        // it via the dashboard link, and the activity log is best-effort.
      }
    });

    return NextResponse.json({
      success: true,
      public_token,
      dashboard_url: `/requests/${public_token}`,
      recipients_count: recipientCount,
      no_matches: recipientCount === 0 && !!creds,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
