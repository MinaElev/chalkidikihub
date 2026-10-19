import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FavoriteButton, type FavoriteType } from '@/components/v3/FavoriteButton';

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
  /** Price pill on the photo, top right (v3 stay cards); the rating then moves top left. */
  price?: string;
  /** Shows v3's heart so signed-in visitors can save the item to /favorites. */
  favorite?: { type: FavoriteType; slug: string };
  priority?: boolean;
  sizes?: string;
};

/** The one card used across beaches, villages, restaurants, stays and articles. */
export function Card({
  href, title, image, imageAlt, eyebrow, meta, rating, reviews, ratingSource, badges, distance, highlight, price, favorite, priority,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}: CardProps) {
  const hasRating = rating != null && rating > 0;
  const leftTaken = Boolean(highlight || distance);
  const ratingSlot = !price ? 'right' : leftTaken ? 'body' : 'left';
  const stars = hasRating ? (
    <>
      <Star className="size-3.5 fill-accent-400 text-accent-400" aria-hidden />
      {rating!.toFixed(1)}
      {reviews ? <span className="font-normal text-slate-500">({reviews}{ratingSource ? ` · ${ratingSource}` : ''})</span> : null}
    </>
  ) : null;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sea-100 to-sand-100" aria-hidden />
        )}
        {/* Top left: heart (v3), then a highlight or distance badge, then the rating if the price took the right. */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {favorite && <FavoriteButton itemType={favorite.type} itemSlug={favorite.slug} />}
          {highlight && <span className="rounded-full bg-accent-400 px-2.5 py-1 text-xs font-semibold text-amber-950 shadow-sm">{highlight}</span>}
          {distance && !highlight && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
              <MapPin className="size-3.5 text-sea-600" aria-hidden />
              {distance}
            </span>
          )}
          {hasRating && ratingSlot === 'left' && <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">{stars}</span>}
        </div>
        {price && (
          <span className="absolute right-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">{price}</span>
        )}
        {hasRating && ratingSlot === 'right' && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">{stars}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-base font-bold leading-snug text-gray-900">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none group-hover:text-sea-600">
            {title}
          </Link>
        </h3>
        {eyebrow && (
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {eyebrow}
          </p>
        )}
        {meta && <p className="line-clamp-2 text-sm text-gray-600">{meta}</p>}
        {hasRating && ratingSlot === 'body' && (
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
            <Star className="size-4 fill-accent-400 text-accent-400" aria-hidden />
            {rating!.toFixed(1)}
            {reviews ? <span className="font-normal text-slate-500">({reviews}{ratingSource ? ` · ${ratingSource}` : ''})</span> : null}
          </p>
        )}
        {badges?.length ? (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            {badges.slice(0, 3).map((b) => (
              <span key={b} className="rounded-md bg-sea-50 px-2 py-0.5 text-xs font-medium text-sea-700">
                {b}
              </span>
            ))}
          </div>
        ) : null}
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
