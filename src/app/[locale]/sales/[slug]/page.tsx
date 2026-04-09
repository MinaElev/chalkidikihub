import { setRequestLocale } from 'next-intl/server';
import { DynamicSaleDetail } from '@/components/sales/DynamicSaleDetail';
import { getContentMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('sales', slug, locale, 'Property | Chalkidiki Hub', 'Properties for sale in Halkidiki');
}

export default async function SaleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DynamicSaleDetail slug={slug} />;
}
