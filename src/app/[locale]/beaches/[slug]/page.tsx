import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { seedBeaches } from '@/lib/seed-beaches';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { MapPin, Star } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BeachFeatureBadge } from '@/components/listings/BeachFeatureBadge';
import { BeachReviews } from '@/components/listings/BeachReviews';
import { NearbyListings } from '@/components/listings/NearbyListings';
import { CrowdIndicator } from '@/components/listings/CrowdIndicator';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { getContentMeta } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return seedBeaches.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('beaches', slug, locale, 'Beach | Chalkidiki Hub', 'Discover beaches in Halkidiki');
}

export default async function BeachDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Always use DynamicBeachDetail to fetch live content from DB
  return <DynamicBeachDetail slug={slug} />;
}

function BeachDetail({
  locale,
  beach,
  areaName,
}: {
  locale: string;
  beach: (typeof seedBeaches)[number];
  areaName: string;
}) {
  const t = useTranslations('beaches');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  const name = beach.name[locale] || beach.name.en;
  const description = beach.description[locale] || beach.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: tNav('beaches'), href: '/beaches' }, { label: name }]} />

      {/* Hero image */}
      <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
        {beach.image_url ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${beach.image_url})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
            <span className="text-blue-300 text-8xl">~</span>
          </div>
        )}
        {/* Rating overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-lg font-bold text-gray-900">{beach.rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({beach.reviews_count})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & location */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <ShareButtons title={name} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{beach.location_name}</span>
              <span className="text-gray-300">|</span>
              <Link
                href={`/areas/${beach.area}`}
                className="text-primary-600 hover:underline"
              >
                {areaName}
              </Link>
            </div>
          </div>

          {/* Live crowd & weather */}
          <CrowdIndicator beachSlug={beach.slug} />

          {/* Description */}
          <div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
          </div>

          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('features')}</h2>
            <div className="flex flex-wrap gap-2">
              {beach.features.map((feature) => (
                <BeachFeatureBadge key={feature} feature={feature} />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('rating')} & {t('reviews')}
            </h2>
            <BeachReviews
              reviews={beach.reviews}
              rating={beach.rating}
              count={beach.reviews_count}
            />
          </div>

          <ShareButtons title={name} description={description} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Quick info card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span className="text-2xl font-bold">{beach.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">/ 5</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{beach.reviews_count} {t('reviews')}</p>

              <hr className="my-4" />

              <div className="space-y-2">
                {beach.features.slice(0, 5).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>{useTranslations('beachFeatures')(feature)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby listings */}
            {beach.nearby_listing_ids.length > 0 && (
              <NearbyListings listingIds={beach.nearby_listing_ids} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
