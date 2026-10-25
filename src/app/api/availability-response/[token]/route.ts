// Guard: public by unguessable per-owner response token.
import { after, NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { notifyGuestFirstResponse } from '@/lib/availability/dispatch';

// GET: load the request data so the owner page can render the form.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token || token.length < 16) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: recipient } = await supabase
    .from('availability_request_recipients')
    .select('id, request_id, owner_id, sent_at')
    .eq('response_token', token)
    .single();

  if (!recipient) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: req } = await supabase
    .from('availability_requests')
    .select(
      'id, guest_name, guest_phone, area, check_in, check_out, adults, children, budget_min, budget_max, property_type, notes, status, expires_at',
    )
    .eq('id', recipient.request_id)
    .single();

  if (!req) return NextResponse.json({ error: 'request_gone' }, { status: 404 });

  const expired =
    req.status === 'closed' ||
    req.status === 'expired' ||
    new Date(req.expires_at).getTime() < Date.now();

  // Existing response if any
  const { data: existing } = await supabase
    .from('availability_responses')
    .select('status, price, message, contact_phone, alt_check_in, alt_check_out, created_at')
    .eq('request_id', recipient.request_id)
    .eq('owner_id', recipient.owner_id)
    .maybeSingle();

  // Owner's listings in the area
  const { data: listings } = await supabase
    .from('listings')
    .select('id, slug, title_el, title_en, guests_max, price_per_night')
    .eq('owner_id', recipient.owner_id)
    .eq('area', req.area)
    .eq('status', 'published')
    .gte('guests_max', (req.adults || 0) + (req.children || 0));

  // Owner profile (for prefilled phone)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', recipient.owner_id)
    .single();

  // Gate the guest's phone: never expose it in the GET payload unless the
  // owner has ALREADY earned it (responded available/alternative WITH a price).
  // Otherwise owners read it straight from the network response, skip the click.
  const earned =
    (existing?.status === 'available' || existing?.status === 'alternative') &&
    existing?.price != null;
  const { guest_phone, ...reqPublic } = req;
  const requestOut = earned ? { ...reqPublic, guest_phone } : reqPublic;

  return NextResponse.json({
    request: requestOut,
    existing,
    expired,
    listings: listings || [],
    owner: profile || { full_name: '', phone: '' },
  });
}

// POST: record the owner's response (available/unavailable).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));

  const status = body.status;
  if (status !== 'available' && status !== 'unavailable' && status !== 'alternative') {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
  }
  // Both available and alternative are positive offers that reveal the phone.
  const isOffer = status === 'available' || status === 'alternative';

  const supabase = createAdminClient();

  const { data: recipient } = await supabase
    .from('availability_request_recipients')
    .select('id, request_id, owner_id')
    .eq('response_token', token)
    .single();

  if (!recipient) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Block responses on closed/expired requests
  const { data: req } = await supabase
    .from('availability_requests')
    .select('id, status, expires_at, guest_phone, guest_name')
    .eq('id', recipient.request_id)
    .single();
  if (!req) return NextResponse.json({ error: 'request_gone' }, { status: 404 });
  if (
    req.status !== 'active' ||
    new Date(req.expires_at).getTime() < Date.now()
  ) {
    return NextResponse.json(
      { error: 'request_closed', message: 'Το αίτημα έχει κλείσει.' },
      { status: 410 },
    );
  }

  const price = body.price != null && body.price !== '' ? Math.max(0, Number(body.price)) : null;

  // A price is required for any positive offer — this is what unlocks the
  // guest's contact details, so we can't reveal them without it.
  if (isOffer && (price == null || Number.isNaN(price))) {
    return NextResponse.json(
      { error: 'price_required', message: 'Δώσε τιμή ανά βράδυ για να καταχωρηθεί η προσφορά.' },
      { status: 400 },
    );
  }

  // Alternative-dates offers must specify the dates the owner can actually offer.
  const isDate = (s: unknown): s is string =>
    typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const altCheckIn = isDate(body.alt_check_in) ? body.alt_check_in : null;
  const altCheckOut = isDate(body.alt_check_out) ? body.alt_check_out : null;
  if (status === 'alternative') {
    if (!altCheckIn || !altCheckOut || altCheckOut <= altCheckIn) {
      return NextResponse.json(
        { error: 'alt_dates_required', message: 'Δώσε έγκυρες εναλλακτικές ημερομηνίες (άφιξη πριν την αναχώρηση).' },
        { status: 400 },
      );
    }
  }

  const message =
    typeof body.message === 'string' ? body.message.trim().slice(0, 1500) : null;
  const contact_phone =
    typeof body.contact_phone === 'string' ? body.contact_phone.trim().slice(0, 30) : null;
  const listing_id = typeof body.listing_id === 'string' && body.listing_id ? body.listing_id : null;

  // Upsert on (request_id, owner_id)
  const { error: upErr } = await supabase
    .from('availability_responses')
    .upsert(
      {
        request_id: recipient.request_id,
        owner_id: recipient.owner_id,
        listing_id,
        status,
        price,
        message,
        contact_phone,
        alt_check_in: status === 'alternative' ? altCheckIn : null,
        alt_check_out: status === 'alternative' ? altCheckOut : null,
      },
      { onConflict: 'request_id,owner_id' },
    );

  if (upErr) {
    return NextResponse.json({ error: 'upsert_failed', detail: upErr.message }, { status: 500 });
  }

  // Recount positive offers (available + alternative) on the request row
  const { count } = await supabase
    .from('availability_responses')
    .select('id', { count: 'exact', head: true })
    .eq('request_id', recipient.request_id)
    .in('status', ['available', 'alternative']);

  await supabase
    .from('availability_requests')
    .update({ responses_count: count || 0 })
    .eq('id', recipient.request_id);

  // Send 1-shot guest notification on the first positive offer
  if (isOffer) {
    // After the response: the owner sees the guest's contact at once, whatever the mail server does.
    after(() => notifyGuestFirstResponse(supabase, recipient.request_id).catch(() => {}));
  }

  // Reveal the guest's contact details only now, as the reward for a complete
  // offer (available or alternative). Unavailable responses get nothing back.
  return NextResponse.json({
    success: true,
    guest_phone: isOffer ? req.guest_phone : null,
    guest_name: isOffer ? req.guest_name : null,
  });
}
