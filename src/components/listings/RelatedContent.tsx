'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Listing, Beach, Restaurant, Activity, BlogArticle, Area } from '@/types';
import { ListingCard } from './ListingCard';
import { BeachCard } from './BeachCard';
import { RestaurantCard } from './RestaurantCard';
import { ActivityCard } from './ActivityCard';
import { BlogCard } from '@/components/blog/BlogCard';
import { seedListings } from '@/lib/seed-data';
import { seedBeaches } from '@/lib/seed-beaches';
import { seedRestaurants } from '@/lib/seed-restaurants';
import { seedActivities } from '@/lib/seed-activities';
import { seedArticles } from '@/lib/seed-blog';

interface RelatedContentProps {
  area: Area;
  currentSlug: string; // exclude current listing
}

export function RelatedContent({ area, currentSlug }: RelatedContentProps) {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tBeaches = useTranslations('beaches');
  const tRestaurants = useTranslations('restaurants');
  const tActivities = useTranslations('activities');
  const tBlog = useTranslations('blog');

  const [listings, setListings] = useState<Listing[]>([]);
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    // Fetch from DB with seed fallback
    fetch(`/api/listings?area=${area}`)
      .then((r) => r.json())
      .then((data: Listing[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data.filter((l) => l.slug !== currentSlug).slice(0, 3));
        } else {
          setListings(seedListings.filter((l) => l.area === area && l.slug !== currentSlug).slice(0, 3));
        }
      })
      .catch(() => setListings(seedListings.filter((l) => l.area === area && l.slug !== currentSlug).slice(0, 3)));

    fetch(`/api/beaches?area=${area}`)
      .then((r) => r.json())
      .then((data: Beach[]) => {
        setBeaches(Array.isArray(data) && data.length > 0 ? data.slice(0, 3) : seedBeaches.filter((b) => b.area === area).slice(0, 3));
      })
      .catch(() => setBeaches(seedBeaches.filter((b) => b.area === area).slice(0, 3)));

    fetch(`/api/restaurants?area=${area}`)
      .then((r) => r.json())
      .then((data: Restaurant[]) => {
        setRestaurants(Array.isArray(data) && data.length > 0 ? data.slice(0, 3) : seedRestaurants.filter((r) => r.area === area).slice(0, 3));
      })
      .catch(() => setRestaurants(seedRestaurants.filter((r) => r.area === area).slice(0, 3)));

    fetch(`/api/activities?area=${area}`)
      .then((r) => r.json())
      .then((data: Activity[]) => {
        setActivities(Array.isArray(data) && data.length > 0 ? data.slice(0, 2) : seedActivities.filter((a) => a.area === area).slice(0, 2));
      })
      .catch(() => setActivities(seedActivities.filter((a) => a.area === area).slice(0, 2)));

    fetch('/api/blog')
      .then((r) => r.json())
      .then((data: BlogArticle[]) => {
        const related = Array.isArray(data) && data.length > 0
          ? data.filter((a) => a.related_area_slugs?.includes(area)).slice(0, 2)
          : seedArticles.filter((a) => a.related_area_slugs.includes(area)).slice(0, 2);
        setArticles(related);
      })
      .catch(() => setArticles(seedArticles.filter((a) => a.related_area_slugs.includes(area)).slice(0, 2)));
  }, [area, currentSlug]);

  const hasContent = listings.length > 0 || beaches.length > 0 || restaurants.length > 0 || activities.length > 0 || articles.length > 0;

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
