import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getRestaurants } from '@/lib/db/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, PageIntro } from '@/components/ui/Layout';
import { RestaurantsByArea } from '@/features/restaurants/RestaurantsByArea';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[locale]/restaurants'>) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'food' });
  const items = await getRestaurants();
  return buildMetadata({
    locale,
    path: '/restaurants',
    title: t('hubMetaTitle', { count: items.length }),
    description: t('hubMetaDesc'),
    image: items.find((r) => r.image_url)?.image_url,
  });
}

export default async function RestaurantsPage({ params }: PageProps<'/[locale]/restaurants'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, shell, items] = await Promise.all([
    getTranslations({ locale, namespace: 'food' }),
    getTranslations({ locale, namespace: 'shell' }),
    getRestaurants(),
  ]);
  return (
    <Container>
      <PageIntro
        breadcrumbs={<Breadcrumbs locale={locale} crumbs={[{ name: shell('home'), path: '/' }, { name: shell('food'), path: '/restaurants' }]} />}
        title={t('hubTitle')}
        lead={t('hubLead')}
      >
        <p className="mt-5">
          <Link href="/restaurants/category/brunch" className="inline-block rounded-full bg-sea-50 px-3.5 py-1.5 text-sm font-medium text-sea-800 hover:bg-sea-100">
            {t('brunchTitle')}
          </Link>
        </p>
      </PageIntro>
      <RestaurantsByArea locale={locale} items={items} />
    </Container>
  );
}
