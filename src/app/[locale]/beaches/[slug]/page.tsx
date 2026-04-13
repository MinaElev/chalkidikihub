import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

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

  const supabase = createApiClient();
  const { data } = await supabase.from('beaches').select('id').eq('slug', slug).single();
  if (!data) notFound();

  return <DynamicBeachDetail slug={slug} />;
}
