import { NextRequest, NextResponse } from 'next/server';
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
    .select('status, price, message, contact_phone, created_at')
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

  return NextResponse.json({
    request: req,
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
  if (status !== 'available' && status !== 'unavailable') {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
  }

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
    .select('id, status, expires_at')
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
      },
      { onConflict: 'request_id,owner_id' },
    );

  if (upErr) {
    return NextResponse.json({ error: 'upsert_failed', detail: upErr.message }, { status: 500 });
  }

  // Recount on the request row
  const { count } = await supabase
    .from('availability_responses')
    .select('id', { count: 'exact', head: true })
    .eq('request_id', recipient.request_id)
    .eq('status', 'available');

  await supabase
    .from('availability_requests')
    .update({ responses_count: count || 0 })
    .eq('id', recipient.request_id);

  // Send 1-shot guest notification on the first response (any status)
  if (status === 'available') {
    await notifyGuestFirstResponse(supabase, recipient.request_id).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
