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
};

const REVERSE: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(SLUG_RENAMES).map(([t, m]) => [t, Object.fromEntries(Object.entries(m).map(([a, b]) => [b, a]))]),
);

/** Slug used in URLs for a database slug. */
export const publicSlug = (table: string, slug: string) => SLUG_RENAMES[table]?.[slug] ?? slug;
/** Database slug for a URL slug. */
export const dbSlug = (table: string, slug: string) => REVERSE[table]?.[slug] ?? slug;
