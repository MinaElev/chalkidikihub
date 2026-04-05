'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { BlogArticle, Beach, Listing } from '@/types';
import { AREAS } from '@/lib/constants';
import { BlogCard } from './BlogCard';
import { BeachCard } from '@/components/listings/BeachCard';
import { ListingCard } from '@/components/listings/ListingCard';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function RelatedArticles({ slugs }: { slugs: string[] }) {
  const t = useTranslations('blog');
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    if (slugs.length === 0) return;
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data: BlogArticle[]) => {
        if (Array.isArray(data)) setArticles(data.filter((a) => slugs.includes(a.slug)));
      })
      .catch(() => {});
  }, [slugs]);

  if (articles.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('relatedArticles')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article) => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export function RelatedBeaches({ slugs }: { slugs: string[] }) {
  const t = useTranslations('blog');
  const [beaches, setBeaches] = useState<Beach[]>([]);

  useEffect(() => {
    if (slugs.length === 0) return;
    fetch('/api/beaches')
      .then((r) => r.json())
      .then((data: Beach[]) => {
        if (Array.isArray(data)) setBeaches(data.filter((b) => slugs.includes(b.slug)));
      })
      .catch(() => {});
  }, [slugs]);

  if (beaches.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('relatedBeaches')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beaches.map((beach) => (
          <BeachCard key={beach.id} beach={beach} />
        ))}
      </div>
    </div>
  );
}

export function RelatedListings({ slugs }: { slugs: string[] }) {
  const t = useTranslations('blog');
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    if (slugs.length === 0) return;
    fetch('/api/listings')
      .then((r) => r.json())
      .then((data: Listing[]) => {
        if (Array.isArray(data)) setListings(data.filter((l) => slugs.includes(l.slug)));
      })
      .catch(() => {});
  }, [slugs]);

  if (listings.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('relatedListings')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export function ExploreAreas({ areaSlugs }: { areaSlugs: string[] }) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const areas = AREAS.filter((a) => areaSlugs.includes(a.slug));
  if (areas.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('exploreArea')}</h2>
      <div className="flex flex-wrap gap-3">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/areas/${area.slug}`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-medium text-sm"
          >
            {area.name[locale]} &rarr;
          </Link>
        ))}
      </div>
    </div>
  );
}
