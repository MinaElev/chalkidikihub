import type { Metadata } from 'next';
import { collectionMeta } from '@/lib/seo/compat';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    el: 'Τι Παρέχουμε στους Ιδιοκτήτες — ChalkidikiHub',
    en: 'What We Offer to Property Owners — ChalkidikiHub',
    de: 'Was wir Eigentümern bieten — ChalkidikiHub',
    bg: 'Какво предлагаме на собствениците — ChalkidikiHub',
    ru: 'Что мы предлагаем владельцам — ChalkidikiHub',
    ro: 'Ce oferim proprietarilor — ChalkidikiHub',
    sr: 'Šta nudimo vlasnicima — ChalkidikiHub',
  };
  const descriptions: Record<string, string> = {
    el: 'Όσα προσφέρουμε σε ιδιοκτήτες καταλυμάτων στη Χαλκιδική: προβολή σε 7 γλώσσες, προσωπική σελίδα, QR Guest Guide και προαιρετικό ημερολόγιο, χωρίς προμήθεια.',
    en: 'What we offer property owners in Halkidiki: visibility in 7 languages, a personal page, a QR Guest Guide and an optional availability calendar, no commission.',
    de: 'Was wir Eigentümern in Chalkidiki bieten: Sichtbarkeit in 7 Sprachen, eigene Seite, QR Guest Guide und ein optionaler Belegungskalender, ohne Provision.',
    bg: 'Какво предлагаме на собствениците в Халкидики: видимост на 7 езика, собствена страница, QR гид за гости и календар за свободни дати по желание, без комисиона.',
    ru: 'Что мы предлагаем владельцам на Халкидики: продвижение на 7 языках, личная страница, QR-гид для гостей и календарь занятости по желанию, без комиссии.',
    ro: 'Ce oferim proprietarilor din Halkidiki: vizibilitate în 7 limbi, pagină proprie, ghid QR pentru oaspeți și calendar opțional, fără comision.',
    sr: 'Šta nudimo vlasnicima na Halkidikiju: vidljivost na 7 jezika, sopstvena stranica, QR vodič za goste i opcioni kalendar dostupnosti, bez provizije.',
  };

  return collectionMeta({
    titles,
    descriptions,
    path: 'for-owners/services',
    locale,
    ogType: 'for-owners',
    // The page body is written in Greek and English only.
    indexableLocales: ['el', 'en'],
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
