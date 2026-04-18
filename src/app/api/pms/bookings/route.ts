import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/pms/bookings
 *   ?listing_id=...     filter to one listing (else all owner's listings)
 *   ?from=YYYY-MM-DD    check_out >= from
 *   ?to=YYYY-MM-DD      check_in  <  to
 *   ?status=confirmed,blocked   (comma-separated)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  let query = supabase
    .from('pms_bookings')
    .select('id, listing_id, status, source, external_id, check_in, check_out, guest_name, guest_email, num_guests, total_amount, payment_status, block_reason, notes, created_at')
    .eq('owner_id', user.id)
    .order('check_in', { ascending: true });

  const listingId = sp.get('listing_id');
  if (listingId) query = query.eq('listing_id', listingId);

  const from = sp.get('from');
  if (from) query = query.gte('check_out', from);

  const to = sp.get('to');
  if (to) query = query.lt('check_in', to);

  const statuses = sp.get('status');
  if (statuses) query = query.in('status', statuses.split(','));
  else query = query.neq('status', 'cancelled');

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}
