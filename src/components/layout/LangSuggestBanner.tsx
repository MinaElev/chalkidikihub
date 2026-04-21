'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { X } from 'lucide-react';

const STORAGE_KEY = 'lang-suggest-dismissed';

// Messages are rendered in the SUGGESTED locale (user's native) so they can read them.
const MESSAGES: Record<Locale, { suggest: string; cta: string; dismiss: string }> = {
  el: { suggest: 'Δες τη σελίδα στα', cta: 'Αλλαγή', dismiss: 'Κλείσιμο' },
  en: { suggest: 'View this page in', cta: 'Switch', dismiss: 'Dismiss' },
  de: { suggest: 'Seite anzeigen auf', cta: 'Wechseln', dismiss: 'Schließen' },
  bg: { suggest: 'Вижте страницата на', cta: 'Превключи', dismiss: 'Затвори' },
  ru: { suggest: 'Посмотреть страницу на', cta: 'Переключить', dismiss: 'Закрыть' },
  ro: { suggest: 'Vezi pagina în', cta: 'Schimbă', dismiss: 'Închide' },
  sr: { suggest: 'Pogledaj stranicu na', cta: 'Prebaci', dismiss: 'Zatvori' },
};

function detectLocale(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of langs) {
    if (!lang) continue;
    const base = lang.toLowerCase().split('-')[0];
    if ((locales as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

export function LangSuggestBanner() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      // localStorage blocked (private mode, etc.) — fall through and still show once
    }
    const detected = detectLocale();
    if (!detected || detected === currentLocale) return;
    setSuggested(detected);
  }, [currentLocale]);

  if (!suggested) return null;

  const msg = MESSAGES[suggested];

  function persistDismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
  }

  function handleSwitch() {
    persistDismiss();
    router.replace(pathname, { locale: suggested! });
  }

  function handleDismiss() {
    persistDismiss();
    setLeaving(true);
    setTimeout(() => setSuggested(null), 200);
  }

  return (
    <div
      className={`fixed top-20 right-4 z-[998] max-w-xs w-[calc(100vw-2rem)] sm:w-80 transition-all duration-200 ease-out ${leaving ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      style={{ willChange: 'transform, opacity', animation: leaving ? undefined : 'langSuggestIn 240ms ease-out' }}
      role="dialog"
      aria-label="Language suggestion"
      data-nosnippet
    >
      <style>{`@keyframes langSuggestIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } } @media (prefers-reduced-motion: reduce) { [aria-label="Language suggestion"] { animation: none !important; } }`}</style>
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 pr-8 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-1.5 right-1.5 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label={msg.dismiss}
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span aria-hidden="true" className="text-xl">{localeFlags[suggested]}</span>
          <p className="text-sm text-gray-900">
            {msg.suggest} <strong>{localeNames[suggested]}</strong>?
          </p>
        </div>
        <button
          onClick={handleSwitch}
          className="w-full px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {msg.cta} →
        </button>
      </div>
    </div>
  );
}
