import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createApiClient } from '@/lib/api-helpers';
import { JsonLd } from '@/components/ui/JsonLd';
import { localeUrl } from '@/lib/seo';
import { ChevronRight, MapPin, UtensilsCrossed, Waves, Compass, Clock, Phone, Star, Footprints, Car } from 'lucide-react';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;
type Locale = typeof LOCALES[number];

// Page opts in to ISR; area + POI data doesn't change often.
export const revalidate = 86400; // 24h

type Props = { params: Promise<{ locale: string; slug: string }> };

// ─── Geo helpers ────────────────────────────────────────────────────
/** Haversine distance in metres. Good enough for <50km scale. */
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(m: number, locale: Locale): string {
  if (m < 1000) return `${Math.round(m)} m`;
  const km = m / 1000;
  if (locale === 'el' || locale === 'bg' || locale === 'ru') return `${km.toFixed(1)} χλμ`.replace('χλμ', locale === 'el' ? 'χλμ' : 'km');
  return `${km.toFixed(1)} km`;
}

/** Rough walking minutes (4.5 km/h) */
function walkMinutes(m: number): number {
  return Math.round(m / 75);
}
/** Rough driving minutes (35 km/h on rural roads) */
function driveMinutes(m: number): number {
  return Math.max(1, Math.round(m / 583));
}

