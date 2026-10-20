import highlights from './monasteries-highlights.json';

/**
 * Monastery names and search snippets. The database had typos
 * ("Kostasmonitou"), mixed alphabets ("Каракалou", Latin o in "Ставрoникита"),
 * Greek genitives used as foreign names ("Grigoriou" in Serbian) and filler
 * meta descriptions with factual claims nobody checked. Names follow the form
 * each language uses for the monastery; titles and descriptions are built
 * from the checked highlights.
 */
const NAMES: Record<string, Record<'en' | 'de' | 'bg' | 'ru' | 'ro' | 'sr', string>> = {
  'megisti-lavra': { en: 'Great Lavra', de: 'Große Lavra', bg: 'Велика Лавра', ru: 'Великая Лавра', ro: 'Marea Lavră', sr: 'Velika Lavra' },
  vatopedi: { en: 'Vatopedi', de: 'Vatopedi', bg: 'Ватопед', ru: 'Ватопед', ro: 'Vatoped', sr: 'Vatoped' },
  iviron: { en: 'Iviron', de: 'Iviron', bg: 'Ивирон', ru: 'Ивирон', ro: 'Iviron', sr: 'Iviron' },
  chilandariou: { en: 'Hilandar', de: 'Chilandar', bg: 'Хилендар', ru: 'Хиландар', ro: 'Hilandar', sr: 'Hilandar' },
  dionysiou: { en: 'Dionysiou', de: 'Dionysiou', bg: 'Дионисиат', ru: 'Дионисиат', ro: 'Dionisiu', sr: 'Dionisijat' },
  koutloumousiou: { en: 'Koutloumousiou', de: 'Koutloumousiou', bg: 'Кутлумуш', ru: 'Кутлумуш', ro: 'Cutlumuș', sr: 'Kutlumuš' },
  pantokratoros: { en: 'Pantokratoros', de: 'Pantokratoros', bg: 'Пантократор', ru: 'Пантократор', ro: 'Pantocrator', sr: 'Pantokrator' },
  xeropotamou: { en: 'Xeropotamou', de: 'Xiropotamou', bg: 'Ксиропотам', ru: 'Ксиропотам', ro: 'Xiropotamu', sr: 'Ksiropotam' },
  zografou: { en: 'Zografou', de: 'Zografou', bg: 'Зограф', ru: 'Зограф', ro: 'Zografu', sr: 'Zograf' },
  dochiariou: { en: 'Dochiariou', de: 'Dochiariou', bg: 'Дохиар', ru: 'Дохиар', ro: 'Dohiariu', sr: 'Dohijar' },
  karakalou: { en: 'Karakalou', de: 'Karakallou', bg: 'Каракал', ru: 'Каракал', ro: 'Caracalu', sr: 'Karakal' },
  philotheou: { en: 'Philotheou', de: 'Philotheou', bg: 'Филотей', ru: 'Филофей', ro: 'Filoteu', sr: 'Filotej' },
  'simonos-petras': { en: 'Simonopetra', de: 'Simonopetra', bg: 'Симонопетра', ru: 'Симонопетра', ro: 'Simonopetra', sr: 'Simonopetra' },
  'agiou-pavlou': { en: "St Paul's", de: 'Agiou Pavlou', bg: 'Свети Павел', ru: 'Святого Павла', ro: 'Sfântul Pavel', sr: 'Sveti Pavle' },
  stavronikita: { en: 'Stavronikita', de: 'Stavronikita', bg: 'Ставроникита', ru: 'Ставроникита', ro: 'Stavronichita', sr: 'Stavronikita' },
  xenofontos: { en: 'Xenophontos', de: 'Xenofontos', bg: 'Ксенофонт', ru: 'Ксенофонт', ro: 'Xenofon', sr: 'Ksenofont' },
  gregoriou: { en: 'Grigoriou', de: 'Grigoriou', bg: 'Григориат', ru: 'Григориат', ro: 'Grigoriu', sr: 'Grigorijat' },
  esphigmenou: { en: 'Esphigmenou', de: 'Esfigmenou', bg: 'Есфигмен', ru: 'Эсфигмен', ro: 'Esfigmenu', sr: 'Esfigmen' },
  'agiou-panteleimonos': { en: 'St Panteleimon', de: 'Agiou Panteleimonos', bg: 'Свети Пантелеймон', ru: 'Святого Пантелеимона', ro: 'Sfântul Pantelimon', sr: 'Sveti Pantelejmon' },
  konstamonitou: { en: 'Konstamonitou', de: 'Konstamonitou', bg: 'Констамонит', ru: 'Констамонит', ro: 'Constamonitu', sr: 'Konstamonit' },
};

