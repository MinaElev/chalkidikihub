import { describe, expect, it } from 'vitest';
import { matchScore, norm } from '@/lib/search/normalize';

const keys = (...names: string[]) => names.map(norm);

describe('site search matching', () => {
  it('ignores accents, case and script', () => {
    for (const q of ['Νικήτη', 'νικητη', 'NIKITI', 'nikiti']) expect(matchScore(norm(q), keys('Νικήτη'))).toBe(5);
  });
  it('matches while typing', () => {
    expect(matchScore(norm('nik'), keys('Νικήτη'))).toBe(4);
    expect(matchScore(norm('Χανι'), keys('Χανιώτη'))).toBe(4);
    expect(matchScore(norm('hani'), keys('Χανιώτη'))).toBe(4);
  });
  it('matches words in any order', () => {
    expect(matchScore(norm('koufo porto'), keys('Πόρτο Κουφό'))).toBe(3);
  });
  it('tolerates one typo in longer queries', () => {
    expect(matchScore(norm('nikti'), keys('Νικήτη'))).toBe(1);
    expect(matchScore(norm('kalamiti'), keys('Καλαμίτσι'))).toBeGreaterThan(0);
  });
  it('does not match unrelated names', () => {
    expect(matchScore(norm('sarti'), keys('Νικήτη'))).toBe(0);
    expect(matchScore(norm('ni'), keys('Σάρτη'))).toBe(0);
  });
});
