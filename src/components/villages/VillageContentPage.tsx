'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, Landmark, ChevronRight, Loader2 } from 'lucide-react';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';

interface Village {
  slug: string;
  area: string;
  name: Record<string, string>;
}

const TYPE_CONFIG = {
  beaches: { icon: Waves, color: 'text-cyan-600 bg-cyan-100', api: '/api/beaches', labelEl: 'Παραλίες', labelEn: 'Beaches' },
  restaurants: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-100', api: '/api/restaurants', labelEl: 'Εστιατόρια', labelEn: 'Restaurants' },
  activities: { icon: Landmark, color: 'text-amber-600 bg-amber-100', api: '/api/activities', labelEl: 'Δραστηριότητες', labelEn: 'Activities' },
};

export function VillageContentPage({ slug, contentType }: { slug: string; contentType: 'beaches' | 'restaurants' | 'activities' }) {
  const locale = useLocale();
  const [village, setVillage] = useState<Village | null>(null);
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const config = TYPE_CONFIG[contentType];

  useEffect(() => {
    async function load() {
      const vRes = await fetch(`/api/villages?slug=${slug}`);
      if (vRes.ok) {
        const v = await vRes.json();
        if (v) {
          setVillage(v);
          const res = await fetch(`${config.api}?area=${v.area}&limit=30`);
          const data = await res.json();
          if (Array.isArray(data)) setItems(data);
        }
      }
      setLoading(false);
    }
    load();
  }, [slug, config.api]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!village) return <div className="text-center py-16 text-gray-400">Not found</div>;

  const villageName = village.name[locale] || village.name.el || village.name.en;
  const label = locale === 'el' ? config.labelEl : config.labelEn;
  const Icon = config.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/places/${slug}`} className="hover:text-gray-700">{villageName}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{label}</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{label} {locale === 'el' ? 'κοντά στο' : 'near'} {villageName}</h1>
      </div>
      <p className="text-gray-500 mb-8">{items.length} {locale === 'el' ? 'αποτελέσματα' : 'results'}</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any) => {
            if (contentType === 'beaches') return <BeachCard key={item.id} beach={item} />;
            if (contentType === 'restaurants') return <RestaurantCard key={item.id} restaurant={item} />;
            if (contentType === 'activities') return <ActivityCard key={item.id} activity={item} />;
            return null;
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          {locale === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found'}
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link href={`/places/${slug}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
          ← {locale === 'el' ? 'Πίσω στο' : 'Back to'} {villageName}
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${label} near ${villageName}, Halkidiki`,
        numberOfItems: items.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        itemListElement: items.slice(0, 10).map((item: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Thing', name: item.name?.[locale] || item.name?.el || '' },
        })),
      })}} />
    </div>
  );
}
