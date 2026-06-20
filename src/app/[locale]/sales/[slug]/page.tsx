import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicSaleDetail } from '@/components/sales/DynamicSaleDetail';
import { getContentMeta, generateSaleLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getSaleBySlug, getSales } from '@/lib/data';
import { FaqSection } from '@/components/ui/FaqSection';
import { generateSalesFaqs } from '@/lib/faq-generators';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

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

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Πωλήσεις', en: 'Sales', de: 'Verkäufe', bg: 'Продажби', ru: 'Продажи', ro: 'Vânzări', sr: 'Prodaje' };
  const saleTitle = (sale as unknown as Record<string, unknown>).title as Record<string, string>;
  const itemName = saleTitle?.[locale] || saleTitle?.el || saleTitle?.en || '';

  return (
    <>
      <JsonLd data={generateSaleLD(sale as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Sales', url: localeUrl(locale, 'sales') },
        { name: itemName, url: localeUrl(locale, `sales/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicSaleDetail slug={slug} initialData={sale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqSection faqs={generateSalesFaqs({ title: itemName }, locale)} />
      </div>
    </>
  );
}
