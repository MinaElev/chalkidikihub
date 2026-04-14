'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Sale } from '@/types';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { MapPin, BedDouble, Bath, Phone, Mail, Maximize, Building, Calendar, Zap, Layers } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { JsonLd } from '@/components/ui/JsonLd';
import { LocationMap } from '@/components/ui/LocationMap';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';
import { addRecentlyViewed } from '@/lib/use-recently-viewed';
import { RecentlyViewed } from '@/components/ui/RecentlyViewed';

const TYPE_COLORS: Record<string, string> = {
  house: 'bg-emerald-600', apartment: 'bg-blue-600', land: 'bg-amber-600',
  commercial: 'bg-purple-600', other: 'bg-gray-600',
};

export function DynamicSaleDetail({ slug, initialData }: { slug: string; initialData?: Sale | null }) {
  const [sale, setSale] = useState<Sale | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tDetail = useTranslations('detail');
  const tTypes = useTranslations('propertyTypes');
  const tFeatures = useTranslations('saleFeatures');
  const tInquiry = useTranslations('inquiry');

  useEffect(() => {
    if (!initialData) {
      fetch(`/api/sales?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => { if (data && data.id) setSale(data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug, initialData]);

  useEffect(() => {
    if (sale) {
      addRecentlyViewed({
        type: 'listing',
        slug: sale.slug,
        title: sale.title[locale] || sale.title.en || sale.title.el,
        image: sale.images?.[0]?.image_url,
      });
    }
  }, [sale, locale]);

  if (loading) return <DetailSkeleton />;

  if (!sale) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">{tCommon('error')}</p>
        <Link href="/sales" className="mt-4 inline-flex text-primary-600 hover:underline">
          {tCommon('backToHome')}
        </Link>
      </div>
    );
  }

  const area = AREAS.find((a) => a.slug === sale.area);
  const title = sale.title[locale] || sale.title.en || sale.title.el;
  const description = sale.description[locale] || sale.description.en || sale.description.el;
  const typeLabel = tTypes(sale.property_type);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: title,
    description,
    url: typeof window !== 'undefined' ? window.location.href : '',
    image: sale.images?.map((img) => img.image_url) || [],
    offers: {
      '@type': 'Offer',
      price: sale.price,
      priceCurrency: sale.currency || 'EUR',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: sale.location_name,
      addressRegion: 'Halkidiki',
      addressCountry: 'GR',
    },
    ...(sale.latitude && sale.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: sale.latitude,
        longitude: sale.longitude,
      },
    } : {}),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: tDetail('salesBreadcrumb'), href: '/sales' }, { label: title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <ImageGallery images={sale.images || []} alt={title} />

          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <ShareButtons title={title} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span className={`${TYPE_COLORS[sale.property_type] || 'bg-gray-600'} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                {typeLabel}
              </span>
              <MapPin className="w-4 h-4 ml-2" /><span>{sale.location_name}</span>
              {area && (<><span className="text-gray-300">|</span>
                <Link href={`/areas/${sale.area}`} className="text-primary-600 hover:underline">{area.name[locale]}</Link>
              </>)}
            </div>
          </div>

          {/* Key specs */}
          <div className="flex items-center gap-6 py-4 border-y border-gray-200 flex-wrap">
            {sale.size_sqm > 0 && (
              <div className="flex items-center gap-2"><Maximize className="w-5 h-5 text-gray-400" /><span className="text-sm">{sale.size_sqm} {tDetail('sqm')}</span></div>
            )}
            {sale.bedrooms > 0 && (
              <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-gray-400" /><span className="text-sm">{sale.bedrooms} {tDetail('bedrooms')}</span></div>
            )}
            {sale.bathrooms > 0 && (
              <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-gray-400" /><span className="text-sm">{sale.bathrooms} {tDetail('bathrooms')}</span></div>
            )}
            {sale.floor > 0 && (
              <div className="flex items-center gap-2"><Layers className="w-5 h-5 text-gray-400" /><span className="text-sm">{sale.floor}{tDetail('floor')}</span></div>
            )}
            {sale.year_built > 0 && (
              <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /><span className="text-sm">{tDetail('built')} {sale.year_built}</span></div>
            )}
            {sale.energy_class && (
              <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-gray-400" /><span className="text-sm">{tDetail('energyClass')} {sale.energy_class}</span></div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{tDetail('description')}</h2>
            <AutoLinkedContent content={description} />
          </div>

          {/* Features */}
          {sale.features && sale.features.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{tDetail('features')}</h2>
              <div className="flex flex-wrap gap-2">
                {sale.features.map((feature) => (
                  <span key={feature} className="px-3 py-1.5 rounded-full text-sm border border-emerald-200 bg-emerald-50 text-emerald-700">
                    {tFeatures(feature)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {sale.latitude && sale.longitude && sale.latitude !== 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{tDetail('location')}</h2>
              <LocationMap latitude={sale.latitude} longitude={sale.longitude} name={title} />
            </div>
          )}

          <ShareButtons title={title} description={description} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <div className="text-sm text-gray-500">{tDetail('sellingPrice')}</div>
              <div className="text-3xl font-bold text-gray-900">
                &euro;{sale.price.toLocaleString()}
              </div>
              {sale.size_sqm > 0 && (
                <p className="text-sm text-gray-400 mt-1">{Math.round(sale.price / sale.size_sqm)}{tDetail('pricePerSqm')}</p>
              )}
            </div>
            <hr />
            {sale.contact_phone && (
              <a href={`tel:${sale.contact_phone}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors">
                <Phone className="w-4 h-4" />{sale.contact_phone}
              </a>
            )}
            {sale.contact_email && (
              <a href={`mailto:${sale.contact_email}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
                <Mail className="w-4 h-4" />{sale.contact_email}
              </a>
            )}
          </div>
        </div>
      </div>

      <RecentlyViewed currentSlug={slug} />

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <span className="text-xl font-bold text-gray-900">&euro;{sale.price.toLocaleString()}</span>
          </div>
          {sale.contact_phone ? (
            <a href={`tel:${sale.contact_phone}`}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" /> {tInquiry('call')}
            </a>
          ) : sale.contact_email ? (
            <a href={`mailto:${sale.contact_email}`}
              className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl text-sm">
              {tInquiry('contact')}
            </a>
          ) : null}
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </div>
  );
}
