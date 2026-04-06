'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Listing } from '@/types';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { MapPin, Users, BedDouble, Bath, Phone, Mail, Loader2, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AmenityBadge } from './AmenityBadge';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RelatedContent } from './RelatedContent';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateLodgingLD } from '@/lib/seo';
import { LocationMap } from '@/components/ui/LocationMap';
import { FormattedText } from '@/components/ui/FormattedText';

export function DynamicListingDetail({ slug, locale }: { slug: string; locale: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('listings.details');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  useEffect(() => {
    fetch(`/api/listings?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setListing(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">{tCommon('error')}</p>
        <Link href="/listings" className="mt-4 inline-flex text-primary-600 hover:underline">
          {tCommon('backToHome')}
        </Link>
      </div>
    );
  }

  const area = AREAS.find((a) => a.slug === listing.area);
  const title = listing.title[locale] || listing.title.en || listing.title.el;
  const description = listing.description[locale] || listing.description.en || listing.description.el;
  const coverImage = listing.images?.find((img) => img.is_cover) || listing.images?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = listing as any;
  const bookingUrl = ext.booking_url as string | null;
  const airbnbUrl = ext.airbnb_url as string | null;
  const contactPhone = ext.contact_phone as string | null;
  const contactEmail = ext.contact_email as string | null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={generateLodgingLD(listing as unknown as Record<string, unknown>, locale)} />
      <Breadcrumbs items={[{ label: tNav('listings'), href: '/listings' }, { label: title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery with Lightbox */}
          <ImageGallery images={listing.images || []} alt={title} />

          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <ShareButtons title={title} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" /><span>{listing.location_name}</span>
              {area && (<><span className="text-gray-300">|</span>
                <Link href={`/areas/${listing.area}`} className="text-primary-600 hover:underline">{area.name[locale]}</Link>
              </>)}
            </div>
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.guests_max} {tCommon('guests')}</span></div>
            <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.bedrooms} {tCommon('bedrooms')}</span></div>
            <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.bathrooms} {tCommon('bathrooms')}</span></div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('description')}</h2>
            <FormattedText text={description} />
          </div>

          {listing.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('amenities')}</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (<AmenityBadge key={amenity} amenity={amenity} />))}
              </div>
            </div>
          )}

          {/* Map */}
          {listing.latitude && listing.longitude && listing.latitude !== 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('location')}</h2>
              <LocationMap latitude={listing.latitude} longitude={listing.longitude} name={title} />
            </div>
          )}

          <ShareButtons title={title} description={description} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <div className="text-sm text-gray-500">{tCommon('from')}</div>
              <div className="text-3xl font-bold text-gray-900">
                &euro;{listing.price_per_night}
                <span className="text-lg font-normal text-gray-500">{tCommon('perNight')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">* Η τελική τιμή μπορεί να διαφέρει ανάλογα την εποχή</p>
            </div>
            <hr />
            {/* Booking buttons */}
            {(listing as any).website_url && (
              <a href={(listing as any).website_url} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Website
              </a>
            )}
            {bookingUrl && (
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#003580] hover:bg-[#00264d] text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Booking.com
              </a>
            )}
            {airbnbUrl && (
              <a href={airbnbUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5A5F] hover:bg-[#e04e53] text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Airbnb
              </a>
            )}
            {contactPhone ? (
              <a href={`tel:${contactPhone}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors">
                <Phone className="w-4 h-4" />{contactPhone}
              </a>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
                <Phone className="w-4 h-4" />{tCommon('contactOwner')}
              </button>
            )}
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
                <Mail className="w-4 h-4" />{contactEmail}
              </a>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
                <Mail className="w-4 h-4" />Email
              </button>
            )}
          </div>
        </div>
      </div>

      <RelatedContent area={listing.area} currentSlug={listing.slug} />
    </div>
  );
}
