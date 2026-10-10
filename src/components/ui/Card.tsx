import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export type CardProps = {
  href: string;
  title: string;
  image?: string | null;
  imageAlt?: string | null;
  eyebrow?: string;
  meta?: string;
  rating?: number | null;
  reviews?: number | null;
  /** e.g. "Google" when the rating is not our own. */
  ratingSource?: string | null;
  badges?: string[];
  /** e.g. "2.4 km" — shown with a pin. */
  distance?: string;
  /** Corner badge, e.g. "Featured" for premium listings. */
  highlight?: string;
  priority?: boolean;
  sizes?: string;
};

/** The one card used across beaches, villages, restaurants, stays and articles. */
export function Card({
  href, title, image, imageAlt, eyebrow, meta, rating, reviews, ratingSource, badges, distance, highlight, priority,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}: CardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-sand-100">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sea-100 to-sand-100" aria-hidden />
        )}
        {highlight && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-amber-950 shadow-sm">{highlight}</span>
        )}
        {distance && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm">
            <MapPin className="size-3.5 text-sea-600" aria-hidden />
            {distance}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-sea-700">{eyebrow}</p>}
        <h3 className="text-base font-semibold leading-snug text-slate-900">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        {meta && <p className="line-clamp-2 text-sm text-slate-600">{meta}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {rating != null && rating > 0 && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-800">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
              {rating.toFixed(1)}
              {reviews ? <span className="font-normal text-slate-500">({reviews}{ratingSource ? ` · ${ratingSource}` : ""})</span> : null}
            </span>
          )}
          {badges?.slice(0, 3).map((b) => (
            <span key={b} className="rounded-full bg-sea-50 px-2 py-0.5 text-xs font-medium text-sea-800">
              {b}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function CardGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`grid gap-5 sm:grid-cols-2 ${cols === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'}`}
    >
      {children}
    </div>
  );
}
