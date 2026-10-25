'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Kind = 'listing' | 'beach' | 'restaurant' | 'activity' | 'blog' | 'village';
type Item = { type: Kind; slug: string; title: string; image?: string | null; timestamp: number };

const STORAGE_KEY = 'chub_recently_viewed'; // v3's key, so returning visitors keep their history
const MAX_ITEMS = 10;
const PATH: Record<Kind, string> = { listing: 'listings', beach: 'beaches', restaurant: 'restaurants', activity: 'activities', blog: 'blog', village: 'places' };
// The site search names the same kinds slightly differently.
const SEARCH_KIND: Record<Kind, string> = { listing: 'listing', beach: 'beach', restaurant: 'restaurant', activity: 'activity', blog: 'article', village: 'village' };
const HEADING: Record<string, string> = {
  el: 'Είδατε πρόσφατα', en: 'Recently viewed', de: 'Zuletzt angesehen', ro: 'Văzute recent', bg: 'Наскоро разгледани', sr: 'Nedavno pregledano', ru: 'Вы недавно смотрели',
};

function read(): Item[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Item[];
  } catch {
    return [];
  }
}

/** The visitor's recent pages, newest first, for the search box's empty state. */
export function readRecent(): Array<{ kind: string; href: string; title: string; image?: string | null }> {
  return read()
    .filter((i) => PATH[i.type])
    .map((i) => ({ kind: SEARCH_KIND[i.type], href: `/${PATH[i.type]}/${i.slug}`, title: i.title, image: i.image }));
}

/**
 * v3's "Recently viewed": records the page being read and lists the others
 * the visitor opened, from this browser only (localStorage, nothing sent).
 */
export function RecentlyViewed({ type, slug, title, image, className = 'mt-12 border-t border-gray-200 pt-8' }: {
  /** The page being read; leave out to only list (the home page). */
  type?: Kind;
  slug?: string;
  title?: string;
  image?: string | null;
  className?: string;
}) {
  const locale = useLocale();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const all = read();
    if (type && slug && title) {
      try {
        const next = [{ type, slug, title, image, timestamp: Date.now() }, ...all.filter((i) => !(i.type === type && i.slug === slug))];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_ITEMS)));
      } catch { /* storage blocked */ }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    setItems(all.filter((i) => !(i.type === type && i.slug === slug) && PATH[i.type]));
  }, [type, slug, title, image]);

  if (!items.length) return null;
  return (
    <section className={className}>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
        <Clock className="size-5 text-slate-500" aria-hidden />
        {HEADING[locale] ?? HEADING.en}
      </h2>
      <ul className="scrollbar-none -mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
        {items.map((i) => (
          <li key={`${i.type}-${i.slug}`} className="w-40 shrink-0">
            <Link href={`/${PATH[i.type]}/${i.slug}`} className="group block">
              <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                {i.image && <Image src={i.image} alt="" fill sizes="160px" className="object-cover transition duration-300 group-hover:scale-105" />}
              </div>
              <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 group-hover:text-sea-700">{i.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
