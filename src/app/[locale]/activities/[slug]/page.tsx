import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { seedActivities } from '@/lib/seed-activities';
import { seedBeaches } from '@/lib/seed-beaches';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, MapPin, Star, Clock, Euro, User, Tag } from 'lucide-react';
import { NearbyListings } from '@/components/listings/NearbyListings';
import { BeachCard } from '@/components/listings/BeachCard';
import { DynamicActivityDetail } from '@/components/listings/DynamicActivityDetail';
import { ShareButtons } from '@/components/ui/ShareButtons';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return seedActivities.map((a) => ({ slug: a.slug }));
}

export default async function ActivityDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const activity = seedActivities.find((a) => a.slug === slug);
  if (!activity) return <DynamicActivityDetail slug={slug} />;
  const area = AREAS.find((a) => a.slug === activity.area);
  const nearbyBeaches = seedBeaches.filter((b) => activity.nearby_beach_ids.includes(b.id));
  return <ActivityDetail locale={locale} activity={activity} areaName={area?.name[locale] || ''} nearbyBeaches={nearbyBeaches} />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function ActivityDetail({ locale, activity, areaName, nearbyBeaches }: {
  locale: string; activity: (typeof seedActivities)[number]; areaName: string; nearbyBeaches: typeof seedBeaches;
}) {
  const t = useTranslations('activities');
  const tCat = useTranslations('activityCategories');
  const tBeaches = useTranslations('beaches');
  const name = activity.name[locale] || activity.name.en;
  const description = activity.description[locale] || activity.description.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/activities" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />{t('title')}
      </Link>

      {activity.image_url && (
        <div className="relative aspect-[21/9] bg-gray-200 rounded-2xl overflow-hidden mb-8">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${activity.image_url})` }} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="inline-flex px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">
              {tCat(activity.category)}
            </div>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <ShareButtons title={name} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" /><span>{activity.location_name}</span>
              <span className="text-gray-300">|</span>
              <Link href={`/areas/${activity.area}`} className="text-primary-600 hover:underline">{areaName}</Link>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('rating')} ({activity.reviews_count} {t('reviews')})</h2>
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span className="text-2xl font-bold">{activity.rating.toFixed(1)}</span>
            </div>
            <div className="space-y-4">
              {activity.reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-medium text-gray-900">{review.author_name}</span>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment[locale] || review.comment.en}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString(locale)}</p>
                </div>
              ))}
            </div>
          </div>

          {nearbyBeaches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('nearbyBeaches')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyBeaches.map((beach) => (<BeachCard key={beach.id} beach={beach} />))}
              </div>
            </div>
          )}

          {activity.nearby_listing_ids.length > 0 && (
            <NearbyListings listingIds={activity.nearby_listing_ids} />
          )}

          <ShareButtons title={name} description={description} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xl font-bold">{activity.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({activity.reviews_count} {t('reviews')})</span>
            </div>
            <hr />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('priceRange')}</div>
                <div className="font-semibold text-gray-900">{activity.price_range === 'Free' ? t('free') : activity.price_range}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">{t('duration')}</div>
                <div className="font-semibold text-gray-900">{activity.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
