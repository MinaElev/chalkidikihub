import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import { getRestaurants } from '@/lib/data';
import PageClient from './_client';

export const revalidate = 3600; // ISR: 1 hour — on-demand revalidation handles instant updates

const titles: Record<string, string> = {
  el: 'Εστιατόρια Χαλκιδικής | ChalkidikiHub',
  en: 'Restaurants in Halkidiki | ChalkidikiHub',
  de: 'Restaurants Chalkidiki | ChalkidikiHub',
  bg: 'Ресторанти Халкидики | ChalkidikiHub',
  ru: 'Рестораны Халкидики | ChalkidikiHub',
  ro: 'Restaurante Halkidiki | ChalkidikiHub',
  sr: 'Restorani Halkidiki | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε τα καλύτερα εστιατόρια της Χαλκιδικής. Ταβέρνες, ψαροταβέρνες και καφέ δίπλα στη θάλασσα.',
  en: 'Find the best restaurants in Halkidiki. Tavernas, seafood restaurants and cafes by the sea.',
  de: 'Die besten Restaurants in Chalkidiki. Tavernen, Fischrestaurants und Cafés am Meer.',
  bg: 'Намерете най-добрите ресторанти в Халкидики. Таверни, рибни ресторанти и кафенета край морето.',
  ru: 'Лучшие рестораны Халкидики. Таверны, рыбные рестораны и кафе у моря.',
  ro: 'Cele mai bune restaurante din Halkidiki. Taverne, restaurante cu pește și cafenele lângă mare.',
  sr: 'Najbolji restorani u Halkidikiju. Taverne, riblji restorani i kafići pored mora.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'restaurants', locale, ogType: 'restaurant' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const restaurants = await getRestaurants();
  return <PageClient initialData={restaurants} />;
}
