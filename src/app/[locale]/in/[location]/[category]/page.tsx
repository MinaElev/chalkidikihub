import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { createApiClient, toLocaleMap } from '@/lib/api-helpers';
import { collectionMeta, localeUrl, generateItemListLD, generateBreadcrumbLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getLocation, LOCATIONS, CATEGORIES, type Category } from './location-data';
import { LocationResults } from './LocationResults';
import type { Beach, Restaurant, Activity, Listing } from '@/types';

export const revalidate = 86400; // ISR: 24h - on-demand revalidation from admin saves keeps content fresh

// ── Localized labels ────────────────────────────────────────
const CATEGORY_TITLES: Record<Category, Record<string, string>> = {
  beaches: { el: 'Παραλίες', en: 'Beaches', de: 'Strande', bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaze' },
  restaurants: { el: 'Εστιατόρια', en: 'Restaurants', de: 'Restaurants', bg: 'Ресторанти', ru: 'Рестораны', ro: 'Restaurante', sr: 'Restorani' },
  activities: { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitaten', bg: 'Дейности', ru: 'Развлечения', ro: 'Activitati', sr: 'Aktivnosti' },
  listings: { el: 'Καταλύματα', en: 'Accommodations', de: 'Unterkunfte', bg: 'Настаняване', ru: 'Жильё', ro: 'Cazare', sr: 'Smestaj' },
};

const IN_WORD: Record<string, string> = {
  el: 'στο', en: 'in', de: 'in', bg: 'в', ru: 'в', ro: 'in', sr: 'u',
};

const HALKIDIKI: Record<string, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki',
};

const HOME_LABEL: Record<string, string> = {
  el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasa', sr: 'Pocetna',
};

// ── Static params for all combos ────────────────────────────
export function generateStaticParams() {
  return LOCATIONS.flatMap((loc) =>
    CATEGORIES.map((cat) => ({ location: loc.locationSlug, category: cat })),
  );
}

// ── Types ────────────────────────────────────────────────────
type Props = {
  params: Promise<{ locale: string; location: string; category: string }>;
};

// ── Metadata ────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, location, category } = await params;
  const loc = getLocation(location);
  if (!loc || !CATEGORIES.includes(category as Category)) return { title: 'Not Found' };

  const cat = category as Category;
  const locName = loc.locationName[locale] || loc.locationName.en;
  const catLabel = CATEGORY_TITLES[cat]?.[locale] || CATEGORY_TITLES[cat]?.en || cat;
  const inWord = IN_WORD[locale] || 'in';
  const halkidiki = HALKIDIKI[locale] || 'Halkidiki';

  const titles: Record<string, string> = {};
  const descriptions: Record<string, string> = {};
  for (const l of ['el', 'en']) {
    const ln = loc.locationName[l] || loc.locationName.en;
    const cl = CATEGORY_TITLES[cat]?.[l] || CATEGORY_TITLES[cat]?.en || cat;
    const iw = IN_WORD[l] || 'in';
    const hk = HALKIDIKI[l] || 'Halkidiki';
    titles[l] = `${cl} ${iw} ${ln}, ${hk}`;
    descriptions[l] = l === 'el'
      ? `Ανακαλύψτε τα καλύτερα ${cl.toLowerCase()} ${iw} ${ln}, ${hk}. Φωτογραφίες, κριτικές & πληροφορίες.`
      : `Discover the best ${cl.toLowerCase()} ${iw} ${ln}, ${hk}. Photos, reviews & info.`;
  }

  return collectionMeta({
    titles,
    descriptions,
    path: `in/${location}/${category}`,
    locale,
    ogType: cat === 'listings' ? 'listing' : cat === 'beaches' ? 'beach' : cat === 'restaurants' ? 'restaurant' : 'activity',
  });
}

