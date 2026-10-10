'use client';

import { useLocale } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const HOME: Record<string, string> = {
  el: 'Αρχική', en: 'Home', de: 'Startseite', ro: 'Acasă', bg: 'Начало', sr: 'Početna', ru: 'Главная',
};

/** v3 signature ({ items: [{label, href}] }); works in server and client trees. */
export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  const locale = useLocale();
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      <Link href="/" className="hover:text-sea-700 hover:underline">{HOME[locale] ?? HOME.en}</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 text-slate-400" aria-hidden />
          {item.href ? <Link href={item.href} className="hover:text-sea-700 hover:underline">{item.label}</Link> : <span className="text-slate-700">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
