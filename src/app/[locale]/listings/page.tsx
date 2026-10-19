import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getListings } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_LOCATIVE } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

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
  const [t, shell, common, items] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getListings(),
  ]);
  const open = items.filter((l) => !l.is_closed);
  const villages = await closestVillagesFor(open, locale, 6);

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('stay'), path: '/listings' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      {AREA_SLUGS.map((area) => {
        const list = open.filter((l) => l.area === area);
        if (!list.length) return null;
        return (
          <Section key={area} id={area} title={t('inArea', { area: AREA_LOCATIVE[area][locale] })}>
            <CardGrid>
              {list.map((l, i) => (
                <Card
                  key={l.slug}
                  href={`/listings/${l.slug}`}
                  title={displayName(l, locale, 'listing')}
                  eyebrow={villages.get(l.slug)}
                  image={l.cover_url}
                  priority={area === 'kassandra' && i < 2}
                  highlight={l.featured ? t('featured') : undefined}
                  meta={t('guests', { count: l.guests_max })}
                  price={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${t('perNight')}` : undefined}
                  {...ratingProps(l, 'listing')}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, open.map((l) => ({ name: displayName(l, locale, 'listing'), path: `/listings/${l.slug}` })))} />
    </Container>
  );
}
