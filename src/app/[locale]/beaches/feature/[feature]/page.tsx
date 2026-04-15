import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PageClient from './_client';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const FEATURE_LABELS: Record<string, Record<string, string>> = {
  'sandy': { el: 'Αμμώδεις', en: 'Sandy', de: 'Sandstrände', bg: 'Пясъчни', ru: 'Песчаные', ro: 'Cu nisip', sr: 'Peščane' },
  'organized': { el: 'Οργανωμένες', en: 'Organized', de: 'Organisierte', bg: 'Организирани', ru: 'Организованные', ro: 'Organizate', sr: 'Organizovane' },
  'secluded': { el: 'Απομονωμένες', en: 'Secluded', de: 'Abgelegene', bg: 'Уединени', ru: 'Уединённые', ro: 'Izolate', sr: 'Skrivene' },
  'family-friendly': { el: 'Οικογενειακές', en: 'Family-Friendly', de: 'Familienfreundliche', bg: 'За семейства', ru: 'Семейные', ro: 'Pentru familii', sr: 'Za porodice' },
  'blue-flag': { el: 'Γαλάζια Σημαία', en: 'Blue Flag', de: 'Blaue Flagge', bg: 'Син флаг', ru: 'Голубой флаг', ro: 'Steag Albastru', sr: 'Plava zastava' },
  'water-sports': { el: 'Θαλάσσια Σπορ', en: 'Water Sports', de: 'Wassersport', bg: 'Водни спортове', ru: 'Водные виды спорта', ro: 'Sporturi nautice', sr: 'Vodeni sportovi' },
  'accessible': { el: 'Προσβάσιμες', en: 'Accessible', de: 'Barrierefreie', bg: 'Достъпни', ru: 'Доступные', ro: 'Accesibile', sr: 'Pristupačne' },
  'nudist': { el: 'Γυμνιστών', en: 'Nudist', de: 'FKK', bg: 'Нудистки', ru: 'Нудистские', ro: 'Nudiste', sr: 'Nudističke' },
};

const FEATURE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'sandy': {
    el: 'Αμμώδεις παραλίες στη Χαλκιδική.',
    en: 'Sandy beaches in Halkidiki.',
    de: 'Sandstrände in Chalkidiki.',
    bg: 'Пясъчни плажове в Халкидики.',
    ru: 'Песчаные пляжи Халкидики.',
    ro: 'Plaje cu nisip în Halkidiki.',
    sr: 'Peščane plaže u Halkidikiju.',
  },
  'organized': {
    el: 'Οργανωμένες παραλίες στη Χαλκιδική.',
    en: 'Organized beaches in Halkidiki.',
    de: 'Organisierte Strände in Chalkidiki.',
    bg: 'Организирани плажове в Халкидики.',
    ru: 'Организованные пляжи Халкидики.',
    ro: 'Plaje organizate în Halkidiki.',
    sr: 'Organizovane plaže u Halkidikiju.',
  },
  'secluded': {
    el: 'Απομονωμένες παραλίες στη Χαλκιδική.',
    en: 'Secluded beaches in Halkidiki.',
    de: 'Abgelegene Strände in Chalkidiki.',
    bg: 'Уединени плажове в Халкидики.',
    ru: 'Уединённые пляжи Халкидики.',
    ro: 'Plaje izolate în Halkidiki.',
    sr: 'Skrivene plaže u Halkidikiju.',
  },
  'family-friendly': {
    el: 'Οικογενειακές παραλίες στη Χαλκιδική.',
    en: 'Family-friendly beaches in Halkidiki.',
    de: 'Familienfreundliche Strände in Chalkidiki.',
    bg: 'Плажове за семейства в Халкидики.',
    ru: 'Семейные пляжи Халкидики.',
    ro: 'Plaje pentru familii în Halkidiki.',
    sr: 'Plaže za porodice u Halkidikiju.',
  },
  'blue-flag': {
    el: 'Παραλίες με Γαλάζια Σημαία στη Χαλκιδική.',
    en: 'Blue Flag beaches in Halkidiki.',
    de: 'Blaue Flagge Strände in Chalkidiki.',
    bg: 'Плажове със Син флаг в Халкидики.',
    ru: 'Пляжи с Голубым флагом в Халкидики.',
    ro: 'Plaje cu Steag Albastru în Halkidiki.',
    sr: 'Plaže sa Plavom zastavom u Halkidikiju.',
  },
  'water-sports': {
    el: 'Παραλίες με θαλάσσια σπορ στη Χαλκιδική.',
    en: 'Beaches with water sports in Halkidiki.',
    de: 'Strände mit Wassersport in Chalkidiki.',
    bg: 'Плажове с водни спортове в Халкидики.',
    ru: 'Пляжи с водными видами спорта в Халкидики.',
    ro: 'Plaje cu sporturi nautice în Halkidiki.',
    sr: 'Plaže sa vodenim sportovima u Halkidikiju.',
  },
  'accessible': {
    el: 'Προσβάσιμες παραλίες στη Χαλκιδική.',
    en: 'Accessible beaches in Halkidiki.',
    de: 'Barrierefreie Strände in Chalkidiki.',
    bg: 'Достъпни плажове в Халкидики.',
    ru: 'Доступные пляжи Халкидики.',
    ro: 'Plaje accesibile în Halkidiki.',
    sr: 'Pristupačne plaže u Halkidikiju.',
  },
  'nudist': {
    el: 'Παραλίες γυμνιστών στη Χαλκιδική.',
    en: 'Nudist beaches in Halkidiki.',
    de: 'FKK-Strände in Chalkidiki.',
    bg: 'Нудистки плажове в Халкидики.',
    ru: 'Нудистские пляжи Халкидики.',
    ro: 'Plaje nudiste în Halkidiki.',
    sr: 'Nudističke plaže u Halkidikiju.',
  },
};

type Props = { params: Promise<{ locale: string; feature: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, feature } = await params;
  const featureLabel = FEATURE_LABELS[feature]?.[locale] || FEATURE_LABELS[feature]?.en || feature;
  const title = `${featureLabel} Beaches | Halkidiki | ChalkidikiHub`;
  const desc = FEATURE_DESCRIPTIONS[feature]?.[locale] || FEATURE_DESCRIPTIONS[feature]?.en || `${featureLabel} beaches in Halkidiki.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=beach`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=beach`] },
    alternates: {
      canonical: localeUrl(locale, `beaches/feature/${feature}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/beaches/feature/${feature}`])),
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageClient />;
}
