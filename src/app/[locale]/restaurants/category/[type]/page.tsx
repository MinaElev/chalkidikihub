import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { getRestaurants } from '@/lib/db/content';
import { KEPT_RESTAURANT_CATEGORIES } from '@/lib/seo/redirects';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, PageIntro } from '@/components/ui/Layout';
import { RestaurantsByArea } from '@/features/restaurants/RestaurantsByArea';

// Only categories with proven search demand keep a page (GSC 2026-10:
// brunch had 19 clicks / 491 impressions; every other category ~0). The rest
// 301 to /restaurants via lib/seo/redirects.ts.
export const revalidate = 86400;
// No dynamicParams = false: in Next 16 an on-demand revalidation (admin save) then caches a 404 (NoFallbackError) for every page of the route. Unknown params still 404 via notFound().

export function generateStaticParams() {
  return KEPT_RESTAURANT_CATEGORIES.map((type) => ({ type }));
}

const load = async (type: string) =>
  KEPT_RESTAURANT_CATEGORIES.includes(type) ? (await getRestaurants()).filter((r) => (r.cuisine ?? []).includes(type)) : null;

export async function generateMetadata({ params }: PageProps<'/[locale]/restaurants/category/[type]'>) {
  const { locale: raw, type } = await params;
  const locale = raw as Locale;
  const items = await load(type);
  if (!items) return {};
  const t = await getTranslations({ locale, namespace: 'food' });
  return buildMetadata({
    locale,
    path: `/restaurants/category/${type}`,
    title: `${t('brunchTitle')} (${items.length})`,
    description: t('brunchLead'),
    image: items.find((r) => r.image_url)?.image_url,
    indexableLocales: items.length >= 3 ? locales : [],
  });
}

export default async function CategoryPage({ params }: PageProps<'/[locale]/restaurants/category/[type]'>) {
  const { locale: raw, type } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const items = await load(type);
  if (!items) notFound();
  const [t, shell] = await Promise.all([
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'shell' }),
  ]);
  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('food'), path: '/restaurants' },
              { name: t('brunchTitle'), path: `/restaurants/category/${type}` },
            ]}
          />
        }
        title={t('brunchTitle')}
        lead={t('brunchLead')}
      />
      <RestaurantsByArea locale={locale} items={items} />
    </Container>
  );
}
