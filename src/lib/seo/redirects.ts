/**
 * Every permanent redirect the site serves, generated for all locales.
 *
 * Two families:
 *  1. LEGACY — carried over verbatim from v3 (renamed slugs, merged articles).
 *  2. CONSOLIDATION (v4, 2026-10) — duplicate URL patterns folded into the one
 *     page that answers the query. Chosen from 90-day GSC data
 *     (audit/gsc-coverage.csv): a pattern was kept when it earned clicks or
 *     ≥200 impressions, otherwise merged into the page that owns the intent.
 *     Pages with zero impressions and no successor are simply removed (404),
 *     because redirecting to an unrelated page is a soft-404 to Google.
 *
 * Imported by next.config.ts (plain TS, no path aliases).
 */

type Rule = { source: string; destination: string; permanent: true };

const PREFIX = '/:locale(en|de|ro|bg|sr|ru)';

/** Emits the rule for Greek (unprefixed) and for every prefixed locale. */
function both(from: string, to: string): Rule[] {
  return [
    { source: from, destination: to, permanent: true },
    { source: `${PREFIX}${from}`, destination: `/:locale${to}`, permanent: true },
  ];
}

const AREAS = ['kassandra', 'sithonia', 'athos', 'mainland'];

/** /in/{location}/… → village slug (computed from v3 location-data vs villages table). */
export const IN_LOCATION_TO_VILLAGE: Record<string, string> = {
  afytos: 'afytos', kallithea: 'kallithea', hanioti: 'hanioti', pefkohori: 'pefkohori',
  siviri: 'siviri', polychrono: 'polychrono', possidi: 'posidi', posidi: 'posidi',
  'nea-fokea': 'nea-fokaia', kalamitsi: 'kalamitsi', kriopigi: 'kriopigi', fourka: 'fourka',
  paliouri: 'paliouri', 'nea-potidaia': 'nea-potidaia', 'nea-skioni': 'nea-skioni',
  kassandrino: 'kassandrino', kalandra: 'kalandra', nikiti: 'nikiti', vourvourou: 'vourvourou',
  'neos-marmaras': 'neos-marmaras', sarti: 'sarti', toroni: 'toroni', 'porto-koufo': 'porto-koufo',
  sikia: 'sikia', metamorfosi: 'metamorfosi', 'ormos-panagias': 'ormos-panagias',
  'agios-nikolaos': 'agios-nikolaos', parthenonas: 'parthenonas', ouranoupoli: 'ouranoupoli',
  ierissos: 'ierissos', 'nea-roda': 'nea-roda', stagira: 'stagira', olympiada: 'olympiada',
  tripiti: 'tripiti', stratoni: 'stratoni', stratoniki: 'stratoniki', pyrgadikia: 'pyrgadikia',
  'megali-panagia': 'megali-panagia', gomati: 'gomati', arnea: 'arnaia',
  'nea-moudania': 'nea-moudania', polygyros: 'polygyros', vrasta: 'vrasta', galatista: 'galatista',
  taxiarchis: 'taxiarhis', palaiohori: 'palaiohori', palaiokastro: 'palaiokastro',
  'agia-paraskevi': 'agia-paraskevi', 'loutra-agias-paraskevis': 'loutra-agias-paraskevis',
  'mola-kalyva': 'mola-kalyva', flogita: 'flogita', 'nea-plagia': 'nea-plagia',
  'nea-triglia': 'nea-triglia', planitsi: 'planitsi', neohori: 'neohori', doumbia: 'doumbia',
  elia: 'elia', xiropotamo: 'xiropotamo', simantra: 'simantra', olynthos: 'olynthos',
  'kalyves-polygyrou': 'kalyves-polygyrou', portaria: 'portaria', sanos: 'sanos',
  zografou: 'zografou', varvara: 'varvara', gerakini: 'gerakini',
};

