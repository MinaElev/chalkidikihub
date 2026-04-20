import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    el: 'Οδηγός Καταχώρησης Καταλύματος — ChalkidikiHub',
    en: 'Property Listing Guide — ChalkidikiHub',
    de: 'Anleitung zur Unterkunftseintragung — ChalkidikiHub',
    bg: 'Ръководство за обявяване на имот — ChalkidikiHub',
    ru: 'Руководство по размещению объекта — ChalkidikiHub',
    ro: 'Ghid de listare a proprietății — ChalkidikiHub',
    sr: 'Vodič za objavu smeštaja — ChalkidikiHub',
  };
  const descriptions: Record<string, string> = {
    el: 'Αναλυτικός οδηγός βήμα-βήμα για ιδιοκτήτες: πώς καταχωρείτε δωρεάν το κατάλυμά σας στο ChalkidikiHub σε 5 λεπτά.',
    en: 'Step-by-step guide for owners: how to list your property on ChalkidikiHub for free in 5 minutes.',
    de: 'Schritt-für-Schritt-Anleitung für Eigentümer: So tragen Sie Ihre Unterkunft kostenlos auf ChalkidikiHub ein.',
    bg: 'Ръководство стъпка по стъпка за собственици: как да обявите имота си безплатно в ChalkidikiHub.',
    ru: 'Пошаговое руководство для владельцев: как бесплатно разместить свой объект на ChalkidikiHub.',
    ro: 'Ghid pas cu pas pentru proprietari: cum să vă listați proprietatea gratuit pe ChalkidikiHub.',
    sr: 'Vodič korak po korak za vlasnike: kako besplatno objaviti smeštaj na ChalkidikiHub.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    robots: { index: false, follow: true }, // Hidden from Google
    alternates: {
      canonical: localeUrl(locale, 'for-owners/guide'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'for-owners/guide')])),
        'x-default': localeUrl('el', 'for-owners/guide'),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
