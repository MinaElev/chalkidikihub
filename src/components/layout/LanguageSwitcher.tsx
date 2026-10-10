'use client';

import { Globe } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';

type Props = {
  current: Locale;
  languages: Array<{ code: Locale; name: string }>;
  label: string;
};

/** Links to the same page in every language (plain links — crawlable, no JS needed to follow). */
export function LanguageSwitcher({ current, languages, label }: Props) {
  const pathname = usePathname();

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
        <Globe className="size-4" aria-hidden />
        <span className="uppercase">{current}</span>
        <span className="sr-only">{label}</span>
      </summary>
      <ul className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg">
        {languages.map((l) => (
          <li key={l.code}>
            <Link
              href={pathname}
              locale={l.code}
              hrefLang={l.code}
              aria-current={l.code === current ? 'true' : undefined}
              className="flex items-center justify-between px-3 py-2 hover:bg-sea-50 aria-[current]:font-semibold aria-[current]:text-sea-700"
            >
              {l.name}
              <span className="text-xs uppercase text-slate-400">{l.code}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