// ── Data fetching helpers ────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformBeach(row: any): Beach {
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    features: row.features || [],
    rating: Number(row.rating), reviews_count: row.reviews_count || 0,
    reviews: [], nearby_listing_ids: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRestaurant(row: any): Restaurant {
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    cuisine: row.cuisine || [], price_level: row.price_level,
    rating: Number(row.rating), reviews_count: row.reviews_count || 0,
    reviews: [], phone: row.phone || '', hours: row.hours || '',
    has_sea_view: row.has_sea_view, has_live_music: row.has_live_music,
    accepts_reservations: row.accepts_reservations,
    tags: row.tags || [], nearby_listing_ids: [], nearby_beach_ids: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformActivity(row: any): Activity {
  return {
    id: row.id, slug: row.slug,
    name: toLocaleMap(row, 'name'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    image_url: row.image_url || '',
    category: row.category, price_range: row.price_range || '',
    duration: row.duration || '',
    rating: Number(row.rating), reviews_count: row.reviews_count || 0,
    reviews: [], tags: row.tags || [],
    nearby_listing_ids: [], nearby_beach_ids: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformListing(row: any): Listing {
  return {
    id: row.id, slug: row.slug, owner_id: row.owner_id || '',
    title: toLocaleMap(row, 'title'),
    description: toLocaleMap(row, 'description'),
    area: row.area, location_name: row.location_name,
    latitude: row.latitude, longitude: row.longitude,
    price_per_night: row.price_per_night, currency: row.currency || 'EUR',
    guests_max: row.guests_max, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
    amenities: row.amenities || [], status: row.status,
    images: (row.listing_images || []).map((img: Record<string, unknown>) => ({
      id: img.id, listing_id: row.id, image_url: img.image_url,
      sort_order: img.sort_order, is_cover: img.is_cover,
    })),
    created_at: row.created_at, updated_at: row.updated_at,
  };
}

// ── Page component ────────────────────────────────────────────
export default async function LocationCategoryPage({ params }: Props) {
  const { locale, location, category } = await params;
  setRequestLocale(locale);

  const loc = getLocation(location);
  if (!loc || !CATEGORIES.includes(category as Category)) notFound();
  const cat = category as Category;

  const supabase = createApiClient();
  const dbName = loc!.locationNameDb;

  let beaches: Beach[] = [];
  let restaurants: Restaurant[] = [];
  let activities: Activity[] = [];
  let listings: Listing[] = [];

  switch (cat) {
    case 'beaches': {
      const { data } = await supabase
        .from('beaches').select('*')
        .ilike('location_name', `%${dbName}%`)
        .order('rating', { ascending: false })
        .limit(20);
      beaches = (data || []).map(transformBeach);
      break;
    }
    case 'restaurants': {
      const { data } = await supabase
        .from('restaurants').select('*')
        .ilike('location_name', `%${dbName}%`)
        .order('rating', { ascending: false })
        .limit(20);
      restaurants = (data || []).map(transformRestaurant);
      break;
    }
    case 'activities': {
      const { data } = await supabase
        .from('activities').select('*')
        .ilike('location_name', `%${dbName}%`)
        .order('rating', { ascending: false })
        .limit(20);
      activities = (data || []).map(transformActivity);
      break;
    }
    case 'listings': {
      const { data } = await supabase
        .from('listings').select('*, listing_images(*)')
        .ilike('location_name', `%${dbName}%`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);
      listings = (data || []).map(transformListing);
      break;
    }
  }

  // Empty programmatic combinations would render as a thin "0 results"
  // template — flagged by AdSense as low-value content. 404 keeps them out
  // of the index without breaking sitemap entries that do have data.
  const itemCount = beaches.length + restaurants.length + activities.length + listings.length;
  if (itemCount === 0) notFound();

  // Build item list for JSON-LD
  const locName = loc!.locationName[locale] || loc!.locationName.en;
  const catLabel = CATEGORY_TITLES[cat]?.[locale] || CATEGORY_TITLES[cat]?.en || cat;
  const inWord = IN_WORD[locale] || 'in';
  const listTitle = `${catLabel} ${inWord} ${locName}`;

  const pathPrefix = cat === 'listings' ? 'listings' : cat;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allItems: any[] = cat === 'beaches' ? beaches : cat === 'restaurants' ? restaurants : cat === 'activities' ? activities : listings;
  const itemListItems = allItems.map((item) => {
    const nameField = cat === 'listings' ? 'title' : 'name';
    const nameMap = item[nameField] as Record<string, string>;
    const name = nameMap?.[locale] || nameMap?.el || nameMap?.en || '';
    return { name, url: localeUrl(locale, `${pathPrefix}/${item.slug}`) };
  });

  const homeLabel = HOME_LABEL[locale] || 'Home';
  const breadcrumbItems = [
    { name: homeLabel, url: localeUrl(locale) },
    { name: catLabel, url: localeUrl(locale, pathPrefix) },
    { name: locName, url: localeUrl(locale, `in/${location}/${category}`) },
  ];

  return (
    <>
      <JsonLd data={generateItemListLD(listTitle, itemListItems) as Record<string, unknown>} />
      <JsonLd data={generateBreadcrumbLD(breadcrumbItems) as Record<string, unknown>} />
      <LocationResults
        category={cat}
        locationName={loc!.locationName}
        beaches={beaches}
        restaurants={restaurants}
        activities={activities}
        listings={listings}
      />
    </>
  );
}
