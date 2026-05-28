'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Listing, Beach, Restaurant, Activity, BlogArticle, Area } from '@/types';
import { ListingCard } from './ListingCard';
import { BeachCard } from './BeachCard';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { BlogCard } from '@/components/blog/BlogCard';

interface RelatedContentProps {
  area: Area;
  currentSlug: string;
}

export function RelatedContent({ area, currentSlug }: RelatedContentProps) {
  const locale = useLocale();
  const tBeaches = useTranslations('beaches');
  const tRestaurants = useTranslations('restaurants');
  const tActivities = useTranslations('activities');
  const tBlog = useTranslations('blog');

  const [listings, setListings] = useState<Listing[]>([]);
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  // Track whether all parallel fetches have settled, so we can swap the
  // reserved-space placeholder for either real content or collapse-on-empty
  // without a mid-page layout shift.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetch(`/api/listings?area=${area}&limit=4`)
        .then((r) => r.json())
        .then((data: Listing[]) => {
          if (Array.isArray(data)) setListings(data.filter((l) => l.slug !== currentSlug).slice(0, 3));
        }),
      fetch(`/api/beaches?area=${area}&limit=4`)
        .then((r) => r.json())
        .then((data: Beach[]) => { if (Array.isArray(data)) setBeaches(data.slice(0, 3)); }),
      fetch(`/api/restaurants?area=${area}&limit=4`)
        .then((r) => r.json())
        .then((data: Restaurant[]) => { if (Array.isArray(data)) setRestaurants(data.slice(0, 3)); }),
      fetch(`/api/activities?area=${area}&limit=3`)
        .then((r) => r.json())
        .then((data: Activity[]) => { if (Array.isArray(data)) setActivities(data.slice(0, 2)); }),
      fetch('/api/blog?limit=5')
        .then((r) => r.json())
        .then((data: BlogArticle[]) => {
          if (Array.isArray(data)) {
            setArticles(data.filter((a) => a.related_area_slugs?.includes(area)).slice(0, 2));
          }
        }),
    ]).finally(() => setLoaded(true));
  }, [area, currentSlug]);

  const hasContent = listings.length > 0 || beaches.length > 0 || restaurants.length > 0 || activities.length > 0 || articles.length > 0;

  // CLS fix: while fetches are in flight, reserve ~the typical rendered
  // height (~640px) so anything below doesn't jump when data lands. After
  // loaded=true with truly zero matches, collapse silently — no shift since
  // nothing was visible below the reservation window.
  if (!loaded) {
    return (
      <div className="border-t border-gray-200 pt-12 mt-12 min-h-[640px]" aria-hidden="true">
        <div className="space-y-8 animate-pulse">
          <div className="h-7 bg-gray-100 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
            <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
            <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasContent) return null;

  return (
    <div className="border-t border-gray-200 pt-12 mt-12 space-y-12">
      {listings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Καταλύματα στην ίδια περιοχή</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}

      {beaches.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tBeaches('title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {beaches.map((b) => <BeachCard key={b.id} beach={b} />)}
          </div>
        </div>
      )}

      {restaurants.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tRestaurants('title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tActivities('title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((a) => <ActivityCard key={a.id} activity={a} />)}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{tBlog('relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((a) => <BlogCard key={a.id} article={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