/** Guides folded into a stronger page that owns the same intent. */
export const GUIDE_MERGES: Record<string, string> = {
  sithonia: '/areas/sithonia',
  kassandra: '/areas/kassandra',
  villages: '/places',
  map: '/map',
  'getting-here': '/from',
  'thessaloniki-to-halkidiki': '/from/thessaloniki',
  may: '/guide/best-time-to-visit',
  june: '/guide/best-time-to-visit',
  'july-august': '/guide/best-time-to-visit',
  september: '/guide/best-time-to-visit',
  october: '/guide/best-time-to-visit',
  winter: '/guide/best-time-to-visit',
  summer: '/guide/best-time-to-visit',
  easter: '/guide/best-time-to-visit',
  'car-rental': '/costs/car-rental-prices',
  budget: '/costs/daily-budget',
  diving: '/blog/chalkidiki-diving',
  families: '/blog/halkidiki-with-kids-complete-guide',
  'ammouliani-island': '/blog/ammouliani-island-complete-guide',
  'road-trip': '/guide/day-trips',
  'aristotle-trail': '/best/hiking-trails',
  hotels: '/listings',
  luxury: '/listings',
  villas: '/listings',
  'all-inclusive': '/listings',
  nightlife: '/activities',
};

export const BEST_MERGES: Record<string, string> = {
  'free-beaches': '/beaches/feature/free',
  'family-beaches': '/blog/best-beaches-shallow-water',
  'camping-spots': '/guide/camping',
  'romantic-getaways': '/listings',
  'luxury-hotels': '/listings',
};

/** Beach feature pages: kept ones stay; these fold elsewhere. */
export const FEATURE_MERGES: Record<string, string> = {
  shallowWater: '/blog/best-beaches-shallow-water',
  beachBar: '/best/beach-bars',
  waterSports: '/best/water-sports',
  organized: '/beaches',
  lifeguard: '/beaches',
};
export const KEPT_FEATURES = ['nudist', 'free', 'parking', 'accessible', 'pebble', 'blue-flag', 'sunbeds', 'sandy'];

export const KEPT_RESTAURANT_CATEGORIES = ['brunch'];
export const RESTAURANT_CATEGORY_MERGES: Record<string, string> = {
  seafood: '/best/seafood-restaurants',
  traditional: '/best/traditional-tavernas',
  beachBar: '/best/beach-bars',
};

export const ITINERARY_MERGES: Record<string, string> = {
  weekend: '/itinerary/3-days',
  budget: '/costs/daily-budget',
  romantic: '/itinerary/7-days',
  family: '/blog/halkidiki-with-kids-complete-guide',
};

export const FAQ_TOPICS = ['food-and-drink', 'beaches', 'transport', 'practical', 'accommodation', 'activities'];

/**
 * v3 village guides (/blog/odigos-gia-{village}, AI-written) duplicated the village
 * pages and two described places that do not exist under those names. Each folds
 * into the verified village page; the articles leave the blog index.
 */