/** Greek names are the genitive the monasteries use themselves (Μονή Βατοπαιδίου). */
const NAMES_EL: Record<string, string> = {
  'megisti-lavra': 'Μεγίστης Λαύρας', vatopedi: 'Βατοπαιδίου', iviron: 'Ιβήρων', chilandariou: 'Χιλανδαρίου',
  dionysiou: 'Διονυσίου', koutloumousiou: 'Κουτλουμουσίου', pantokratoros: 'Παντοκράτορος', xeropotamou: 'Ξηροποτάμου',
  zografou: 'Ζωγράφου', dochiariou: 'Δοχειαρίου', karakalou: 'Καρακάλλου', philotheou: 'Φιλοθέου',
  'simonos-petras': 'Σίμωνος Πέτρας', 'agiou-pavlou': 'Αγίου Παύλου', stavronikita: 'Σταυρονικήτα', xenofontos: 'Ξενοφώντος',
  gregoriou: 'Γρηγορίου', esphigmenou: 'Εσφιγμένου', 'agiou-panteleimonos': 'Αγίου Παντελεήμονος', konstamonitou: 'Κωνσταμονίτου',
};

const TITLE: Record<string, (n: string) => string> = {
  el: (n) => `Μονή ${n} – Άγιο Όρος`,
  en: (n) => `${n} Monastery – Mount Athos`,
  de: (n) => `Kloster ${n} – Berg Athos`,
  bg: (n) => `Манастир ${n} – Света гора`,
  ru: (n) => `Монастырь ${n} – Афон`,
  ro: (n) => `Mănăstirea ${n} – Muntele Athos`,
  sr: (n) => `Manastir ${n} – Sveta Gora`,
};
const LEAD: Record<string, (n: string) => string> = {
  el: (n) => `Μονή ${n}, Άγιο Όρος`,
  en: (n) => `${n} Monastery, Mount Athos`,
  de: (n) => `Kloster ${n}, Berg Athos`,
  bg: (n) => `Манастир ${n}, Света гора`,
  ru: (n) => `Монастырь ${n}, Афон`,
  ro: (n) => `Mănăstirea ${n}, Muntele Athos`,
  sr: (n) => `Manastir ${n}, Sveta Gora`,
};
const TAIL: Record<string, string> = {
  el: 'Ιστορία και πληροφορίες για προσκυνητές.',
  en: 'History and practical information for pilgrims.',
  de: 'Geschichte und praktische Hinweise für Pilger.',
  bg: 'История и практична информация за поклонници.',
  ru: 'История и практическая информация для паломников.',
  ro: 'Istorie și informații practice pentru pelerini.',
  sr: 'Istorija i praktične informacije za hodočasnike.',
};

const HL = highlights as Record<string, Record<string, string>>;

export const MONASTERY_META_FIXES: Record<string, Record<string, string>> = {};
for (const [slug, names] of Object.entries(NAMES)) {
  const all: Record<string, string> = { el: NAMES_EL[slug], ...names };
  const fix: Record<string, string> = {};
  for (const [l, n] of Object.entries(all)) {
    fix[`name_${l}`] = n;
    fix[`meta_title_${l}`] = TITLE[l](n);
    // Longest version that still fits a search snippet (about 160 characters).
    const items = (HL[slug]?.[l] ?? '').split('|').filter(Boolean);
    if (!items.length) continue;
    const tries = [3, 2, 1].flatMap((k) => {
      const base = `${LEAD[l](n)}: ${items.slice(0, k).join(' · ')}.`;
      return [`${base} ${TAIL[l]}`, base];
    });
    fix[`meta_description_${l}`] = tries.find((t) => t.length <= 160) ?? tries[tries.length - 1];
  }
  MONASTERY_META_FIXES[slug] = fix;
}
