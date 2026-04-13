import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicRestaurantDetail } from '@/components/listings/DynamicRestaurantDetail';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

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

  const supabase = createApiClient();
  const { data } = await supabase.from('restaurants').select('id').eq('slug', slug).single();
  if (!data) notFound();

  return <DynamicRestaurantDetail slug={slug} />;
}
