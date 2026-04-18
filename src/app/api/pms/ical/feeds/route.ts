import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_SOURCES = ['airbnb', 'booking', 'vrbo', 'custom'] as const;

/** List the current owner's iCal feeds (optionally filtered by listing). */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const listingId = req.nextUrl.searchParams.get('listing_id');
  let query = supabase
    .from('pms_ical_feeds')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });
  if (listingId) query = query.eq('listing_id', listingId);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}

/** Add a new iCal feed. */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { listing_id, source, label, import_url } = body;
    if (!listing_id || !source || !label || !import_url) {
      return Response.json({ error: 'listing_id, source, label, import_url required' }, { status: 400 });
    }
    if (!VALID_SOURCES.includes(source)) {
      return Response.json({ error: `source must be one of ${VALID_SOURCES.join(', ')}` }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(import_url)) {
      return Response.json({ error: 'import_url must be http(s)' }, { status: 400 });
    }

    // Verify the listing belongs to this owner
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listing_id)
      .single();
    if (!listing || listing.owner_id !== user.id) {
      return Response.json({ error: 'listing not found or not yours' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('pms_ical_feeds')
      .insert({ listing_id, owner_id: user.id, source, label: label.slice(0, 120), import_url, active: true })
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
