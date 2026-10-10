/**
 * Greek → Latin transliteration (ELOT 743, the scheme on Greek road signs).
 * Business names are proper nouns: "Τζίτζικας" is "Tzitzikas" in every
 * language, never "The Cricket" (which is what v3's translator produced).
 */

const DIGRAPHS: Array<[RegExp, string]> = [
  [/ου/g, 'ou'], [/ΟΥ/g, 'OU'], [/Ου/g, 'Ou'],
  [/μπ/g, 'b'], [/ΜΠ/g, 'B'], [/Μπ/g, 'B'],
  [/ντ/g, 'nt'], [/ΝΤ/g, 'NT'], [/Ντ/g, 'Nt'],
  [/γκ/g, 'gk'], [/ΓΚ/g, 'GK'], [/Γκ/g, 'Gk'],
  [/γγ/g, 'ng'], [/ΓΓ/g, 'NG'],
  [/τζ/g, 'tz'], [/ΤΖ/g, 'TZ'], [/Τζ/g, 'Tz'],
  [/ευ(?=[αεηιουωάέήίόύώβγδζλμνρ])/g, 'ev'], [/ευ/g, 'ef'],
  [/αυ(?=[αεηιουωάέήίόύώβγδζλμνρ])/g, 'av'], [/αυ/g, 'af'],
  [/Ευ(?=[αεηιουωάέήίόύώβγδζλμνρ])/g, 'Ev'], [/Ευ/g, 'Ef'],
  [/Αυ(?=[αεηιουωάέήίόύώβγδζλμνρ])/g, 'Av'], [/Αυ/g, 'Af'],
];

const SINGLE: Record<string, string> = {
  α: 'a', ά: 'a', β: 'v', γ: 'g', δ: 'd', ε: 'e', έ: 'e', ζ: 'z', η: 'i', ή: 'i', θ: 'th', ι: 'i', ί: 'i',
  ϊ: 'i', ΐ: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', ό: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's',
  τ: 't', υ: 'y', ύ: 'y', ϋ: 'y', ΰ: 'y', φ: 'f', χ: 'ch', ψ: 'ps', ω: 'o', ώ: 'o',
  Α: 'A', Ά: 'A', Β: 'V', Γ: 'G', Δ: 'D', Ε: 'E', Έ: 'E', Ζ: 'Z', Η: 'I', Ή: 'I', Θ: 'Th', Ι: 'I', Ί: 'I',
  Ϊ: 'I', Κ: 'K', Λ: 'L', Μ: 'M', Ν: 'N', Ξ: 'X', Ο: 'O', Ό: 'O', Π: 'P', Ρ: 'R', Σ: 'S', Τ: 'T', Υ: 'Y',
  Ύ: 'Y', Ϋ: 'Y', Φ: 'F', Χ: 'Ch', Ψ: 'Ps', Ω: 'O', Ώ: 'O',
};

export const hasGreek = (s: string) => /[Ͱ-Ͽἀ-῿]/.test(s);

export function greekToLatin(input: string): string {
  // Accents on the second vowel of a digraph don't change its sound (ού = ου).
  let s = input
    .replace(/([οΟ])ύ/g, '$1υ')
    .replace(/([αεΑΕ])ύ/g, '$1υ')
    .replace(/([αεΑΕ])ί/g, '$1ι');
  for (const [re, to] of DIGRAPHS) s = s.replace(re, to);
  return s.replace(/[Ͱ-Ͽ]/g, (c) => SINGLE[c] ?? c);
}

/** A business's own name, as it appears on its sign — the same in every non-Greek locale. */
export function brandName(nameEl: string | null | undefined, locale: string, fallback = ''): string {
  const original = (nameEl || fallback).trim();
  if (locale === 'el' || !hasGreek(original)) return original;
  return greekToLatin(original);
}
