import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getAreas, getBeaches } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { AREA_NAMES } from '@/lib/content/place-names';
import { plainText } from '@/lib/content/render';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { Container, PageIntro } from '@/components/ui/Layout';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/areas'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'home' });
  return buildMetadata({ locale, path: '/areas', title: t('peninsulasTitle'), description: t('peninsulasLead') });
}

export default async function AreasPage({ params }: PageProps<'/[locale]/areas'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, areas, beaches] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'shell' }),
    getAreas(),
    getBeaches(),
  ]);
  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('areas'), path: '/areas' }]} />}
        title={t('peninsulasTitle')}
        lead={t('peninsulasLead')}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {AREA_SLUGS.map((slug, i) => {
          const row = areas.find((a) => a.slug === slug);
          return (
            <Card
              key={slug}
              href={`/areas/${slug}`}
              title={AREA_NAMES[slug][locale]}
              image={(row?.image_url as string) || beaches.find((b) => b.area === slug && b.image_url)?.image_url}
              meta={`${t(`${slug}Blurb`)} ${plainText(pick(row, 'description', locale), 160)}`}
              priority={i < 2}
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          );
        })}
      </div>
    </Container>
  );
}
