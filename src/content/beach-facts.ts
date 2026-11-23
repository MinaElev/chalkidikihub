/**
 * Verified beach facts, each traceable to an official source
 * (audit/sources/BEACH-DATA-AUDIT.md, 2026-11-23). Keys are database slugs.
 *
 * - BLUE_FLAG_2026: beaches with an awarded section on the EEPF list
 *   https://www.blueflag.gr/el/awards/2026 (awards of 14 May 2026). Renew each
 *   May from the new list; an award covers a section, not the whole beach.
 * - BEACH_PROFILES: physical traits from the Ministry of Environment
 *   bathing-water profiles (edition R3, May 2015), matched by hand on name and
 *   municipality. Facilities in those profiles are deliberately left out:
 *   they change from year to year. A missing field means the profile did not
 *   state it clearly — never fill it in by guess.
 */

/** A string, so ICU messages print "2026", not a grouped number ("2.026"). */
import { publicSlug } from './rewrites/slug-renames';

export const BLUE_FLAG_YEAR = '2026';
export const BLUE_FLAG_SOURCE = 'https://www.blueflag.gr/el/awards/2026';
export const PROFILE_SOURCE = (code: string) => `https://bathingwaterprofiles.gr/el/bathingprofiles/${code}`;

export const BLUE_FLAG_2026 = new Set([
  'afytos-beach-kassandra',
  'alikes-beach-sithonia',
  'anthemus-beach-sithonia',
  'armenistis-beach-sithonia',
  'elani-beach-kassandra',
  'eleonas-beach-sithonia',
  'hanioti-kassandra',
  'ierissos-beach-mainland',
  'ierissos-municipal-1-mainland',
  'ierissos-municipal-3-mainland',
  'kallithea-kassandra',
  'kalogrias-beach-sithonia',
  'kampoydi-akrathos-athos',
  'komitsa-athos',
  'kriopigi-beach-kassandra',
  'lagomandra-beach-sithonia',
  'nea-kallikratia-beach-kassandra',
  'nea-moudania-mainland',
  'nikiti-beach-sithonia-2',
  'ouranoupoli-athos',
  'paradisos-beach-sithonia',
  'paralia-psakoydia-kassandra',
  'paralia-vergias-kassandra',
  'pefkochori-kassandra',
  'peykochori-yalla-flegra-sithonia',
  'plagia-flogita-beach-kassandra',
  'platanitsi-beach-sithonia',
  'portes-beach-kassandra',
  'possidi-kassandra',
  'potidea-mainland',
  'salonikiou-beach-sithonia',
  'sani-kassandra',
  'sarti-sithonia',
  'toroni-beach-sithonia',
  'varkes-kassandra',
]);

export type BeachProfile = {
  /** Ministry profile id (bathingwaterprofiles.gr). */
  profile: string;
  /** Land substrate as the profile describes it. */
  coast?: 'sand' | 'sand-fine' | 'sand-coarse';
  /** true: "αβαθή" in the first metres; false: "κανονικό βάθος". */
  shallow?: boolean;
  /** Distance from shore, in metres, where the sea reaches 5 m. */
  depth5m?: number;
  /** Length of the beach in metres. */
  lengthM?: number;
};

