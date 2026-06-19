/**
 * Server-rendered "related items" section for detail pages.
 *
 * Fetches 4-6 items from Supabase that share the same `area` as the current
 * item. Links are emitted server-side so Googlebot sees them on first render —
 * key for internal linking signal. Lean markup: image + name + area, no
 * client JS, no hydration cost.
 *
 * The schema stores localized names as separate columns (name_el, name_en, …)
 * so we select both the user's locale column and the English fallback.
 */
import { Link } from '@/i18n/navigation';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

type ContentType = 'beaches' | 'restaurants' | 'listings' | 'activities';

interface Props {
  type: ContentType;
  currentSlug: string;
  area?: string | null;
  locale: string;
  limit?: number;
}

const HEADINGS: Record<ContentType, Record<string, string>> = {
  beaches:     { el: 'Παρόμοιες παραλίες',         en: 'Similar beaches' },
  restaurants: { el: 'Παρόμοια εστιατόρια',        en: 'Similar restaurants' },
  listings:    { el: 'Παρόμοια καταλύματα',        en: 'Similar accommodation' },
  activities:  { el: 'Παρόμοιες δραστηριότητες',   en: 'Similar activities' },
};

const ROUTES: Record<ContentType, string> = {
  beaches: 'beaches', restaurants: 'restaurants', listings: 'listings', activities: 'activities',
};

export async function RelatedItems({ type, currentSlug, area, locale, limit = 6 }: Props) {
  const supabase = createApiClient();
  const nameRoot = type === 'listings' ? 'title' : 'name';
  const safeLocale = /^[a-z]{2}$/.test(locale) ? locale : 'en';
  const nameCol = `${nameRoot}_${safeLocale}`;
  const fallbackCol = `${nameRoot}_en`;
  const cols = ['slug', nameCol, fallbackCol, 'area', 'image_url'];
  // Only beaches/restaurants/activities have a rating column. Listings don't —
  // ordering would silently 400. Skip ordering there.
  const orderable = type !== 'listings';

  const baseSelect = Array.from(new Set(cols)).join(', ');
  let q = supabase
    .from(type)
    .select(baseSelect)
    .neq('slug', currentSlug)
    .limit(limit * 2);
  if (area) q = q.eq('area', area);
  if (orderable) q = q.order('rating', { ascending: false, nullsFirst: false });

  const { data } = await q;
  let items: Record<string, unknown>[] = (data || []) as unknown as Record<string, unknown>[];

  if (items.length < limit && area) {
    let fallback = supabase
      .from(type)
      .select(baseSelect)
      .neq('slug', currentSlug)
      .limit(limit);
    if (orderable) fallback = fallback.order('rating', { ascending: false, nullsFirst: false });
    const { data: more } = await fallback;
    for (const m of ((more || []) as unknown as Record<string, unknown>[])) {
      if (items.length >= limit) break;
      if (!items.find((x) => x.slug === m.slug)) items.push(m);
    }
  }

  items = items.slice(0, limit);
  if (items.length === 0) return null;

  const heading = HEADINGS[type][locale] || HEADINGS[type].en;
  const route = ROUTES[type];

  return (
    <section className="mt-12 pt-8 border-t border-gray-200" data-related-ssr={type}>
      <h2 className="text-lg font-bold text-gray-900 mb-4">{heading}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item) => {
          const slug = item.slug as string;
          const name = (item[nameCol] as string) || (item[fallbackCol] as string) || slug;
          const itemArea = item.area as string | undefined;
          const areaInfo = itemArea ? AREAS.find((a) => a.slug === itemArea) : null;
          const areaName = areaInfo ? (areaInfo.name[locale] || areaInfo.name.en) : '';
          const img = item.image_url as string | undefined;
          return (
            <Link
              key={slug}
              href={`/${route}/${slug}`}
              className="group block rounded-xl overflow-hidden border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all bg-white"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                )}
              </div>
              <div className="p-2">
                <div className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight">{name}</div>
                {areaName && <div className="text-[10px] text-gray-500 mt-0.5">{areaName}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
