'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { SearchSuggest } from './SearchSuggest';

export type SearchOverlayLabels = {
  title: string;
  placeholder: string;
  submit: string;
  close: string;
  all: string;
  none: string;
  kinds: Record<string, string>;
};

/**
 * The header's search: opens the as-you-type search over the current page
 * instead of sending the visitor to /search. Without JavaScript the trigger is
 * a plain link to /search.
 */
export function SearchOverlay({ locale, labels, trigger = 'icon' }: {
  locale: Locale;
  labels: SearchOverlayLabels;
  /** icon: the magnifier in the bar. field: a search box look-alike (top of the mobile menu). */
  trigger?: 'icon' | 'field';
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openIt = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      {trigger === 'icon' ? (
        <Link href="/search" onClick={openIt} className="flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100" aria-label={labels.title}>
          <Search className="size-5" aria-hidden />
        </Link>
      ) : (
        <Link href="/search" onClick={openIt} className="mb-2 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-500">
          <Search className="size-5 text-slate-400" aria-hidden />
          {labels.placeholder}
        </Link>
      )}

      {/* Portal: the header's backdrop blur would otherwise trap a fixed overlay inside the 64px bar. */}
      {open && createPortal(
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={labels.title}>
          <button type="button" aria-label={labels.close} onClick={() => setOpen(false)} className="absolute inset-0 hidden bg-slate-900/40 md:block" />
          <div className="relative h-full overflow-y-auto bg-white px-4 pb-8 pt-4 md:mx-auto md:mt-20 md:h-auto md:max-h-[80vh] md:max-w-2xl md:rounded-2xl md:p-6 md:shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-lg font-bold text-slate-900">{labels.title}</p>
              <button type="button" onClick={() => setOpen(false)} className="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label={labels.close}>
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <SearchSuggest
              variant="light"
              autoFocus
              locale={locale}
              action={locale === 'el' ? '/search' : `/${locale}/search`}
              formClassName="flex gap-2"
              label={labels.title}
              placeholder={labels.placeholder}
              submit={labels.submit}
              allLabel={labels.all}
              noneLabel={labels.none}
              kinds={labels.kinds}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
