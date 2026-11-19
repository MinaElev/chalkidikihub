import type { Locale } from '@/i18n/config';
import { getVillages } from '@/lib/db/content';
import { NearbyPage, nearbyMetadata } from '@/features/village/nearby';
import { detailParams } from '@/lib/build-params';

export const revalidate = 86400;

export async function generateStaticParams() {
  return detailParams(async () => (await getVillages()).filter((v) => v.slug !== 'pyrgadikia-mainland').map((v) => ({ slug: v.slug })));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/places/[slug]/restaurants'>) {
  const { locale, slug } = await params;
  return nearbyMetadata('restaurants', locale as Locale, slug);
}

export default async function Page({ params }: PageProps<'/[locale]/places/[slug]/restaurants'>) {
  const { locale, slug } = await params;
  return <NearbyPage kind="restaurants" locale={locale as Locale} slug={slug} />;
}
