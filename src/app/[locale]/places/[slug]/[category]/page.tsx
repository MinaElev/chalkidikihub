import { permanentRedirect } from 'next/navigation';

// 308 redirect with no DB / data dependency — let it cache so bot crawls of
// the ~150 legacy URLs don't burn function invocations on every hit.
export const revalidate = 604800;

const VALID_CATEGORIES = ['beaches', 'restaurants', 'activities', 'listings'];

type Props = {
  params: Promise<{ locale: string; slug: string; category: string }>;
};

/**
 * Redirect /places/[slug]/[category] -> /in/[slug]/[category]
 *
 * Google has been crawling ~150 URLs under /places/[village]/restaurants etc.
 * The actual programmatic pages live at /in/[location]/[category].
 * This 308 permanent redirect consolidates link equity and fixes the 404s.
 */
export default async function PlacesCategoryRedirect({ params }: Props) {
  const { locale, slug, category } = await params;

  if (VALID_CATEGORIES.includes(category)) {
    permanentRedirect(`/${locale}/in/${slug}/${category}`);
  }

  // Unknown category — redirect to the village detail page
  permanentRedirect(`/${locale}/places/${slug}`);
}
