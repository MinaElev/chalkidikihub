'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Beach } from '@/types';
import { BeachCard } from '@/components/listings/BeachCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Loader2, Waves } from 'lucide-react';

export default function BeachesByFeaturePageClient() {
  const { feature } = useParams<{ feature: string }>();
  const locale = useLocale();
  const t = useTranslations('beaches');
  const tFeatures = useTranslations('beachFeatures');
  const [items, setItems] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  let featureName = feature;
  try { featureName = tFeatures(feature); } catch { featureName = feature; }

  useEffect(() => {
    fetch(`/api/beaches?feature=${feature}&limit=30&fields=card`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setItems(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [feature]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title'), href: '/beaches' }, { label: featureName }]} />

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
          <Waves className="w-5 h-5 text-cyan-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{featureName} — {t('title')}</h1>
      </div>
      <p className="text-gray-500 mb-8">{items.length} {t('results')} {locale === 'el' ? 'στη Χαλκιδική' : 'in Halkidiki'}</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(beach => <BeachCard key={beach.id} beach={beach} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          {locale === 'el' ? 'Δεν βρέθηκαν παραλίες με αυτό το χαρακτηριστικό' : 'No beaches found with this feature'}
        </div>
      )}

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${featureName} beaches in Halkidiki`,
        numberOfItems: items.length,
        itemListElement: items.slice(0, 10).map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Beach', name: b.name[locale] || b.name.el },
        })),
      })}} />
    </div>
  );
}
