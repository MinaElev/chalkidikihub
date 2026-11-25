// Guard: public form → honeypot, minimum fill time and per-IP daily cap.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { createAreaRequest, hashIp, requestIp } from '@/lib/availability/create-request';

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
    const result = await createAreaRequest(
      supabase,
      {
        guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children,
        budget_min, budget_max, property_type: property_type || null, notes: notes || null, locale,
      },
      hashIp(requestIp(request.headers)),
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error, message: result.message }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      public_token: result.public_token,
      dashboard_url: `/requests/${result.public_token}`,
      recipients_count: result.recipients_count,
      no_matches: result.no_matches,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
