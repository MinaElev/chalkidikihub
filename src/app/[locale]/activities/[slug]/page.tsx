import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicActivityDetail } from '@/components/listings/DynamicActivityDetail';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('activities', slug, locale, 'Activity | Chalkidiki Hub', 'Things to do in Halkidiki');
}

export default async function ActivityDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('activities').select('id').eq('slug', slug).single();
  if (!data) notFound();

  return <DynamicActivityDetail slug={slug} />;
}
