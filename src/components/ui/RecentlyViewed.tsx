'use client';

import Image from 'next/image';
import { useRecentlyViewed, RecentItem } from '@/lib/use-recently-viewed';
import { Link } from '@/i18n/navigation';
import { Clock, Home, Waves, UtensilsCrossed, Landmark, FileText } from 'lucide-react';

const typeConfig: Record<string, { icon: typeof Home; color: string; bgColor: string; path: string }> = {
  listing: { icon: Home, color: 'text-primary-600', bgColor: 'bg-primary-50', path: 'listings' },
  beach: { icon: Waves, color: 'text-cyan-600', bgColor: 'bg-cyan-50', path: 'beaches' },
  restaurant: { icon: UtensilsCrossed, color: 'text-red-600', bgColor: 'bg-red-50', path: 'restaurants' },
  activity: { icon: Landmark, color: 'text-amber-600', bgColor: 'bg-amber-50', path: 'activities' },
  blog: { icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50', path: 'blog' },
};

export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const items = useRecentlyViewed(currentSlug);

  if (items.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Είδατε πρόσφατα</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config?.icon || Home;
          return (
            <Link key={`${item.type}-${item.slug}`} href={`/${config?.path || item.type}/${item.slug}`}
              className="flex-shrink-0 w-40 group">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-2">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill
                    sizes="160px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${config?.bgColor || 'bg-gray-50'}`}>
                    <Icon className={`w-8 h-8 ${config?.color || 'text-gray-400'}`} />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700 line-clamp-2 leading-snug">{item.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
