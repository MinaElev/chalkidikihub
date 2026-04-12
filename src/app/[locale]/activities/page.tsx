import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import PageClient from './_client';

const titles: Record<string, string> = {
  el: 'Δραστηριότητες Χαλκιδική | ChalkidikiHub',
  en: 'Activities in Halkidiki | ChalkidikiHub',
  de: 'Aktivitäten Chalkidiki | ChalkidikiHub',
  bg: 'Дейности Халкидики | ChalkidikiHub',
  ru: 'Развлечения Халкидики | ChalkidikiHub',
  ro: 'Activități Halkidiki | ChalkidikiHub',
  sr: 'Aktivnosti Halkidiki | ChalkidikiHub',
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
  return <PageClient />;
}
