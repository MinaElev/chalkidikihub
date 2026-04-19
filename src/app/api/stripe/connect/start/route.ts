import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripeConnectAuthorizeUrl, randomState } from '@/lib/pms/stripe';

/**
 * Begin the Stripe Connect OAuth flow for the signed-in owner.
 * Generates a CSRF state, stores it in pms_owner_settings, and 302s
 * to Stripe's authorize URL.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'stripe_not_configured', hint: 'Set STRIPE_CONNECT_CLIENT_ID env var.' }, { status: 500 });
  }

  const state = randomState();
  const { error: upErr } = await supabase
    .from('pms_owner_settings')
    .upsert({ owner_id: user.id, stripe_connect_state: state }, { onConflict: 'owner_id' });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/stripe/connect/callback`;
  const authorize = stripeConnectAuthorizeUrl({ clientId, redirectUri, state });

  return NextResponse.redirect(authorize);
}
