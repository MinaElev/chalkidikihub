// Coordinates for the 8 origin cities served by /from/[city]. Used as
// anchors when computing approximate driving distance to Halkidiki villages.
export const FROM_CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  sofia: { lat: 42.6977, lon: 23.3219 },
  bucharest: { lat: 44.4268, lon: 26.1025 },
  belgrade: { lat: 44.7866, lon: 20.4489 },
  thessaloniki: { lat: 40.6401, lon: 22.9444 },
  munich: { lat: 48.1351, lon: 11.5820 },
  istanbul: { lat: 41.0082, lon: 28.9784 },
  skopje: { lat: 41.9981, lon: 21.4254 },
  athens: { lat: 37.9838, lon: 23.7275 },
};

// Pure city names per locale (no "From X to Halkidiki" wrapper). Avoids the
// brittle title-string parsing that conflated city + destination.
export const FROM_CITY_NAMES: Record<string, Record<string, string>> = {
  sofia:        { el: 'Σόφια',            en: 'Sofia',        de: 'Sofia',     bg: 'София',       ru: 'София',     ro: 'Sofia',      sr: 'Софија' },
  bucharest:    { el: 'Βουκουρέστι',       en: 'Bucharest',    de: 'Bukarest',  bg: 'Букурещ',     ru: 'Бухарест',  ro: 'București',  sr: 'Букурешт' },
  belgrade:     { el: 'Βελιγράδι',         en: 'Belgrade',     de: 'Belgrad',   bg: 'Белград',     ru: 'Белград',   ro: 'Belgrad',    sr: 'Београд' },
  thessaloniki: { el: 'Θεσσαλονίκη',       en: 'Thessaloniki', de: 'Thessaloniki', bg: 'Солун',    ru: 'Салоники',  ro: 'Salonic',    sr: 'Солун' },
  munich:       { el: 'Μόναχο',            en: 'Munich',       de: 'München',   bg: 'Мюнхен',      ru: 'Мюнхен',    ro: 'München',    sr: 'Минхен' },
  istanbul:     { el: 'Κωνσταντινούπολη',  en: 'Istanbul',     de: 'Istanbul',  bg: 'Истанбул',    ru: 'Стамбул',   ro: 'Istanbul',   sr: 'Истанбул' },
  skopje:       { el: 'Σκόπια',            en: 'Skopje',       de: 'Skopje',    bg: 'Скопие',      ru: 'Скопье',    ro: 'Skopje',     sr: 'Скопље' },
  athens:       { el: 'Αθήνα',             en: 'Athens',       de: 'Athen',     bg: 'Атина',       ru: 'Афины',     ro: 'Atena',      sr: 'Атина' },
};

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Road network in the Balkans / Greece adds ~30–40% to straight-line distance
// vs. mountainous terrain and indirect motorway routing. 1.4 is the empirical
// midpoint we use across the site.
const ROAD_FACTOR = 1.4;

export function estimateRoadKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return Math.round(haversineKm(lat1, lon1, lat2, lon2) * ROAD_FACTOR);
}

export type DriveTime = { hours: number; minutes: number };

export function estimateDriveTime(km: number): DriveTime {
  // Long trips are mostly motorway (~85 km/h effective incl. tolls/breaks).
  // Short trips run through villages and the toll-less coastal roads (~55 km/h).
  const avgSpeed = km > 200 ? 85 : km > 80 ? 70 : 55;
  const totalMinutes = Math.round((km / avgSpeed) * 60);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

const TIME_LABELS: Record<string, { h: string; m: string; sep: string }> = {
  el: { h: 'ώ', m: 'λ', sep: ' ' },
  en: { h: 'h', m: 'min', sep: ' ' },
  de: { h: 'h', m: 'min', sep: ' ' },
  bg: { h: 'ч', m: 'мин', sep: ' ' },
  ru: { h: 'ч', m: 'мин', sep: ' ' },
  ro: { h: 'h', m: 'min', sep: ' ' },
  sr: { h: 'ч', m: 'мин', sep: ' ' },
};

export function formatDriveTime(t: DriveTime, locale: string): string {
  const L = TIME_LABELS[locale] || TIME_LABELS.en;
  if (t.hours === 0) return `${t.minutes} ${L.m}`;
  if (t.minutes === 0) return `${t.hours} ${L.h}`;
  return `${t.hours} ${L.h}${L.sep}${t.minutes} ${L.m}`;
}
