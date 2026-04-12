'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, Landmark, ChevronRight, Loader2, Trophy } from 'lucide-react';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { getBestGuide, BEST_GUIDES } from './best-data';

const ICONS: Record<string, typeof Waves> = { Waves, UtensilsCrossed, Landmark };

export default function BestOfClient() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const guide = getBestGuide(slug);

  useEffect(() => {
    if (!guide) { setLoading(false); return; }
    fetch(guide.apiUrl)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) { setItems([]); return; }
        let filtered = data;
        // Client-side filter if needed
        if (guide.filterFn && guide.filterValue) {
          filtered = data.filter((item: Record<string, unknown>) => {
            const val = item[guide.filterFn!];
            if (Array.isArray(val)) return val.includes(guide.filterValue);
            return String(val) === guide.filterValue;
          });
        }
        setItems(filtered);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [slug, guide]);

  if (!guide) return <div className="text-center py-16 text-gray-400">Guide not found</div>;
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const title = guide.title[locale] || guide.title.en;
  const desc = guide.description[locale] || guide.description.en;
  const Icon = ICONS[guide.icon] || Waves;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      {/* Header */}
      <div className={`bg-gradient-to-br from-${guide.color}-600 to-${guide.color}-700 rounded-2xl p-8 text-white mb-8`}>
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-6 h-6 text-yellow-300" />
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Best of Halkidiki</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-white/80">{desc}</p>
        <p className="text-white/60 text-sm mt-3">{items.length} {locale === 'el' ? 'αποτελέσματα' : 'results'}</p>
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any, i: number) => {
            if (guide.contentType === 'beaches') return <BeachCard key={item.id || i} beach={item} />;
            if (guide.contentType === 'restaurants') return <RestaurantCard key={item.id || i} restaurant={item} />;
            if (guide.contentType === 'activities') return <ActivityCard key={item.id || i} activity={item} />;
            return null;
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          {locale === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found'}
        </div>
      )}

      {/* More guides */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{locale === 'el' ? 'Περισσότεροι Οδηγοί' : 'More Guides'}</h2>
        <div className="flex flex-wrap gap-2">
          {BEST_GUIDES.filter(g => g.slug !== slug).slice(0, 6).map(g => (
            <Link key={g.slug} href={`/best/${g.slug}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              {g.title[locale] || g.title.en}
            </Link>
          ))}
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        description: desc,
        numberOfItems: items.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        itemListElement: items.slice(0, 10).map((item: any, i: number) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'Thing', name: item.name?.[locale] || item.name?.el || '' },
        })),
      })}} />
    </div>
  );
}
