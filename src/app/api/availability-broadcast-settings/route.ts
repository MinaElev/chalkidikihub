import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/api-helpers';

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

async function requireOwner(): Promise<{ userId: string } | NextResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return { userId: user.id };
}

export async function GET() {
  const auth = await requireOwner();
  if (auth instanceof NextResponse) return auth;

  const admin = createAdminClient();
  const { data } = await admin
    .from('owner_broadcast_settings')
    .select('opted_out, max_per_week, areas')
    .eq('owner_id', auth.userId)
    .maybeSingle();

  // Stats — broadcasts received last 7 days
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { count: weekCount } = await admin
    .from('availability_request_recipients')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', auth.userId)
    .gte('sent_at', weekAgo);

  return NextResponse.json({
    settings: data || { opted_out: false, max_per_week: 10, areas: null },
    stats: { received_last_week: weekCount || 0 },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireOwner();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const opted_out = !!body.opted_out;
  const max_per_week = Math.max(0, Math.min(50, parseInt(body.max_per_week, 10) || 10));
  const areas = Array.isArray(body.areas)
    ? body.areas.filter((a: string) => AREAS.includes(a))
    : null;

  const admin = createAdminClient();
  const { error } = await admin
    .from('owner_broadcast_settings')
    .upsert(
      {
        owner_id: auth.userId,
        opted_out,
        max_per_week,
        areas: areas && areas.length > 0 ? areas : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'owner_id' },
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
