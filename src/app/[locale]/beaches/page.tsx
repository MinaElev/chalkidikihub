import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta, generateItemListLD, localeUrl } from '@/lib/seo';
import { getBeaches } from '@/lib/data';
import { JsonLd } from '@/components/ui/JsonLd';
import PageClient from './_client';

export const revalidate = 3600; // ISR: 1 hour — on-demand revalidation handles instant updates

const titles: Record<string, string> = {
  el: 'Παραλίες Χαλκιδικής',
  en: 'Halkidiki Beaches',
  de: 'Strände Chalkidiki',
  bg: 'Плажове Халкидики',
  ru: 'Пляжи Халкидики',
  ro: 'Plaje Halkidiki',
  sr: 'Plaže Halkidikija',
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
  const itemListLD = generateItemListLD(
    titles[locale] || titles.en,
    beaches.map((b) => ({
      name: b.name[locale] || b.name.el || b.name.en,
      url: localeUrl(locale, `beaches/${b.slug}`),
    })),
  );
  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />
      <PageClient initialData={beaches} />
    </>
  );
}
