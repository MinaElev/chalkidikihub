import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import { getBeaches } from '@/lib/data';
import PageClient from './_client';

export const revalidate = 3600; // ISR: 1 hour — on-demand revalidation handles instant updates

const titles: Record<string, string> = {
  el: 'Παραλίες Χαλκιδικής | ChalkidikiHub',
  en: 'Halkidiki Beaches | ChalkidikiHub',
  de: 'Strände Chalkidiki | ChalkidikiHub',
  bg: 'Плажове Халкидики | ChalkidikiHub',
  ru: 'Пляжи Халкидики | ChalkidikiHub',
  ro: 'Plaje Halkidiki | ChalkidikiHub',
  sr: 'Plaže Halkidikija | ChalkidikiHub',
};

const descriptions: Record<string, string> = {
  el: 'Ανακαλύψτε τις καλύτερες παραλίες της Χαλκιδικής. Κρυστάλλινα νερά, αμμώδεις και βραχώδεις ακτές.',
  en: 'Discover the best beaches of Halkidiki. Crystal clear waters, sandy and rocky shores.',
  de: 'Entdecken Sie die besten Strände von Chalkidiki. Kristallklares Wasser, Sand- und Felsstrände.',
  bg: 'Открийте най-добрите плажове на Халкидики. Кристално чисти води, пясъчни и скалисти брегове.',
  ru: 'Откройте лучшие пляжи Халкидики. Кристально чистая вода, песчаные и скалистые берега.',
  ro: 'Descoperiți cele mai bune plaje din Halkidiki. Ape cristal, plaje cu nisip și stânci.',
  sr: 'Otkrijte najbolje plaže Halkidikija. Kristalno čista voda, peščane i stenovite obale.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'beaches', locale, ogType: 'beach' });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const beaches = await getBeaches();
  return <PageClient initialData={beaches} />;
}
