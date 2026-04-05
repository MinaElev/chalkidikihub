'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BlogArticle } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { AutoLinkedContent } from './AutoLinkedContent';

export function DynamicArticle({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('blog');
  const tCat = useTranslations('blogCategories');
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setArticle(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('backToBlog')}
      </Link>

      {article.image_url && (
        <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
          <img src={article.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mb-4">
        <span className="inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          {tCat(article.category)}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>

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

      <article className="prose prose-lg max-w-none">
        <AutoLinkedContent content={content || excerpt || ''} />
      </article>
    </div>
  );
}
