import type { Locale } from '@/i18n/config';

/**
 * Canonical place names. The `name_*` columns in the villages table were
 * machine-translated word by word in v3 ("Ελιά" → "Olive" / "Маслина",
 * "Παρθενώνας" → "Panteon", "Πολύχρονο" → "Полифоно"). Place names are
 * transliterated, not translated, so this table — written by hand with the
 * forms each market's tour operators actually use — overrides the database.
 *
 *  - `inEl`: Greek preposition + article + accusative ("στην Καλλιθέα"),
 *    because "κοντά στο Καλλιθέα" (what v3 printed) is simply wrong.
 *  - ru/bg/sr titles use apposition ("у посёлка Калитея", "край Калитея",
 *    "u mestu Kalitea") so the name never has to be declined.
 */
export type PlaceName = Record<Locale, string> & { inEl: string };

export const PLACE_NAMES: Record<string, PlaceName> = {
  afytos: { el: 'Άφυτος', inEl: 'στην Άφυτο', en: 'Afytos', de: 'Afytos', ro: 'Afytos', bg: 'Афитос', sr: 'Afitos', ru: 'Афитос' },
  'agia-paraskevi': { el: 'Αγία Παρασκευή', inEl: 'στην Αγία Παρασκευή', en: 'Agia Paraskevi', de: 'Agia Paraskevi', ro: 'Agia Paraskevi', bg: 'Агия Параскеви', sr: 'Agija Paraskevi', ru: 'Агия Параскеви' },
  'agios-nikolaos': { el: 'Άγιος Νικόλαος', inEl: 'στον Άγιο Νικόλαο', en: 'Agios Nikolaos', de: 'Agios Nikolaos', ro: 'Agios Nikolaos', bg: 'Агиос Николаос', sr: 'Agios Nikolaos', ru: 'Агиос Николаос' },
  'agios-pavlos': { el: 'Άγιος Παύλος', inEl: 'στον Άγιο Παύλο', en: 'Agios Pavlos', de: 'Agios Pavlos', ro: 'Agios Pavlos', bg: 'Агиос Павлос', sr: 'Agios Pavlos', ru: 'Агиос Павлос' },
  'agios-prodromos': { el: 'Άγιος Πρόδρομος', inEl: 'στον Άγιο Πρόδρομο', en: 'Agios Prodromos', de: 'Agios Prodromos', ro: 'Agios Prodromos', bg: 'Агиос Продромос', sr: 'Agios Prodromos', ru: 'Агиос Продромос' },
  ammouliani: { el: 'Αμμουλιανή', inEl: 'στην Αμμουλιανή', en: 'Ammouliani', de: 'Ammouliani', ro: 'Ammouliani', bg: 'Амулиани', sr: 'Amuljani', ru: 'Аммульяни' },
  arnaia: { el: 'Αρναία', inEl: 'στην Αρναία', en: 'Arnaia', de: 'Arnea', ro: 'Arnaia', bg: 'Арнеа', sr: 'Arnea', ru: 'Арнея' },
  doumbia: { el: 'Δουμπιά', inEl: 'στη Δουμπιά', en: 'Doumbia', de: 'Doumbia', ro: 'Doumbia', bg: 'Думбия', sr: 'Dumbija', ru: 'Думбья' },
  elani: { el: 'Ελάνη', inEl: 'στην Ελάνη', en: 'Elani', de: 'Elani', ro: 'Elani', bg: 'Елани', sr: 'Elani', ru: 'Элани' },
  elia: { el: 'Ελιά', inEl: 'στην Ελιά', en: 'Elia', de: 'Elia', ro: 'Elia', bg: 'Елия', sr: 'Elija', ru: 'Элия' },
  flogita: { el: 'Φλογητά', inEl: 'στα Φλογητά', en: 'Flogita', de: 'Flogita', ro: 'Flogita', bg: 'Флогита', sr: 'Flogita', ru: 'Флогита' },
  fourka: { el: 'Φούρκα', inEl: 'στη Φούρκα', en: 'Fourka', de: 'Fourka', ro: 'Fourka', bg: 'Фурка', sr: 'Furka', ru: 'Фурка' },
  galatista: { el: 'Γαλάτιστα', inEl: 'στη Γαλάτιστα', en: 'Galatista', de: 'Galatista', ro: 'Galatista', bg: 'Галатиста', sr: 'Galatista', ru: 'Галатиста' },
  gerakini: { el: 'Γερακινή', inEl: 'στη Γερακινή', en: 'Gerakini', de: 'Gerakini', ro: 'Gerakini', bg: 'Геракини', sr: 'Gerakini', ru: 'Геракини' },
  gomati: { el: 'Γομάτι', inEl: 'στο Γομάτι', en: 'Gomati', de: 'Gomati', ro: 'Gomati', bg: 'Гомати', sr: 'Gomati', ru: 'Гомати' },
  hanioti: { el: 'Χανιώτη', inEl: 'στη Χανιώτη', en: 'Hanioti', de: 'Chanioti', ro: 'Hanioti', bg: 'Ханиоти', sr: 'Hanioti', ru: 'Ханиоти' },
  ierissos: { el: 'Ιερισσός', inEl: 'στην Ιερισσό', en: 'Ierissos', de: 'Ierissos', ro: 'Ierissos', bg: 'Йерисос', sr: 'Jerisos', ru: 'Иериссос' },
  kalamitsi: { el: 'Καλαμίτσι', inEl: 'στο Καλαμίτσι', en: 'Kalamitsi', de: 'Kalamitsi', ro: 'Kalamitsi', bg: 'Каламици', sr: 'Kalamici', ru: 'Каламици' },
  kalandra: { el: 'Καλάνδρα', inEl: 'στην Καλάνδρα', en: 'Kalandra', de: 'Kalandra', ro: 'Kalandra', bg: 'Каландра', sr: 'Kalandra', ru: 'Каландра' },
  kallithea: { el: 'Καλλιθέα', inEl: 'στην Καλλιθέα', en: 'Kallithea', de: 'Kallithea', ro: 'Kallithea', bg: 'Калитея', sr: 'Kalitea', ru: 'Калитея' },
  'kalyves-polygyrou': { el: 'Καλύβες Πολυγύρου', inEl: 'στις Καλύβες Πολυγύρου', en: 'Kalyves Polygyrou', de: 'Kalyves Polygyrou', ro: 'Kalyves Polygyrou', bg: 'Каливес Полигиру', sr: 'Kalives Poligiru', ru: 'Каливес Полигиру' },
  kassandreia: { el: 'Κασσάνδρεια', inEl: 'στην Κασσάνδρεια', en: 'Kassandreia', de: 'Kassandria', ro: 'Kassandria', bg: 'Касандрия', sr: 'Kasandrija', ru: 'Кассандрия' },
  kassandrino: { el: 'Κασσανδρινό', inEl: 'στο Κασσανδρινό', en: 'Kassandrino', de: 'Kassandrino', ro: 'Kassandrino', bg: 'Касандрино', sr: 'Kasandrino', ru: 'Кассандрино' },
  kriopigi: { el: 'Κρυοπηγή', inEl: 'στην Κρυοπηγή', en: 'Kriopigi', de: 'Kriopigi', ro: 'Kriopigi', bg: 'Криопиги', sr: 'Kriopigi', ru: 'Криопиги' },
  lakkoma: { el: 'Λάκκωμα', inEl: 'στο Λάκκωμα', en: 'Lakkoma', de: 'Lakkoma', ro: 'Lakkoma', bg: 'Лакома', sr: 'Lakoma', ru: 'Лаккома' },
  'loutra-agias-paraskevis': { el: 'Λουτρά Αγίας Παρασκευής', inEl: 'στα Λουτρά Αγίας Παρασκευής', en: 'Agia Paraskevi Hot Springs', de: 'Thermalquellen von Agia Paraskevi', ro: 'Izvoarele termale Agia Paraskevi', bg: 'Термални извори Агия Параскеви', sr: 'Termalni izvori Agija Paraskevi', ru: 'Термальные источники Агия Параскеви' },
  'megali-panagia': { el: 'Μεγάλη Παναγία', inEl: 'στη Μεγάλη Παναγία', en: 'Megali Panagia', de: 'Megali Panagia', ro: 'Megali Panagia', bg: 'Мегали Панагия', sr: 'Megali Panagija', ru: 'Мегали Панагия' },
  metagitsi: { el: 'Μεταγγίτσι', inEl: 'στο Μεταγγίτσι', en: 'Metangitsi', de: 'Metangitsi', ro: 'Metangitsi', bg: 'Метангици', sr: 'Metangici', ru: 'Метангици' },
  metamorfosi: { el: 'Μεταμόρφωση', inEl: 'στη Μεταμόρφωση', en: 'Metamorfosi', de: 'Metamorfosi', ro: 'Metamorfosi', bg: 'Метаморфоси', sr: 'Metamorfosi', ru: 'Метаморфоси' },
  'mola-kalyva': { el: 'Μόλα Καλύβα', inEl: 'στη Μόλα Καλύβα', en: 'Mola Kalyva', de: 'Mola Kalyva', ro: 'Mola Kalyva', bg: 'Мола Калива', sr: 'Mola Kaliva', ru: 'Мола Калива' },
  'nea-fokaia': { el: 'Νέα Φώκαια', inEl: 'στη Νέα Φώκαια', en: 'Nea Fokea', de: 'Nea Fokea', ro: 'Nea Fokea', bg: 'Неа Фокия', sr: 'Nea Fokea', ru: 'Неа Фокея' },
  'nea-gonia': { el: 'Νέα Γωνιά', inEl: 'στη Νέα Γωνιά', en: 'Nea Gonia', de: 'Nea Gonia', ro: 'Nea Gonia', bg: 'Неа Гония', sr: 'Nea Gonija', ru: 'Неа Гония' },
  'nea-iraklia': { el: 'Νέα Ηράκλεια', inEl: 'στη Νέα Ηράκλεια', en: 'Nea Iraklia', de: 'Nea Iraklia', ro: 'Nea Iraklia', bg: 'Неа Иракли', sr: 'Nea Iraklija', ru: 'Неа Ираклия' },
  'nea-kallikratia': { el: 'Νέα Καλλικράτεια', inEl: 'στη Νέα Καλλικράτεια', en: 'Nea Kallikratia', de: 'Nea Kallikratia', ro: 'Nea Kallikratia', bg: 'Неа Каликратия', sr: 'Nea Kalikratija', ru: 'Неа Калликратия' },
  'nea-moudania': { el: 'Νέα Μουδανιά', inEl: 'στη Νέα Μουδανιά', en: 'Nea Moudania', de: 'Nea Moudania', ro: 'Nea Moudania', bg: 'Неа Мудания', sr: 'Nea Mudanja', ru: 'Неа Мудания' },
  'nea-plagia': { el: 'Νέα Πλάγια', inEl: 'στη Νέα Πλάγια', en: 'Nea Plagia', de: 'Nea Plagia', ro: 'Nea Plagia', bg: 'Неа Плагия', sr: 'Nea Plagija', ru: 'Неа Плагия' },
  'nea-potidaia': { el: 'Νέα Ποτίδαια', inEl: 'στη Νέα Ποτίδαια', en: 'Nea Potidea', de: 'Nea Potidea', ro: 'Nea Potidea', bg: 'Неа Потидея', sr: 'Nea Potideja', ru: 'Неа Потидея' },
  'nea-roda': { el: 'Νέα Ρόδα', inEl: 'στη Νέα Ρόδα', en: 'Nea Roda', de: 'Nea Roda', ro: 'Nea Roda', bg: 'Неа Рода', sr: 'Nea Roda', ru: 'Неа Рода' },
  'nea-skioni': { el: 'Νέα Σκιώνη', inEl: 'στη Νέα Σκιώνη', en: 'Nea Skioni', de: 'Nea Skioni', ro: 'Nea Skioni', bg: 'Неа Скиони', sr: 'Nea Skioni', ru: 'Неа Скиони' },
  'nea-triglia': { el: 'Νέα Τρίγλια', inEl: 'στη Νέα Τρίγλια', en: 'Nea Triglia', de: 'Nea Triglia', ro: 'Nea Triglia', bg: 'Неа Триглия', sr: 'Nea Triglija', ru: 'Неа Триглия' },
  neohori: { el: 'Νεοχώρι', inEl: 'στο Νεοχώρι', en: 'Neochori', de: 'Neochori', ro: 'Neochori', bg: 'Неохори', sr: 'Neohori', ru: 'Неохори' },
  'neos-marmaras': { el: 'Νέος Μαρμαράς', inEl: 'στον Νέο Μαρμαρά', en: 'Neos Marmaras', de: 'Neos Marmaras', ro: 'Neos Marmaras', bg: 'Неос Мармарас', sr: 'Neos Marmaras', ru: 'Неос Мармарас' },
  nikiti: { el: 'Νικήτη', inEl: 'στη Νικήτη', en: 'Nikiti', de: 'Nikiti', ro: 'Nikiti', bg: 'Никити', sr: 'Nikiti', ru: 'Никити' },
  olympiada: { el: 'Ολυμπιάδα', inEl: 'στην Ολυμπιάδα', en: 'Olympiada', de: 'Olympiada', ro: 'Olympiada', bg: 'Олимпиада', sr: 'Olimpijada', ru: 'Олимпиада' },
  olynthos: { el: 'Όλυνθος', inEl: 'στην Όλυνθο', en: 'Olynthos', de: 'Olynthos', ro: 'Olynthos', bg: 'Олинтос', sr: 'Olintos', ru: 'Олинф' },
  'ormos-panagias': { el: 'Όρμος Παναγιάς', inEl: 'στον Όρμο Παναγιάς', en: 'Ormos Panagias', de: 'Ormos Panagias', ro: 'Ormos Panagias', bg: 'Ормос Панагияс', sr: 'Ormos Panagijas', ru: 'Ормос Панагиас' },
  ormylia: { el: 'Ορμύλια', inEl: 'στην Ορμύλια', en: 'Ormylia', de: 'Ormylia', ro: 'Ormylia', bg: 'Ормилия', sr: 'Ormilija', ru: 'Ормилия' },
  ouranoupoli: { el: 'Ουρανούπολη', inEl: 'στην Ουρανούπολη', en: 'Ouranoupoli', de: 'Ouranoupoli', ro: 'Ouranoupoli', bg: 'Уранополи', sr: 'Uranopolis', ru: 'Уранополис' },
  palaiohori: { el: 'Παλαιοχώρι', inEl: 'στο Παλαιοχώρι', en: 'Palaiochori', de: 'Palaiochori', ro: 'Palaiochori', bg: 'Палеохори', sr: 'Paleohori', ru: 'Палеохори' },
  palaiokastro: { el: 'Παλαιόκαστρο', inEl: 'στο Παλαιόκαστρο', en: 'Palaiokastro', de: 'Palaiokastro', ro: 'Palaiokastro', bg: 'Палеокастро', sr: 'Paleokastro', ru: 'Палеокастро' },
  paliouri: { el: 'Παλιούρι', inEl: 'στο Παλιούρι', en: 'Paliouri', de: 'Paliouri', ro: 'Paliouri', bg: 'Палиури', sr: 'Paliuri', ru: 'Палиури' },
  parthenonas: { el: 'Παρθενώνας', inEl: 'στον Παρθενώνα', en: 'Parthenonas', de: 'Parthenonas', ro: 'Parthenonas', bg: 'Партенонас', sr: 'Partenonas', ru: 'Парфенонас' },
  pefkohori: { el: 'Πευκοχώρι', inEl: 'στο Πευκοχώρι', en: 'Pefkochori', de: 'Pefkochori', ro: 'Pefkohori', bg: 'Пефкохори', sr: 'Pefkohori', ru: 'Пефкохори' },
  planitsi: { el: 'Πλατανίτσι', inEl: 'στο Πλατανίτσι', en: 'Platanitsi', de: 'Platanitsi', ro: 'Platanitsi', bg: 'Платаници', sr: 'Platanici', ru: 'Платаници' },
  polychrono: { el: 'Πολύχρονο', inEl: 'στο Πολύχρονο', en: 'Polychrono', de: 'Polychrono', ro: 'Polichrono', bg: 'Полихроно', sr: 'Polihrono', ru: 'Полихроно' },
  polygyros: { el: 'Πολύγυρος', inEl: 'στον Πολύγυρο', en: 'Polygyros', de: 'Polygyros', ro: 'Polygyros', bg: 'Полигирос', sr: 'Poligiros', ru: 'Полигирос' },
  portaria: { el: 'Πορταριά', inEl: 'στην Πορταριά', en: 'Portaria', de: 'Portaria', ro: 'Portaria', bg: 'Портария', sr: 'Portarija', ru: 'Портария' },
  'porto-koufo': { el: 'Πόρτο Κουφό', inEl: 'στο Πόρτο Κουφό', en: 'Porto Koufo', de: 'Porto Koufo', ro: 'Porto Koufo', bg: 'Порто Куфо', sr: 'Porto Kufo', ru: 'Порто Куфо' },
  posidi: { el: 'Ποσείδι', inEl: 'στο Ποσείδι', en: 'Posidi', de: 'Possidi', ro: 'Posidi', bg: 'Посиди', sr: 'Posidi', ru: 'Посиди' },
  psakoudia: { el: 'Ψακούδια', inEl: 'στα Ψακούδια', en: 'Psakoudia', de: 'Psakoudia', ro: 'Psakoudia', bg: 'Псакудия', sr: 'Psakudija', ru: 'Псакудья' },
  pyrgadikia: { el: 'Πυργαδίκια', inEl: 'στα Πυργαδίκια', en: 'Pyrgadikia', de: 'Pyrgadikia', ro: 'Pyrgadikia', bg: 'Пиргадикия', sr: 'Pirgadikija', ru: 'Пиргадикья' },
  'pyrgadikia-mainland': { el: 'Πυργαδίκια', inEl: 'στα Πυργαδίκια', en: 'Pyrgadikia', de: 'Pyrgadikia', ro: 'Pyrgadikia', bg: 'Пиргадикия', sr: 'Pirgadikija', ru: 'Пиргадикья' },
  sani: { el: 'Σάνη', inEl: 'στη Σάνη', en: 'Sani', de: 'Sani', ro: 'Sani', bg: 'Сани', sr: 'Sani', ru: 'Сани' },
  sanos: { el: 'Σανός', inEl: 'στον Σανό', en: 'Sanos', de: 'Sanos', ro: 'Sanos', bg: 'Санос', sr: 'Sanos', ru: 'Санос' },
  sarti: { el: 'Σάρτη', inEl: 'στη Σάρτη', en: 'Sarti', de: 'Sarti', ro: 'Sarti', bg: 'Сарти', sr: 'Sarti', ru: 'Сарти' },
  sikia: { el: 'Συκιά', inEl: 'στη Συκιά', en: 'Sykia', de: 'Sykia', ro: 'Sykia', bg: 'Сикия', sr: 'Sikija', ru: 'Сикия' },
  simantra: { el: 'Σήμαντρα', inEl: 'στα Σήμαντρα', en: 'Simantra', de: 'Simantra', ro: 'Simantra', bg: 'Симантра', sr: 'Simantra', ru: 'Симантра' },
  siviri: { el: 'Σίβηρη', inEl: 'στη Σίβηρη', en: 'Siviri', de: 'Siviri', ro: 'Siviri', bg: 'Сивири', sr: 'Siviri', ru: 'Сивири' },
  sozopoli: { el: 'Σωζόπολη', inEl: 'στη Σωζόπολη', en: 'Sozopoli', de: 'Sozopoli', ro: 'Sozopoli', bg: 'Созополи', sr: 'Sozopoli', ru: 'Созополи' },
  stagira: { el: 'Στάγειρα', inEl: 'στα Στάγειρα', en: 'Stagira', de: 'Stagira', ro: 'Stagira', bg: 'Стагира', sr: 'Stagira', ru: 'Стагира' },
  stratoni: { el: 'Στρατώνι', inEl: 'στο Στρατώνι', en: 'Stratoni', de: 'Stratoni', ro: 'Stratoni', bg: 'Стратони', sr: 'Stratoni', ru: 'Стратони' },
  stratoniki: { el: 'Στρατονίκη', inEl: 'στη Στρατονίκη', en: 'Stratoniki', de: 'Stratoniki', ro: 'Stratoniki', bg: 'Стратоники', sr: 'Stratoniki', ru: 'Стратоники' },
  taxiarhis: { el: 'Ταξιάρχης', inEl: 'στον Ταξιάρχη', en: 'Taxiarchis', de: 'Taxiarchis', ro: 'Taxiarchis', bg: 'Таксиархис', sr: 'Taksijarhis', ru: 'Таксиархис' },
  toroni: { el: 'Τορώνη', inEl: 'στην Τορώνη', en: 'Toroni', de: 'Toroni', ro: 'Toroni', bg: 'Торони', sr: 'Toroni', ru: 'Торони' },
  tripiti: { el: 'Τρυπητή', inEl: 'στην Τρυπητή', en: 'Trypiti', de: 'Trypiti', ro: 'Trypiti', bg: 'Трипити', sr: 'Tripiti', ru: 'Трипити' },
  varvara: { el: 'Βαρβάρα', inEl: 'στη Βαρβάρα', en: 'Varvara', de: 'Varvara', ro: 'Varvara', bg: 'Варвара', sr: 'Varvara', ru: 'Варвара' },
  vavdos: { el: 'Βάβδος', inEl: 'στη Βάβδο', en: 'Vavdos', de: 'Vavdos', ro: 'Vavdos', bg: 'Вавдос', sr: 'Vavdos', ru: 'Вавдос' },
  vourvourou: { el: 'Βουρβουρού', inEl: 'στη Βουρβουρού', en: 'Vourvourou', de: 'Vourvourou', ro: 'Vourvourou', bg: 'Вурвуру', sr: 'Vurvuru', ru: 'Вурвуру' },
  vrasta: { el: 'Βραστά', inEl: 'στα Βραστά', en: 'Vrasta', de: 'Vrasta', ro: 'Vrasta', bg: 'Враста', sr: 'Vrasta', ru: 'Враста' },
  xiropotamo: { el: 'Ξηροπόταμο', inEl: 'στο Ξηροπόταμο', en: 'Xiropotamo', de: 'Xiropotamo', ro: 'Xiropotamo', bg: 'Ксиропотамо', sr: 'Ksiropotamo', ru: 'Ксиропотамо' },
  zografou: { el: 'Ζωγράφου', inEl: 'στο Ζωγράφου', en: 'Zografou', de: 'Zografou', ro: 'Zografou', bg: 'Зографу', sr: 'Zografu', ru: 'Зографу' },
};

