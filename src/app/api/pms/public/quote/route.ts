import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { computeQuote, type PricingRule } from '@/lib/pms/pricing';
import { mergeSettings } from '@/lib/pms/settings';

/**
 * Public quote + availability check for the direct booking page.
 * No auth — guests use this before submitting.
 *
 * Body: { slug, check_in, check_out }
 * Returns:
 *   - listing: { id, slug, titles, image, currency, base_rate,
 *                effective policy (check-in/out times, min/max nights,
 *                cancellation, deposit %, instant_book) }
 *   - availability: { available, conflicts: [{start,end,reason}] }
 *   - quote: computeQuote() result (null when not available)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const slug = typeof body.slug === 'string' ? body.slug : null;
  const checkIn = typeof body.check_in === 'string' ? body.check_in : null;
  const checkOut = typeof body.check_out === 'string' ? body.check_out : null;

  if (!slug || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'slug, check_in, check_out required' }, { status: 400 });
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: 'check_out must be after check_in' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: listing, error: lErr } = await supabase
    .from('listings')
    .select(`
      id, slug, owner_id, status,
      title_el, title_en,
      price_per_night, currency, guests_max,
      listing_images (image_url, is_cover, sort_order)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 });
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });

  const [{ data: owner }, { data: override }, { data: rules }, { data: blocks }, { data: conflictBookings }] =
    await Promise.all([
      supabase
        .from('pms_owner_settings')
        .select('*')
        .eq('owner_id', listing.owner_id)
        .maybeSingle(),
      supabase
        .from('pms_listing_settings')
        .select('*')
        .eq('listing_id', listing.id)
        .maybeSingle(),
      supabase
        .from('pms_pricing_rules')
        .select('id, name, rule_type, start_date, end_date, weekdays, min_nights, days_before, amount, is_percentage, operation, priority, active')
        .eq('listing_id', listing.id)
        .eq('active', true)
        .order('priority', { ascending: false }),
      supabase
        .from('listing_availability')
        .select('date, status, note')
        .eq('listing_id', listing.id)
        .gte('date', checkIn)
        .lt('date', checkOut),
      supabase
        .from('pms_bookings')
        .select('id, check_in, check_out, status')
        .eq('listing_id', listing.id)
        .not('status', 'in', '(cancelled)')
        .lt('check_in', checkOut)
        .gt('check_out', checkIn),
    ]);

  const effective = mergeSettings(owner || null, override || null);

  // Nights validation against min/max
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000,
  );
  const conflicts: Array<{ kind: string; detail: string }> = [];

  if (nights < effective.min_nights) {
    conflicts.push({ kind: 'min_nights', detail: `Minimum ${effective.min_nights} nights` });
  }
  if (effective.max_nights && nights > effective.max_nights) {
    conflicts.push({ kind: 'max_nights', detail: `Maximum ${effective.max_nights} nights` });
  }
  if (blocks && blocks.length > 0) {
    const first = blocks[0];
    conflicts.push({ kind: 'date_blocked', detail: `${first.date} — ${first.note || 'unavailable'}` });
  }
  if (conflictBookings && conflictBookings.length > 0) {
    const b = conflictBookings[0];
    conflicts.push({ kind: 'overlapping_booking', detail: `${b.check_in} → ${b.check_out}` });
  }

  // Advance notice check (hours before check-in)
  const msUntilCheckIn = new Date(checkIn + 'T' + (effective.checkin_time || '15:00')).getTime() - Date.now();
  const hoursUntil = msUntilCheckIn / 3_600_000;
  if (hoursUntil < effective.advance_notice_hours) {
    conflicts.push({
      kind: 'advance_notice',
      detail: `Needs ${effective.advance_notice_hours}h advance notice`,
    });
  }

  const available = conflicts.length === 0;

  const quote = computeQuote({
    baseRate: Number(listing.price_per_night) || 0,
    checkIn,
    checkOut,
    rules: (rules || []).map(r => ({ ...r, amount: Number(r.amount) })) as PricingRule[],
  });

  const images = ((listing.listing_images as Array<{ image_url: string; is_cover: boolean; sort_order: number }>) || [])
    .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order);
  const coverImage = images[0]?.image_url || null;

  return NextResponse.json({
    listing: {
      id: listing.id,
      slug: listing.slug,
      title_el: listing.title_el,
      title_en: listing.title_en,
      currency: listing.currency || 'EUR',
      guests_max: listing.guests_max,
      price_per_night: Number(listing.price_per_night) || 0,
      cover_image: coverImage,
      policy: {
        checkin_time: effective.checkin_time,
        checkout_time: effective.checkout_time,
        min_nights: effective.min_nights,
        max_nights: effective.max_nights,
        cancellation_policy: effective.cancellation_policy,
        cancellation_policy_text: effective.cancellation_policy_text,
        deposit_percentage: effective.deposit_percentage,
        balance_due_days_before: effective.balance_due_days_before,
        instant_book: effective.instant_book,
      },
    },
    availability: { available, conflicts },
    quote: {
      nights: quote.total_nights,
      subtotal: quote.subtotal_post_booking_rules,
      nightly_average: quote.nightly_average,
      applied: quote.applied,
    },
  });
}