export const BEACH_PROFILES: Record<string, BeachProfile> = {
  'afytos-beach-kassandra': { profile: 'ELBW109057045101', coast: 'sand-fine', shallow: true, lengthM: 1800 },
  'alikes-beach-sithonia': { profile: 'ELBW109056002101', coast: 'sand-fine', shallow: false, depth5m: 70, lengthM: 570 },
  'armenistis-beach-sithonia': { profile: 'ELBW109060077101', coast: 'sand', shallow: false, depth5m: 240, lengthM: 600 },
  'chrousou-beach-sithonia': { profile: 'ELBW109057035101', coast: 'sand', shallow: true },
  'elani-beach-kassandra': { profile: 'ELBW109057039101', coast: 'sand', shallow: true },
  'eleonas-beach-sithonia': { profile: 'ELBW109060073101', coast: 'sand-coarse', shallow: false, depth5m: 160, lengthM: 870 },
  'ierissos-beach-mainland': { profile: 'ELBW109056008101', coast: 'sand', shallow: false, lengthM: 4800 },
  'kalamitsi-sithonia': { profile: 'ELBW109060075101', coast: 'sand-fine', shallow: true, depth5m: 220, lengthM: 450 },
  'kallithea-kassandra': { profile: 'ELBW109057037101', coast: 'sand-fine', shallow: true },
  'kalogrias-beach-sithonia': { profile: 'ELBW109060076101', coast: 'sand', shallow: false, lengthM: 700 },
  'komitsa-athos': { profile: 'ELBW109056005101', coast: 'sand', shallow: false, lengthM: 1100 },
  'koviou-beach-sithonia': { profile: 'ELBW109060089101', coast: 'sand', shallow: false, lengthM: 260 },
  'lagomandra-beach-sithonia': { profile: 'ELBW109060078101', coast: 'sand', shallow: false, lengthM: 350 },
  'paradisos-beach-sithonia': { profile: 'ELBW109060081101', coast: 'sand', shallow: false },
  'paralia-vergias-kassandra': { profile: 'ELBW109058052101', coast: 'sand', shallow: true, lengthM: 3500 },
  'platanitsi-beach-sithonia': { profile: 'ELBW109060067101', coast: 'sand', shallow: false, depth5m: 350, lengthM: 550 },
  'portes-beach-kassandra': { profile: 'ELBW109058057101', coast: 'sand', shallow: false },
  'porto-agio-athos': { profile: 'ELBW109056014101', coast: 'sand', shallow: true, depth5m: 25, lengthM: 80 },
  'potidea-mainland': { profile: 'ELBW109058051101', coast: 'sand-fine', shallow: true, lengthM: 600 },
  'saint-george-athos': { profile: 'ELBW109056006101', coast: 'sand', shallow: true },
  'salonikiou-beach-sithonia': { profile: 'ELBW109060066101', coast: 'sand', shallow: false, depth5m: 150, lengthM: 1300 },
  'sarti-sithonia': { profile: 'ELBW109060082101', coast: 'sand-fine', shallow: false, depth5m: 280, lengthM: 2200 },
  'stratoni-beach-mainland': { profile: 'ELBW109056017101', coast: 'sand', shallow: true, lengthM: 740 },
  'toroni-beach-sithonia': { profile: 'ELBW109060084101', coast: 'sand-fine', shallow: false, lengthM: 2200 },
  'trypiti-athos': { profile: 'ELBW109056010101', coast: 'sand', shallow: true, depth5m: 80 },
  'vourvourou-sithonia': { profile: 'ELBW109060080101', coast: 'sand', shallow: true, lengthM: 600 },
};

// Pages and cards carry the public slug (src/content/rewrites/slug-renames.ts:
// e.g. paralia-vergias-kassandra is served as paralia-vergias-mainland), while
// the lists above use database slugs. Register both, so every lookup matches.
for (const slug of [...BLUE_FLAG_2026]) BLUE_FLAG_2026.add(publicSlug('beaches', slug));
for (const [slug, profile] of Object.entries(BEACH_PROFILES)) BEACH_PROFILES[publicSlug('beaches', slug)] = profile;

/**
 * Beaches in the SEATRAC programme (TOBEA's self-service sea-access system for
 * wheelchair users), from https://seatrac.gr/el/paralies/ — audit 2026-11-23,
 * pages in audit/sources/seatrac. The live status ("Σε λειτουργία" /
 * "Απεγκατεστημένο") is seasonal, so pages say "part of the programme" and link
 * the SEATRAC page for the current status. Values are the SEATRAC page slugs.
 */
