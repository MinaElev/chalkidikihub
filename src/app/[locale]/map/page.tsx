import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo/metadata';
import MapClient from './_client';

/** Indexed in Greek and English, plus wherever v3 earned clicks (isProven); inventory.ts lists the same set. */
const MAP_LOCALES: Locale[] = ['el', 'en'];

const COPY: Record<Locale, { title: string; description: string }> = {
  el: { title: 'Χάρτης Χαλκιδικής: παραλίες, φαγητό και διαμονή', description: 'Διαδραστικός χάρτης της Χαλκιδικής με τις παραλίες, τα εστιατόρια, τις δραστηριότητες και τα καταλύματα. Φιλτράρετε ανά κατηγορία και ανοίξτε τη σελίδα κάθε σημείου.' },
  en: { title: 'Halkidiki map: beaches, food and places to stay', description: 'Interactive map of Halkidiki with its beaches, restaurants, activities and places to stay. Filter by category and open the page of any spot.' },
  de: { title: 'Chalkidiki-Karte: Strände, Essen und Unterkünfte', description: 'Interaktive Karte von Chalkidiki mit Stränden, Restaurants, Aktivitäten und Unterkünften. Nach Kategorie filtern und die Seite jedes Ortes öffnen.' },
  ro: { title: 'Harta Halkidiki: plaje, restaurante și cazare', description: 'Hartă interactivă a Halkidiki cu plaje, restaurante, activități și locuri de cazare. Filtrați după categorie și deschideți pagina fiecărui loc.' },
  bg: { title: 'Карта на Халкидики: плажове, храна и настаняване', description: 'Интерактивна карта на Халкидики с плажове, ресторанти, забележителности и места за настаняване. Филтрирайте по категория и отворете страницата на всяко място.' },
  sr: { title: 'Mapa Halkidikija: plaže, hrana i smeštaj', description: 'Interaktivna mapa Halkidikija sa plažama, restoranima, aktivnostima i smeštajem. Filtrirajte po kategoriji i otvorite stranicu svakog mesta.' },
  ru: { title: 'Карта Халкидики: пляжи, рестораны и жильё', description: 'Интерактивная карта Халкидики с пляжами, ресторанами, достопримечательностями и жильём. Фильтруйте по категориям и открывайте страницу любого места.' },
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return buildMetadata({ locale, path: '/map', ...COPY[locale], indexableLocales: MAP_LOCALES });
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* Server-rendered H1 (visually hidden — the interactive map fills the
          viewport). The SSR HTML previously had no <h1>. */}
      <h1 className="sr-only">{COPY[locale as Locale].title}</h1>
      <MapClient />
    </>
  );
}
