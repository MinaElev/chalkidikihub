import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { collectionMeta } from '@/lib/seo';
import EvChargersClient from './_client';

// Static shell — data is fetched client-side from the OCM API, no server
// data dependency, so no reason to regenerate per request.
export const revalidate = 2592000;

const titles: Record<string, string> = {
  el: 'Φορτιστές EV Χαλκιδική',
  en: 'EV Chargers Halkidiki',
  de: 'EV-Ladestationen Chalkidiki',
  bg: 'EV зарядни Халкидики',
  ru: 'Зарядки EV Халкидики',
  ro: 'Stații EV Halkidiki',
  sr: 'EV punjači Halkidiki',
};

const descriptions: Record<string, string> = {
  el: 'Βρείτε σταθμούς φόρτισης ηλεκτρικών οχημάτων στη Χαλκιδική.',
  en: 'Find electric vehicle charging stations in Halkidiki, Greece.',
  de: 'Finden Sie Ladestationen für Elektrofahrzeuge in Chalkidiki.',
  bg: 'Намерете станции за зареждане на електрически автомобили в Халкидики.',
  ru: 'Найдите зарядные станции для электромобилей в Халкидики.',
  ro: 'Găsiți stații de încărcare pentru vehicule electrice în Halkidiki.',
  sr: 'Pronađite stanice za punjenje električnih vozila u Halkidikiju.',
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return collectionMeta({ titles, descriptions, path: 'ev-chargers', locale });
}

export default async function EvChargersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EvChargersClient />;
}
