import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import { getSales } from '@/lib/data';
import PageClient from './_client';

export const revalidate = 3600; // ISR: 1 hour — on-demand revalidation handles instant updates

const titles: Record<string, string> = {
  el: 'Ακίνητα Χαλκιδική | ChalkidikiHub',
  en: 'Real Estate Halkidiki | ChalkidikiHub',
  de: 'Immobilien Chalkidiki | ChalkidikiHub',
  bg: 'Имоти Халкидики | ChalkidikiHub',
  ru: 'Недвижимость Халкидики | ChalkidikiHub',
  ro: 'Imobiliare Halkidiki | ChalkidikiHub',
  sr: 'Nekretnine Halkidiki | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Σπίτια, οικόπεδα και διαμερίσματα προς πώληση στη Χαλκιδική. Βρείτε το ακίνητο των ονείρων σας.',
  en: 'Houses, land and apartments for sale in Halkidiki. Find your dream property in Greece.',
  de: 'Häuser, Grundstücke und Wohnungen zum Verkauf in Chalkidiki. Finden Sie Ihre Traumimmobilie.',
  bg: 'Къщи, парцели и апартаменти за продажба в Халкидики.',
  ru: 'Дома, участки и квартиры на продажу в Халкидики. Найдите недвижимость мечты.',
  ro: 'Case, terenuri și apartamente de vânzare în Halkidiki.',
  sr: 'Kuće, placevi i stanovi na prodaju u Halkidikiju. Pronađite nekretninu iz snova.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'sales', locale, ogType: 'sales' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sales = await getSales();
  return <PageClient initialData={sales} />;
}
