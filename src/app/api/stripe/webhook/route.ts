import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { verifyStripeSignature } from '@/lib/pms/stripe';

/**
 * Stripe webhook endpoint. Handles `checkout.session.completed` to flip
 * pms_bookings.payment_status to deposit_paid and record the paid amount.
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
      payment_status?: string;
      metadata?: Record<string, string>;
      payment_method_types?: string[];
      client_reference_id?: string;
    };
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

  return NextResponse.json({ received: true });
}
