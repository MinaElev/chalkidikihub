'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  const defaultLat = latitude || 40.1;
  const defaultLng = longitude || 23.6;

  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      if (mapRef.current && !mapInstanceRef.current) {
        const map = L.map(mapRef.current).setView([defaultLat, defaultLng], latitude ? 15 : 10);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        // Custom icon
        const icon = L.divIcon({
          html: `<div style="background:#0284c7;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:grab">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        // Add draggable marker
        const marker = L.marker([defaultLat, defaultLng], { icon, draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onLocationChange(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
        });

        // Click on map to move marker
        map.on('click', (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          onLocationChange(parseFloat(e.latlng.lat.toFixed(6)), parseFloat(e.latlng.lng.toFixed(6)));
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when lat/lng props change externally
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current?.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude]);

  async function handleSearch() {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search + ' Halkidiki Greece')}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onLocationChange(lat, lng);
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        if (mapInstanceRef.current) mapInstanceRef.current.setView([lat, lng], 15);
      }
    } catch {}
    setSearching(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Τοποθεσία στον χάρτη</label>

      {/* Search */}
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            placeholder="Αναζήτηση τοποθεσίας (π.χ. Χανιώτη, Σάρτη...)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button type="button" onClick={handleSearch} disabled={searching}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        style={{ height: '250px', width: '100%' }}
        className="rounded-xl overflow-hidden border border-gray-200 z-0"
      />

      <p className="text-xs text-gray-400 mt-1">Κλικ στον χάρτη ή σύρετε το pin για ακριβή τοποθεσία</p>
    </div>
  );
}
