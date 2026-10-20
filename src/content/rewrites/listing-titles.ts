/**
 * Corrected translations of the stays whose owners gave a Greek title. v3's
 * machine translation turned place names into words ("Νέα Ποτίδαια" →
 * "New Potidea", "Нови Потидея"), "Τροχοβίλα" into "Трехколесный дом"
 * (tricycle house) and "Τορώνη" into "Торон". Place names are transliterated,
 * brand parts ("Garden & Sea Retreat", "Be-villas") kept as written.
 * Latin-script business names need no entry: lib/content/listing-title.ts
 * shows them as written in every language.
 */
export const LISTING_TITLE_FIXES: Record<string, Record<string, string>> = {
  'garden-sea-retreat-polytelis-mezoneta-sto-palioyri-akti-xenia-paliouri': {
    title_de: 'Garden & Sea Retreat: Luxuriöse Maisonette in Paliouri (Strand Xenia)',
    title_ro: 'Garden & Sea Retreat: Maisonetă de lux în Paliouri (plaja Xenia)',
    title_bg: 'Garden & Sea Retreat: Луксозен мезонет в Палиури (плаж Ксения)',
    title_sr: 'Garden & Sea Retreat: Luksuzna mezoneta u Paliuriju (plaža Ksenija)',
    title_ru: 'Garden & Sea Retreat: Роскошный мезонет в Палиури (пляж Ксения)',
  },
  'trochovila-roufinas-nea-potidaia': {
    title_en: 'Roufinas Caravan',
    title_de: 'Wohnwagen Roufinas',
    title_ro: 'Rulota Roufinas',
    title_bg: 'Каравана Руфинас',
    title_sr: 'Kamp-prikolica Rufinas',
    title_ru: 'Дом на колёсах Руфинас',
  },
  'thea-apo-psila-nea-potidaia': {
    title_sr: 'Pogled sa visine',
  },
  'souita-me-idiotiki-pisina-n-fokaia': {
    title_en: 'Be-villas Suite with Private Pool',
    title_bg: 'Be-villas Апартамент с частен басейн',
  },
  'monokatoikia-stin-paralia-40-2667222-23-184278nea-plagia-chalkidikis': {
    title_en: 'Detached House by the Beach',
    title_ro: 'Casă lângă plajă',
    title_bg: 'Къща до плажа',
    title_sr: 'Kuća pored plaže',
    title_ru: 'Частный дом у пляжа',
  },
  'akti-liakada-hotel-gerakini': {
    title_en: 'Akti Liakada Hotel',
    title_de: 'Hotel Akti Liakada',
    title_ro: 'Hotel Akti Liakada',
    title_bg: 'Хотел Акти Лиакада',
    title_sr: 'Hotel Akti Liakada',
    title_ru: 'Отель Акти Лиакада',
  },
  'paratheristiki-katoikia-konta-stin-thalassa-galini-kallikrateias': {
    title_ru: 'Дом для отдыха у моря',
  },
  'stoyntio-stin-toroni-chalkidiki-toroni': {
    title_en: 'Studio in Toroni, Halkidiki',
    title_de: 'Studio in Toroni, Chalkidiki',
    title_ro: 'Studio în Toroni, Halkidiki',
    title_bg: 'Студио в Торони, Халкидики',
    title_sr: 'Studio u Toroniju, Halkidiki',
    title_ru: 'Студия в Торони, Халкидики',
  },
  'diorofi-katoikia-me-tzakoyzi-stin-nea-potidaia-nea-potidaia': {
    title_en: 'Two-Storey House with Jacuzzi in Nea Potidaia',
    title_de: 'Zweistöckiges Haus mit Whirlpool in Nea Potidea',
    title_ro: 'Casă cu două etaje și jacuzzi în Nea Potidea',
    title_bg: 'Двуетажна къща с джакузи в Неа Потидея',
    title_sr: 'Dvospratna kuća sa džakuzijem u Nea Potideji',
    title_ru: 'Двухэтажный дом с джакузи в Неа-Потидее',
  },
  'stoyntio-konta-sti-thalassa-sti-vourvouroy-vourvouroy-sithonia': {
    title_bg: 'Студио близо до морето във Вурвуру',
  },
  'enoikiazomena-domatia-stin-toroni-toroni': {
    title_de: 'Zimmer zu vermieten in Toroni',
    title_bg: 'Стаи под наем в Торони',
    title_sr: 'Sobe za izdavanje u Toroniju',
    title_ru: 'Комнаты в аренду в Торони',
  },
  'nea-potidaia-sale-nea-potidaia-chalkidikis': {
    title_en: 'Nea Potidaia Chalets',
    title_de: 'Chalets in Nea Potidea',
    title_ro: 'Căsuțe în Nea Potidea',
    title_bg: 'Шалета в Неа Потидея',
    title_sr: 'Šaleti u Nea Potideji',
    title_ru: 'Шале в Неа-Потидее',
  },
};
