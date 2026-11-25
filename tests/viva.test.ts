import { describe, expect, it } from 'vitest';
import { decodeBillingRef, encodeBillingRef } from '@/lib/viva';

describe('viva billing ref (merchantTrns)', () => {
  const ref = {
    listingId: '3f1c2a9e-0b7d-4c55-9a1e-2d4b6f8e0c11',
    ownerId: 'a0b1c2d3-e4f5-4a6b-8c7d-9e0f1a2b3c4d',
    plan: 'premium',
    renewal: true,
    discountCode: 'SUMMER25',
    discountCents: 2500,
  };

  it('round-trips', () => {
    expect(decodeBillingRef(encodeBillingRef(ref))).toEqual(ref);
  });

  it('round-trips without a discount', () => {
    const r = { ...ref, renewal: false, discountCode: null, discountCents: 0 };
    expect(decodeBillingRef(encodeBillingRef(r))).toEqual(r);
  });

  it('rejects foreign or malformed references', () => {
    expect(decodeBillingRef('')).toBeNull();
    expect(decodeBillingRef('some other merchant reference')).toBeNull();
    expect(decodeBillingRef('lb1||x|annual|0||0')).toBeNull();
  });
});
