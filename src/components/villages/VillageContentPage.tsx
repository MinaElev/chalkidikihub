import { Link } from '@/i18n/navigation';
import { Waves, UtensilsCrossed, Landmark, ChevronRight, MapPin } from 'lucide-react';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { formatKm } from '@/app/[locale]/places/[slug]/meta-helper';
import type { Beach, Restaurant, Activity } from '@/types';

interface VillageRef {
  slug: string;
  area: string;
  name: Record<string, string>;
}

const TYPE_CONFIG = {
  beaches: { icon: Waves, color: 'text-cyan-600 bg-cyan-100', labelEl: 'Παραλίες', labelEn: 'Beaches' },
  restaurants: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-100', labelEl: 'Εστιατόρια', labelEn: 'Restaurants' },
  activities: { icon: Landmark, color: 'text-amber-600 bg-amber-100', labelEl: 'Δραστηριότητες', labelEn: 'Activities' },
};

type ContentType = 'beaches' | 'restaurants' | 'activities';
type Item = Beach | Restaurant | Activity;

interface VillageContentPageProps {
  locale: string;
  village: VillageRef;
  contentType: ContentType;
  items: Item[];
  /** H1 text (unique per village, built server-side). Falls back to a label. */
  heading?: string;
  /** Unique, distance-aware intro paragraph. */
  intro?: string;
  /** slug → distance in km from the village, for the per-card badge. */
  distances?: Record<string, number>;
}

export function VillageContentPage({ locale, village, contentType, items, heading, intro, distances }: VillageContentPageProps) {
  const config = TYPE_CONFIG[contentType];
  const villageName = village.name[locale] || village.name.el || village.name.en;
  const label = locale === 'el' ? config.labelEl : config.labelEn;
  const Icon = config.icon;
  const h1 = heading || `${label} ${locale === 'el' ? 'κοντά στο' : 'near'} ${villageName}`;
  const awayWord = locale === 'el' ? 'από το' : locale === 'de' ? 'von' : 'from';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/places/${village.slug}`} className="hover:text-gray-700">{villageName}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{label}</span>
      </nav>

      {/* Single H1 for the page */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{h1}</h1>
      </div>

      {/* Unique, distance-aware intro */}
      {intro && <p className="text-gray-600 leading-relaxed max-w-3xl mb-8">{intro}</p>}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const km = distances?.[item.slug];
            const badge = typeof km === 'number' && km > 0 ? (
              <p className="flex items-center gap-1 text-xs font-medium text-primary-600 mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {formatKm(km, locale)} {awayWord} {villageName}
              </p>
            ) : null;
            return (
              <div key={item.id}>
                {badge}
                {contentType === 'beaches' && <BeachCard beach={item as Beach} />}
                {contentType === 'restaurants' && <RestaurantCard restaurant={item as Restaurant} />}
                {contentType === 'activities' && <ActivityCard activity={item as Activity} />}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          {locale === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found'}
        </div>
      )}

      {/* Back link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link href={`/places/${village.slug}`} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
          ← {locale === 'el' ? 'Πίσω στο' : 'Back to'} {villageName}
        </Link>
      </div>

      {/* JSON-LD — ItemList in real (nearest-first) order, with distance in the name. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${label} near ${villageName}, Halkidiki`,
        numberOfItems: items.length,
        itemListElement: items.slice(0, 12).map((item, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Thing', name: item.name?.[locale] || item.name?.el || '' },
        })),
      })}} />
    </div>
  );
}
