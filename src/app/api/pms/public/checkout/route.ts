import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { stripeFetch } from '@/lib/pms/stripe';
import { mergeSettings } from '@/lib/pms/settings';

/**
 * Create a Stripe Checkout Session for a just-created direct booking.
 * The guest is redirected from /book/[slug] to session.url, pays, and
 * Stripe redirects them back to /book/[slug]/success?session_id=...
 *
 * Uses `transfer_data.destination` + `application_fee_amount=0` so the
 * funds land in the owner's connected Stripe account with no platform
 * cut — this is ChalkidikiHub's 0% commission promise materialised.
 *
 * Charges only the deposit portion on checkout; the balance is handled
 * off-platform (bank transfer / cash) per the owner's policy.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const bookingId = typeof body.booking_id === 'string' ? body.booking_id : null;
  if (!bookingId) return NextResponse.json({ error: 'booking_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 500 });
  }

  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: booking } = await supabase
    .from('pms_bookings')
    .select('id, owner_id, listing_id, guest_email, total_amount, currency, payment_status, check_in, check_out')
    .eq('id', bookingId)
    .eq('source', 'direct')
    .maybeSingle();
  if (!booking) return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
  if (booking.payment_status === 'deposit_paid' || booking.payment_status === 'fully_paid') {
    return NextResponse.json({ error: 'already_paid' }, { status: 409 });
  }

  const [{ data: listing }, { data: owner }, { data: override }] = await Promise.all([
    supabase.from('listings').select('slug, title_el, title_en').eq('id', booking.listing_id).maybeSingle(),
    supabase.from('pms_owner_settings').select('*').eq('owner_id', booking.owner_id).maybeSingle(),
    supabase.from('pms_listing_settings').select('*').eq('listing_id', booking.listing_id).maybeSingle(),
  ]);

  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
  if (!owner?.stripe_account_id || !owner?.stripe_onboarded) {
    return NextResponse.json({ error: 'owner_not_onboarded' }, { status: 409 });
  }

  const effective = mergeSettings(owner, override || null);
  const totalCents = Math.round(Number(booking.total_amount) * 100);
  const depositCents = Math.round(totalCents * (effective.deposit_percentage / 100));
  if (depositCents <= 0) return NextResponse.json({ error: 'zero_deposit' }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const successUrl = `${baseUrl}/el/book/${listing.slug}/success?booking=${booking.id}&session={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/el/book/${listing.slug}/cancelled?booking=${booking.id}`;
  const productName = `${listing.title_en || listing.title_el || 'Booking'} — ${booking.check_in} → ${booking.check_out}`;

  const sessionBody: Record<string, string | number> = {
    mode: 'payment',
    'payment_method_types[0]': 'card',
    'line_items[0][price_data][currency]': (booking.currency || 'EUR').toLowerCase(),
    'line_items[0][price_data][product_data][name]': productName,
    'line_items[0][price_data][unit_amount]': depositCents,
    'line_items[0][quantity]': 1,
    customer_email: booking.guest_email || '',
    client_reference_id: booking.id,
    'metadata[booking_id]': booking.id,
    'metadata[owner_id]': booking.owner_id,
    'payment_intent_data[application_fee_amount]': 0,
    'payment_intent_data[transfer_data][destination]': owner.stripe_account_id,
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  const result = await stripeFetch<{ id: string; url: string }>(
    '/checkout/sessions',
    { method: 'POST', body: sessionBody as Record<string, unknown> },
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error || 'stripe_error' }, { status: 500 });
  }

  await supabase
    .from('pms_bookings')
    .update({ stripe_checkout_session_id: result.data.id })
    .eq('id', booking.id);

  return NextResponse.json({ url: result.data.url, session_id: result.data.id });
}
