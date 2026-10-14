'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PhotoCard } from '@/components/ui/PhotoCard';
import { Rail } from '@/components/ui/Rail';

export type FinderBeach = {
  slug: string;
  name: string;
  village?: string;
  image: string | null;
  imageAlt?: string | null;
  area: string;
  features: string[];
  rating?: number | null;
  reviews?: number | null;
  ratingSource?: string | null;
};

type Labels = {
  areas: Record<string, string>;
  features: Record<string, string>;
};

const SHOWN = 12;

/**
 * "Find your beach": peninsula tabs plus feature toggles over the beaches
 * already loaded for the page. Filtering happens in the browser, so trying
 * combinations is instant; every result is a normal link to the beach page.
 */
export function BeachFinder({ beaches, labels }: { beaches: FinderBeach[]; labels: Labels }) {
  const t = useTranslations('finder');
  const [area, setArea] = useState<string>('all');
  const [wanted, setWanted] = useState<string[]>([]);

  const matches = useMemo(
    () => beaches.filter((b) => (area === 'all' || b.area === area) && wanted.every((f) => b.features.includes(f))),
    [beaches, area, wanted],
  );
  const toggle = (f: string) => setWanted((w) => (w.includes(f) ? w.filter((x) => x !== f) : [...w, f]));

  const tab = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-sea-900 text-white shadow-md' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-sea-300'}`;

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2">
        {['all', ...Object.keys(labels.areas)].map((a) => (
          <button key={a} type="button" role="tab" aria-selected={area === a} onClick={() => setArea(a)} className={tab(area === a)}>
            {a === 'all' ? t('all') : labels.areas[a]}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(labels.features).map(([f, label]) => {
          const on = wanted.includes(f);
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(f)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${on ? 'bg-sun-600 text-white shadow' : 'bg-sun-50 text-sun-900 hover:bg-sun-100'}`}
            >
              {on && <Check className="size-3.5" aria-hidden />}
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-600" aria-live="polite">{t('count', { count: matches.length })}</p>

      {matches.length ? (
        <div className="mt-3">
          <Rail key={`${area}|${wanted.join(',')}`} prevLabel={t('prev')} nextLabel={t('next')}>
            {matches.slice(0, SHOWN).map((b) => (
              <PhotoCard
                key={b.slug}
                href={`/beaches/${b.slug}`}
                title={b.name}
                eyebrow={b.village}
                image={b.image}
                imageAlt={b.imageAlt}
                rating={b.rating}
                reviews={b.reviews}
                ratingSource={b.ratingSource}
                chip={b.features.includes('blue-flag') ? labels.features['blue-flag'] : undefined}
              />
            ))}
          </Rail>
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-sand-50 p-6 text-slate-600">{t('none')}</p>
      )}

      <Link href="/beaches" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:underline">
        {t('viewAll')} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
