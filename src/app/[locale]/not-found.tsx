import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const T: Record<string, {
  metaTitle: string;
  subtitle: string;
  hint: string;
  hintSmall: string;
  home: string;
  listings: string;
  beaches: string;
  restaurants: string;
  activities: string;
  blog: string;
  contact: string;
}> = {
  el: {
    metaTitle: 'Δεν βρέθηκε η σελίδα — ChalkidikiHub',
    subtitle: 'Η ομάδα μας απολαμβάνει τη θάλασσα αυτή τη στιγμή...',
    hint: 'Μόλις γυρίσουμε θα δούμε τι πήγε στραβά! 🌊',
    hintSmall: 'Μην χάνεις χρόνο — βρες ό,τι χρειάζεσαι παρακάτω:',
    home: 'Αρχική', listings: 'Καταλύματα', beaches: 'Παραλίες', restaurants: 'Εστιατόρια', activities: 'Αξιοθέατα', blog: 'Blog', contact: 'Επικοινωνία',
  },
  en: {
    metaTitle: 'Page not found — ChalkidikiHub',
    subtitle: 'Our team is enjoying the sea right now...',
    hint: "We'll look into it once we're back! 🌊",
    hintSmall: "Don't waste time — find what you need below:",
    home: 'Home', listings: 'Rentals', beaches: 'Beaches', restaurants: 'Restaurants', activities: 'Activities', blog: 'Blog', contact: 'Contact',
  },
  de: {
    metaTitle: 'Seite nicht gefunden — ChalkidikiHub',
    subtitle: 'Unser Team genießt gerade das Meer...',
    hint: 'Wir kümmern uns darum, sobald wir zurück sind! 🌊',
    hintSmall: 'Keine Zeit verlieren — finde was du brauchst:',
    home: 'Startseite', listings: 'Unterkünfte', beaches: 'Strände', restaurants: 'Restaurants', activities: 'Aktivitäten', blog: 'Blog', contact: 'Kontakt',
  },
  bg: {
    metaTitle: 'Страницата не е намерена — ChalkidikiHub',
    subtitle: 'Екипът ни се наслаждава на морето...',
    hint: 'Ще проверим какво се обърка, щом се върнем! 🌊',
    hintSmall: 'Не губете време — намерете каквото ви трябва:',
    home: 'Начало', listings: 'Настаняване', beaches: 'Плажове', restaurants: 'Ресторанти', activities: 'Дейности', blog: 'Блог', contact: 'Контакт',
  },
  ru: {
    metaTitle: 'Страница не найдена — ChalkidikiHub',
    subtitle: 'Наша команда сейчас наслаждается морем...',
    hint: 'Мы разберемся, как только вернемся! 🌊',
    hintSmall: 'Не теряйте время — найдите то, что нужно:',
    home: 'Главная', listings: 'Жильё', beaches: 'Пляжи', restaurants: 'Рестораны', activities: 'Развлечения', blog: 'Блог', contact: 'Контакты',
  },
  ro: {
    metaTitle: 'Pagina nu a fost gasita — ChalkidikiHub',
    subtitle: 'Echipa noastra se bucura de mare acum...',
    hint: 'Ne vom ocupa de asta cand ne intoarcem! 🌊',
    hintSmall: 'Nu pierde timpul — gaseste ce ai nevoie:',
    home: 'Acasa', listings: 'Cazare', beaches: 'Plaje', restaurants: 'Restaurante', activities: 'Activitati', blog: 'Blog', contact: 'Contact',
  },
  sr: {
    metaTitle: 'Stranica nije pronadjena — ChalkidikiHub',
    subtitle: 'Nas tim trenutno uziva u moru...',
    hint: 'Pozabavicemo se kada se vratimo! 🌊',
    hintSmall: 'Ne gubite vreme — pronadjite sta vam treba:',
    home: 'Pocetna', listings: 'Smestaj', beaches: 'Plaze', restaurants: 'Restorani', activities: 'Aktivnosti', blog: 'Blog', contact: 'Kontakt',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = T[locale] || T.en;
  return {
    title: t.metaTitle,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = T[locale] || T.en;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-8xl mb-4">🏖️</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-3">
          {t.subtitle}
        </p>
        <p className="text-gray-500 mb-2">
          {t.hint}
        </p>
        <p className="text-sm text-gray-400 mb-8">
          {t.hintSmall}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏠 {t.home}
          </Link>
          <Link href="/listings" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏡 {t.listings}
          </Link>
          <Link href="/beaches" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏖️ {t.beaches}
          </Link>
          <Link href="/restaurants" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🍽️ {t.restaurants}
          </Link>
          <Link href="/activities" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏛️ {t.activities}
          </Link>
          <Link href="/blog" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            📝 {t.blog}
          </Link>
          <Link href="/contact" className="px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors text-sm">
            📧 {t.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
