import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/pms/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const admin = await isAdmin(supabase);

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.label === 'string')      patch.label = body.label.slice(0, 120);
  if (typeof body.import_url === 'string') patch.import_url = body.import_url;
  if (typeof body.active === 'boolean')    patch.active = body.active;
  if (Object.keys(patch).length === 0) return Response.json({ error: 'nothing to update' }, { status: 400 });

  let q = supabase.from('pms_ical_feeds').update(patch).eq('id', id);
  if (!admin) q = q.eq('owner_id', user.id);
  const { data, error } = await q.select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const admin = await isAdmin(supabase);

  // Keep the synced bookings but cancel them so they stop blocking the
  // calendar. Cleaner than cascade-delete.
  let feedQ = supabase.from('pms_ical_feeds').select('listing_id, source').eq('id', id);
  if (!admin) feedQ = feedQ.eq('owner_id', user.id);
  const { data: feed } = await feedQ.single();
  if (feed) {
    await supabase
      .from('pms_bookings')
      .update({ status: 'cancelled' })
      .eq('listing_id', feed.listing_id)
      .eq('source', feed.source)
      .neq('status', 'cancelled');
  }

  let delQ = supabase.from('pms_ical_feeds').delete().eq('id', id);
  if (!admin) delQ = delQ.eq('owner_id', user.id);
  const { error } = await delQ;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
