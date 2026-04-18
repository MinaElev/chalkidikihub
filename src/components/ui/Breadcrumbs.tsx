'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

// UI-only breadcrumb. JSON-LD BreadcrumbList is emitted server-side
// from each page.tsx via generateBreadcrumbLD() in @/lib/seo — having
// two sources emit the same schema from server + client caused GSC
// "Invalid object type for <parent_node>" warnings on beach pages.
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations('nav');

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
      <Link href="/" className="flex items-center gap-1 hover:text-primary-600 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('home')}</span>
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          {item.href && idx < items.length - 1 ? (
            <Link href={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
