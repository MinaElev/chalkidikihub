import type { Metadata } from 'next';
import { collectionMeta } from '@/lib/seo';

const titles: Record<string, string> = {
  el: 'Παραλίες Χαλκιδικής',
  en: 'Halkidiki Beaches',
  de: 'Strände in Chalkidiki',
  bg: 'Плажове в Халкидики',
  ru: 'Пляжи Халкидики',
  ro: 'Plaje în Halkidiki',
  sr: 'Plaže Halkidikija',
};

const descriptions: Record<string, string> = {
  el: 'Ανακαλύψτε τις ομορφότερες παραλίες της Χαλκιδικής — κρυστάλλινα νερά, αμμουδιές με Γαλάζια Σημαία και κρυφοί κόλποι στην Κασσάνδρα, Σιθωνία και Άθως.',
  en: 'Discover the most beautiful beaches of Halkidiki — crystal-clear waters, Blue Flag sandy shores and hidden coves in Kassandra, Sithonia and Athos.',
  de: 'Entdecken Sie die schönsten Strände Chalkidikis — kristallklares Wasser, Blaue-Flagge-Sandstrände und versteckte Buchten in Kassandra, Sithonia und Athos.',
  bg: 'Открийте най-красивите плажове на Халкидики — кристално чисти води, плажове със Син флаг и скрити заливи в Касандра, Ситония и Атон.',
  ru: 'Откройте самые красивые пляжи Халкидики — кристально чистые воды, пляжи с Голубым флагом и скрытые бухты на Кассандре, Ситонии и Афоне.',
  ro: 'Descoperiți cele mai frumoase plaje din Halkidiki — ape cristaline, plaje cu Steag Albastru și golfuri ascunse în Kassandra, Sithonia și Athos.',
  sr: 'Otkrijte najlepše plaže Halkidikija — kristalno čiste vode, plaže sa Plavom zastavom i skriveni zalivi na Kasandri, Sitoniji i Atosu.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'beaches', locale, ogType: 'beach' });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
