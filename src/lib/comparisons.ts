/**
 * Structured comparison data for the "X vs Y" guide pages. Rendered as a clean
 * HTML table (ComparisonTable) high on the page — the exact scannable content
 * Google lifts into a featured snippet and LLM assistants quote verbatim when a
 * user asks "Kassandra or Sithonia?". Keyed by guide slug; el/en/de authored,
 * remaining (noindex) locales fall back to en.
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

const L = (el: string, en: string, de?: string): Record<string, string> =>
  de ? { el, en, de } : { el, en };

export const COMPARISONS: Record<string, Comparison> = {
  'kassandra-vs-sithonia': {
    slug: 'kassandra-vs-sithonia',
    title: L('Κασσάνδρα ή Σιθωνία;', 'Kassandra or Sithonia?', 'Kassandra oder Sithonia?'),
    colA: L('Κασσάνδρα', 'Kassandra', 'Kassandra'),
    colB: L('Σιθωνία', 'Sithonia', 'Sithonia'),
    verdict: L(
      'Κασσάνδρα για ζωντάνια, οργανωμένες παραλίες και ευκολία· Σιθωνία για φύση, εξωτικούς κόλπους και ηρεμία.',
      'Choose Kassandra for buzz, organized beaches and convenience; Sithonia for nature, exotic coves and quiet.',
      'Kassandra für Trubel, organisierte Strände und Komfort; Sithonia für Natur, exotische Buchten und Ruhe.',
    ),
    rows: [
      { label: L('Χαρακτήρας', 'Character', 'Charakter'), a: L('Πιο κοσμική & οργανωμένη', 'Livelier & more developed', 'Lebhafter & erschlossener'), b: L('Πιο άγρια & φυσική', 'Wilder & more natural', 'Wilder & naturbelassener') },
      { label: L('Παραλίες', 'Beaches', 'Strände'), a: L('Μεγάλες, αμμώδεις, οργανωμένες', 'Long, sandy, organized', 'Lang, sandig, organisiert'), b: L('Εξωτικοί κόλποι, τιρκουάζ νερά', 'Exotic coves, turquoise water', 'Exotische Buchten, türkisblaues Wasser') },
      { label: L('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben'), a: L('Έντονη — beach bars & clubs', 'Vibrant — beach bars & clubs', 'Lebhaft — Beachbars & Clubs'), b: L('Πιο ήσυχη & χαλαρή', 'Quieter & laid-back', 'Ruhiger & entspannter') },
      { label: L('Πλήθος', 'Crowds', 'Andrang'), a: L('Περισσότερος κόσμος', 'Busier', 'Mehr Betrieb'), b: L('Λιγότερος κόσμος, ηρεμία', 'Fewer people, calmer', 'Weniger Leute, mehr Ruhe') },
      { label: L('Από Θεσσαλονίκη', 'From Thessaloniki', 'Ab Thessaloniki'), a: L('~1–1,5 ώρα (πιο κοντά)', '~1–1.5 h (closer)', '~1–1,5 Std. (näher)'), b: L('~1,5–2 ώρες', '~1.5–2 h', '~1,5–2 Std.') },
      { label: L('Τιμές', 'Prices', 'Preise'), a: L('Ελαφρώς υψηλότερες στα hotspots', 'Slightly higher at hotspots', 'Etwas höher an den Hotspots'), b: L('Καλή σχέση αξίας στα χωριά', 'Better value in the villages', 'Besseres Preis-Leistungs-Verhältnis in den Dörfern') },
      { label: L('Ιδανική για', 'Best for', 'Ideal für'), a: L('Οικογένειες, party, ευκολία', 'Families, partying, convenience', 'Familien, Party, Komfort'), b: L('Ζευγάρια, φύση, snorkeling', 'Couples, nature, snorkeling', 'Paare, Natur, Schnorcheln') },
    ],
  },
  'halkidiki-vs-thassos': {
    slug: 'halkidiki-vs-thassos',
    title: L('Χαλκιδική ή Θάσος;', 'Halkidiki or Thassos?', 'Chalkidiki oder Thassos?'),
    colA: L('Χαλκιδική', 'Halkidiki', 'Chalkidiki'),
    colB: L('Θάσος', 'Thassos', 'Thassos'),
    verdict: L(
      'Χαλκιδική για ποικιλία (3 χερσόνησοι, οδική πρόσβαση)· Θάσος για καταπράσινο νησί με λευκές μαρμάρινες παραλίες.',
      'Choose Halkidiki for variety (3 peninsulas, drive-in access); Thassos for a lush green island with white marble beaches.',
      'Chalkidiki für Abwechslung (3 Halbinseln, mit dem Auto erreichbar); Thassos für eine grüne Insel mit weißen Marmorstränden.',
    ),
    rows: [
      { label: L('Πρόσβαση', 'Getting there', 'Anreise'), a: L('Οδικώς από Θεσσαλονίκη (SKG)', 'By road from Thessaloniki (SKG)', 'Mit dem Auto ab Thessaloniki (SKG)'), b: L('Ferry από Καβάλα/Κεραμωτή', 'Ferry from Kavala/Keramoti', 'Fähre ab Kavala/Keramoti') },
      { label: L('Τοπίο', 'Landscape', 'Landschaft'), a: L('3 χερσόνησοι, μεγάλη ποικιλία', 'Three peninsulas, lots of variety', 'Drei Halbinseln, viel Abwechslung'), b: L('Καταπράσινο νησί, πεύκα & ελιές', 'Lush green island, pines & olives', 'Grüne Insel, Pinien & Oliven') },
      { label: L('Παραλίες', 'Beaches', 'Strände'), a: L('Από οργανωμένες έως εξωτικές', 'From organized to exotic', 'Von organisiert bis exotisch'), b: L('Λευκή μαρμάρινη άμμος, τιρκουάζ', 'White marble sand, turquoise', 'Weißer Marmorsand, türkis') },
      { label: L('Μέγεθος', 'Size', 'Größe'), a: L('Μεγάλη — θέλει αυτοκίνητο', 'Large — a car is essential', 'Groß — Auto unverzichtbar'), b: L('Μικρότερη — γύρος σε ~1 μέρα', 'Smaller — drive around in ~1 day', 'Kleiner — Inselrunde in ~1 Tag') },
      { label: L('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben'), a: L('Πλούσια (ιδίως Κασσάνδρα)', 'Rich (especially Kassandra)', 'Vielfältig (v. a. Kassandra)'), b: L('Πιο ήσυχη, οικογενειακή', 'Quieter, family-oriented', 'Ruhiger, familiär') },
      { label: L('Ιδανική για', 'Best for', 'Ideal für'), a: L('Ποικιλία, road trips, νυχτερινή ζωή', 'Variety, road trips, nightlife', 'Abwechslung, Roadtrips, Nachtleben'), b: L('Ησυχία, φύση, νησιώτικη αίσθηση', 'Quiet, nature, island feel', 'Ruhe, Natur, Inselgefühl') },
    ],
  },
};

export function getComparison(slug: string): Comparison | null {
  return COMPARISONS[slug] || null;
}
