import { Navigation } from 'lucide-react';
import { mapsDirectionsUrl } from '@/lib/geo';
import { LazyIframe } from './LazyIframe';

/**
 * OpenStreetMap embed, created only when scrolled into view; no map library in the bundle. Interactive
 * maps with many markers live on /map only.
 */
export function MapEmbed({
  lat, lng, title, directionsLabel,
}: {
  lat: number;
  lng: number;
  title: string;
  directionsLabel: string;
}) {
  const d = 0.018;
  const bbox = [lng - d, lat - d * 0.7, lng + d, lat + d * 0.7].map((n) => n.toFixed(5)).join('%2C');
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200">
      <LazyIframe
        title={title}
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
        className="aspect-[4/3] w-full bg-slate-100"
      />
      <figcaption className="flex justify-end bg-white px-4 py-3">
        <a
          href={mapsDirectionsUrl({ latitude: lat, longitude: lng })}
          target="_blank"
          rel="noopener nofollow"
          className="inline-flex items-center gap-1.5 rounded-lg bg-sea-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sea-700"
        >
          <Navigation className="size-4" aria-hidden />
          {directionsLabel}
        </a>
      </figcaption>
    </figure>
  );
}
