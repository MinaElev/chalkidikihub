import { createApiClient } from '@/lib/api-helpers';
import { localeUrl } from '@/lib/seo';
import { haversineKm } from '@/lib/driving-distances';
import { AREAS } from '@/lib/constants';
import type { Metadata } from 'next';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

type ContentType = 'beaches' | 'restaurants' | 'activities';

// Single source of truth for the "nearest" policy, shared by the page render
// and the metadata builder so the H1 count, the title and the rendered list
// never drift. NEAREST_LIMIT = how many cards we show (sorted by real
// distance from the village); NEARBY_RADIUS_KM = the honest radius used for
// the "N beaches near X" count in the title/description.
export const NEAREST_LIMIT = 12;
export const NEARBY_RADIUS_KM = 15;

// Per-locale vocabulary: "X beaches", "near Village", "reviews" etc.
// Keeps the builder code linear and easy to add locales to.
const SUBPAGE_L10N: Record<ContentType, Record<string, {
  noun: string;      // plural: "παραλίες" / "beaches" / ...
  singular: string;  // "παραλία" / "beach" — for the "closest X" sentence
  near: string;      // "κοντά στο" / "near" / ...
  heading: string;   // H1 prefix word — often same as noun
  tail: string;      // "Φωτογραφίες, χάρτες, κριτικές." etc.
}>> = {
  beaches: {
    el: { noun: 'παραλίες', singular: 'παραλία', near: 'κοντά στο', heading: 'Παραλίες', tail: 'Φωτογραφίες, χάρτες, κριτικές.' },
    en: { noun: 'beaches', singular: 'beach', near: 'near', heading: 'Beaches', tail: 'Photos, map, reviews.' },
    de: { noun: 'Strände', singular: 'Strand', near: 'in der Nähe von', heading: 'Strände', tail: 'Fotos, Karte, Bewertungen.' },
    bg: { noun: 'плажа', singular: 'плаж', near: 'близо до', heading: 'Плажове', tail: 'Снимки, карта, отзиви.' },
    ru: { noun: 'пляжей', singular: 'пляж', near: 'рядом с', heading: 'Пляжи', tail: 'Фото, карта, отзывы.' },
    ro: { noun: 'plaje', singular: 'plajă', near: 'lângă', heading: 'Plaje', tail: 'Fotografii, hartă, recenzii.' },
    sr: { noun: 'plaža', singular: 'plaža', near: 'kod', heading: 'Plaže', tail: 'Fotografije, mapa, recenzije.' },
  },
  restaurants: {
    el: { noun: 'εστιατόρια', singular: 'εστιατόριο', near: 'κοντά στο', heading: 'Εστιατόρια', tail: 'Μενού, τιμές, κριτικές.' },
    en: { noun: 'restaurants', singular: 'restaurant', near: 'near', heading: 'Restaurants', tail: 'Menus, prices, reviews.' },
    de: { noun: 'Restaurants', singular: 'Restaurant', near: 'in der Nähe von', heading: 'Restaurants', tail: 'Speisekarten, Preise, Bewertungen.' },
    bg: { noun: 'ресторанта', singular: 'ресторант', near: 'близо до', heading: 'Ресторанти', tail: 'Менюта, цени, отзиви.' },
    ru: { noun: 'ресторанов', singular: 'ресторан', near: 'рядом с', heading: 'Рестораны', tail: 'Меню, цены, отзывы.' },
    ro: { noun: 'restaurante', singular: 'restaurant', near: 'lângă', heading: 'Restaurante', tail: 'Meniuri, prețuri, recenzii.' },
    sr: { noun: 'restorana', singular: 'restoran', near: 'kod', heading: 'Restorani', tail: 'Meniji, cene, recenzije.' },
  },
  activities: {
    el: { noun: 'δραστηριότητες', singular: 'δραστηριότητα', near: 'κοντά στο', heading: 'Δραστηριότητες', tail: 'Πληροφορίες, τιμές, κρατήσεις.' },
    en: { noun: 'activities', singular: 'activity', near: 'near', heading: 'Activities', tail: 'Info, prices, booking.' },
    de: { noun: 'Aktivitäten', singular: 'Aktivität', near: 'in der Nähe von', heading: 'Aktivitäten', tail: 'Info, Preise, Buchung.' },
    bg: { noun: 'дейности', singular: 'дейност', near: 'близо до', heading: 'Дейности', tail: 'Информация, цени, резервации.' },
    ru: { noun: 'занятий', singular: 'занятие', near: 'рядом с', heading: 'Активности', tail: 'Инфо, цены, бронирование.' },
    ro: { noun: 'activități', singular: 'activitate', near: 'lângă', heading: 'Activități', tail: 'Informații, prețuri, rezervări.' },
    sr: { noun: 'aktivnosti', singular: 'aktivnost', near: 'kod', heading: 'Aktivnosti', tail: 'Informacije, cene, rezervacije.' },
  },
};

