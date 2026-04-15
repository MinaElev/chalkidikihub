import type { Metadata } from 'next';
import { collectionMeta } from '@/lib/seo';

const titles: Record<string, string> = {
  el: 'Δραστηριότητες & Αξιοθέατα Χαλκιδικής',
  en: 'Halkidiki Activities & Attractions',
  de: 'Aktivitäten & Sehenswürdigkeiten in Chalkidiki',
  bg: 'Дейности и забележителности в Халкидики',
  ru: 'Развлечения и достопримечательности Халкидики',
  ro: 'Activități și atracții în Halkidiki',
  sr: 'Aktivnosti i znamenitosti Halkidikija',
};

const descriptions: Record<string, string> = {
  el: 'Δραστηριότητες και αξιοθέατα στη Χαλκιδική — θαλάσσια σπορ, πεζοπορία, εκδρομές, κρουαζιέρες και πολιτιστικά μνημεία σε Κασσάνδρα, Σιθωνία και Άθως.',
  en: 'Activities and attractions in Halkidiki — water sports, hiking, excursions, cruises and cultural landmarks in Kassandra, Sithonia and Athos.',
  de: 'Aktivitäten und Sehenswürdigkeiten in Chalkidiki — Wassersport, Wandern, Ausflüge, Kreuzfahrten und Kulturdenkmäler in Kassandra, Sithonia und Athos.',
  bg: 'Дейности и забележителности в Халкидики — водни спортове, пешеходен туризъм, екскурзии, круизи и културни паметници в Касандра, Ситония и Атон.',
  ru: 'Развлечения и достопримечательности Халкидики — водные виды спорта, пешие прогулки, экскурсии, круизы и культурные памятники на Кассандре, Ситонии и Афоне.',
  ro: 'Activități și atracții în Halkidiki — sporturi nautice, drumeții, excursii, croaziere și monumente culturale în Kassandra, Sithonia și Athos.',
  sr: 'Aktivnosti i znamenitosti Halkidikija — vodeni sportovi, pešačenje, izleti, krstarenja i kulturni spomenici na Kasandri, Sitoniji i Atosu.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'activities', locale, ogType: 'activity' });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
