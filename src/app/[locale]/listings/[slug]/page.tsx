import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
// import { HostLinkBanner } from '@/components/listings/HostLinkBanner';
import { getContentMeta, generateLodgingLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getListingBySlug } from '@/lib/data';
import { EXTERNAL_BOOKING_LINKS_ENABLED } from '@/lib/feature-flags';
import { RelatedItems } from '@/components/related/RelatedItems';

// ISR: render-on-demand, then cache. `revalidate` + an empty generateStaticParams
// register the route as SSG/ISR, so Next emits `Cache-Control: s-maxage=2592000,
// stale-while-revalidate` and the Vercel CDN serves rendered HTML from the edge —
// repeat hits stop re-invoking the function (the Active-CPU saving).
//
// History: an earlier ISR pilot (`revalidate=7200 + generateStaticParams=[]`) was
// blamed for a Next 16 + Turbopack SSG-fallback "server error" in prod and rolled
// back to force-dynamic (which disabled the React Data Cache). On Next 16.2.2 that
// pattern builds clean — the live ev-chargers/[slug] route uses exactly this — so
// it's restored here. unstable_cache wrappers (getListingBySlug, 10h TTL) still
// back the data layer. If the prod "server error" returns, the fallback is
// `export const dynamic = 'force-dynamic'` — open an issue.
export const revalidate = 2592000; // ISR: 30d
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta(
    'listings',
    slug,
    locale,
    'Accommodation | Chalkidiki Hub',
    'Find accommodation in Halkidiki',
    { thinThreshold: 300 },
  );
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  // Strip external-channel URLs from the client payload when the flag is off
  // so they don't leak into the RSC hydration script. The DB row keeps them;
  // only the public surface is scrubbed.
  const sanitizedListing = EXTERNAL_BOOKING_LINKS_ENABLED
    ? listing
    : { ...listing, booking_url: null, airbnb_url: null, website_url: null };

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
      <DynamicListingDetail slug={slug} locale={locale} initialData={sanitizedListing} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedItems
          type="listings"
          currentSlug={slug}
          area={(listing as unknown as { area?: string }).area}
          locale={locale}
        />
      </div>
    </>
  );
}
