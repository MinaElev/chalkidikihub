import { useTranslations, useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { seedListings } from '@/lib/seed-data';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { MapPin, Users, BedDouble, Bath, Phone, Mail } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AmenityBadge } from '@/components/listings/AmenityBadge';
import { DynamicListingDetail } from '@/components/listings/DynamicListingDetail';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { RelatedContent } from '@/components/listings/RelatedContent';
import { LocationMap } from '@/components/ui/LocationMap';
import { getContentMeta } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return seedListings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('listings', slug, locale, 'Accommodation | Chalkidiki Hub', 'Find accommodation in Halkidiki');
}

export default async function ListingDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Check seed data first
  const listing = seedListings.find((l) => l.slug === slug);

  if (listing) {
    const area = AREAS.find((a) => a.slug === listing.area);
    return <ListingDetail locale={locale} listing={listing} areaName={area?.name[locale] || ''} />;
  }

  // Not in seed data - must be a DB listing, render client component that fetches it
  return <DynamicListingDetail slug={slug} locale={locale} />;
}

function ListingDetail({
  locale,
  listing,
  areaName,
}: {
  locale: string;
  listing: (typeof seedListings)[number];
  areaName: string;
}) {
  const t = useTranslations('listings.details');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const title = listing.title[locale] || listing.title.en;
  const description = listing.description[locale] || listing.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: tNav('listings'), href: '/listings' }, { label: title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <ImageGallery images={listing.images || []} alt={title} />

          {/* Title & location */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <ShareButtons title={title} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{listing.location_name}</span>
              <span className="text-gray-300">|</span>
              <Link
                href={`/areas/${listing.area}`}
                className="text-primary-600 hover:underline"
              >
                {areaName}
              </Link>
            </div>
          </div>

          {/* Key info */}
          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                {listing.guests_max} {tCommon('guests')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                {listing.bedrooms} {tCommon('bedrooms')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-5 h-5 text-gray-400" />
              <span className="text-sm">
                {listing.bathrooms} {tCommon('bathrooms')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('description')}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('amenities')}</h2>
            <div className="flex flex-wrap gap-2">
              {listing.amenities.map((amenity) => (
                <AmenityBadge key={amenity} amenity={amenity} />
              ))}
            </div>
          </div>

          {/* Map */}
          {listing.latitude && listing.longitude && listing.latitude !== 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('location')}</h2>
              <LocationMap latitude={listing.latitude} longitude={listing.longitude} name={title} />
            </div>
          )}

          <ShareButtons title={title} description={description} />
        </div>

        {/* Sidebar - Price & Contact */}
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

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{t('maxGuests')}: {listing.guests_max}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BedDouble className="w-4 h-4" />
                <span>{listing.bedrooms} {tCommon('bedrooms')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bath className="w-4 h-4" />
                <span>{listing.bathrooms} {tCommon('bathrooms')}</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
              <Phone className="w-4 h-4" />
              {tCommon('contactOwner')}
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Related content - keeps user on site */}
      <RelatedContent area={listing.area} currentSlug={listing.slug} />
    </div>
  );
}
