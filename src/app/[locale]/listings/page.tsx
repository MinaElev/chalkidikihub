import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import { getListings } from '@/lib/data';
import PageClient from './_client';

export const revalidate = 300; // ISR: regenerate every 5 minutes

const titles: Record<string, string> = {
  el: 'Ενοικιαζόμενα Καταλύματα Χαλκιδική | ChalkidikiHub',
  en: 'Vacation Rentals Halkidiki | ChalkidikiHub',
  de: 'Ferienwohnungen Chalkidiki | ChalkidikiHub',
  bg: 'Настаняване Халкидики | ChalkidikiHub',
  ru: 'Аренда жилья Халкидики | ChalkidikiHub',
  ro: 'Cazare Halkidiki | ChalkidikiHub',
  sr: 'Smeštaj Halkidiki | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε το ιδανικό κατάλυμα στη Χαλκιδική. Σπίτια, διαμερίσματα και βίλες κοντά στη θάλασσα.',
  en: 'Find the perfect vacation rental in Halkidiki. Houses, apartments, and villas near the sea.',
  de: 'Finden Sie die perfekte Ferienunterkunft in Chalkidiki. Häuser, Wohnungen und Villen am Meer.',
  bg: 'Намерете перфектното настаняване в Халкидики. Къщи, апартаменти и вили близо до морето.',
  ru: 'Найдите идеальное жильё в Халкидики. Дома, квартиры и виллы у моря.',
  ro: 'Găsiți cazarea perfectă în Halkidiki. Case, apartamente și vile lângă mare.',
  sr: 'Pronađite savršen smeštaj u Halkidikiju. Kuće, stanovi i vile pored mora.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'listings', locale, ogType: 'listing' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listings = await getListings();
  return <PageClient initialData={listings} />;
}
