import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('listings', slug, locale, 'Accommodation | Chalkidiki Hub', 'Find accommodation in Halkidiki');
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('listings').select('id').eq('slug', slug).eq('status', 'published').single();
  if (!data) notFound();

  // Always use DynamicListingDetail to fetch live content from DB
  return <DynamicListingDetail slug={slug} locale={locale} />;
}
