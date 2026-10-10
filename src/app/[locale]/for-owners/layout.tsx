import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo/compat';
import { locales as publicLocales } from '@/i18n/config';

// Previously a hardcoded Greek title/description shown on every locale, with
// hreflang capped to el/en. Now fully localized across all 7 languages.
const TITLES: Record<string, string> = {
  el: 'Για Ιδιοκτήτες', en: 'For Property Owners', de: 'Für Eigentümer',
  bg: 'За собственици', ru: 'Для владельцев', ro: 'Pentru proprietari', sr: 'Za vlasnike',
};
const DESCRIPTIONS: Record<string, string> = {
  el: 'Καταχωρίστε δωρεάν την επιχείρησή σας στο Chalkidiki Hub — προβολή καταλυμάτων, εστιατορίων και δραστηριοτήτων στη Χαλκιδική σε 7 γλώσσες.',
  en: 'List your business for free on Chalkidiki Hub — showcase accommodation, restaurants and activities in Halkidiki across 7 languages.',
  de: 'Registrieren Sie Ihr Unternehmen kostenlos auf Chalkidiki Hub — Unterkünfte, Restaurants und Aktivitäten in Chalkidiki in 7 Sprachen.',
  bg: 'Регистрирайте безплатно бизнеса си в Chalkidiki Hub — настанявания, ресторанти и дейности в Халкидики на 7 езика.',
  ru: 'Бесплатно разместите свой бизнес на Chalkidiki Hub — жильё, рестораны и развлечения Халкидики на 7 языках.',
  ro: 'Înregistrați-vă gratuit afacerea pe Chalkidiki Hub — cazări, restaurante și activități în Halkidiki în 7 limbi.',
  sr: 'Registrujte svoj biznis besplatno na Chalkidiki Hub — smeštaj, restorani i aktivnosti na Halkidikiju na 7 jezika.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates: {
      canonical: localeUrl(locale, 'for-owners'),
      languages: {
        ...Object.fromEntries(publicLocales.map((l) => [l, localeUrl(l, 'for-owners')])),
        'x-default': localeUrl('el', 'for-owners'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
