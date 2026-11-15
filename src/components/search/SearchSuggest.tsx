'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Building2, FileText, Home, Landmark, MapPin, Search, UtensilsCrossed, Waves } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { optimizedImage } from '@/lib/image-url';
import { matchScore, norm } from '@/lib/search/normalize';
import { readRecent } from '@/components/v3/RecentlyViewed';
import type { Locale } from '@/i18n/config';

type Row = [kind: string, href: string, title: string, sub: string, image: string, keys: string, boost: number];
type Entry = { kind: string; href: string; title: string; sub: string; image: string; keys: string[]; boost: number };

const ICONS: Record<string, typeof MapPin> = {
  area: MapPin, village: Building2, beach: Waves, listing: Home, restaurant: UtensilsCrossed, activity: Landmark, article: FileText,
};

// One fetch per page view, shared by every search box on the page.
let indexPromise: Promise<Entry[]> | null = null;
function loadIndex(locale: Locale): Promise<Entry[]> {
  indexPromise ??= fetch(`/api/search-index/${locale}`)
    .then((r) => (r.ok ? (r.json() as Promise<Row[]>) : []))
    .then((rows) => rows.map(([kind, href, title, sub, image, keys, boost]) => ({ kind, href, title, sub, image, keys: keys.split('|'), boost })))
    .catch(() => { indexPromise = null; return []; });
  return indexPromise;
}

/**
 * The hero search box with as-you-type suggestions. Without JavaScript it is a
 * plain form that submits to /search; with it, each key press is matched
 * locally against the whole site (accent-, script- and typo-tolerant), so
 * "nikiti", "Νικητη" and "nikti" all suggest Nikiti.
 */
export function SearchSuggest({ locale, action, placeholder, label, submit, kinds, allLabel, noneLabel, formClassName, variant = 'hero', autoFocus = false, onNavigate }: {
  locale: Locale;
  formClassName: string;
  /** hero: white on the photo, suggestions float below. light: dark on white, suggestions in the flow (the search overlay). */
  variant?: 'hero' | 'light';
  autoFocus?: boolean;
  /** Called after a suggestion is opened, e.g. to close the overlay it lives in. */
  onNavigate?: () => void;
  action: string;
  placeholder: string;
  label: string;
  submit: string;
  kinds: Record<string, string>;
  /** "All results for “{q}”" with {q} left in place. */
  allLabel: string;
  noneLabel: string;
}) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [recent, setRecent] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!index) return [];
    const needle = norm(q);
    // Nothing typed yet: what this visitor opened lately, then the four areas.
    if (needle.length < 2) return [...recent.slice(0, 5), ...index.filter((e) => e.kind === 'area')];
    const scored: Array<{ e: Entry; s: number }> = [];
    for (const e of index) {
      const s = matchScore(needle, e.keys);
      if (s) scored.push({ e, s: s + e.boost });
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, 8).map((x) => x.e);
  }, [index, q, recent]);

  useEffect(() => {
    if (!open) return;
    const close = (ev: PointerEvent) => { if (!box.current?.contains(ev.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  function warm() {
    setOpen(true);
    if (!index) {
      loadIndex(locale).then(setIndex);
      setRecent(readRecent().map((r) => ({ kind: r.kind, href: r.href, title: r.title, sub: '', image: r.image ?? '', keys: [], boost: 0 })));
    }
  }

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  const hero = variant === 'hero';
  // The overlay opens with the keyboard up. A real focus() (React's autoFocus
  // fires no focus event) so onFocus loads the suggestions straight away.
  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);

  const showAll = norm(q).length >= 2;
  const count = results.length + (showAll ? 1 : 0);

  function onKey(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (!open) warm();
      if (!count) return;
      setActive((a) => (ev.key === 'ArrowDown' ? (a + 1) % count : (a - 1 + count) % count));
    } else if (ev.key === 'Enter' && open && active >= 0 && active < results.length) {
      ev.preventDefault();
      go(results[active].href);
    } else if (ev.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  const listId = `${id}-list`;
  const optId = (i: number) => `${id}-opt-${i}`;
  const expanded = open && index !== null && (results.length > 0 || showAll);

  return (
    <div ref={box} className="relative">
      <form action={action} role="search" className={formClassName}>
        <label htmlFor={`${id}-q`} className="sr-only">{label}</label>
        <span className={`flex flex-1 items-center gap-2 rounded-xl px-4 ${hero ? 'bg-white/10' : 'border border-slate-300 bg-white focus-within:border-sea-500 focus-within:ring-2 focus-within:ring-sea-200'}`}>
          <MapPin className={`size-5 shrink-0 ${hero ? 'text-white/70' : 'text-slate-400'}`} aria-hidden />
          <input
            ref={input}
            id={`${id}-q`}
            name="q"
            type="search"
            minLength={2}
            required
            autoComplete="off"
            placeholder={placeholder}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(-1); setOpen(true); }}
            onFocus={warm}
            onKeyDown={onKey}
            role="combobox"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={expanded && active >= 0 ? optId(active) : undefined}
            className={`min-w-0 flex-1 bg-transparent py-3 text-base focus:outline-none ${hero ? 'text-white placeholder:text-white/70' : 'text-slate-900 placeholder:text-slate-400'}`}
          />
        </span>
        <button type="submit" className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${hero ? 'bg-white px-6 text-sea-700 shadow-lg hover:bg-sea-50' : 'bg-sea-600 px-4 text-white hover:bg-sea-700 sm:px-6'}`}>
          <Search className="size-4" aria-hidden />
          {/* In the overlay a phone needs the width for typing: icon only below 640px. */}
          <span className={hero ? undefined : 'sr-only sm:not-sr-only'}>{submit}</span>
        </button>
      </form>

      {expanded && (
        <ul id={listId} role="listbox" aria-label={label} className={`text-left text-gray-900 ${hero ? 'absolute inset-x-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-2xl' : 'mt-3'}`}>
          {results.map((e, i) => {
            const Icon = ICONS[e.kind] ?? MapPin;
            return (
              <li
                key={`${i}-${e.href}`}
                id={optId(i)}
                role="option"
                aria-selected={active === i}
                onPointerEnter={() => setActive(i)}
                onClick={() => go(e.href)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 ${active === i ? 'bg-sea-50' : ''}`}
              >
                {e.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 40px thumbnail; next/image's layout model adds nothing here
                  <img src={optimizedImage(e.image, 96)} alt="" width={40} height={40} loading="lazy" className="size-10 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sea-50 text-sea-700"><Icon className="size-5" aria-hidden /></span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{e.title}</span>
                  {e.sub && <span className="block truncate text-xs text-gray-500">{e.sub}</span>}
                </span>
                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{kinds[e.kind] ?? ''}</span>
              </li>
            );
          })}
          {showAll && results.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-gray-600">{noneLabel.replace('{q}', q.trim())}</li>
          )}
          {showAll && (
            <li
              id={optId(results.length)}
              role="option"
              aria-selected={active === results.length}
              onPointerEnter={() => setActive(results.length)}
              onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
              className={`mt-1 flex cursor-pointer items-center justify-between gap-2 rounded-xl border-t border-gray-100 px-3 py-2.5 text-sm font-semibold text-sea-700 ${active === results.length ? 'bg-sea-50' : ''}`}
            >
              {allLabel.replace('{q}', q.trim())}
              <ArrowRight className="size-4" aria-hidden />
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
