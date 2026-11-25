import type { Metadata } from 'next';
import { localeUrl } from '@/lib/seo/compat';
import { hreflangMap } from '@/lib/seo/site';

// Previously a hardcoded Greek title/description shown on every locale, with
// hreflang capped to el/en. Now fully localized across all 7 languages.
const TITLES: Record<string, string> = {
  el: 'Για Ιδιοκτήτες', en: 'For Property Owners', de: 'Für Eigentümer',
  bg: 'За собственици', ru: 'Для владельцев', ro: 'Pentru proprietari', sr: 'Za vlasnike',
};
const DESCRIPTIONS: Record<string, string> = {
  el: "Καταχωρίστε το κατάλυμά σας στη Χαλκιδική και δεχτείτε αιτήματα απευθείας από επισκέπτες, χωρίς προμήθεια ανά κράτηση και χωρίς συγχρονισμό ημερολογίου.",
  en: "List your property in Halkidiki and receive enquiries directly from guests, with no commission per booking and no calendar sync. In 7 languages.",
  de: "Inserieren Sie Ihre Unterkunft in Chalkidiki und erhalten Sie Anfragen direkt von Gästen, ohne Provision pro Buchung und ohne Kalenderabgleich. In 7 Sprachen.",
  bg: "Публикувайте имота си в Халкидики и получавайте запитвания директно от гости, без комисиона за резервация и без синхронизиране на календар. На 7 езика.",
  ru: "Разместите жильё на Халкидики и получайте запросы напрямую от гостей, без комиссии за бронирование и без синхронизации календаря. На 7 языках.",
  ro: "Listați-vă proprietatea din Halkidiki și primiți cereri direct de la oaspeți, fără comision pe rezervare și fără sincronizarea calendarului. În 7 limbi.",
  sr: "Oglasite svoj smeštaj na Halkidikiju i primajte upite direktno od gostiju, bez provizije po rezervaciji i bez sinhronizacije kalendara. Na 7 jezika.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates: {
      canonical: localeUrl(locale, 'for-owners'),
      languages: hreflangMap('/for-owners'),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
