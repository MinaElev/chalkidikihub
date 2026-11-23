/**
 * Official facts per village (audit/sources/elstat, 2026-11-23).
 *
 * Permanent population, 2021 census — ELSTAT, "Μόνιμος πληθυσμός 2021 κατά
 * οικισμό" (statistics.gr, 29.03.2024; legal basis ΦΕΚ Β' 2090/2024).
 * Matched by hand on official name, municipal unit and coordinates; the
 * `elstat` code is the settlement's geographic code in that file.
 *
 * Not listed on purpose: gerakini, planitsi and palaiokastro (no settlement
 * in the census that is certainly the same place). The villages table's own
 * `population` column held rough estimates (an AI "best estimate") and
 * must not be shown.
 */

export const CENSUS_YEAR = '2021';
export const CENSUS_SOURCE = 'https://www.statistics.gr/el/2021-census-res-pop-results';

export type Municipality = 'polygyros' | 'aristotelis' | 'kassandra' | 'nea-propontida' | 'sithonia';

export const VILLAGE_FACTS: Record<string, { elstat: string; population: number; municipality: Municipality }> = {
  'afytos': { elstat: '1303010201', population: 1178, municipality: 'kassandra' },
  'agia-paraskevi': { elstat: '1303020201', population: 300, municipality: 'kassandra' },
  'agios-nikolaos': { elstat: '1305010201', population: 1735, municipality: 'sithonia' },
  'agios-pavlos': { elstat: '1304020201', population: 577, municipality: 'nea-propontida' },
  'agios-prodromos': { elstat: '1301010201', population: 350, municipality: 'polygyros' },
  'ammouliani': { elstat: '1302010201', population: 487, municipality: 'aristotelis' },
  'arnaia': { elstat: '1302020101', population: 2159, municipality: 'aristotelis' },
  'doumbia': { elstat: '1301020401', population: 459, municipality: 'polygyros' },
  'elani': { elstat: '1303010102', population: 9, municipality: 'kassandra' },
  'elia': { elstat: '1305010102', population: 77, municipality: 'sithonia' },
  'flogita': { elstat: '1304010901', population: 1595, municipality: 'nea-propontida' },
  'fourka': { elstat: '1303010801', population: 629, municipality: 'kassandra' },
  'galatista': { elstat: '1301020101', population: 2402, municipality: 'polygyros' },
  'gomati': { elstat: '1302030201', population: 449, municipality: 'aristotelis' },
  'hanioti': { elstat: '1303020101', population: 938, municipality: 'kassandra' },
  'ierissos': { elstat: '1302010101', population: 3124, municipality: 'aristotelis' },
  'kalamitsi': { elstat: '1305020104', population: 41, municipality: 'sithonia' },
  'kalandra': { elstat: '1303010301', population: 649, municipality: 'kassandra' },
  'kallithea': { elstat: '1303010401', population: 1233, municipality: 'kassandra' },
  'kalyves-polygyrou': { elstat: '1301010102', population: 1286, municipality: 'polygyros' },
  'kassandreia': { elstat: '1303010101', population: 2836, municipality: 'kassandra' },
  'kassandrino': { elstat: '1303010501', population: 168, municipality: 'kassandra' },
  'kriopigi': { elstat: '1303010601', population: 635, municipality: 'kassandra' },
  'lakkoma': { elstat: '1304020301', population: 1094, municipality: 'nea-propontida' },
  'loutra-agias-paraskevis': { elstat: '1303020202', population: 60, municipality: 'kassandra' },
  'megali-panagia': { elstat: '1302030101', population: 2367, municipality: 'aristotelis' },
  'metagitsi': { elstat: '1305010301', population: 823, municipality: 'sithonia' },
  'metamorfosi': { elstat: '1301040201', population: 509, municipality: 'polygyros' },
  'mola-kalyva': { elstat: '1303010503', population: 130, municipality: 'kassandra' },
  'nea-fokaia': { elstat: '1303010701', population: 2045, municipality: 'kassandra' },
  'nea-gonia': { elstat: '1304020401', population: 417, municipality: 'nea-propontida' },
  'nea-iraklia': { elstat: '1304020202', population: 619, municipality: 'nea-propontida' },
  'nea-kallikratia': { elstat: '1304020101', population: 6128, municipality: 'nea-propontida' },
  'nea-moudania': { elstat: '1304010101', population: 10042, municipality: 'nea-propontida' },
  'nea-plagia': { elstat: '1304030501', population: 1017, municipality: 'nea-propontida' },
  'nea-potidaia': { elstat: '1304010601', population: 1543, municipality: 'nea-propontida' },
  'nea-roda': { elstat: '1302010301', population: 1180, municipality: 'aristotelis' },
  'nea-skioni': { elstat: '1303020301', population: 701, municipality: 'kassandra' },
  'nea-triglia': { elstat: '1304030101', population: 2984, municipality: 'nea-propontida' },
  'neohori': { elstat: '1302020301', population: 696, municipality: 'aristotelis' },
  'neos-marmaras': { elstat: '1305010401', population: 2884, municipality: 'sithonia' },
  'nikiti': { elstat: '1305010101', population: 2845, municipality: 'sithonia' },
  'olympiada': { elstat: '1302010401', population: 638, municipality: 'aristotelis' },
  'olynthos': { elstat: '1301010401', population: 1053, municipality: 'polygyros' },
  'ormos-panagias': { elstat: '1305010210', population: 90, municipality: 'sithonia' },
  'ormylia': { elstat: '1301040101', population: 2863, municipality: 'polygyros' },
  'ouranoupoli': { elstat: '1302010501', population: 801, municipality: 'aristotelis' },
  'palaiohori': { elstat: '1302020401', population: 1262, municipality: 'aristotelis' },
  'paliouri': { elstat: '1303020401', population: 848, municipality: 'kassandra' },
  'parthenonas': { elstat: '1305010408', population: 33, municipality: 'sithonia' },
  'pefkohori': { elstat: '1303020501', population: 2194, municipality: 'kassandra' },
  'polychrono': { elstat: '1303020601', population: 1239, municipality: 'kassandra' },
  'polygyros': { elstat: '1301010101', population: 6488, municipality: 'polygyros' },
  'portaria': { elstat: '1304010701', population: 1193, municipality: 'nea-propontida' },
  'porto-koufo': { elstat: '1305020105', population: 80, municipality: 'sithonia' },
  'posidi': { elstat: '1303010303', population: 101, municipality: 'kassandra' },
  'psakoudia': { elstat: '1301040108', population: 333, municipality: 'polygyros' },
  'pyrgadikia': { elstat: '1302030301', population: 249, municipality: 'aristotelis' },
  'sani': { elstat: '1303010103', population: 30, municipality: 'kassandra' },
  'sanos': { elstat: '1302020501', population: 908, municipality: 'aristotelis' },
  'sarti': { elstat: '1305020201', population: 1054, municipality: 'sithonia' },
  'sikia': { elstat: '1305020101', population: 1865, municipality: 'sithonia' },
  'simantra': { elstat: '1304010801', population: 1931, municipality: 'nea-propontida' },
  'siviri': { elstat: '1303010104', population: 283, municipality: 'kassandra' },
  'sozopoli': { elstat: '1304020503', population: 440, municipality: 'nea-propontida' },
  'stagira': { elstat: '1302010601', population: 373, municipality: 'aristotelis' },
  'stratoni': { elstat: '1302010801', population: 992, municipality: 'aristotelis' },
  'stratoniki': { elstat: '1302010701', population: 538, municipality: 'aristotelis' },
  'taxiarhis': { elstat: '1301010701', population: 742, municipality: 'polygyros' },
  'toroni': { elstat: '1305020109', population: 204, municipality: 'sithonia' },
  'tripiti': { elstat: '1302010204', population: 8, municipality: 'aristotelis' },
  'varvara': { elstat: '1302020201', population: 499, municipality: 'aristotelis' },
  'vavdos': { elstat: '1301020201', population: 337, municipality: 'polygyros' },
  'vourvourou': { elstat: '1305010203', population: 98, municipality: 'sithonia' },
  'vrasta': { elstat: '1301010301', population: 720, municipality: 'polygyros' },
  'xiropotamo': { elstat: '1302010106', population: 32, municipality: 'aristotelis' },
  'zografou': { elstat: '1304010501', population: 253, municipality: 'nea-propontida' },
};