export const BLOG_TO_PLACE: Record<string, string> = {
  'odigos-gia-siviri': 'siviri',
  'odigos-gia-stagira': 'stagira',
  'odigos-gia-kalamitsi': 'kalamitsi',
  'odigos-gia-kalandra': 'kalandra',
  'odigos-gia-nea-skioni': 'nea-skioni',
  'odigos-gia-pyrgadikia': 'pyrgadikia',
  'odigos-gia-nea-moudania': 'nea-moudania',
  'odigos-gia-simantra': 'simantra',
  'odigos-gia-agios-nikolaos': 'agios-nikolaos',
  'odigos-gia-galatista': 'galatista',
  'odigos-gia-posidi': 'posidi',
  'odigos-gia-stratoniki': 'stratoniki',
  'odigos-gia-olynthos': 'olynthos',
  'odigos-gia-kalyves-polygyrou': 'kalyves-polygyrou',
  'odigos-gia-stratoni': 'stratoni',
  'odigos-gia-kriopigi': 'kriopigi',
  'odigos-gia-polychrono': 'polychrono',
  'odigos-gia-tripiti': 'tripiti',
  'odigos-gia-kallithea': 'kallithea',
  'odigos-gia-pefkohori': 'pefkohori',
  'odigos-gia-nea-triglia': 'nea-triglia',
  'odigos-gia-nea-potidaia': 'nea-potidaia',
  'odigos-gia-agia-paraskevi': 'agia-paraskevi',
  'odigos-gia-arnaia': 'arnaia',
  'odigos-gia-portaria': 'portaria',
  'odigos-gia-sarti': 'sarti',
  'odigos-gia-taxiarhis': 'taxiarhis',
  'odigos-gia-fourka': 'fourka',
  'odigos-gia-mola-kalyva': 'mola-kalyva',
  'odigos-gia-kassandrino': 'kassandrino',
  'odigos-gia-vourvourou': 'vourvourou',
  'odigos-gia-gomati': 'gomati',
  'odigos-gia-varvara': 'varvara',
  'odigos-gia-nea-plagia': 'nea-plagia',
  'odigos-gia-nea-roda': 'nea-roda',
  'odigos-gia-vrasta': 'vrasta',
  'odigos-gia-gerakini': 'gerakini',
  'odigos-gia-metamorfosi': 'metamorfosi',
  'odigos-gia-olympiada': 'olympiada',
  'odigos-gia-xiropotamo': 'xiropotamo',
  'odigos-gia-ormos-panagias': 'ormos-panagias',
  'odigos-gia-toroni': 'toroni',
  'odigos-gia-palaiohori': 'palaiohori',
  'odigos-gia-nea-fokaia': 'nea-fokaia',
  'odigos-gia-elia': 'elia',
  'odigos-gia-paliouri': 'paliouri',
  'odigos-gia-flogita': 'flogita',
  'odigos-gia-megali-panagia': 'megali-panagia',
  'odigos-gia-parthenonas': 'parthenonas',
  'odigos-gia-doumbia': 'doumbia',
  'odigos-gia-palaiokastro': 'palaiokastro',
  'odigos-gia-polygyros': 'polygyros',
  'odigos-gia-nikiti': 'nikiti',
  'odigos-gia-neohori': 'neohori',
  'odigos-gia-hanioti': 'hanioti',
  'odigos-gia-sanos': 'sanos',
  'odigos-gia-zografou': 'zografou',
  'odigos-gia-ierissos': 'ierissos',
  'odigos-gia-planitsi': 'planitsi',
  'afytos-village-guide': 'afytos',
  'sykia-chalkidiki': 'sikia',
};

/**
 * Blog articles below the quality gate in every locale, with no clicks, whose
 * topic a stronger page already covers. Folded into that page.
 */
export const BLOG_MERGES: Record<string, string> = {
  'things-to-do-halkidiki': '/activities',
  'snorkeling-beaches-halkidiki': '/activities/sithonia-snorkeling-sithonia',
  'drastiriotita-mountain-biking-halkidiki': '/activities/sithonia-cycling-trail-sithonia',
  'halkidiki-in-winter': '/guide/winter',
  'halkidiki-in-august': '/guide/july-august',
  'halkidiki-in-may-june': '/guide/may',
};

const LEGACY_SLUG_FIXES: Array<[string, string]> = [
  ['/restaurants/Mellto-Gelato-sarti', '/restaurants/mellto-gelato-sarti'],
  ['/restaurants/Bakery-pargas', '/restaurants/bakery-pargas'],
  ['/restaurants/The-Center-Fast-Food-sykia', '/restaurants/the-center-fast-food-sykia'],
  ['/blog/Palm3-Waterpark', '/blog/palm3-waterpark'],
  ['/blog/BARbatolis', '/blog/barbatolis'],
  ['/blog/Tiki-Bar-vourvourou', '/blog/tiki-bar-vourvourou'],
  ['/blog/Yucca-Beach-Bar', '/blog/yucca-beach-bar'],
  ['/blog/Dish-of-the-Day', '/blog/dish-of-the-day'],
  ['/blog/Chalkidiki-diving', '/blog/chalkidiki-diving'],
  ['/blog/odigos-gia-afytos', '/places/afytos'],
  ['/blog/odigos-gia-sikia', '/places/sikia'],
  ['/blog/odigos-gia-pyrgadikia-mainland', '/places/pyrgadikia'],
  ['/blog/when-to-visit-halkidiki', '/blog/best-time-to-visit-halkidiki'],
  ['/blog/family-vacation-halkidiki', '/blog/halkidiki-with-kids-complete-guide'],
  ['/blog/oi-kalyteres-paralies-kassandras', '/blog/keyword-oi-kalyteres-paralies-kassandras'],
  ['/blog/odigos-gia-ammouliani', '/blog/ammouliani-island-complete-guide'],
  ['/blog/paralia-sani-kassandra', '/beaches/sani-kassandra'],
  ['/blog/paralia-sithonia-klimataria-beach', '/beaches/sithonia-klimataria-beach'],
  ['/blog/paralia-sarti-athos', '/beaches/sarti-sithonia'],
  ['/beaches/vourvourou-beach-sithonia', '/beaches/vourvourou-sithonia'],
  ['/blog/carWash', '/blog'],
  ['/blog/tiki-Floating', '/blog'],
  ['/places/pyrgadikia-mainland', '/places/pyrgadikia'],
  // Duplicate of the beach page (same place, thinner text, wrong distances).
  ['/activities/toroni-beach-sithonia', '/beaches/toroni-beach-sithonia'],
];

