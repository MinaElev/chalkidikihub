import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicActivityDetail } from '@/components/listings/DynamicActivityDetail';
import { getContentMeta, generateActivityLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getActivityBySlug } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('activities', slug, locale, 'Activity | Chalkidiki Hub', 'Things to do in Halkidiki');
}

export default async function ActivityDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const activity = await getActivityBySlug(slug);
  if (!activity) notFound();

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitäten', bg: 'Дейности', ru: 'Активности', ro: 'Activități', sr: 'Aktivnosti' };
  const actName = (activity as unknown as Record<string, unknown>).name as Record<string, string>;
  const itemName = actName?.[locale] || actName?.el || actName?.en || '';

  return (
    <>
      <JsonLd data={generateActivityLD(activity as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Activities', url: localeUrl(locale, 'activities') },
        { name: itemName, url: localeUrl(locale, `activities/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicActivityDetail slug={slug} initialData={activity} />
    </>
  );
}
