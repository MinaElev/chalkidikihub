import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveEffectiveOwner, isAdmin } from '@/lib/pms/auth';

/** POST /api/pms/bookings/block  — manual date block (owner or admin) */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json().catch(() => ({}));
  const { listing_id, check_in, check_out, block_reason } = body;

  if (!listing_id || !check_in || !check_out) {
    return Response.json({ error: 'listing_id, check_in, check_out required' }, { status: 400 });
  }
  if (check_out <= check_in) {
    return Response.json({ error: 'check_out must be after check_in' }, { status: 400 });
  }

  const effective = await resolveEffectiveOwner(supabase, listing_id);
  if (!effective) return Response.json({ error: 'listing not yours' }, { status: 403 });

  const { data, error } = await supabase
    .from('pms_bookings')
    .insert({
      listing_id,
      owner_id: effective.ownerId,
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
  const admin = await isAdmin(supabase);

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  let q = supabase.from('pms_bookings').delete().eq('id', id).eq('status', 'blocked');
  if (!admin) q = q.eq('owner_id', user.id);
  const { error } = await q;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
