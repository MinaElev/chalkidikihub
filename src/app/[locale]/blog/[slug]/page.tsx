import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicArticle } from '@/components/blog/DynamicArticle';
import { getContentMeta } from '@/lib/seo';
import { createApiClient } from '@/lib/api-helpers';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('blog_articles', slug, locale, 'Blog | Chalkidiki Hub', 'Travel guide for Halkidiki');
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data } = await supabase.from('blog_articles').select('id').eq('slug', slug).eq('status', 'published').single();
  if (!data) notFound();

  // Always use DynamicArticle to fetch live content from DB
  // This ensures translated content (DE, BG, RU, RO) is shown
  return <DynamicArticle slug={slug} />;
}
