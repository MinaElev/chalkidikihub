import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicSaleDetail } from '@/components/sales/DynamicSaleDetail';
import { getContentMeta } from '@/lib/seo';
import { getSaleBySlug } from '@/lib/data';

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('sales', slug, locale, 'Property | Chalkidiki Hub', 'Properties for sale in Halkidiki');
}

export default async function SaleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const sale = await getSaleBySlug(slug);
  if (!sale) notFound();

  return <DynamicSaleDetail slug={slug} initialData={sale} />;
}
