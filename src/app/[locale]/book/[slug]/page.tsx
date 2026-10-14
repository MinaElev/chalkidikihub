import { permanentRedirect } from 'next/navigation';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Redirects to /listings/[slug] (308). The previous "Under construction"
// placeholder was flagged by search engines as low-value content. The PMS
// booking sub-routes (success/cancelled/confirmed) were removed with the PMS;
// seo/redirects.ts sends them to the listing too.
export default async function BookRedirectPage({ params }: Props) {
  const { locale, slug } = await params;
  const prefix = locale === 'el' ? '' : `/${locale}`;
  permanentRedirect(`${prefix}/listings/${slug}`);
}
