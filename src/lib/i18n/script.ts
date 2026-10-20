import type { Locale } from '@/i18n/config';

/**
 * Alphabet checks for stored text. Owners and v3's tools often put text in
 * the wrong language column (English typed into the Greek field, Serbian in
 * Cyrillic where the site writes Serbian in Latin). Only the alphabet is
 * checked: it is certain, where guessing English from German is not.
 */

const letters = (text: string) => {
  const t = text.replace(/<[^>]+>/g, ' ').slice(0, 1200);
  return {
    greek: (t.match(/[Ͱ-Ͽἀ-῿]/g) ?? []).length,
    cyrillic: (t.match(/[Ѐ-ӿ]/g) ?? []).length,
    latin: (t.match(/[A-Za-zÀ-ɏ]/g) ?? []).length,
  };
};

/**
 * Whether `text` is written in the alphabet of `locale`: mostly Greek for el,
 * mostly Cyrillic for bg/ru, mostly Latin for en/de/ro/sr. "Mostly" leaves
 * room for brand names ("Sea Star Lux" inside Greek prose).
 */
export function writtenFor(text: string, locale: Locale): boolean {
  const { greek, cyrillic, latin } = letters(text);
  const total = greek + cyrillic + latin;
  if (total < 3) return true;
  if (locale === 'el') return greek / total >= 0.4;
  if (locale === 'bg' || locale === 'ru') return cyrillic / total >= 0.4;
  return (greek + cyrillic) / total < 0.3;
}

// Serbian Cyrillic → Latin is a fixed one-to-one alphabet mapping (Vuk/Gaj).
const SR: Record<string, string> = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Ђ: 'Đ', Е: 'E', Ж: 'Ž', З: 'Z', И: 'I', Ј: 'J', К: 'K', Л: 'L', Љ: 'Lj', М: 'M',
  Н: 'N', Њ: 'Nj', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', Ћ: 'Ć', У: 'U', Ф: 'F', Х: 'H', Ц: 'C', Ч: 'Č', Џ: 'Dž', Ш: 'Š',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm',
  н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't', ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
};
// Letters that exist in Russian or Bulgarian but not in Serbian: such text is not Serbian.
const NOT_SERBIAN = /[ЫыЭэЪъЩщЯяЮюЙйЁёЬь]/;

/** Serbian written in Cyrillic, rewritten in the Latin alphabet the site uses. Other text is returned as is. */
export function serbianLatin(text: string): string {
  if (!/[Ѐ-ӿ]/.test(text)) return text;
  return text.replace(/[^\s<>]+|<[^>]*>/g, (chunk) => {
    // Leave tags and non-Serbian words (Bulgarian place names quoted in Serbian text) alone.
    if (chunk.startsWith('<') || NOT_SERBIAN.test(chunk)) return chunk;
    return chunk.replace(/[Ѐ-ӿ]/g, (c, i, s) => {
      const out = SR[c] ?? c;
      // Љ/Њ/Џ in an all-caps word become LJ/NJ/DŽ.
      if (out.length === 2 && c === c.toUpperCase() && s.slice(i + 1, i + 2).toUpperCase() === s.slice(i + 1, i + 2) && /[Ѐ-ӿ]/.test(s.slice(i + 1, i + 2))) return out.toUpperCase();
      return out;
    });
  });
}

/**
 * The language of a visitor's own text (reviews, comments), for the `lang`
 * attribute. Only answers when the letters make it certain: Greek script,
 * Serbian/Russian/Bulgarian-only Cyrillic letters, or Romanian/German/Serbian
 * Latin diacritics. Plain Latin text is left unmarked.
 */
export function textLang(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  const { greek, cyrillic, latin } = letters(text);
  const total = greek + cyrillic + latin;
  if (total < 3) return undefined;
  if (greek / total >= 0.5) return 'el';
  if (cyrillic / total >= 0.5) {
    if (/[ЂђЈјЉљЊњЋћЏџ]/.test(text)) return 'sr';
    if (/[ЫыЭэЁё]/.test(text)) return 'ru';
    if (/[Ъъ]/.test(text)) return 'bg';
    return undefined;
  }
  if (/[ăîșțşţĂÎȘȚ]/.test(text)) return 'ro';
  if (/[ćđĆĐ]/.test(text)) return 'sr';
  if (/[äöüßÄÖÜ]/.test(text)) return 'de';
  return undefined;
}
