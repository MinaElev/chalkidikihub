import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** POST /api/pms/bookings/block  — owner blocks a date range manually */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { listing_id, check_in, check_out, block_reason } = body;
  if (!listing_id || !check_in || !check_out) {
    return Response.json({ error: 'listing_id, check_in, check_out required' }, { status: 400 });
  }
  if (check_out <= check_in) {
    return Response.json({ error: 'check_out must be after check_in' }, { status: 400 });
  }

  // Ownership check
  const { data: listing } = await supabase.from('listings').select('owner_id').eq('id', listing_id).single();
  if (!listing || listing.owner_id !== user.id) {
    return Response.json({ error: 'listing not yours' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('pms_bookings')
    .insert({
      listing_id,
      owner_id: user.id,
      status: 'blocked',
      source: 'blocked',
      check_in,
      check_out,
      block_reason: block_reason?.slice(0, 500) || null,
      payment_status: 'na',
    })
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

/** DELETE /api/pms/bookings/block?id=... — unblock */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase
    .from('pms_bookings')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)
    .eq('status', 'blocked');
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
