type L = Record<string, string>;

export interface LocationCategory {
  locationSlug: string;
  locationName: L; // { el: 'Νικήτη', en: 'Nikiti', de: 'Nikiti', ... }
  area: string; // 'kassandra' | 'sithonia' | 'athos' | 'mainland'
  locationNameDb: string; // the location_name value used in the database
}

export const LOCATIONS: LocationCategory[] = [
  // ── Kassandra ─────────────────────────────────────────────
  { locationSlug: 'afytos', locationName: { el: 'Άφυτος', en: 'Afytos', de: 'Afytos', bg: 'Афитос', ru: 'Афитос', ro: 'Afytos', sr: 'Afitos' }, area: 'kassandra', locationNameDb: 'Afytos' },
  { locationSlug: 'kallithea', locationName: { el: 'Καλλιθέα', en: 'Kallithea', de: 'Kallithea', bg: 'Калитея', ru: 'Каллифея', ro: 'Kallithea', sr: 'Kalitea' }, area: 'kassandra', locationNameDb: 'Kallithea' },
  { locationSlug: 'hanioti', locationName: { el: 'Χανιώτη', en: 'Hanioti', de: 'Hanioti', bg: 'Ханиоти', ru: 'Ханиоти', ro: 'Hanioti', sr: 'Hanioti' }, area: 'kassandra', locationNameDb: 'Hanioti' },
  { locationSlug: 'pefkohori', locationName: { el: 'Πευκοχώρι', en: 'Pefkohori', de: 'Pefkohori', bg: 'Пефкохори', ru: 'Пефкохори', ro: 'Pefkohori', sr: 'Pefkohori' }, area: 'kassandra', locationNameDb: 'Pefkohori' },
  { locationSlug: 'siviri', locationName: { el: 'Σίβηρη', en: 'Siviri', de: 'Siviri', bg: 'Сивири', ru: 'Сивири', ro: 'Siviri', sr: 'Siviri' }, area: 'kassandra', locationNameDb: 'Siviri' },
  { locationSlug: 'polychrono', locationName: { el: 'Πολύχρονο', en: 'Polychrono', de: 'Polychrono', bg: 'Полихроно', ru: 'Полихроно', ro: 'Polychrono', sr: 'Polihrono' }, area: 'kassandra', locationNameDb: 'Polychrono' },
  { locationSlug: 'possidi', locationName: { el: 'Ποσείδι', en: 'Possidi', de: 'Possidi', bg: 'Посиди', ru: 'Посиди', ro: 'Possidi', sr: 'Posidi' }, area: 'kassandra', locationNameDb: 'Possidi' },
  { locationSlug: 'posidi', locationName: { el: 'Ποσείδι', en: 'Possidi', de: 'Possidi', bg: 'Посиди', ru: 'Посиди', ro: 'Possidi', sr: 'Posidi' }, area: 'kassandra', locationNameDb: 'Possidi' },
  { locationSlug: 'nea-fokea', locationName: { el: 'Νέα Φώκαια', en: 'Nea Fokea', de: 'Nea Fokea', bg: 'Неа Фокеа', ru: 'Неа Фокея', ro: 'Nea Fokea', sr: 'Nea Fokea' }, area: 'kassandra', locationNameDb: 'Nea Fokea' },
  { locationSlug: 'kalamitsi', locationName: { el: 'Καλαμίτσι', en: 'Kalamitsi', de: 'Kalamitsi', bg: 'Каламици', ru: 'Каламици', ro: 'Kalamitsi', sr: 'Kalamici' }, area: 'kassandra', locationNameDb: 'Kalamitsi' },
  { locationSlug: 'kriopigi', locationName: { el: 'Κρυοπηγή', en: 'Kriopigi', de: 'Kriopigi', bg: 'Криопиги', ru: 'Криопиги', ro: 'Kriopigi', sr: 'Kriopigi' }, area: 'kassandra', locationNameDb: 'Kriopigi' },
  { locationSlug: 'fourka', locationName: { el: 'Φούρκα', en: 'Fourka', de: 'Fourka', bg: 'Фурка', ru: 'Фурка', ro: 'Fourka', sr: 'Furka' }, area: 'kassandra', locationNameDb: 'Fourka' },
  { locationSlug: 'paliouri', locationName: { el: 'Παλιούρι', en: 'Paliouri', de: 'Paliouri', bg: 'Палиури', ru: 'Палиури', ro: 'Paliouri', sr: 'Paliuri' }, area: 'kassandra', locationNameDb: 'Paliouri' },
  { locationSlug: 'nea-potidaia', locationName: { el: 'Νέα Ποτίδαια', en: 'Nea Potidaia', de: 'Nea Potidaia', bg: 'Неа Потидеа', ru: 'Неа Потидея', ro: 'Nea Potidaia', sr: 'Nea Potidea' }, area: 'kassandra', locationNameDb: 'Nea Potidaia' },
  { locationSlug: 'nea-skioni', locationName: { el: 'Νέα Σκιώνη', en: 'Nea Skioni', de: 'Nea Skioni', bg: 'Неа Скиони', ru: 'Неа Скиони', ro: 'Nea Skioni', sr: 'Nea Skioni' }, area: 'kassandra', locationNameDb: 'Nea Skioni' },
  { locationSlug: 'kassandrino', locationName: { el: 'Κασσανδρινό', en: 'Kassandrino', de: 'Kassandrino', bg: 'Касандрино', ru: 'Кассандрино', ro: 'Kassandrino', sr: 'Kasandrino' }, area: 'kassandra', locationNameDb: 'Kassandrino' },
  { locationSlug: 'kalandra', locationName: { el: 'Κάλανδρα', en: 'Kalandra', de: 'Kalandra', bg: 'Каландра', ru: 'Каландра', ro: 'Kalandra', sr: 'Kalandra' }, area: 'kassandra', locationNameDb: 'Kalandra' },
  // ── Sithonia ──────────────────────────────────────────────
  { locationSlug: 'nikiti', locationName: { el: 'Νικήτη', en: 'Nikiti', de: 'Nikiti', bg: 'Никити', ru: 'Никити', ro: 'Nikiti', sr: 'Nikiti' }, area: 'sithonia', locationNameDb: 'Nikiti' },
  { locationSlug: 'vourvourou', locationName: { el: 'Βουρβουρού', en: 'Vourvourou', de: 'Vourvourou', bg: 'Вурвуру', ru: 'Вурвуру', ro: 'Vourvourou', sr: 'Vurvuru' }, area: 'sithonia', locationNameDb: 'Vourvourou' },
  { locationSlug: 'neos-marmaras', locationName: { el: 'Νέος Μαρμαράς', en: 'Neos Marmaras', de: 'Neos Marmaras', bg: 'Неос Мармарас', ru: 'Неос Мармарас', ro: 'Neos Marmaras', sr: 'Neos Marmaras' }, area: 'sithonia', locationNameDb: 'Neos Marmaras' },
  { locationSlug: 'sarti', locationName: { el: 'Σάρτη', en: 'Sarti', de: 'Sarti', bg: 'Сарти', ru: 'Сарти', ro: 'Sarti', sr: 'Sarti' }, area: 'sithonia', locationNameDb: 'Sarti' },
  { locationSlug: 'toroni', locationName: { el: 'Τορώνη', en: 'Toroni', de: 'Toroni', bg: 'Торони', ru: 'Торони', ro: 'Toroni', sr: 'Toroni' }, area: 'sithonia', locationNameDb: 'Toroni' },
  { locationSlug: 'porto-koufo', locationName: { el: 'Πόρτο Κουφό', en: 'Porto Koufo', de: 'Porto Koufo', bg: 'Порто Куфо', ru: 'Порто Куфо', ro: 'Porto Koufo', sr: 'Porto Kufo' }, area: 'sithonia', locationNameDb: 'Porto Koufo' },
  { locationSlug: 'sikia', locationName: { el: 'Συκιά', en: 'Sikia', de: 'Sikia', bg: 'Сикия', ru: 'Сикия', ro: 'Sikia', sr: 'Sikija' }, area: 'sithonia', locationNameDb: 'Sikia' },
  { locationSlug: 'metamorfosi', locationName: { el: 'Μεταμόρφωση', en: 'Metamorfosi', de: 'Metamorfosi', bg: 'Метаморфоси', ru: 'Метаморфоси', ro: 'Metamorfosi', sr: 'Metamorfosi' }, area: 'sithonia', locationNameDb: 'Metamorfosi' },
  { locationSlug: 'ormos-panagias', locationName: { el: 'Όρμος Παναγίας', en: 'Ormos Panagias', de: 'Ormos Panagias', bg: 'Ормос Панагиас', ru: 'Ормос Панагиас', ro: 'Ormos Panagias', sr: 'Ormos Panagias' }, area: 'sithonia', locationNameDb: 'Ormos Panagias' },
  { locationSlug: 'agios-nikolaos', locationName: { el: 'Άγιος Νικόλαος', en: 'Agios Nikolaos', de: 'Agios Nikolaos', bg: 'Агиос Николаос', ru: 'Агиос Николаос', ro: 'Agios Nikolaos', sr: 'Agios Nikolaos' }, area: 'sithonia', locationNameDb: 'Agios Nikolaos' },
  { locationSlug: 'parthenonas', locationName: { el: 'Παρθενώνας', en: 'Parthenonas', de: 'Parthenonas', bg: 'Партенонас', ru: 'Партенонас', ro: 'Parthenonas', sr: 'Partenonas' }, area: 'sithonia', locationNameDb: 'Parthenonas' },
  // ── Athos area ────────────────────────────────────────────
  { locationSlug: 'ouranoupoli', locationName: { el: 'Ουρανούπολη', en: 'Ouranoupoli', de: 'Ouranoupoli', bg: 'Уранополис', ru: 'Уранополис', ro: 'Ouranoupoli', sr: 'Uranopolis' }, area: 'athos', locationNameDb: 'Ouranoupoli' },
  { locationSlug: 'ierissos', locationName: { el: 'Ιερισσός', en: 'Ierissos', de: 'Ierissos', bg: 'Иерисос', ru: 'Иериссос', ro: 'Ierissos', sr: 'Jerisos' }, area: 'athos', locationNameDb: 'Ierissos' },
  { locationSlug: 'nea-roda', locationName: { el: 'Νέα Ρόδα', en: 'Nea Roda', de: 'Nea Roda', bg: 'Неа Рода', ru: 'Неа Рода', ro: 'Nea Roda', sr: 'Nea Roda' }, area: 'athos', locationNameDb: 'Nea Roda' },
  { locationSlug: 'stagira', locationName: { el: 'Στάγειρα', en: 'Stagira', de: 'Stagira', bg: 'Стагира', ru: 'Стагира', ro: 'Stagira', sr: 'Stagira' }, area: 'athos', locationNameDb: 'Stagira' },
  { locationSlug: 'olympiada', locationName: { el: 'Ολυμπιάδα', en: 'Olympiada', de: 'Olympiada', bg: 'Олимпиада', ru: 'Олимпиада', ro: 'Olympiada', sr: 'Olimpijada' }, area: 'athos', locationNameDb: 'Olympiada' },
  { locationSlug: 'tripiti', locationName: { el: 'Τρυπητή', en: 'Tripiti', de: 'Tripiti', bg: 'Трипити', ru: 'Трипити', ro: 'Tripiti', sr: 'Tripiti' }, area: 'athos', locationNameDb: 'Tripiti' },
  { locationSlug: 'stratoni', locationName: { el: 'Στρατώνι', en: 'Stratoni', de: 'Stratoni', bg: 'Стратони', ru: 'Стратони', ro: 'Stratoni', sr: 'Stratoni' }, area: 'athos', locationNameDb: 'Stratoni' },
  { locationSlug: 'stratoniki', locationName: { el: 'Στρατονίκη', en: 'Stratoniki', de: 'Stratoniki', bg: 'Стратоники', ru: 'Стратоники', ro: 'Stratoniki', sr: 'Stratoniki' }, area: 'athos', locationNameDb: 'Stratoniki' },
  { locationSlug: 'pyrgadikia', locationName: { el: 'Πυργαδίκια', en: 'Pyrgadikia', de: 'Pyrgadikia', bg: 'Пиргадикия', ru: 'Пиргадикия', ro: 'Pyrgadikia', sr: 'Pirgadikija' }, area: 'athos', locationNameDb: 'Pyrgadikia' },
  { locationSlug: 'megali-panagia', locationName: { el: 'Μεγάλη Παναγία', en: 'Megali Panagia', de: 'Megali Panagia', bg: 'Мегали Панагия', ru: 'Мегали Панагия', ro: 'Megali Panagia', sr: 'Megali Panagija' }, area: 'athos', locationNameDb: 'Megali Panagia' },
  { locationSlug: 'gomati', locationName: { el: 'Γωματί', en: 'Gomati', de: 'Gomati', bg: 'Гомати', ru: 'Гомати', ro: 'Gomati', sr: 'Gomati' }, area: 'athos', locationNameDb: 'Gomati' },
  // ── Mainland ──────────────────────────────────────────────
  { locationSlug: 'arnea', locationName: { el: 'Αρναία', en: 'Arnea', de: 'Arnea', bg: 'Арнеа', ru: 'Арнея', ro: 'Arnea', sr: 'Arnea' }, area: 'mainland', locationNameDb: 'Arnea' },
  { locationSlug: 'nea-moudania', locationName: { el: 'Νέα Μουδανιά', en: 'Nea Moudania', de: 'Nea Moudania', bg: 'Неа Муданя', ru: 'Неа Муданья', ro: 'Nea Moudania', sr: 'Nea Mudanja' }, area: 'mainland', locationNameDb: 'Nea Moudania' },
  { locationSlug: 'polygyros', locationName: { el: 'Πολύγυρος', en: 'Polygyros', de: 'Polygyros', bg: 'Полигирос', ru: 'Полигирос', ro: 'Polygyros', sr: 'Poligiros' }, area: 'mainland', locationNameDb: 'Polygyros' },
  { locationSlug: 'vrasta', locationName: { el: 'Βράσταμα', en: 'Vrasta', de: 'Vrasta', bg: 'Враста', ru: 'Враста', ro: 'Vrasta', sr: 'Vrasta' }, area: 'mainland', locationNameDb: 'Vrasta' },
  { locationSlug: 'galatista', locationName: { el: 'Γαλάτιστα', en: 'Galatista', de: 'Galatista', bg: 'Галатиста', ru: 'Галатиста', ro: 'Galatista', sr: 'Galatista' }, area: 'mainland', locationNameDb: 'Galatista' },
  { locationSlug: 'taxiarchis', locationName: { el: 'Ταξιάρχης', en: 'Taxiarchis', de: 'Taxiarchis', bg: 'Таксиархис', ru: 'Таксиархис', ro: 'Taxiarchis', sr: 'Taksiarhis' }, area: 'mainland', locationNameDb: 'Taxiarchis' },
  { locationSlug: 'palaiohori', locationName: { el: 'Παλαιοχώρι', en: 'Palaiohori', de: 'Palaiohori', bg: 'Палеохори', ru: 'Палеохори', ro: 'Palaiohori', sr: 'Paleohori' }, area: 'mainland', locationNameDb: 'Palaiohori' },
  { locationSlug: 'palaiokastro', locationName: { el: 'Παλαιόκαστρο', en: 'Palaiokastro', de: 'Palaiokastro', bg: 'Палеокастро', ru: 'Палеокастро', ro: 'Palaiokastro', sr: 'Paleokastro' }, area: 'mainland', locationNameDb: 'Palaiokastro' },
  { locationSlug: 'agia-paraskevi', locationName: { el: 'Αγία Παρασκευή', en: 'Agia Paraskevi', de: 'Agia Paraskevi', bg: 'Агия Параскеви', ru: 'Агия Параскеви', ro: 'Agia Paraskevi', sr: 'Agija Paraskevi' }, area: 'mainland', locationNameDb: 'Agia Paraskevi' },
  { locationSlug: 'loutra-agias-paraskevis', locationName: { el: 'Λουτρά Αγίας Παρασκευής', en: 'Loutra Agias Paraskevis', de: 'Loutra Agias Paraskevis', bg: 'Лутра Агиас Параскевис', ru: 'Лутра Агиас Параскевис', ro: 'Loutra Agias Paraskevis', sr: 'Lutra Agias Paraskevis' }, area: 'mainland', locationNameDb: 'Loutra Agias Paraskevis' },
  { locationSlug: 'mola-kalyva', locationName: { el: 'Μόλα Καλύβα', en: 'Mola Kalyva', de: 'Mola Kalyva', bg: 'Мола Калива', ru: 'Мола Калива', ro: 'Mola Kalyva', sr: 'Mola Kaliva' }, area: 'mainland', locationNameDb: 'Mola Kalyva' },
  { locationSlug: 'flogita', locationName: { el: 'Φλογητά', en: 'Flogita', de: 'Flogita', bg: 'Флогита', ru: 'Флогита', ro: 'Flogita', sr: 'Flogita' }, area: 'mainland', locationNameDb: 'Flogita' },
  { locationSlug: 'nea-plagia', locationName: { el: 'Νέα Πλάγια', en: 'Nea Plagia', de: 'Nea Plagia', bg: 'Неа Плагия', ru: 'Неа Плагия', ro: 'Nea Plagia', sr: 'Nea Plagija' }, area: 'mainland', locationNameDb: 'Nea Plagia' },
  { locationSlug: 'nea-triglia', locationName: { el: 'Νέα Τρίγλια', en: 'Nea Triglia', de: 'Nea Triglia', bg: 'Неа Тригля', ru: 'Неа Тригля', ro: 'Nea Triglia', sr: 'Nea Triglja' }, area: 'mainland', locationNameDb: 'Nea Triglia' },
  { locationSlug: 'planitsi', locationName: { el: 'Πλανήτσι', en: 'Planitsi', de: 'Planitsi', bg: 'Планици', ru: 'Планици', ro: 'Planitsi', sr: 'Planici' }, area: 'mainland', locationNameDb: 'Planitsi' },
  { locationSlug: 'neohori', locationName: { el: 'Νεοχώρι', en: 'Neohori', de: 'Neohori', bg: 'Неохори', ru: 'Неохори', ro: 'Neohori', sr: 'Neohori' }, area: 'mainland', locationNameDb: 'Neohori' },
  { locationSlug: 'dionysiou', locationName: { el: 'Διονυσίου', en: 'Dionysiou', de: 'Dionysiou', bg: 'Дионисиу', ru: 'Дионисиу', ro: 'Dionysiou', sr: 'Dionisiou' }, area: 'mainland', locationNameDb: 'Dionysiou' },
  { locationSlug: 'doumbia', locationName: { el: 'Ντουμπιά', en: 'Doumbia', de: 'Doumbia', bg: 'Думбия', ru: 'Думбия', ro: 'Doumbia', sr: 'Dumbija' }, area: 'mainland', locationNameDb: 'Doumbia' },
  { locationSlug: 'elia', locationName: { el: 'Ελιά', en: 'Elia', de: 'Elia', bg: 'Елия', ru: 'Элия', ro: 'Elia', sr: 'Elija' }, area: 'mainland', locationNameDb: 'Elia' },
  { locationSlug: 'xiropotamo', locationName: { el: 'Ξηροπόταμο', en: 'Xiropotamo', de: 'Xiropotamo', bg: 'Ксиропотамо', ru: 'Ксиропотамо', ro: 'Xiropotamo', sr: 'Ksiropotamo' }, area: 'mainland', locationNameDb: 'Xiropotamo' },
  { locationSlug: 'simantra', locationName: { el: 'Σήμαντρα', en: 'Simantra', de: 'Simantra', bg: 'Симантра', ru: 'Симантра', ro: 'Simantra', sr: 'Simantra' }, area: 'mainland', locationNameDb: 'Simantra' },
  { locationSlug: 'olynthos', locationName: { el: 'Όλυνθος', en: 'Olynthos', de: 'Olynthos', bg: 'Олинтос', ru: 'Олинтос', ro: 'Olynthos', sr: 'Olintos' }, area: 'mainland', locationNameDb: 'Olynthos' },
  { locationSlug: 'kalyves-polygyrou', locationName: { el: 'Καλύβες Πολυγύρου', en: 'Kalyves Polygyrou', de: 'Kalyves Polygyrou', bg: 'Каливес Полигиру', ru: 'Каливес Полигиру', ro: 'Kalyves Polygyrou', sr: 'Kalives Poligiru' }, area: 'mainland', locationNameDb: 'Kalyves Polygyrou' },
  { locationSlug: 'portaria', locationName: { el: 'Πορταριά', en: 'Portaria', de: 'Portaria', bg: 'Портария', ru: 'Портария', ro: 'Portaria', sr: 'Portarija' }, area: 'mainland', locationNameDb: 'Portaria' },
  { locationSlug: 'sanos', locationName: { el: 'Σάνος', en: 'Sanos', de: 'Sanos', bg: 'Санос', ru: 'Санос', ro: 'Sanos', sr: 'Sanos' }, area: 'mainland', locationNameDb: 'Sanos' },
  { locationSlug: 'zografou', locationName: { el: 'Ζωγράφου', en: 'Zografou', de: 'Zografou', bg: 'Зографу', ru: 'Зографу', ro: 'Zografou', sr: 'Zografu' }, area: 'mainland', locationNameDb: 'Zografou' },
  { locationSlug: 'varvara', locationName: { el: 'Βαρβάρα', en: 'Varvara', de: 'Varvara', bg: 'Варвара', ru: 'Варвара', ro: 'Varvara', sr: 'Varvara' }, area: 'mainland', locationNameDb: 'Varvara' },
  { locationSlug: 'gerakini', locationName: { el: 'Γερακινή', en: 'Gerakini', de: 'Gerakini', bg: 'Геракини', ru: 'Геракини', ro: 'Gerakini', sr: 'Gerakini' }, area: 'mainland', locationNameDb: 'Gerakini' },
];

export const CATEGORIES = ['beaches', 'restaurants', 'activities', 'listings'] as const;
export type Category = (typeof CATEGORIES)[number];

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.locationSlug === slug);
}
