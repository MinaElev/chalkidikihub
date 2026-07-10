import type { Metadata } from 'next';
import { publicLocales } from '@/i18n/config';
import { AREAS } from '@/lib/constants';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = publicLocales;

const titleTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Παραλίες ${a} — Χαλκιδική`,
  en: (a) => `${a} Beaches — Halkidiki`,
  de: (a) => `Strände in ${a} — Chalkidiki`,
  bg: (a) => `Плажове ${a} — Халкидики`,
  ru: (a) => `Пляжи ${a} — Халкидики`,
  ro: (a) => `Plaje ${a} — Halkidiki`,
  sr: (a) => `Plaže ${a} — Halkidiki`,
};

const descTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Ανακαλύψτε τις καλύτερες παραλίες στην περιοχή ${a}, Χαλκιδική. Αξιολογήσεις, χάρτης, φωτογραφίες και πληροφορίες.`,
  en: (a) => `Discover the best beaches in ${a}, Halkidiki. Reviews, map, photos and useful information.`,
  de: (a) => `Entdecken Sie die besten Strände in ${a}, Chalkidiki. Bewertungen, Karte, Fotos und nützliche Informationen.`,
  bg: (a) => `Открийте най-добрите плажове в ${a}, Халкидики. Отзиви, карта, снимки и полезна информация.`,
  ru: (a) => `Откройте лучшие пляжи в ${a}, Халкидики. Отзывы, карта, фото и полезная информация.`,
  ro: (a) => `Descoperiți cele mai bune plaje din ${a}, Halkidiki. Recenzii, hartă, fotografii și informații utile.`,
  sr: (a) => `Otkrijte najbolje plaže u ${a}, Halkidiki. Recenzije, mapa, fotografije i korisne informacije.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = (titleTemplates[locale] || titleTemplates.en)(areaName);
  const description = (descTemplates[locale] || descTemplates.en)(areaName);
  const image = ogImageUrl(title, 'beach');

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
      canonical: localeUrl(locale, `beaches/area/${area}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `beaches/area/${area}`)])),
        'x-default': localeUrl('el', `beaches/area/${area}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
