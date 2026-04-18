import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resolveEffectiveOwner, isAdmin } from '@/lib/pms/auth';

const VALID_SOURCES = ['airbnb', 'booking', 'vrbo', 'custom'] as const;

/** List iCal feeds. Owner sees own feeds; admin sees all (optionally per listing). */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const listingId = req.nextUrl.searchParams.get('listing_id');
  const admin = await isAdmin(supabase);

  let query = supabase
    .from('pms_ical_feeds')
    .select('*')
    .order('created_at', { ascending: false });
  if (!admin) query = query.eq('owner_id', user.id);
  if (listingId) query = query.eq('listing_id', listingId);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}

/** Add a new iCal feed. Admins act on behalf of the real listing owner. */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
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

    const effective = await resolveEffectiveOwner(supabase, listing_id);
    if (!effective) return Response.json({ error: 'listing not found or not yours' }, { status: 403 });

    const { data, error } = await supabase
      .from('pms_ical_feeds')
      .insert({
        listing_id,
        owner_id: effective.ownerId,
        source,
        label: label.slice(0, 120),
        import_url,
        active: true,
      })
      .select()
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
