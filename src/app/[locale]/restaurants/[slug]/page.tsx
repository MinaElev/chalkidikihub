import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicRestaurantDetail } from '@/components/listings/DynamicRestaurantDetail';
import { getContentMeta, generateRestaurantLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getRestaurantBySlug } from '@/lib/data';

// Default dynamic rendering — see listings/[slug] for context.
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  // Zero current impact (all restaurants are >1.250 chars), kept as a safety
  // net for future entries that slip in below the quality bar.
  return getContentMeta('restaurants', slug, locale, 'Restaurant | Chalkidiki Hub', 'Best restaurants in Halkidiki', {
    thinThreshold: 400,
  });
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Εστιατόρια', en: 'Restaurants', de: 'Restaurants', bg: 'Ресторанти', ru: 'Рестораны', ro: 'Restaurante', sr: 'Restorani' };
  const restName = (restaurant as unknown as Record<string, unknown>).name as Record<string, string>;
  const itemName = restName?.[locale] || restName?.el || restName?.en || '';

  return (
    <>
      <JsonLd data={generateRestaurantLD(restaurant as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Restaurants', url: localeUrl(locale, 'restaurants') },
        { name: itemName, url: localeUrl(locale, `restaurants/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicRestaurantDetail slug={slug} initialData={restaurant} />
    </>
  );
}
