import type { Metadata } from 'next';
import { publicLocales } from '@/i18n/config';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = publicLocales;

const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  guides: {
    el: 'Οδηγοί', en: 'Guides', de: 'Reiseführer',
    bg: 'Пътеводители', ru: 'Путеводители', ro: 'Ghiduri', sr: 'Vodiči',
  },
  beaches: {
    el: 'Παραλίες', en: 'Beaches', de: 'Strände',
    bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaže',
  },
  food: {
    el: 'Φαγητό', en: 'Food & Dining', de: 'Essen & Trinken',
    bg: 'Храна', ru: 'Еда', ro: 'Mâncare', sr: 'Hrana',
  },
  activities: {
    el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitäten',
    bg: 'Дейности', ru: 'Развлечения', ro: 'Activități', sr: 'Aktivnosti',
  },
  tips: {
    el: 'Συμβουλές', en: 'Travel Tips', de: 'Reisetipps',
    bg: 'Съвети', ru: 'Советы', ro: 'Sfaturi', sr: 'Saveti',
  },
  culture: {
    el: 'Πολιτισμός', en: 'Culture', de: 'Kultur',
    bg: 'Култура', ru: 'Культура', ro: 'Cultură', sr: 'Kultura',
  },
};

const descTemplates: Record<string, (cat: string) => string> = {
  el: (c) => `Άρθρα και οδηγοί για ${c.toLowerCase()} στη Χαλκιδική. Ενημερωθείτε για τα τελευταία νέα και tips.`,
  en: (c) => `Articles and guides about ${c.toLowerCase()} in Halkidiki. Stay updated with the latest news and tips.`,
  de: (c) => `Artikel und Reiseführer über ${c} in Chalkidiki. Bleiben Sie auf dem Laufenden mit den neuesten Nachrichten und Tipps.`,
  bg: (c) => `Статии и пътеводители за ${c.toLowerCase()} в Халкидики. Бъдете информирани за последните новини и съвети.`,
  ru: (c) => `Статьи и путеводители о ${c.toLowerCase()} на Халкидики. Будьте в курсе последних новостей и советов.`,
  ro: (c) => `Articole și ghiduri despre ${c.toLowerCase()} în Halkidiki. Rămâneți la curent cu cele mai recente știri și sfaturi.`,
  sr: (c) => `Članci i vodiči o ${c.toLowerCase()} na Halkidikiju. Budite u toku sa najnovijim vestima i savetima.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  const catNames = CATEGORY_NAMES[category];
  const categoryName = catNames?.[locale] || catNames?.en || category;
  const title = `${categoryName} — Blog | Chalkidiki Hub`;
  const description = (descTemplates[locale] || descTemplates.en)(categoryName);
  const image = ogImageUrl(title, 'blog');

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
      canonical: localeUrl(locale, `blog/category/${category}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `blog/category/${category}`)])),
        'x-default': localeUrl('el', `blog/category/${category}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
