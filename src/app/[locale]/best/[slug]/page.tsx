import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Waves, UtensilsCrossed, Landmark, ChevronRight, Trophy } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BeachCard } from '@/components/listings/BeachCard';
import { RestaurantCard } from '@/components/listings/RestaurantCard';
import { ActivityCard } from '@/components/listings/ActivityCard';
import { createApiClient } from '@/lib/api-helpers';
import { transformBeach, transformRestaurant, transformActivity } from '@/lib/data';
import { getBestGuide, BEST_GUIDES, type BestGuide } from './best-data';
import { localeUrl } from '@/lib/seo';
import { FaqSection } from '@/components/ui/FaqSection';
import { generateBestGuideFaqs } from '@/lib/faq-generators';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const ICONS: Record<string, typeof Waves> = { Waves, UtensilsCrossed, Landmark };

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return BEST_GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBestGuide(slug);
  if (!guide) return { title: 'Not Found' };

  const title = guide.metaTitle[locale] || guide.metaTitle.en;
  const desc = guide.metaDesc[locale] || guide.metaDesc.en;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub', images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=best`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description: desc, images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&type=best`] },
    alternates: {
      canonical: localeUrl(locale, `best/${slug}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `best/${slug}`)])),
        'x-default': localeUrl('el', `best/${slug}`),
      },
    },
  };
}

async function fetchGuideItems(guide: BestGuide): Promise<Record<string, unknown>[]> {
  const u = new URL(guide.apiUrl, 'http://_');
  const area = u.searchParams.get('area');
  const feature = u.searchParams.get('feature');
  const limitParam = u.searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : null;

  const supabase = createApiClient();
  let items: Record<string, unknown>[] = [];

  if (guide.contentType === 'beaches') {
    let q = supabase.from('beaches').select('*, beach_reviews(*)').order('rating', { ascending: false });
    if (area) q = q.eq('area', area);
    if (feature) q = q.contains('features', [feature]);
    if (limit) q = q.limit(limit);
    const { data } = await q;
    items = (data || []).map((r) => transformBeach(r as Record<string, unknown>) as Record<string, unknown>);
  } else if (guide.contentType === 'restaurants') {
    let q = supabase.from('restaurants').select('*, restaurant_reviews(*)').order('rating', { ascending: false });
    if (area) q = q.eq('area', area);
    if (limit) q = q.limit(limit);
    const { data } = await q;
    items = (data || []).map((r) => transformRestaurant(r as Record<string, unknown>) as Record<string, unknown>);
  } else if (guide.contentType === 'activities') {
    let q = supabase.from('activities').select('*, activity_reviews(*)').order('rating', { ascending: false });
    if (area) q = q.eq('area', area);
    if (limit) q = q.limit(limit);
    const { data } = await q;
    items = (data || []).map((r) => transformActivity(r as Record<string, unknown>) as Record<string, unknown>);
  }

  if (guide.filterFn && guide.filterValue) {
    const key = guide.filterFn;
    const val = guide.filterValue;
    items = items.filter((item) => {
      const v = item[key];
      if (Array.isArray(v)) return v.includes(val);
      return String(v) === val;
    });
  }

  return items;
}

export default async function BestOfPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getBestGuide(slug);
  if (!guide) notFound();

  const title = guide.title[locale] || guide.title.en;
  const desc = guide.description[locale] || guide.description.en;

  const items = await fetchGuideItems(guide);

  const tHome = locale === 'el' ? 'Αρχική' : 'Home';
  const tResults = locale === 'el' ? 'αποτελέσματα' : 'results';
  const tNoResults = locale === 'el' ? 'Δεν βρέθηκαν αποτελέσματα' : 'No results found';
  const tMore = locale === 'el' ? 'Περισσότεροι Οδηγοί' : 'More Guides';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description: desc,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 10).map((item, i) => {
      const name = item.name as Record<string, string> | undefined;
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Thing',
          name: name?.[locale] || name?.el || name?.en || '',
        },
      };
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">{tHome}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{title}</span>
      </nav>

      <div className={`bg-gradient-to-br from-${guide.color}-600 to-${guide.color}-700 rounded-2xl p-8 text-white mb-8`}>
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-6 h-6 text-yellow-300" />
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Best of Halkidiki</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-white/80">{desc}</p>
        <p className="text-white/60 text-sm mt-3">{items.length} {tResults}</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {items.map((item: any, i: number) => {
            if (guide.contentType === 'beaches') return <BeachCard key={item.id || i} beach={item} />;
            if (guide.contentType === 'restaurants') return <RestaurantCard key={item.id || i} restaurant={item} />;
            if (guide.contentType === 'activities') return <ActivityCard key={item.id || i} activity={item} />;
            return null;
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">{tNoResults}</div>
      )}

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{tMore}</h2>
        <div className="flex flex-wrap gap-2">
          {BEST_GUIDES.filter(g => g.slug !== slug).slice(0, 6).map(g => (
            <Link key={g.slug} href={`/best/${g.slug}`}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              {g.title[locale] || g.title.en}
            </Link>
          ))}
        </div>
      </div>

      <FaqSection faqs={generateBestGuideFaqs(guide, items.length, locale)} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
