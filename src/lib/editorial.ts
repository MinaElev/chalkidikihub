import 'server-only';
import { serbianLatin, writtenFor } from '@/lib/i18n/script';
import { fallbackChain, locales, type Locale } from '@/i18n/config';
import { publicDb } from '@/lib/supabase/clients';
import { cached } from '@/lib/db/cache';
import { assessQuality } from '@/lib/seo/quality';
import { GUIDES } from '@/content/editorial/guides';
import { COST_GUIDES } from '@/content/editorial/costs';
import { FROM_CITIES } from '@/content/editorial/from';
import { ITINERARIES } from '@/content/editorial/itineraries';
import { BEST_GUIDES } from '@/content/editorial/best';

/**
 * Hand-written editorial pages (guides, costs, "from city", itineraries,
 * best-of). Which ones survive in v4 is decided by 90-day GSC data — see the
 * merge tables in lib/seo/redirects.ts. Pages with no demand and no natural
 * successor are simply not routed any more.
 */

type L = Record<string, string>;
export type EditorialDoc = { slug: string; title: L; description: L; metaTitle: L; metaDesc: L; content?: L };

export const KEPT_GUIDES = [
  'best-time-to-visit', 'weather', 'sunset-spots', 'halkidiki-vs-thassos', 'shopping-and-souvenirs',
  'with-dogs', 'boat-tours', 'food-and-wine', 'driving-distances', 'day-trips', 'camping', 'kassandra-vs-sithonia',
];
export const KEPT_ITINERARIES = ['3-days', '5-days', '7-days', '10-days'];
export const KEPT_BEST = [
  'beaches-kassandra', 'beaches-sithonia', 'instagram-spots', 'snorkeling-spots', 'historical-sites', 'water-sports',
  'kids-activities', 'quiet-beaches', 'beach-bars', 'restaurants-kassandra', 'restaurants-sithonia',
  'seafood-restaurants', 'romantic-restaurants', 'traditional-tavernas', 'hiking-trails',
];

const by = <T extends { slug: string }>(list: T[], keep?: string[]) =>
  (keep ? keep.map((s) => list.find((x) => x.slug === s)).filter((x): x is T => Boolean(x)) : list);

export const guides = () => by(GUIDES as EditorialDoc[], KEPT_GUIDES);
export const costs = () => by(COST_GUIDES as EditorialDoc[]);
export const fromCities = () => by(FROM_CITIES as EditorialDoc[]).filter((c) => c.slug !== 'munich');
export const itineraries = () => by(ITINERARIES as EditorialDoc[], KEPT_ITINERARIES);
export const bestGuides = () => by(BEST_GUIDES as unknown as EditorialDoc[], KEPT_BEST);

/** Value in `locale`, falling back like the DB fields do; reports nativeness. */
export function field(map: L | undefined, locale: Locale) {
  for (const l of fallbackChain[locale] ?? fallbackChain.en) {
    let v = map?.[l]?.trim();
    if (v && l === 'sr') v = serbianLatin(v);
    if (v && writtenFor(v, l as Locale)) return { text: v, native: l === locale, from: l as Locale };
  }
  return { text: '', native: false, from: null };
}

/** DB-stored rewrites of guide bodies (guide_overrides), preferred over the static text. */
const getOverrides = cached('guides:overrides', ['areas'], async () => {
  const { data } = await publicDb().from('guide_overrides').select('slug, locale, content');
  return Object.fromEntries((data ?? []).map((r) => [`${r.slug}|${r.locale}`, r.content as string]));
});

export async function guideBody(doc: EditorialDoc, locale: Locale) {
  const overrides = await getOverrides();
  const own = overrides[`${doc.slug}|${locale}`];
  if (own?.trim()) return { text: own, native: true, from: locale };
  return field(doc.content, locale);
}

export async function indexableLocales(doc: EditorialDoc, withOverrides = false): Promise<Locale[]> {
  const overrides = withOverrides ? await getOverrides() : {};
  return locales.filter((l) => {
    const own = overrides[`${doc.slug}|${l}`];
    const body = own ? { text: own, native: true } : field(doc.content, l);
    return assessQuality({ body: body.text, nativeBody: body.native, hasImage: true, locale: l }, 'hub').indexable;
  });
}
