import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { VillagePage } from '@/components/villages/VillagePage';
import { createApiClient } from '@/lib/api-helpers';
import { transformBeach, transformRestaurant, transformActivity, transformListing, transformSale } from '@/lib/data';
import { localeUrl, generateBreadcrumbLD } from '@/lib/seo';
import { getVillagePriceStats, getVillageCuisineStats } from '@/lib/place-stats';
import { JsonLd } from '@/components/ui/JsonLd';
import { AREAS } from '@/lib/constants';
import type { Metadata } from 'next';
import type { Beach, Restaurant, Activity, Listing, Sale } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 3600; // ISR: 1 hour

// Pre-render every village slug at build time so Googlebot hits edge cache
// instead of running a Supabase query per crawl.
export async function generateStaticParams() {
  const supabase = createApiClient();
  const { data } = await supabase.from('villages').select('slug');
  return (data || []).map((v: { slug: string }) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = createApiClient();
  const { data } = await supabase.from('villages')
    .select('area, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr, meta_title_el, meta_title_en, meta_title_de, meta_title_bg, meta_title_ru, meta_title_ro, meta_title_sr, meta_description_el, meta_description_en, meta_description_de, meta_description_bg, meta_description_ru, meta_description_ro, meta_description_sr, image_url, image_alt')
    .eq('slug', slug).single();

  if (!data) return { title: 'Village | ChalkidikiHub' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  const villageName = row[`name_${locale}`] || row.name_el || row.name_en;
  const title = row[`meta_title_${locale}`] || row.meta_title_el || row.meta_title_en || villageName;

  // Fetch counts + top beaches in parallel to build a data-driven meta description.
  // Replaces near-duplicate template descriptions ("Ανακαλύψτε X…") with unique
  // per-village signals Google ranks higher.
  const [beachesRes, restaurantsRes, activitiesRes] = await Promise.all([
    supabase.from('beaches').select(`name_${locale}, name_el, name_en`, { count: 'exact' })
      .eq('area', row.area).order('rating', { ascending: false }).limit(2),
    supabase.from('restaurants').select('*', { count: 'exact', head: true }).eq('area', row.area),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('area', row.area),
  ]);
  const topBeaches = (beachesRes.data || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((b: any) => b[`name_${locale}`] || b.name_el || b.name_en)
    .filter(Boolean) as string[];

  const areaInfo = AREAS.find(a => a.slug === row.area);
  const areaLocaleMap = (areaInfo?.name ?? {}) as Record<string, string>;
  const areaName = areaLocaleMap[locale] || areaLocaleMap.el || row.area;

  const smart = buildVillageMeta({
    villageName,
    areaName,
    locale,
    beachCount: beachesRes.count || 0,
    restaurantCount: restaurantsRes.count || 0,
    activityCount: activitiesRes.count || 0,
    topBeaches,
  });

  const dbDesc: string = row[`meta_description_${locale}`] || '';
  // Prefer smart description when we have real data counts (>0 of any type);
  // fall back to DB description, then to EL/EN fallback chain for gaps.
  const hasData = (beachesRes.count || 0) + (restaurantsRes.count || 0) + (activitiesRes.count || 0) > 0;
  const description = hasData ? smart : (dbDesc || row.meta_description_el || row.meta_description_en || '');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: row.image_url ? [{ url: row.image_url, alt: row.image_alt || title }] : [],
    },
    alternates: {
      canonical: localeUrl(locale, `places/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `places/${slug}`)])),
        'x-default': localeUrl('el', `places/${slug}`),
      },
    },
  };
}

// Locale tables for smart meta — avoids per-village template duplication
const META_LABELS: Record<string, { halkidiki: string; beaches: string; restaurants: string; activities: string; suffix: string; and: string }> = {
  el: { halkidiki: 'Χαλκιδική', beaches: 'παραλίες', restaurants: 'εστιατόρια', activities: 'δραστηριότητες', suffix: 'Οδηγός, κριτικές, χάρτες.', and: 'και' },
  en: { halkidiki: 'Halkidiki', beaches: 'beaches', restaurants: 'restaurants', activities: 'activities', suffix: 'Guide, reviews, maps.', and: 'and' },
  de: { halkidiki: 'Chalkidiki', beaches: 'Strände', restaurants: 'Restaurants', activities: 'Aktivitäten', suffix: 'Reiseführer, Bewertungen, Karten.', and: 'und' },
  bg: { halkidiki: 'Халкидики', beaches: 'плажа', restaurants: 'ресторанта', activities: 'дейности', suffix: 'Пътеводител, отзиви, карти.', and: 'и' },
  ru: { halkidiki: 'Халкидики', beaches: 'пляжей', restaurants: 'ресторанов', activities: 'занятий', suffix: 'Путеводитель, отзывы, карты.', and: 'и' },
  ro: { halkidiki: 'Halkidiki', beaches: 'plaje', restaurants: 'restaurante', activities: 'activități', suffix: 'Ghid, recenzii, hărți.', and: 'și' },
  sr: { halkidiki: 'Halkidiki', beaches: 'plaža', restaurants: 'restorana', activities: 'aktivnosti', suffix: 'Vodič, recenzije, mape.', and: 'i' },
};

function buildVillageMeta(opts: {
  villageName: string;
  areaName: string;
  locale: string;
  beachCount: number;
  restaurantCount: number;
  activityCount: number;
  topBeaches: string[];
}): string {
  const { villageName, areaName, locale, beachCount, restaurantCount, activityCount, topBeaches } = opts;
  const L = META_LABELS[locale] || META_LABELS.en;
  const items: string[] = [];
  if (beachCount > 0) {
    const top = topBeaches.slice(0, 2).filter(Boolean);
    items.push(`${beachCount} ${L.beaches}${top.length > 0 ? ` (${top.join(', ')})` : ''}`);
  }
  if (restaurantCount > 0) items.push(`${restaurantCount} ${L.restaurants}`);
  if (activityCount > 0) items.push(`${activityCount} ${L.activities}`);
  // Combine with commas and a final "and"/conjunction
  let listStr = '';
  if (items.length === 1) listStr = items[0];
  else if (items.length === 2) listStr = `${items[0]} ${L.and} ${items[1]}`;
  else if (items.length >= 3) listStr = `${items.slice(0, -1).join(', ')} ${L.and} ${items[items.length - 1]}`;
  const head = `${villageName} (${areaName}, ${L.halkidiki}):`;
  const body = listStr ? `${listStr}. ` : '';
  return `${head} ${body}${L.suffix}`.trim();
}

export default async function VillageDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();

  // Fetch village
  const { data: villageRow } = await supabase.from('villages').select('*').eq('slug', slug).single();
  if (!villageRow) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vr = villageRow as any;
  const village = {
    id: vr.id,
    slug: vr.slug,
    area: vr.area,
    name: { el: vr.name_el || '', en: vr.name_en || '', de: vr.name_de || '', bg: vr.name_bg || '', ru: vr.name_ru || '', ro: vr.name_ro || '', sr: vr.name_sr || '' },
    description: { el: vr.description_el || '', en: vr.description_en || '', de: vr.description_de || '', bg: vr.description_bg || '', ru: vr.description_ru || '', ro: vr.description_ro || '', sr: vr.description_sr || '' },
    latitude: vr.latitude,
    longitude: vr.longitude,
    image_url: vr.image_url || '',
    image_alt: vr.image_alt || '',
    population: vr.population,
  };

  // Pass all localised names + slug — the DB's location_name field can be in
  // either Greek or English depending on when the listing was created.
  const villageMatchNames = [vr.name_el, vr.name_en, slug].filter(Boolean) as string[];

  // Fetch area-related content + village-specific data benchmarks in parallel.
  const [beachesRes, restaurantsRes, activitiesRes, listingsRes, salesRes, priceStats, cuisineStats] = await Promise.all([
    supabase.from('beaches').select('*, beach_reviews(*)').eq('area', village.area).order('rating', { ascending: false }).limit(6),
    supabase.from('restaurants').select('*, restaurant_reviews(*)').eq('area', village.area).order('rating', { ascending: false }).limit(6),
    supabase.from('activities').select('*, activity_reviews(*)').eq('area', village.area).order('rating', { ascending: false }).limit(6),
    supabase.from('listings').select('*, listing_images(*)').eq('area', village.area).eq('status', 'published').order('created_at', { ascending: false }).limit(6),
    supabase.from('sales').select('*, sale_images(*)').eq('area', village.area).eq('status', 'published').order('created_at', { ascending: false }).limit(6),
    getVillagePriceStats(supabase, villageMatchNames),
    getVillageCuisineStats(supabase, villageMatchNames, village.area),
  ]);

  const beaches = (beachesRes.data || []).map(transformBeach) as unknown as Beach[];
  const restaurants = (restaurantsRes.data || []).map(transformRestaurant) as unknown as Restaurant[];
  const activities = (activitiesRes.data || []).map(transformActivity) as unknown as Activity[];
  const listings = (listingsRes.data || []).map((r) => transformListing(r as Record<string, unknown>)) as unknown as Listing[];
  const sales = (salesRes.data || []).map(transformSale) as unknown as Sale[];

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Χωριά', en: 'Places', de: 'Orte', bg: 'Места', ru: 'Места', ro: 'Locuri', sr: 'Mesta' };
  const nameMap = village.name as Record<string, string>;
  const villageName = nameMap[locale] || nameMap.el || nameMap.en || '';
  const areaInfo = AREAS.find(a => a.slug === village.area);
  const areaNameMap = (areaInfo?.name ?? {}) as Record<string, string>;
  const areaName = areaNameMap[locale] || areaNameMap.el || village.area;

  // FAQ schema — common visitor questions, helps win rich results
  const faqs = buildFaqs(villageName, areaName, locale, beaches.length, restaurants.length, activities.length);

  return (
    <>
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Places', url: localeUrl(locale, 'places') },
        { name: villageName, url: localeUrl(locale, `places/${slug}`) },
      ]) as Record<string, unknown>} />
      {faqs.length > 0 && (
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }} />
      )}
      <VillagePage
        locale={locale}
        village={village}
        beaches={beaches}
        restaurants={restaurants}
        activities={activities}
        listings={listings}
        sales={sales}
        priceStats={priceStats}
        cuisineStats={cuisineStats}
      />
    </>
  );
}

function buildFaqs(village: string, area: string, locale: string, beaches: number, restaurants: number, activities: number) {
  // Only include answers we can back with real data counts
  if (locale === 'el') {
    return [
      { q: `Πού βρίσκεται η ${village};`, a: `Η ${village} βρίσκεται στην περιοχή ${area} της Χαλκιδικής, βόρεια Ελλάδα.` },
      ...(beaches > 0 ? [{ q: `Υπάρχουν παραλίες κοντά στην ${village};`, a: `Ναι — υπάρχουν ${beaches}+ παραλίες κοντά στην ${village}, από οργανωμένες μέχρι απομονωμένες παραλίες.` }] : []),
      ...(restaurants > 0 ? [{ q: `Πού να φάω στην ${village};`, a: `Η περιοχή διαθέτει ${restaurants}+ εστιατόρια και ταβέρνες με τοπική κουζίνα και φρέσκα ψάρια.` }] : []),
      ...(activities > 0 ? [{ q: `Τι να κάνω στην ${village};`, a: `Υπάρχουν ${activities}+ δραστηριότητες και αξιοθέατα στην περιοχή — water sports, εκδρομές με σκάφος, πεζοπορία και πολιτιστικές επισκέψεις.` }] : []),
    ];
  }
  return [
    { q: `Where is ${village} located?`, a: `${village} is located in the ${area} peninsula of Halkidiki, northern Greece.` },
    ...(beaches > 0 ? [{ q: `Are there beaches near ${village}?`, a: `Yes — there are ${beaches}+ beaches near ${village}, ranging from organized to secluded.` }] : []),
    ...(restaurants > 0 ? [{ q: `Where to eat in ${village}?`, a: `The area has ${restaurants}+ restaurants and tavernas serving local cuisine and fresh seafood.` }] : []),
    ...(activities > 0 ? [{ q: `What to do in ${village}?`, a: `There are ${activities}+ activities and attractions nearby — water sports, boat trips, hiking and cultural visits.` }] : []),
  ];
}