const HALKIDIKI: Record<string, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki',
};

/** Format a distance for display: "800 m" under 1 km, else "3.2 km". */
export function formatKm(km: number, locale: string): string {
  const kmWord = locale === 'el' ? 'χλμ' : locale === 'de' ? 'km' : locale === 'bg' ? 'км' : locale === 'ru' ? 'км' : 'km';
  const mWord = locale === 'el' ? 'μ' : locale === 'bg' ? 'м' : locale === 'ru' ? 'м' : 'm';
  if (km < 1) return `${Math.round(km * 100) * 10} ${mWord}`; // nearest 10 m
  return `${km.toFixed(1)} ${kmWord}`;
}

type GeoRow = {
  slug: string;
  latitude: number | null;
  longitude: number | null;
  rating?: number | null;
};

export type NearestItem = { slug: string; name: string; km: number; rating: number };

/**
 * Sort geo-tagged rows by real great-circle distance from an origin and keep
 * the nearest `limit`. Rows without usable coordinates are dropped. Shared by
 * the page render and the metadata builder (via fetchContext) so ordering and
 * counts always agree.
 */
export function nearestByDistance<T extends GeoRow>(
  originLat: number,
  originLng: number,
  rows: T[],
  limit = NEAREST_LIMIT,
): Array<T & { distanceKm: number }> {
  return rows
    .filter((r) => r.latitude != null && r.longitude != null && r.latitude !== 0 && r.longitude !== 0)
    .map((r) => ({ ...r, distanceKm: haversineKm(originLat, originLng, r.latitude as number, r.longitude as number) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

async function fetchContext(slug: string, locale: string, contentType: ContentType) {
  const supabase = createApiClient();
  const { data: villageData } = await supabase.from('villages')
    .select('area, latitude, longitude, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr')
    .eq('slug', slug).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (villageData ?? {}) as any;
  const villageName: string = v[`name_${locale}`] || v.name_el || v.name_en || slug;
  const area: string = v.area || '';
  const vLat = typeof v.latitude === 'number' ? v.latitude : null;
  const vLng = typeof v.longitude === 'number' ? v.longitude : null;

  // Pull the area's geo-tagged items and rank them by real distance to the
  // village — this is what makes each village page genuinely distinct rather
  // than a rating-sorted clone of every other village on the same leg.
  const { data: itemRows } = await supabase.from(contentType)
    .select('slug, latitude, longitude, rating, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr')
    .eq('area', area);

  const areaInfo = AREAS.find(a => a.slug === area);
  const areaLocaleMap = (areaInfo?.name ?? {}) as Record<string, string>;
  const areaName = areaLocaleMap[locale] || areaLocaleMap.el || area;

  const rows = (itemRows || []) as GeoRow[];
  let nearest: NearestItem[] = [];
  let withinRadius = 0;
  if (vLat != null && vLng != null) {
    const ranked = nearestByDistance(vLat, vLng, rows, NEAREST_LIMIT);
    nearest = ranked.map((r) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slug: r.slug, name: (r as any)[`name_${locale}`] || (r as any).name_el || (r as any).name_en || r.slug,
      km: r.distanceKm, rating: Number(r.rating) || 0,
    }));
    // Honest "N near X" count uses the whole area set within the radius, not
    // just the capped nearest list.
    withinRadius = nearestByDistance(vLat, vLng, rows, rows.length)
      .filter((r) => r.distanceKm <= NEARBY_RADIUS_KM).length;
  } else {
    // No village coordinates (shouldn't happen — 100% coverage) → fall back to
    // rating order so the page still renders something sensible.
    nearest = rows.slice(0, NEAREST_LIMIT).map((r) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      slug: r.slug, name: (r as any)[`name_${locale}`] || (r as any).name_el || (r as any).name_en || r.slug,
      km: 0, rating: Number(r.rating) || 0,
    }));
    withinRadius = nearest.length;
  }

  return { villageName, areaName, nearest, withinRadius, total: rows.length };
}

