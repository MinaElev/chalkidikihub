import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listingExportToken } from '@/lib/pms/ical';

/**
 * GET /api/pms/ical/export-url?listing_id=...
 *
 * Returns the HMAC-signed export token for the given listing so the
 * calendar UI can show the owner a copy-paste URL. Only the listing
 * owner can retrieve it — the token itself is deterministic from
 * (listingId, PMS_ICAL_SECRET) so we can always regenerate it.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const listingId = req.nextUrl.searchParams.get('listing_id');
  if (!listingId) return Response.json({ error: 'listing_id required' }, { status: 400 });

  const { data: listing } = await supabase
    .from('listings')
    .select('owner_id')
    .eq('id', listingId)
    .single();
  if (!listing || listing.owner_id !== user.id) {
    return Response.json({ error: 'listing not yours' }, { status: 403 });
  }

  return Response.json({ token: listingExportToken(listingId) });
}
