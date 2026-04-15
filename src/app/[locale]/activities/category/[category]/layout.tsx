import type { Metadata } from 'next';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  historical: {
    el: 'Ιστορικά Αξιοθέατα', en: 'Historical Sites', de: 'Historische Stätten',
    bg: 'Исторически забележителности', ru: 'Исторические достопримечательности',
    ro: 'Situri istorice', sr: 'Istorijske znamenitosti',
  },
  nature: {
    el: 'Φύση & Περιπάτοι', en: 'Nature & Walks', de: 'Natur & Spaziergänge',
    bg: 'Природа и разходки', ru: 'Природа и прогулки',
    ro: 'Natură și plimbări', sr: 'Priroda i šetnje',
  },
  waterSports: {
    el: 'Θαλάσσια Σπορ', en: 'Water Sports', de: 'Wassersport',
    bg: 'Водни спортове', ru: 'Водные виды спорта',
    ro: 'Sporturi nautice', sr: 'Vodeni sportovi',
  },
  boatTrips: {
    el: 'Βόλτες με Σκάφος', en: 'Boat Trips', de: 'Bootsausflüge',
    bg: 'Разходки с лодка', ru: 'Морские прогулки',
    ro: 'Excursii cu barca', sr: 'Vožnje brodom',
  },
  wellness: {
    el: 'Ευεξία & Spa', en: 'Wellness & Spa', de: 'Wellness & Spa',
    bg: 'Уелнес и спа', ru: 'Велнес и спа',
    ro: 'Wellness & Spa', sr: 'Velnes i spa',
  },
  family: {
    el: 'Οικογενειακές Δραστηριότητες', en: 'Family Activities', de: 'Familienaktivitäten',
    bg: 'Семейни дейности', ru: 'Семейные развлечения',
    ro: 'Activități pentru familii', sr: 'Porodične aktivnosti',
  },
  nightlife: {
    el: 'Νυχτερινή Ζωή', en: 'Nightlife', de: 'Nachtleben',
    bg: 'Нощен живот', ru: 'Ночная жизнь',
    ro: 'Viață de noapte', sr: 'Noćni život',
  },
  religious: {
    el: 'Θρησκευτικός Τουρισμός', en: 'Religious Tourism', de: 'Religiöser Tourismus',
    bg: 'Религиозен туризъм', ru: 'Религиозный туризм',
    ro: 'Turism religios', sr: 'Verski turizam',
  },
};

const descTemplates: Record<string, (cat: string) => string> = {
  el: (c) => `${c} στη Χαλκιδική. Ανακαλύψτε δραστηριότητες, αξιοθέατα και εμπειρίες.`,
  en: (c) => `${c} in Halkidiki, Greece. Discover activities, attractions and unique experiences.`,
  de: (c) => `${c} in Chalkidiki. Entdecken Sie Aktivitäten, Sehenswürdigkeiten und einzigartige Erlebnisse.`,
  bg: (c) => `${c} в Халкидики. Открийте дейности, забележителности и уникални преживявания.`,
  ru: (c) => `${c} на Халкидики. Откройте развлечения, достопримечательности и уникальные впечатления.`,
  ro: (c) => `${c} în Halkidiki. Descoperiți activități, atracții și experiențe unice.`,
  sr: (c) => `${c} na Halkidikiju. Otkrijte aktivnosti, znamenitosti i jedinstvena iskustva.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  const catNames = CATEGORY_NAMES[category];
  const categoryName = catNames?.[locale] || catNames?.en || category;
  const title = `${categoryName} — Halkidiki`;
  const description = (descTemplates[locale] || descTemplates.en)(categoryName);
  const image = ogImageUrl(title, 'activity');

  return {
    title,
    description,
    openGraph: {
      title, description, type: 'website', locale, siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image', title, description, images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, `activities/category/${category}`),
      languages: Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `activities/category/${category}`)])),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