/**
 * The municipality's own name, as used after "Municipality of" in each
 * language (Greek in the genitive: "Δήμος Κασσάνδρας"). Spellings follow
 * src/lib/content/place-names.ts.
 */
export const MUNICIPALITY_NAMES: Record<Municipality, Record<'el' | 'en' | 'de' | 'ro' | 'bg' | 'sr' | 'ru', string>> = {
  polygyros: { el: 'Πολυγύρου', en: 'Polygyros', de: 'Polygyros', ro: 'Polygyros', bg: 'Полигирос', sr: 'Poligiros', ru: 'Полигирос' },
  aristotelis: { el: 'Αριστοτέλη', en: 'Aristotelis', de: 'Aristotelis', ro: 'Aristotelis', bg: 'Аристотелис', sr: 'Aristotelis', ru: 'Аристотелис' },
  kassandra: { el: 'Κασσάνδρας', en: 'Kassandra', de: 'Kassandra', ro: 'Kassandra', bg: 'Касандра', sr: 'Kasandra', ru: 'Кассандра' },
  'nea-propontida': { el: 'Νέας Προποντίδας', en: 'Nea Propontida', de: 'Nea Propontida', ro: 'Nea Propontida', bg: 'Неа Пропонтида', sr: 'Nea Propontida', ru: 'Неа-Пропонтида' },
  sithonia: { el: 'Σιθωνίας', en: 'Sithonia', de: 'Sithonia', ro: 'Sithonia', bg: 'Ситония', sr: 'Sitonija', ru: 'Ситония' },
};

/** Villages whose beach is in the SEATRAC programme (see beach-facts.ts SEATRAC_BEACHES). */
export const SEATRAC_VILLAGES: Record<string, string> = {
  pefkohori: 'kassandra-pefkohori',
  flogita: 'flogita-xalkidikhs',
  'nea-plagia': 'nea-plagia-chalkidiki',
  'nea-potidaia': 'nea-potidea-chalkidiki',
  siviri: 'kassandra-siviri',
  'nea-skioni': 'kassandra-nea-skioni',
};
