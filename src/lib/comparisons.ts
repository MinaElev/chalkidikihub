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

const L = (el: string, en: string, de?: string, ro?: string): Record<string, string> => {
  const r: Record<string, string> = { el, en };
  if (de) r.de = de;
  if (ro) r.ro = ro;
  return r;
};

export const COMPARISONS: Record<string, Comparison> = {
  'kassandra-vs-sithonia': {
    slug: 'kassandra-vs-sithonia',
    title: L('Κασσάνδρα ή Σιθωνία;', 'Kassandra or Sithonia?', 'Kassandra oder Sithonia?', 'Kassandra sau Sithonia?'),
    colA: L('Κασσάνδρα', 'Kassandra', 'Kassandra', 'Kassandra'),
    colB: L('Σιθωνία', 'Sithonia', 'Sithonia', 'Sithonia'),
    verdict: L(
      'Κασσάνδρα για ζωντάνια, οργανωμένες παραλίες και ευκολία· Σιθωνία για φύση, εξωτικούς κόλπους και ηρεμία.',
      'Choose Kassandra for buzz, organized beaches and convenience; Sithonia for nature, exotic coves and quiet.',
      'Kassandra für Trubel, organisierte Strände und Komfort; Sithonia für Natur, exotische Buchten und Ruhe.',
      'Kassandra pentru animație, plaje organizate și confort; Sithonia pentru natură, golfuri exotice și liniște.',
    ),
    rows: [
      { label: L('Χαρακτήρας', 'Character', 'Charakter', 'Caracter'), a: L('Πιο κοσμική & οργανωμένη', 'Livelier & more developed', 'Lebhafter & erschlossener', 'Mai animată & mai dezvoltată'), b: L('Πιο άγρια & φυσική', 'Wilder & more natural', 'Wilder & naturbelassener', 'Mai sălbatică & mai naturală') },
      { label: L('Παραλίες', 'Beaches', 'Strände', 'Plaje'), a: L('Μεγάλες, αμμώδεις, οργανωμένες', 'Long, sandy, organized', 'Lang, sandig, organisiert', 'Lungi, nisipoase, organizate'), b: L('Εξωτικοί κόλποι, τιρκουάζ νερά', 'Exotic coves, turquoise water', 'Exotische Buchten, türkisblaues Wasser', 'Golfuri exotice, apă turcoaz') },
      { label: L('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben', 'Viață de noapte'), a: L('Έντονη — beach bars & clubs', 'Vibrant — beach bars & clubs', 'Lebhaft — Beachbars & Clubs', 'Intensă — beach bars & cluburi'), b: L('Πιο ήσυχη & χαλαρή', 'Quieter & laid-back', 'Ruhiger & entspannter', 'Mai liniștită & mai relaxată') },
      { label: L('Πλήθος', 'Crowds', 'Andrang', 'Aglomerație'), a: L('Περισσότερος κόσμος', 'Busier', 'Mehr Betrieb', 'Mai aglomerată'), b: L('Λιγότερος κόσμος, ηρεμία', 'Fewer people, calmer', 'Weniger Leute, mehr Ruhe', 'Mai puțină lume, mai liniște') },
      { label: L('Από Θεσσαλονίκη', 'From Thessaloniki', 'Ab Thessaloniki', 'De la Salonic'), a: L('~1–1,5 ώρα (πιο κοντά)', '~1–1.5 h (closer)', '~1–1,5 Std. (näher)', '~1–1,5 h (mai aproape)'), b: L('~1,5–2 ώρες', '~1.5–2 h', '~1,5–2 Std.', '~1,5–2 h') },
      { label: L('Τιμές', 'Prices', 'Preise', 'Prețuri'), a: L('Ελαφρώς υψηλότερες στα hotspots', 'Slightly higher at hotspots', 'Etwas höher an den Hotspots', 'Ușor mai mari în zonele populare'), b: L('Καλή σχέση αξίας στα χωριά', 'Better value in the villages', 'Besseres Preis-Leistungs-Verhältnis in den Dörfern', 'Raport mai bun calitate-preț în sate') },
      { label: L('Ιδανική για', 'Best for', 'Ideal für', 'Ideală pentru'), a: L('Οικογένειες, party, ευκολία', 'Families, partying, convenience', 'Familien, Party, Komfort', 'Familii, petreceri, confort'), b: L('Ζευγάρια, φύση, snorkeling', 'Couples, nature, snorkeling', 'Paare, Natur, Schnorcheln', 'Cupluri, natură, snorkeling') },
    ],
  },
  'halkidiki-vs-thassos': {
    slug: 'halkidiki-vs-thassos',
    title: L('Χαλκιδική ή Θάσος;', 'Halkidiki or Thassos?', 'Chalkidiki oder Thassos?', 'Halkidiki sau Thassos?'),
    colA: L('Χαλκιδική', 'Halkidiki', 'Chalkidiki', 'Halkidiki'),
    colB: L('Θάσος', 'Thassos', 'Thassos', 'Thassos'),
    verdict: L(
      'Χαλκιδική για ποικιλία (3 χερσόνησοι, οδική πρόσβαση)· Θάσος για καταπράσινο νησί με λευκές μαρμάρινες παραλίες.',
      'Choose Halkidiki for variety (3 peninsulas, drive-in access); Thassos for a lush green island with white marble beaches.',
      'Chalkidiki für Abwechslung (3 Halbinseln, mit dem Auto erreichbar); Thassos für eine grüne Insel mit weißen Marmorstränden.',
      'Halkidiki pentru varietate (3 peninsule, acces auto); Thassos pentru o insulă verde cu plaje de marmură albă.',
    ),
    rows: [
      { label: L('Πρόσβαση', 'Getting there', 'Anreise', 'Cum ajungi'), a: L('Οδικώς από Θεσσαλονίκη (SKG)', 'By road from Thessaloniki (SKG)', 'Mit dem Auto ab Thessaloniki (SKG)', 'Cu mașina de la Salonic (SKG)'), b: L('Ferry από Καβάλα/Κεραμωτή', 'Ferry from Kavala/Keramoti', 'Fähre ab Kavala/Keramoti', 'Feribot din Kavala/Keramoti') },
      { label: L('Τοπίο', 'Landscape', 'Landschaft', 'Peisaj'), a: L('3 χερσόνησοι, μεγάλη ποικιλία', 'Three peninsulas, lots of variety', 'Drei Halbinseln, viel Abwechslung', 'Trei peninsule, multă varietate'), b: L('Καταπράσινο νησί, πεύκα & ελιές', 'Lush green island, pines & olives', 'Grüne Insel, Pinien & Oliven', 'Insulă verde, pini & măslini') },
      { label: L('Παραλίες', 'Beaches', 'Strände', 'Plaje'), a: L('Από οργανωμένες έως εξωτικές', 'From organized to exotic', 'Von organisiert bis exotisch', 'De la organizate la exotice'), b: L('Λευκή μαρμάρινη άμμος, τιρκουάζ', 'White marble sand, turquoise', 'Weißer Marmorsand, türkis', 'Nisip alb de marmură, turcoaz') },
      { label: L('Μέγεθος', 'Size', 'Größe', 'Mărime'), a: L('Μεγάλη — θέλει αυτοκίνητο', 'Large — a car is essential', 'Groß — Auto unverzichtbar', 'Mare — mașina e esențială'), b: L('Μικρότερη — γύρος σε ~1 μέρα', 'Smaller — drive around in ~1 day', 'Kleiner — Inselrunde in ~1 Tag', 'Mai mică — tur în ~1 zi') },
      { label: L('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben', 'Viață de noapte'), a: L('Πλούσια (ιδίως Κασσάνδρα)', 'Rich (especially Kassandra)', 'Vielfältig (v. a. Kassandra)', 'Bogată (mai ales Kassandra)'), b: L('Πιο ήσυχη, οικογενειακή', 'Quieter, family-oriented', 'Ruhiger, familiär', 'Mai liniștită, pentru familii') },
      { label: L('Ιδανική για', 'Best for', 'Ideal für', 'Ideală pentru'), a: L('Ποικιλία, road trips, νυχτερινή ζωή', 'Variety, road trips, nightlife', 'Abwechslung, Roadtrips, Nachtleben', 'Varietate, road trips, viață de noapte'), b: L('Ησυχία, φύση, νησιώτικη αίσθηση', 'Quiet, nature, island feel', 'Ruhe, Natur, Inselgefühl', 'Liniște, natură, atmosferă de insulă') },
    ],
  },
};

export function getComparison(slug: string): Comparison | null {
  return COMPARISONS[slug] || null;
}