// ─── Tiny i18n layer — just the strings the guide needs ─────────────
const T: Record<Locale, Record<string, string>> = {
  el: {
    breadcrumbHome: 'Αρχική', breadcrumbStays: 'Καταλύματα', breadcrumbGuide: 'Οδηγός περιοχής',
    h1Prefix: 'Οδηγός περιοχής',
    subhead: 'Όλα όσα αξίζει να δεις, να φας και να ζήσεις γύρω από',
    nearbyBeaches: 'Παραλίες στα πόδια σας',
    nearbyBeachesIntro: 'Οι πιο κοντινές παραλίες, ταξινομημένες κατά απόσταση από το κατάλυμα.',
    nearbyRestaurants: 'Εστιατόρια κοντά σας',
    nearbyRestaurantsIntro: 'Ταβερνάκια, μεζεδοπωλεία και εστιατόρια — τοπικό φαγητό στα καλύτερά του.',
    nearbyActivities: 'Δραστηριότητες & εμπειρίες',
    nearbyActivitiesIntro: 'Τι να κάνεις όσο μένεις εδώ — από καταδύσεις μέχρι πεζοπορία.',
    itineraryTitle: 'Προτεινόμενη 3ήμερη διαδρομή',
    itineraryIntro: 'Φτιάξαμε ένα έτοιμο πρόγραμμα για να μην χάνεις χρόνο στο σχεδιασμό.',
    day1: 'Ημέρα 1 — Χαλαρά στην παραλία', day2: 'Ημέρα 2 — Γεύσεις & χωριό', day3: 'Ημέρα 3 — Εξερεύνηση',
    faqTitle: 'Συχνές ερωτήσεις',
    gettingThereQ: 'Πώς φτάνω στο',
    gettingThereA: 'Από το αεροδρόμιο Θεσσαλονίκης (SKG) ο δρόμος για',
    gettingThereA2: 'είναι περίπου 2 ώρες οδικώς. Θα χρειαστείς αυτοκίνητο — τα λεωφορεία στη Χαλκιδική είναι αραιά και δεν περνούν κοντά στα περισσότερα καταλύματα.',
    whenToComeQ: 'Πότε είναι η καλύτερη εποχή;',
    whenToComeA: 'Ιούνιος-Σεπτέμβριος για θαλάσσια, με αιχμή τον Αύγουστο. Μάιος & Οκτώβριος για ήσυχες παραλίες και χαμηλότερες τιμές.',
    rentCarQ: 'Χρειάζομαι αυτοκίνητο;', rentCarA: 'Πρακτικά ναι. Οι παραλίες της περιοχής είναι σκορπισμένες και ένα αυτοκίνητο σου ξεκλειδώνει ολόκληρη τη Σιθωνία.',
    seeProperty: 'Δες το κατάλυμα', backToStay: 'Επιστροφή στο',
    cta: 'Έτοιμος να κλείσεις;', ctaText: 'Κράτηση απευθείας — 0% προμήθεια OTA.',
    walk: 'περπάτημα', drive: 'με αμάξι', from: 'από το κατάλυμα',
    moreInfo: 'Περισσότερα', rating: 'Βαθμολογία',
  },
  en: {
    breadcrumbHome: 'Home', breadcrumbStays: 'Stays', breadcrumbGuide: 'Area guide',
    h1Prefix: 'Area guide',
    subhead: 'Everything worth seeing, eating and doing around',
    nearbyBeaches: 'Beaches on your doorstep',
    nearbyBeachesIntro: 'The closest beaches, sorted by distance from this property.',
    nearbyRestaurants: 'Restaurants near you',
    nearbyRestaurantsIntro: 'Tavernas, ouzeris and restaurants — local Greek food at its best.',
    nearbyActivities: 'Activities & experiences',
    nearbyActivitiesIntro: 'What to do while you\'re here — from diving to hiking.',
    itineraryTitle: 'Suggested 3-day itinerary',
    itineraryIntro: 'A ready-made plan so you don\'t waste time researching on arrival.',
    day1: 'Day 1 — Easy day at the beach', day2: 'Day 2 — Food & village life', day3: 'Day 3 — Exploring further',
    faqTitle: 'Frequently asked',
    gettingThereQ: 'How do I get to',
    gettingThereA: 'From Thessaloniki airport (SKG),',
    gettingThereA2: 'is about a 2-hour drive. You\'ll need a car — public buses in Halkidiki are sparse and don\'t reach most properties.',
    whenToComeQ: 'When is the best time to visit?',
    whenToComeA: 'June–September for the sea, peak in August. May & October for quiet beaches and lower rates.',
    rentCarQ: 'Do I need a rental car?', rentCarA: 'In practice yes. The area\'s best beaches are scattered — a car unlocks all of Sithonia.',
    seeProperty: 'View this property', backToStay: 'Back to',
    cta: 'Ready to book?', ctaText: 'Book direct — 0% OTA commission.',
    walk: 'walk', drive: 'drive', from: 'from the property',
    moreInfo: 'More info', rating: 'Rating',
  },
  de: {
    breadcrumbHome: 'Startseite', breadcrumbStays: 'Unterkünfte', breadcrumbGuide: 'Gebietsführer',
    h1Prefix: 'Gebietsführer',
    subhead: 'Alles Sehenswerte rund um',
    nearbyBeaches: 'Strände in der Nähe', nearbyBeachesIntro: 'Die nächstgelegenen Strände, nach Entfernung sortiert.',
    nearbyRestaurants: 'Restaurants in der Nähe', nearbyRestaurantsIntro: 'Tavernen und Restaurants — griechische Küche vom Feinsten.',
    nearbyActivities: 'Aktivitäten', nearbyActivitiesIntro: 'Was Sie unternehmen können — von Tauchen bis Wandern.',
    itineraryTitle: 'Empfohlener 3-Tages-Plan', itineraryIntro: 'Ein fertiger Plan — keine Recherche nötig.',
    day1: 'Tag 1 — Entspannt am Strand', day2: 'Tag 2 — Essen & Dorfleben', day3: 'Tag 3 — Weitere Erkundung',
    faqTitle: 'Häufige Fragen',
    gettingThereQ: 'Wie komme ich nach', gettingThereA: 'Vom Flughafen Thessaloniki (SKG) sind es nach',
    gettingThereA2: 'etwa 2 Stunden mit dem Auto. Ein Mietwagen ist empfehlenswert — Busse sind selten.',
    whenToComeQ: 'Wann ist die beste Reisezeit?',
    whenToComeA: 'Juni–September zum Baden, Hochsaison August. Mai & Oktober für ruhige Strände.',
    rentCarQ: 'Brauche ich einen Mietwagen?', rentCarA: 'Praktisch ja — die schönsten Strände sind verstreut.',
    seeProperty: 'Unterkunft ansehen', backToStay: 'Zurück zu',
    cta: 'Bereit zu buchen?', ctaText: 'Direkt buchen — 0 % OTA-Provision.',
    walk: 'Fußweg', drive: 'Fahrt', from: 'von der Unterkunft',
    moreInfo: 'Mehr Infos', rating: 'Bewertung',
  },
  bg: {
    breadcrumbHome: 'Начало', breadcrumbStays: 'Настаняване', breadcrumbGuide: 'Пътеводител',
    h1Prefix: 'Пътеводител',
    subhead: 'Всичко около',
    nearbyBeaches: 'Близки плажове', nearbyBeachesIntro: 'Най-близките плажове, подредени по разстояние.',
    nearbyRestaurants: 'Ресторанти наблизо', nearbyRestaurantsIntro: 'Таверни и ресторанти с местна гръцка кухня.',
    nearbyActivities: 'Занимания', nearbyActivitiesIntro: 'Какво да правите — от гмуркане до туризъм.',
    itineraryTitle: 'Препоръчителен 3-дневен план', itineraryIntro: 'Готов план — без нужда от планиране.',
    day1: 'Ден 1 — Спокойствие на плажа', day2: 'Ден 2 — Храна и селски живот', day3: 'Ден 3 — Нататък',
    faqTitle: 'Често задавани въпроси',
    gettingThereQ: 'Как да стигна до', gettingThereA: 'От летище Солун (SKG) до',
    gettingThereA2: 'са около 2 часа с кола. Кола е препоръчителна — автобусите са редки.',
    whenToComeQ: 'Кога е най-доброто време?',
    whenToComeA: 'Юни–септември, пик август. Май и октомври за по-тихи плажове.',
    rentCarQ: 'Трябва ли ми кола под наем?', rentCarA: 'Практически да — плажовете са разпръснати.',
    seeProperty: 'Виж имота', backToStay: 'Обратно към',
    cta: 'Готови за резервация?', ctaText: 'Директна резервация — 0% комисионна.',
    walk: 'пеш', drive: 'с кола', from: 'от имота',
    moreInfo: 'Повече', rating: 'Оценка',
  },
  ru: {
    breadcrumbHome: 'Главная', breadcrumbStays: 'Проживание', breadcrumbGuide: 'Путеводитель',
    h1Prefix: 'Путеводитель',
    subhead: 'Всё вокруг',
    nearbyBeaches: 'Пляжи поблизости', nearbyBeachesIntro: 'Ближайшие пляжи по расстоянию.',
    nearbyRestaurants: 'Рестораны рядом', nearbyRestaurantsIntro: 'Таверны и рестораны — местная греческая кухня.',
    nearbyActivities: 'Занятия', nearbyActivitiesIntro: 'Чем заняться — от дайвинга до походов.',
    itineraryTitle: 'Рекомендуемый план на 3 дня', itineraryIntro: 'Готовый маршрут — планировать не нужно.',
    day1: 'День 1 — Отдых на пляже', day2: 'День 2 — Еда и сельская жизнь', day3: 'День 3 — Исследования',
    faqTitle: 'Частые вопросы',
    gettingThereQ: 'Как добраться до', gettingThereA: 'От аэропорта Салоники (SKG) до',
    gettingThereA2: 'около 2 часов на машине. Рекомендуется арендовать авто — автобусы редкие.',
    whenToComeQ: 'Когда лучше приезжать?',
    whenToComeA: 'Июнь–сентябрь, пик — август. Май и октябрь для тихих пляжей.',
    rentCarQ: 'Нужна ли машина в аренду?', rentCarA: 'На практике — да. Пляжи разбросаны.',
    seeProperty: 'Посмотреть жильё', backToStay: 'Назад к',
    cta: 'Готовы бронировать?', ctaText: 'Прямое бронирование — 0% комиссии.',
    walk: 'пешком', drive: 'на машине', from: 'от жилья',
    moreInfo: 'Подробнее', rating: 'Оценка',
  },
  ro: {
    breadcrumbHome: 'Acasă', breadcrumbStays: 'Cazări', breadcrumbGuide: 'Ghid zonă',
    h1Prefix: 'Ghid zonă',
    subhead: 'Tot ce merită văzut în jurul',
    nearbyBeaches: 'Plaje în apropiere', nearbyBeachesIntro: 'Cele mai apropiate plaje, sortate după distanță.',
    nearbyRestaurants: 'Restaurante din apropiere', nearbyRestaurantsIntro: 'Taverne și restaurante — bucătărie grecească autentică.',
    nearbyActivities: 'Activități', nearbyActivitiesIntro: 'Ce să faci aici — de la scufundări la drumeții.',
    itineraryTitle: 'Itinerar recomandat 3 zile', itineraryIntro: 'Un plan gata făcut — fără cercetare.',
    day1: 'Ziua 1 — Relaxare pe plajă', day2: 'Ziua 2 — Mâncare și sat', day3: 'Ziua 3 — Explorare',
    faqTitle: 'Întrebări frecvente',
    gettingThereQ: 'Cum ajung la', gettingThereA: 'De la aeroportul Salonic (SKG) până la',
    gettingThereA2: 'sunt aproximativ 2 ore cu mașina. O mașină de închiriat este recomandată — autobuzele sunt rare.',
    whenToComeQ: 'Când e cel mai bun moment?',
    whenToComeA: 'Iunie–septembrie pentru mare, vârf în august. Mai & octombrie pentru plaje liniștite.',
    rentCarQ: 'Am nevoie de mașină?', rentCarA: 'Practic, da — plajele sunt împrăștiate.',
    seeProperty: 'Vezi proprietatea', backToStay: 'Înapoi la',
    cta: 'Gata de rezervare?', ctaText: 'Rezervă direct — 0% comision OTA.',
    walk: 'mers pe jos', drive: 'cu mașina', from: 'de la proprietate',
    moreInfo: 'Mai multe', rating: 'Evaluare',
  },
  sr: {
    breadcrumbHome: 'Početna', breadcrumbStays: 'Smeštaj', breadcrumbGuide: 'Vodič kroz oblast',
    h1Prefix: 'Vodič kroz oblast',
    subhead: 'Sve što vredi videti oko',
    nearbyBeaches: 'Plaže u blizini', nearbyBeachesIntro: 'Najbliže plaže po rastojanju.',
    nearbyRestaurants: 'Restorani u blizini', nearbyRestaurantsIntro: 'Taverne i restorani — lokalna grčka kuhinja.',
    nearbyActivities: 'Aktivnosti', nearbyActivitiesIntro: 'Šta raditi ovde — od ronjenja do planinarenja.',
    itineraryTitle: 'Preporučeni 3-dnevni plan', itineraryIntro: 'Gotov plan — bez istraživanja.',
    day1: 'Dan 1 — Opuštanje na plaži', day2: 'Dan 2 — Hrana i selo', day3: 'Dan 3 — Istraživanje',
    faqTitle: 'Česta pitanja',
    gettingThereQ: 'Kako stići do', gettingThereA: 'Od aerodroma Solun (SKG) do',
    gettingThereA2: 'oko 2 sata vožnje. Preporučuje se rent-a-car — autobusi su retki.',
    whenToComeQ: 'Kada je najbolje vreme?',
    whenToComeA: 'Jun–septembar za plažu, vrhunac avgust. Maj i oktobar za mirnije plaže.',
    rentCarQ: 'Da li mi treba rent-a-car?', rentCarA: 'Praktično da — plaže su raštrkane.',
    seeProperty: 'Pogledaj smeštaj', backToStay: 'Nazad na',
    cta: 'Spremni za rezervaciju?', ctaText: 'Direktna rezervacija — 0% provizije.',
    walk: 'peške', drive: 'autom', from: 'od smeštaja',
    moreInfo: 'Više', rating: 'Ocena',
  },
};

