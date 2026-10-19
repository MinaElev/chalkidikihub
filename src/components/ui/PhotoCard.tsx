import Image from 'next/image';
import { Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export type PhotoCardProps = {
  href: string;
  title: string;
  image?: string | null;
  imageAlt?: string | null;
  eyebrow?: string;
  /** Bottom line under the title, e.g. a price. */
  meta?: string;
  rating?: number | null;
  reviews?: number | null;
  ratingSource?: string | null;
  /** Corner chip, e.g. "Blue Flag". */
  chip?: string;
  sizes?: string;
  className?: string;
};

/**
 * Full-bleed photo card with the text over the picture. Used in the horizontal
 * rails, where a big image does the selling and the card is a single link.
 */
export function PhotoCard({
  href, title, image, imageAlt, eyebrow, meta, rating, reviews, ratingSource, chip,
  sizes = '(min-width: 1024px) 22rem, 78vw', className = '',
}: PhotoCardProps) {
  return (
    <article className={`group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-sea-900 text-white shadow-lg shadow-gray-900/10 ${className}`}>
      {image ? (
        <Image src={image} alt={imageAlt || title} fill sizes={sizes} className="-z-10 object-cover transition duration-700 ease-out group-hover:scale-110" />
      ) : (
        <span className="absolute inset-0 -z-10 bg-gradient-to-br from-sea-600 to-sea-900" aria-hidden />
      )}
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/0" aria-hidden />
      {chip && (
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-sea-900 backdrop-blur">{chip}</span>
      )}
      {rating != null && rating > 0 && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="size-3.5 fill-accent-400 text-accent-400" aria-hidden />
          {rating.toFixed(1)}
          {reviews ? <span className="font-normal text-white/75">({reviews}{ratingSource ? ` · ${ratingSource}` : ''})</span> : null}
        </span>
      )}
      <div className="p-5 transition duration-500 group-hover:-translate-y-1">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{eyebrow}</p>}
        <h3 className="mt-1 text-lg font-bold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        {meta && <p className="mt-1.5 text-sm font-medium text-white/85">{meta}</p>}
      </div>
    </article>
  );
}
