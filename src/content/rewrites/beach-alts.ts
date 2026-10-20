/**
 * Greek photo descriptions (image_alt) for beaches whose stored text named
 * the wrong peninsula (v3 baked the slug's suffix into it: "Golden στη
 * Σιθωνία" for a Kassandra beach) or a garbled name ("Робинзонския
 * нудистки плаж", "agjio mama"). Format: beach, village, area. Villages and
 * areas follow the corrected data (slug-renames.ts, ROW_FIXES).
 * location_name is fixed where it carried the same garbled name.
 */
export const BEACH_ALT_FIXES: Record<string, Record<string, string>> = {
  'golden-beach-sithonia': { image_alt: 'Golden Beach, Πευκοχώρι, Κασσάνδρα' },
  'portes-beach-kassandra': { image_alt: 'Παραλία Πόρτες, Νέα Πλάγια, ενδοχώρα Χαλκιδικής' },
  'kristina-beach-athos': { image_alt: 'Kristina Beach, Καλαμίτσι, Σιθωνία' },
  'nea-kallikratia-beach-kassandra': { image_alt: 'Παραλία Νέας Καλλικράτειας, ενδοχώρα Χαλκιδικής' },
  'pefkochori-beach-sithonia': { image_alt: 'Παραλία Πευκοχωρίου, Κασσάνδρα' },
  'paralia-chanoti-grecotel-sithonia': { image_alt: 'Παραλία Χανιώτη (Grecotel), Κασσάνδρα', location_name: 'Παραλία Χανιώτη (Grecotel), Χανιώτη' },
  'chrousou-beach-sithonia': { image_alt: 'Παραλία Χρουσώ, Παλιούρι, Κασσάνδρα' },
  'agridia-athos': { image_alt: 'Παραλία Αγριδιά, Σάρτη, Σιθωνία' },
  'tigania-beach-athos': { image_alt: 'Παραλία Τηγανιά, Καλαμίτσι, Σιθωνία' },
  'paralia-vergias-kassandra': { image_alt: 'Παραλία Βεργιάς, Νέα Τρίγλια, ενδοχώρα Χαλκιδικής' },
  'prassou-beach-athos': { image_alt: 'Παραλία Πράσσου (Ρόμπινσον), Καλαμίτσι, Σιθωνία', location_name: 'Παραλία Πράσσου (Ρόμπινσον), Καλαμίτσι' },
  'paralia-psakoydia-kassandra': { image_alt: 'Παραλία Ψακούδια, Γερακινή, ενδοχώρα Χαλκιδικής' },
  'beach-of-anthoupolis-kassandra': { image_alt: 'Παραλία Ανθούπολης, Νέα Τρίγλια, ενδοχώρα Χαλκιδικής' },
  'plagia-flogita-beach-kassandra': { image_alt: 'Παραλία Πλάγια-Φλογητά, Φλογητά, ενδοχώρα Χαλκιδικής' },
  'glarokavos-nudist-beach-sithonia': { image_alt: 'Παραλία γυμνιστών Γλαρόκαβος, Πευκοχώρι, Κασσάνδρα' },
  'mykoniatika-nudist-beach-kassandra': { image_alt: 'Παραλία γυμνιστών Μυκονιάτικα, Νέα Τρίγλια, ενδοχώρα Χαλκιδικής' },
  'alikes-beach-sithonia': { image_alt: 'Παραλία Αλυκές, Αμμουλιανή' },
  'peykochori-yalla-flegra-sithonia': { image_alt: 'Παραλία Yalla-Flegra, Πευκοχώρι, Κασσάνδρα' },
  'agjio-mama-kassandra': { image_alt: 'Παραλία Αγίου Μάμαντος, Νέα Πλάγια, ενδοχώρα Χαλκιδικής', location_name: 'Παραλία Αγίου Μάμαντος, Νέα Πλάγια' },
};
