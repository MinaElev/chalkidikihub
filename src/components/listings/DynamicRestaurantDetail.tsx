'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Restaurant, Beach, Listing } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, MapPin, Star, Clock, Phone, Eye, Music, CalendarCheck, Tag, UtensilsCrossed } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateRestaurantLD } from '@/lib/seo';
import { RestaurantCard } from './RestaurantCard';
import { BeachCard } from './BeachCard';
import { ListingCard } from './ListingCard';
import { LocationMap } from '@/components/ui/LocationMap';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';

export function DynamicRestaurantDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('restaurants');
  const tCuisine = useTranslations('cuisineTypes');
  const tPrice = useTranslations('priceLevels');
  const tBeaches = useTranslations('beaches');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [nearbyBeaches, setNearbyBeaches] = useState<Beach[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/restaurants?slug=${slug}`).then((r) => r.json()),
      fetch('/api/restaurants').then((r) => r.json()),
      fetch('/api/beaches').then((r) => r.json()),
      fetch('/api/listings').then((r) => r.json()),
    ])
      .then(([restData, allData, beachesData, listingsData]) => {
        if (restData && restData.id) {
          setRestaurant(restData);
          if (Array.isArray(beachesData)) {
            setNearbyBeaches(beachesData.filter((b: Beach) => b.area === restData.area).slice(0, 3));
          }
          if (Array.isArray(listingsData)) {
            setNearbyListings(listingsData.filter((l: Listing) => l.area === restData.area).slice(0, 3));
          }
        }
        if (Array.isArray(allData)) setAllRestaurants(allData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (!restaurant) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-lg text-gray-500">Not found</p>
      <Link href="/restaurants" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link>
    </div>
  );

  const name = restaurant.name[locale] || restaurant.name.en;
  const description = restaurant.description[locale] || restaurant.description.en;

  // Sidebar: same cuisine first, then same area
  const sidebarRestaurants = allRestaurants
    .filter((r) => r.slug !== slug)
    .sort((a, b) => {
      const aSameCuisine = a.cuisine.some((c) => restaurant.cuisine.includes(c)) ? 2 : 0;
      const bSameCuisine = b.cuisine.some((c) => restaurant.cuisine.includes(c)) ? 2 : 0;
      const aSameArea = a.area === restaurant.area ? 1 : 0;
      const bSameArea = b.area === restaurant.area ? 1 : 0;
      return (bSameCuisine + bSameArea) - (aSameCuisine + aSameArea);
    })
    .slice(0, 3);

  // In-content CTA: restaurants same area
  const ctaRestaurants = allRestaurants
    .filter((r) => r.slug !== slug && r.area === restaurant.area)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);

  // Prev/Next by rating
  const sorted = allRestaurants.sort((a, b) => b.rating - a.rating);
  const currentIndex = sorted.findIndex((r) => r.slug === slug);
  const prevRestaurant = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  const nextRestaurant = currentIndex > 0 ? sorted[currentIndex - 1] : null;

  // Split description for in-article CTA
  const paragraphs = (description || '').split('\n').filter(Boolean);
  const insertAt = Math.min(Math.max(Math.floor(paragraphs.length * 0.4), 2), 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={generateRestaurantLD(restaurant as unknown as Record<string, unknown>, locale)} />
      <Link href="/restaurants" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('title')}
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Cuisine badges */}
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
            <Link href={`/areas/${restaurant.area}`} className="text-primary-600 hover:underline capitalize">{restaurant.area}</Link>
          </div>

          {/* Key stats */}
          <div className="flex items-center gap-6 mt-4 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-gray-900">{restaurant.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({restaurant.reviews_count})</span>
            </div>
            <div className="text-sm text-gray-600">{tPrice(restaurant.price_level)}</div>
            {restaurant.hours && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />{restaurant.hours}
              </div>
            )}
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 mt-4">
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

          {/* Image */}
          {restaurant.image_url && (
            <div className="aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mt-6">
              <img src={restaurant.image_url} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          {/* Description with in-article CTA */}
          <div className="mt-6 space-y-4">
            <AutoLinkedContent content={paragraphs.slice(0, insertAt).join('\n')} />

            {/* In-article CTA */}
            {ctaRestaurants.length > 0 && paragraphs.length > 3 && (
              <div className="my-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-bold text-red-800">Εστιατόρια στην ίδια περιοχή</h3>
                </div>
                <div className="space-y-2">
                  {ctaRestaurants.map((r) => (
                    <Link key={r.slug} href={`/restaurants/${r.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors group">
                      {r.image_url && <img src={r.image_url} alt={r.name[locale] || r.name.en} className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-700 truncate">
                          {r.name[locale] || r.name.en}
                        </p>
                        <p className="text-xs text-gray-500">
                          {r.cuisine.map((c) => tCuisine(c)).join(', ')} · {r.rating.toFixed(1)}★
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AutoLinkedContent content={paragraphs.slice(insertAt).join('\n')} />
          </div>

          {/* Tags */}
          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {restaurant.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Reviews */}
          {restaurant.reviews && restaurant.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rating')} ({restaurant.reviews_count})</h2>
              <div className="space-y-4">
                {restaurant.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{review.author_name}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment[locale] || review.comment.en}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {restaurant.latitude && restaurant.longitude && restaurant.latitude !== 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Τοποθεσία</h2>
              <LocationMap latitude={restaurant.latitude} longitude={restaurant.longitude} name={name} />
            </div>
          )}

          {/* Nearby beaches */}
          {nearbyBeaches.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Κοντινές παραλίες</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyBeaches.map((b) => <BeachCard key={b.id} beach={b} />)}
              </div>
            </div>
          )}

          {/* Nearby listings */}
          {nearbyListings.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Καταλύματα στην περιοχή</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyListings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}

          <ShareButtons title={name} description={description} />

          {/* Prev/Next navigation */}
          {(prevRestaurant || nextRestaurant) && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevRestaurant ? (
                  <Link href={`/restaurants/${prevRestaurant.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-red-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Προηγούμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2">
                        {prevRestaurant.name[locale] || prevRestaurant.name.en}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
                {nextRestaurant ? (
                  <Link href={`/restaurants/${nextRestaurant.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all text-right md:flex-row-reverse">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Επόμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2">
                        {nextRestaurant.name[locale] || nextRestaurant.name.en}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Quick info card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-bold">{restaurant.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({restaurant.reviews_count})</span>
              </div>
              <hr />
              <div>
                <div className="text-xs text-gray-500">{t('priceLevel')}</div>
                <div className="text-sm font-semibold">{tPrice(restaurant.price_level)}</div>
              </div>
              {restaurant.hours && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Ωράριο</div>
                    <div className="text-sm font-semibold">{restaurant.hours}</div>
                  </div>
                </div>
              )}
              {restaurant.phone && (
                <a href={`tel:${restaurant.phone}`}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-sm">
                  <Phone className="w-4 h-4" />{t('callNow')}
                </a>
              )}
            </div>

            {/* Related restaurants */}
            {sidebarRestaurants.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <UtensilsCrossed className="w-4 h-4 text-red-600" />
                  Δείτε επίσης
                </h3>
                <div className="space-y-3">
                  {sidebarRestaurants.map((r) => (
                    <Link key={r.slug} href={`/restaurants/${r.slug}`} className="block group">
                      {r.image_url && (
                        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-gray-100">
                          <img src={r.image_url} alt={r.name[locale] || r.name.en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mb-1">
                        {r.cuisine.slice(0, 2).map((c) => (
                          <span key={c} className="inline-flex px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-medium">{tCuisine(c)}</span>
                        ))}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                        {r.name[locale] || r.name.en}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{r.rating.toFixed(1)}★ · {tPrice(r.price_level)}</p>
                    </Link>
                  ))}
                </div>
                <Link href="/restaurants"
                  className="block text-center py-2.5 px-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors mt-4">
                  Όλα τα εστιατόρια →
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
