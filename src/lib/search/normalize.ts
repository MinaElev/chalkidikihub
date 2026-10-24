import { greekToLatin } from '@/lib/content/translit';

/**
 * Accent-, case- and script-insensitive key: "Νικήτη", "nikiti", "NIKITI" all
 * match. Greek is transliterated and the usual Greeklish variants are folded
 * (ch/h, y/i), so a visitor can type the name however they spell it.
 */
export const norm = (s: string) =>
  greekToLatin(s.toLocaleLowerCase('el'))
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9а-яё]+/gi, ' ')
    .replace(/ch/g, 'h')
    .replace(/y/g, 'i')
    .trim();

/** Levenshtein distance capped at `max` (returns max + 1 once it is exceeded). */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/**
 * How well a normalised query matches normalised names: 0 = no match.
 * Exact name 5, name starts with it 4, every query word starts a name word 3,
 * substring 2, one typo in a word (queries of 4+ letters) 1.
 */
export function matchScore(needle: string, keys: string[]): number {
  if (!needle) return 0;
  let best = 0;
  const words = needle.split(' ');
  for (const key of keys) {
    if (key === needle) return 5;
    if (key.startsWith(needle)) { best = Math.max(best, 4); continue; }
    const kw = key.split(' ');
    if (words.every((w) => kw.some((k) => k.startsWith(w)))) { best = Math.max(best, 3); continue; }
    if (key.includes(needle)) { best = Math.max(best, 2); continue; }
    if (best < 1 && needle.length >= 4) {
      const last = words[words.length - 1];
      // The last word may still be half typed, so it is compared with name prefixes of about its length.
      const near = (w: string, k: string) =>
        w === last ? [w.length - 1, w.length, w.length + 1].some((n) => distance(w, k.slice(0, n), 1) <= 1) : distance(w, k, 1) <= 1;
      const fuzzy = words.every((w) => kw.some((k) => k.startsWith(w) || (w.length >= 4 && near(w, k))));
      if (fuzzy) best = 1;
    }
  }
  return best;
}