/** H1 heading: honest "N beaches near X" where N is what we actually show. */
function buildHeading(
  L: (typeof SUBPAGE_L10N)[ContentType][string], villageName: string, shown: number,
): string {
  return shown >= 3
    ? `${shown} ${L.noun} ${L.near} ${villageName}`
    : `${L.heading} ${L.near} ${villageName}`;
}

/**
 * Unique, distance-aware intro paragraph — different for every village.
 * `shown` = how many cards we render (nearest-first); `withinRadius` = how many
 * exist inside NEARBY_RADIUS_KM (context, may exceed `shown`).
 */
function buildIntro(
  locale: string, L: (typeof SUBPAGE_L10N)[ContentType][string],
  villageName: string, areaName: string, nearest: NearestItem[], withinRadius: number,
): string {
  const halk = HALKIDIKI[locale] || 'Halkidiki';
  const shown = nearest.length;
  if (shown === 0) {
    return `${L.heading} ${L.near} ${villageName}, ${halk}. ${L.tail}`;
  }
  const top = nearest[0];
  const dist = formatKm(top.km, locale);
  if (top.km <= 0) {
    // No-coords fallback: keep it generic but still village-specific.
    return `${shown} ${L.noun} ${L.near} ${villageName} (${areaName}, ${halk}). ${L.tail}`;
  }
  // "just/μόλις" only reads naturally for genuinely close spots.
  const near = top.km < 5;
  if (locale === 'el') {
    const within = withinRadius > shown
      ? ` Σε ακτίνα ${NEARBY_RADIUS_KM} χλμ υπάρχουν ${withinRadius} ${L.noun}· παρακάτω οι ${shown} κοντινότερες στο ${villageName}, με σειρά απόστασης.`
      : ` Ταξινομημένες κατά απόσταση από το ${villageName}.`;
    return `Η πιο κοντινή ${L.singular} στο ${villageName} (${areaName}) είναι η ${top.name}, ${near ? 'μόλις ' : 'σε '}${dist}.${within} ${L.tail}`;
  }
  const within = withinRadius > shown
    ? ` Within ${NEARBY_RADIUS_KM} km there are ${withinRadius} ${L.noun}; below are the ${shown} closest to ${villageName}, ordered by distance.`
    : ` Ordered by distance from ${villageName}.`;
  return `The closest ${L.singular} to ${villageName} (${areaName}) is ${top.name}, ${near ? 'just ' : ''}${dist} away.${within} ${L.tail}`;
}

/** Shared server lookup — drives both metadata and SSR'd H1/intro on the page. */
export async function getVillageContext(
  slug: string, locale: string, contentType: ContentType
): Promise<{ villageName: string; heading: string; description: string; intro: string }> {
  const ctx = await fetchContext(slug, locale, contentType);
  const L = SUBPAGE_L10N[contentType][locale] || SUBPAGE_L10N[contentType].en;
  const heading = buildHeading(L, ctx.villageName, ctx.nearest.length);
  const intro = buildIntro(locale, L, ctx.villageName, ctx.areaName, ctx.nearest, ctx.withinRadius);
  // `description` kept for backward-compat callers; mirror the intro (plain).
  return { villageName: ctx.villageName, heading, description: intro, intro };
}

export async function getVillageContentMeta(
  slug: string, locale: string, contentType: ContentType
): Promise<Metadata> {
  const ctx = await fetchContext(slug, locale, contentType);
  const L = SUBPAGE_L10N[contentType][locale] || SUBPAGE_L10N[contentType].en;
  const halk = HALKIDIKI[locale] || 'Halkidiki';

  const shown = ctx.nearest.length;
  const title = buildHeading(L, ctx.villageName, shown) + `, ${halk}`;
  // Meta description leads with the nearest item + distance (unique per village).
  const top = ctx.nearest[0];
  const lead = top && top.km > 0
    ? (locale === 'el'
        ? `Κοντινότερη: ${top.name} (${formatKm(top.km, locale)}). `
        : `Closest: ${top.name} (${formatKm(top.km, locale)}). `)
    : '';
  const description = `${lead}${shown >= 3 ? `${shown} ${L.noun} ${L.near} ${ctx.villageName} (${ctx.areaName}, ${halk}). ` : `${L.heading} ${L.near} ${ctx.villageName}, ${halk}. `}${L.tail}`.trim();

  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `places/${slug}/${contentType}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `places/${slug}/${contentType}`)])),
        'x-default': localeUrl('el', `places/${slug}/${contentType}`),
      },
    },
  };
}
