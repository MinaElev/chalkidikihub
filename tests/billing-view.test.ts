import { describe, it, expect } from 'vitest';
import { subscriptionView, compareSubs, type SubListing, type SubPayment } from '@/lib/billing-view';

const NOW = new Date('2027-06-01T12:00:00Z');
const base: SubListing = {
  id: 'L1', billing_exempt: false, plan: 'annual', plan_status: 'active',
  plan_expires_at: '2027-12-01T12:00:00Z', status: 'published', bank_transfer_requested_at: null,
};
const pay = (o: Partial<SubPayment>): SubPayment => ({
  id: 'p', listing_id: 'L1', amount_cents: 9000, paid_at: '2026-12-01T12:00:00Z', refunded_at: null, ...o,
});

describe('subscriptionView', () => {
  it('grandfathered listings are free forever with no dates or action', () => {
    const v = subscriptionView({ ...base, billing_exempt: true }, [], NOW);
    expect(v).toMatchObject({ state: 'free_forever', tier: 'free', expiresAt: null, needsAction: false, action: null });
  });

  it('active with more than 30 days left', () => {
    const v = subscriptionView(base, [], NOW);
    expect(v.state).toBe('active');
    expect(v.tier).toBe('annual');
    expect(v.daysLeft).toBe(183);
    expect(v.termStart?.toISOString()).toBe('2026-12-01T12:00:00.000Z');
    expect(v.termUsed).toBeGreaterThan(0.49);
    expect(v.termUsed).toBeLessThan(0.51);
    expect(v.needsAction).toBe(false);
    expect(v.action).toBe('renew');
  });

  it('expiring at 30 days or fewer', () => {
    const v = subscriptionView({ ...base, plan: 'premium', plan_expires_at: '2027-06-20T12:00:00Z' }, [], NOW);
    expect(v).toMatchObject({ state: 'expiring', tier: 'premium', daysLeft: 19, needsAction: true });
  });

  it('past due → grace, ends 30 days after expiry', () => {
    const v = subscriptionView({ ...base, plan_status: 'past_due', plan_expires_at: '2027-05-20T12:00:00Z' }, [], NOW);
    expect(v.state).toBe('grace');
    expect(v.graceEndsAt?.toISOString()).toBe('2027-06-19T12:00:00.000Z');
    expect(v.action).toBe('renew');
  });

  it('expired, and unpaid listings', () => {
    expect(subscriptionView({ ...base, plan_status: 'expired', status: 'archived' }, [], NOW).state).toBe('expired');
    const u = subscriptionView({ ...base, plan: null, plan_status: null, plan_expires_at: null, status: 'pending_payment' }, [], NOW);
    expect(u).toMatchObject({ state: 'unpaid', tier: null, action: 'pay', needsAction: true });
  });

  it('bank transfer pending: no longer flagged, but card remains possible', () => {
    const v = subscriptionView({ ...base, plan: 'premium', plan_status: null, plan_expires_at: null, status: 'pending_payment', bank_transfer_requested_at: '2027-05-30T00:00:00Z' }, [], NOW);
    expect(v).toMatchObject({ state: 'awaiting_bank', tier: 'premium', needsAction: false, action: 'pay' });
    const r = subscriptionView({ ...base, plan_status: 'past_due', bank_transfer_requested_at: '2027-05-30T00:00:00Z' }, [], NOW);
    expect(r.action).toBe('renew');
  });

  it('last payment skips refunds and other listings', () => {
    const v = subscriptionView(base, [
      pay({ id: 'old', paid_at: '2025-12-01T00:00:00Z' }),
      pay({ id: 'refunded', paid_at: '2027-01-05T00:00:00Z', refunded_at: '2027-01-06T00:00:00Z' }),
      pay({ id: 'other', listing_id: 'L2', paid_at: '2027-03-01T00:00:00Z' }),
      pay({ id: 'latest', paid_at: '2026-12-01T12:00:00Z' }),
    ], NOW);
    expect(v.lastPayment?.id).toBe('latest');
  });
});

describe('compareSubs', () => {
  it('puts what needs action first, free-forever last', () => {
    const views = [
      subscriptionView({ ...base, billing_exempt: true }, [], NOW),
      subscriptionView(base, [], NOW),
      subscriptionView({ ...base, plan_status: 'past_due', plan_expires_at: '2027-05-20T12:00:00Z' }, [], NOW),
      subscriptionView({ ...base, plan_expires_at: '2027-06-10T12:00:00Z' }, [], NOW),
    ].sort(compareSubs);
    expect(views.map((v) => v.state)).toEqual(['grace', 'expiring', 'active', 'free_forever']);
  });
});
