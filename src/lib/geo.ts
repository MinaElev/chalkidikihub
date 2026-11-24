export type LatLng = { latitude: number | null; longitude: number | null };

export const hasCoords = (p: LatLng): p is { latitude: number; longitude: number } =>
  p.latitude != null && p.longitude != null && !(p.latitude === 0 && p.longitude === 0);

/** Great-circle distance in km. */
export function distanceKm(a: LatLng, b: LatLng): number {
  if (!hasCoords(a) || !hasCoords(b)) return Number.POSITIVE_INFINITY;
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLng = ((b.longitude - a.longitude) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.latitude * Math.PI) / 180) * Math.cos((b.latitude * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Items sorted by distance from `origin`, with `distanceKm` attached. */
export function nearest<T extends LatLng>(origin: LatLng, items: T[], limit = Infinity, maxKm = Infinity) {
  return items
    .map((item) => ({ item, km: distanceKm(origin, item) }))
    .filter((x) => Number.isFinite(x.km) && x.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

/** Rounds for display: 0.4 → 0.4, 3.26 → 3.3, 14.7 → 15. */
export const roundKm = (km: number) => (km < 10 ? Math.round(km * 10) / 10 : Math.round(km));

/** Rough driving time on Chalkidiki's coastal roads (~45 km/h average incl. bends). */
export const driveMinutes = (km: number) => Math.max(2, Math.round((km * 1.3 * 60) / 45));

export const mapsDirectionsUrl = (p: { latitude: number; longitude: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;

/**
 * Where the map pickers start (Toroneos gulf — open sea). A listing saved
 * with its pin still here (or nudged a few hundred metres) was never placed
 * by its owner, so the public map would show it in the sea.
 */
export const DEFAULT_PIN = { latitude: 40.1, longitude: 23.6 } as const;

/** True when the pin is missing or still within 1.5 km of DEFAULT_PIN (all sea). */
export function isUnsetPin(latitude: number | null | undefined, longitude: number | null | undefined): boolean {
  if (latitude == null || longitude == null || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return true;
  return distanceKm({ latitude, longitude }, DEFAULT_PIN) < 1.5;
}

export const UNSET_PIN_MESSAGE_EL =
  'Η πινέζα του χάρτη είναι ακόμα στην αρχική θέση, μέσα στη θάλασσα. Σύρετέ την ή κάντε κλικ στον χάρτη, στο σημείο όπου βρίσκεται το κατάλυμα.';
