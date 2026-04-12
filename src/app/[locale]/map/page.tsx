import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import MapClient from './_client';

const titles: Record<string, string> = {
  el: 'Χάρτης Χαλκιδικής | ChalkidikiHub',
  en: 'Halkidiki Map | ChalkidikiHub',
  de: 'Karte Chalkidiki | ChalkidikiHub',
  bg: 'Карта Халкидики | ChalkidikiHub',
  ru: 'Карта Халкидики | ChalkidikiHub',
  ro: 'Hartă Halkidiki | ChalkidikiHub',
  sr: 'Mapa Halkidikija | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Διαδραστικός χάρτης Χαλκιδικής με παραλίες, εστιατόρια, καταλύματα και δραστηριότητες.',
  en: 'Interactive Halkidiki map with beaches, restaurants, accommodations and activities.',
  de: 'Interaktive Karte von Chalkidiki mit Stränden, Restaurants und Unterkünften.',
  bg: 'Интерактивна карта на Халкидики с плажове, ресторанти и настаняване.',
  ru: 'Интерактивная карта Халкидики с пляжами, ресторанами и жильём.',
  ro: 'Hartă interactivă Halkidiki cu plaje, restaurante și cazare.',
  sr: 'Interaktivna mapa Halkidikija sa plažama, restoranima i smeštajem.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'map', locale });
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MapClient />;
}
