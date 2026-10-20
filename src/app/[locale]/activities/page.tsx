import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getActivities } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { localizeToken } from '@/lib/content/hours';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';
import { greekAlt } from '@/lib/content/format';

export const revalidate = 86400;

const ORDER = ['boatTrips', 'waterSports', 'historical', 'nature', 'family', 'religious', 'wellness', 'nightlife'];

export async function generateMetadata({ params }: PageProps<'/[locale]/activities'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'activity' });
  const items = await getActivities();
  return buildMetadata({
    locale,
    path: '/activities',
    title: t('hubMetaTitle', { count: items.length }),
    description: t('hubLead'),
    image: items.find((a) => a.image_url)?.image_url,
  });
}

export default async function ActivitiesPage({ params }: PageProps<'/[locale]/activities'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, cats, items] = await Promise.all([
    getTranslations({ locale, namespace: 'activity' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'activityCategories' }),
    getActivities(),
  ]);
  const villages = await closestVillagesFor(items, locale, 12);
  const categories = [...ORDER, ...items.map((a) => a.category ?? 'other')].filter((c, i, arr) => arr.indexOf(c) === i);

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('activities'), path: '/activities' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      />
      {categories.map((cat) => {
        const list = items.filter((a) => (a.category ?? 'other') === cat);
        if (!list.length) return null;
        return (
          <Section key={cat} id={cat} title={cats.has(cat) ? cats(cat) : cat}>
            <CardGrid>
              {list.map((a) => (
                <Card
                  key={a.slug}
                  href={`/activities/${a.slug}`}
                favorite={{ type: 'activity', slug: a.slug }}
                  title={displayName(a, locale, 'activity')}
                  eyebrow={villages.get(a.slug)}
                  image={a.image_url}
                  imageAlt={greekAlt(a.image_alt, locale)}
                  meta={[localizeToken(a.duration, locale), localizeToken(a.price_range, locale)].filter(Boolean).join(' · ') || undefined}
                  {...ratingProps(a, 'activity')}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, items.map((a) => ({ name: displayName(a, locale, 'activity'), path: `/activities/${a.slug}` })))} />
    </Container>
  );
}
