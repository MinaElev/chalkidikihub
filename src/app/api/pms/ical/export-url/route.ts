import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listingExportToken } from '@/lib/pms/ical';
import { resolveEffectiveOwner } from '@/lib/pms/auth';

/**
 * GET /api/pms/ical/export-url?listing_id=...
 *
 * Returns the HMAC-signed export token for the given listing so the
 * calendar UI can show a copy-paste URL. Owners see their own listings;
 * admins can fetch any listing's token for support.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const listingId = req.nextUrl.searchParams.get('listing_id');
  if (!listingId) return Response.json({ error: 'listing_id required' }, { status: 400 });

  const effective = await resolveEffectiveOwner(supabase, listingId);
  if (!effective) return Response.json({ error: 'unauthorized' }, { status: 403 });

  return Response.json({ token: listingExportToken(listingId) });
}
