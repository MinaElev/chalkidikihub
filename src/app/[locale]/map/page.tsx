'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home, Waves, UtensilsCrossed, Landmark, Zap, Loader2 } from 'lucide-react';

interface MapItem {
  type: 'listing' | 'beach' | 'restaurant' | 'activity' | 'charger';
  slug: string;
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
  href: string;
}

const typeConfig = {
  listing: { color: '#0284c7', emoji: '🏡', label: 'Καταλύματα' },
  beach: { color: '#06b6d4', emoji: '🏖️', label: 'Παραλίες' },
  restaurant: { color: '#dc2626', emoji: '🍽️', label: 'Εστιατόρια' },
  activity: { color: '#d97706', emoji: '🏛️', label: 'Αξιοθέατα' },
  charger: { color: '#16a34a', emoji: '⚡', label: 'Φορτιστές EV' },
};

export default function MapPage() {
  const locale = useLocale();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any>(null);
  const [items, setItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['listing', 'beach', 'restaurant', 'activity', 'charger']));
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

  // Fetch all data
  useEffect(() => {
    Promise.all([
      fetch('/api/listings').then(r => r.json()).catch(() => []),
      fetch('/api/beaches').then(r => r.json()).catch(() => []),
      fetch('/api/restaurants').then(r => r.json()).catch(() => []),
      fetch('/api/activities').then(r => r.json()).catch(() => []),
    ]).then(([listings, beaches, restaurants, activities]) => {
      const all: MapItem[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (listings as any[]).forEach((item: any) => {
        if (item.latitude && item.longitude && item.latitude !== 0) {
          all.push({ type: 'listing', slug: item.slug, name: item.title?.[locale] || item.title?.el || '', subtitle: item.location_name || '', lat: item.latitude, lng: item.longitude, href: `/listings/${item.slug}` });
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (beaches as any[]).forEach((item: any) => {
        if (item.latitude && item.longitude) {
          all.push({ type: 'beach', slug: item.slug, name: item.name?.[locale] || item.name?.el || '', subtitle: item.location_name || '', lat: item.latitude, lng: item.longitude, href: `/beaches/${item.slug}` });
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (restaurants as any[]).forEach((item: any) => {
        if (item.latitude && item.longitude) {
          all.push({ type: 'restaurant', slug: item.slug, name: item.name?.[locale] || item.name?.el || '', subtitle: item.location_name || '', lat: item.latitude, lng: item.longitude, href: `/restaurants/${item.slug}` });
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (activities as any[]).forEach((item: any) => {
        if (item.latitude && item.longitude) {
          all.push({ type: 'activity', slug: item.slug, name: item.name?.[locale] || item.name?.el || '', subtitle: item.location_name || '', lat: item.latitude, lng: item.longitude, href: `/activities/${item.slug}` });
        }
      });

      setItems(all);
      setLoading(false);
    });
  }, [locale]);

  // Initialize map
  useEffect(() => {
    if (loading || !mapRef.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      if (mapRef.current && !mapInstanceRef.current) {
        const map = L.map(mapRef.current).setView([40.15, 23.6], 10);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(map);

        updateMarkers(L, map);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  // Update markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      updateMarkers(L, mapInstanceRef.current);
    });
  }, [activeFilters, items]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateMarkers(L: any, map: any) {
    // Remove old markers layer
    if (markersRef.current) {
      map.removeLayer(markersRef.current);
    }

    const markerGroup = L.layerGroup();
    const filtered = items.filter(item => activeFilters.has(item.type));

    filtered.forEach((item) => {
      const conf = typeConfig[item.type];
      const icon = L.divIcon({
        html: `<div style="background:${conf.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:15px;cursor:pointer">${conf.emoji}</div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([item.lat, item.lng], { icon });
      marker.on('click', () => { setSelectedItem(item); });
      markerGroup.addLayer(marker);
    });

    markerGroup.addTo(map);
    markersRef.current = markerGroup;
  }

  function toggleFilter(type: string) {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  }

  const filterIcons: Record<string, typeof Home> = { listing: Home, beach: Waves, restaurant: UtensilsCrossed, activity: Landmark, charger: Zap };

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      {loading && (
        <div className="absolute inset-0 z-[900] bg-white/80 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Filter buttons */}
      <div className="absolute top-4 left-4 z-[800] flex flex-wrap gap-2">
        {Object.entries(typeConfig).map(([type, conf]) => {
          const Icon = filterIcons[type];
          const isActive = activeFilters.has(type);
          const count = items.filter(i => i.type === type).length;
          return (
            <button key={type} onClick={() => toggleFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all ${
                isActive ? 'bg-white text-gray-900 border-2' : 'bg-white/60 text-gray-400 border border-gray-200'
              }`}
              style={isActive ? { borderColor: conf.color } : {}}>
              <Icon className="w-3.5 h-3.5" style={isActive ? { color: conf.color } : {}} />
              {conf.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Selected item popup */}
      {selectedItem && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[800] w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
          <button onClick={() => setSelectedItem(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg">&times;</button>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{typeConfig[selectedItem.type].emoji}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: typeConfig[selectedItem.type].color + '20', color: typeConfig[selectedItem.type].color }}>
              {typeConfig[selectedItem.type].label}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{selectedItem.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{selectedItem.subtitle}</p>
          <Link href={selectedItem.href} onClick={() => setSelectedItem(null)}
            className="inline-flex px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
            Δες περισσότερα →
          </Link>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
