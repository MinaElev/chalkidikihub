'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Listing, Beach, Restaurant, Activity } from '@/types';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { LocationMap } from '@/components/ui/LocationMap';
import { MapPin, Waves, UtensilsCrossed, Landmark, Phone, Shield, Heart, Flame, Car, Loader2 } from 'lucide-react';
import { logEvent } from '@/lib/logger';

const EMERGENCY = [
  { label: 'Αστυνομία / Police', number: '100', icon: Shield, color: 'bg-blue-100 text-blue-700' },
  { label: 'Ασθενοφόρο / Ambulance', number: '166', icon: Heart, color: 'bg-red-100 text-red-700' },
  { label: 'Πυροσβεστική / Fire', number: '199', icon: Flame, color: 'bg-orange-100 text-orange-700' },
  { label: 'Ταξί Χαλκιδικής', number: '23710 23500', icon: Car, color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Tourist Police', number: '23710 23333', icon: Phone, color: 'bg-purple-100 text-purple-700' },
];

export default function GuestPage() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const tBeaches = useTranslations('beaches');
  const tRestaurants = useTranslations('restaurants');
  const tActivities = useTranslations('activities');

  const [listing, setListing] = useState<Listing | null>(null);
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const listingRes = await fetch(`/api/listings?slug=${slug}`).then(r => r.json()).catch(() => null);
      if (!listingRes || !listingRes.id) { setLoading(false); return; }
      setListing(listingRes);

      // Log guest view
      logEvent('system', 'info', 'Guest page viewed', { slug, area: listingRes.area });

      // Fetch nearby content by area
      const [b, r, a] = await Promise.all([
        fetch(`/api/beaches?area=${listingRes.area}`).then(r => r.json()).catch(() => []),
        fetch(`/api/restaurants?area=${listingRes.area}`).then(r => r.json()).catch(() => []),
        fetch(`/api/activities?area=${listingRes.area}`).then(r => r.json()).catch(() => []),
      ]);
      if (Array.isArray(b)) setBeaches(b.slice(0, 4));
      if (Array.isArray(r)) setRestaurants(r.slice(0, 4));
      if (Array.isArray(a)) setActivities(a.slice(0, 4));
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-4">Listing not found</p>
          <Link href="/" className="text-primary-600 hover:underline">ChalkidikiHub.gr</Link>
        </div>
      </div>
    );
  }

  const title = listing.title[locale] || listing.title.en || listing.title.el;
  const coverImage = listing.images?.find(i => i.is_cover)?.image_url || listing.images?.[0]?.image_url;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero */}
      <div className="relative bg-primary-900 text-white">
        {coverImage && (
          <div className="absolute inset-0">
            <img src={coverImage} alt={title} className="w-full h-full object-cover opacity-30" />
          </div>
        )}
        <div className="relative px-4 py-12 text-center max-w-lg mx-auto">
          <p className="text-primary-200 text-sm uppercase tracking-wider mb-2">Welcome to</p>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <div className="flex items-center justify-center gap-2 text-primary-200">
            <MapPin className="w-4 h-4" />
            <span>{listing.location_name} · {listing.area}</span>
          </div>
          <p className="mt-4 text-sm text-primary-100">
            Ο προσωπικός σας οδηγός για τη Χαλκιδική
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Beaches */}
        {beaches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg font-bold text-gray-900">{tBeaches('title')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {beaches.map(b => <BeachCard key={b.id} beach={b} />)}
            </div>
          </section>
        )}

        {/* Restaurants */}
        {restaurants.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-gray-900">{tRestaurants('title')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </section>
        )}

        {/* Activities */}
        {activities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-bold text-gray-900">{tActivities('title')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
            </div>
          </section>
        )}

        {/* Map */}
        {listing.latitude && listing.longitude && listing.latitude !== 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Χάρτης</h2>
            </div>
            <LocationMap latitude={listing.latitude} longitude={listing.longitude} name={title} />
          </section>
        )}

        {/* Emergency phones */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Χρήσιμα Τηλέφωνα</h2>
          </div>
          <div className="space-y-2">
            {EMERGENCY.map((e) => (
              <a key={e.number} href={`tel:${e.number.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${e.color}`}>
                  <e.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{e.label}</p>
                  <p className="text-xs text-gray-500">{e.number}</p>
                </div>
                <Phone className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-6 pb-8 border-t border-gray-200">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
            <span className="w-6 h-6 bg-primary-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">H</span>
            Powered by ChalkidikiHub
          </Link>
          <p className="text-xs text-gray-400 mt-2">chalkidikihub.gr</p>
        </div>
      </div>
    </div>
  );
}
