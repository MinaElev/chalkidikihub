'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Activity, Beach } from '@/types';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowRight, MapPin, Star, Clock, Euro, Compass, Tag } from 'lucide-react';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { ActivityCard } from './ActivityCard';
import { BeachCard } from './BeachCard';
import { LocationMap } from '@/components/ui/LocationMap';
import { ShareButtons } from '@/components/ui/ShareButtons';

export function DynamicActivityDetail({ slug }: { slug: string }) {
  const locale = useLocale();
  const t = useTranslations('activities');
  const tCat = useTranslations('activityCategories');
  const tBeaches = useTranslations('beaches');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [nearbyBeaches, setNearbyBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/activities?slug=${slug}`).then((r) => r.json()),
      fetch('/api/activities').then((r) => r.json()),
      fetch('/api/beaches').then((r) => r.json()),
    ])
      .then(([actData, allData, beachesData]) => {
        if (actData && actData.id) {
          setActivity(actData);
          // Find nearby beaches in same area
          if (Array.isArray(beachesData)) {
            setNearbyBeaches(beachesData.filter((b: Beach) => b.area === actData.area).slice(0, 3));
          }
        }
        if (Array.isArray(allData)) setAllActivities(allData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (!activity) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <p className="text-lg text-gray-500">Not found</p>
      <Link href="/activities" className="mt-4 inline-flex text-primary-600 hover:underline">{t('title')}</Link>
    </div>
  );

  const name = activity.name[locale] || activity.name.en;
  const description = activity.description[locale] || activity.description.en;

  // Sidebar: same category first, then same area, exclude current
  const sidebarActivities = allActivities
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const aSameCat = a.category === activity.category ? 2 : 0;
      const bSameCat = b.category === activity.category ? 2 : 0;
      const aSameArea = a.area === activity.area ? 1 : 0;
      const bSameArea = b.area === activity.area ? 1 : 0;
      return (bSameCat + bSameArea) - (aSameCat + aSameArea);
    })
    .slice(0, 3);

  // In-content CTA: 2 activities same area, different category if possible
  const ctaActivities = allActivities
    .filter((a) => a.slug !== slug && a.area === activity.area && a.category !== activity.category)
    .slice(0, 2);
  if (ctaActivities.length < 2) {
    const more = allActivities.filter((a) => a.slug !== slug && !ctaActivities.includes(a)).slice(0, 2 - ctaActivities.length);
    ctaActivities.push(...more);
  }

  // Prev/Next by rating
  const sorted = allActivities.sort((a, b) => b.rating - a.rating);
  const currentIndex = sorted.findIndex((a) => a.slug === slug);
  const prevActivity = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  const nextActivity = currentIndex > 0 ? sorted[currentIndex - 1] : null;

  // Split description for in-article CTA
  const paragraphs = (description || '').split('\n').filter(Boolean);
  const insertAt = Math.min(Math.max(Math.floor(paragraphs.length * 0.4), 2), 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/activities" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('title')}
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <span className="inline-flex px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {tCat(activity.category)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <ShareButtons title={name} compact />
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <MapPin className="w-4 h-4" /><span>{activity.location_name}</span>
            <span className="text-gray-300">|</span>
            <Link href={`/areas/${activity.area}`} className="text-primary-600 hover:underline capitalize">{activity.area}</Link>
          </div>

          {/* Key stats */}
          <div className="flex items-center gap-6 mt-4 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-gray-900">{activity.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({activity.reviews_count})</span>
            </div>
            {activity.price_range && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Euro className="w-4 h-4 text-amber-600" />
                <span>{activity.price_range === 'Free' ? t('free') : activity.price_range}</span>
              </div>
            )}
            {activity.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{activity.duration}</span>
              </div>
            )}
          </div>

          {/* Image */}
          {activity.image_url && (
            <div className="aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mt-6">
              <img src={activity.image_url} alt={name} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          {/* Description with in-article CTA */}
          <div className="mt-6 space-y-4">
            {paragraphs.slice(0, insertAt).map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
            ))}

            {/* In-article CTA */}
            {ctaActivities.length > 0 && paragraphs.length > 3 && (
              <div className="my-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-amber-800">Δραστηριότητες κοντά σας</h3>
                </div>
                <div className="space-y-2">
                  {ctaActivities.map((a) => (
                    <Link key={a.slug} href={`/activities/${a.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors group">
                      {a.image_url && <img src={a.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 truncate">
                          {a.name[locale] || a.name.en}
                        </p>
                        <p className="text-xs text-gray-500">{tCat(a.category)} · {a.duration}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {paragraphs.slice(insertAt).map((p, i) => (
              <p key={`rest-${i}`} className="text-gray-600 leading-relaxed">{p}</p>
            ))}
          </div>

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {activity.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Map */}
          {activity.latitude && activity.longitude && activity.latitude !== 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('location') || 'Τοποθεσία'}</h2>
              <LocationMap latitude={activity.latitude} longitude={activity.longitude} name={name} />
            </div>
          )}

          {/* Nearby beaches */}
          {nearbyBeaches.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{tBeaches('title')} στην περιοχή</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nearbyBeaches.map((b) => <BeachCard key={b.id} beach={b} />)}
              </div>
            </div>
          )}

          <ShareButtons title={name} description={description} />

          {/* Prev/Next navigation */}
          {(prevActivity || nextActivity) && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevActivity ? (
                  <Link href={`/activities/${prevActivity.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-amber-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Προηγούμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-2">
                        {prevActivity.name[locale] || prevActivity.name.en}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
                {nextActivity ? (
                  <Link href={`/activities/${nextActivity.slug}`}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all text-right md:flex-row-reverse">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Επόμενο</p>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 line-clamp-2">
                        {nextActivity.name[locale] || nextActivity.name.en}
                      </p>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Quick info card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-bold">{activity.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({activity.reviews_count})</span>
              </div>
              <hr />
              {activity.price_range && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Euro className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{t('priceRange')}</div>
                    <div className="text-sm font-semibold">{activity.price_range === 'Free' ? t('free') : activity.price_range}</div>
                  </div>
                </div>
              )}
              {activity.duration && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{t('duration')}</div>
                    <div className="text-sm font-semibold">{activity.duration}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Related activities */}
            {sidebarActivities.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-amber-600" />
                  Δείτε επίσης
                </h3>
                <div className="space-y-3">
                  {sidebarActivities.map((a) => (
                    <Link key={a.slug} href={`/activities/${a.slug}`} className="block group">
                      {a.image_url && (
                        <div className="aspect-[16/9] rounded-xl overflow-hidden mb-2 bg-gray-100">
                          <img src={a.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      <span className="inline-flex px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-medium mb-1">
                        {tCat(a.category)}
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                        {a.name[locale] || a.name.en}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{a.duration} · {a.price_range}</p>
                    </Link>
                  ))}
                </div>
                <Link href="/activities"
                  className="block text-center py-2.5 px-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors mt-4">
                  {t('viewAll') || 'Όλες οι δραστηριότητες'} →
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
