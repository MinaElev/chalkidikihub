'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';

type Consent = 'accepted' | 'rejected';

const T: Record<string, {
  title: string;
  intro: string;
  details: string;
  accept: string;
  reject: string;
  readMore: string;
}> = {
  el: {
    title: 'Cookies στο ChalkidikiHub',
    intro: 'Χρησιμοποιούμε απαραίτητα cookies για τη λειτουργία του site (γλώσσα, σύνδεση) και προαιρετικά για διαφημίσεις (Google AdSense) και στατιστικά (Google Analytics).',
    details: 'Αν επιλέξεις «Μόνο τα απαραίτητα», βλέπεις μη-εξατομικευμένες διαφημίσεις και δεν συλλέγουμε στατιστικά. Μπορείς να αλλάξεις γνώμη ανά πάσα στιγμή από την',
    accept: 'Αποδοχή όλων',
    reject: 'Μόνο τα απαραίτητα',
    readMore: 'Πολιτική απορρήτου',
  },
  en: {
    title: 'Cookies on ChalkidikiHub',
    intro: 'We use essential cookies for site operation (language, login) and optional cookies for advertising (Google AdSense) and statistics (Google Analytics).',
    details: 'If you choose "Essential only", you see non-personalized ads and we do not collect analytics. You can change your mind anytime from the',
    accept: 'Accept all',
    reject: 'Essential only',
    readMore: 'Privacy policy',
  },
  de: {
    title: 'Cookies auf ChalkidikiHub',
    intro: 'Wir verwenden notwendige Cookies für den Betrieb der Seite (Sprache, Anmeldung) und optionale für Werbung (Google AdSense) und Statistik (Google Analytics).',
    details: 'Wenn Sie „Nur notwendige" wählen, sehen Sie nicht personalisierte Werbung und wir erfassen keine Statistik. Sie können Ihre Wahl jederzeit über die',
    accept: 'Alle akzeptieren',
    reject: 'Nur notwendige',
    readMore: 'Datenschutzrichtlinie',
  },
  bg: {
    title: 'Бисквитки в ChalkidikiHub',
    intro: 'Използваме необходими бисквитки за работата на сайта (език, вход) и опционални за реклами (Google AdSense) и статистика (Google Analytics).',
    details: 'Ако изберете „Само необходимите", виждате неперсонализирани реклами и не събираме статистика. Можете да промените мнението си по всяко време от',
    accept: 'Приемане на всички',
    reject: 'Само необходимите',
    readMore: 'Политиката за поверителност',
  },
  ru: {
    title: 'Файлы cookie на ChalkidikiHub',
    intro: 'Мы используем необходимые cookie для работы сайта (язык, вход) и опциональные — для рекламы (Google AdSense) и статистики (Google Analytics).',
    details: 'Если выберете «Только необходимые», вы увидите неперсонализированную рекламу, и аналитика не собирается. Вы можете изменить решение в любой момент в',
    accept: 'Принять все',
    reject: 'Только необходимые',
    readMore: 'Политике конфиденциальности',
  },
  ro: {
    title: 'Cookie-uri pe ChalkidikiHub',
    intro: 'Folosim cookie-uri esențiale pentru funcționarea site-ului (limbă, autentificare) și cookie-uri opționale pentru reclame (Google AdSense) și statistici (Google Analytics).',
    details: 'Dacă alegeți „Doar esențiale", veți vedea reclame nepersonalizate și nu colectăm statistici. Puteți schimba opțiunea oricând din',
    accept: 'Acceptă toate',
    reject: 'Doar esențiale',
    readMore: 'Politica de confidențialitate',
  },
  sr: {
    title: 'Kolačići na ChalkidikiHub',
    intro: 'Koristimo neophodne kolačiće za rad sajta (jezik, prijava) i opcione za reklame (Google AdSense) i statistiku (Google Analytics).',
    details: 'Ako izaberete „Samo neophodne", videćete nepersonalizovane reklame i ne prikupljamo statistiku. Možete promeniti mišljenje u bilo kom trenutku u',
    accept: 'Prihvati sve',
    reject: 'Samo neophodne',
    readMore: 'Politici privatnosti',
  },
};

export function CookieConsent() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShouldShow(true);
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  function record(value: Consent) {
    localStorage.setItem('cookie-consent', value);
    // Notify DeferredScripts (same tab) that consent changed
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: value }));
    // Update NPA flag for any AdSense slots already on the page
    if (typeof window !== 'undefined') {
      const w = window as unknown as { adsbygoogle?: { requestNonPersonalizedAds?: number } & unknown[] };
      w.adsbygoogle = w.adsbygoogle || ([] as unknown as typeof w.adsbygoogle);
      if (w.adsbygoogle) w.adsbygoogle.requestNonPersonalizedAds = value === 'accepted' ? 0 : 1;
    }
    setMounted(false);
  }

  if (!shouldShow) return null;

  const t = T[locale] || T.en;
  const privacyHref = locale === 'el' ? '/privacy' : `/${locale}/privacy`;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6 transition-transform duration-300 ease-out ${mounted ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ willChange: 'transform' }}
      role="dialog"
      aria-label="Cookie consent"
      aria-hidden={!mounted}
      data-nosnippet
    >
      <div className="max-w-xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl p-4 border border-gray-700">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0" aria-hidden="true">🍪</div>
          <div className="flex-1">
            <h3 className="font-bold text-base md:text-lg mb-1.5">{t.title}</h3>
            <p className="text-sm text-gray-300 mb-1.5 leading-relaxed">{t.intro}</p>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              {t.details}{' '}
              <a href={privacyHref} className="underline hover:text-white">
                {t.readMore}
              </a>.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => record('accepted')}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors"
              >
                {t.accept}
              </button>
              <button
                onClick={() => record('rejected')}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-xl text-sm transition-colors"
              >
                {t.reject}
              </button>
            </div>
          </div>
          <button
            onClick={() => record('rejected')}
            className="text-gray-500 hover:text-white shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
