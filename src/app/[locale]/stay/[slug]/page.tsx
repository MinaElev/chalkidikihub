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
      area, location_name, latitude, longitude,
      price_per_night, currency, guests_max, bedrooms, bathrooms,
      amenities, status,
      contact_phone, contact_email, booking_url, airbnb_url, website_url,
      show_calendar, created_at, updated_at,
      listing_images (id, image_url, sort_order, is_cover)
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