export const AREA_NAMES: Record<'kassandra' | 'sithonia' | 'athos' | 'mainland', PlaceName> = {
  kassandra: { el: 'Κασσάνδρα', inEl: 'στην Κασσάνδρα', en: 'Kassandra', de: 'Kassandra', ro: 'Kassandra', bg: 'Касандра', sr: 'Kasandra', ru: 'Кассандра' },
  sithonia: { el: 'Σιθωνία', inEl: 'στη Σιθωνία', en: 'Sithonia', de: 'Sithonia', ro: 'Sithonia', bg: 'Ситония', sr: 'Sitonija', ru: 'Ситония' },
  athos: { el: 'χερσόνησος του Άθω', inEl: 'στη χερσόνησο του Άθω', en: 'Athos peninsula', de: 'Athos-Halbinsel', ro: 'Peninsula Athos', bg: 'полуостров Атон', sr: 'poluostrvo Atos', ru: 'полуостров Афон' },
  mainland: { el: 'ενδοχώρα της Χαλκιδικής', inEl: 'στην ενδοχώρα της Χαλκιδικής', en: 'inland Halkidiki', de: 'Hinterland von Chalkidiki', ro: 'interiorul Halkidikiului', bg: 'вътрешността на Халкидики', sr: 'unutrašnjost Halkidikija', ru: 'внутренние районы Халкидики' },
};

export const HALKIDIKI: Record<Locale, string> = {
  el: 'Χαλκιδική', en: 'Halkidiki', de: 'Chalkidiki', ro: 'Halkidiki', bg: 'Халкидики', sr: 'Halkidiki', ru: 'Халкидики',
};

/** Canonical name for a village, falling back to the DB value for unknown slugs. */
export function placeName(slug: string, locale: Locale, dbRow?: Record<string, unknown>): string {
  const known = PLACE_NAMES[slug];
  if (known) return known[locale];
  const v = (dbRow?.[`name_${locale}`] || dbRow?.name_en || dbRow?.name_el || slug) as string;
  return v;
}

/** Greek "στην Καλλιθέα"-style phrase; other locales get the bare name. */
export function inPlace(slug: string, locale: Locale): string {
  const known = PLACE_NAMES[slug];
  if (!known) return slug;
  return locale === 'el' ? known.inEl : known[locale];
}
