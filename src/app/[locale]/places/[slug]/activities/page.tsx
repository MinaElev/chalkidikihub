import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVillageContentMeta, getVillageContext } from '../meta-helper';
import { VillageContentPage } from '@/components/villages/VillageContentPage';
import { createApiClient } from '@/lib/api-helpers';
import { transformActivity } from '@/lib/data';
import type { Activity } from '@/types';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

export async function generateStaticParams() {
  const supabase = createApiClient();
  const { data } = await supabase.from('villages').select('slug');
  return (data || []).map((v: { slug: string }) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getVillageContentMeta(slug, locale, 'activities');
}

export default async function VillageActivitiesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data: villageRow } = await supabase.from('villages')
    .select('slug, area, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr')
    .eq('slug', slug).single();
  if (!villageRow) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vr = villageRow as any;
  const village = {
    slug: vr.slug,
    area: vr.area,
    name: { el: vr.name_el || '', en: vr.name_en || '', de: vr.name_de || '', bg: vr.name_bg || '', ru: vr.name_ru || '', ro: vr.name_ro || '', sr: vr.name_sr || '' },
  };

  const { data: activityRows } = await supabase.from('activities')
    .select('*, activity_reviews(*)')
    .eq('area', village.area)
    .order('rating', { ascending: false })
    .limit(30);
  const items = (activityRows || []).map(transformActivity) as unknown as Activity[];

  const { heading, description } = await getVillageContext(slug, locale, 'activities');

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      <VillageContentPage locale={locale} village={village} contentType="activities" items={items} />
    </>
  );
}
