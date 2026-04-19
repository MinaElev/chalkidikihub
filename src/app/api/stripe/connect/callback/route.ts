import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { stripeFetch, STRIPE_OAUTH_TOKEN } from '@/lib/pms/stripe';

/**
 * Stripe Connect OAuth return URL. Stripe sends `code` (one-shot auth
 * code) + `state` (the CSRF token we stashed). We exchange the code for
 * a Stripe account ID and save it on pms_owner_settings.
 *
 * Stripe lets any user hit this URL, so we:
 *   1. Find the owner with matching stripe_connect_state (service client)
 *   2. Exchange code → account ID
 *   3. Clear the state so it can't be replayed
 *   4. Redirect back to the settings page with a status param
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const code = sp.get('code');
  const state = sp.get('state');
  const err = sp.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const backTo = (status: string) => NextResponse.redirect(`${baseUrl}/el/dashboard/pms/settings?stripe=${status}`);

  if (err) return backTo(`error_${err}`);
  if (!code || !state) return backTo('missing_params');

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) return backTo('service_not_configured');
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: owner } = await supabase
    .from('pms_owner_settings')
    .select('owner_id')
    .eq('stripe_connect_state', state)
    .maybeSingle();
  if (!owner) return backTo('invalid_state');

  const result = await stripeFetch<{ stripe_user_id?: string; error?: string }>(
    STRIPE_OAUTH_TOKEN,
    { method: 'POST', body: { grant_type: 'authorization_code', code } },
  );
  if (!result.ok || !result.data?.stripe_user_id) {
    return backTo(`stripe_error_${result.error || 'unknown'}`);
  }

  const { error: updErr } = await supabase
    .from('pms_owner_settings')
    .update({
      stripe_account_id: result.data.stripe_user_id,
      stripe_onboarded: true,
      stripe_connect_state: null,
    })
    .eq('owner_id', owner.owner_id);
  if (updErr) return backTo(`db_error_${updErr.message}`);

  return backTo('connected');
}
