import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';
import { createApiClient } from '@/lib/api-helpers';
import { AREAS } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Revalidate sitemap every hour (ISR)
export const revalidate = 3600;

/** Build locale-prefixed URL: default locale (el) has no prefix */
function localeUrl(locale: string, path: string) {
  return locale === defaultLocale
    ? `${baseUrl}${path || '/'}`
    : `${baseUrl}/${locale}${path}`;
}

function alt(path: string) {
  return {
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localeUrl(l, path)])),
      'x-default': localeUrl(defaultLocale, path),
    },
  };
}

function forLocales(
  path: string,
  opts: { freq: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number; modified?: Date },
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified: opts.modified || new Date(),
    changeFrequency: opts.freq,
    priority: opts.priority,
    alternates: alt(path),
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const supabase = createApiClient();

  // ── Homepage ──
  entries.push(...forLocales('', { freq: 'daily', priority: 1 }));

  // ── Static pages ──
  const staticPages = [
    { path: '/listings', priority: 0.9, freq: 'daily' as const },
    { path: '/beaches', priority: 0.9, freq: 'daily' as const },
    { path: '/restaurants', priority: 0.9, freq: 'daily' as const },
    { path: '/activities', priority: 0.8, freq: 'weekly' as const },
    { path: '/ev-chargers', priority: 0.7, freq: 'weekly' as const },
    { path: '/blog', priority: 0.8, freq: 'daily' as const },
    { path: '/sales', priority: 0.9, freq: 'daily' as const },
    { path: '/areas', priority: 0.8, freq: 'weekly' as const },
    { path: '/map', priority: 0.6, freq: 'weekly' as const },
    { path: '/about', priority: 0.7, freq: 'monthly' as const },
    { path: '/contact', priority: 0.5, freq: 'monthly' as const },
    { path: '/for-owners', priority: 0.7, freq: 'monthly' as const },
    { path: '/for-owners/services', priority: 0.8, freq: 'monthly' as const },
    { path: '/terms', priority: 0.3, freq: 'yearly' as const },
    { path: '/privacy', priority: 0.3, freq: 'yearly' as const },
  ];
  for (const page of staticPages) {
    entries.push(...forLocales(page.path, { freq: page.freq, priority: page.priority }));
  }

  // ── Areas ──
  for (const area of AREAS) {
    entries.push(...forLocales(`/areas/${area.slug}`, { freq: 'weekly', priority: 0.8 }));
  }

  // ── Host pages (owners with ≥2 published listings + public_page_enabled) ──
  const { data: publicProfiles } = await supabase
    .from('profiles')
    .select('id, public_slug, updated_at')
    .eq('public_page_enabled', true)
    .not('public_slug', 'is', null);
  if (publicProfiles?.length) {
    const ownerIds = publicProfiles.map((p: { id: string }) => p.id);
    const { data: hostListings } = await supabase
      .from('listings').select('owner_id')
      .in('owner_id', ownerIds).eq('status', 'published');
    const counts = new Map<string, number>();
    for (const l of hostListings || []) {
      const k = (l as { owner_id: string }).owner_id;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    for (const p of publicProfiles as Array<{ id: string; public_slug: string; updated_at?: string }>) {
      if ((counts.get(p.id) || 0) >= 2) {
        entries.push(...forLocales(`/host/${p.public_slug}`, {
          freq: 'weekly', priority: 0.7,
          modified: p.updated_at ? new Date(p.updated_at) : undefined,
        }));
      }
    }
  }

  // ── Beaches (DB + area + features) ──
  const { data: beaches } = await supabase.from('beaches').select('slug, updated_at');
  if (beaches) {
    for (const item of beaches) {
      entries.push(...forLocales(`/beaches/${item.slug}`, {
        freq: 'weekly', priority: 0.7,
        modified: item.updated_at ? new Date(item.updated_at) : undefined,
      }));
    }
  }
  for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
    entries.push(...forLocales(`/beaches/area/${area}`, { freq: 'weekly', priority: 0.7 }));
  }
  for (const feat of ['sandy', 'pebble', 'organized', 'free', 'shallowWater', 'waterSports', 'accessible', 'beachBar', 'sunbeds', 'lifeguard', 'nudist', 'parking']) {
    entries.push(...forLocales(`/beaches/feature/${feat}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Restaurants (DB + categories + area) ──
  const { data: restaurants } = await supabase.from('restaurants').select('slug, updated_at');
  if (restaurants) {
    for (const item of restaurants) {
      entries.push(...forLocales(`/restaurants/${item.slug}`, {
        freq: 'monthly', priority: 0.7,
        modified: item.updated_at ? new Date(item.updated_at) : undefined,
      }));
    }
  }
  const { data: businessTypes } = await supabase.from('business_types').select('slug');
  if (businessTypes) {
    for (const bt of businessTypes) {
      entries.push(...forLocales(`/restaurants/category/${bt.slug}`, { freq: 'weekly', priority: 0.7 }));
    }
  }
  for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
    entries.push(...forLocales(`/restaurants/area/${area}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Listings (DB) ──
  const { data: listings } = await supabase
    .from('listings')
    .select('slug, updated_at, tagline_el, tagline_en, owner_story_el, owner_story_en')
    .eq('status', 'published');
  if (listings) {
    for (const item of listings) {
      const modified = new Date(item.updated_at);
      entries.push(...forLocales(`/listings/${item.slug}`, {
        freq: 'weekly', priority: 0.8, modified,
      }));
      // Dedicated brand page — only indexed when the owner has filled in
      // at least one of tagline / owner_story (otherwise it's essentially
      // duplicate content of the directory listing).
      const hasBrand = [item.tagline_el, item.tagline_en, item.owner_story_el, item.owner_story_en]
        .some((v: string | null) => (v || '').trim().length > 0);
      if (hasBrand) {
        entries.push(...forLocales(`/stay/${item.slug}`, {
          freq: 'weekly', priority: 0.9, modified,
        }));
      }
      // Area guide page — distinct SEO surface (TouristAttraction schema,
      // area-first H1, POI+itinerary content). Added for every listing,
      // not gated on hasBrand, since the content comes from the area — not the owner.
      entries.push(...forLocales(`/stay/${item.slug}/guide`, {
        freq: 'weekly', priority: 0.8, modified,
      }));
    }
  }
  for (const t of ['with-pool', 'sea-view', 'pet-friendly', 'family', 'budget', 'luxury']) {
    entries.push(...forLocales(`/listings/type/${t}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Activities (DB + categories + area) ──
  const { data: activities } = await supabase.from('activities').select('slug, updated_at');
  if (activities) {
    for (const item of activities) {
      entries.push(...forLocales(`/activities/${item.slug}`, {
        freq: 'monthly', priority: 0.7,
        modified: item.updated_at ? new Date(item.updated_at) : undefined,
      }));
    }
  }
  for (const cat of ['historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious']) {
    entries.push(...forLocales(`/activities/category/${cat}`, { freq: 'weekly', priority: 0.7 }));
  }
  for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
    entries.push(...forLocales(`/activities/area/${area}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Blog (DB + categories) ──
  const { data: articles } = await supabase.from('blog_articles').select('slug, published_at, updated_at');
  if (articles) {
    for (const item of articles) {
      entries.push(...forLocales(`/blog/${item.slug}`, {
        freq: 'monthly', priority: 0.8,
        modified: new Date(item.updated_at || item.published_at),
      }));
    }
  }
  for (const cat of ['guides', 'beaches', 'food', 'activities', 'tips', 'culture']) {
    entries.push(...forLocales(`/blog/category/${cat}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Sales (DB + types + area) ──
  const { data: sales } = await supabase.from('sales').select('slug, updated_at').eq('status', 'published');
  if (sales) {
    for (const item of sales) {
      entries.push(...forLocales(`/sales/${item.slug}`, {
        freq: 'weekly', priority: 0.8,
        modified: item.updated_at ? new Date(item.updated_at) : undefined,
      }));
    }
  }
  for (const pt of ['house', 'apartment', 'land', 'commercial', 'other']) {
    entries.push(...forLocales(`/sales/category/${pt}`, { freq: 'weekly', priority: 0.7 }));
  }
  for (const area of ['kassandra', 'sithonia', 'athos', 'mainland']) {
    entries.push(...forLocales(`/sales/area/${area}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Villages / Places (DB) ──
  const { data: villages } = await supabase.from('villages').select('slug');
  if (villages) {
    for (const v of villages) {
      for (const ct of ['', '/beaches', '/restaurants', '/activities']) {
        entries.push(...forLocales(`/places/${v.slug}${ct}`, {
          freq: 'weekly', priority: ct === '' ? 0.8 : 0.7,
        }));
      }
    }
  }

  // ── Mount Athos ──
  const mountAthosPages = ['', '/monasteries', '/how-to-visit', '/getting-there', '/accommodation', '/daily-life', '/hiking', '/history'];
  for (const page of mountAthosPages) {
    entries.push(...forLocales(`/mount-athos${page}`, { freq: 'monthly', priority: 0.8 }));
  }
  const monasterySlugs = [
    'megisti-lavra', 'vatopedi', 'iviron', 'chilandariou', 'dionysiou', 'koutloumousiou',
    'pantokratoros', 'xeropotamou', 'zografou', 'dochiariou', 'karakalou', 'philotheou',
    'simonos-petras', 'agiou-pavlou', 'stavronikita', 'xenofontos', 'gregoriou',
    'esphigmenou', 'agiou-panteleimonos', 'konstamonitou',
  ];
  for (const slug of monasterySlugs) {
    entries.push(...forLocales(`/mount-athos/monasteries/${slug}`, { freq: 'monthly', priority: 0.8 }));
  }

  // ── Programmatic location pages ──
  const locationSlugs = ['afytos','kallithea','hanioti','pefkohori','siviri','polychrono','possidi','nea-fokea','nikiti','vourvourou','neos-marmaras','sarti','toroni','porto-koufo','ouranoupoli','arnea','nea-moudania'];
  const locationCategories = ['beaches','restaurants','activities','listings'];
  for (const loc of locationSlugs) {
    for (const cat of locationCategories) {
      entries.push(...forLocales(`/in/${loc}/${cat}`, { freq: 'weekly', priority: 0.7 }));
    }
  }

  // ── RSS Feed ──
  entries.push({
    url: `${baseUrl}/feed.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.5,
  });

  // ── Ghost pages (guides, best-of) ──
  for (const g of [
    'summer', 'easter', 'honeymoon', 'families', 'budget', 'winter', 'nightlife',
    'june', 'july-august', 'september', 'getting-here', 'kassandra-vs-sithonia',
    // TIER 1
    'weather', 'best-time-to-visit', 'hotels', 'all-inclusive', 'car-rental', 'camping', 'villages', 'map',
    // TIER 2
    'food-and-wine', 'ammouliani-island', 'thessaloniki-to-halkidiki', 'road-trip', 'luxury', 'villas', 'may', 'october', 'boat-tours', 'with-dogs', 'diving',
    // TIER 3
    'halkidiki-vs-thassos', 'sithonia', 'kassandra', 'day-trips', 'wedding', 'driving-distances', 'aristotle-trail', 'sunset-spots', 'shopping-and-souvenirs',
    // TIER 4 — comparisons, niche audiences, tips
    'halkidiki-vs-crete', 'halkidiki-vs-rhodes', 'halkidiki-vs-corfu',
    'for-seniors', 'for-couples', 'for-solo-travelers',
    'tips', 'mistakes-to-avoid', 'scams-to-avoid',
  ]) {
    entries.push(...forLocales(`/guide/${g}`, { freq: 'monthly', priority: 0.8 }));
  }
  // Best-of index page — single entry point, helps Google discover all /best/[slug] via crawl
  entries.push(...forLocales('/best', { freq: 'weekly', priority: 0.8 }));
  for (const g of ['beaches-kassandra', 'beaches-sithonia', 'family-beaches', 'quiet-beaches', 'seafood-restaurants', 'beach-bars', 'romantic-restaurants', 'hiking-trails', 'historical-sites', 'water-sports', 'restaurants-kassandra', 'restaurants-sithonia', 'free-beaches', 'luxury-hotels', 'camping-spots', 'instagram-spots', 'kids-activities', 'snorkeling-spots', 'romantic-getaways', 'traditional-tavernas']) {
    entries.push(...forLocales(`/best/${g}`, { freq: 'weekly', priority: 0.8 }));
  }
  // Listing filter pages — listed directly so Google discovers each variant
  for (const t of ['with-pool', 'sea-view', 'pet-friendly', 'family', 'budget', 'luxury']) {
    entries.push(...forLocales(`/listings/type/${t}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── FAQ pages ──
  entries.push(...forLocales('/faq', { freq: 'monthly', priority: 0.7 }));
  entries.push(...forLocales('/places', { freq: 'weekly', priority: 0.7 }));
  for (const f of ['beaches', 'accommodation', 'transport', 'food-and-drink', 'practical', 'activities']) {
    entries.push(...forLocales(`/faq/${f}`, { freq: 'monthly', priority: 0.8 }));
  }

  // ── Beach feature pages ──
  for (const f of ['sandy', 'pebble', 'organized', 'free', 'parking', 'beachBar', 'shallowWater', 'waterSports', 'accessible', 'sunbeds', 'lifeguard', 'nudist']) {
    entries.push(...forLocales(`/beaches/feature/${f}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Restaurant category pages ──
  for (const c of ['traditional', 'seafood', 'pizza', 'grill', 'brunch', 'beach-bar', 'cafe', 'bakery', 'souvlaki', 'fine-dining']) {
    entries.push(...forLocales(`/restaurants/category/${c}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── Activity category pages ──
  for (const c of ['historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious']) {
    entries.push(...forLocales(`/activities/category/${c}`, { freq: 'weekly', priority: 0.7 }));
  }

  // ── "Travel from [City]" pages ──
  for (const c of ['sofia', 'bucharest', 'belgrade', 'thessaloniki', 'munich', 'istanbul', 'skopje', 'athens']) {
    entries.push(...forLocales(`/from/${c}`, { freq: 'monthly', priority: 0.8 }));
  }

  // ── Itinerary pages ──
  for (const d of ['3-days', '5-days', '7-days', '10-days', 'weekend']) {
    entries.push(...forLocales(`/itinerary/${d}`, { freq: 'monthly', priority: 0.8 }));
  }

  // ── Cost guide pages ──
  for (const t of ['daily-budget', 'food-prices', 'accommodation-prices', 'car-rental-prices', 'family-budget']) {
    entries.push(...forLocales(`/costs/${t}`, { freq: 'monthly', priority: 0.8 }));
  }

  return entries;
}