export function buildRedirects(): Rule[] {
  const rules: Rule[] = [];

  for (const [from, to] of LEGACY_SLUG_FIXES) rules.push(...both(from, to));
  for (const [article, village] of Object.entries(BLOG_TO_PLACE)) rules.push(...both(`/blog/${article}`, `/places/${village}`));
  for (const [article, to] of Object.entries(BLOG_MERGES)) rules.push(...both(`/blog/${article}`, to));
  rules.push(...both('/places/pyrgadikia-mainland/:path*', '/places/pyrgadikia/:path*'));

  // /stay/{slug} stays live as the owner's shareable brand page (noindex,
  // canonical → /listings/{slug}); its area guide folds into the QR guest guide.
  rules.push(...both('/stay/:slug/guide', '/guest/:slug'));

  // /in/{location}/{category} (duplicate of /places/{village}/{category}) is
  // answered by app/[locale]/in/[location]/[category]/route.ts through
  // resolveInLocation() — ~540 static rules would crowd Vercel's route table.
  rules.push(...both('/places/:slug/listings', '/places/:slug'));

  // Area facets duplicated the peninsula hubs.
  for (const area of AREAS) {
    for (const section of ['beaches', 'restaurants', 'activities', 'sales']) {
      rules.push(...both(`/${section}/area/${area}`, `/areas/${area}`));
    }
  }

  for (const [slug, to] of Object.entries(GUIDE_MERGES)) rules.push(...both(`/guide/${slug}`, to));
  for (const [slug, to] of Object.entries(BEST_MERGES)) rules.push(...both(`/best/${slug}`, to));
  for (const [f, to] of Object.entries(FEATURE_MERGES)) rules.push(...both(`/beaches/feature/${f}`, to));
  for (const [c, to] of Object.entries(RESTAURANT_CATEGORY_MERGES)) {
    rules.push(...both(`/restaurants/category/${c}`, to));
  }
  for (const [d, to] of Object.entries(ITINERARY_MERGES)) rules.push(...both(`/itinerary/${d}`, to));
  for (const t of FAQ_TOPICS) rules.push(...both(`/faq/${t}`, '/faq'));

  rules.push(...both('/activities/category/boatTrips', '/guide/boat-tours'));
  rules.push(...both('/from/munich', '/from'));
  rules.push(...both('/best', '/guide'));
  // Per-charger pages were thin third-party records; the hub lists them all.
  rules.push(...both('/ev-chargers/:slug', '/ev-chargers'));

  // Remaining facet families: every member folds into its collection. These
  // come last so the specific rules above win (Next matches in order).
  rules.push(...both('/restaurants/category/:type((?!brunch$).*)', '/restaurants'));
  rules.push(...both('/activities/category/:category', '/activities'));
  rules.push(...both('/listings/type/:type', '/listings'));
  rules.push(...both('/blog/category/:category', '/blog'));
  rules.push(...both('/sales/category/:type', '/sales'));

  return rules;
}

/** Target for a legacy /in/{location}/{category} URL, or null if unknown. */
export function resolveInLocation(location: string, category: string): string | null {
  if (location === 'dionysiou') return '/mount-athos/monasteries/dionysiou';
  const village = IN_LOCATION_TO_VILLAGE[location];
  if (!village) return null;
  return ['beaches', 'restaurants', 'activities'].includes(category)
    ? `/places/${village}/${category}`
    : `/places/${village}`;
}
