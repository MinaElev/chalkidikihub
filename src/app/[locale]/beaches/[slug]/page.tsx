import { setRequestLocale } from 'next-intl/server';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { getContentMeta } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('beaches', slug, locale, 'Beach | Chalkidiki Hub', 'Discover beaches in Halkidiki');
}

export default async function BeachDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Always use DynamicBeachDetail to fetch live content from DB
  return <DynamicBeachDetail slug={slug} />;
}
