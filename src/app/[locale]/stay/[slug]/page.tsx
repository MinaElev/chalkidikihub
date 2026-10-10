import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { localeUrl } from '@/lib/seo/site';
import ListingPage, { generateMetadata as listingMetadata } from '../../listings/[slug]/page';

/**
 * The owner's shareable "brand page". Same content as /listings/{slug}, kept
 * alive because owners have shared these links; it never competes in search
 * (noindex, canonical to the listing — as in v3).
 */
export const revalidate = 86400;

export async function generateMetadata(props: PageProps<'/[locale]/stay/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const base = await listingMetadata(props as unknown as PageProps<'/[locale]/listings/[slug]'>);
  return {
    ...base,
    robots: { index: false, follow: true },
    alternates: { canonical: localeUrl(locale as Locale, `/listings/${slug}`) },
  };
}

export default function StayPage(props: PageProps<'/[locale]/stay/[slug]'>) {
  return <ListingPage {...(props as unknown as PageProps<'/[locale]/listings/[slug]'>)} />;
}
