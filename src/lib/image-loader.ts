'use client';

/**
 * Custom next/image loader — replaces Vercel's optimizer.
 *
 * Why not the built-in one: the Hobby plan caps image optimizations per month,
 * and once the cap is hit /_next/image returns HTTP 402 and every image on the
 * site breaks. That is why `unoptimized: true` was set. The cost of that was
 * that phones downloaded the full-size original of every photo — a listing
 * gallery ran ~1.5-2MB of 1600x1200 WebP on a 375px screen.
 *
 * Supabase Storage can resize on delivery, so this loader points the same
 * objects at the render endpoint with a width. Next then emits a real srcset
 * and the browser picks a size that fits the slot. No /_next/image request is
 * ever made, so the optimizer quota stays untouched.
 *
 * Everything that is not a Supabase storage object passes through unchanged:
 * Unsplash URLs get their own `w` parameter, local /images/* files are already
 * shipped in art-directed sizes.
 */

const OBJECT_PATH = '/storage/v1/object/public/';
const RENDER_PATH = '/storage/v1/render/image/public/';

// Supabase bills transformations per origin image, so keep the ladder short:
// fewer distinct widths per photo means fewer billable variants.
const DEFAULT_QUALITY = 65;

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const q = quality ?? DEFAULT_QUALITY;

  if (src.includes(OBJECT_PATH)) {
    // `resize=contain` is not optional. Given a width alone, Supabase keeps the
    // ORIGINAL height — a 1600x1200 photo asked for width=750 comes back
    // 750x1200, i.e. squeezed. With contain it derives the height from the
    // aspect ratio and returns 750x563.
    return `${src.replace(OBJECT_PATH, RENDER_PATH)}?width=${width}&resize=contain&quality=${q}`;
  }

  // Unsplash serves its own resizing parameters.
  if (src.includes('images.unsplash.com')) {
    const sep = src.includes('?') ? '&' : '?';
    return `${src}${sep}w=${width}&q=${q}&auto=format`;
  }

  // Local files and anything else: unchanged. Next still builds a srcset, but
  // every candidate resolves to the same URL, so the browser fetches it once.
  return src;
}
