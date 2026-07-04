import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createApiClient } from '@/lib/api-helpers';
import { transformListing } from '@/lib/data';
import { StayPage } from '@/components/stay/StayPage';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateLodgingLD, generateBreadcrumbLD, localeUrl, ogImageUrl } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only — hidden locales stay routable but unindexed

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

/** Strip HTML/markdown and collapse whitespace; trim to a meta-length snippet. */
function snippet(html: string | null | undefined, max = 160): string {
  if (!html) return '';
  const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// ─── Metadata ───────────────────────────────────────────────────────
// The /stay/<slug> brand page is a DISTINCT SEO surface from the directory
// /listings/<slug>: it leads with the owner's tagline + story, not the
// amenity grid. So it is SELF-canonical (not canonicalised to /listings) —
// but ONLY when there's real brand copy. Without a tagline/owner_story the
// page is a near-duplicate of the listing, so we noindex it. This mirrors
// the `hasBrand` gate in sitemap.ts that decides whether /stay is even
// submitted for indexing, keeping the on-page tag and the sitemap in sync.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as string;
  const supabase = createApiClient();
  // Dedup language suffixes so el/en requests don't select `title_el` twice
  // (PostgREST can reject a duplicated column in the select list).
  const suffixes = Array.from(new Set(['el', 'en', l]));
  const langCols = ['title', 'tagline', 'owner_story', 'description']
    .flatMap(f => suffixes.map(s => `${f}_${s}`))
    .join(', ');
  const { data } = await supabase
    .from('listings')
    .select(`slug, area, location_name, status, ${langCols}, listing_images(image_url, is_cover, sort_order)`)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  const pageUrl = localeUrl(locale, `stay/${slug}`);
  const baseAlternates = {
    canonical: pageUrl,
    languages: {
      ...Object.fromEntries(LOCALES.map(loc => [loc, localeUrl(loc, `stay/${slug}`)])),
      'x-default': localeUrl('el', `stay/${slug}`),
    },
  };

  // Row not found → noindex soft-404 (Next 16 + dynamic returns 200 even on notFound()).
  if (!data) {
    return {
      title: 'Chalkidiki Hub',
      robots: { index: false, follow: false },
      alternates: baseAlternates,
    };
  }

  const row = data as unknown as Record<string, string | null>;
  const name = row[`title_${l}`] || row.title_el || row.title_en || '';
  const place = row.location_name || '';
  const tagline = row[`tagline_${l}`] || row.tagline_el || row.tagline_en || '';
  const story = row[`owner_story_${l}`] || row.owner_story_el || row.owner_story_en || '';
  const desc = row[`description_${l}`] || row.description_el || row.description_en || '';

  // Brand gate: no tagline AND no owner story → near-duplicate of /listings.
  const hasBrand = Boolean(tagline.trim() || story.trim());

  const title = place ? `${name} — ${place}, ${l === 'el' ? 'Χαλκιδική' : 'Halkidiki'}` : name || 'Chalkidiki Hub';
  const description =
    snippet(tagline, 160) ||
    snippet(story, 160) ||
    snippet(desc, 160) ||
    (l === 'el'
      ? `${name}${place ? ` στη ${place}` : ''}, Χαλκιδική — απευθείας κράτηση χωρίς προμήθεια.`
      : `${name}${place ? ` in ${place}` : ''}, Halkidiki — book directly, no commission.`);

  const images = ((data as unknown as { listing_images?: Array<{ image_url: string; is_cover: boolean; sort_order: number }> }).listing_images || [])
    .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order);
  const coverImage = images[0]?.image_url || ogImageUrl(title, 'listing');

  return {
    title,
    description,
    ...(hasBrand ? {} : { robots: { index: false, follow: true } }),
    alternates: baseAlternates,
    openGraph: {
      title, description, type: 'website', locale, url: pageUrl,
      siteName: 'Chalkidiki Hub',
      images: [{ url: coverImage, width: 1200, height: 630, alt: `${name}${place ? ` — ${place}` : ''}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title, description, images: [coverImage],
    },
  };
}

export default async function StayRoute({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id, slug, owner_id,
      title_el, title_en, title_de, title_bg, title_ru, title_ro,
      description_el, description_en, description_de, description_bg, description_ru, description_ro,
      tagline_el, tagline_en, tagline_de, tagline_bg, tagline_ru, tagline_ro, tagline_sr,
      owner_story_el, owner_story_en, owner_story_de, owner_story_bg, owner_story_ru, owner_story_ro, owner_story_sr,
      check_in_time, check_out_time, rule_smoking, rule_pets, rule_parties, rule_kids,
      quiet_hours_from, quiet_hours_to,
      house_rules_extra_el, house_rules_extra_en, house_rules_extra_de, house_rules_extra_bg, house_rules_extra_ru, house_rules_extra_ro, house_rules_extra_sr,
      how_to_reach_el, how_to_reach_en, how_to_reach_de, how_to_reach_bg, how_to_reach_ru, how_to_reach_ro, how_to_reach_sr,
      wifi_info_el, wifi_info_en, wifi_info_de, wifi_info_bg, wifi_info_ru, wifi_info_ro, wifi_info_sr,
      parking_info_el, parking_info_en, parking_info_de, parking_info_bg, parking_info_ru, parking_info_ro, parking_info_sr,
      check_in_info_el, check_in_info_en, check_in_info_de, check_in_info_bg, check_in_info_ru, check_in_info_ro, check_in_info_sr,
      is_closed, reopening_date,
      closed_reason_el, closed_reason_en, closed_reason_de, closed_reason_bg, closed_reason_ru, closed_reason_ro, closed_reason_sr,
      area, location_name, latitude, longitude,
      price_per_night, currency, guests_max, bedrooms, bathrooms,
      amenities, status,
      contact_phone, contact_email, booking_url, airbnb_url, website_url,
      show_calendar, created_at, updated_at,
      listing_images (id, image_url, sort_order, is_cover, caption_el, caption_en, caption_de, caption_bg, caption_ru, caption_ro, caption_sr)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) notFound();

  const listing = transformListing(data as Record<string, unknown>);

  // Breadcrumb labels
  const breadcrumbHome: Record<string, string> = {
    el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало',
    ru: 'Главная', ro: 'Acasă', sr: 'Početna',
  };
  const breadcrumbStays: Record<string, string> = {
    el: 'Καταλύματα', en: 'Stays', de: 'Unterkünfte', bg: 'Настаняване',
    ru: 'Проживание', ro: 'Cazări', sr: 'Smeštaj',
  };
  const titleMap = listing.title as unknown as Record<string, string>;
  const title = titleMap[locale] || titleMap.en || titleMap.el || '';

  return (
    <>
      <JsonLd data={generateLodgingLD(listing as unknown as Record<string, unknown>, locale)} />
      <JsonLd
        data={generateBreadcrumbLD([
          { name: breadcrumbHome[locale] || 'Home', url: localeUrl(locale, '') },
          { name: breadcrumbStays[locale] || 'Stays', url: localeUrl(locale, 'listings') },
          { name: title, url: localeUrl(locale, `stay/${slug}`) },
        ]) as unknown as Record<string, unknown>}
      />
      <StayPage listing={listing} locale={locale} />
    </>
  );
}
