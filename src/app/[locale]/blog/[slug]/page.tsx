import { setRequestLocale } from 'next-intl/server';
import { DynamicArticle } from '@/components/blog/DynamicArticle';
import { getContentMeta } from '@/lib/seo';

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

  // Always use DynamicArticle to fetch live content from DB
  // This ensures translated content (DE, BG, RU, RO) is shown
  return <DynamicArticle slug={slug} />;
}
