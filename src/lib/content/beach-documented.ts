import { BEACH_PROFILES, BLUE_FLAG_2026, SEATRAC_BEACHES } from '@/content/beach-facts';

/**
 * Physical traits a beach page may claim only from an official source
 * (src/content/beach-facts.ts). Checked against the Ministry profiles, the
 * database's sandy/pebble/shallowWater tags were wrong for several beaches
 * (2026-11 audit: Komitsa and Trypiti tagged "pebble" are sandy; Alykes and
 * Komitsa tagged "shallow" have normal depth).
 */
// 'accessible' only from the SEATRAC list (content/beach-facts.ts), never the untraced tag.
export const OFFICIAL_ONLY = ['sandy', 'pebble', 'shallowWater', 'blue-flag', 'accessible'];

/**
 * A beach's feature tags with the physical ones replaced by what the official
 * sources say. Every badge, feature list and feature page uses this, so a card
 * never contradicts the page it links to.
 */
export function documentedFeatures(slug: string, tags: readonly string[] | null | undefined): string[] {
  const p = BEACH_PROFILES[slug];
  return [
    ...(BLUE_FLAG_2026.has(slug) ? ['blue-flag'] : []),
    ...(p?.coast ? ['sandy'] : []),
    ...(p?.shallow ? ['shallowWater'] : []),
    ...(SEATRAC_BEACHES[slug] ? ['accessible'] : []),
    ...(tags ?? []).filter((x) => !OFFICIAL_ONLY.includes(x)),
  ];
}
