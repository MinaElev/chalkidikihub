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
    el: 'Αναλυτικά όλα όσα προσφέρουμε δωρεάν στους ιδιοκτήτες καταλυμάτων στη Χαλκιδική: προβολή σε 7 γλώσσες σε 30.000 τουρίστες/μήνα, QR Guest Guide, προσωπική σελίδα και προαιρετικό ημερολόγιο διαθεσιμότητας.',
    en: 'Everything we offer for free to property owners in Halkidiki: 7-language exposure to 30,000 monthly tourists, QR Guest Guide, personal landing page and an optional availability calendar.',
    de: 'Alle kostenlosen Leistungen für Unterkunftseigentümer in Chalkidiki: 7-Sprachen-Promotion zu 30.000 Touristen/Monat, QR Guest Guide, persönliche Seite und ein optionaler Belegungskalender.',
    bg: 'Всичко, което предлагаме безплатно на собствениците в Халкидики: реклама на 7 езика до 30 000 туристи/месец, QR гид за гости, персонална страница и календар за свободни дати по желание.',
    ru: 'Все, что мы бесплатно предлагаем владельцам в Халкидиках: продвижение на 7 языках для 30 000 туристов/месяц, QR-гид для гостей, персональная страница и календарь занятости по желанию.',
    ro: 'Tot ce oferim gratuit proprietarilor din Halkidiki: promovare în 7 limbi către 30.000 turiști/lună, ghid QR pentru oaspeți, pagină personală și calendar opțional de disponibilitate.',
    sr: 'Sve što besplatno nudimo vlasnicima na Halkidikiju: promocija na 7 jezika za 30.000 turista/mesec, QR vodič za goste, personalna stranica i opcioni kalendar dostupnosti.',
  };

  return collectionMeta({
    titles,
    descriptions,
    path: 'for-owners/services',
    locale,
    ogType: 'for-owners',
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
