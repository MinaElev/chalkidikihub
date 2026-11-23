import 'server-only';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getBeaches, getListings, getLiveCalendarListingIds } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { hasCoords, nearest } from '@/lib/geo';
import { formatDistance, formatPrice } from '@/lib/content/format';
import type { CardFact } from '@/components/ui/Card';
import type { StayItem } from '@/components/v3/StaysExplorer';

/** Amenities shown as icons on stay cards, in this order (the ones guests ask about most). */
const CARD_FACTS: CardFact['key'][] = ['pool', 'seaView', 'airConditioning', 'wifi', 'petsAllowed', 'parking'];

/**
 * Every open stay as a ready-made card, in the server's order (Premium first,
 * then the most recently updated). Used by /listings for its first ten per
 * area and by /api/stays for the rest, so both render identical cards.
 */
export async function buildStayItems(locale: Locale): Promise<StayItem[]> {
  const [t, common, amenityT, items, liveIds, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'amenities' }),
    getListings(),
    getLiveCalendarListingIds(),
    getBeaches(),
  ]);
  const beachPoints = beaches.filter(hasCoords);
  const live = new Set(liveIds);
  const open = items.filter((l) => !l.is_closed);
  const villages = await closestVillagesFor(open, locale, 6);

  return open.map((l) => {
    const beach = nearest(l, beachPoints, 1, 3)[0];
    const has = new Set(l.amenities ?? []);
    return {
      slug: l.slug,
      area: l.area,
      price: l.price_per_night ? Number(l.price_per_night) : null,
      amenities: l.amenities ?? [],
      updated: l.updated_at,
      live: live.has(l.id),
      card: {
        href: `/listings/${l.slug}`,
        favorite: { type: 'listing' as const, slug: l.slug },
        title: displayName(l, locale, 'listing'),
        eyebrow: villages.get(l.slug),
        image: l.cover_url,
        highlight: l.featured ? t('featured') : undefined,
        live: live.has(l.id) ? t('liveAvailability') : undefined,
        meta: t('guests', { count: l.guests_max }),
        price: l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${t('perNight')}` : undefined,
        facts: CARD_FACTS.filter((k) => has.has(k)).slice(0, 3).map((key) => ({ key, label: amenityT(key) })),
        // Nearest beach within 3 km, with the distance: the second question every guest asks.
        note: beach ? t('nearBeach', { name: displayName(beach.item, locale, 'beach'), km: formatDistance(beach.km, locale) }) : undefined,
        ...ratingProps(l, 'listing'),
      },
    };
  });
}
