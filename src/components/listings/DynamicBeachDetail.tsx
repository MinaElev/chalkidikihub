'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Beach } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Loader2 } from 'lucide-react';
import { BeachFeatureBadge } from './BeachFeatureBadge';
import { CrowdIndicator } from './CrowdIndicator';

export function DynamicBeachDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('beaches');
  const [beach, setBeach] = useState<Beach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/beaches?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setBeach(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-[40vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  if (!beach) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-lg text-gray-500">Beach not found</p><Link href="/beaches" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link></div>;

  const name = beach.name[locale] || beach.name.en;
  const description = beach.description[locale] || beach.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/beaches" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"><ArrowLeft className="w-4 h-4" />{t('title')}</Link>
      {beach.image_url && <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8"><img src={beach.image_url} alt={name} className="w-full h-full object-cover" /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div><h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-2 text-gray-600"><MapPin className="w-4 h-4" /><span>{beach.location_name}</span></div></div>
          <CrowdIndicator beachSlug={beach.slug} />
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
          {beach.features.length > 0 && <div><h2 className="text-xl font-semibold text-gray-900 mb-4">{t('features')}</h2><div className="flex flex-wrap gap-2">{beach.features.map((f) => <BeachFeatureBadge key={f} feature={f} />)}</div></div>}
        </div>
        <div className="lg:col-span-1"><div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4"><Star className="w-6 h-6 text-amber-500 fill-amber-500" /><span className="text-2xl font-bold">{beach.rating.toFixed(1)}</span></div>
          <p className="text-sm text-gray-500">{beach.reviews_count} {t('reviews')}</p>
        </div></div>
      </div>
    </div>
  );
}
