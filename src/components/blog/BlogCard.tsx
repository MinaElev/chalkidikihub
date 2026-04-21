'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { BlogArticle } from '@/types';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export function BlogCard({ article }: { article: BlogArticle }) {
  const locale = useLocale();
  const t = useTranslations('blog');
  const tCat = useTranslations('blogCategories');

  const title = article.title[locale] || article.title.en;
  const excerpt = article.excerpt[locale] || article.excerpt.en;
  const altText = `${title} — ${tCat(article.category)}, Chalkidiki Hub`;

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden ring-1 ring-gray-900/5 card-premium">
        {/* Image */}
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={altText}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={60}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <span className="text-primary-300 text-5xl font-bold">H</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
            {tCat(article.category)}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{excerpt}</p>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(article.published_at).toLocaleDateString(locale)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('readTime', { min: article.read_time_min })}</span>
              </div>
            </div>
            <span className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              {t('readMore')} <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
