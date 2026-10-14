import Image from 'next/image';

export type Photo = { url: string; alt: string };

/**
 * Photo gallery without JavaScript: a large cover plus a scroll-snap strip.
 * Only the cover is a priority (LCP) image; the rest lazy-load.
 */
export function Gallery({ photos, label }: { photos: Photo[]; label: string }) {
  if (!photos.length) return null;
  const [cover, ...rest] = photos;
  return (
    <section aria-label={label} className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-sand-100 sm:aspect-[21/9]">
        <Image src={cover.url} alt={cover.alt} fill priority fetchPriority="high" sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" />
      </div>
      {rest.length > 0 && (
        <ul className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {rest.map((p, i) => (
            <li key={p.url} className="relative aspect-[4/3] w-60 shrink-0 snap-start overflow-hidden rounded-2xl bg-sand-100 sm:w-72">
              <a href={p.url} target="_blank" rel="noopener" aria-label={`${label} ${i + 2}`}>
                <Image src={p.url} alt={p.alt} fill sizes="288px" className="object-cover" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
