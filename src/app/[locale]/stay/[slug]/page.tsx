import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createApiClient } from '@/lib/api-helpers';
import { transformListing } from '@/lib/data';
import { StayPage } from '@/components/stay/StayPage';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateLodgingLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = 'force-dynamic';

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
