import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicSaleDetail } from '@/components/sales/DynamicSaleDetail';
import { getContentMeta, generateSaleLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSaleBySlug, getSales } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const items = await getSales();
  return items.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('sales', slug, locale, 'Property | Chalkidiki Hub', 'Properties for sale in Halkidiki');
}

export default async function SaleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const sale = await getSaleBySlug(slug);
  if (!sale) notFound();

  return (
    <>
      <JsonLd data={generateSaleLD(sale as unknown as Record<string, unknown>, locale)} />
      <DynamicSaleDetail slug={slug} initialData={sale} />
    </>
  );
}
