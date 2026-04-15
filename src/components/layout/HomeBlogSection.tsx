import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { BlogCard } from '@/components/blog/BlogCard';
import { getBlogArticles } from '@/lib/data';
import { FileText, ArrowRight } from 'lucide-react';

export async function HomeBlogSection({ locale }: { locale: string }) {
  const t = await getTranslations('blog');
  const articles = await getBlogArticles();
  const latest = articles.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-badge bg-gray-100 text-gray-700 mb-3">
              <FileText className="w-3.5 h-3.5" />
              Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h2>
            <p className="mt-2 text-gray-500">{t('subtitle')}</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {t('allArticles')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {t('allArticles')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