export const SEATRAC_SOURCE = (page: string) => `https://seatrac.gr/el/paralies/${page}/`;
export const SEATRAC_BEACHES: Record<string, string> = {
  'pefkochori-beach-sithonia': 'kassandra-pefkohori',
  'plagia-flogita-beach-kassandra': 'flogita-xalkidikhs',
  'potidea-mainland': 'nea-potidea-chalkidiki',
};
for (const [slug, page] of Object.entries(SEATRAC_BEACHES)) SEATRAC_BEACHES[publicSlug('beaches', slug)] = page;

/**
 * Beaches the Port Authority (Λιμεναρχείο Ιερισσού, πρακτικό 20/08/2025) has
 * characterised as busy, where lifeguard cover is mandatory 1 June – 30
 * September. Source: Δήμος Σιθωνίας, μελέτη 16/2025 in decision 347/2025,
 * ΑΔΑ ΨΠ6ΡΩ1Φ-ΚΗΟ (audit/sources/diavgeia). This is the legal requirement and
 * the municipality's plan, not a daily presence check, and pages say exactly
 * that. Other municipalities: see LIFEGUARD below. Μπανιέρες (Ν. Μαρμαράς) has no
 * beach entry; Συκιά is the municipality's own July–August addition, left out.
 */
type Lifeguard = { municipality: 'sithonia' | 'polygyros' | 'aristotelis'; years: string; source: string };
const SITHONIA_LG: Lifeguard = { municipality: 'sithonia', years: '2026–2027', source: 'https://diavgeia.gov.gr/doc/ΨΠ6ΡΩ1Φ-ΚΗΟ' };
/**
 * Polygyros: tender terms 384/2024 (ΑΔΑ 63ΛΨΩΞΜ-2ΨΩ) for 2025–2026, awarded by
 * 118/2025 (ΑΔΑ 9ΘΒΚΩΞΜ-Κ1Ζ): Καλύβες, Ψακούδια, Μεταμόρφωση. Only Ψακούδια has
 * a beach entry. Aristotelis: study 01/2026 on dimosaristoteli.gr (11 towers,
 * €371,865.09); beach names per the municipality's statement to the press
 * (Xalkidiki Politiki, 29 May 2026, same budget): Ιερισσός, Αλυκές Αμμουλιανής,
 * Ξηροπόταμος, Καμπούδι Ουρανούπολης, Ολυμπιάδα. Ierissos is left out: the
 * study's 1 km stretch cannot be matched to one of our three Ierissos entries.
 * Kassandra and Nea Propontida: the published lists are for 2023 only or not
 * yet read (audit/sources/lifeguards).
 */
const POLYGYROS_LG: Lifeguard = { municipality: 'polygyros', years: '2025–2026', source: 'https://diavgeia.gov.gr/doc/63ΛΨΩΞΜ-2ΨΩ' };
const ARISTOTELIS_LG: Lifeguard = { municipality: 'aristotelis', years: '2026', source: 'https://dimosaristoteli.gr/wp-content/uploads/2026/04/1.-MELETH-2026_signed.pdf' };
export const LIFEGUARD: Map<string, Lifeguard> = new Map([
  ...['nikiti-beach-sithonia-2', 'paradisos-beach-sithonia', 'trani-ammouda-beach-sithonia', 'sarti-sithonia', 'toroni-beach-sithonia', 'platanitsi-beach-sithonia', 'kalamitsi-sithonia', 'armenistis-beach-sithonia'].map((x) => [x, SITHONIA_LG] as const),
  ['paralia-psakoydia-kassandra', POLYGYROS_LG],
  ['alikes-beach-sithonia', ARISTOTELIS_LG],
  ['kampoydi-akrathos-athos', ARISTOTELIS_LG],
]);
for (const [slug, v] of [...LIFEGUARD]) LIFEGUARD.set(publicSlug('beaches', slug), v);
/** Kept for callers that only ask "is cover mandatory here". */
export const LIFEGUARD_REQUIRED = { has: (slug: string) => LIFEGUARD.has(slug) };
