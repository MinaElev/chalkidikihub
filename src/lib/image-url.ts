/**
 * The URL next/image would request for a photo at a given width, for the few
 * places that draw a plain <img> (search thumbnails, the full-screen viewer).
 * Widths snap up to the sizes the optimizer accepts (Next's default
 * imageSizes + deviceSizes); quality must be one of next.config's qualities.
 */
const WIDTHS = [32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

export function optimizedImage(src: string, width: number, quality = 65): string {
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;
}
