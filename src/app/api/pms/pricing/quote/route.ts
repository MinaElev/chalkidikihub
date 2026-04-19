import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { computeQuote, type PricingRule } from '@/lib/pms/pricing';

/**
 * Compute a pricing quote for a listing over a date range.
 * Input:  { listing_id, check_in, check_out, booking_date? }
 * Output: { base_rate, total_nights, subtotal_*, nightly_average, applied[] }
 *
 * Owner-scoped: the listing must belong to the caller. We do that via the
 * RLS-scoped server client (listings.owner_id policy already restricts the
 * select), so we don't need a separate role check here.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const listingId = typeof body.listing_id === 'string' ? body.listing_id : null;
  const checkIn = typeof body.check_in === 'string' ? body.check_in : null;
  const checkOut = typeof body.check_out === 'string' ? body.check_out : null;
  const bookingDate = typeof body.booking_date === 'string' ? body.booking_date : undefined;

  if (!listingId || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'listing_id, check_in, check_out required' }, { status: 400 });
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: 'check_out must be after check_in' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'not_signed_in' }, { status: 401 });

  const [{ data: listing }, { data: rules }] = await Promise.all([
    supabase
      .from('listings')
      .select('id, owner_id, price_per_night')
      .eq('id', listingId)
      .maybeSingle(),
    supabase
      .from('pms_pricing_rules')
      .select('id, name, rule_type, start_date, end_date, weekdays, min_nights, days_before, amount, is_percentage, operation, priority, active')
      .eq('listing_id', listingId)
      .eq('active', true)
      .order('priority', { ascending: false }),
  ]);

  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
  if (listing.owner_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const quote = computeQuote({
    baseRate: Number(listing.price_per_night) || 0,
    checkIn,
    checkOut,
    bookingDate,
    rules: (rules || []).map(r => ({ ...r, amount: Number(r.amount) })) as PricingRule[],
  });

  return NextResponse.json(quote);
}
