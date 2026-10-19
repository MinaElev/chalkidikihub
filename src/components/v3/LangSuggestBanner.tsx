'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { localePath } from '@/lib/seo/site';

const STORAGE_KEY = 'lang-suggest-dismissed';
const FLAGS: Record<Locale, string> = { el: '🇬🇷', en: '🇬🇧', de: '🇩🇪', ro: '🇷🇴', bg: '🇧🇬', sr: '🇷🇸', ru: '🇷🇺' };

// Written in the suggested language, so the visitor can read it.
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
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of langs) {
    const base = lang?.toLowerCase().split('-')[0];
    if (base && (locales as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

/**
 * v3's language hint: when the browser prefers another of our languages, a
 * small card offers that version of the page. It never redirects on its own,
 * so crawlers and shared links always land on the URL they asked for.
 */
export function LangSuggestBanner() {
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch { /* storage blocked: show once */ }
    const detected = detectLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the browser once at mount
    if (detected && detected !== current) setSuggested(detected);
  }, [current]);

  if (!suggested) return null;
  const msg = MESSAGES[suggested];
  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
    setSuggested(null);
  };

  return (
    <div className="fixed right-4 top-20 z-50 w-[calc(100vw-2rem)] max-w-xs sm:w-80" role="dialog" aria-label={msg.suggest} data-nosnippet>
      <div className="relative rounded-xl border border-gray-200 bg-white p-3 pr-8 shadow-xl">
        <button type="button" onClick={dismiss} className="absolute right-1.5 top-1.5 rounded-md p-1 text-slate-500 hover:bg-gray-100 hover:text-gray-700" aria-label={msg.dismiss}>
          <X className="size-4" aria-hidden />
        </button>
        <div className="mb-2 flex items-center gap-2">
          <span aria-hidden className="text-xl">{FLAGS[suggested]}</span>
          <p className="text-sm text-gray-900">
            {msg.suggest} <strong>{localeNames[suggested]}</strong>?
          </p>
        </div>
        <a
          href={localePath(suggested, pathname)}
          hrefLang={suggested}
          onClick={() => { try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ } }}
          className="block w-full rounded-lg bg-sea-600 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-sea-700"
        >
          {msg.cta} →
        </a>
      </div>
    </div>
  );
}
