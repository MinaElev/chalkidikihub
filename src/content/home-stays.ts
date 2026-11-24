/**
 * Stays allowed on the home page. Chosen by looking at every published
 * listing's cover photo (Nov 2026): bright exterior, pool, sea-view or garden
 * shots only. No dark rooms, bathrooms, text overlays or plain facades.
 * Add a slug here when a new stay has a cover worth showing on the front page.
 */
export const HOME_STAY_SLUGS = [
  'amira-house-sithonia-sykia-chalkidikis',
  'souita-me-idiotiki-pisina-n-fokaia',
  'local-seaview-polichrono',
  'pool-villa-poseidi-possidi',
  'leisurenest-villa-pefkohori',
  'thespis-villa-3-sykia',
  'thespis-villa-1-sykia',
  'thespis-villa-2-sukia',
  'viewgalini-app-agios-nikolaos',
  'alinas-house-trani-ammouda-ormos-panagias',
  'serenity-groundap-sykia',
  'ammos-studio-klimataria',
  'forest-aelia-sea-view-vourvourou',
  'seaview-giannas-neos-marmaras',
  'chill-innature-seaview-valti-beach-sykia',
  'villa-doxa-sarti',
  'mini-boutique-dragani-sykia-chalkidiki',
  'five-senses-luxury-villas-vourvourou',
  'aloe-the-green-suites-nikiti',
  'nuestro-jardin-villa-sykia',
  'xenodocheio-gerakini',
  'hotel-paraktio-nea-kallikrateia',
];

/** Always the first stay on the home page, live calendar or not. */
const HOME_PINNED_STAY = 'amira-house';

/**
 * The home page's `size` stays: Amira House first, then Premium stays (the
 * plan promises them prominence), then a rotating pick from HOME_STAY_SLUGS,
 * the stays whose cover photo is good enough for the front page. At least one
 * of the others has live (iCal-synced) availability. The pick rotates every
 * hour (the page revalidates hourly), so every chosen stay gets its turn.
 * If the list ever runs short, the usual order fills the gap.
 */
export function pickHomeStays<T extends { id: string; slug: string; featured?: boolean }>(stays: T[], live: Set<string>, size: number): T[] {
  const hour = Math.floor(Date.now() / 3_600_000);
  const rotate = <U,>(list: U[]) => (list.length ? [...list.slice(hour % list.length), ...list.slice(0, hour % list.length)] : list);
  const pinned = stays.find((s) => s.slug.startsWith(HOME_PINNED_STAY));
  const premium = stays.filter((s) => s !== pinned && s.featured);
  const chosen = new Set(HOME_STAY_SLUGS);
  const pool = rotate(stays.filter((s) => s !== pinned && !s.featured && chosen.has(s.slug)));
  const rest = stays.filter((s) => s !== pinned && !s.featured && !chosen.has(s.slug));
  const shown = [...(pinned ? [pinned] : []), ...premium, ...pool, ...rest].slice(0, size);

  // Guarantee one live stay besides the pinned one, swapped in for the last ordinary card.
  const isOtherLive = (s: T) => s !== pinned && live.has(s.id);
  if (!shown.some(isOtherLive)) {
    const liveStay = [...pool, ...rest].find((s) => live.has(s.id) && !shown.includes(s));
    const slot = shown.map((s, i) => (s !== pinned && !s.featured ? i : -1)).filter((i) => i >= 0).pop();
    if (liveStay && slot !== undefined) shown[slot] = liveStay;
  }
  return shown;
}
