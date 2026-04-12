'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { useLiveData } from '@/lib/use-live-data';
import { BlogArticle } from '@/types';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilters, BlogCategory, Area } from '@/types';
import { AREA_SLUGS } from '@/lib/constants';
import { X } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const CATEGORIES: BlogCategory[] = ['guides', 'beaches', 'food', 'activities', 'tips', 'culture'];

export default function BlogPageClient() {
  const t = useTranslations('blog');
  const tCat = useTranslations('blogCategories');
  const tAreas = useTranslations('areas');
  const tCommon = useTranslations('common');
  const [filters, setFilters] = useState<BlogFilters>({});
  const { data: articles } = useLiveData<BlogArticle>('/api/blog', []);

  const areaLabels: Record<Area, string> = {
    kassandra: tAreas('kassandra.name'),
    sithonia: tAreas('sithonia.name'),
    athos: tAreas('athos.name'),
    mainland: tAreas('mainlandHalkidiki.name'),
  };

  const filtered = useMemo(() => {
    let result = [...articles];

    if (filters.category) {
      result = result.filter((a) => a.category === filters.category);
    }
    if (filters.area) {
      result = result.filter((a) => a.related_area_slugs.includes(filters.area!));
    }

    result.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return result;
  }, [filters, articles]);

  const hasActive = filters.category || filters.area;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: t('title') }]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilters({ ...filters, category: undefined })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filters.category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('allArticles')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filters.category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tCat(cat)}
          </button>
        ))}
      </div>

      {/* Area filter */}
      <div className="flex items-center gap-3 mb-8">
        <select
          value={filters.area || ''}
          onChange={(e) => setFilters({ ...filters, area: e.target.value as Area || undefined })}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
        >
          <option value="">{t('filters.allAreas')}</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{areaLabels[a]}</option>)}
        </select>

        {hasActive && (
          <button
            onClick={() => setFilters({})}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
            {t('filters.clearFilters')}
          </button>
        )}
      </div>

      {/* Articles grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-500">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}
