/**
 * Markdown alternative endpoints for entity detail pages.
 *
 *   /api/md/listings/<slug>
 *   /api/md/beaches/<slug>
 *   /api/md/restaurants/<slug>
 *   /api/md/places/<slug>      ← villages
 *
 * Why: Perplexity, Claude tool-use, ChatGPT browse, and other AI agents
 * prefer clean markdown over HTML for ingestion. Returning a minimal,
 * structured .md document means a single fetch lands the full content
 * without the overhead of HTML/JS parsing — and gives us editorial
 * control over what the LLM "sees" vs. what users see.
 *
 * Cached aggressively (matches the underlying unstable_cache TTL on the
 * data layer, ~10h). Tagged invalidation propagates from admin edits.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getListingBySlug,
  getBeachBySlug,
  getRestaurantBySlug,
  getVillageBySlug,
} from '@/lib/data';
import { EXTERNAL_BOOKING_LINKS_ENABLED } from '@/lib/feature-flags';

export const revalidate = 36000; // 10h
export const dynamic = 'force-static';

const ORIGIN = 'https://chalkidikihub.gr';
const SUPPORTED = ['listings', 'beaches', 'restaurants', 'places'] as const;
type SupportedType = (typeof SUPPORTED)[number];

function isSupported(s: string): s is SupportedType {
  return (SUPPORTED as readonly string[]).includes(s);
}

function pickMulti(m: Record<string, string> | undefined, locale = 'en'): string {
  if (!m) return '';
  return m[locale] || m.en || m.el || Object.values(m).find(Boolean) || '';
}

function mdEscape(s: string): string {
  return (s || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

function listingToMd(l: Record<string, unknown>, locale: string): string {
  const title = pickMulti(l.title as Record<string, string>, locale);
  const desc = pickMulti(l.description as Record<string, string>, locale);
  const url = `${ORIGIN}/${locale}/listings/${l.slug}`;
  const amenities = (l.amenities as string[] | undefined) || [];
  const images = (l.images as Array<{ image_url: string }> | undefined) || [];
  const price = l.price_per_night ? `€${l.price_per_night}` : '—';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = l as any;

  const lines = [
    `# ${title}`,
    '',
    `> ${desc.replace(/\r?\n/g, ' ').slice(0, 300)}`,
    '',
    '## Quick facts',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Location | ${mdEscape(String(l.location_name || ''))} |`,
    `| Area | ${mdEscape(String(l.area || ''))} |`,
    `| Price (per night) | ${price} |`,
    `| Guests | ${l.guests_max ?? '—'} |`,
    `| Bedrooms | ${l.bedrooms ?? '—'} |`,
    `| Bathrooms | ${l.bathrooms ?? '—'} |`,
    `| Check-in / out | ${ext.checkin_time || '16:00'} / ${ext.checkout_time || '11:00'} |`,
    `| Coordinates | ${l.latitude}, ${l.longitude} |`,
    '',
  ];

  if (amenities.length > 0) {
    lines.push('## Amenities', '', amenities.map(a => `- ${a}`).join('\n'), '');
  }

  if (desc) {
    lines.push('## Description', '', desc, '');
  }

  // Booking links — owner-direct prioritised (consistent with site CTA hierarchy).
  // External-channel URLs are gated by the same feature flag as the UI: when
  // off, AI crawlers only see owner-direct contact details, matching what
  // human visitors see on the listing page.
  const bookingLines: string[] = [];
  if (ext.contact_phone) bookingLines.push(`- 📞 Phone: ${ext.contact_phone}`);
  if (ext.contact_email) bookingLines.push(`- ✉️ Email: ${ext.contact_email}`);
  if (EXTERNAL_BOOKING_LINKS_ENABLED && ext.website_url) bookingLines.push(`- 🌐 Website: ${ext.website_url}`);
  if (EXTERNAL_BOOKING_LINKS_ENABLED && ext.booking_url) bookingLines.push(`- 🛏 Booking.com: ${ext.booking_url}`);
  if (EXTERNAL_BOOKING_LINKS_ENABLED && ext.airbnb_url) bookingLines.push(`- 🏠 Airbnb: ${ext.airbnb_url}`);
  if (bookingLines.length > 0) {
    lines.push('## How to book', '', '**0% booking fees when contacting the owner directly.**', '', ...bookingLines, '');
  }

  if (images.length > 0) {
    lines.push('## Images', '', images.slice(0, 8).map(i => `- ${i.image_url}`).join('\n'), '');
  }

  lines.push('---', `Source: <${url}>`, `Type: LodgingBusiness · Halkidiki, Greece`);
  return lines.join('\n');
}

function beachToMd(b: Record<string, unknown>, locale: string): string {
  const name = pickMulti(b.name as Record<string, string>, locale);
  const desc = pickMulti(b.description as Record<string, string>, locale);
  const url = `${ORIGIN}/${locale}/beaches/${b.slug}`;
  const features = (b.features as string[] | undefined) || [];

  const lines = [
    `# ${name}`,
    '',
    `> ${desc.replace(/\r?\n/g, ' ').slice(0, 300)}`,
    '',
    '## Quick facts',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Location | ${mdEscape(String(b.location_name || ''))} |`,
    `| Area | ${mdEscape(String(b.area || ''))} |`,
    `| Rating | ${b.rating ? `${b.rating} (${b.reviews_count || 0} reviews)` : '—'} |`,
    `| Coordinates | ${b.latitude}, ${b.longitude} |`,
    '',
  ];

  if (features.length > 0) {
    lines.push('## Features', '', features.map(f => `- ${f}`).join('\n'), '');
  }

  if (desc) {
    lines.push('## Description', '', desc, '');
  }

  lines.push('---', `Source: <${url}>`, `Type: Beach · Halkidiki, Greece`);
  return lines.join('\n');
}

function restaurantToMd(r: Record<string, unknown>, locale: string): string {
  const name = pickMulti(r.name as Record<string, string>, locale);
  const desc = pickMulti(r.description as Record<string, string>, locale);
  const url = `${ORIGIN}/${locale}/restaurants/${r.slug}`;
  const cuisine = (r.cuisine as string[] | undefined) || [];

  const lines = [
    `# ${name}`,
    '',
    `> ${desc.replace(/\r?\n/g, ' ').slice(0, 300)}`,
    '',
    '## Quick facts',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Location | ${mdEscape(String(r.location_name || ''))} |`,
    `| Area | ${mdEscape(String(r.area || ''))} |`,
    `| Cuisine | ${cuisine.join(', ') || '—'} |`,
    `| Price level | ${r.price_level || '—'} |`,
    `| Sea view | ${r.has_sea_view ? 'Yes' : 'No'} |`,
    `| Live music | ${r.has_live_music ? 'Yes' : 'No'} |`,
    `| Reservations | ${r.accepts_reservations ? 'Accepted' : '—'} |`,
    `| Phone | ${r.phone || '—'} |`,
    `| Hours | ${mdEscape(String(r.hours || '—'))} |`,
    `| Rating | ${r.rating ? `${r.rating} (${r.reviews_count || 0} reviews)` : '—'} |`,
    `| Coordinates | ${r.latitude}, ${r.longitude} |`,
    '',
  ];

  if (desc) {
    lines.push('## Description', '', desc, '');
  }

  lines.push('---', `Source: <${url}>`, `Type: Restaurant · Halkidiki, Greece`);
  return lines.join('\n');
}

function villageToMd(v: Record<string, unknown>, locale: string): string {
  const name = pickMulti(v.name as Record<string, string>, locale);
  const desc = pickMulti(v.description as Record<string, string>, locale);
  const url = `${ORIGIN}/${locale}/places/${v.slug}`;

  const lines = [
    `# ${name}`,
    '',
    `> ${desc.replace(/\r?\n/g, ' ').slice(0, 300)}`,
    '',
    '## Quick facts',
    '',
    `| Field | Value |`,
    `| --- | --- |`,
    `| Area | ${mdEscape(String(v.area || ''))} |`,
    `| Population | ${v.population ?? '—'} |`,
    `| Coordinates | ${v.latitude ?? '—'}, ${v.longitude ?? '—'} |`,
    '',
  ];

  if (desc) {
    lines.push('## Description', '', desc, '');
  }

  lines.push('---', `Source: <${url}>`, `Type: Place / TouristAttraction · Halkidiki, Greece`);
  return lines.join('\n');
}

type RouteCtx = { params: Promise<{ type: string; slug: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { type, slug } = await ctx.params;
  if (!isSupported(type)) {
    return new NextResponse('Unsupported type. Use one of: ' + SUPPORTED.join(', '), { status: 404 });
  }

  // Allow ?locale=de to get localized descriptions; defaults to EN.
  const locale = new URL(req.url).searchParams.get('locale') || 'en';

  let md: string | null = null;
  try {
    switch (type) {
      case 'listings': {
        const l = await getListingBySlug(slug);
        if (l) md = listingToMd(l as unknown as Record<string, unknown>, locale);
        break;
      }
      case 'beaches': {
        const b = await getBeachBySlug(slug);
        if (b) md = beachToMd(b as unknown as Record<string, unknown>, locale);
        break;
      }
      case 'restaurants': {
        const r = await getRestaurantBySlug(slug);
        if (r) md = restaurantToMd(r as unknown as Record<string, unknown>, locale);
        break;
      }
      case 'places': {
        const v = await getVillageBySlug(slug);
        if (v) md = villageToMd(v as unknown as Record<string, unknown>, locale);
        break;
      }
    }
  } catch (e) {
    return new NextResponse(`Error fetching ${type}/${slug}: ${(e as Error).message}`, { status: 500 });
  }

  if (!md) {
    return new NextResponse(`Not found: ${type}/${slug}`, { status: 404 });
  }

  return new NextResponse(md, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=36000, stale-while-revalidate=86400',
      // Hint LLM crawlers this is the canonical machine-readable form.
      Link: `<${ORIGIN}/${locale}/${type === 'places' ? 'places' : type}/${slug}>; rel="canonical"`,
    },
  });
}
