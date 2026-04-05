import { setRequestLocale } from 'next-intl/server';
import { DynamicRestaurantDetail } from '@/components/listings/DynamicRestaurantDetail';
import { getContentMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('restaurants', slug, locale, 'Restaurant | Chalkidiki Hub', 'Best restaurants in Halkidiki');
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DynamicRestaurantDetail slug={slug} />;
}
