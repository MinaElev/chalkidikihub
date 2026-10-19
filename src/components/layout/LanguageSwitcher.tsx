'use client';

import { Globe } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { localePath } from '@/lib/seo/site';
import type { Locale } from '@/i18n/config';

type Props = {
  current: Locale;
  languages: Array<{ code: Locale; name: string }>;
  label: string;
};

/**
 * Links to the same page in every language (plain links — crawlable, no JS
 * needed to follow). Hrefs are the final URLs: next-intl's locale Link
 * prefixes Greek as /el/... (for its locale cookie, which is off here), and
 * every page then carried a link that 308s to the unprefixed URL.
 */
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
            <NextLink
              href={localePath(l.code, pathname)}
              hrefLang={l.code}
              aria-current={l.code === current ? 'true' : undefined}
              className="flex items-center justify-between px-3 py-2 hover:bg-sea-50 aria-[current]:font-semibold aria-[current]:text-sea-700"
            >
              {l.name}
              <span className="text-xs uppercase text-slate-400">{l.code}</span>
            </NextLink>
          </li>
        ))}
      </ul>
    </details>
  );
}
