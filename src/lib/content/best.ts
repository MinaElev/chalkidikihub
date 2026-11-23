import 'server-only';
import { locales, type Locale } from '@/i18n/config';
import { getActivities, getBeaches, getRestaurants } from '@/lib/db/content';
import { bestGuides, field } from '@/lib/editorial';
import { ENRICHMENTS } from '@/content/editorial/best-enrichments';

/**
 * What each /best/* list contains and in which locales it may be indexed.
 * Shared by the page and the sitemap (lib/seo/inventory.ts) so the two can
 * never disagree.
 */
export type Kind = 'beach' | 'restaurant' | 'activity';
type Pick = { kind: Kind; match: (row: Record<string, unknown>) => boolean };

const has = (key: string, v: string) => (r: Record<string, unknown>) => ((r[key] as string[]) ?? []).includes(v);
const is = (key: string, v: unknown) => (r: Record<string, unknown>) => r[key] === v;
const all = () => true;

/** What each list contains — explicit, instead of v3's parsed API URLs. */
const SELECTION: Record<string, Pick> = {
  'beaches-kassandra': { kind: 'beach', match: is('area', 'kassandra') },
  'beaches-sithonia': { kind: 'beach', match: is('area', 'sithonia') },
  'quiet-beaches': { kind: 'beach', match: (r) => has('features', 'free')(r) && !has('features', 'organized')(r) },
  'instagram-spots': { kind: 'beach', match: all },
  'snorkeling-spots': { kind: 'beach', match: has('features', 'pebble') },
  'seafood-restaurants': { kind: 'restaurant', match: has('cuisine', 'seafood') },
  'beach-bars': { kind: 'restaurant', match: has('cuisine', 'beachBar') },
  'romantic-restaurants': { kind: 'restaurant', match: is('has_sea_view', true) },
  'traditional-tavernas': { kind: 'restaurant', match: has('cuisine', 'traditional') },
  'restaurants-kassandra': { kind: 'restaurant', match: is('area', 'kassandra') },
  'restaurants-sithonia': { kind: 'restaurant', match: is('area', 'sithonia') },
  'hiking-trails': { kind: 'activity', match: is('category', 'nature') },
  'historical-sites': { kind: 'activity', match: is('category', 'historical') },
  'water-sports': { kind: 'activity', match: is('category', 'waterSports') },
  'kids-activities': { kind: 'activity', match: is('category', 'family') },
};

export const BASE: Record<Kind, string> = { beach: '/beaches', restaurant: '/restaurants', activity: '/activities' };

export async function loadBest(slug: string) {
  const guide = bestGuides().find((g) => g.slug === slug);
  const sel = SELECTION[slug];
  if (!guide || !sel) return null;
  const rows = (sel.kind === 'beach' ? await getBeaches() : sel.kind === 'restaurant' ? await getRestaurants() : await getActivities()) as unknown as Array<Record<string, unknown> & { slug: string; latitude: number | null; longitude: number | null }>;
  const weight = (r: Record<string, unknown>) => (Number(r.rating) || 0) * Math.log10(10 + (Number(r.reviews_count) || 0)) + (r.image_url ? 0.5 : 0);
  const items = rows.filter(sel.match).sort((a, b) => weight(b) - weight(a)).slice(0, 20);
  return { guide, sel, items };
}


/**
 * Lists the page's own item belongs to, for "see also" links back from beach,
 * restaurant and activity pages. Same selection rules as the lists, and only
 * lists indexed in this locale. Lists that rest on unverified tags ("quiet":
 * free/organised) or take everything (instagram) are left out.
 */
const NOT_LINKED = new Set(['quiet-beaches', 'instagram-spots']);
export async function bestListsFor(kind: Kind, row: Record<string, unknown>, locale: Locale) {
  const out: Array<{ slug: string; title: string }> = [];
  for (const [slug, sel] of Object.entries(SELECTION)) {
    if (sel.kind !== kind || NOT_LINKED.has(slug) || !sel.match(row)) continue;
    const data = await loadBest(slug);
    if (!data || !bestIndexable(slug, data.items.length).includes(locale)) continue;
    const title = field((data.guide as unknown as { title: Partial<Record<Locale, string>> }).title, locale).text;
    if (title) out.push({ slug, title });
  }
  return out;
}

/** Locales where the list is worth indexing: a written intro and at least four entries. */
export function bestIndexable(slug: string, itemCount: number): Locale[] {
  return itemCount >= 4 ? locales.filter((l) => Boolean(ENRICHMENTS[slug]?.intro?.[l])) : [];
}
