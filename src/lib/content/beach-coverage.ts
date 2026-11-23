import points from '@/content/osm-beach-points.json';

/**
 * Our beach table does not hold every beach (2026-11-23: for 28 of 84
 * restaurants OpenStreetMap has a closer, unlisted beach). A page may call a
 * beach "the nearest" only when no mapped beach is clearly closer.
 * Points: every natural=beach in Chalkidiki, audit/sources/osm-beaches-chalkidiki-2026-11-23.json.
 */
const MARGIN_KM = 0.3;

function km(aLat: number, aLng: number, bLat: number, bLng: number) {
  const r = Math.PI / 180;
  const s = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLng - aLng) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

export function isNearestBeach(from: { latitude: number | null; longitude: number | null }, ourKm: number): boolean {
  if (from.latitude == null || from.longitude == null) return false;
  const { latitude: lat, longitude: lng } = from;
  return !(points as Array<[number, number]>).some(([pLat, pLng]) => km(lat, lng, pLat, pLng) < ourKm - MARGIN_KM);
}
