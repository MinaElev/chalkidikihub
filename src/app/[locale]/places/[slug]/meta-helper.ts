import { createApiClient } from '@/lib/api-helpers';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type ContentType = 'beaches' | 'restaurants' | 'activities';

const LABELS: Record<ContentType, Record<string, { title: string; desc: string }>> = {
  beaches: {
    el: { title: 'Παραλίες', desc: 'Οι καλύτερες παραλίες κοντά' },
    en: { title: 'Beaches', desc: 'Best beaches near' },
    de: { title: 'Strände', desc: 'Beste Strände in der Nähe von' },
    bg: { title: 'Плажове', desc: 'Най-добрите плажове близо до' },
    ru: { title: 'Пляжи', desc: 'Лучшие пляжи рядом с' },
    ro: { title: 'Plaje', desc: 'Cele mai bune plaje lângă' },
  },
  restaurants: {
    el: { title: 'Εστιατόρια', desc: 'Τα καλύτερα εστιατόρια και μπαρ κοντά' },
    en: { title: 'Restaurants', desc: 'Best restaurants and bars near' },
    de: { title: 'Restaurants', desc: 'Beste Restaurants und Bars in der Nähe von' },
    bg: { title: 'Ресторанти', desc: 'Най-добрите ресторанти и барове близо до' },
    ru: { title: 'Рестораны', desc: 'Лучшие рестораны и бары рядом с' },
    ro: { title: 'Restaurante', desc: 'Cele mai bune restaurante și baruri lângă' },
  },
  activities: {
    el: { title: 'Δραστηριότητες', desc: 'Αξιοθέατα και δραστηριότητες κοντά' },
    en: { title: 'Activities', desc: 'Attractions and activities near' },
    de: { title: 'Aktivitäten', desc: 'Sehenswürdigkeiten und Aktivitäten in der Nähe von' },
    bg: { title: 'Дейности', desc: 'Забележителности и дейности близо до' },
    ru: { title: 'Активности', desc: 'Достопримечательности и активности рядом с' },
    ro: { title: 'Activități', desc: 'Atracții și activități lângă' },
  },
};

export async function getVillageContentMeta(
  slug: string, locale: string, contentType: ContentType
): Promise<Metadata> {
  const supabase = createApiClient();
  const { data } = await supabase.from('villages')
    .select('name_el, name_en, area')
    .eq('slug', slug).single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = data as any;
  const villageName = row?.[`name_${locale}`] || row?.name_el || row?.name_en || slug;
  const labels = LABELS[contentType][locale] || LABELS[contentType].en;

  const title = `${labels.title} ${villageName} | Χαλκιδική - ChalkidikiHub`;
  const description = `${labels.desc} ${villageName}, Χαλκιδική. ${locale === 'el' ? 'Αξιολογήσεις, φωτογραφίες, χάρτης.' : 'Reviews, photos, map.'}`;

  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/places/${slug}/${contentType}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/places/${slug}/${contentType}`])),
    },
  };
}
