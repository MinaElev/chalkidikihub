import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import { getAreas } from '@/lib/data';
import { AREAS } from '@/lib/constants';
import PageClient from './_client';

// Refresh DB-backed areas hourly. Falls back to the static AREAS constant
// if the DB query returns nothing.
export const revalidate = 3600;

const titles: Record<string, string> = {
  el: 'Περιοχές Χαλκιδικής | ChalkidikiHub',
  en: 'Halkidiki Areas | ChalkidikiHub',
  de: 'Regionen Chalkidiki | ChalkidikiHub',
  bg: 'Региони Халкидики | ChalkidikiHub',
  ru: 'Районы Халкидики | ChalkidikiHub',
  ro: 'Zone Halkidiki | ChalkidikiHub',
  sr: 'Oblasti Halkidikija | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Εξερευνήστε τις 4 περιοχές της Χαλκιδικής: Κασσάνδρα, Σιθωνία, Άθως και Ενδοχώρα.',
  en: 'Explore the 4 areas of Halkidiki: Kassandra, Sithonia, Athos and Mainland.',
  de: 'Entdecken Sie die 4 Regionen von Chalkidiki: Kassandra, Sithonia, Athos und Hinterland.',
  bg: 'Разгледайте 4-те региона на Халкидики: Касандра, Ситония, Атос и вътрешността.',
  ru: 'Исследуйте 4 района Халкидики: Кассандра, Ситония, Афон и материк.',
  ro: 'Explorați cele 4 zone ale Halkidikiului: Kassandra, Sithonia, Athos și interior.',
  sr: 'Istražite 4 oblasti Halkidikija: Kasandra, Sitonija, Atos i unutrašnjost.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'areas', locale, ogType: 'area' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const dbAreas = await getAreas().catch(() => []);
  const initialAreas = dbAreas.length > 0 ? dbAreas : AREAS;
  return <PageClient initialAreas={initialAreas} />;
}
