import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/social-kit/track  { listingId: string }
// Logs one row into social_kit_downloads. Called from the owner dashboard
// after a successful ZIP generation.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const listingId = body?.listingId;
    if (!listingId || typeof listingId !== 'string') {
      return Response.json({ ok: false, error: 'listingId required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('social_kit_downloads')
      .insert({ listing_id: listingId, user_id: user?.id ?? null });

    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
