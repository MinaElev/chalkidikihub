/**
 * English Facebook-post caption builder for a listing.
 *
 * Kept in lib (not inline in the route) so the copy/template lives in the repo
 * and stays testable. The /api/marketing/next-listing route is the only caller
 * today; make.com just consumes the finished `caption` string.
 */
import type { Listing } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

const AREA_LABEL: Record<string, string> = {
  kassandra: 'Kassandra',
  sithonia: 'Sithonia',
  athos: 'Athos',
  mainland: 'Halkidiki',
};

// amenity slug -> "emoji Label", in display priority order.
const AMENITY_LABELS: Array<[string, string]> = [
  ['seaView', '🌊 Sea view'],
  ['pool', '🏊 Pool'],
  ['airConditioning', '❄️ A/C'],
  ['wifi', '📶 Wi-Fi'],
  ['parking', '🅿️ Parking'],
  ['kitchen', '🍳 Kitchen'],
  ['balcony', '🌅 Balcony'],
  ['garden', '🌿 Garden'],
  ['bbq', '🍖 BBQ'],
  ['washingMachine', '🧺 Washer'],
  ['tv', '📺 TV'],
  ['petsAllowed', '🐾 Pet-friendly'],
];

/** Strip markdown/html to plain text and trim to a sentence-ish excerpt. */
function excerpt(raw: string, maxLen = 220): string {
  const text = (raw || '')
    .replace(/<[^>]+>/g, ' ') // html tags
    .replace(/[#*_>`~]/g, '') // markdown syntax
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // md links -> label
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (lastStop > maxLen * 0.5) return cut.slice(0, lastStop + 1).trim();
  return cut.slice(0, cut.lastIndexOf(' ')).trim() + '…';
}

function areaLabel(area: string): string {
  return AREA_LABEL[area] || 'Halkidiki';
}

/** "nea moudania" -> "Nea Moudania". Leaves already-cased names intact. */
function titleCase(s: string): string {
  return (s || '')
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Pick the cover image (or first) URL. */
export function coverImageUrl(listing: Listing): string {
  const imgs = listing.images || [];
  if (!imgs.length) return '';
  const cover = imgs.find((i) => i.is_cover) || [...imgs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];
  return (cover?.image_url as string) || '';
}

export function listingUrl(slug: string): string {
  // English locale prefix -> English landing page for an English post.
  return `${SITE_URL}/en/listings/${slug}`;
}

export interface ListingCaption {
  slug: string;
  title: string;
  area: string;
  location: string;
  url: string;
  image_url: string;
  images: string[];
  price_per_night: number | null;
  guests_max: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  hashtags: string[];
  caption: string;
}

/** Build the full English caption + structured fields for a listing. */
export function buildListingCaption(listing: Listing): ListingCaption {
  // `tagline` is populated by transformListing() but isn't on the Listing type.
  const tagline = (listing as Listing & { tagline?: Record<string, string> }).tagline;
  const title = (listing.title?.en || listing.title?.el || 'Holiday home').trim();
  const area = areaLabel(listing.area as string);
  const location = titleCase(listing.location_name || area);
  const url = listingUrl(listing.slug as string);
  const img = coverImageUrl(listing);
  const allImages = (listing.images || [])
    .slice()
    .sort((a, b) => (Number(b.is_cover) - Number(a.is_cover)) || ((a.sort_order ?? 0) - (b.sort_order ?? 0)))
    .map((i) => i.image_url as string)
    .filter(Boolean);

  const desc = excerpt(tagline?.en || listing.description?.en || listing.description?.el || '');

  const amenitySet = new Set((listing.amenities as string[]) || []);
  const amenityLine = AMENITY_LABELS
    .filter(([slug]) => amenitySet.has(slug))
    .slice(0, 5)
    .map(([, label]) => label)
    .join('  ·  ');

  // Stats line — only include the parts we actually have.
  const statBits: string[] = [];
  if (listing.bedrooms) statBits.push(`🛏 ${listing.bedrooms} ${listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`);
  if (listing.guests_max) statBits.push(`👥 Sleeps ${listing.guests_max}`);
  if (listing.bathrooms) statBits.push(`🛁 ${listing.bathrooms} ${listing.bathrooms === 1 ? 'bath' : 'baths'}`);
  const statsLine = statBits.join('  ·  ');

  const price = Number(listing.price_per_night);
  const priceLine = price > 0 ? `💶 From €${Math.round(price)} / night` : '';

  const hashtags = Array.from(
    new Set([
      '#Halkidiki',
      '#Chalkidiki',
      `#${area.replace(/\s+/g, '')}`,
      '#Greece',
      '#GreeceTravel',
      '#VisitGreece',
      '#Halkidiki2026',
      '#SummerInGreece',
    ]),
  );

  const lines = [
    `🏡 ${title} — ${location}, ${area}`,
    '',
    desc,
    '',
    statsLine,
    amenityLine,
    priceLine,
    '',
    '📍 Halkidiki, Greece',
    `🔗 Photos & booking: ${url}`,
    '',
    hashtags.join(' '),
  ].filter((l) => l !== undefined && l !== null);

  // collapse >1 consecutive blank line
  const caption = lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return {
    slug: listing.slug as string,
    title,
    area,
    location,
    url,
    image_url: img,
    images: allImages,
    price_per_night: price > 0 ? Math.round(price) : null,
    guests_max: (listing.guests_max as number) || null,
    bedrooms: (listing.bedrooms as number) || null,
    bathrooms: (listing.bathrooms as number) || null,
    hashtags,
    caption,
  };
}
