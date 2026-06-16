import type { Metadata } from 'next';
import { AREAS } from '@/lib/constants';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

const titleTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Φαγητό & Ποτό ${a} — Χαλκιδική`,
  en: (a) => `Restaurants in ${a} — Halkidiki`,
  de: (a) => `Restaurants in ${a} — Chalkidiki`,
  bg: (a) => `Ресторанти ${a} — Халкидики`,
  ru: (a) => `Рестораны ${a} — Халкидики`,
  ro: (a) => `Restaurante ${a} — Halkidiki`,
  sr: (a) => `Restorani ${a} — Halkidiki`,
};

const descTemplates: Record<string, (area: string) => string> = {
  el: (a) => `Εστιατόρια, ταβέρνες και καφέ στην περιοχή ${a}, Χαλκιδική. Κριτικές, μενού και κρατήσεις.`,
  en: (a) => `Restaurants, tavernas and cafés in ${a}, Halkidiki. Reviews, menus and reservations.`,
  de: (a) => `Restaurants, Tavernen und Cafés in ${a}, Chalkidiki. Bewertungen, Speisekarten und Reservierungen.`,
  bg: (a) => `Ресторанти, таверни и кафенета в ${a}, Халкидики. Отзиви, менюта и резервации.`,
  ru: (a) => `Рестораны, таверны и кафе в ${a}, Халкидики. Отзывы, меню и бронирование.`,
  ro: (a) => `Restaurante, taverne și cafenele în ${a}, Halkidiki. Recenzii, meniuri și rezervări.`,
  sr: (a) => `Restorani, taverne i kafići u ${a}, Halkidiki. Recenzije, meniji i rezervacije.`,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; area: string }> }): Promise<Metadata> {
  const { locale, area } = await params;
  const areaInfo = AREAS.find(a => a.slug === area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.en || area;
  const title = (titleTemplates[locale] || titleTemplates.en)(areaName);
  const description = (descTemplates[locale] || descTemplates.en)(areaName);
  const image = ogImageUrl(title, 'restaurant');

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
      canonical: localeUrl(locale, `restaurants/area/${area}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `restaurants/area/${area}`)])),
        'x-default': localeUrl('el', `restaurants/area/${area}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
