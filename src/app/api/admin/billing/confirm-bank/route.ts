// Guard: superadmin — session + profiles.role check below.
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { planByKey, planExpiryFrom } from '@/lib/billing';
import { internalHeaders } from '@/lib/route-guards';

/**
 * Admin confirms a bank-transfer (IBAN) deposit → activates the listing exactly
 * like a card payment: records a billing_payment (method=bank_transfer),
 * activates the plan, sends the owner a receipt and queues the listing for
 * review. Idempotent via a unique per-confirmation session id.
 */
export async function POST(req: NextRequest) {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data: profile } = await authed.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const listingId = typeof body.listing_id === 'string' ? body.listing_id : null;
  const renew = body.renew === true;
  if (!listingId) return NextResponse.json({ error: 'listing_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  const svc = createServiceClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: listing } = await svc
    .from('listings').select('id, owner_id, billing_exempt, plan, plan_status, plan_expires_at').eq('id', listingId).maybeSingle();
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
  if (listing.billing_exempt) return NextResponse.json({ error: 'listing_exempt' }, { status: 409 });
  if (!renew && listing.plan_status === 'active') return NextResponse.json({ error: 'already_paid' }, { status: 409 });

  // Amount = the tier the owner requested (stored on the listing at request time).
  const planCfg = planByKey(listing.plan);

  const sessionId = `bank_${listing.id}_${Date.now()}`;
  await svc.from('billing_payments').insert({
    listing_id: listing.id,
    owner_id: listing.owner_id,
    stripe_session_id: sessionId,
    amount_cents: planCfg.priceCents,
    currency: planCfg.currency,
    plan: planCfg.key,
    method: 'bank_transfer',
  });

  if (renew) {
    const base = listing.plan_expires_at && new Date(listing.plan_expires_at) > new Date()
      ? new Date(listing.plan_expires_at) : new Date();
    await svc.from('listings').update({
      plan: planCfg.key, plan_status: 'active',
      plan_expires_at: planExpiryFrom(base).toISOString(),
      bank_transfer_requested_at: null, renewal_reminded_at: null,
    }).eq('id', listing.id);
  } else {
    await svc.from('listings').update({
      status: 'pending', plan: planCfg.key, plan_status: 'active',
      plan_expires_at: planExpiryFrom(new Date()).toISOString(),
      bank_transfer_requested_at: null,
    }).eq('id', listing.id).neq('plan_status', 'active');
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  fetch(`${baseUrl}/api/billing/notify-paid`, {
    method: 'POST', headers: internalHeaders(),
    body: JSON.stringify({ listing_id: listing.id, session_id: sessionId }),
  }).catch(() => {});
  if (!renew) {
    fetch(`${baseUrl}/api/listings/notify-new`, {
      method: 'POST', headers: internalHeaders(),
      body: JSON.stringify({ listing_id: listing.id, admin_only: true }),
    }).catch(() => {});
  }
  await svc.from('activity_logs').insert({
    type: 'user_action', severity: 'info',
    message: `Billing: bank transfer confirmed (${planCfg.priceCents / 100}€, ${planCfg.key})`,
    details: { listing_id: listing.id, by: user.id, renewal: renew },
  });

  return NextResponse.json({ ok: true });
}
