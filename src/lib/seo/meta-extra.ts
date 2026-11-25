import 'server-only';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { hasCoords, type LatLng } from '@/lib/geo';
import { displayName, nearBeaches } from '@/lib/content/nearby';
import { formatDistance } from '@/lib/content/format';
import { isNearestBeach } from '@/lib/content/beach-coverage';

/**
 * "Nearest beach: X, 1.2 km away." for a meta description (long, then short),
 * under the same rule the page body uses: only when no mapped beach that we
 * don't list is clearly closer (isNearestBeach). Otherwise the claim drops to
 * "Beach nearby: X, 1.2 km away.", which stays true. Nothing beyond `maxKm`.
 */
export async function nearestBeachExtra(
  from: LatLng,
  locale: Locale,
  maxKm = 10,
): Promise<string[] | null> {
  if (!hasCoords(from)) return null;
  const near = (await nearBeaches(from, 1))[0];
  if (!near || near.km > maxKm) return null;
  const more = await getTranslations({ locale, namespace: 'metaExtra' });
  const beach = displayName(near.item, locale, 'beach');
  const km = formatDistance(near.km, locale);
  return isNearestBeach(from, near.km)
    ? [more('nearestBeach', { beach, km }), more('nearestBeachShort', { beach })]
    : [more('beachNearby', { beach, km }), more('beachNearbyShort', { beach })];
}
