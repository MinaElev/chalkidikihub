import { NextRequest } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  dispatchTemplateToBooking,
  loadGmailCreds,
  triggerToWindow,
  type DispatchTemplate,
  type DispatchBooking,
  type DispatchListing,
} from '@/lib/pms/dispatch';

/**
 * Hourly cron — scans every active non-manual template, finds bookings that
 * currently match its trigger window, and sends any that haven't been sent
 * yet (idempotency guard lives in `dispatchTemplateToBooking`).
 *
 * Authed via Vercel's `Authorization: Bearer $CRON_SECRET` header, same
 * pattern as `/api/pms/ical/sync-all`.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: 'service client not configured' }, { status: 500 });
  }

  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const creds = await loadGmailCreds(supabase);
  if (!creds) {
    return Response.json(
      { ok: false, error: 'gmail_creds_missing', hint: 'Set gmail_address + gmail_app_password in site_settings.' },
      { status: 200 },
    );
  }

  const { data: templates, error: tErr } = await supabase
    .from('pms_message_templates')
    .select('id, owner_id, name, trigger, subject_locales, body_locales, active, listing_ids')
    .eq('active', true)
    .neq('trigger', 'manual')
    .limit(1000);
  if (tErr) return Response.json({ error: tErr.message }, { status: 500 });

  const today = new Date().toISOString().slice(0, 10);
  const startedAt = Date.now();
  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const errors: Array<{ template: string; booking: string; error: string }> = [];

  const listingCache = new Map<string, DispatchListing | null>();
  const ownerCache = new Map<string, { name?: string | null; phone?: string | null; email?: string | null }>();

  for (const tpl of (templates as DispatchTemplate[]) || []) {
    const window = triggerToWindow(tpl.trigger, today);
    if (!window) continue;

    let q = supabase
      .from('pms_bookings')
      .select('id, listing_id, owner_id, status, guest_name, guest_email, guest_country, check_in, check_out, total_amount, nightly_rate, currency, num_guests')
      .eq('owner_id', tpl.owner_id)
      .not('guest_email', 'is', null);

    if (tpl.listing_ids && tpl.listing_ids.length > 0) q = q.in('listing_id', tpl.listing_ids);
    if (window.status) q = q.eq('status', window.status);
    if (window.statusIn) q = q.in('status', window.statusIn);
    if (window.checkInEq) q = q.eq('check_in', window.checkInEq);
    if (window.checkInGte) q = q.gte('check_in', window.checkInGte);
    if (window.checkInLte) q = q.lte('check_in', window.checkInLte);
    if (window.checkOutEq) q = q.eq('check_out', window.checkOutEq);
    if (window.checkOutGte) q = q.gte('check_out', window.checkOutGte);
    if (window.checkOutLte) q = q.lte('check_out', window.checkOutLte);

    const { data: bookings, error: bErr } = await q.limit(500);
    if (bErr) { failed++; continue; }

    if (!ownerCache.has(tpl.owner_id)) {
      const { data: settings } = await supabase
        .from('pms_owner_settings')
        .select('reply_to_email')
        .eq('owner_id', tpl.owner_id)
        .maybeSingle();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', tpl.owner_id)
        .maybeSingle();
      const { data: authUser } = await supabase.auth.admin.getUserById(tpl.owner_id);
      ownerCache.set(tpl.owner_id, {
        name: profile?.full_name || null,
        phone: profile?.phone || null,
        email: settings?.reply_to_email || authUser?.user?.email || null,
      });
    }
    const owner = ownerCache.get(tpl.owner_id)!;

    for (const b of (bookings as DispatchBooking[]) || []) {
      let listing = listingCache.get(b.listing_id) ?? null;
      if (!listingCache.has(b.listing_id)) {
        const { data } = await supabase
          .from('listings')
          .select('id, slug, title_el, title_en')
          .eq('id', b.listing_id)
          .maybeSingle();
        listing = data as DispatchListing | null;
        listingCache.set(b.listing_id, listing);
      }
      if (!listing) { skipped++; continue; }

      const result = await dispatchTemplateToBooking(supabase, tpl, b, { creds, listing, owner });
      if (result.ok) {
        sent++;
      } else if (result.skipped) {
        skipped++;
      } else {
        failed++;
        errors.push({ template: tpl.id, booking: b.id, error: result.error || 'unknown' });
      }
    }
  }

  return Response.json({
    ok: true,
    sent,
    skipped,
    failed,
    errors: errors.slice(0, 20),
    templates_scanned: templates?.length || 0,
    duration_ms: Date.now() - startedAt,
  });
}
