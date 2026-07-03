import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DynamicArticle } from '@/components/blog/DynamicArticle';
import { getContentMeta, generateArticleLD, generateBreadcrumbLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { getArticleBySlug } from '@/lib/data';

// ISR: 30d — CDN-cacheable. See beaches/[slug] for the full rationale; both
// revalidate AND an empty generateStaticParams are required (mirrors ev-chargers).
export const revalidate = 2592000;
export function generateStaticParams() {
  return [];
}
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  return getContentMeta('blog_articles', slug, locale, 'Blog | Chalkidiki Hub', 'Travel guide for Halkidiki', { thinField: 'content' });
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const homeLabel: Record<string, string> = { el: 'Αρχική', en: 'Home', de: 'Startseite', bg: 'Начало', ru: 'Главная', ro: 'Acasă', sr: 'Početna' };
  const sectionLabel: Record<string, string> = { el: 'Ιστολόγιο', en: 'Blog', de: 'Blog', bg: 'Блог', ru: 'Блог', ro: 'Blog', sr: 'Blog' };
  const artTitle = (article as unknown as Record<string, unknown>).title as Record<string, string>;
  const itemName = artTitle?.[locale] || artTitle?.el || artTitle?.en || '';

  return (
    <>
      <JsonLd data={generateArticleLD(article as unknown as Record<string, unknown>, locale)} />
      <JsonLd data={generateBreadcrumbLD([
        { name: homeLabel[locale] || 'Home', url: localeUrl(locale) },
        { name: sectionLabel[locale] || 'Blog', url: localeUrl(locale, 'blog') },
        { name: itemName, url: localeUrl(locale, `blog/${slug}`) },
      ]) as Record<string, unknown>} />
      <DynamicArticle slug={slug} initialData={article} />
    </>
  );
}
