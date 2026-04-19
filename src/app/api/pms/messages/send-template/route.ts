import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  dispatchTemplateToBooking,
  loadGmailCreds,
  type DispatchTemplate,
  type DispatchBooking,
  type DispatchListing,
} from '@/lib/pms/dispatch';

/**
 * Owner-initiated template send. Takes `{ template_id, booking_id, locale? }`,
 * verifies both rows belong to the caller, then hands off to the shared
 * dispatch helper (which also logs the outbound message + enforces
 * idempotency, unless the owner explicitly re-sends).
 *
 * We use the caller's RLS-scoped client to load the template + booking (so
 * owner scope is enforced by the database) and the service client only for
 * the actual send (it needs to read `site_settings` and insert into
 * `pms_messages` under owner_id).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const templateId = typeof body.template_id === 'string' ? body.template_id : null;
  const bookingId = typeof body.booking_id === 'string' ? body.booking_id : null;
  const locale = typeof body.locale === 'string' ? body.locale : null;
  const force = body.force === true;
  if (!templateId || !bookingId) {
    return NextResponse.json({ error: 'template_id and booking_id required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });

  const [{ data: template, error: tErr }, { data: booking, error: bErr }] = await Promise.all([
    supabase
      .from('pms_message_templates')
      .select('id, owner_id, name, trigger, subject_locales, body_locales, active, listing_ids')
      .eq('id', templateId)
      .eq('owner_id', user.id)
      .maybeSingle(),
    supabase
      .from('pms_bookings')
      .select('id, listing_id, owner_id, status, guest_name, guest_email, guest_country, check_in, check_out, total_amount, nightly_rate, currency, num_guests')
      .eq('id', bookingId)
      .eq('owner_id', user.id)
      .maybeSingle(),
  ]);

  if (tErr || !template) return NextResponse.json({ error: 'template_not_found' }, { status: 404 });
  if (bErr || !booking) return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
  if (!booking.guest_email) return NextResponse.json({ error: 'no_guest_email' }, { status: 400 });

  const { data: listing } = await supabase
    .from('listings')
    .select('id, slug, title_el, title_en')
    .eq('id', booking.listing_id)
    .maybeSingle();
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });

  const { data: ownerSettings } = await supabase
    .from('pms_owner_settings')
    .select('reply_to_email')
    .eq('owner_id', user.id)
    .maybeSingle();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .maybeSingle();

  // Switch to service client for send (needs site_settings + cross-policy insert)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_client_misconfigured' }, { status: 500 });
  }
  const svc = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const creds = await loadGmailCreds(svc);
  if (!creds) {
    return NextResponse.json(
      { error: 'gmail_creds_missing', hint: 'Set Gmail credentials in Admin → Settings.' },
      { status: 503 },
    );
  }

  const result = await dispatchTemplateToBooking(
    svc,
    template as DispatchTemplate,
    booking as DispatchBooking,
    {
      creds,
      listing: listing as DispatchListing,
      owner: {
        name: profile?.full_name || null,
        phone: profile?.phone || null,
        email: ownerSettings?.reply_to_email || user.email || null,
      },
      locale,
      skipIdempotency: force,
    },
  );

  if (result.ok) {
    return NextResponse.json({ ok: true, message_id: result.messageId, locale: result.locale });
  }
  if (result.skipped) {
    return NextResponse.json({ ok: false, skipped: result.skipped }, { status: 409 });
  }
  return NextResponse.json({ ok: false, error: result.error || 'unknown' }, { status: 500 });
}
