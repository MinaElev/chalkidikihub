import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getSales } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { AREA_NAMES } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { saleCover } from '@/lib/content/sales';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container, PageIntro } from '@/components/ui/Layout';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[locale]/sales'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'sales' });
  const sales = await getSales();
  // Only worth indexing once there is a real inventory.
  return buildMetadata({
    locale,
    path: '/sales',
    title: `${t('heroTitle')} ${t('heroHighlight')}`,
    description: t('heroSubtitle'),
    indexableLocales: sales.length >= 5 ? undefined : [],
  });
}

export default async function SalesPage({ params }: PageProps<'/[locale]/sales'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, types, sales] = await Promise.all([
    getTranslations({ locale, namespace: 'sales' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'propertyTypes' }),
    getSales(),
  ]);
  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('sales'), path: '/sales' }]} />}
        title={`${t('heroTitle')} ${t('heroHighlight')}`}
        lead={t('heroSubtitle')}
      />
      {sales.length === 0 ? (
        <p className="text-slate-600">{t('noProperties')}</p>
      ) : (
        <CardGrid>
          {sales.map((s) => (
            <Card
              key={s.slug}
              href={`/sales/${s.slug}`}
              title={pick(s, 'title', locale)}
              image={saleCover(s)}
              eyebrow={[
                types.has(String(s.property_type)) ? types(String(s.property_type)) : null,
                AREA_NAMES[s.area as keyof typeof AREA_NAMES]?.[locale],
              ].filter(Boolean).join(' · ')}
              meta={[s.price ? formatPrice(Number(s.price), locale) : null, s.size_sqm ? `${s.size_sqm} ${t('sqm')}` : null].filter(Boolean).join(' · ')}
            />
          ))}
        </CardGrid>
      )}
      <section className="mt-16 rounded-3xl bg-sand-100 p-8">
        <h2 className="font-display text-2xl font-semibold text-slate-900">{t('sellCTA')}</h2>
        <p className="mt-2 text-slate-700">{t('sellCTADesc')}</p>
        <Link href="/dashboard/sales/new" className="mt-4 inline-block rounded-xl bg-sea-600 px-5 py-3 font-semibold text-white hover:bg-sea-700">
          {t('listProperty')}
        </Link>
      </section>
    </Container>
  );
}
