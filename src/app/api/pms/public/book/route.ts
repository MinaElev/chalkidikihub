import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { computeQuote, type PricingRule } from '@/lib/pms/pricing';
import { mergeSettings } from '@/lib/pms/settings';

/**
 * Public direct-booking endpoint — guests hit this from /book/[slug].
 * No auth; we re-validate everything server-side against the same rules the
 * quote endpoint uses. On success, creates a row in pms_bookings with
 * source='direct' and status based on the owner's instant_book preference.
 * Owner alerts are sent by the regular hourly notification cron.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const slug = typeof body.slug === 'string' ? body.slug : null;
  const checkIn = typeof body.check_in === 'string' ? body.check_in : null;
  const checkOut = typeof body.check_out === 'string' ? body.check_out : null;
  const guestName = typeof body.guest_name === 'string' ? body.guest_name.trim() : '';
  const guestEmail = typeof body.guest_email === 'string' ? body.guest_email.trim() : '';
  const guestPhone = typeof body.guest_phone === 'string' ? body.guest_phone.trim() : null;
  const guestCountry = typeof body.guest_country === 'string' ? body.guest_country.trim() : null;
  const numGuests = Number(body.num_guests) || 1;
  const notes = typeof body.notes === 'string' ? body.notes.trim() : null;

  if (!slug || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'slug, check_in, check_out required' }, { status: 400 });
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: 'check_out must be after check_in' }, { status: 400 });
  }
  if (!guestName || !guestEmail) {
    return NextResponse.json({ error: 'guest_name + guest_email required' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (numGuests < 1 || numGuests > 50) {
    return NextResponse.json({ error: 'invalid_num_guests' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: listing } = await supabase
    .from('listings')
    .select('id, owner_id, slug, title_el, title_en, price_per_night, currency, guests_max, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });

  if (listing.guests_max && numGuests > listing.guests_max) {
    return NextResponse.json({ error: 'exceeds_max_guests', detail: `Max ${listing.guests_max}` }, { status: 400 });
  }

  // Re-check availability server-side (don't trust client).
  const [{ data: owner }, { data: override }, { data: rules }, { data: blocks }, { data: conflictBookings }] =
    await Promise.all([
      supabase.from('pms_owner_settings').select('*').eq('owner_id', listing.owner_id).maybeSingle(),
      supabase.from('pms_listing_settings').select('*').eq('listing_id', listing.id).maybeSingle(),
      supabase
        .from('pms_pricing_rules')
        .select('id, name, rule_type, start_date, end_date, weekdays, min_nights, days_before, amount, is_percentage, operation, priority, active')
        .eq('listing_id', listing.id)
        .eq('active', true),
      supabase
        .from('listing_availability')
        .select('date')
        .eq('listing_id', listing.id)
        .gte('date', checkIn)
        .lt('date', checkOut)
        .limit(1),
      supabase
        .from('pms_bookings')
        .select('id')
        .eq('listing_id', listing.id)
        .not('status', 'in', '(cancelled)')
        .lt('check_in', checkOut)
        .gt('check_out', checkIn)
        .limit(1),
    ]);

  if ((blocks && blocks.length > 0) || (conflictBookings && conflictBookings.length > 0)) {
    return NextResponse.json({ error: 'dates_not_available' }, { status: 409 });
  }

  const effective = mergeSettings(owner || null, override || null);
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000,
  );
  if (nights < effective.min_nights) {
    return NextResponse.json({ error: 'below_min_nights', detail: effective.min_nights }, { status: 400 });
  }
  if (effective.max_nights && nights > effective.max_nights) {
    return NextResponse.json({ error: 'above_max_nights', detail: effective.max_nights }, { status: 400 });
  }

  const quote = computeQuote({
    baseRate: Number(listing.price_per_night) || 0,
    checkIn,
    checkOut,
    rules: (rules || []).map(r => ({ ...r, amount: Number(r.amount) })) as PricingRule[],
  });

  const status = effective.instant_book ? 'confirmed' : 'inquiry';

  const { data: created, error: insErr } = await supabase
    .from('pms_bookings')
    .insert({
      listing_id: listing.id,
      owner_id: listing.owner_id,
      status,
      source: 'direct',
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      guest_country: guestCountry,
      num_guests: numGuests,
      check_in: checkIn,
      check_out: checkOut,
      currency: listing.currency || 'EUR',
      nightly_rate: quote.nightly_average,
      total_amount: quote.subtotal_post_booking_rules,
      payment_status: 'unpaid',
      notes,
    })
    .select('id, status, total_amount, currency, check_in, check_out')
    .single();

  if (insErr || !created) {
    return NextResponse.json({ error: insErr?.message || 'insert_failed' }, { status: 500 });
  }

  return NextResponse.json({
    booking_id: created.id,
    status: created.status,
    total: created.total_amount,
    currency: created.currency,
    check_in: created.check_in,
    check_out: created.check_out,
    listing_slug: listing.slug,
    listing_title_el: listing.title_el,
    listing_title_en: listing.title_en,
    deposit_percentage: effective.deposit_percentage,
    instant_book: effective.instant_book,
  }, { status: 201 });
}
