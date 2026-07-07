import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';

// The Make.com scenario that formats & posts the deal to Facebook.
// Overridable via env (set in Vercel → Settings → Environment Variables);
// falls back to the URL that migration 049 used, so it works out of the box.
const MAKE_WEBHOOK_URL =
  process.env.MAKE_LMD_WEBHOOK_URL ||
  'https://hook.eu1.make.com/89v9ezb98ep7elmljj6ubp6kty3rlgdd';

/**
 * Fire the Make.com → Facebook webhook for a newly-created last-minute deal.
 *
 * Originally this ran as a Supabase DB trigger (pg_net, migration 049), but that
 * path needs Supabase Webhooks / pg_net enabled on the project — which was never
 * done in production, so no deal ever reached Make. This Vercel route does the
 * same job from app code: the owner dashboard calls it right after inserting a
 * deal. Server-side keeps the Make URL out of the client, and we reuse the exact
 * Supabase-webhook payload shape the Make scenario already expects — so the Make
 * side needs no changes.
 */
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: deal, error } = await supabase
      .from('last_minute_deals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Only announce live deals that carry a ready-to-post caption.
    if (deal.status !== 'active' || !deal.fb_message) {
      return NextResponse.json({ success: true, skipped: 'not_active_or_no_message' });
    }

    // Same envelope a Supabase DB webhook would send → Make needs no changes.
    const payload = {
      type: 'INSERT',
      table: 'last_minute_deals',
      schema: 'public',
      record: deal,
      old_record: null,
    };

    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const ok = res.ok;

    await supabase.from('activity_logs').insert({
      type: 'user_action',
      severity: ok ? 'info' : 'error',
      message: ok
        ? `Last-minute deal announced to Facebook via Make (listing ${deal.listing_id})`
        : `Last-minute deal FB announce FAILED — Make returned ${res.status}`,
      details: { deal_id: deal.id, listing_id: deal.listing_id, make_status: res.status },
    });

    if (!ok) {
      return NextResponse.json({ error: 'make_webhook_failed', status: res.status }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
