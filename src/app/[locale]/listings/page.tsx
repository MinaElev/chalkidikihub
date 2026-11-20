import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getBeaches, getListings, getLiveCalendarListingIds, type Area } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES } from '@/lib/content/place-names';
import { hasCoords, nearest } from '@/lib/geo';
import { formatDistance, formatPrice } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { CardFact } from '@/components/ui/Card';
import { Container, PageIntro } from '@/components/ui/Layout';
import { StaysExplorer, type StayItem } from '@/components/v3/StaysExplorer';
import { ALL_AMENITIES } from '@/lib/constants';

/** Amenities shown as icons on stay cards, in this order (the ones guests ask about most). */
const CARD_FACTS: CardFact['key'][] = ['pool', 'seaView', 'airConditioning', 'wifi', 'petsAllowed', 'parking'];

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[locale]/listings'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'stay' });
  const items = (await getListings()).filter((l) => !l.is_closed);
  return buildMetadata({
    locale,
    path: '/listings',
    title: t('hubMetaTitle', { count: items.length }),
    description: t('hubLead'),
    image: items.find((l) => l.cover_url)?.cover_url,
  });
}

export default async function ListingsPage({ params }: PageProps<'/[locale]/listings'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, f, amenityT, items, liveIds, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'listings.filters' }),
    getTranslations({ locale, namespace: 'amenities' }),
    getListings(),
    getLiveCalendarListingIds(),
    getBeaches(),
  ]);
  const beachPoints = beaches.filter(hasCoords);
  const live = new Set(liveIds);
  const open = items.filter((l) => !l.is_closed);
  const villages = await closestVillagesFor(open, locale, 6);

  const cardFor = (l: (typeof open)[number], priority = false) => {
    const beach = nearest(l, beachPoints, 1, 3)[0];
    const has = new Set(l.amenities ?? []);
    return {
    href: `/listings/${l.slug}`,
    favorite: { type: 'listing' as const, slug: l.slug },
    title: displayName(l, locale, 'listing'),
    eyebrow: villages.get(l.slug),
    image: l.cover_url,
    priority,
    highlight: l.featured ? t('featured') : undefined,
    live: live.has(l.id) ? t('liveAvailability') : undefined,
    meta: t('guests', { count: l.guests_max }),
    price: l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${t('perNight')}` : undefined,
    facts: CARD_FACTS.filter((k) => has.has(k)).slice(0, 3).map((key) => ({ key, label: amenityT(key) })),
    // Nearest beach within 3 km, with the distance: the second question every guest asks.
    note: beach ? t('nearBeach', { name: displayName(beach.item, locale, 'beach'), km: formatDistance(beach.km, locale) }) : undefined,
    ...ratingProps(l, 'listing'),
    };
  };
  const stayItems: StayItem[] = open.map((l, i) => ({
    slug: l.slug,
    card: cardFor(l, i < 2),
    area: l.area,
    price: l.price_per_night ? Number(l.price_per_night) : null,
    amenities: l.amenities ?? [],
    updated: l.updated_at,
    live: live.has(l.id),
  }));
  const present = new Set(open.flatMap((l) => l.amenities ?? []));
  const amenityLabels = Object.fromEntries(ALL_AMENITIES.filter((a) => present.has(a)).map((a) => [a, amenityT(a)]));
  const inArea = Object.fromEntries(AREA_SLUGS.map((a) => [a, t('inArea', { area: AREA_LOCATIVE[a][locale] })])) as Record<Area, string>;

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('stay'), path: '/listings' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      <StaysExplorer
        items={stayItems}
        areaNames={Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]])) as Record<Area, string>}
        amenityNames={amenityLabels}
        locale={locale}
        labels={{
          area: f('area'), allAreas: f('allAreas'),
          allTypes: t('quickAll'), liveOnly: t('liveAvailability'), more: t('moreFilters'),
          clear: f('clearFilters'), sortBy: f('sortBy'), sortRecommended: t('sortRecommended'),
          sortPriceLow: f('sortPriceLow'), sortPriceHigh: f('sortPriceHigh'),
          priceRange: f('priceRange'), minPrice: f('minPrice'), maxPrice: f('maxPrice'), amenities: f('amenities'),
          allStays: t('allStays'), inArea,
          from: common('from'), perNight: t('perNight'), noResults: t('noResults'),
        }}
      />
      <JsonLd data={itemListLd(locale, open.map((l) => ({ name: displayName(l, locale, 'listing'), path: `/listings/${l.slug}` })))} />
    </Container>
  );
}
