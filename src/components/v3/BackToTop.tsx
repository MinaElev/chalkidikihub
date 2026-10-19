'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { ArrowUp } from 'lucide-react';

const LABEL: Record<string, string> = {
  el: 'Επιστροφή στην κορυφή', en: 'Back to top', de: 'Nach oben', ro: 'Înapoi sus', bg: 'Към началото', sr: 'Na vrh', ru: 'Наверх',
};

/** v3's back-to-top button; sits above the availability button so the two never overlap. */
export function BackToTop() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={LABEL[locale] ?? LABEL.en}
      title={LABEL[locale] ?? LABEL.en}
      className="fixed bottom-20 right-5 z-40 flex size-11 items-center justify-center rounded-full bg-white text-sea-700 shadow-lg ring-1 ring-gray-200 transition hover:bg-sea-50 md:bottom-24 md:right-7"
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
