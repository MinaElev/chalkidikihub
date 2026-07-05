import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVillageContentMeta, getVillageContext, nearestByDistance, getNearbyVillages } from '../meta-helper';
import { VillageContentPage } from '@/components/villages/VillageContentPage';
import { createApiClient } from '@/lib/api-helpers';
import { transformBeach } from '@/lib/data';
import type { Beach } from '@/types';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

export async function generateStaticParams() {
  const supabase = createApiClient();
  const { data } = await supabase.from('villages').select('slug');
  return (data || []).map((v: { slug: string }) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return getVillageContentMeta(slug, locale, 'beaches');
}

export default async function VillageBeachesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data: villageRow } = await supabase.from('villages')
    .select('slug, area, latitude, longitude, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr')
    .eq('slug', slug).single();
  if (!villageRow) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vr = villageRow as any;
  const village = {
    slug: vr.slug,
    area: vr.area,
    name: { el: vr.name_el || '', en: vr.name_en || '', de: vr.name_de || '', bg: vr.name_bg || '', ru: vr.name_ru || '', ro: vr.name_ro || '', sr: vr.name_sr || '' },
  };

  const { data: beachRows } = await supabase.from('beaches')
    .select('*, beach_reviews(*)')
    .eq('area', village.area)
    .limit(200);
  const allItems = (beachRows || []).map(transformBeach) as unknown as Beach[];

  // Rank by real distance from the village (not area-wide rating), so this
  // page is genuinely distinct from every other village on the same leg.
  const ranked = vr.latitude != null && vr.longitude != null
    ? nearestByDistance(vr.latitude, vr.longitude, allItems)
    : allItems.slice(0, 12).map((i) => ({ ...i, distanceKm: 0 }));
  const items = ranked as unknown as Beach[];
  const distances: Record<string, number> = {};
  for (const r of ranked) distances[r.slug] = r.distanceKm;

  const { heading, intro } = await getVillageContext(slug, locale, 'beaches');
  const nearbyVillages = await getNearbyVillages(slug, village.area, vr.latitude, vr.longitude, locale);

  return (
    <VillageContentPage
      locale={locale} village={village} contentType="beaches"
      items={items} heading={heading} intro={intro} distances={distances}
      nearbyVillages={nearbyVillages}
    />
  );
}
