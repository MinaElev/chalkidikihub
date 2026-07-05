'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Beach, Restaurant, Listing } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, MapPin, Star, Waves } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { generateBeachFaqs } from '@/lib/faq-generators';
import { FaqSection } from '@/components/ui/FaqSection';
import { BeachFeatureBadge } from './BeachFeatureBadge';
import { BeachQuickFacts } from './BeachQuickFacts';
import { BeachReviews } from './BeachReviews';
import { CrowdIndicator } from './CrowdIndicator';
import { SeaTemperatureCard } from './SeaTemperatureCard';
import { BeachCard } from './BeachCard';
import { RestaurantCard } from './RestaurantCard';
import { ListingCard } from './ListingCard';
import { LocationMap } from '@/components/ui/LocationMap';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';
import { addRecentlyViewed } from '@/lib/use-recently-viewed';
import { RecentlyViewed } from '@/components/ui/RecentlyViewed';
import { ReviewForm } from '@/components/ui/ReviewForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Image from 'next/image';

export function DynamicBeachDetail({ slug, initialData }: { slug: string; initialData?: Beach | null }) {
  const locale = useLocale();
  const t = useTranslations('beaches');
  const tDetail = useTranslations('detail');
  const [beach, setBeach] = useState<Beach | null>(initialData || null);
  const [allBeaches, setAllBeaches] = useState<Beach[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    const fetchData = (beachData: Beach) => {
      return fetch(`/api/related-content?type=beach&area=${encodeURIComponent(beachData.area)}&slug=${encodeURIComponent(beachData.slug)}`)
        .then((r) => r.json())
        .then(({ beaches, restaurants, listings }) => {
          if (Array.isArray(beaches)) setAllBeaches(beaches);
          if (Array.isArray(restaurants)) {
            setNearbyRestaurants(restaurants.filter((r: Restaurant) => r.area === beachData.area).slice(0, 3));
          }
          if (Array.isArray(listings)) {
            setNearbyListings(listings.filter((l: Listing) => l.area === beachData.area).slice(0, 3));
          }
        });
    };

    if (initialData) {
      // Already have primary data from server, just fetch related items
      fetchData(initialData).catch(() => {});
    } else {
      // Fallback: fetch everything client-side
      fetch(`/api/beaches?slug=${slug}`)
        .then((r) => r.json())
        .then((beachData) => {
          if (beachData && beachData.id) {
            setBeach(beachData);
            return fetchData(beachData);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug, initialData]);

  useEffect(() => {
    if (beach) {
      addRecentlyViewed({
        type: 'beach',
        slug: beach.slug,
        title: beach.name[locale] || beach.name.en,
        image: beach.image_url,
      });
    }
  }, [beach, locale]);

  if (loading) return <DetailSkeleton />;
  if (!beach) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-lg text-gray-500">{tDetail('notFound')}</p>
      <Link href="/beaches" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link>
    </div>
  );

  const name = beach.name[locale] || beach.name.en;
  const description = beach.description[locale] || beach.description.en;

  // Sidebar: same area first, then by rating
  const sidebarBeaches = allBeaches
    .filter((b) => b.slug !== slug)
    .sort((a, b) => {
      const aSameArea = a.area === beach.area ? 1 : 0;
      const bSameArea = b.area === beach.area ? 1 : 0;
      if (aSameArea !== bSameArea) return bSameArea - aSameArea;
      return b.rating - a.rating;
    })
    .slice(0, 3);

  // In-content CTA: beaches same area
  const ctaBeaches = allBeaches
    .filter((b) => b.slug !== slug && b.area === beach.area)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);

  // Prev/Next by rating
  const sorted = allBeaches.sort((a, b) => b.rating - a.rating);
  const currentIndex = sorted.findIndex((b) => b.slug === slug);
  const prevBeach = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  const nextBeach = currentIndex > 0 ? sorted[currentIndex - 1] : null;

  // Split description for in-article CTA
  const paragraphs = (description || '').split('\n').filter(Boolean);
  const insertAt = Math.min(Math.max(Math.floor(paragraphs.length * 0.4), 2), 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Beach JSON-LD is emitted in the parent route (beaches/[slug]/page.tsx).
          Re-emitting it here used to produce duplicate schemas in HTML. */}
      <Breadcrumbs items={[
        { label: t('title') || 'Beaches', href: '/beaches' },
        { label: name }
      ]} />

      {/* Hero image */}
      {beach.image_url && (
        <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
          <Image src={beach.image_url} alt={name} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-lg font-bold text-gray-900">{beach.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({beach.reviews_count})</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <ShareButtons title={name} compact />
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <MapPin className="w-4 h-4" /><span>{beach.location_name}</span>
            <span className="text-gray-300">|</span>
            <Link href={`/areas/${beach.area}`} className="text-primary-600 hover:underline capitalize">{beach.area}</Link>
          </div>

          {/* Live crowd & weather */}
          <div className="mt-6">
            <CrowdIndicator beachSlug={beach.slug} />
          </div>

          {/* Live sea temperature (Open-Meteo Marine) */}
          {beach.latitude != null && beach.longitude != null && beach.latitude !== 0 && (
            <SeaTemperatureCard lat={beach.latitude} lon={beach.longitude} />
          )}

          {/* Scannable facts box — featured-snippet & LLM friendly */}
          <BeachQuickFacts beach={beach} />

          {/* Description with in-article CTA */}
          <div className="mt-6 space-y-4">
            <AutoLinkedContent content={paragraphs.slice(0, insertAt).join('\n')} />

            {/* In-article CTA */}
            {ctaBeaches.length > 0 && paragraphs.length > 3 && (
              <div className="my-6 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Waves className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-sm font-bold text-cyan-800">{tDetail('nearbyBeaches')}</h3>
                </div>
                <div className="space-y-2">
                  {ctaBeaches.map((b) => (
                    <Link key={b.slug} href={`/beaches/${b.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors group">
                      {b.image_url && <Image src={b.image_url} alt={b.name[locale] || b.name.en} width={56} height={56} className="rounded-lg object-cover shrink-0" sizes="56px" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 truncate">
                          {b.name[locale] || b.name.en}
                        </p>
                        <p className="text-xs text-gray-500">{b.location_name} · {b.rating.toFixed(1)}★</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AutoLinkedContent content={paragraphs.slice(insertAt).join('\n')} />
          </div>

          {/* Features */}
          {beach.features.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('features')}</h2>
              <div className="flex flex-wrap gap-2">
                {beach.features.map((f) => <BeachFeatureBadge key={f} feature={f} />)}
              </div>
            </div>
          )}

          {/* Reviews */}
          {beach.reviews && beach.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rating')} & {t('reviews')}</h2>
              <BeachReviews reviews={beach.reviews} rating={beach.rating} count={beach.reviews_count} />
            </div>
          )}

          <ReviewForm type="beach" itemId={beach.id} itemName={name} />

          {/* Map */}
          {beach.latitude && beach.longitude && beach.latitude !== 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{tDetail('location')}</h2>
              <LocationMap latitude={beach.latitude} longitude={beach.longitude} name={name} />
            </div>
          )}

          {/* Nearby restaurants */}
          {nearbyRestaurants.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{tDetail('nearbyRestaurants')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          )}

          {/* Nearby listings */}
          {nearbyListings.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{tDetail('nearbyListings')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyListings.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}

          <ShareButtons title={name} description={description} />

          {/* Prev/Next navigation */}
          {(prevBeach || nextBeach) && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevBeach ? (
                  <Link href={`/beaches/${prevBeach.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{tDetail('previous')}</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 line-clamp-2">
                        {prevBeach.name[locale] || prevBeach.name.en}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
                {nextBeach ? (
                  <Link href={`/beaches/${nextBeach.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all text-right md:flex-row-reverse">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{tDetail('next')}</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 line-clamp-2">
                        {nextBeach.name[locale] || nextBeach.name.en}
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
                <span className="text-xl font-bold">{beach.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({beach.reviews_count})</span>
              </div>
              <hr />
              <div className="space-y-2">
                {beach.features.slice(0, 5).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <BeachFeatureBadge feature={f} />
                  </div>
                ))}
              </div>
            </div>

            {/* Related beaches */}
            {sidebarBeaches.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <Waves className="w-4 h-4 text-cyan-600" />
                  {tDetail('seeAlso')}
                </h3>
                <div className="space-y-3">
                  {sidebarBeaches.map((b) => (
                    <Link key={b.slug} href={`/beaches/${b.slug}`} className="block group">
                      {b.image_url && (
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-gray-100">
                          <Image src={b.image_url} alt={b.name[locale] || b.name.en} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                      )}
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors line-clamp-2 leading-snug">
                        {b.name[locale] || b.name.en}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{b.location_name} · {b.rating.toFixed(1)}★</p>
                    </Link>
                  ))}
                </div>
                <Link href="/beaches"
                  className="block text-center py-2.5 px-4 bg-cyan-50 text-cyan-700 rounded-xl text-sm font-medium hover:bg-cyan-100 transition-colors mt-4">
                  {tDetail('allBeaches')}
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>

      <FaqSection faqs={generateBeachFaqs(beach as unknown as Record<string, unknown>, locale)} />

      <RecentlyViewed currentSlug={slug} />
    </div>
  );
}
