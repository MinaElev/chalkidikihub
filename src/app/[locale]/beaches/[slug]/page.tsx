import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { getContentMeta, generateBeachLD } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getBeachBySlug, getBeaches } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const items = await getBeaches();
  return items.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('beaches', slug, locale, 'Beach | Chalkidiki Hub', 'Discover beaches in Halkidiki');
}

export default async function BeachDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const beach = await getBeachBySlug(slug);
  if (!beach) notFound();

  return (
    <>
      <JsonLd data={generateBeachLD(beach as unknown as Record<string, unknown>, locale)} />
      <DynamicBeachDetail slug={slug} initialData={beach} />
    </>
  );
}
