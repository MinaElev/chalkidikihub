import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { seedArticles } from '@/lib/seed-blog';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { RelatedArticles, RelatedBeaches, RelatedListings, ExploreAreas } from '@/components/blog/RelatedContent';
import { DynamicArticle } from '@/components/blog/DynamicArticle';
import { ShareButtons } from '@/components/ui/ShareButtons';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return seedArticles.map((a) => ({ slug: a.slug }));
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Check seed data first
  const article = seedArticles.find((a) => a.slug === slug);
  if (article) {
    return <ArticleDetail locale={locale} article={article} />;
  }

  // Not in seed - fetch from DB dynamically
  return <DynamicArticle slug={slug} />;
}

function ArticleDetail({
  locale,
  article,
}: {
  locale: string;
  article: (typeof seedArticles)[number];
}) {
  const t = useTranslations('blog');
  const tCat = useTranslations('blogCategories');

  const title = article.title[locale] || article.title.en;
  const content = article.content[locale] || article.content.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToBlog')}
      </Link>

      {/* Hero image */}
      {article.image_url && (
        <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${article.image_url})` }}
          />
        </div>
      )}

      {/* Category */}
      <div className="mb-4">
        <Link
          href="/blog"
          className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
        >
          {tCat(article.category)}
        </Link>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>
        <ShareButtons title={title} compact />
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <User className="w-4 h-4" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{new Date(article.published_at).toLocaleDateString(locale)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{t('readTime', { min: article.read_time_min })}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {article.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      <hr className="my-8" />

      {/* Article content */}
      <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-primary-600 prose-strong:text-gray-900">
        {content.split('\n').map((paragraph, idx) => {
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
          }
          if (paragraph.startsWith('- **')) {
            const match = paragraph.match(/- \*\*(.+?)\*\*: (.+)/);
            if (match) {
              return (
                <div key={idx} className="flex gap-2 ml-4 mb-2">
                  <span className="text-primary-600 font-medium">•</span>
                  <p className="text-gray-600"><strong className="text-gray-900">{match[1]}</strong>: {match[2]}</p>
                </div>
              );
            }
          }
          if (paragraph.startsWith('- ')) {
            return (
              <div key={idx} className="flex gap-2 ml-4 mb-2">
                <span className="text-primary-600">•</span>
                <p className="text-gray-600">{paragraph.replace('- ', '')}</p>
              </div>
            );
          }
          if (paragraph.match(/^\d+\. \*\*/)) {
            const match = paragraph.match(/^(\d+)\. \*\*(.+?)\*\*(.*)$/);
            if (match) {
              return (
                <div key={idx} className="flex gap-3 ml-4 mb-2">
                  <span className="text-primary-600 font-bold">{match[1]}.</span>
                  <p className="text-gray-600"><strong className="text-gray-900">{match[2]}</strong>{match[3]}</p>
                </div>
              );
            }
          }
          if (paragraph.trim() === '') return <div key={idx} className="h-2" />;
          return <p key={idx} className="text-gray-600 leading-relaxed mb-4">{paragraph}</p>;
        })}
      </article>

      <ShareButtons title={title} description={content} />

      <hr className="my-10" />

      {/* Related content - THE ENGAGEMENT ENGINE */}
      <div className="space-y-12">
        <ExploreAreas areaSlugs={article.related_area_slugs} />
        <RelatedBeaches slugs={article.related_beach_slugs} />
        <RelatedListings slugs={article.related_listing_slugs} />
        <RelatedArticles slugs={article.related_article_slugs} />
      </div>
    </div>
  );
}
