import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicSaleDetail } from '@/components/sales/DynamicSaleDetail';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('sales', slug, locale, 'Property | Chalkidiki Hub', 'Properties for sale in Halkidiki');
}

export default async function SaleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('sales').select('id').eq('slug', slug).single();
  if (!data) notFound();

  return <DynamicSaleDetail slug={slug} />;
}
