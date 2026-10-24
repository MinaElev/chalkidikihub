import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Search } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { searchEntries } from '@/lib/search/entries';
import { matchScore, norm } from '@/lib/search/normalize';
import { privateMetadata } from '@/lib/seo/metadata';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container } from '@/components/ui/Layout';

// Result pages are never indexed (robots.txt also blocks ?q=).
export const metadata = privateMetadata;

type Hit = { kind: string; href: string; title: string; image: string | null; score: number };

export default async function SearchPage({ params, searchParams }: PageProps<'/[locale]/search'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const q = String((await searchParams).q ?? '').slice(0, 80).trim();
  const t = await getTranslations({ locale, namespace: 'search' });

  let hits: Hit[] = [];
  if (q.length >= 2) {
    const needle = norm(q);
    for (const x of await searchEntries(locale)) {
      const score = matchScore(needle, x.keys);
      if (score) hits.push({ kind: x.kind, href: x.href, title: x.title, image: x.image, score: score + x.boost });
    }
    hits = hits.sort((a, b) => b.score - a.score).slice(0, 48);
  }

  return (
    <Container className="py-8">
      <h1 className="font-display text-3xl font-semibold text-slate-900">{t('title')}</h1>
      <form action="" method="get" role="search" className="mt-5 flex max-w-2xl gap-2">
        <label className="relative flex-1">
          <span className="sr-only">{t('title')}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t('placeholder')}
            autoFocus
            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-200"
          />
        </label>
        <button type="submit" className="rounded-xl bg-sea-600 px-5 font-semibold text-white hover:bg-sea-700">{t('submit')}</button>
      </form>
      {q.length < 2 ? (
        <p className="mt-6 text-slate-600">{t('hint')}</p>
      ) : hits.length === 0 ? (
        <p className="mt-6 text-slate-600">{t('none', { q })}</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-600">{t('results', { count: hits.length, q })}</p>
          <div className="mt-6">
            <CardGrid>
              {hits.map((h) => (
                <Card key={h.href} href={h.href} title={h.title} image={h.image} eyebrow={t(`kind_${h.kind}`)} />
              ))}
            </CardGrid>
          </div>
        </>
      )}
    </Container>
  );
}
