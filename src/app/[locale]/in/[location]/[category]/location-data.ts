type L = Record<string, string>;

export interface LocationCategory {
  locationSlug: string;
  locationName: L; // { el: 'Νικήτη', en: 'Nikiti', de: 'Nikiti', ... }
  area: string; // 'kassandra' | 'sithonia' | 'athos' | 'mainland'
  locationNameDb: string; // the location_name value used in the database
}

export const LOCATIONS: LocationCategory[] = [
  // Kassandra
  { locationSlug: 'afytos', locationName: { el: 'Άφυτος', en: 'Afytos', de: 'Afytos', bg: 'Афитос', ru: 'Афитос', ro: 'Afytos', sr: 'Afitos' }, area: 'kassandra', locationNameDb: 'Afytos' },
  { locationSlug: 'kallithea', locationName: { el: 'Καλλιθέα', en: 'Kallithea', de: 'Kallithea', bg: 'Калитея', ru: 'Каллифея', ro: 'Kallithea', sr: 'Kalitea' }, area: 'kassandra', locationNameDb: 'Kallithea' },
  { locationSlug: 'hanioti', locationName: { el: 'Χανιώτη', en: 'Hanioti', de: 'Hanioti', bg: 'Ханиоти', ru: 'Ханиоти', ro: 'Hanioti', sr: 'Hanioti' }, area: 'kassandra', locationNameDb: 'Hanioti' },
  { locationSlug: 'pefkohori', locationName: { el: 'Πευκοχώρι', en: 'Pefkohori', de: 'Pefkohori', bg: 'Пефкохори', ru: 'Пефкохори', ro: 'Pefkohori', sr: 'Pefkohori' }, area: 'kassandra', locationNameDb: 'Pefkohori' },
  { locationSlug: 'siviri', locationName: { el: 'Σίβηρη', en: 'Siviri', de: 'Siviri', bg: 'Сивири', ru: 'Сивири', ro: 'Siviri', sr: 'Siviri' }, area: 'kassandra', locationNameDb: 'Siviri' },
  { locationSlug: 'polychrono', locationName: { el: 'Πολύχρονο', en: 'Polychrono', de: 'Polychrono', bg: 'Полихроно', ru: 'Полихроно', ro: 'Polychrono', sr: 'Polihrono' }, area: 'kassandra', locationNameDb: 'Polychrono' },
  { locationSlug: 'possidi', locationName: { el: 'Ποσείδι', en: 'Possidi', de: 'Possidi', bg: 'Посиди', ru: 'Посиди', ro: 'Possidi', sr: 'Posidi' }, area: 'kassandra', locationNameDb: 'Possidi' },
  { locationSlug: 'nea-fokea', locationName: { el: 'Νέα Φώκαια', en: 'Nea Fokea', de: 'Nea Fokea', bg: 'Неа Фокеа', ru: 'Неа Фокея', ro: 'Nea Fokea', sr: 'Nea Fokea' }, area: 'kassandra', locationNameDb: 'Nea Fokea' },
  // Sithonia
  { locationSlug: 'nikiti', locationName: { el: 'Νικήτη', en: 'Nikiti', de: 'Nikiti', bg: 'Никити', ru: 'Никити', ro: 'Nikiti', sr: 'Nikiti' }, area: 'sithonia', locationNameDb: 'Nikiti' },
  { locationSlug: 'vourvourou', locationName: { el: 'Βουρβουρού', en: 'Vourvourou', de: 'Vourvourou', bg: 'Вурвуру', ru: 'Вурвуру', ro: 'Vourvourou', sr: 'Vurvuru' }, area: 'sithonia', locationNameDb: 'Vourvourou' },
  { locationSlug: 'neos-marmaras', locationName: { el: 'Νέος Μαρμαράς', en: 'Neos Marmaras', de: 'Neos Marmaras', bg: 'Неос Мармарас', ru: 'Неос Мармарас', ro: 'Neos Marmaras', sr: 'Neos Marmaras' }, area: 'sithonia', locationNameDb: 'Neos Marmaras' },
  { locationSlug: 'sarti', locationName: { el: 'Σάρτη', en: 'Sarti', de: 'Sarti', bg: 'Сарти', ru: 'Сарти', ro: 'Sarti', sr: 'Sarti' }, area: 'sithonia', locationNameDb: 'Sarti' },
  { locationSlug: 'toroni', locationName: { el: 'Τορώνη', en: 'Toroni', de: 'Toroni', bg: 'Торони', ru: 'Торони', ro: 'Toroni', sr: 'Toroni' }, area: 'sithonia', locationNameDb: 'Toroni' },
  { locationSlug: 'porto-koufo', locationName: { el: 'Πόρτο Κουφό', en: 'Porto Koufo', de: 'Porto Koufo', bg: 'Порто Куфо', ru: 'Порто Куфо', ro: 'Porto Koufo', sr: 'Porto Kufo' }, area: 'sithonia', locationNameDb: 'Porto Koufo' },
  // Athos area
  { locationSlug: 'ouranoupoli', locationName: { el: 'Ουρανούπολη', en: 'Ouranoupoli', de: 'Ouranoupoli', bg: 'Уранополис', ru: 'Уранополис', ro: 'Ouranoupoli', sr: 'Uranopolis' }, area: 'athos', locationNameDb: 'Ouranoupoli' },
  // Mainland
  { locationSlug: 'arnea', locationName: { el: 'Αρναία', en: 'Arnea', de: 'Arnea', bg: 'Арнеа', ru: 'Арнея', ro: 'Arnea', sr: 'Arnea' }, area: 'mainland', locationNameDb: 'Arnea' },
  { locationSlug: 'nea-moudania', locationName: { el: 'Νέα Μουδανιά', en: 'Nea Moudania', de: 'Nea Moudania', bg: 'Неа Муданя', ru: 'Неа Муданья', ro: 'Nea Moudania', sr: 'Nea Mudanja' }, area: 'mainland', locationNameDb: 'Nea Moudania' },
];

export const CATEGORIES = ['beaches', 'restaurants', 'activities', 'listings'] as const;
export type Category = (typeof CATEGORIES)[number];

export function getLocation(slug: string) {
  return LOCATIONS.find((l) => l.locationSlug === slug);
}
