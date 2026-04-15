import type { Metadata } from 'next';
import { collectionMeta } from '@/lib/seo';

const titles: Record<string, string> = {
  el: 'Καταλύματα στη Χαλκιδική',
  en: 'Accommodation in Halkidiki',
  de: 'Unterkünfte in Chalkidiki',
  bg: 'Настаняване в Халкидики',
  ru: 'Жильё на Халкидики',
  ro: 'Cazare în Halkidiki',
  sr: 'Smeštaj na Halkidikiju',
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε τα καλύτερα καταλύματα στη Χαλκιδική — ξενοδοχεία, ενοικιαζόμενα δωμάτια, βίλες και διαμερίσματα σε Κασσάνδρα, Σιθωνία και Άθως.',
  en: 'Find the best accommodation in Halkidiki — hotels, rental rooms, villas and apartments in Kassandra, Sithonia and Athos.',
  de: 'Finden Sie die besten Unterkünfte in Chalkidiki — Hotels, Ferienwohnungen, Villen und Apartments in Kassandra, Sithonia und Athos.',
  bg: 'Намерете най-доброто настаняване в Халкидики — хотели, стаи под наем, вили и апартаменти в Касандра, Ситония и Атон.',
  ru: 'Найдите лучшее жильё на Халкидики — отели, апартаменты, виллы и квартиры на Кассандре, Ситонии и Афоне.',
  ro: 'Găsiți cele mai bune cazări în Halkidiki — hoteluri, camere de închiriat, vile și apartamente în Kassandra, Sithonia și Athos.',
  sr: 'Pronađite najbolji smeštaj na Halkidikiju — hoteli, sobe za iznajmljivanje, vile i apartmani na Kasandri, Sitoniji i Atosu.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'listings', locale, ogType: 'listing' });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
