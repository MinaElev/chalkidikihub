import type { Metadata } from 'next';
import { AREAS } from '@/lib/constants';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const titleTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Δραστηριότητες ${a} — Χαλκιδική`,
  en: (a) => `Activities in ${a} — Halkidiki`,
  de: (a) => `Aktivitäten in ${a} — Chalkidiki`,
  bg: (a) => `Дейности ${a} — Халкидики`,
  ru: (a) => `Развлечения ${a} — Халкидики`,
  ro: (a) => `Activități ${a} — Halkidiki`,
  sr: (a) => `Aktivnosti ${a} — Halkidiki`,
};

const descTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Δραστηριότητες και αξιοθέατα στην περιοχή ${a}, Χαλκιδική. Εκδρομές, σπορ, πολιτισμός και ψυχαγωγία.`,
  en: (a) => `Activities and attractions in ${a}, Halkidiki. Excursions, sports, culture and entertainment.`,
  de: (a) => `Aktivitäten und Sehenswürdigkeiten in ${a}, Chalkidiki. Ausflüge, Sport, Kultur und Unterhaltung.`,
  bg: (a) => `Дейности и забележителности в ${a}, Халкидики. Екскурзии, спорт, култура и развлечения.`,
  ru: (a) => `Развлечения и достопримечательности в ${a}, Халкидики. Экскурсии, спорт, культура и развлечения.`,
  ro: (a) => `Activități și atracții în ${a}, Halkidiki. Excursii, sport, cultură și divertisment.`,
  sr: (a) => `Aktivnosti i znamenitosti u ${a}, Halkidiki. Izleti, sport, kultura i zabava.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = (titleTemplates[locale] || titleTemplates.en)(areaName);
  const description = (descTemplates[locale] || descTemplates.en)(areaName);
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
      canonical: localeUrl(locale, `activities/area/${area}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `activities/area/${area}`)])),
        'x-default': localeUrl('el', `activities/area/${area}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
