import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getListings, type Area } from '@/lib/db/content';
import { AREA_LOCATIVE, AREA_NAMES } from '@/lib/content/place-names';
import { buildStayItems } from '@/lib/content/stay-items';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, PageIntro } from '@/components/ui/Layout';
import { StaysExplorer } from '@/components/v3/StaysExplorer';
import { ALL_AMENITIES } from '@/lib/constants';

export const revalidate = 3600;
/** Stays per area in the first page load; the rest come from /api/stays when asked for. */
const PER_AREA = 10;

export async function generateMetadata({ params }: PageProps<'/[locale]/listings'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'stay' });
  const items = (await getListings()).filter((l) => !l.is_closed);
  return buildMetadata({
    locale,
    path: '/listings',
    title: t('hubMetaTitle', { count: items.length }),
    description: t('hubMetaDesc'),
    image: items.find((l) => l.cover_url)?.cover_url,
  });
}

export default async function ListingsPage({ params }: PageProps<'/[locale]/listings'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, common, f, amenityT, all] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'listings.filters' }),
    getTranslations({ locale, namespace: 'amenities' }),
    buildStayItems(locale),
  ]);
  // The first ten per area, in the server's order (Premium first, then recently updated).
  const first = AREA_SLUGS.flatMap((a) => all.filter((i) => i.area === a).slice(0, PER_AREA));
  first.slice(0, 2).forEach((i) => { i.card.priority = true; });
  const hasMore = Object.fromEntries(AREA_SLUGS.map((a) => [a, all.filter((i) => i.area === a).length > PER_AREA])) as Record<Area, boolean>;

  const present = new Set(all.flatMap((i) => i.amenities));
  const amenityLabels = Object.fromEntries(ALL_AMENITIES.filter((a) => present.has(a)).map((a) => [a, amenityT(a)]));
  const inArea = Object.fromEntries(AREA_SLUGS.map((a) => [a, t('inArea', { area: AREA_LOCATIVE[a][locale] })])) as Record<Area, string>;
  const seeAll = Object.fromEntries(AREA_SLUGS.map((a) => [a, t('seeAllInArea', { area: AREA_LOCATIVE[a][locale] })])) as Record<Area, string>;

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('stay'), path: '/listings' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      <StaysExplorer
        items={first}
        hasMore={hasMore}
        anyLive={all.some((i) => i.live)}
        areaNames={Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]])) as Record<Area, string>}
        amenityNames={amenityLabels}
        locale={locale}
        labels={{
          area: f('area'), allAreas: f('allAreas'),
          allTypes: t('quickAll'), liveOnly: t('liveAvailability'), more: t('moreFilters'),
          clear: f('clearFilters'), sortBy: f('sortBy'), sortRecommended: t('sortRecommended'),
          sortPriceLow: f('sortPriceLow'), sortPriceHigh: f('sortPriceHigh'),
          priceRange: f('priceRange'), minPrice: f('minPrice'), maxPrice: f('maxPrice'), amenities: f('amenities'),
          allStays: t('allStays'), inArea, seeAll, showMore: t('showMore'),
          from: common('from'), perNight: t('perNight'), noResults: t('noResults'),
        }}
      />
      <JsonLd data={itemListLd(locale, first.map((i) => ({ name: i.card.title, path: `/listings/${i.slug}` })))} />
    </Container>
  );
}
