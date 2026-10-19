import 'server-only';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getActivities, getBeaches, getVillages } from '@/lib/db/content';
import { MONASTERIES } from '@/content/editorial/monasteries';
import { AREA_NAMES, placeName } from '@/lib/content/place-names';
import { displayName } from '@/lib/content/nearby';
import { renderRichText } from '@/lib/content/render';
import { autoLink, fold, greekForms, type Linkable } from './autolink-core';


const MIN_LENGTH = 4;
// Names that are also everyday words or too generic to link safely (compared normalised).
const STOP = new Set(['παραλια', 'beach', 'strand', 'plaja', 'плаж', 'plaza', 'пляж', 'λιμανι', 'port', 'αγιος', 'agios']);
// Beach names that are also ordinary words ("sunset", "harbour", "orange",
// "paradise"...): linked only by their full name ("Παραλία Ηλιοβασίλεμα").
const COMMON_WORD_BEACHES = new Set([
  'γαληνη', 'ηλιοβασιλεμα', 'λιμανι', 'λιμανακι', 'λιβαδι', 'μπανανα', 'παραδεισοσ', 'πορτοκαλι', 'πορτεσ', 'μυτη',
  'μπαρα', 'καβουρι', 'αλυκεσ', 'πλατανια', 'σχοινια', 'βαρκεσ', 'ελαιωνα', 'αρετεσ', 'ονειρου', 'πυργου', 'ζωγραφου',
  'sunset', 'paradise', 'banana', 'orange', 'harbour', 'port', 'meadow',
]);
const BEACH_PREFIX = /^(Παραλία Γυμνιστών|Παραλία|Beach|Plaja|Плаж|Plaža|Пляж|Strand)\s+/u;
const BEACH_SUFFIX = /\s+(Beach|Strand)$/u;

/**
 * Every place a text can mention, in the order a clash is settled: villages,
 * then peninsulas, monasteries, sights and beaches. The first owner of a form
 * keeps it ("Σάρτη" is both a village and its beach: the village wins).
 */
async function linkables(locale: Locale): Promise<Linkable[]> {
  const [villages, beaches, activities] = await Promise.all([getVillages(), getBeaches(), getActivities()]);
  const owner = new Map<string, string>();
  const add = (name: string | undefined | null, path: string) => {
    const n = name?.trim();
    if (!n || n.length < MIN_LENGTH) return;
    const base = fold(n);
    if (STOP.has(base)) return;
    for (const form of locale === 'el' ? greekForms(base) : [base]) if (!owner.has(form)) owner.set(form, path);
  };
  for (const v of villages) if (v.slug !== 'pyrgadikia-mainland') add(placeName(v.slug, locale, v), `/places/${v.slug}`);
  for (const a of AREA_SLUGS) add(AREA_NAMES[a][locale], `/areas/${a}`);
  for (const m of MONASTERIES) add((m.name as Record<string, string>)[locale] ?? m.name.en, `/mount-athos/monasteries/${m.slug}`);
  for (const a of activities) add(displayName(a, locale, 'activity'), `/activities/${a.slug}`);
  for (const b of beaches) {
    const name = displayName(b, locale, 'beach');
    add(name, `/beaches/${b.slug}`);
    // Texts usually say "η Κληματαριά" rather than "Παραλία Κληματαριά".
    const short = name.replace(BEACH_PREFIX, '').replace(BEACH_SUFFIX, '');
    if (!COMMON_WORD_BEACHES.has(fold(short))) add(short, `/beaches/${b.slug}`);
  }
  const byPath = new Map<string, string[]>();
  for (const [form, path] of owner) byPath.set(path, [...(byPath.get(path) ?? []), form]);
  return [...byPath].map(([path, forms]) => ({ path, forms }));
}

/** renderRichText plus automatic internal links; for the main body of a page. */
export async function renderLinked(text: string | null | undefined, locale: Locale, selfPath: string): Promise<string> {
  return autoLink(renderRichText(text, locale), await linkables(locale), locale, selfPath);
}

