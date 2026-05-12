import type { Metadata } from 'next';
import { SalesHeader } from '@/components/sales/SalesHeader';
import { SalesFooter } from '@/components/sales/SalesFooter';
import { localeUrl } from '@/lib/seo';

const TITLES: Record<string, string> = {
  el: 'Πωλήσεις Ακινήτων Χαλκιδικής',
  en: 'Real Estate for Sale in Halkidiki',
  de: 'Immobilien zum Verkauf in Chalkidiki',
  bg: 'Имоти за продажба в Халкидики',
  ru: 'Недвижимость в Халкидики',
  ro: 'Imobiliare de vânzare în Halkidiki',
  sr: 'Nekretnine na prodaju u Halkidikiju',
};

const DESCRIPTIONS: Record<string, string> = {
  el: 'Βρείτε ακίνητα προς πώληση στη Χαλκιδική — κατοικίες, διαμερίσματα, οικόπεδα και επαγγελματικούς χώρους σε Κασσάνδρα, Σιθωνία και Άθως.',
  en: 'Find properties for sale across Halkidiki — houses, apartments, land plots and commercial spaces in Kassandra, Sithonia and Athos peninsulas.',
  de: 'Immobilien zum Verkauf in Chalkidiki — Häuser, Wohnungen, Grundstücke und Gewerbeflächen auf den Halbinseln Kassandra, Sithonia und Athos.',
  bg: 'Имоти за продажба в Халкидики — къщи, апартаменти, парцели и търговски площи в Касандра, Ситония и Атон. Истински обяви от собственици.',
  ru: 'Недвижимость на продажу в Халкидики — дома, квартиры, земельные участки и коммерческие помещения в Кассандре, Ситонии и на Афоне.',
  ro: 'Proprietăți de vânzare în Halkidiki — case, apartamente, terenuri și spații comerciale în peninsulele Kassandra, Sithonia și Athos.',
  sr: 'Nekretnine za prodaju u Halkidikiju — kuće, stanovi, placevi i poslovni prostori na poluostrvima Kasandra, Sitonija i Atos.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates: {
      canonical: localeUrl(locale, 'sales'),
      languages: {
        ...Object.fromEntries(['el','en','de','bg','ru','ro','sr'].map(l => [l, localeUrl(l, 'sales')])),
        'x-default': localeUrl('el', 'sales'),
      },
    },
  };
}

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: '#main-header, #main-footer { display: none !important; }' }} />
      <SalesHeader />
      <div className="flex-1">{children}</div>
      <SalesFooter />
    </>
  );
}
