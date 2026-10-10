import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS, getBeaches } from '@/lib/db/content';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, AREA_OF } from '@/lib/content/place-names';
import { KEPT_FEATURES } from '@/lib/seo/redirects';
import { buildMetadata } from '@/lib/seo/metadata';
import { itemListLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro, Section } from '@/components/ui/Layout';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/beaches'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'beach' });
  const beaches = await getBeaches();
  return buildMetadata({
    locale,
    path: '/beaches',
    title: t('hubMetaTitle', { count: beaches.length }),
    description: t('hubLead'),
    image: beaches.find((b) => b.image_url)?.image_url,
  });
}

export default async function BeachesPage({ params }: PageProps<'/[locale]/beaches'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, labels, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'beach' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'beachFeatures' }),
    getBeaches(),
  ]);
  const villages = await closestVillagesFor(beaches, locale);

  const score = (b: (typeof beaches)[number]) => (b.reviews_count ? (b.rating ?? 0) * 10 + Math.min(b.reviews_count, 20) : 0) + (b.image_url ? 1 : 0);

  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('beaches'), path: '/beaches' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      >
        <nav aria-label={t('byFeature')} className="mt-6">
          <p className="text-sm font-semibold text-slate-900">{t('byFeature')}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {KEPT_FEATURES.map((f) => (
              <li key={f}>
                <Link href={`/beaches/feature/${f}`} className="inline-block rounded-full bg-sea-50 px-3.5 py-1.5 text-sm font-medium text-sea-800 hover:bg-sea-100">
                  {labels.has(f) ? labels(f) : f}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>

      {AREA_SLUGS.map((area) => {
        const list = beaches.filter((b) => b.area === area).sort((a, b) => score(b) - score(a));
        if (!list.length) return null;
        return (
          <Section
            key={area}
            id={area}
            title={t('inArea', { area: AREA_OF[area][locale] })}
            action={<Link href={`/areas/${area}`} className="text-sm font-semibold text-sea-700 hover:underline">{AREA_NAMES[area][locale]} →</Link>}
          >
            <CardGrid>
              {list.map((b, i) => (
                <Card
                  key={b.slug}
                  href={`/beaches/${b.slug}`}
                  title={displayName(b, locale, 'beach')}
                  eyebrow={villages.get(b.slug)}
                  image={b.image_url}
                  imageAlt={b.image_alt}
                  badges={(b.features ?? []).filter((f) => labels.has(f)).slice(0, 2).map((f) => labels(f))}
                  priority={area === 'kassandra' && i < 2}
                  {...ratingProps(b, 'beach')}
                />
              ))}
            </CardGrid>
          </Section>
        );
      })}
      <JsonLd data={itemListLd(locale, beaches.map((b) => ({ name: displayName(b, locale, 'beach'), path: `/beaches/${b.slug}` })))} />
    </Container>
  );
}
