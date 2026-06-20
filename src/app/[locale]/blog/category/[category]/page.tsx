import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createApiClient } from '@/lib/api-helpers';
import { transformArticle } from '@/lib/data';
import { generateItemListLD, localeUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { BlogCard } from '@/components/blog/BlogCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import type { BlogCategory, BlogArticle } from '@/types';

export const revalidate = 2592000; // ISR: 30d - on-demand revalidation from admin saves keeps content fresh

const VALID_CATEGORIES: BlogCategory[] = ['activities', 'guides', 'tips', 'beaches', 'culture', 'food'];

const categoryLabels: Record<BlogCategory, Record<string, string>> = {
  activities: { el: 'Δραστηριότητες', en: 'Activities', de: 'Aktivitäten', bg: 'Дейности', ru: 'Активности', ro: 'Activități', sr: 'Aktivnosti' },
  guides: { el: 'Οδηγοί', en: 'Guides', de: 'Reiseführer', bg: 'Пътеводители', ru: 'Путеводители', ro: 'Ghiduri', sr: 'Vodiči' },
  tips: { el: 'Συμβουλές', en: 'Tips', de: 'Tipps', bg: 'Съвети', ru: 'Советы', ro: 'Sfaturi', sr: 'Saveti' },
  beaches: { el: 'Παραλίες', en: 'Beaches', de: 'Strände', bg: 'Плажове', ru: 'Пляжи', ro: 'Plaje', sr: 'Plaže' },
  culture: { el: 'Πολιτισμός', en: 'Culture', de: 'Kultur', bg: 'Култура', ru: 'Культура', ro: 'Cultură', sr: 'Kultura' },
  food: { el: 'Φαγητό & Ποτό', en: 'Food & Drink', de: 'Essen & Trinken', bg: 'Храна и напитки', ru: 'Еда и напитки', ro: 'Mâncare și băutură', sr: 'Hrana i piće' },
};

const noArticlesMsg: Record<string, string> = {
  el: 'Δεν βρέθηκαν άρθρα σε αυτήν την κατηγορία.',
  en: 'No articles found in this category.',
  de: 'Keine Artikel in dieser Kategorie gefunden.',
  bg: 'Няма намерени статии в тази категория.',
  ru: 'Статьи в этой категории не найдены.',
  ro: 'Nu au fost găsite articole în această categorie.',
  sr: 'Nisu pronađeni članci u ovoj kategoriji.',
};

const resultsLabel: Record<string, string> = {
  el: 'άρθρα', en: 'articles', de: 'Artikel', bg: 'статии', ru: 'статей', ro: 'articole', sr: 'članaka',
};

const backLabel: Record<string, string> = {
  el: 'Πίσω στο Blog', en: 'Back to Blog', de: 'Zurück zum Blog',
  bg: 'Обратно към блога', ru: 'Назад в блог', ro: 'Înapoi la Blog', sr: 'Nazad na Blog',
};

type Props = { params: Promise<{ locale: string; category: string }> };

export default async function BlogCategoryPage({ params }: Props) {
  const { locale, category } = await params;
  if (!VALID_CATEGORIES.includes(category as BlogCategory)) notFound();

  setRequestLocale(locale);
  const cat = category as BlogCategory;
  const label = categoryLabels[cat][locale] || categoryLabels[cat].en;

  const supabase = createApiClient();
  const { data } = await supabase
    .from('blog_articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  const articles: BlogArticle[] = (data || []).map(transformArticle) as unknown as BlogArticle[];

  const itemListLD = generateItemListLD(
    `${label} — ChalkidikiHub`,
    articles.map((a) => ({
      name: a.title[locale] || a.title.el || a.title.en,
      url: localeUrl(locale, `blog/${a.slug}`),
    })),
  );

  return (
    <>
      <JsonLd data={itemListLD as Record<string, unknown>} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label }]} />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{label}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {articles.length} {resultsLabel[locale] || resultsLabel.en}
        </p>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {noArticlesMsg[locale] || noArticlesMsg.en}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <a
            href="/blog"
            className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            &larr; {backLabel[locale] || backLabel.en}
          </a>
        </div>
      </div>
    </>
  );
}
