import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getVillageContentMeta, getVillageContext } from '../meta-helper';
import { VillageContentPage } from '@/components/villages/VillageContentPage';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamic = 'force-dynamic';
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getVillageContentMeta(slug, locale, 'beaches');
}

export default async function VillageBeachesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { heading, description } = await getVillageContext(slug, locale, 'beaches');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h1>
      <p className="text-gray-600 mb-6">{description}</p>
      <VillageContentPage slug={slug} contentType="beaches" />
    </div>
  );
}
