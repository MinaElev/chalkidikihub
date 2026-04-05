import { setRequestLocale } from 'next-intl/server';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { getContentMeta } from '@/lib/seo';

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

  // Always use DynamicListingDetail to fetch live content from DB
  return <DynamicListingDetail slug={slug} locale={locale} />;
}
