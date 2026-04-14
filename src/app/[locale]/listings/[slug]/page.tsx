import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { getContentMeta } from '@/lib/seo';
import { getListingBySlug } from '@/lib/data';

export const revalidate = 60;

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

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  return <DynamicListingDetail slug={slug} locale={locale} initialData={listing} />;
}
