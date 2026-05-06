import { permanentRedirect } from 'next/navigation';

type Props = { params: Promise<{ locale: string; slug: string }> };

// Redirects to /listings/[slug] (308). The previous "Under construction"
// placeholder was flagged by AdSense as low-value content. Stripe-flow
// sub-routes (success/cancelled/confirmed) stay live and unaffected.
export default async function BookRedirectPage({ params }: Props) {
  const { locale, slug } = await params;
  const prefix = locale === 'el' ? '' : `/${locale}`;
  permanentRedirect(`${prefix}/listings/${slug}`);
}
