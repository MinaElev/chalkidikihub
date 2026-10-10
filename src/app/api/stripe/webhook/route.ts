// Guard: Stripe signature verification (stripe-signature header).
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { verifyStripeSignature } from '@/lib/pms/stripe';
import { planExpiryFrom } from '@/lib/billing';
import { internalHeaders } from '@/lib/route-guards';

/**
 * Stripe webhook endpoint. Handles `checkout.session.completed` for two
 * distinct payment kinds, discriminated by `metadata.kind`:
 *   • listing_billing → a NEW listing's annual package was paid. Flip the
 *     listing from pending_payment → pending (enters admin review), mark the
 *     plan active, and log the payment.
 *   • (default) PMS booking deposit → flip pms_bookings.payment_status to
 *     deposit_paid and record the paid amount.
 *
 * Signature verification is mandatory — unsigned / malformed webhooks are
 * rejected with 400. See lib/pms/stripe.ts for the HMAC impl.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'webhook_not_configured' }, { status: 500 });

  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');
  const check = await verifyStripeSignature(rawBody, sig, secret);
  if (!check.ok) return NextResponse.json({ error: check.error || 'invalid_signature' }, { status: 400 });

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }
  const supabase = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      id: string;
      amount_total?: number;
      currency?: string;
      payment_status?: string;
      payment_intent?: string;
      metadata?: Record<string, string>;
      payment_method_types?: string[];
      client_reference_id?: string;
    };

    // ── Listing billing: a new listing's annual package was paid ──
    if (session.metadata?.kind === 'listing_billing') {
      const listingId = session.metadata.listing_id || session.client_reference_id;
      const ownerId = session.metadata.owner_id || null;
      if (listingId) {
        const discountCode = session.metadata.discount_code || null;
        const discountCents = Number(session.metadata.discount_cents || 0) || 0;
        const isRenewal = session.metadata.renewal === '1';

        // Idempotent audit insert — stripe_session_id is UNIQUE, so a webhook
        // retry (Stripe delivers at-least-once) is silently ignored.
        const { error: payErr } = await supabase.from('billing_payments').insert({
          listing_id: listingId,
          owner_id: ownerId,
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent ?? null,
          amount_cents: session.amount_total ?? 0,
          currency: (session.currency || 'eur').toLowerCase(),
          plan: session.metadata.plan || 'annual',
          method: 'card',
          discount_code: discountCode,
          discount_cents: discountCents,
        });
        const duplicate = payErr && /duplicate|unique/i.test(payErr.message);

        // Only act on the FIRST delivery.
        if (!duplicate) {
          if (isRenewal) {
            // Renewal of a live listing: extend the plan, DON'T touch status
            // (it stays published). Extend from the later of now / current expiry.
            const { data: cur } = await supabase
              .from('listings').select('plan_expires_at').eq('id', listingId).maybeSingle();
            const base = cur?.plan_expires_at && new Date(cur.plan_expires_at) > new Date()
              ? new Date(cur.plan_expires_at) : new Date();
            await supabase.from('listings').update({
              plan: session.metadata.plan || 'annual',
              plan_status: 'active',
              plan_expires_at: planExpiryFrom(base).toISOString(),
              renewal_reminded_at: null,
            }).eq('id', listingId);
          } else {
            // New listing: activate the plan and move into admin review.
            // Guard on plan_status so a retry can't reactivate a published one.
            await supabase.from('listings').update({
              status: 'pending',
              plan: session.metadata.plan || 'annual',
              plan_status: 'active',
              plan_expires_at: planExpiryFrom(new Date()).toISOString(),
            }).eq('id', listingId).neq('plan_status', 'active');
          }

          // Count the redemption only now that the payment actually succeeded
          // (abandoned discounted checkouts never reach here).
          if (discountCode) {
            const { data: dc } = await supabase
              .from('discount_codes').select('times_redeemed').eq('code', discountCode).maybeSingle();
            if (dc) {
              await supabase.from('discount_codes')
                .update({ times_redeemed: (dc.times_redeemed || 0) + 1 })
                .eq('code', discountCode);
            }
          }

          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
          // Owner receipt (both new + renewal).
          fetch(`${baseUrl}/api/billing/notify-paid`, {
            method: 'POST', headers: internalHeaders(),
            body: JSON.stringify({ listing_id: listingId, session_id: session.id }),
          }).catch((e) => { console.error('billing receipt failed', e); });
          // Admin "new paid listing to review" — only for brand-new listings.
          if (!isRenewal) {
            fetch(`${baseUrl}/api/listings/notify-new`, {
              method: 'POST', headers: internalHeaders(),
              body: JSON.stringify({ listing_id: listingId, admin_only: true }),
            }).catch((e) => { console.error('billing notify-new failed', e); });
          }

          await supabase.from('activity_logs').insert({
            type: 'user_action', severity: 'info',
            message: `Billing: ${isRenewal ? 'renewal' : 'new'} payment ${(session.amount_total ?? 0) / 100}€`,
            details: { listing_id: listingId, session_id: session.id, discount_code: discountCode, renewal: isRenewal },
          });
        }
      }
      return NextResponse.json({ received: true });
    }

    // ── PMS booking deposit (default) ──
    const bookingId = session.metadata?.booking_id || session.client_reference_id;
    if (bookingId) {
      const paidAmount = session.amount_total ? session.amount_total / 100 : null;
      await supabase
        .from('pms_bookings')
        .update({
          payment_status: 'deposit_paid',
          stripe_paid_amount: paidAmount,
          stripe_payment_method: session.payment_method_types?.[0] || 'card',
          stripe_checkout_session_id: session.id,
        })
        .eq('id', bookingId);
    }
  }

  // ── Money flowing back: refund or dispute/chargeback ──
  // Map the charge back to our payment via payment_intent, then deactivate the
  // listing (unpublish + expire the plan). The admin refund endpoint triggers
  // the refund; this makes the effect land even when a refund/dispute is issued
  // straight from the Stripe dashboard.
  if (event.type === 'charge.refunded' || event.type === 'charge.dispute.created') {
    const obj = event.data.object as {
      payment_intent?: string; amount_refunded?: number; amount?: number;
    };
    const pi = obj.payment_intent;
    if (pi) {
      const { data: pay } = await supabase
        .from('billing_payments')
        .select('listing_id, refunded_at')
        .eq('stripe_payment_intent', pi)
        .maybeSingle();
      if (pay?.listing_id && !pay.refunded_at) {
        const refundCents = obj.amount_refunded ?? obj.amount ?? 0;
        await supabase.from('billing_payments').update({
          refunded_at: new Date().toISOString(),
          refund_amount_cents: refundCents,
        }).eq('stripe_payment_intent', pi);

        await supabase.from('listings').update({
          status: 'archived', plan_status: 'expired',
        }).eq('id', pay.listing_id);

        await supabase.from('activity_logs').insert({
          type: 'user_action', severity: 'warning',
          message: `Billing: ${event.type === 'charge.refunded' ? 'refund' : 'dispute'} — listing deactivated`,
          details: { listing_id: pay.listing_id, payment_intent: pi, refund_cents: refundCents },
        });

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
        fetch(`${baseUrl}/api/billing/notify-refund`, {
          method: 'POST', headers: internalHeaders(),
          body: JSON.stringify({ listing_id: pay.listing_id, kind: event.type === 'charge.refunded' ? 'refund' : 'dispute', amount_cents: refundCents }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
