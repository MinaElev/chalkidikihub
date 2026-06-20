import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicBeachDetail } from '@/components/listings/DynamicBeachDetail';
import { getContentMeta, generateBeachLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getBeachBySlug } from '@/lib/data';
import { RelatedItems } from '@/components/related/RelatedItems';

// ISR: render-on-demand, then cache. `revalidate` + a (deliberately empty)
// generateStaticParams registers the route as SSG/ISR, so Next emits
// `Cache-Control: s-maxage=86400, stale-while-revalidate` and the Vercel CDN
// serves the rendered HTML from the edge — repeat hits (incl. AI crawlers) stop
// re-invoking the function, which is the Active-CPU saving. Empty array means
// nothing is prerendered at build; dynamicParams (default true) renders each
// slug on first hit and caches it. Mirrors the working ev-chargers/[slug].
// `revalidate` ALONE is not enough — without generateStaticParams Next keeps
// the route fully dynamic (no-store). unstable_cache wrappers in
// src/lib/data.ts still back the data layer.
export const revalidate = 2592000; // ISR: 30d
export function generateStaticParams() {
  return [];
}
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  // Auto-noindex beaches whose description is below the quality bar AdSense /
  // Helpful Content evaluators look for. 800 chars is the cutoff where the
  // page transitions from "generic AI stub" to "page that adds real signal".
  // Reversible: bump a thin beach's description past the threshold and the
  // next crawl re-indexes it automatically.
  return getContentMeta('beaches', slug, locale, 'Beach | Chalkidiki Hub', 'Discover beaches in Halkidiki', {
    thinThreshold: 800,
  });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedItems type="beaches" currentSlug={slug} area={(beach as unknown as { area?: string }).area} locale={locale} />
      </div>
    </>
  );
}
