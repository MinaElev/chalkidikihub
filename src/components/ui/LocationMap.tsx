'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  name?: string;
  height?: string;
}

export function LocationMap({ latitude, longitude, name, height = '300px' }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      // Check if map already initialized
      if (mapRef.current && !(mapRef.current as HTMLElement & { _leaflet_id?: number })._leaflet_id) {
        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Custom marker
        const icon = L.divIcon({
          html: `<div style="background:#0284c7;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        L.marker([latitude, longitude], { icon }).addTo(map)
          .bindPopup(name || 'Location');

        setLoaded(true);
      }
    });
  }, [latitude, longitude, name]);

  if (!latitude || !longitude) return null;

  return (
    <div>
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="rounded-xl overflow-hidden border border-gray-200 z-0"
      />
      {!loaded && (
        <div style={{ height }} className="rounded-xl bg-gray-100 flex items-center justify-center -mt-[300px]">
          <MapPin className="w-8 h-8 text-gray-300 animate-pulse" />
        </div>
      )}
      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-2 text-sm text-primary-600 hover:underline"
      >
        <MapPin className="w-3.5 h-3.5" />
        Οδηγίες στο Google Maps
      </a>
    </div>
  );
}
