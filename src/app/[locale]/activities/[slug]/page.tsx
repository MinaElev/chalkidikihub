import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicActivityDetail } from '@/components/listings/DynamicActivityDetail';
import { getContentMeta } from '@/lib/seo';
import { getActivityBySlug, getActivities } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const items = await getActivities();
  return items.map(item => ({ slug: item.slug }));
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

  return <DynamicActivityDetail slug={slug} initialData={activity} />;
}
