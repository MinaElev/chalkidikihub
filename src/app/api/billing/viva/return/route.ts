// Guard: public redirect target — query params are untrusted; the transaction is
// re-fetched from the Viva API and only a paid, ours, EUR transaction is applied.
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { applyPaidTransaction } from '@/lib/billing-activate';
import { decodeBillingRef, retrieveTransaction } from '@/lib/viva';

export const dynamic = 'force-dynamic';

/**
 * Where Viva sends the payer after Smart Checkout. Configure BOTH the success
 * and the failure URL of the Viva payment source to this path:
 *   /api/billing/viva/return
 * Viva appends ?t=<transactionId>&s=<orderCode>&lang=…&eventId=…&eci=…
 * (t may be missing on failure).
 *
 * We verify and apply the payment right here (idempotent with the webhook) so
 * the owner sees "paid" immediately even if the webhook is late, then forward
 * to the dashboard billing page.
 */
export async function GET(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const lang = (req.nextUrl.searchParams.get('lang') || '').slice(0, 2).toLowerCase();
  const locale = lang === 'en' ? 'en' : 'el';
  const dest = (q: string) => NextResponse.redirect(`${base}/${locale}/dashboard/billing?${q}`, 303);

  const t = req.nextUrl.searchParams.get('t') || '';
  if (!t) return dest('cancelled=1');

  const r = await retrieveTransaction(t);
  if (!r.ok) {
    // Couldn't verify now; the webhook will still apply it if it was paid.
    console.error('viva return: retrieve failed', r.error);
    return dest('pending=1');
  }

  const ref = decodeBillingRef(r.tx.merchantTrns);
  const listingQ = ref ? `&listing=${encodeURIComponent(ref.listingId)}` : '';
  if (r.tx.statusId !== 'F') return dest(`cancelled=1${listingQ}`);

  const applied = await applyPaidTransaction(createAdminClient(), r.tx, base);
  if (!applied.ok) {
    console.error('viva return: apply failed', applied.error);
    return dest(`pending=1${listingQ}`);
  }
  return dest(`paid=1${listingQ}`);
}
