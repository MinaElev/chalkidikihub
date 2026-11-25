/**
 * Owner-facing view of a listing's subscription, for /dashboard/billing.
 *
 * Pure (no I/O) so the lifecycle rules can be unit-tested. The thresholds
 * mirror the billing-reminders cron: reminders start 30 days before expiry,
 * and a lapsed plan stays published for a 30-day grace window before the
 * listing is archived.
 */

export const REMIND_WITHIN_DAYS = 30;
export const GRACE_DAYS = 30;
const DAY = 86400000;

export type SubState =
  | 'free_forever'   // grandfathered (created before the paid cutoff)
  | 'active'         // paid, more than 30 days left
  | 'expiring'       // paid, 30 days or fewer left
  | 'grace'          // expired, still published during the grace window
  | 'expired'        // lapsed and archived
  | 'awaiting_bank'  // owner chose bank transfer, deposit not confirmed yet
  | 'unpaid';        // never paid, not published

export type SubListing = {
  id: string;
  billing_exempt: boolean;
  plan: string | null;
  plan_status: string | null;
  plan_expires_at: string | null;
  status: string;
  bank_transfer_requested_at: string | null;
};

export type SubPayment = {
  id: string;
  listing_id: string | null;
  amount_cents: number;
  paid_at: string;
  refunded_at: string | null;
};

export type SubView = {
  state: SubState;
  /** 'premium' | 'annual' for paid plans, 'free' for grandfathered, null if none yet. */
  tier: 'premium' | 'annual' | 'free' | null;
  expiresAt: Date | null;
  /** Start of the current paid term (expiry minus one year). */
  termStart: Date | null;
  /** Whole days until expiry (negative once past). */
  daysLeft: number | null;
  /** When a past-due listing gets archived. */
  graceEndsAt: Date | null;
  /** Share of the current term already used, 0..1 (for the progress bar). */
  termUsed: number | null;
  lastPayment: SubPayment | null;
  needsAction: boolean;
  /** Which payment action the card offers. */
  action: 'pay' | 'renew' | null;
};

export function subscriptionView(l: SubListing, payments: SubPayment[], now: Date = new Date()): SubView {
  const mine = payments
    .filter((p) => p.listing_id === l.id && !p.refunded_at)
    .sort((a, b) => b.paid_at.localeCompare(a.paid_at));
  const lastPayment = mine[0] ?? null;

  const expiresAt = l.plan_expires_at ? new Date(l.plan_expires_at) : null;
  const termStart = expiresAt ? new Date(new Date(expiresAt).setFullYear(expiresAt.getFullYear() - 1)) : null;
  const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - now.getTime()) / DAY) : null;
  const termUsed = expiresAt && termStart
    ? Math.min(1, Math.max(0, (now.getTime() - termStart.getTime()) / (expiresAt.getTime() - termStart.getTime())))
    : null;
  const paidTier = l.plan === 'premium' ? 'premium' : 'annual';

  const graceEndsAt = l.plan_status === 'past_due' && expiresAt ? new Date(expiresAt.getTime() + GRACE_DAYS * DAY) : null;
  const base = { expiresAt, termStart, daysLeft, termUsed, lastPayment, graceEndsAt };

  if (l.billing_exempt) {
    return { ...base, expiresAt: null, termStart: null, daysLeft: null, termUsed: null, state: 'free_forever', tier: 'free', needsAction: false, action: null };
  }
  if (l.plan_status === 'active') {
    const expiring = daysLeft != null && daysLeft <= REMIND_WITHIN_DAYS;
    return { ...base, state: expiring ? 'expiring' : 'active', tier: paidTier, needsAction: expiring, action: 'renew' };
  }
  if (l.bank_transfer_requested_at) {
    const tier = l.plan === 'premium' || l.plan === 'annual' ? paidTier : null;
    // The owner can still switch to card while the deposit is pending.
    const lapsed = l.plan_status === 'past_due' || l.plan_status === 'expired';
    return { ...base, state: 'awaiting_bank', tier, needsAction: false, action: lapsed ? 'renew' : 'pay' };
  }
  if (l.plan_status === 'past_due') {
    return { ...base, state: 'grace', tier: paidTier, needsAction: true, action: 'renew' };
  }
  if (l.plan_status === 'expired') {
    return { ...base, state: 'expired', tier: paidTier, needsAction: true, action: 'renew' };
  }
  return { ...base, expiresAt: null, termStart: null, daysLeft: null, termUsed: null, state: 'unpaid', tier: null, needsAction: true, action: 'pay' };
}

/** Order for the cards: what needs the owner first, then soonest expiry. */
const ORDER: Record<SubState, number> = {
  grace: 0, expiring: 1, expired: 2, unpaid: 3, awaiting_bank: 4, active: 5, free_forever: 6,
};

export function compareSubs(a: SubView, b: SubView): number {
  const d = ORDER[a.state] - ORDER[b.state];
  if (d) return d;
  const ae = a.expiresAt?.getTime() ?? Infinity;
  const be = b.expiresAt?.getTime() ?? Infinity;
  return ae - be;
}
