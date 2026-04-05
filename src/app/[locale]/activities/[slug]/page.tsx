import { setRequestLocale } from 'next-intl/server';
import { DynamicActivityDetail } from '@/components/listings/DynamicActivityDetail';
import { getContentMeta } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('activities', slug, locale, 'Activity | Chalkidiki Hub', 'Things to do in Halkidiki');
}

export default async function ActivityDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <DynamicActivityDetail slug={slug} />;
}
