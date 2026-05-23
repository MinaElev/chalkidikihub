import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { HostLinkBanner } from '@/components/listings/HostLinkBanner';
import { getContentMeta, generateLodgingLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
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
  return getContentMeta(
    'listings',
    slug,
    locale,
    'Accommodation | Chalkidiki Hub',
    'Find accommodation in Halkidiki',
    { thinThreshold: 200 },
  );
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Καταλύματα', en: 'Listings', de: 'Unterkünfte', bg: 'Обяви', ru: 'Объявления', ro: 'Anunțuri', sr: 'Oglasi' };
  const listTitle = (listing as unknown as Record<string, unknown>).title as Record<string, string>;
  const itemName = listTitle?.[locale] || listTitle?.el || listTitle?.en || '';

  return (
    <>
      <JsonLd data={generateLodgingLD(listing as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Listings', url: localeUrl(locale, 'listings') },
        { name: itemName, url: localeUrl(locale, `listings/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicListingDetail slug={slug} locale={locale} initialData={listing} />
      {(listing as unknown as { owner_id?: string }).owner_id && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <HostLinkBanner
            ownerId={(listing as unknown as { owner_id: string }).owner_id}
            locale={locale}
            excludeSlug={slug}
          />
        </div>
      )}
    </>
  );
}
