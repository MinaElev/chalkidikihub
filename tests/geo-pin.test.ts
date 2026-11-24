import { describe, expect, it } from 'vitest';
import { isUnsetPin } from '@/lib/geo';

describe('isUnsetPin', () => {
  it('flags the picker default and pins nudged a few hundred metres from it', () => {
    expect(isUnsetPin(40.1, 23.6)).toBe(true);
    expect(isUnsetPin(40.101043, 23.60527)).toBe(true); // dinas-house-3 (live data)
    expect(isUnsetPin(40.098832, 23.606272)).toBe(true); // yard-of-panos (live data)
  });
  it('flags missing coordinates', () => {
    expect(isUnsetPin(null, null)).toBe(true);
    expect(isUnsetPin(Number.NaN, 23.6)).toBe(true);
  });
  it('accepts real pins on land', () => {
    expect(isUnsetPin(40.0363, 23.9999)).toBe(false); // Sykia area
    expect(isUnsetPin(40.2335, 23.2861)).toBe(false); // Nea Moudania
  });
});
