import { Navigation } from 'lucide-react';
import { mapsDirectionsUrl } from '@/lib/geo';
import { ShareButtons } from '@/components/v3/ShareButtons';

const PILL = 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition';

/**
 * What a visitor on the spot wants first, right under the title: directions,
 * share with the group, and (beaches) today's water temperature. On a phone the
 * map and the facts box only come after the whole text.
 */
export function QuickActions({ lat, lng, directionsLabel, shareTitle, label, children }: {
  lat?: number | null;
  lng?: number | null;
  directionsLabel: string;
  shareTitle: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div role="group" aria-label={label} className="mt-4 flex flex-wrap items-center gap-2">
      {lat != null && lng != null && (
        <a
          href={mapsDirectionsUrl({ latitude: lat, longitude: lng })}
          target="_blank"
          rel="noopener nofollow"
          className={`${PILL} bg-sea-600 text-white hover:bg-sea-700`}
        >
          <Navigation className="size-4" aria-hidden />
          {directionsLabel}
        </a>
      )}
      <ShareButtons compact title={shareTitle} buttonClassName={`${PILL} bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50`} />
      {children}
    </div>
  );
}
