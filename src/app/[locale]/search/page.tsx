import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Search } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { getActivities, getArticles, getBeaches, getListings, getRestaurants, getVillages } from '@/lib/db/content';
import { allLocales, pick } from '@/lib/i18n/localize';
import { displayName } from '@/lib/content/nearby';
import { greekToLatin } from '@/lib/content/translit';
import { PLACE_NAMES } from '@/lib/content/place-names';
import { privateMetadata } from '@/lib/seo/metadata';
import { Card, CardGrid } from '@/components/ui/Card';
import { Container } from '@/components/ui/Layout';

// Result pages are never indexed (robots.txt also blocks ?q=).
export const metadata = privateMetadata;

/** Accent-, case- and script-insensitive key: "Νικήτη", "nikiti", "NIKITI" all match. */
const norm = (s: string) =>
  greekToLatin(s.toLocaleLowerCase('el'))
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9а-яё]+/gi, ' ')
    .replace(/ch/g, 'h')
    .replace(/y/g, 'i')
    .trim();

type Hit = { kind: string; href: string; title: string; image: string | null; score: number };

export default async function SearchPage({ params, searchParams }: PageProps<'/[locale]/search'>) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const q = String((await searchParams).q ?? '').slice(0, 80).trim();
  const t = await getTranslations({ locale, namespace: 'search' });

  let hits: Hit[] = [];
  if (q.length >= 2) {
    const needle = norm(q);
    const [beaches, villages, restaurants, activities, listings, articles] = await Promise.all([
      getBeaches(), getVillages(), getRestaurants(), getActivities(), getListings(), getArticles(),
    ]);
    const consider = (kind: string, href: string, title: string, names: string[], image: string | null, boost = 0) => {
      const keys = names.filter(Boolean).map(norm);
      const exact = keys.some((k) => k === needle);
      const starts = keys.some((k) => k.startsWith(needle));
      const contains = keys.some((k) => k.includes(needle));
      if (exact || starts || contains) hits.push({ kind, href, title, image, score: (exact ? 3 : starts ? 2 : 1) + boost });
    };
    for (const v of villages) {
      if (v.slug === 'pyrgadikia-mainland') continue;
      const names = PLACE_NAMES[v.slug] ? Object.values(PLACE_NAMES[v.slug]) : Object.values(allLocales(v, 'name'));
      consider('village', `/places/${v.slug}`, displayName(v, locale, 'village'), names, v.image_url, 1);
    }
    for (const b of beaches) consider('beach', `/beaches/${b.slug}`, displayName(b, locale, 'beach'), Object.values(allLocales(b, 'name')), b.image_url);
    for (const r of restaurants) consider('restaurant', `/restaurants/${r.slug}`, displayName(r, locale, 'restaurant'), [...Object.values(allLocales(r, 'name')), r.slug.replace(/-/g, ' ')], r.image_url);
    for (const a of activities) consider('activity', `/activities/${a.slug}`, displayName(a, locale, 'activity'), Object.values(allLocales(a, 'name')), a.image_url);
    for (const l of listings) consider('listing', `/listings/${l.slug}`, displayName(l, locale, 'listing'), [...Object.values(allLocales(l, 'title')), l.location_name], l.cover_url);
    for (const a of articles) consider('article', `/blog/${a.slug}`, pick(a, 'title', locale), [pick(a, 'title', locale)], a.image_url, -0.5);
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
