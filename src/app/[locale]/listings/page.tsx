import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getListings } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE, AREA_NAMES } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';
import { ListingFilters, type FilterItem } from '@/components/v3/ListingFilters';
import { ALL_AMENITIES } from '@/lib/constants';

const RESULTS: Record<Locale, string> = {
  el: 'Αποτελέσματα: {count}', en: 'Results: {count}', de: 'Ergebnisse: {count}', ro: 'Rezultate: {count}',
  bg: 'Резултати: {count}', sr: 'Rezultati: {count}', ru: 'Результаты: {count}',
};

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
  const [t, shell, common, f, amenityT, items] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'listings.filters' }),
    getTranslations({ locale, namespace: 'amenities' }),
    getListings(),
  ]);
  const open = items.filter((l) => !l.is_closed);
  const villages = await closestVillagesFor(open, locale, 6);
  const cardFor = (l: (typeof open)[number], priority = false) => ({
    href: `/listings/${l.slug}`,
    favorite: { type: 'listing' as const, slug: l.slug },
    title: displayName(l, locale, 'listing'),
    eyebrow: villages.get(l.slug),
    image: l.cover_url,
    priority,
    highlight: l.featured ? t('featured') : undefined,
    meta: t('guests', { count: l.guests_max }),
    price: l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${t('perNight')}` : undefined,
    ...ratingProps(l, 'listing'),
  });
  const filterItems: FilterItem[] = open.map((l) => ({
    card: cardFor(l),
    area: l.area,
    price: l.price_per_night ? Number(l.price_per_night) : null,
    guests: l.guests_max,
    amenities: l.amenities ?? [],
    updated: l.updated_at,
  }));
  const present = new Set(open.flatMap((l) => l.amenities ?? []));
  const amenityLabels = Object.fromEntries(ALL_AMENITIES.filter((a) => present.has(a)).map((a) => [a, amenityT(a)]));
  const filterLabels = {
    area: f('area'), allAreas: f('allAreas'), priceRange: f('priceRange'), minPrice: f('minPrice'), maxPrice: f('maxPrice'),
    guestsMin: f('guestsMin'), amenities: f('amenities'), sortBy: f('sortBy'), sortNewest: f('sortNewest'),
    sortPriceLow: f('sortPriceLow'), sortPriceHigh: f('sortPriceHigh'), clearFilters: f('clearFilters'), open: f('open'),
    results: RESULTS[locale],
  };

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('stay'), path: '/listings' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      <ListingFilters
        items={filterItems}
        labels={filterLabels}
        areas={Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]]))}
        amenities={amenityLabels}
      >
        {AREA_SLUGS.map((area) => {
          const list = open.filter((l) => l.area === area);
          if (!list.length) return null;
          return (
            <Section key={area} id={area} title={t('inArea', { area: AREA_LOCATIVE[area][locale] })}>
              <CardGrid>
                {list.map((l, i) => <Card key={l.slug} {...cardFor(l, area === 'kassandra' && i < 2)} />)}
              </CardGrid>
            </Section>
          );
        })}
      </ListingFilters>
      <JsonLd data={itemListLd(locale, open.map((l) => ({ name: displayName(l, locale, 'listing'), path: `/listings/${l.slug}` })))} />
    </Container>
  );
}
