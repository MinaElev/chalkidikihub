import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicRestaurantDetail } from '@/components/listings/DynamicRestaurantDetail';
import { getContentMeta } from '@/lib/seo';
import { getRestaurantBySlug, getRestaurants } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const items = await getRestaurants();
  return items.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('restaurants', slug, locale, 'Restaurant | Chalkidiki Hub', 'Best restaurants in Halkidiki');
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  return <DynamicRestaurantDetail slug={slug} initialData={restaurant} />;
}
