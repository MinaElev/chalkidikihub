import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicArticle } from '@/components/blog/DynamicArticle';
import { getContentMeta } from '@/lib/seo';
import { getArticleBySlug, getBlogArticles } from '@/lib/data';

export const revalidate = 3600; // 1 hour — on-demand revalidation handles instant updates

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const items = await getBlogArticles();
  return items.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('blog_articles', slug, locale, 'Blog | Chalkidiki Hub', 'Travel guide for Halkidiki');
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return <DynamicArticle slug={slug} initialData={article} />;
}
