import type { Locale } from '@/i18n/config';
import { pick } from '@/lib/i18n/localize';
import { writtenFor } from '@/lib/i18n/script';

const tidyTitle = (t: string) => t.replace(/\*\*/g, '').replace(/\s+/g, ' ').replace(/\s*\.$/, '').trim();

/**
 * A stay's name. When the owner named it in Latin letters in the Greek field
 * ("Amira House", "Country Loft", "Isla de roca") that is a business name and
 * is shown as written in every language: v3 machine-translated them into
 * "Pfingstrosenhaus" and "Странен Лофт". Greek descriptive titles ("Σπίτι
 * κοντά στη θάλασσα") keep their per-language translations.
 */
export function listingTitle(row: Record<string, unknown>, locale: Locale): string {
  const own = typeof row.title_el === 'string' ? tidyTitle(row.title_el) : '';
  if (own && !writtenFor(own, 'el')) return own;
  return tidyTitle(pick(row, 'title', locale)) || own || String(row.slug);
}
