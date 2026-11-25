/**
 * Listing billing — single annual package.
 *
 * Decision 2026-09-07: one paid tier only. Price is VAT-inclusive (24% ΦΠΑ
 * already inside the 90€); invoices (τιμολόγια) are issued manually off-platform,
 * so the payment provider (Viva) simply collects the gross amount.
 *
 * Cutoff (decision 2026-09-07): listings created BEFORE 2027-01-01 are free
 * forever (grandfathered by date). Listings created on/after the cutoff pay the
 * annual fee. The cutoff is enforced server-side by a DB trigger (see migration
 * 065) — the constants here drive UI copy and the client's post-insert routing.
 *
 * Kept in one place so the checkout endpoint, the /pricing page, the owner
 * dashboard and the admin overview never drift apart on the numbers.
 */

export const ANNUAL_PLAN = {
  key: 'annual' as const,
  /** Charged amount in the smallest currency unit (cents). 90,00 € → 9000. */
  priceCents: 9000,
  currency: 'eur' as const,
  /** VAT-inclusive gross price shown to owners. */
  priceLabel: '90€',
  vatRate: 0.24,
  /** Human label for the billing period. */
  periodLabel: 'ανά έτος',
} as const;

/**
 * Premium tier — same annual model, higher price, extra perks (priority ranking
 * in area/search + a "Featured" badge). The perks are enforced elsewhere:
 * `featured` in transformListing (badge + ranking) keys off plan==='premium'.
 */
export const PREMIUM_PLAN = {
  key: 'premium' as const,
  priceCents: 14900,
  currency: 'eur' as const,
  priceLabel: '149€',
  vatRate: 0.24,
  periodLabel: 'ανά έτος',
} as const;

export type PlanKey = 'annual' | 'premium';

/** Resolve a plan config from its key (defaults to the basic annual plan). */
export function planByKey(k?: string) {
  return k === 'premium' ? PREMIUM_PLAN : ANNUAL_PLAN;
}

/**
 * The instant paid billing switches on. Anchored to Greek time (EET, +02:00).
 * Anything created before this is grandfathered free forever.
 */
export const BILLING_CUTOFF = new Date('2027-01-01T00:00:00+02:00');
export const CUTOFF_FREE_UNTIL_EL = '31 Δεκεμβρίου 2026';
export const CUTOFF_FREE_UNTIL_EN = 'December 31, 2026';
export const CUTOFF_PAID_FROM_EL = '1 Ιανουαρίου 2027';
export const CUTOFF_PAID_FROM_EN = 'January 1, 2027';

/** Is the paid flow live yet? Free-forever window until the cutoff. */
export function isBillingActive(now: Date = new Date()): boolean {
  return now.getTime() >= BILLING_CUTOFF.getTime();
}

/** Net (pre-VAT) portion of a gross price, for display/receipts. e.g. 72.58 */
export function netFromGross(grossCents: number, vatRate = ANNUAL_PLAN.vatRate): number {
  return Math.round((grossCents / (1 + vatRate))) / 100;
}

/** Annual validity window from a payment instant (renewals are a later phase). */
export function planExpiryFrom(paidAt: Date): Date {
  const d = new Date(paidAt);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

// ── Discount codes ─────────────────────────────────────────────────────────

export type DiscountKind = 'percent' | 'fixed' | 'free';

export type DiscountCode = {
  code: string;
  kind: DiscountKind;
  /** percent: 1..100 · fixed: cents off · free: ignored */
  value: number;
  active: boolean;
  max_redemptions: number | null;
  times_redeemed: number;
  expires_at: string | null;
};

/** Normalise user-typed codes so 'save10 ' and 'SAVE10' match one row. */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/**
 * Apply a discount to the annual price. Returns the final charge in cents,
 * clamped to [0, price]. A `free` code, a `percent` of 100, or a `fixed` at or
 * above the price all yield 0 → the caller skips Viva and activates directly.
 */
export function applyDiscount(priceCents: number, d: Pick<DiscountCode, 'kind' | 'value'>): number {
  let final = priceCents;
  if (d.kind === 'free') final = 0;
  else if (d.kind === 'percent') final = Math.round(priceCents * (1 - Math.min(100, Math.max(0, d.value)) / 100));
  else if (d.kind === 'fixed') final = priceCents - Math.max(0, d.value);
  return Math.max(0, Math.min(priceCents, final));
}

/** Whether a code is currently usable (before applying it to a price). */
export function isCodeRedeemable(d: DiscountCode, now: Date = new Date()): boolean {
  if (!d.active) return false;
  if (d.expires_at && new Date(d.expires_at).getTime() < now.getTime()) return false;
  if (d.max_redemptions != null && d.times_redeemed >= d.max_redemptions) return false;
  return true;
}
