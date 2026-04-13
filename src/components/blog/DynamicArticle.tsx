'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BlogArticle } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, BookOpen } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateArticleLD } from '@/lib/seo';
import { AutoLinkedContent } from './AutoLinkedContent';
import { BlogCard } from './BlogCard';
import { addRecentlyViewed } from '@/lib/use-recently-viewed';
import { RecentlyViewed } from '@/components/ui/RecentlyViewed';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { CommentSection } from './CommentSection';
import Image from 'next/image';

export function DynamicArticle({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('blog');
  const tCat = useTranslations('blogCategories');
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [allArticles, setAllArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current article + recent articles for sidebar/nav
    Promise.all([
      fetch(`/api/blog?slug=${slug}`).then((r) => r.json()),
      fetch('/api/blog?limit=6').then((r) => r.json()),
    ])
      .then(([articleData, allData]) => {
        if (articleData && articleData.id) setArticle(articleData);
        if (Array.isArray(allData)) setAllArticles(allData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (article) {
      addRecentlyViewed({
        type: 'blog',
        slug: article.slug,
        title: article.title[locale] || article.title.en,
        image: article.image_url,
      });
    }
  }, [article, locale]);

  if (loading) return <DetailSkeleton />;

  if (!article) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-lg text-gray-500">Article not found</p>
      <Link href="/blog" className="mt-4 inline-flex text-primary-600 hover:underline">{t('backToBlog')}</Link>
    </div>
  );

  const title = article.title[locale] || article.title.en || article.title.el;
  const content = article.content[locale] || article.content.en || article.content.el;
  const excerpt = article.excerpt[locale] || article.excerpt.en || article.excerpt.el;

  // Find prev/next articles
  const sortedArticles = allArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  const currentIndex = sortedArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < sortedArticles.length - 1 ? sortedArticles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null;

  // Sidebar articles: related first, then same category, exclude current
  const sidebarArticles = allArticles
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const aRelated = article.related_article_slugs?.includes(a.slug) ? 1 : 0;
      const bRelated = article.related_article_slugs?.includes(b.slug) ? 1 : 0;
      if (aRelated !== bRelated) return bRelated - aRelated;
      const aSameCat = a.category === article.category ? 1 : 0;
      const bSameCat = b.category === article.category ? 1 : 0;
      return bSameCat - aSameCat;
    })
    .slice(0, 3);

  // In-article CTA: pick 2 different articles for mid-content suggestion
  const ctaArticles = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 2);
  if (ctaArticles.length === 0) {
    ctaArticles.push(...allArticles.filter((a) => a.slug !== slug).slice(0, 2));
  }

  // Detect if content is HTML (from AI) or markdown (manual)
  const isHtmlContent = (content || '').includes('<h2') || (content || '').includes('<p>') || (content || '').includes('<ul');

  // Split content into paragraphs for in-article CTA injection (markdown only)
  const paragraphs = (content || excerpt || '').split('\n');
  const insertAfterParagraph = Math.min(Math.max(Math.floor(paragraphs.length * 0.3), 3), 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={generateArticleLD(article as unknown as Record<string, unknown>, locale)} />
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0 max-w-4xl">
          {article.image_url && (
            <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
              <Image src={article.image_url} alt={title} fill className="object-cover" sizes="100vw" priority />
            </div>
          )}

          <div className="mb-4">
            <span className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {tCat(article.category)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
            <ShareButtons title={title} compact />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5"><User className="w-4 h-4" /><span>{article.author}</span></div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /><span>{new Date(article.published_at).toLocaleDateString(locale)}</span></div>
            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>{t('readTime', { min: article.read_time_min })}</span></div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}

          <hr className="my-8" />

          {/* Article content */}
          <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-ul:my-3 prose-blockquote:border-primary-500 prose-blockquote:text-gray-600">
            {isHtmlContent ? (
              <>
                {/* HTML content from AI — render directly */}
                <div dangerouslySetInnerHTML={{ __html: content }} />

                {/* In-article CTA banner */}
                {ctaArticles.length > 0 && (
                  <div className="not-prose my-8 p-5 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                      <h3 className="text-sm font-bold text-primary-800">Μπορεί να σας ενδιαφέρει</h3>
                    </div>
                    <div className="space-y-2">
                      {ctaArticles.slice(0, 2).map((a) => (
                        <Link key={a.slug} href={`/blog/${a.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors group">
                          {a.image_url && (
                            <Image src={a.image_url} alt={a.title[locale] || a.title.en || a.title.el} width={56} height={56} className="rounded-lg object-cover shrink-0" sizes="56px" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 truncate">
                              {a.title[locale] || a.title.en || a.title.el}
                            </p>
                            <p className="text-xs text-gray-500">{t('readTime', { min: a.read_time_min })}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Markdown content — use AutoLinkedContent */}
                <AutoLinkedContent content={paragraphs.slice(0, insertAfterParagraph).join('\n')} />

                {/* In-article CTA banner */}
                {ctaArticles.length > 0 && (
                  <div className="not-prose my-8 p-5 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                      <h3 className="text-sm font-bold text-primary-800">Μπορεί να σας ενδιαφέρει</h3>
                    </div>
                    <div className="space-y-2">
                      {ctaArticles.slice(0, 2).map((a) => (
                        <Link key={a.slug} href={`/blog/${a.slug}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors group">
                          {a.image_url && (
                            <Image src={a.image_url} alt={a.title[locale] || a.title.en || a.title.el} width={56} height={56} className="rounded-lg object-cover shrink-0" sizes="56px" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 truncate">
                              {a.title[locale] || a.title.en || a.title.el}
                            </p>
                            <p className="text-xs text-gray-500">{t('readTime', { min: a.read_time_min })}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rest of content */}
                {paragraphs.length > insertAfterParagraph && (
                  <AutoLinkedContent content={paragraphs.slice(insertAfterParagraph).join('\n')} />
                )}
              </>
            )}
          </article>

          <CommentSection articleId={article.id} articleSlug={article.slug} />

          <ShareButtons title={title} description={excerpt} />

          {/* Prev/Next navigation */}
          {(prevArticle || nextArticle) && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link href={`/blog/${prevArticle.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Προηγούμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 line-clamp-2">
                        {prevArticle.title[locale] || prevArticle.title.en || prevArticle.title.el}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link href={`/blog/${nextArticle.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-right md:flex-row-reverse">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Επόμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 line-clamp-2">
                        {nextArticle.title[locale] || nextArticle.title.en || nextArticle.title.el}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar - desktop only */}
        {sidebarArticles.length > 0 && (
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary-600" />
                Διαβάστε επίσης
              </h3>
              {sidebarArticles.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`}
                  className="block group">
                  {a.image_url && (
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-gray-100">
                      <Image src={a.image_url} alt={a.title[locale] || a.title.en || a.title.el} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                  )}
                  <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium mb-1">
                    {tCat(a.category)}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                    {a.title[locale] || a.title.en || a.title.el}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{t('readTime', { min: a.read_time_min })}</p>
                </Link>
              ))}

              {/* Extra CTA */}
              <Link href="/blog"
                className="block text-center py-2.5 px-4 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors mt-4">
                {t('allArticles')} →
              </Link>
            </div>
          </aside>
        )}
      </div>

      <RecentlyViewed currentSlug={slug} />
    </div>
  );
}
