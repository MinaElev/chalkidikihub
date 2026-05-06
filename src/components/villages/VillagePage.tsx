import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, Landmark, Home, Building, ChevronRight, Users } from 'lucide-react';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { ListingCard } from '@/components/listings/ListingCard';
import { SaleCard } from '@/components/sales/SaleCard';
import { WeatherBadge } from '@/components/ui/WeatherBadge';
import { AREAS } from '@/lib/constants';
import { AutoLinkedHtml } from '@/components/blog/AutoLinkedHtml';
import { VillagePriceBenchmark } from './VillagePriceBenchmark';
import { VillageCuisineRatio } from './VillageCuisineRatio';
import type { PriceStats, CuisineStats } from '@/lib/place-stats';
import type { Beach, Restaurant, Activity, Listing, Sale } from '@/types';

// Sanitize HTML — only allow safe tags for formatted descriptions
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

export interface Village {
  id: string;
  slug: string;
  area: string;
  name: Record<string, string>;
  description: Record<string, string>;
  latitude: number;
  longitude: number;
  image_url: string;
  image_alt: string;
  population: number;
}

export interface VillagePageProps {
  locale: string;
  village: Village;
  beaches: Beach[];
  restaurants: Restaurant[];
  activities: Activity[];
  listings: Listing[];
  sales: Sale[];
  priceStats?: PriceStats;
  cuisineStats?: CuisineStats;
}

export function VillagePage({ locale, village, beaches, restaurants, activities, listings, sales, priceStats, cuisineStats }: VillagePageProps) {
  const name = village.name[locale] || village.name.el || village.name.en;
  const description = village.description[locale] || village.description.el || village.description.en || '';
  const areaInfo = AREAS.find(a => a.slug === village.area);
  const areaName = areaInfo?.name[locale] || areaInfo?.name.el || village.area;

  const sections = [
    { key: 'beaches', icon: Waves, title: locale === 'el' ? 'Παραλίες' : 'Beaches', items: beaches, color: 'text-cyan-600 bg-cyan-50', href: `/beaches?area=${village.area}` },
    { key: 'restaurants', icon: UtensilsCrossed, title: locale === 'el' ? 'Φαγητό & Ποτό' : 'Food & Drink', items: restaurants, color: 'text-red-600 bg-red-50', href: `/restaurants?area=${village.area}` },
    { key: 'activities', icon: Landmark, title: locale === 'el' ? 'Δραστηριότητες' : 'Activities', items: activities, color: 'text-amber-600 bg-amber-50', href: `/activities?area=${village.area}` },
    { key: 'listings', icon: Home, title: locale === 'el' ? 'Καταλύματα' : 'Accommodations', items: listings, color: 'text-primary-600 bg-primary-50', href: `/listings?area=${village.area}` },
    { key: 'sales', icon: Building, title: locale === 'el' ? 'Πωλήσεις Ακινήτων' : 'Real Estate', items: sales, color: 'text-emerald-600 bg-emerald-50', href: `/sales?area=${village.area}` },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-gray-900 text-white">
        {village.image_url && (
          <Image src={village.image_url} alt={village.image_alt || name} fill priority
            sizes="100vw"
            className="object-cover opacity-40" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/areas/${village.area}`} className="hover:text-white">{areaName}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-600 rounded-full text-sm font-medium">{areaName}</span>
            {village.population && (
              <span className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                <Users className="w-3.5 h-3.5" /> {village.population.toLocaleString()}
              </span>
            )}
            {village.latitude && village.longitude && (
              <WeatherBadge latitude={village.latitude} longitude={village.longitude} variant="hero" />
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{name}</h1>
          {description && !description.includes('<') && <p className="text-lg text-white/80 max-w-3xl">{description}</p>}
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Description */}
        {description && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {description.includes('<') ? (
              <AutoLinkedHtml
                html={sanitizeHtml(description)}
                className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-2"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{description}</p>
            )}
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {sections.map(s => (
            <div key={s.key} className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 ${s.color}`}>
              <s.icon className="w-5 h-5" />
              <div>
                <div className="text-lg font-bold text-gray-900">{s.items.length}</div>
                <div className="text-xs text-gray-500">{s.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Data-driven insights — unique facts per village (sea price + cuisine mix) */}
        {(priceStats || cuisineStats) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {priceStats && <VillagePriceBenchmark stats={priceStats} villageName={name} locale={locale} />}
            {cuisineStats && <VillageCuisineRatio stats={cuisineStats} locale={locale} />}
          </div>
        )}

        {/* Map */}
        {village.latitude && village.longitude && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${village.longitude - 0.03},${village.latitude - 0.02},${village.longitude + 0.03},${village.latitude + 0.02}&layer=mapnik&marker=${village.latitude},${village.longitude}`}
              className="w-full h-64 border-0"
              loading="lazy"
            />
          </div>
        )}

        {/* Content grids */}
        {sections.map(s => {
          if (s.items.length === 0) return null;
          return (
            <section key={s.key}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <s.icon className="w-5 h-5" />
                  {s.title} {locale === 'el' ? 'κοντά στο' : 'near'} {name}
                </h2>
                <Link href={s.href} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                  {locale === 'el' ? 'Δες όλα' : 'View all'} <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {s.items.slice(0, 6).map((item) => {
                  if (s.key === 'beaches') return <BeachCard key={item.id || item.slug} beach={item as Beach} />;
                  if (s.key === 'restaurants') return <RestaurantCard key={item.id || item.slug} restaurant={item as Restaurant} />;
                  if (s.key === 'activities') return <ActivityCard key={item.id || item.slug} activity={item as Activity} />;
                  if (s.key === 'listings') return <ListingCard key={item.id || item.slug} listing={item as Listing} />;
                  if (s.key === 'sales') return <SaleCard key={item.id || item.slug} sale={item as Sale} />;
                  return null;
                })}
              </div>
            </section>
          );
        })}

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: name,
          description: description.includes('<') ? description.replace(/<[^>]*>/g, '') : description,
          address: {
            '@type': 'PostalAddress',
            addressLocality: village.name.en || village.name.el,
            addressRegion: 'Halkidiki',
            addressCountry: 'GR',
          },
          ...(village.latitude && village.longitude ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: village.latitude,
              longitude: village.longitude,
            },
          } : {}),
          ...(village.image_url ? { image: village.image_url } : {}),
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: `${areaName}, Halkidiki, Greece`,
          },
        })}} />
      </div>
    </div>
  );
}
