import { createApiClient } from '@/lib/api-helpers';
import { localeUrl } from '@/lib/seo';
import { AREAS } from '@/lib/constants';
import type { Metadata } from 'next';

const LOCALES = ['el', 'en'] as const; // hreflang: publicLocales only - hidden locales remain routable but unindexed

type ContentType = 'beaches' | 'restaurants' | 'activities';

// Per-locale vocabulary: "X beaches", "near Village", "reviews" etc.
// Keeps the builder code linear and easy to add locales to.
const SUBPAGE_L10N: Record<ContentType, Record<string, {
  noun: string;     // "παραλίες" / "beaches" / ...
  near: string;     // "κοντά στο" / "near" / ...
  heading: string;  // H1 prefix word — often same as noun
  tail: string;     // "Φωτογραφίες, χάρτες, κριτικές." etc.
}>> = {
  beaches: {
    el: { noun: 'παραλίες', near: 'κοντά στο', heading: 'Παραλίες', tail: 'Φωτογραφίες, χάρτες, κριτικές.' },
    en: { noun: 'beaches', near: 'near', heading: 'Beaches', tail: 'Photos, map, reviews.' },
    de: { noun: 'Strände', near: 'in der Nähe von', heading: 'Strände', tail: 'Fotos, Karte, Bewertungen.' },
    bg: { noun: 'плажа', near: 'близо до', heading: 'Плажове', tail: 'Снимки, карта, отзиви.' },
    ru: { noun: 'пляжей', near: 'рядом с', heading: 'Пляжи', tail: 'Фото, карта, отзывы.' },
    ro: { noun: 'plaje', near: 'lângă', heading: 'Plaje', tail: 'Fotografii, hartă, recenzii.' },
    sr: { noun: 'plaža', near: 'kod', heading: 'Plaže', tail: 'Fotografije, mapa, recenzije.' },
  },
  restaurants: {
    el: { noun: 'εστιατόρια', near: 'κοντά στο', heading: 'Εστιατόρια', tail: 'Μενού, τιμές, κριτικές.' },
    en: { noun: 'restaurants', near: 'near', heading: 'Restaurants', tail: 'Menus, prices, reviews.' },
    de: { noun: 'Restaurants', near: 'in der Nähe von', heading: 'Restaurants', tail: 'Speisekarten, Preise, Bewertungen.' },
    bg: { noun: 'ресторанта', near: 'близо до', heading: 'Ресторанти', tail: 'Менюта, цени, отзиви.' },
    ru: { noun: 'ресторанов', near: 'рядом с', heading: 'Рестораны', tail: 'Меню, цены, отзывы.' },
    ro: { noun: 'restaurante', near: 'lângă', heading: 'Restaurante', tail: 'Meniuri, prețuri, recenzii.' },
    sr: { noun: 'restorana', near: 'kod', heading: 'Restorani', tail: 'Meniji, cene, recenzije.' },
  },
  activities: {
    el: { noun: 'δραστηριότητες', near: 'κοντά στο', heading: 'Δραστηριότητες', tail: 'Πληροφορίες, τιμές, κρατήσεις.' },
    en: { noun: 'activities', near: 'near', heading: 'Activities', tail: 'Info, prices, booking.' },
    de: { noun: 'Aktivitäten', near: 'in der Nähe von', heading: 'Aktivitäten', tail: 'Info, Preise, Buchung.' },
    bg: { noun: 'дейности', near: 'близо до', heading: 'Дейности', tail: 'Информация, цени, резервации.' },
    ru: { noun: 'занятий', near: 'рядом с', heading: 'Активности', tail: 'Инфо, цены, бронирование.' },
    ro: { noun: 'activități', near: 'lângă', heading: 'Activități', tail: 'Informații, prețuri, rezervări.' },
    sr: { noun: 'aktivnosti', near: 'kod', heading: 'Aktivnosti', tail: 'Informacije, cene, rezervacije.' },
  },
};

const HALKIDIKI: Record<string, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', bg: 'Халкидики', ru: 'Халкидики', ro: 'Halkidiki', sr: 'Halkidiki',
};

async function fetchContext(slug: string, locale: string, contentType: ContentType) {
  const supabase = createApiClient();
  const { data: villageData } = await supabase.from('villages')
    .select('area, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr')
    .eq('slug', slug).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (villageData ?? {}) as any;
  const villageName: string = v[`name_${locale}`] || v.name_el || v.name_en || slug;
  const area: string = v.area || '';

  // Parallel: top 2 items + total count for this content type in the village's area
  const { data: topData, count } = await supabase.from(contentType)
    .select('name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr', { count: 'exact' })
    .eq('area', area)
    .order('rating', { ascending: false })
    .limit(2);
  const topNames = (topData || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((i: any) => i[`name_${locale}`] || i.name_el || i.name_en)
    .filter(Boolean) as string[];

  const areaInfo = AREAS.find(a => a.slug === area);
  const areaLocaleMap = (areaInfo?.name ?? {}) as Record<string, string>;
  const areaName = areaLocaleMap[locale] || areaLocaleMap.el || area;

  return { villageName, areaName, topNames, total: count || 0 };
}

/** Shared server lookup — drives both metadata and SSR'd H1/desc on the page. */
export async function getVillageContext(
  slug: string, locale: string, contentType: ContentType
): Promise<{ villageName: string; heading: string; description: string }> {
  const ctx = await fetchContext(slug, locale, contentType);
  const L = SUBPAGE_L10N[contentType][locale] || SUBPAGE_L10N[contentType].en;
  const heading = ctx.total > 0
    ? `${ctx.total} ${L.noun} ${L.near} ${ctx.villageName}`
    : `${L.heading} ${L.near} ${ctx.villageName}`;
  const topStr = ctx.topNames.length > 0 ? ` — ${ctx.topNames.slice(0, 2).join(', ')}` : '';
  const description = ctx.total > 0
    ? `${ctx.total} ${L.noun} ${L.near} ${ctx.villageName} (${ctx.areaName}, ${HALKIDIKI[locale] || 'Halkidiki'})${topStr}. ${L.tail}`
    : `${L.heading} ${L.near} ${ctx.villageName}, ${HALKIDIKI[locale] || 'Halkidiki'}. ${L.tail}`;
  return { villageName: ctx.villageName, heading, description };
}

export async function getVillageContentMeta(
  slug: string, locale: string, contentType: ContentType
): Promise<Metadata> {
  const ctx = await fetchContext(slug, locale, contentType);
  const L = SUBPAGE_L10N[contentType][locale] || SUBPAGE_L10N[contentType].en;
  const halk = HALKIDIKI[locale] || 'Halkidiki';

  const title = ctx.total > 0
    ? `${ctx.total} ${L.noun} ${L.near} ${ctx.villageName}, ${halk}`
    : `${L.heading} ${L.near} ${ctx.villageName}, ${halk}`;

  const topStr = ctx.topNames.length > 0 ? ` — ${ctx.topNames.slice(0, 2).join(', ')}` : '';
  const description = ctx.total > 0
    ? `${ctx.total} ${L.noun} ${L.near} ${ctx.villageName} (${ctx.areaName}, ${halk})${topStr}. ${L.tail}`
    : `${L.heading} ${L.near} ${ctx.villageName}, ${halk}. ${L.tail}`;

  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: localeUrl(locale, `places/${slug}/${contentType}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `places/${slug}/${contentType}`)])),
        'x-default': localeUrl('el', `places/${slug}/${contentType}`),
      },
    },
  };
}
