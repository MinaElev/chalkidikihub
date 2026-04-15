import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { getContentMeta, generateLodgingLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getListingBySlug, getListings } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const items = await getListings();
  return items.map(item => ({ slug: item.slug }));
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

  return (
    <>
      <JsonLd data={generateLodgingLD(listing as unknown as Record<string, unknown>, locale)} />
      <DynamicListingDetail slug={slug} locale={locale} initialData={listing} />
    </>
  );
}
