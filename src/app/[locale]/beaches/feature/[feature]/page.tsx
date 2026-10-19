import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { AREA_SLUGS, getBeaches } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_OF } from '@/lib/content/place-names';
import { KEPT_FEATURES } from '@/lib/seo/redirects';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { FEATURE_INTRO, FEATURE_TITLE } from '@/content/beach-features';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return KEPT_FEATURES.map((feature) => ({ feature }));
}

async function load(feature: string) {
  if (!KEPT_FEATURES.includes(feature)) return null;
  const all = await getBeaches();
  const list = all
    .filter((b) => (b.features ?? []).includes(feature))
    .sort((a, b) => (b.rating ?? 0) * (b.reviews_count ? 1 : 0) - (a.rating ?? 0) * (a.reviews_count ? 1 : 0) || Number(Boolean(b.image_url)) - Number(Boolean(a.image_url)));
  return list;
}

export async function generateMetadata({ params }: PageProps<'/[locale]/beaches/feature/[feature]'>) {
  const { locale: raw, feature } = await params;
  const locale = raw as Locale;
  const list = await load(feature);
  if (!list) return {};
  return buildMetadata({
    locale,
    path: `/beaches/feature/${feature}`,
    title: `${FEATURE_TITLE[feature][locale]} (${list.length})`,
    description: FEATURE_INTRO[feature][locale].slice(0, 155),
    image: list.find((b) => b.image_url)?.image_url,
    indexableLocales: list.length >= 3 ? locales : [],
  });
}

export default async function FeaturePage({ params }: PageProps<'/[locale]/beaches/feature/[feature]'>) {
  const { locale: raw, feature } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const list = await load(feature);
  if (!list) notFound();

  const [t, shell, labels] = await Promise.all([
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
  ]);
  const label = labels(feature);
  const villages = await closestVillagesFor(list, locale);

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('beaches'), path: '/beaches' },
              { name: label, path: `/beaches/feature/${feature}` },
            ]}
          />
        }
        title={FEATURE_TITLE[feature][locale]}
        lead={t('featureLead', { feature: label, count: list.length })}
      >
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-700">{FEATURE_INTRO[feature][locale]}</p>
      </PageIntro>

      {AREA_SLUGS.map((area) => {
        const inArea = list.filter((b) => b.area === area);
        if (!inArea.length) return null;
        return (
          <Section key={area} id={area} title={t('inArea', { area: AREA_OF[area][locale] })}>
            <CardGrid>
              {inArea.map((b, i) => (
                <Card
                  key={b.slug}
                  href={`/beaches/${b.slug}`}
                favorite={{ type: 'beach', slug: b.slug }}
                  title={displayName(b, locale, 'beach')}
                  eyebrow={villages.get(b.slug)}
                  image={b.image_url}
                  imageAlt={b.image_alt}
                  priority={i < 2}
                  badges={(b.features ?? []).filter((f) => f !== feature && labels.has(f)).slice(0, 2).map((f) => labels(f))}
                  {...ratingProps(b, 'beach')}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, list.map((b) => ({ name: displayName(b, locale, 'beach'), path: `/beaches/${b.slug}` })))} />
    </Container>
  );
}
