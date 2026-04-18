import { NextRequest } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { generateIcal, verifyListingExportToken } from '@/lib/pms/ical';

/**
 * Public iCal export — the URL the owner hands to Airbnb / Booking / VRBO.
 *
 * Auth via HMAC token (see listingExportToken in @/lib/pms/ical). No DB
 * column needed — deterministic + secret-gated.
 *
 * Uses service-role key because external platforms fetch this anonymously.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ listingId: string; token: string }> }
) {
  const { listingId, token } = await params;
  const cleanToken = token.replace(/\.ics$/, '');

  if (!verifyListingExportToken(listingId, cleanToken)) {
    return new Response('invalid token', { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return new Response('service not configured', { status: 500 });
  }
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [{ data: listing }, { data: bookings }] = await Promise.all([
    supabase.from('listings').select('title_el, title_en, slug').eq('id', listingId).single(),
    supabase
      .from('pms_bookings')
      .select('id, check_in, check_out, status, source, guest_name, notes, block_reason')
      .eq('listing_id', listingId)
      .neq('status', 'cancelled')
      .gte('check_out', new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10))
      .order('check_in'),
  ]);

  if (!listing) return new Response('listing not found', { status: 404 });
  const calName = `${listing.title_el || listing.title_en || listing.slug} — ChalkidikiHub`;
  const ics = generateIcal(bookings || [], calName);

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${listing.slug}.ics"`,
      'Cache-Control': 'public, max-age=300',  // 5-minute CDN cache — external platforms poll every 1-4h
    },
  });
}
