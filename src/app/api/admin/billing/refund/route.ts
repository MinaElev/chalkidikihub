// Guard: superadmin — session + profiles.role check below.
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { refundTransaction, vivaConfig } from '@/lib/viva';
import { internalHeaders } from '@/lib/route-guards';

/**
 * Admin: refund a listing's annual payment and deactivate it. Used when a
 * paid-before-review listing is rejected. Issues a Viva refund against the
 * stored transaction, records it on billing_payments, and archives the
 * listing (plan → expired). Free activations and bank transfers (no
 * transaction id) skip Viva and are just deactivated.
 *
 * The Viva reversal webhook only logs, so this route is the one place a
 * refund deactivates a listing.
 */
export async function POST(req: NextRequest) {
  // Admin gate.
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data: profile } = await authed.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const listingId = typeof body.listing_id === 'string' ? body.listing_id : null;
  if (!listingId) return NextResponse.json({ error: 'listing_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  const svc = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Latest payment for this listing that hasn't been refunded yet.
  const { data: pay } = await svc
    .from('billing_payments')
    .select('id, stripe_payment_intent, amount_cents, refunded_at')
    .eq('listing_id', listingId)
    .order('paid_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pay?.refunded_at) return NextResponse.json({ error: 'already_refunded' }, { status: 409 });

  let refundCents = 0;
  // Real (non-free) card payment → refund via Viva. stripe_payment_intent holds
  // the Viva transactionId (column name is from the Stripe era).
  if (pay?.stripe_payment_intent && (pay.amount_cents || 0) > 0) {
    if (pay.stripe_payment_intent.startsWith('pi_')) {
      // Paid through the old Stripe integration — refund it in the Stripe dashboard.
      return NextResponse.json({ error: 'legacy_stripe_payment' }, { status: 409 });
    }
    if (!vivaConfig().merchant) return NextResponse.json({ error: 'payments_not_configured' }, { status: 500 });
    const r = await refundTransaction(pay.stripe_payment_intent, pay.amount_cents);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
    refundCents = pay.amount_cents;
  }

  // Record + deactivate (idempotent with the webhook via refunded_at).
  if (pay) {
    await svc.from('billing_payments')
      .update({ refunded_at: new Date().toISOString(), refund_amount_cents: refundCents })
      .eq('id', pay.id);
  }
  await svc.from('listings').update({ status: 'archived', plan_status: 'expired' }).eq('id', listingId);
  await svc.from('activity_logs').insert({
    type: 'user_action', severity: 'warning',
    message: `Billing: admin refund/deactivation (${refundCents / 100}€)`,
    details: { listing_id: listingId, refund_cents: refundCents, by: user.id },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  fetch(`${baseUrl}/api/billing/notify-refund`, {
    method: 'POST', headers: internalHeaders(),
    body: JSON.stringify({ listing_id: listingId, kind: 'refund', amount_cents: refundCents }),
  }).catch(() => {});

  return NextResponse.json({ ok: true, refund_cents: refundCents });
}
