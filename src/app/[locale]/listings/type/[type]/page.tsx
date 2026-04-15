import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import PageClient from './_client';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const TYPE_LABELS: Record<string, Record<string, string>> = {
  'with-pool': { el: 'Με Πισίνα', en: 'With Pool', de: 'Mit Pool', bg: 'С басейн', ru: 'С бассейном', ro: 'Cu piscină', sr: 'Sa bazenom' },
  'sea-view': { el: 'Με Θέα Θάλασσα', en: 'Sea View', de: 'Mit Meerblick', bg: 'С морска гледка', ru: 'С видом на море', ro: 'Cu vedere la mare', sr: 'Pogled na more' },
  'pet-friendly': { el: 'Pet-Friendly', en: 'Pet-Friendly', de: 'Haustierfreundlich', bg: 'За домашни любимци', ru: 'Для питомцев', ro: 'Pet-friendly', sr: 'Za ljubimce' },
  'family': { el: 'Οικογενειακά', en: 'Family', de: 'Familien', bg: 'Семейни', ru: 'Семейные', ro: 'Familii', sr: 'Porodični' },
  'budget': { el: 'Οικονομικά', en: 'Budget', de: 'Günstig', bg: 'Евтини', ru: 'Бюджетные', ro: 'Ieftine', sr: 'Povoljni' },
  'luxury': { el: 'Πολυτελή', en: 'Luxury', de: 'Luxus', bg: 'Луксозни', ru: 'Люкс', ro: 'Lux', sr: 'Luksuzni' },
};

const TYPE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'with-pool': {
    el: 'Καταλύματα με πισίνα στη Χαλκιδική.',
    en: 'Accommodation with pool in Halkidiki.',
    de: 'Unterkünfte mit Pool in Chalkidiki.',
    bg: 'Настаняване с басейн в Халкидики.',
    ru: 'Жильё с бассейном в Халкидики.',
    ro: 'Cazare cu piscină în Halkidiki.',
    sr: 'Smeštaj sa bazenom u Halkidikiju.',
  },
  'sea-view': {
    el: 'Καταλύματα με θέα θάλασσα στη Χαλκιδική.',
    en: 'Sea view accommodation in Halkidiki.',
    de: 'Unterkünfte mit Meerblick in Chalkidiki.',
    bg: 'Настаняване с морска гледка в Халкидики.',
    ru: 'Жильё с видом на море в Халкидики.',
    ro: 'Cazare cu vedere la mare în Halkidiki.',
    sr: 'Smeštaj sa pogledom na more u Halkidikiju.',
  },
  'pet-friendly': {
    el: 'Pet-friendly καταλύματα στη Χαλκιδική.',
    en: 'Pet-friendly accommodation in Halkidiki.',
    de: 'Haustierfreundliche Unterkünfte in Chalkidiki.',
    bg: 'Настаняване за домашни любимци в Халкидики.',
    ru: 'Жильё для питомцев в Халкидики.',
    ro: 'Cazare pet-friendly în Halkidiki.',
    sr: 'Smeštaj za ljubimce u Halkidikiju.',
  },
  'family': {
    el: 'Οικογενειακά καταλύματα στη Χαλκιδική.',
    en: 'Family accommodation in Halkidiki.',
    de: 'Familienunterkünfte in Chalkidiki.',
    bg: 'Семейно настаняване в Халкидики.',
    ru: 'Семейное жильё в Халкидики.',
    ro: 'Cazare pentru familii în Halkidiki.',
    sr: 'Porodični smeštaj u Halkidikiju.',
  },
  'budget': {
    el: 'Οικονομικά καταλύματα στη Χαλκιδική.',
    en: 'Budget accommodation in Halkidiki.',
    de: 'Günstige Unterkünfte in Chalkidiki.',
    bg: 'Евтино настаняване в Халкидики.',
    ru: 'Бюджетное жильё в Халкидики.',
    ro: 'Cazare ieftină în Halkidiki.',
    sr: 'Povoljan smeštaj u Halkidikiju.',
  },
  'luxury': {
    el: 'Πολυτελή καταλύματα στη Χαλκιδική.',
    en: 'Luxury accommodation in Halkidiki.',
    de: 'Luxusunterkünfte in Chalkidiki.',
    bg: 'Луксозно настаняване в Халкидики.',
    ru: 'Люкс жильё в Халкидики.',
    ro: 'Cazare de lux în Halkidiki.',
    sr: 'Luksuzni smeštaj u Halkidikiju.',
  },
};

type Props = { params: Promise<{ locale: string; type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params;
  const typeLabel = TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;
  const title = `${typeLabel} | Halkidiki Rentals | ChalkidikiHub`;
  const desc = TYPE_DESCRIPTIONS[type]?.[locale] || TYPE_DESCRIPTIONS[type]?.en || `${typeLabel} rentals in Halkidiki.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=listing`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=listing`] },
    alternates: {
      canonical: localeUrl(locale, `listings/type/${type}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `listings/type/${type}`)])),
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PageClient />;
}
