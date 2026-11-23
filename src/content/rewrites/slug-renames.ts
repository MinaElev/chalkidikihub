/**
 * Public URL slugs that differ from the database slug.
 *
 * v3 baked the wrong peninsula into some beach slugs (Glarokavos in Kassandra
 * was "-sithonia", the Kallikrateia beaches "-kassandra", Prassou near
 * Kalamitsi "-athos") and garbled others ("agjio-mama", "chanoti"). The
 * database is shared with the live v3 site, so its slugs stay as they are;
 * v4 serves the corrected slug, looks rows up by the database slug and 301s
 * the old URL (see seo/redirects.ts). Areas were checked against the nearest
 * villages' coordinates (OpenStreetMap-verified).
 *
 * Plain TS with no imports: next.config.ts loads this through redirects.ts.
 */
export const SLUG_RENAMES: Record<string, Record<string, string>> = {
  beaches: {
    'mykoniatika-nudist-beach-kassandra': 'mykoniatika-nudist-beach-mainland',
    'glarokavos-nudist-beach-sithonia': 'glarokavos-nudist-beach-kassandra',
    'prassou-beach-athos': 'prassou-beach-sithonia',
    'plagia-flogita-beach-kassandra': 'plagia-flogita-beach-mainland',
    'paralia-vergias-kassandra': 'paralia-vergias-mainland',
    'nea-kallikratia-beach-kassandra': 'nea-kallikratia-beach-mainland',
    'beach-of-anthoupolis-kassandra': 'beach-of-anthoupolis-mainland',
    'paralia-psakoydia-kassandra': 'paralia-psakoudia-mainland',
    'agjio-mama-kassandra': 'agios-mamas-beach-mainland',
    'golden-beach-sithonia': 'golden-beach-kassandra',
    'paralia-chanioti-sithonia': 'paralia-chanioti-kassandra',
    'paralia-chanoti-grecotel-sithonia': 'paralia-chanioti-grecotel-kassandra',
    'pefkochori-beach-sithonia': 'pefkochori-beach-kassandra',
    'peykochori-yalla-flegra-sithonia': 'pefkochori-yalla-flegra-kassandra',
    'chrousou-beach-sithonia': 'chrousou-beach-kassandra',
    'potidea-mainland': 'nea-potidaia-beach-kassandra',
    'kristina-beach-athos': 'kristina-beach-sithonia',
    'agridia-athos': 'agridia-beach-sithonia',
    'tigania-beach-athos': 'tigania-beach-sithonia',
    'alikes-beach-sithonia': 'alikes-beach-ammouliani-athos',
    // Ammouliani beaches are grouped with Athos, like the rest of the island's beaches.
    'tsaska-mainland': 'tsaska-athos',
    'kalopigado-mainland': 'kalopigado-athos',
    'karagatsia-mainland': 'karagatsia-athos',
    'faka-mainland': 'faka-athos',
  },
  // Stay URLs built by v3 from the owner's title + village: repeated words,
  // Greeklish, coordinates and postcodes. Stays already earning Google clicks
  // (src/content/proven-urls.json) keep their URL. The old URL 301s here.
  listings: {
    'anemoelia-ii-apartment-sithonia-sykia-chalkidikis': 'anemoelia-ii-apartment-sykia',
    'apartments-2-minutes-from-the-beach-pefkohori-peykochori': 'apartments-near-the-beach-pefkochori',
    'arroyo-suites-kalamitsi-sithonia-kalamitsi': 'arroyo-suites-kalamitsi',
    'diamerisma-pefkohori-peykochori-chalkidikis': 'apartment-pefkochori',
    'diorofi-katoikia-me-tzakoyzi-stin-nea-potidaia-nea-potidaia': 'two-storey-house-jacuzzi-nea-potidaia',
    'elasa-seaside-apartment-near-sea-nea-kallikratia-nea-kallikratia': 'elasa-seaside-apartment-nea-kallikratia',
    'fox-studios-sikia-500-meters-from-sikia-beach': 'fox-studios-sykia',
    'gaia-studios-apartments-in-nea-plagia-halkidiki-nea-plagia-halkidiki': 'gaia-studios-apartments-nea-plagia',
    'garden-sea-retreat-polytelis-mezoneta-sto-palioyri-akti-xenia-paliouri': 'garden-sea-retreat-maisonette-paliouri',
    'halikidiki-family-house-to-enjoy-by-the-beach-akti-mikiverna': 'family-beach-house-akti-mikiverna',
    'imperium-luxe-villas-101-102-nikiti-chalkidikis-ellada': 'imperium-luxe-villas-nikiti',
    'maisonettes-in-paradisos-beach-paradeisos-neou-marmara-2': 'maisonettes-paradisos-beach-neos-marmaras',
    'mikro-diamerisma-konta-stin-thalassa-vourvouroy-sithonia': 'small-apartment-near-the-sea-vourvourou',
    'monokatoikia-stin-paralia-40-2667222-23-184278nea-plagia-chalkidikis': 'beach-house-nea-plagia',
    'nea-potidaia-sale-nea-potidaia-chalkidikis': 'nea-potidaia-chalet',
    'paratheristiki-katoikia-konta-stin-thalassa-galini-kallikrateias': 'holiday-home-near-the-sea-galini-kallikratia',
    'sea-la-vie-anebodisti-thea-sti-thalassa-sti-sithonia-akti-kalogrias': 'sea-la-vie-sea-view-akti-kalogrias',
    'sea-star-lux-pefkohori-apartment-pefkochori-630-85': 'sea-star-lux-apartment-pefkochori',
    'sea-star-lux-trikorfo-apartments-sitonia-trikorfo-beach-sithonia': 'sea-star-lux-trikorfo-apartments-sithonia',
    'stoyntio-konta-sti-thalassa-sti-vourvouroy-vourvouroy-sithonia': 'studio-near-the-sea-vourvourou',
    'three-stylish-appartments-with-sea-view-nea-potidaia-halkidiki-nea-potidaia-dyti-3': 'three-sea-view-apartments-nea-potidaia',
    'xenodocheio-3-asteron-stin-chanipsoti-chalkifkis-hanioti': 'olympic-kosmas-hotel-hanioti',
  },
};

const REVERSE: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(SLUG_RENAMES).map(([t, m]) => [t, Object.fromEntries(Object.entries(m).map(([a, b]) => [b, a]))]),
);

/** Slug used in URLs for a database slug. */
export const publicSlug = (table: string, slug: string) => SLUG_RENAMES[table]?.[slug] ?? slug;
/** Database slug for a URL slug. */
export const dbSlug = (table: string, slug: string) => REVERSE[table]?.[slug] ?? slug;
