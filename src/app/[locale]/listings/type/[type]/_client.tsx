'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { Loader2, Home, ChevronRight } from 'lucide-react';

const TYPE_LABELS: Record<string, Record<string, string>> = {
  'with-pool': { el: 'Με Πισίνα', en: 'With Pool', de: 'Mit Pool', bg: 'С басейн', ru: 'С бассейном', ro: 'Cu piscină' },
  'sea-view': { el: 'Με Θέα Θάλασσα', en: 'Sea View', de: 'Mit Meerblick', bg: 'С морска гледка', ru: 'С видом на море', ro: 'Cu vedere la mare' },
  'pet-friendly': { el: 'Pet-Friendly', en: 'Pet-Friendly', de: 'Haustierfreundlich', bg: 'За домашни любимци', ru: 'Для питомцев', ro: 'Pet-friendly' },
  'family': { el: 'Οικογενειακά', en: 'Family', de: 'Familien', bg: 'Семейни', ru: 'Семейные', ro: 'Familii' },
  'budget': { el: 'Οικονομικά', en: 'Budget', de: 'Günstig', bg: 'Евтини', ru: 'Бюджетные', ro: 'Ieftine' },
  'luxury': { el: 'Πολυτελή', en: 'Luxury', de: 'Luxus', bg: 'Луксозни', ru: 'Люкс', ro: 'Lux' },
};

const AMENITY_FILTERS: Record<string, string> = {
  'with-pool': 'pool',
  'sea-view': 'sea_view',
  'pet-friendly': 'pets',
};

export default function ListingTypePageClient() {
  const { type } = useParams<{ type: string }>();
  const locale = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const label = TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) { setItems([]); return; }
        let filtered = data;
        const amenity = AMENITY_FILTERS[type];
        if (amenity) {
          filtered = data.filter((l: { amenities?: string[] }) => l.amenities?.includes(amenity));
        } else if (type === 'family') {
          filtered = data.filter((l: { bedrooms?: number; guests_max?: number }) => (l.bedrooms || 0) >= 2 || (l.guests_max || 0) >= 4);
        } else if (type === 'budget') {
          filtered = data.filter((l: { price_per_night?: number }) => (l.price_per_night || 999) <= 50);
        } else if (type === 'luxury') {
          filtered = data.filter((l: { price_per_night?: number }) => (l.price_per_night || 0) >= 100);
        }
        setItems(filtered);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{locale === 'el' ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/listings" className="hover:text-gray-700">{locale === 'el' ? 'Καταλύματα' : 'Listings'}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{label}</span>
      </nav>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{label} — {locale === 'el' ? 'Καταλύματα Χαλκιδικής' : 'Halkidiki Accommodation'}</h1>
      </div>
      <p className="text-gray-500 mb-8">{items.length} {locale === 'el' ? 'αποτελέσματα' : 'results'}</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => <ListingCard key={item.id} listing={item} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">{locale === 'el' ? 'Δεν βρέθηκαν καταλύματα' : 'No listings found'}</div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList', name: `${label} in Halkidiki`, numberOfItems: items.length,
      })}} />
    </div>
  );
}
