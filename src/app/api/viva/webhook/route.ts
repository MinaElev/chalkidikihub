// Guard: Viva webhooks are unsigned — we never trust the payload; every event is
// re-fetched from the Viva API (OAuth) before anything changes.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { applyPaidTransaction } from '@/lib/billing-activate';
import { retrieveTransaction, vivaConfig, webhookVerificationKey } from '@/lib/viva';

export const dynamic = 'force-dynamic';

const PAYMENT_CREATED = 1796;
const REVERSAL_CREATED = 1797;

/**
 * Viva URL verification: when the webhook is added in Self Care
 * (Settings → API Access → Webhooks → Verify), Viva GETs this URL and expects
 * `{ "Key": "<key>" }`, the key we fetch with our Merchant ID / API Key.
 */
export async function GET() {
  if (!vivaConfig().merchant) return NextResponse.json({ error: 'viva_not_configured' }, { status: 500 });
  const key = await webhookVerificationKey().catch(() => null);
  if (!key) return NextResponse.json({ error: 'viva_key_unavailable' }, { status: 502 });
  return NextResponse.json({ Key: key });
}

/**
 * Viva event notifications.
 *  - 1796 Transaction Payment Created → verify via API, then activate/renew.
 *  - 1797 Transaction Reversal Created → log only. Refunds we issue go through
 *    /api/admin/billing/refund (which deactivates the listing itself); a refund
 *    made straight from the Viva dashboard is flagged for the admin rather than
 *    acted on, since an unsigned event must not be able to unpublish a listing.
 * Any 2xx acknowledges; non-2xx makes Viva retry hourly (up to 24 times), so we
 * only return 5xx on transient failures worth retrying.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as {
    EventTypeId?: number;
    EventData?: { TransactionId?: string; OrderCode?: number | string; Amount?: number };
  } | null;
  if (!body?.EventData) return NextResponse.json({ received: true });

  const svc = createAdminClient();
  const transactionId = String(body.EventData.TransactionId ?? '');

  if (body.EventTypeId === PAYMENT_CREATED && transactionId) {
    const r = await retrieveTransaction(transactionId);
    if (!r.ok) {
      // 404/400 = not ours or bogus → ack and drop; anything else → retry later.
      if (r.status === 404 || r.status === 400) return NextResponse.json({ received: true });
      console.error('viva webhook: retrieve failed', r.error);
      return NextResponse.json({ error: 'retry' }, { status: 503 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const applied = await applyPaidTransaction(svc, r.tx, baseUrl);
    if (!applied.ok && !applied.error.startsWith('not_') && applied.error !== 'wrong_currency') {
      console.error('viva webhook: apply failed', applied.error);
      return NextResponse.json({ error: 'retry' }, { status: 503 });
    }
    return NextResponse.json({ received: true });
  }

  if (body.EventTypeId === REVERSAL_CREATED) {
    await svc.from('activity_logs').insert({
      type: 'user_action', severity: 'warning',
      message: 'Billing: Viva reversal/refund event — check the listing',
      details: { order_code: String(body.EventData.OrderCode ?? ''), transaction_id: transactionId, amount: body.EventData.Amount ?? null },
    });
  }

  return NextResponse.json({ received: true });
}
