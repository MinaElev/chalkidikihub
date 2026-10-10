import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getBeaches, getVillages, AREA_SLUGS } from '@/lib/db/content';
import { nearest } from '@/lib/geo';
import { placeName, villagesInArea } from '@/lib/content/place-names';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 86400;

const visible = async () =>
  (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland');

export async function generateMetadata({ params }: PageProps<'/[locale]/places'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'places' });
  const villages = await visible();
  return buildMetadata({
    locale,
    path: '/places',
    title: t('hubMetaTitle', { count: villages.length }),
    description: t('hubLead'),
  });
}

export default async function PlacesPage({ params }: PageProps<'/[locale]/places'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, villages, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'places' }),
    getTranslations({ locale, namespace: 'shell' }),
    visible(),
    getBeaches(),
  ]);

  // Village cards borrow the nearest beach photo when the village has none yet.
  const withImage = villages.map((v) => {
    const beach = nearest(v, beaches, 1, 10)[0];
    const beachCount = nearest(v, beaches, 99, 10).length;
    return { v, image: v.image_url || beach?.item.image_url || null, beachCount };
  });

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('places'), path: '/places' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      {AREA_SLUGS.map((area) => {
        const list = withImage
          .filter((x) => x.v.area === area)
          .sort((a, b) => b.beachCount - a.beachCount || (a.v.sort_order ?? 0) - (b.v.sort_order ?? 0));
        if (!list.length) return null;
        return (
          <Section key={area} id={area} title={t('villagesIn', { area: villagesInArea(area, locale) })}>
            <CardGrid>
              {list.map(({ v, image, beachCount }) => (
                <Card
                  key={v.slug}
                  href={`/places/${v.slug}`}
                  title={placeName(v.slug, locale, v)}
                  image={image}
                  meta={beachCount ? t('beachesWithin10', { count: beachCount }) : undefined}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, villages.map((v) => ({ name: placeName(v.slug, locale, v), path: `/places/${v.slug}` })))} />
    </Container>
  );
}
