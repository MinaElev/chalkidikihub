'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useLiveData } from '@/lib/use-live-data';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogArticle } from '@/types';

export function HomeBlogSection() {
  const t = useTranslations('blog');
  const { data: articles } = useLiveData<BlogArticle>('/api/blog?limit=4', []);
  const latest = articles.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-1 text-gray-600">{t('subtitle')}</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {t('allArticles')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex px-6 py-3 text-sm font-medium text-primary-600 border border-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            {t('allArticles')} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