// ─── Metadata ───────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = createApiClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('title_el, title_en, location_name, area, status, updated_at, listing_images(image_url, is_cover, sort_order)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (!listing) return { title: 'Area guide | ChalkidikiHub' };

  const l = locale as Locale;
  const t = T[l] || T.en;
  const row = listing as unknown as Record<string, string | null>;
  const propName = row[`title_${l}`] || row.title_el || row.title_en || '';
  const place = row.location_name || '';

  const title = `${t.h1Prefix}: ${place} — ${propName} | ChalkidikiHub`;
  const description =
    l === 'el'
      ? `Ανακάλυψε παραλίες, εστιατόρια και δραστηριότητες γύρω από ${propName} στη ${place}. Πλήρης οδηγός με αποστάσεις, διαδρομή 3 ημερών και πρακτικές συμβουλές.`
      : `Discover beaches, restaurants and activities around ${propName} in ${place}. Full guide with distances, 3-day itinerary and practical tips.`;

  // Pick cover image for OG/Twitter; fall back to first available or site default.
  const images = ((listing as unknown as { listing_images?: Array<{ image_url: string; is_cover: boolean; sort_order: number }> }).listing_images || [])
    .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order);
  const coverImage = images[0]?.image_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr'}/og-default.jpg`;
  const pageUrl = localeUrl(locale, `stay/${slug}/guide`);

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `stay/${slug}/guide`)])),
        'x-default': localeUrl('el', `stay/${slug}/guide`),
      },
    },
    openGraph: {
      title, description, type: 'article', locale, url: pageUrl,
      siteName: 'ChalkidikiHub',
      images: [{ url: coverImage, width: 1200, height: 630, alt: `${propName} — ${place}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description, images: [coverImage],
    },
  };
}

// ─── Row types ──────────────────────────────────────────────────────
interface PoiRow {
  id: string; slug: string;
  name_el: string | null; name_en: string | null;
  name_de: string | null; name_bg: string | null; name_ru: string | null; name_ro: string | null; name_sr: string | null;
  description_el: string | null; description_en: string | null;
  latitude: number | null; longitude: number | null;
  image_url: string | null; image_alt: string | null;
  rating: number | null; location_name: string | null;
  cuisine?: string | null; category?: string | null;
}

interface WithDistance<T> { item: T; distanceMeters: number }

function localizedName(row: PoiRow, locale: Locale): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((row as any)[`name_${locale}`] as string) || row.name_el || row.name_en || row.slug;
}
function localizedDesc(row: PoiRow, locale: Locale): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((row as any)[`description_${locale}`] as string) || row.description_el || row.description_en || '';
}

// ─── Main page ──────────────────────────────────────────────────────
export default async function StayGuidePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const l = (LOCALES.includes(locale as Locale) ? locale : 'el') as Locale;
  const t = T[l];

  const supabase = createApiClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('id, slug, title_el, title_en, title_de, title_bg, title_ru, title_ro, tagline_el, tagline_en, location_name, area, latitude, longitude, status, updated_at, listing_images(image_url, is_cover, sort_order)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (!listing) notFound();

  const lat = Number(listing.latitude) || 0;
  const lon = Number(listing.longitude) || 0;
  const area = listing.area || 'sithonia';
  const place = listing.location_name || 'Halkidiki';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const propName = ((listing as any)[`title_${l}`] as string) || listing.title_el || listing.title_en || 'property';

  // Fetch POIs across ALL areas so sparse areas (Kassandra has only 3 restaurants,
  // mainland only 2 beaches) still get a rich guide via distance-based fallback.
  // Haversine sort ensures we prefer the listing's own area naturally — nearby
  // POIs win, and Halkidiki is compact enough that a cross-area POI 15km away
  // is more useful than padding with a 2-item section.
  const beachCols = 'id,slug,name_el,name_en,name_de,name_bg,name_ru,name_ro,name_sr,description_el,description_en,latitude,longitude,image_url,image_alt,rating,location_name';
  const restCols = `${beachCols},cuisine`;
  const actCols = `${beachCols},category`;
  const [beachesRes, restaurantsRes, activitiesRes] = await Promise.all([
    supabase.from('beaches').select(beachCols),
    supabase.from('restaurants').select(restCols),
    supabase.from('activities').select(actCols),
  ]);

  function sortByDistance<T extends { latitude: number | null; longitude: number | null }>(rows: T[] | null): WithDistance<T>[] {
    return (rows || [])
      .filter(r => r.latitude != null && r.longitude != null)
      .map(r => ({ item: r, distanceMeters: haversineMeters(lat, lon, Number(r.latitude), Number(r.longitude)) }))
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  const beaches = sortByDistance(beachesRes.data as PoiRow[] | null).slice(0, 6);
  const restaurants = sortByDistance(restaurantsRes.data as PoiRow[] | null).slice(0, 8);
  const activities = sortByDistance(activitiesRes.data as PoiRow[] | null).slice(0, 6);

  // Cover image for schemas + related listings for internal linking.
  const listingImages = ((listing as unknown as { listing_images?: Array<{ image_url: string; is_cover: boolean; sort_order: number }> }).listing_images || [])
    .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order);
  const coverImage = listingImages[0]?.image_url || null;
  const listingUpdatedAt = (listing as unknown as { updated_at?: string }).updated_at || new Date().toISOString();

  // Prefer same-village listings (stronger topical signal for SEO + more useful for users).
  // Fall back to same-area if we don't have 4 in the same village.
  const relSelect = 'slug, title_el, title_en, title_de, title_bg, title_ru, title_ro, location_name, price_per_night, currency, listing_images(image_url, is_cover, sort_order)';
  const { data: sameVillage } = await supabase
    .from('listings').select(relSelect)
    .eq('status', 'published').eq('location_name', place).neq('slug', slug)
    .limit(4);
  let relatedRaw = sameVillage || [];
  if (relatedRaw.length < 4) {
    const exclude = [slug, ...relatedRaw.map(r => (r as { slug: string }).slug)];
    const { data: sameArea } = await supabase
      .from('listings').select(relSelect)
      .eq('status', 'published').eq('area', area).not('slug', 'in', `(${exclude.map(s => `"${s}"`).join(',')})`)
      .limit(4 - relatedRaw.length);
    relatedRaw = [...relatedRaw, ...(sameArea || [])];
  }
  type RelatedRow = {
    slug: string;
    title_el: string | null; title_en: string | null;
    title_de: string | null; title_bg: string | null; title_ru: string | null; title_ro: string | null;
    location_name: string | null; price_per_night: number | null; currency: string | null;
    listing_images: Array<{ image_url: string; is_cover: boolean; sort_order: number }> | null;
  };
  const related = (relatedRaw as unknown as RelatedRow[]).map(r => {
    const imgs = (r.listing_images || []).sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order);
    return {
      slug: r.slug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: ((r as any)[`title_${l}`] as string) || r.title_el || r.title_en || r.slug,
      place: r.location_name || '',
      cover: imgs[0]?.image_url || null,
      price: r.price_per_night,
      currency: r.currency || 'EUR',
    };
  });

  // Village body (rich intro for the Greek market; other locales get a shorter generic)
  // villages_body.json has HTML in description_el only.
  let villageBodyHtml: string | null = null;
  if (l === 'el') {
    try {
      const bodies = (await import('../../../../../../villages_body.json')).default as Array<{ slug: string; description_el: string }>;
      const match = bodies.find(b => (b.slug || '').toLowerCase() === place.toLowerCase() || b.slug === (listing.area === 'sithonia' ? 'sithonia' : ''));
      if (match?.description_el) villageBodyHtml = match.description_el;
    } catch { /* body file optional */ }
  }

  // ─── Structured data ─────────────────────────────────────────────
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.breadcrumbHome, item: localeUrl(l, '') },
      { '@type': 'ListItem', position: 2, name: t.breadcrumbStays, item: localeUrl(l, 'listings') },
      { '@type': 'ListItem', position: 3, name: propName, item: localeUrl(l, `stay/${slug}`) },
      { '@type': 'ListItem', position: 4, name: t.breadcrumbGuide, item: localeUrl(l, `stay/${slug}/guide`) },
    ],
  };

  const touristAttraction = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: `${place}, Halkidiki`,
    description: `${t.subhead} ${propName} — ${place}.`,
    geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lon },
    address: { '@type': 'PostalAddress', addressLocality: place, addressRegion: 'Halkidiki', addressCountry: 'GR' },
    url: localeUrl(l, `stay/${slug}/guide`),
    ...(coverImage ? { image: coverImage } : {}),
  };

  // Article schema — signals editorial content to Google, avoids duplicate-content
  // conflicts with the transactional /stay page schema (LodgingBusiness).
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${t.h1Prefix}: ${place}`,
    description: `${t.subhead} ${propName}.`,
    inLanguage: l,
    datePublished: listingUpdatedAt,
    dateModified: listingUpdatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': localeUrl(l, `stay/${slug}/guide`) },
    author: { '@type': 'Organization', name: 'ChalkidikiHub', url: localeUrl(l, '') },
    publisher: {
      '@type': 'Organization', name: 'ChalkidikiHub',
      logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr'}/logo.png` },
    },
    ...(coverImage ? { image: [coverImage] } : {}),
    about: { '@type': 'Place', name: `${place}, Halkidiki` },
  };

  const poisItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Points of interest near ${propName}`,
    numberOfItems: beaches.length + restaurants.length + activities.length,
    itemListElement: [
      ...beaches.map(({ item, distanceMeters }, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: {
          '@type': 'Beach', name: localizedName(item, l),
          url: localeUrl(l, `beaches/${item.slug}`),
          geo: { '@type': 'GeoCoordinates', latitude: item.latitude, longitude: item.longitude },
          additionalProperty: { '@type': 'PropertyValue', name: 'distanceFromStay', value: `${Math.round(distanceMeters)}m` },
        },
      })),
      ...restaurants.map(({ item, distanceMeters }, i) => ({
        '@type': 'ListItem', position: beaches.length + i + 1,
        item: {
          '@type': 'Restaurant', name: localizedName(item, l),
          url: localeUrl(l, `restaurants/${item.slug}`),
          servesCuisine: item.cuisine || 'Greek',
          additionalProperty: { '@type': 'PropertyValue', name: 'distanceFromStay', value: `${Math.round(distanceMeters)}m` },
        },
      })),
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `${t.gettingThereQ} ${place};`, acceptedAnswer: { '@type': 'Answer', text: `${t.gettingThereA} ${place} ${t.gettingThereA2}` } },
      { '@type': 'Question', name: t.whenToComeQ, acceptedAnswer: { '@type': 'Answer', text: t.whenToComeA } },
      { '@type': 'Question', name: t.rentCarQ, acceptedAnswer: { '@type': 'Answer', text: t.rentCarA } },
    ],
  };

  // ─── Render ──────────────────────────────────────────────────────
  const closestBeach = beaches[0];
  const closestRestaurant = restaurants[0];
  const closestActivity = activities[0];

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={touristAttraction} />
      <JsonLd data={articleSchema} />
      <JsonLd data={poisItemList} />
      <JsonLd data={faqPage} />

      <div className="bg-gradient-to-b from-sky-50 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5 flex-wrap">
            <Link href={`/${l === 'el' ? '' : l}`} className="hover:text-gray-800">{t.breadcrumbHome}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={`/${l === 'el' ? '' : l + '/'}listings`} className="hover:text-gray-800">{t.breadcrumbStays}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={`/${l === 'el' ? '' : l + '/'}stay/${slug}`} className="hover:text-gray-800 truncate max-w-[140px]">{propName}</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-gray-900 font-medium">{t.breadcrumbGuide}</span>
          </nav>

          {/* Hero — intentionally NOT the listing title. Area-first H1 for distinct SEO intent. */}
          <header className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-sky-700 bg-sky-100 px-2.5 py-1 rounded-full mb-3">
              <Compass className="w-3.5 h-3.5" /> {t.breadcrumbGuide}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
              {t.h1Prefix}: {place}
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {t.subhead} <strong className="text-gray-900">{propName}</strong>.
            </p>
            {/* Quick stats strip */}
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {closestBeach && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-sky-200 rounded-full px-3 py-1.5 text-sky-900">
                  <Waves className="w-3.5 h-3.5 text-sky-600" />
                  {localizedName(closestBeach.item, l)} · {formatDistance(closestBeach.distanceMeters, l)}
                </span>
              )}
              {closestRestaurant && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-amber-200 rounded-full px-3 py-1.5 text-amber-900">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                  {localizedName(closestRestaurant.item, l)} · {formatDistance(closestRestaurant.distanceMeters, l)}
                </span>
              )}
              {closestActivity && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 rounded-full px-3 py-1.5 text-emerald-900">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  {localizedName(closestActivity.item, l)} · {formatDistance(closestActivity.distanceMeters, l)}
                </span>
              )}
            </div>
          </header>

          {/* Optional village body — Greek gets the hand-written HTML */}
          {villageBodyHtml && (
            <section className="prose prose-sm sm:prose-base max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 mb-10"
              dangerouslySetInnerHTML={{ __html: villageBodyHtml }} />
          )}

          {/* Beaches */}
          {beaches.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-1">
                <Waves className="w-5 h-5 text-sky-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t.nearbyBeaches}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">{t.nearbyBeachesIntro}</p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {beaches.map(({ item, distanceMeters }, i) => (
                  <PoiCard key={item.id}
                    rank={i + 1}
                    href={`/${l === 'el' ? '' : l + '/'}beaches/${item.slug}`}
                    name={localizedName(item, l)}
                    image={item.image_url}
                    alt={item.image_alt || localizedName(item, l)}
                    description={localizedDesc(item, l)}
                    rating={item.rating}
                    distanceMeters={distanceMeters}
                    locale={l}
                    accent="sky"
                  />
                ))}
              </ol>
            </section>
          )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-1">
                <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t.nearbyRestaurants}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">{t.nearbyRestaurantsIntro}</p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {restaurants.map(({ item, distanceMeters }, i) => (
                  <PoiCard key={item.id}
                    rank={i + 1}
                    href={`/${l === 'el' ? '' : l + '/'}restaurants/${item.slug}`}
                    name={localizedName(item, l)}
                    image={item.image_url}
                    alt={item.image_alt || localizedName(item, l)}
                    description={localizedDesc(item, l)}
                    rating={item.rating}
                    distanceMeters={distanceMeters}
                    extraLine={item.cuisine || undefined}
                    locale={l}
                    accent="amber"
                  />
                ))}
              </ol>
            </section>
          )}

          {/* Activities */}
          {activities.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-1">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">{t.nearbyActivities}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">{t.nearbyActivitiesIntro}</p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activities.map(({ item, distanceMeters }, i) => (
                  <PoiCard key={item.id}
                    rank={i + 1}
                    href={`/${l === 'el' ? '' : l + '/'}activities/${item.slug}`}
                    name={localizedName(item, l)}
                    image={item.image_url}
                    alt={item.image_alt || localizedName(item, l)}
                    description={localizedDesc(item, l)}
                    rating={item.rating}
                    distanceMeters={distanceMeters}
                    extraLine={item.category || undefined}
                    locale={l}
                    accent="emerald"
                  />
                ))}
              </ol>
            </section>
          )}

          {/* Itinerary */}
          <section className="mb-12 bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-violet-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t.itineraryTitle}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-5">{t.itineraryIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ItineraryCard
                day={1} title={t.day1} locale={l}
                bullets={[
                  closestBeach ? `${l==='el'?'Πρωινό καφεδάκι, μετά στα':'Morning coffee, then to'} ${localizedName(closestBeach.item, l)}` : '',
                  closestRestaurant ? `${l==='el'?'Μεσημεριανό στο':'Lunch at'} ${localizedName(closestRestaurant.item, l)}` : '',
                  l==='el' ? 'Απόγευμα — χαλάρωση στο κατάλυμα' : 'Afternoon — relax at the property',
                ].filter(Boolean)}
              />
              <ItineraryCard
                day={2} title={t.day2} locale={l}
                bullets={[
                  l==='el' ? `Περίπατος στο ${place}` : `Stroll through ${place}`,
                  restaurants[1] ? `${l==='el'?'Μεσημεριανό στο':'Lunch at'} ${localizedName(restaurants[1].item, l)}` : '',
                  beaches[1] ? `${l==='el'?'Απογευματινό μπάνιο στην':'Afternoon swim at'} ${localizedName(beaches[1].item, l)}` : '',
                ].filter(Boolean)}
              />
              <ItineraryCard
                day={3} title={t.day3} locale={l}
                bullets={[
                  closestActivity ? `${l==='el'?'Πρωί':'Morning:'} ${localizedName(closestActivity.item, l)}` : '',
                  beaches[2] ? `${l==='el'?'Μεσημέρι στην':'Midday at'} ${localizedName(beaches[2].item, l)}` : '',
                  restaurants[2] ? `${l==='el'?'Δείπνο στο':'Dinner at'} ${localizedName(restaurants[2].item, l)}` : '',
                ].filter(Boolean)}
              />
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">{t.faqTitle}</h2>
            <div className="space-y-3">
              <FaqItem q={`${t.gettingThereQ} ${place};`} a={`${t.gettingThereA} ${place} ${t.gettingThereA2}`} />
              <FaqItem q={t.whenToComeQ} a={t.whenToComeA} />
              <FaqItem q={t.rentCarQ} a={t.rentCarA} />
            </div>
          </section>

          {/* Related listings in this area — internal link web, boosts crawl depth */}
          {related.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {l === 'el' && `Άλλα καταλύματα στην ${place}`}
                  {l === 'en' && `More stays in ${place}`}
                  {l === 'de' && `Weitere Unterkünfte in ${place}`}
                  {l === 'bg' && `Още настаняване в ${place}`}
                  {l === 'ru' && `Другое жильё в ${place}`}
                  {l === 'ro' && `Alte cazări în ${place}`}
                  {l === 'sr' && `Drugi smeštaji u ${place}`}
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                {l === 'el' && 'Δες τι άλλο είναι διαθέσιμο στην ίδια περιοχή.'}
                {l === 'en' && 'See what else is available in the same area.'}
                {l === 'de' && 'Weitere Optionen in derselben Gegend.'}
                {l === 'bg' && 'Вижте какво друго е налично в същата област.'}
                {l === 'ru' && 'Посмотрите другие варианты в этом же районе.'}
                {l === 'ro' && 'Vezi alte opțiuni în aceeași zonă.'}
                {l === 'sr' && 'Pogledajte druge opcije u istoj oblasti.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {related.map(r => (
                  <Link
                    key={r.slug}
                    href={`/${l === 'el' ? '' : l + '/'}stay/${r.slug}`}
                    className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-rose-300 hover:shadow-md transition"
                  >
                    {r.cover && (
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <Image
                          src={r.cover} alt={r.name} fill sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-2">{r.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 truncate">{r.place}</div>
                      {r.price != null && (
                        <div className="text-xs text-rose-700 font-semibold mt-1.5">
                          {l === 'el' ? 'από' : l === 'en' ? 'from' : 'ab'} €{Math.round(Number(r.price))}
                          <span className="text-gray-500 font-normal"> / {l === 'el' ? 'βράδυ' : 'night'}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA back to stay page */}
          <section className="rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">{t.cta}</h2>
                <p className="text-white/90 text-sm">{t.ctaText}</p>
              </div>
              <Link
                href={`/${l === 'el' ? '' : l + '/'}stay/${slug}`}
                className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-5 py-3 rounded-2xl shadow hover:bg-rose-50"
              >
                <MapPin className="w-4 h-4" /> {t.seeProperty}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

// ─── Small server components ────────────────────────────────────────
function PoiCard(props: {
  rank: number; href: string; name: string; image: string | null; alt: string;
  description: string; rating: number | null; distanceMeters: number;
  extraLine?: string; locale: Locale; accent: 'sky' | 'amber' | 'emerald';
}) {
  const { rank, href, name, image, alt, description, rating, distanceMeters, extraLine, locale, accent } = props;
  const accentRing: Record<string, string> = {
    sky: 'group-hover:ring-sky-300',
    amber: 'group-hover:ring-amber-300',
    emerald: 'group-hover:ring-emerald-300',
  };
  const t = T[locale];
  // Description fields mix HTML + markdown — strip both so the card stays clean.
  const plainDesc = description
    .replace(/<[^>]+>/g, ' ')       // HTML tags
    .replace(/#{1,6}\s+/g, '')      // markdown headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1')    // italic
    .replace(/\[(.+?)\]\([^)]+\)/g, '$1') // links → text only
    .replace(/\s+/g, ' ')
    .trim();
  const shortDesc = plainDesc.length > 160 ? plainDesc.slice(0, 157) + '…' : plainDesc;

  return (
    <li>
      <Link
        href={href}
        className={`group flex gap-3 bg-white rounded-2xl p-3 border border-gray-200 ring-2 ring-transparent transition hover:shadow-md ${accentRing[accent]}`}
      >
        <div className="shrink-0 w-24 h-24 rounded-xl bg-gray-100 overflow-hidden relative">
          {image ? (
            <Image src={image} alt={alt} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <MapPin className="w-6 h-6" />
            </div>
          )}
          <span className="absolute top-1 left-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/95 text-[10px] font-bold text-gray-800 shadow">{rank}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{name}</h3>
            {rating != null && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-700 shrink-0">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {Number(rating).toFixed(1)}
              </span>
            )}
          </div>
          {extraLine && <div className="text-[11px] text-gray-500 mt-0.5 truncate">{extraLine}</div>}
          {shortDesc && <p className="text-[12px] text-gray-600 mt-1 line-clamp-2 leading-snug">{shortDesc}</p>}
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-700">
            <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{formatDistance(distanceMeters, locale)} {t.from}</span>
            {distanceMeters < 2000
              ? <span className="inline-flex items-center gap-1 text-emerald-700"><Footprints className="w-3 h-3" />~{walkMinutes(distanceMeters)}′ {t.walk}</span>
              : <span className="inline-flex items-center gap-1 text-slate-600"><Car className="w-3 h-3" />~{driveMinutes(distanceMeters)}′ {t.drive}</span>}
          </div>
        </div>
      </Link>
    </li>
  );
}

function ItineraryCard({ day, title, bullets, locale }: { day: number; title: string; bullets: string[]; locale: Locale }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-violet-100 text-violet-700 text-xs font-bold mb-2">
        {locale === 'el' ? 'Μέρα' : 'Day'} {day}
      </div>
      <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
      <ul className="text-xs text-gray-700 space-y-1.5 list-none">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="text-violet-400 mt-0.5">▸</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group bg-white border border-gray-200 rounded-2xl p-4 [&[open]]:shadow-md transition-shadow">
      <summary className="flex items-center justify-between gap-3 cursor-pointer text-sm font-semibold text-gray-900 list-none">
        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-600 shrink-0" />{q}</span>
        <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" />
      </summary>
      <p className="mt-3 text-sm text-gray-700 leading-relaxed">{a}</p>
    </details>
  );
}
