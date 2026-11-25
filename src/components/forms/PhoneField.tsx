'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { browserCountry, DIAL_CODES, dialCountry, internationalPhone, SUGGESTED } from '@/lib/phone-countries';

const noSubscribe = () => () => {};

/** Flags are local SVGs (public/flags, from country-flag-icons, MIT): emoji flags don't show on Windows. */
function Flag({ code }: { code: string }) {
  return code ? (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, nothing to optimise
    <img src={`/flags/${code}.svg`} alt="" width={20} height={14} loading="lazy" className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-slate-900/10" />
  ) : (
    <span className="h-3.5 w-5 shrink-0 rounded-[2px] bg-slate-100 ring-1 ring-slate-900/10" />
  );
}

/** Searchable text: lower case, accents removed ("Österreich" → "osterreich"). */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * The country preselected for this visitor: the browser's own country when it
 * names one ("de-AT" → AT), else the site language's first suggestion.
 */
export function usePhoneCountry(locale: string) {
  const [picked, setPicked] = useState<string | null>(null);
  // navigator only exists in the browser: null while rendering on the server and hydrating.
  const fromBrowser = useSyncExternalStore(noSubscribe, browserCountry, () => null);
  const s = SUGGESTED[locale];
  const country = picked ?? fromBrowser ?? (s?.preselect ? s.list[0] : '');
  return { country, setCountry: setPicked, fromBrowser };
}

/**
 * Phone input with a country picker (flag + calling code) in front, so owners
 * get numbers they can call or WhatsApp. The countries that fit the visitor's
 * language come first, then all others A–Z; the list can be searched by
 * name or code. Controlled: `value` is what the visitor typed; turn it into
 * the full number with internationalPhone(value, country).
 */
export function PhoneInput({
  id, locale, value, onChange, country, onCountry, fromBrowser, inputClassName, required, placeholder, searchLabel, label,
}: {
  id: string;
  locale: string;
  value: string;
  onChange: (v: string) => void;
  country: string;
  onCountry: (c: string) => void;
  fromBrowser?: string | null;
  inputClassName: string;
  required?: boolean;
  placeholder?: string;
  searchLabel?: string;
  /** For the picker's accessible name. */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // A number typed with its own code ("+44 …") shows that country instead.
  const typedCountry = dialCountry(value, country);
  const shown = typedCountry ?? country;

  const { top, rest } = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try { names = new Intl.DisplayNames([locale], { type: 'region' }); } catch { /* old browser: codes only */ }
    const opt = (code: string) => ({ code, name: names?.of(code) ?? code, dial: DIAL_CODES[code] });
    const first = [...new Set([...(fromBrowser ? [fromBrowser] : []), ...(SUGGESTED[locale]?.list ?? [])])];
    const others = Object.keys(DIAL_CODES).filter((c) => !first.includes(c)).map(opt);
    others.sort((a, b) => a.name.localeCompare(b.name, locale));
    return { top: first.map(opt), rest: others };
  }, [locale, fromBrowser]);

  const q = fold(query.trim().replace(/^\+/, ''));
  const filtered = q
    ? [...top, ...rest].filter((o) => fold(o.name).includes(q) || o.code.toLowerCase() === q || o.dial.startsWith(q))
    : null;
  const items = filtered ?? [...top, ...rest];

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Keep the highlighted row in view while moving with the arrow keys.
  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  function openMenu() {
    setQuery('');
    setActive(Math.max(0, [...top, ...rest].findIndex((o) => o.code === shown)));
    setOpen(true);
  }

  function choose(code: string) {
    // Picking a country replaces a code the visitor typed themselves.
    if (typedCountry) onChange(value.replace(/^\s*(\+|00)\s*/, '').replace(new RegExp(`^${DIAL_CODES[typedCountry]}\\s*`), ''));
    onCountry(code);
    setOpen(false);
    button.current?.focus();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(items.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (items[active]) choose(items[active].code); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); button.current?.focus(); }
  }

  const row = (o: { code: string; name: string; dial: string }, i: number) => (
    <li
      key={o.code}
      id={`${listId}-${i}`}
      role="option"
      aria-selected={o.code === shown}
      onMouseEnter={() => setActive(i)}
      onClick={() => choose(o.code)}
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm ${i === active ? 'bg-sea-50' : ''}`}
    >
      <Flag code={o.code} />
      <span className="min-w-0 flex-1 truncate text-slate-800">{o.name}</span>
      <span className="tabular-nums text-slate-500">+{o.dial}</span>
      <Check className={`size-4 shrink-0 text-sea-600 ${o.code === shown ? '' : 'invisible'}`} aria-hidden />
    </li>
  );

  return (
    <div ref={box} className="relative flex gap-2">
      <button
        ref={button}
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' && !open) { e.preventDefault(); openMenu(); } }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${shown ? `${top.concat(rest).find((o) => o.code === shown)?.name ?? shown} +${DIAL_CODES[shown]}` : '+'}`}
        className={`${inputClassName} !mt-0 !w-auto flex shrink-0 items-center gap-2 tabular-nums hover:bg-slate-50`}
      >
        <Flag code={shown} />
        <span className="font-medium text-slate-800">{shown ? `+${DIAL_CODES[shown]}` : '+'}</span>
        <ChevronDown className={`size-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        required={required}
        maxLength={24}
        value={value}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClassName} !mt-0 min-w-0 flex-1`}
      />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[17rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5 sm:w-80">
          <div className="border-b border-slate-100 p-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sea-300">
              <Search className="size-4 shrink-0 text-slate-400" aria-hidden />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={onKey}
                placeholder={searchLabel ? `${searchLabel}…` : undefined}
                aria-label={searchLabel ?? label}
                aria-controls={listId}
                aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
                role="combobox"
                aria-expanded
                className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto overscroll-contain p-1.5">
            {filtered ? (
              filtered.length ? filtered.map(row) : <li className="px-2.5 py-3 text-center text-sm text-slate-400">—</li>
            ) : (
              <>
                {top.map(row)}
                {top.length > 0 && <li role="separator" className="mx-2 my-1.5 border-t border-slate-200" />}
                {rest.map((o, i) => row(o, top.length + i))}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/** PhoneInput for plain forms: the full international number goes in a hidden input called `name`. */
export function PhoneField({
  name, label, locale, inputClassName, searchLabel,
}: {
  name: string;
  label: string;
  locale: string;
  inputClassName: string;
  searchLabel?: string;
}) {
  const [raw, setRaw] = useState('');
  const { country, setCountry, fromBrowser } = usePhoneCountry(locale);
  return (
    <div className="text-xs font-medium text-slate-700">
      <label htmlFor={`${name}-local`}>{label}</label>
      <div className="mt-1">
        <PhoneInput
          id={`${name}-local`} locale={locale} value={raw} onChange={setRaw} country={country} onCountry={setCountry}
          fromBrowser={fromBrowser} inputClassName={inputClassName} searchLabel={searchLabel} label={label}
        />
      </div>
      <input type="hidden" name={name} value={internationalPhone(raw, country)} />
    </div>
  );
}
