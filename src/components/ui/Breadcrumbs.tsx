import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/config';
import { breadcrumbLd, type Crumb } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';

/** Visible trail + BreadcrumbList schema from one source, so they never disagree. */
export function Breadcrumbs({ locale, crumbs }: { locale: Locale; crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-1">
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-slate-700">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="hover:text-sea-700 hover:underline">
                      {c.name}
                    </Link>
                    <ChevronRight className="size-3.5 text-slate-400" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(locale, crumbs)} />
    </>
  );
}
