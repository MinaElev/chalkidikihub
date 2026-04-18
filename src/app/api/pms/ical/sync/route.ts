import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncFeed } from '@/lib/pms/ical-sync';

/** POST /api/pms/ical/sync  { feedId } — manual sync trigger by owner */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { feedId } = body;
  if (!feedId) return Response.json({ error: 'feedId required' }, { status: 400 });

  const { data: feed, error } = await supabase
    .from('pms_ical_feeds')
    .select('id, listing_id, owner_id, source, import_url, active')
    .eq('id', feedId)
    .eq('owner_id', user.id)
    .single();
  if (error || !feed) return Response.json({ error: 'feed not found' }, { status: 404 });
  if (!feed.active) return Response.json({ error: 'feed is disabled' }, { status: 400 });

  const result = await syncFeed(supabase, feed);
  return Response.json(result);
}
