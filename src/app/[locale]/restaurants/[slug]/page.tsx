import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { seedRestaurants } from '@/lib/seed-restaurants';
import { seedBeaches } from '@/lib/seed-beaches';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Clock, Phone, Eye, Music, CalendarCheck, User, Tag } from 'lucide-react';
import { NearbyListings } from '@/components/listings/NearbyListings';
import { BeachCard } from '@/components/listings/BeachCard';
import { DynamicRestaurantDetail } from '@/components/listings/DynamicRestaurantDetail';
import { ShareButtons } from '@/components/ui/ShareButtons';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return seedRestaurants.map((r) => ({ slug: r.slug }));
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const restaurant = seedRestaurants.find((r) => r.slug === slug);
  if (!restaurant) return <DynamicRestaurantDetail slug={slug} />;
  const area = AREAS.find((a) => a.slug === restaurant.area);
  const nearbyBeaches = seedBeaches.filter((b) => restaurant.nearby_beach_ids.includes(b.id));
  return <RestaurantDetail locale={locale} restaurant={restaurant} areaName={area?.name[locale] || ''} nearbyBeaches={nearbyBeaches} />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function RestaurantDetail({ locale, restaurant, areaName, nearbyBeaches }: {
  locale: string; restaurant: (typeof seedRestaurants)[number]; areaName: string; nearbyBeaches: typeof seedBeaches;
}) {
  const t = useTranslations('restaurants');
  const tCuisine = useTranslations('cuisineTypes');
  const tPrice = useTranslations('priceLevels');
  const name = restaurant.name[locale] || restaurant.name.en;
  const description = restaurant.description[locale] || restaurant.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/restaurants" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('title')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.cuisine.map((c) => (
                <span key={c} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">{tCuisine(c)}</span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <ShareButtons title={name} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" /><span>{restaurant.location_name}</span>
              <span className="text-gray-300">|</span>
              <Link href={`/areas/${restaurant.area}`} className="text-primary-600 hover:underline">{areaName}</Link>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {restaurant.has_sea_view && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium">
                <Eye className="w-4 h-4" />{t('seaView')}
              </div>
            )}
            {restaurant.has_live_music && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium">
                <Music className="w-4 h-4" />{t('liveMusic')}
              </div>
            )}
            {restaurant.accepts_reservations && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                <CalendarCheck className="w-4 h-4" />{t('reservations')}
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rating')} ({restaurant.reviews_count} {t('reviews')})</h2>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold">{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="space-y-4">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium text-gray-900">{review.author_name}</span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment[locale] || review.comment.en}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString(locale)}</p>
                </div>
              ))}
            </div>
          </div>

          {nearbyBeaches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nearbyBeaches')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyBeaches.map((b) => (<BeachCard key={b.id} beach={b} />))}
              </div>
            </div>
          )}

          {restaurant.nearby_listing_ids.length > 0 && (
            <NearbyListings listingIds={restaurant.nearby_listing_ids} />
          )}

          <ShareButtons title={name} description={description} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xl font-bold">{restaurant.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({restaurant.reviews_count} {t('reviews')})</span>
            </div>
            <hr />
            <div>
              <div className="text-sm text-gray-500">{t('priceLevel')}</div>
              <div className="font-semibold text-gray-900">{tPrice(restaurant.price_level)}</div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">{t('hours')}</div>
                <div className="font-semibold text-gray-900">{restaurant.hours}</div>
              </div>
            </div>
            <hr />
            <a href={`tel:${restaurant.phone}`}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors">
              <Phone className="w-4 h-4" />{t('callNow')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
