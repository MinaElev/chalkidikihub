import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta, generateItemListLD, localeUrl } from '@/lib/seo';
import { getActivities, toActivityCard } from '@/lib/data';
import { JsonLd } from '@/components/ui/JsonLd';
import PageClient from './_client';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

const titles: Record<string, string> = {
  el: 'Δραστηριότητες Χαλκιδική',
  en: 'Activities in Halkidiki',
  de: 'Aktivitäten Chalkidiki',
  bg: 'Дейности Халкидики',
  ru: 'Развлечения Халкидики',
  ro: 'Activități Halkidiki',
  sr: 'Aktivnosti Halkidiki',
};

const descriptions: Record<string, string> = {
  el: 'Εξερευνήστε δραστηριότητες στη Χαλκιδική. Αξιοθέατα, μουσεία, extreme sports και εκδρομές.',
  en: 'Explore activities in Halkidiki. Attractions, museums, water sports and excursions.',
  de: 'Aktivitäten in Chalkidiki. Sehenswürdigkeiten, Museen, Wassersport und Ausflüge.',
  bg: 'Разгледайте дейностите в Халкидики. Забележителности, музеи, водни спортове и екскурзии.',
  ru: 'Исследуйте развлечения в Халкидики. Достопримечательности, музеи, водные виды спорта и экскурсии.',
  ro: 'Explorați activitățile din Halkidiki. Atracții, muzee, sporturi nautice și excursii.',
  sr: 'Istražite aktivnosti u Halkidikiju. Atrakcije, muzeji, vodeni sportovi i izleti.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'activities', locale, ogType: 'activity' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const activities = await getActivities();
  const itemListLD = generateItemListLD(
    titles[locale] || titles.en,
    activities.map((a) => ({
      name: a.name[locale] || a.name.el || a.name.en,
      url: localeUrl(locale, `activities/${a.slug}`),
    })),
  );
  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />
      <PageClient initialData={activities.map(toActivityCard)} />
    </>
  );
}
