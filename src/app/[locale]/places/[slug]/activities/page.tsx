import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getVillageContentMeta } from '../meta-helper';
import { VillageContentPage } from '@/components/villages/VillageContentPage';

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamic = 'force-dynamic';
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getVillageContentMeta(slug, locale, 'activities');
}

export default async function VillageActivitiesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <VillageContentPage slug={slug} contentType="activities" />;
}
