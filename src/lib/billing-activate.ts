import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { planExpiryFrom } from '@/lib/billing';
import { internalHeaders } from '@/lib/route-guards';
import { decodeBillingRef, type VivaTransaction } from '@/lib/viva';

/**
 * Apply a verified, paid Viva transaction to a listing's billing.
 *
 * Called from BOTH the Viva webhook and the browser return route — whichever
 * lands first does the work. billing_payments.stripe_session_id is UNIQUE and
 * holds the Viva orderCode, so the second caller hits the unique constraint and
 * is a no-op. (Column names are from the Stripe era: stripe_session_id = Viva
 * orderCode, stripe_payment_intent = Viva transactionId.)
 *
 * `tx` must come from retrieveTransaction() — never from request data.
 */
export async function applyPaidTransaction(
  svc: SupabaseClient,
  tx: VivaTransaction,
  baseUrl: string,
): Promise<{ ok: true; listingId: string; duplicate: boolean } | { ok: false; error: string }> {
  if (tx.statusId !== 'F') return { ok: false, error: `not_paid_${tx.statusId || 'unknown'}` };
  if (tx.currencyCode && tx.currencyCode !== '978') return { ok: false, error: 'wrong_currency' };
  if (!tx.orderCode) return { ok: false, error: 'no_order_code' };
  const ref = decodeBillingRef(tx.merchantTrns);
  if (!ref) return { ok: false, error: 'not_listing_billing' };

  const { error: payErr } = await svc.from('billing_payments').insert({
    listing_id: ref.listingId,
    owner_id: ref.ownerId || null,
    stripe_session_id: tx.orderCode,
    stripe_payment_intent: tx.transactionId,
    amount_cents: tx.amountCents,
    currency: 'eur',
    plan: ref.plan,
    method: 'card',
    discount_code: ref.discountCode,
    discount_cents: ref.discountCents,
  });
  const duplicate = Boolean(payErr && /duplicate|unique/i.test(payErr.message));
  if (payErr && !duplicate) return { ok: false, error: payErr.message };
  if (duplicate) return { ok: true, listingId: ref.listingId, duplicate: true };

  if (ref.renewal) {
    // Renewal: extend the plan from the later of now / current expiry. A live
    // (active / past_due) listing keeps its status; a lapsed one was archived
    // by the cron, so it goes back to review instead of staying offline.
    const { data: cur } = await svc
      .from('listings').select('plan_expires_at, plan_status').eq('id', ref.listingId).maybeSingle();
    const base = cur?.plan_expires_at && new Date(cur.plan_expires_at) > new Date()
      ? new Date(cur.plan_expires_at) : new Date();
    await svc.from('listings').update({
      plan: ref.plan,
      plan_status: 'active',
      plan_expires_at: planExpiryFrom(base).toISOString(),
      renewal_reminded_at: null,
      ...(cur?.plan_status === 'expired' ? { status: 'pending' } : {}),
    }).eq('id', ref.listingId);
  } else {
    // New listing: activate the plan and move into admin review.
    // Guard on plan_status so a retry can't reactivate a published one.
    await svc.from('listings').update({
      status: 'pending',
      plan: ref.plan,
      plan_status: 'active',
      plan_expires_at: planExpiryFrom(new Date()).toISOString(),
    }).eq('id', ref.listingId).neq('plan_status', 'active');
  }

  // Count the redemption only now that the payment actually succeeded.
  if (ref.discountCode) {
    const { data: dc } = await svc
      .from('discount_codes').select('times_redeemed').eq('code', ref.discountCode).maybeSingle();
    if (dc) {
      await svc.from('discount_codes')
        .update({ times_redeemed: (dc.times_redeemed || 0) + 1 })
        .eq('code', ref.discountCode);
    }
  }

  // Owner receipt (both new + renewal).
  fetch(`${baseUrl}/api/billing/notify-paid`, {
    method: 'POST', headers: internalHeaders(),
    body: JSON.stringify({ listing_id: ref.listingId, session_id: tx.orderCode }),
  }).catch((e) => { console.error('billing receipt failed', e); });
  // Admin "new paid listing to review" — only for brand-new listings.
  if (!ref.renewal) {
    fetch(`${baseUrl}/api/listings/notify-new`, {
      method: 'POST', headers: internalHeaders(),
      body: JSON.stringify({ listing_id: ref.listingId, admin_only: true }),
    }).catch((e) => { console.error('billing notify-new failed', e); });
  }

  await svc.from('activity_logs').insert({
    type: 'user_action', severity: 'info',
    message: `Billing: ${ref.renewal ? 'renewal' : 'new'} payment ${tx.amountCents / 100}€ (Viva)`,
    details: { listing_id: ref.listingId, order_code: tx.orderCode, transaction_id: tx.transactionId, discount_code: ref.discountCode, renewal: ref.renewal },
  });

  return { ok: true, listingId: ref.listingId, duplicate: false };
}
