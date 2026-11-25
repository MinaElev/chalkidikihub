// Guard: signed-in owner of the listing (checked below).
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { checkoutUrl, createOrder, encodeBillingRef, vivaConfig } from '@/lib/viva';
import { internalHeaders } from '@/lib/route-guards';
import {
  applyDiscount, isCodeRedeemable, normalizeCode, planExpiryFrom, planByKey,
  type DiscountCode,
} from '@/lib/billing';

/**
 * Start a Viva Smart Checkout payment for a listing's annual package (new or
 * renewal) — optionally with an admin-issued discount code applied.
 *
 * Flow ("pay-before-review"): the owner submitted a listing which the DB gate
 * put in status='pending_payment'. A discount is just a smaller order amount.
 * A code that zeroes the price (free / 100% / fixed ≥ price) activates the
 * listing immediately, with no Viva round-trip.
 *
 * On a paid order, the Viva webhook / return route (lib/billing-activate.ts)
 * flips the listing to 'pending' (admin review) and logs the payment; here we
 * only do that for the free path.
 */
export async function POST(req: NextRequest) {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const listingId = typeof body.listing_id === 'string' ? body.listing_id : null;
  const rawCode = typeof body.code === 'string' ? body.code : '';
  const renew = body.renew === true;
  const plan = planByKey(body.plan);   // 'annual' (default) or 'premium'
  if (!listingId) return NextResponse.json({ error: 'listing_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  }

  const svc = createServiceClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Validate the listing is this owner's and in a state we can charge.
  const { data: listing } = await svc
    .from('listings')
    .select('id, owner_id, title_el, slug, status, billing_exempt, plan_status, plan_expires_at, image_url')
    .eq('id', listingId)
    .maybeSingle();
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
  if (listing.owner_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (listing.billing_exempt) return NextResponse.json({ error: 'listing_exempt' }, { status: 409 });

  if (renew) {
    // Renewal extends an already-paid listing's window (near expiry / past due /
    // lapsed). Nothing to renew if it was never on a paid plan.
    if (!['active', 'past_due', 'expired'].includes(listing.plan_status)) {
      return NextResponse.json({ error: 'not_renewable', plan_status: listing.plan_status }, { status: 409 });
    }
  } else {
    if (listing.plan_status === 'active') return NextResponse.json({ error: 'already_paid' }, { status: 409 });
    // Payable = not yet live/terminal. 'pending_payment' is the normal owner path;
    // 'pending'/'draft' cover admin-created listings (admins bypass the billing
    // trigger that would otherwise force 'pending_payment').
    if (!['pending_payment', 'pending', 'draft'].includes(listing.status)) {
      return NextResponse.json({ error: 'not_payable', status: listing.status }, { status: 409 });
    }
  }

  // Optional discount code — validate against our table (service role).
  let discount: DiscountCode | null = null;
  const code = normalizeCode(rawCode);
  if (code) {
    const { data: dc } = await svc
      .from('discount_codes')
      .select('code, kind, value, active, max_redemptions, times_redeemed, expires_at')
      .eq('code', code)
      .maybeSingle();
    if (!dc || !isCodeRedeemable(dc as DiscountCode)) {
      return NextResponse.json({ error: 'invalid_code' }, { status: 422 });
    }
    discount = dc as DiscountCode;
  }

  const finalCents = discount ? applyDiscount(plan.priceCents, discount) : plan.priceCents;
  const discountCents = plan.priceCents - finalCents;

  // ── Free path: the code zeroes the price → activate without Viva ──
  if (finalCents <= 0) {
    // New activation reuses a per-listing id (blocks double free-activation);
    // renewals are timestamped since a listing renews many times.
    const sessionId = renew ? `free_renew_${listing.id}_${Date.now()}` : `free_${listing.id}`;
    const { error: payErr } = await svc.from('billing_payments').insert({
      listing_id: listing.id,
      owner_id: user.id,
      stripe_session_id: sessionId,
      amount_cents: 0,
      currency: plan.currency,
      plan: plan.key,
      method: 'free',
      discount_code: discount?.code ?? null,
      discount_cents: discountCents,
    });
    const duplicate = payErr && /duplicate|unique/i.test(payErr.message);
    if (payErr && !duplicate) {
      return NextResponse.json({ error: payErr.message }, { status: 500 });
    }
    if (!duplicate) {
      if (renew) {
        // Extend from the later of now / current expiry; keep status (stays
        // live) unless the plan had lapsed and the listing was archived.
        const base = listing.plan_expires_at && new Date(listing.plan_expires_at) > new Date()
          ? new Date(listing.plan_expires_at) : new Date();
        await svc.from('listings').update({
          plan: plan.key, plan_status: 'active',
          plan_expires_at: planExpiryFrom(base).toISOString(), renewal_reminded_at: null,
          ...(listing.plan_status === 'expired' ? { status: 'pending' } : {}),
        }).eq('id', listing.id);
      } else {
        await svc.from('listings').update({
          status: 'pending', plan: plan.key, plan_status: 'active',
          plan_expires_at: planExpiryFrom(new Date()).toISOString(),
        }).eq('id', listing.id).neq('plan_status', 'active');
      }

      if (discount) {
        await svc.from('discount_codes')
          .update({ times_redeemed: discount.times_redeemed + 1 })
          .eq('code', discount.code);
      }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
      // Owner receipt (both new + renewal).
      fetch(`${baseUrl}/api/billing/notify-paid`, {
        method: 'POST', headers: internalHeaders(),
        body: JSON.stringify({ listing_id: listing.id, session_id: sessionId }),
      }).catch((e) => { console.error('free-activation receipt failed', e); });
      // Admin "to review" only for a brand-new listing.
      if (!renew) {
        fetch(`${baseUrl}/api/listings/notify-new`, {
          method: 'POST', headers: internalHeaders(),
          body: JSON.stringify({ listing_id: listing.id, admin_only: true }),
        }).catch((e) => { console.error('free-activation notify-new failed', e); });
      }
    }
    return NextResponse.json({ free: true });
  }

  // ── Paid path: Viva Smart Checkout for the (possibly discounted) amount ──
  if (!vivaConfig().checkout) {
    return NextResponse.json({ error: 'payments_not_configured' }, { status: 500 });
  }

  const { data: profile } = await svc
    .from('profiles').select('email, full_name').eq('id', user.id).maybeSingle();
  const customerEmail = profile?.email || user.email || '';

  const tierLabel = plan.key === 'premium' ? 'Premium' : 'Ετήσια';
  const productName = `${renew ? `Ανανέωση ${tierLabel}` : `${tierLabel} καταχώρηση`} ChalkidikiHub — ${listing.title_el || 'κατάλυμα'}`;

  // Success/failure redirects are set on the Viva payment source (not per order);
  // both point at /api/billing/viva/return, which verifies the transaction and
  // forwards to the dashboard. The webhook does the same work in the background.
  const order = await createOrder({
    amountCents: finalCents,
    customerTrns: productName,
    merchantTrns: encodeBillingRef({
      listingId: listing.id,
      ownerId: user.id,
      plan: plan.key,
      renewal: renew,
      discountCode: discount?.code ?? null,
      discountCents,
    }),
    email: customerEmail,
    fullName: profile?.full_name || undefined,
    requestLang: 'el-GR',
  });
  if (!order.ok) {
    console.error('viva createOrder failed', order.error);
    return NextResponse.json({ error: 'payment_provider_error' }, { status: 502 });
  }

  return NextResponse.json({ url: checkoutUrl(order.orderCode), order_code: order.orderCode });
}
