import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.label === 'string')      patch.label = body.label.slice(0, 120);
  if (typeof body.import_url === 'string') patch.import_url = body.import_url;
  if (typeof body.active === 'boolean')    patch.active = body.active;
  if (Object.keys(patch).length === 0) return Response.json({ error: 'nothing to update' }, { status: 400 });

  const { data, error } = await supabase
    .from('pms_ical_feeds')
    .update(patch)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  // Keep the synced bookings (owner may want them as historical records) but
  // cancel them so they stop blocking the calendar. Cleaner than cascade-delete
  // which would also wipe any manual edits made via the bookings screen later.
  const { data: feed } = await supabase
    .from('pms_ical_feeds')
    .select('listing_id, source')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();
  if (feed) {
    await supabase
      .from('pms_bookings')
      .update({ status: 'cancelled' })
      .eq('listing_id', feed.listing_id)
      .eq('source', feed.source)
      .neq('status', 'cancelled');
  }

  const { error } = await supabase
    .from('pms_ical_feeds')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
