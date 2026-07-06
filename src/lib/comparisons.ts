/**
 * Structured comparison data for the "X vs Y" guide pages. Rendered as a clean
 * HTML table (ComparisonTable) high on the page — the exact scannable content
 * Google lifts into a featured snippet and LLM assistants quote verbatim when a
 * user asks "Kassandra or Sithonia?". Keyed by guide slug; el/en authored,
 * other (noindex) locales fall back to en.
 */

export type ComparisonRow = { label: Record<string, string>; a: Record<string, string>; b: Record<string, string> };
export type Comparison = {
  slug: string;
  title: Record<string, string>;
  colA: Record<string, string>;
  colB: Record<string, string>;
  /** One-line verdict shown under the table — the "answer" LLMs summarise. */
  verdict: Record<string, string>;
  rows: ComparisonRow[];
};

const L = (el: string, en: string): Record<string, string> => ({ el, en });

export const COMPARISONS: Record<string, Comparison> = {
  'kassandra-vs-sithonia': {
    slug: 'kassandra-vs-sithonia',
    title: L('Κασσάνδρα ή Σιθωνία;', 'Kassandra or Sithonia?'),
    colA: L('Κασσάνδρα', 'Kassandra'),
    colB: L('Σιθωνία', 'Sithonia'),
    verdict: L(
      'Κασσάνδρα για ζωντάνια, οργανωμένες παραλίες και ευκολία· Σιθωνία για φύση, εξωτικούς κόλπους και ηρεμία.',
      'Choose Kassandra for buzz, organized beaches and convenience; Sithonia for nature, exotic coves and quiet.',
    ),
    rows: [
      { label: L('Χαρακτήρας', 'Character'), a: L('Πιο κοσμική & οργανωμένη', 'Livelier & more developed'), b: L('Πιο άγρια & φυσική', 'Wilder & more natural') },
      { label: L('Παραλίες', 'Beaches'), a: L('Μεγάλες, αμμώδεις, οργανωμένες', 'Long, sandy, organized'), b: L('Εξωτικοί κόλποι, τιρκουάζ νερά', 'Exotic coves, turquoise water') },
      { label: L('Νυχτερινή ζωή', 'Nightlife'), a: L('Έντονη — beach bars & clubs', 'Vibrant — beach bars & clubs'), b: L('Πιο ήσυχη & χαλαρή', 'Quieter & laid-back') },
      { label: L('Πλήθος', 'Crowds'), a: L('Περισσότερος κόσμος', 'Busier'), b: L('Λιγότερος κόσμος, ηρεμία', 'Fewer people, calmer') },
      { label: L('Από Θεσσαλονίκη', 'From Thessaloniki'), a: L('~1–1,5 ώρα (πιο κοντά)', '~1–1.5 h (closer)'), b: L('~1,5–2 ώρες', '~1.5–2 h') },
      { label: L('Τιμές', 'Prices'), a: L('Ελαφρώς υψηλότερες στα hotspots', 'Slightly higher at hotspots'), b: L('Καλή σχέση αξίας στα χωριά', 'Better value in the villages') },
      { label: L('Ιδανική για', 'Best for'), a: L('Οικογένειες, party, ευκολία', 'Families, partying, convenience'), b: L('Ζευγάρια, φύση, snorkeling', 'Couples, nature, snorkeling') },
    ],
  },
  'halkidiki-vs-thassos': {
    slug: 'halkidiki-vs-thassos',
    title: L('Χαλκιδική ή Θάσος;', 'Halkidiki or Thassos?'),
    colA: L('Χαλκιδική', 'Halkidiki'),
    colB: L('Θάσος', 'Thassos'),
    verdict: L(
      'Χαλκιδική για ποικιλία (3 χερσόνησοι, οδική πρόσβαση)· Θάσος για καταπράσινο νησί με λευκές μαρμάρινες παραλίες.',
      'Choose Halkidiki for variety (3 peninsulas, drive-in access); Thassos for a lush green island with white marble beaches.',
    ),
    rows: [
      { label: L('Πρόσβαση', 'Getting there'), a: L('Οδικώς από Θεσσαλονίκη (SKG)', 'By road from Thessaloniki (SKG)'), b: L('Ferry από Καβάλα/Κεραμωτή', 'Ferry from Kavala/Keramoti') },
      { label: L('Τοπίο', 'Landscape'), a: L('3 χερσόνησοι, μεγάλη ποικιλία', 'Three peninsulas, lots of variety'), b: L('Καταπράσινο νησί, πεύκα & ελιές', 'Lush green island, pines & olives') },
      { label: L('Παραλίες', 'Beaches'), a: L('Από οργανωμένες έως εξωτικές', 'From organized to exotic'), b: L('Λευκή μαρμάρινη άμμος, τιρκουάζ', 'White marble sand, turquoise') },
      { label: L('Μέγεθος', 'Size'), a: L('Μεγάλη — θέλει αυτοκίνητο', 'Large — a car is essential'), b: L('Μικρότερη — γύρος σε ~1 μέρα', 'Smaller — drive around in ~1 day') },
      { label: L('Νυχτερινή ζωή', 'Nightlife'), a: L('Πλούσια (ιδίως Κασσάνδρα)', 'Rich (especially Kassandra)'), b: L('Πιο ήσυχη, οικογενειακή', 'Quieter, family-oriented') },
      { label: L('Ιδανική για', 'Best for'), a: L('Ποικιλία, road trips, νυχτερινή ζωή', 'Variety, road trips, nightlife'), b: L('Ησυχία, φύση, νησιώτικη αίσθηση', 'Quiet, nature, island feel') },
    ],
  },
};

export function getComparison(slug: string): Comparison | null {
  return COMPARISONS[slug] || null;
}
