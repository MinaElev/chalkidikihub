import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

// Guest dashboard data — token in URL is the auth.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!token || token.length < 16) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: req } = await supabase
    .from('availability_requests')
    .select(
      'id, public_token, guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children, budget_min, budget_max, property_type, notes, status, recipients_count, responses_count, created_at, closed_at, expires_at',
    )
    .eq('public_token', token)
    .single();

  if (!req) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Auto-expire on read
  if (req.status === 'active' && new Date(req.expires_at).getTime() < Date.now()) {
    await supabase
      .from('availability_requests')
      .update({ status: 'expired' })
      .eq('id', req.id);
    req.status = 'expired';
  }

  // Load responses (positive first)
  const { data: responses } = await supabase
    .from('availability_responses')
    .select(
      'id, status, price, message, contact_phone, created_at, owner_id, listing_id, listings(slug, title_el, title_en, location_name)',
    )
    .eq('request_id', req.id)
    .order('created_at', { ascending: false });

  // Owner names
  const ownerIds = Array.from(new Set((responses || []).map(r => r.owner_id)));
  const nameMap: Record<string, string> = {};
  if (ownerIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', ownerIds);
    for (const p of profiles || []) nameMap[p.id] = p.full_name;
  }

  type RespRow = {
    id: string;
    status: string;
    price: number | null;
    message: string | null;
    contact_phone: string | null;
    created_at: string;
    owner_id: string;
    listing_id: string | null;
    listings: { slug: string; title_el: string; title_en: string; location_name: string } | null;
  };

  const decorated = (responses || []).map(r => {
    const rr = r as unknown as RespRow;
    return {
      ...rr,
      owner_name: nameMap[rr.owner_id] || 'Ιδιοκτήτης',
    };
  });

  return NextResponse.json({ request: req, responses: decorated });
}

// Guest closes the request (no more notifications fire on it).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  if (body.action !== 'close') {
    return NextResponse.json({ error: 'unknown_action' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('availability_requests')
    .update({ status: 'closed', closed_at: new Date().toISOString() })
    .eq('public_token', token)
    .eq('status', 'active')
    .select('id')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'not_found_or_already_closed' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
