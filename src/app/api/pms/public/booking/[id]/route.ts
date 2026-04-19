import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

/**
 * Public booking lookup for the confirmation page.
 * No auth — guest only has the UUID. UUIDs are unguessable (RFC 4122 v4),
 * so serving the booking summary to anyone who holds the ID is the same
 * trust model as a Stripe receipt link.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: booking, error } = await supabase
    .from('pms_bookings')
    .select('id, listing_id, status, source, guest_name, guest_email, check_in, check_out, num_guests, total_amount, currency, payment_status, created_at')
    .eq('id', id)
    .eq('source', 'direct')  // only expose direct bookings via this endpoint
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!booking) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const { data: listing } = await supabase
    .from('listings')
    .select('slug, title_el, title_en, area, contact_phone, contact_email')
    .eq('id', booking.listing_id)
    .maybeSingle();

  return NextResponse.json({ booking, listing });
}
