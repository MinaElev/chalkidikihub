import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { getContentMeta, generateBeachLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getBeachBySlug } from '@/lib/data';

// Default dynamic rendering (no force-dynamic, no generateStaticParams).
// The Next 16 + Turbopack SSG-fallback bug is triggered by empty
// generateStaticParams; force-dynamic bypassed it but also disabled the
// React Data Cache. Removing both lets unstable_cache wrappers in
// src/lib/data.ts handle caching. Mirrors listings/[slug].
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('beaches', slug, locale, 'Beach | Chalkidiki Hub', 'Discover beaches in Halkidiki');
}

export default async function BeachDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const beach = await getBeachBySlug(slug);
  if (!beach) notFound();

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Παραλίες', en: 'Beaches', de: 'Strände', bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaže' };
  const beachName = (beach as unknown as Record<string, unknown>).name as Record<string, string>;
  const itemName = beachName?.[locale] || beachName?.el || beachName?.en || '';

  return (
    <>
      <JsonLd data={generateBeachLD(beach as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Beaches', url: localeUrl(locale, 'beaches') },
        { name: itemName, url: localeUrl(locale, `beaches/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicBeachDetail slug={slug} initialData={beach} />
    </>
  );
}
