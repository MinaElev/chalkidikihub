// Guard: signed-in user; read-only code lookup.
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import {
  applyDiscount, isCodeRedeemable, normalizeCode, planByKey, type DiscountCode,
} from '@/lib/billing';

/**
 * Validate a discount code and return what it does to the annual price, so the
 * owner sees "−20% → €72" (or "Free!") BEFORE paying. Read-only, no redemption.
 *
 * discount_codes is admin-only under RLS, so owners can't look codes up from the
 * client — this endpoint does it with the service role, gated behind a login.
 */
export async function POST(req: NextRequest) {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const code = normalizeCode(typeof body.code === 'string' ? body.code : '');
  const plan = planByKey(body.plan);
  if (!code) return NextResponse.json({ valid: false, reason: 'empty' });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  const svc = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: dc } = await svc
    .from('discount_codes')
    .select('code, kind, value, active, max_redemptions, times_redeemed, expires_at')
    .eq('code', code)
    .maybeSingle();

  if (!dc || !isCodeRedeemable(dc as DiscountCode)) {
    return NextResponse.json({ valid: false, reason: 'invalid' });
  }

  const finalCents = applyDiscount(plan.priceCents, dc as DiscountCode);
  return NextResponse.json({
    valid: true,
    code: dc.code,
    kind: dc.kind,
    value: dc.value,
    finalCents,
    discountCents: plan.priceCents - finalCents,
    free: finalCents <= 0,
  });
}
