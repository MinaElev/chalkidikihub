import { Area, Amenity, AreaInfo, BeachFeature, ConnectorType, ChargerSpeed, ActivityCategory, CuisineType, PriceLevel } from '@/types';

export const AREAS: AreaInfo[] = [
  {
    id: '1',
    slug: 'kassandra',
    name: {
      el: 'Κασσάνδρα',
      en: 'Kassandra',
      de: 'Kassandra',
      bg: 'Касандра',
      ru: 'Кассандра',
      ro: 'Kassandra',
    },
    description: {
      el: 'Το πρώτο πόδι της Χαλκιδικής. Ζωντανή ατμόσφαιρα, όμορφες παραλίες και πλούσια νυχτερινή ζωή.',
      en: 'The first peninsula of Halkidiki. Vibrant atmosphere, beautiful beaches and lively nightlife.',
      de: 'Die erste Halbinsel von Chalkidiki. Lebhafte Atmosphäre, schöne Strände und pulsierendes Nachtleben.',
      bg: 'Първият полуостров на Халкидики. Оживена атмосфера, красиви плажове и бурен нощен живот.',
      ru: 'Первый полуостров Халкидики. Живая атмосфера, красивые пляжи и яркая ночная жизнь.',
      ro: 'Prima peninsulă a Halkidiki. Atmosferă vibrantă, plaje frumoase și viață de noapte animată.',
    },
    image_url: '',
    latitude: 39.95,
    longitude: 23.45,
    listings_count: 0,
  },
  {
    id: '2',
    slug: 'sithonia',
    name: {
      el: 'Σιθωνία',
      en: 'Sithonia',
      de: 'Sithonia',
      bg: 'Ситония',
      ru: 'Ситония',
      ro: 'Sithonia',
    },
    description: {
      el: 'Το δεύτερο πόδι της Χαλκιδικής. Εξωτικές παραλίες, καταπράσινη φύση και ηρεμία.',
      en: 'The second peninsula of Halkidiki. Exotic beaches, lush nature and tranquility.',
      de: 'Die zweite Halbinsel von Chalkidiki. Exotische Strände, üppige Natur und Ruhe.',
      bg: 'Вторият полуостров на Халкидики. Екзотични плажове, буйна природа и спокойствие.',
      ru: 'Второй полуостров Халкидики. Экзотические пляжи, пышная природа и спокойствие.',
      ro: 'A doua peninsulă a Halkidiki. Plaje exotice, natură luxuriantă și liniște.',
    },
    image_url: '',
    latitude: 40.05,
    longitude: 23.8,
    listings_count: 0,
  },
  {
    id: '3',
    slug: 'athos',
    name: {
      el: 'Άθως',
      en: 'Athos',
      de: 'Athos',
      bg: 'Атон',
      ru: 'Афон',
      ro: 'Athos',
    },
    description: {
      el: 'Το τρίτο πόδι της Χαλκιδικής. Πνευματικότητα, ιστορία και ανέγγιχτη φύση.',
      en: 'The third peninsula of Halkidiki. Spirituality, history and untouched nature.',
      de: 'Die dritte Halbinsel von Chalkidiki. Spiritualität, Geschichte und unberührte Natur.',
      bg: 'Третият полуостров на Халкидики. Духовност, история и недокосната природа.',
      ru: 'Третий полуостров Халкидики. Духовность, история и нетронутая природа.',
      ro: 'A treia peninsulă a Halkidiki. Spiritualitate, istorie și natură neatinsă.',
    },
    image_url: '',
    latitude: 40.15,
    longitude: 24.15,
    listings_count: 0,
  },
  {
    id: '4',
    slug: 'mainland',
    name: {
      el: 'Ενδοχώρα Χαλκιδικής',
      en: 'Mainland Halkidiki',
      de: 'Chalkidiki Festland',
      bg: 'Континентален Халкидики',
      ru: 'Материковая Халкидики',
      ro: 'Halkidiki continental',
    },
    description: {
      el: 'Η ηπειρωτική Χαλκιδική. Παραδοσιακά χωριά, αμπελώνες και αυθεντική φιλοξενία.',
      en: 'The mainland of Halkidiki. Traditional villages, vineyards and authentic hospitality.',
      de: 'Das Festland von Chalkidiki. Traditionelle Dörfer, Weinberge und authentische Gastfreundschaft.',
      bg: 'Континенталната част на Халкидики. Традиционни села, лозя и автентично гостоприемство.',
      ru: 'Материковая часть Халкидики. Традиционные деревни, виноградники и настоящее гостеприимство.',
      ro: 'Partea continentală a Halkidiki. Sate tradiționale, podgorii și ospitalitate autentică.',
    },
    image_url: '',
    latitude: 40.35,
    longitude: 23.5,
    listings_count: 0,
  },
];

export const ALL_AMENITIES: Amenity[] = [
  'wifi',
  'parking',
  'airConditioning',
  'pool',
  'kitchen',
  'tv',
  'washingMachine',
  'balcony',
  'seaView',
  'garden',
  'bbq',
  'petsAllowed',
];

export const AREA_SLUGS: Area[] = ['kassandra', 'sithonia', 'athos', 'mainland'];

export const ALL_BEACH_FEATURES: BeachFeature[] = [
  'sandy',
  'pebble',
  'organized',
  'free',
  'parking',
  'beachBar',
  'shallowWater',
  'waterSports',
  'accessible',
  'sunbeds',
  'lifeguard',
  'nudist',
];

export const ALL_CONNECTOR_TYPES: ConnectorType[] = ['type2', 'ccs', 'chademo', 'schuko'];

export const ALL_CHARGER_SPEEDS: ChargerSpeed[] = ['slow', 'fast', 'rapid'];

export const ALL_ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'historical', 'nature', 'waterSports', 'boatTrips', 'wellness', 'family', 'nightlife', 'religious',
];

export const ALL_CUISINE_TYPES: CuisineType[] = [
  'seafood', 'traditional', 'grill', 'mediterranean', 'pizza', 'cafe', 'fineDining', 'streetFood', 'beachBar', 'bar', 'cocktailBar', 'brunch', 'cafeBar',
];

export const ALL_PRICE_LEVELS: PriceLevel[] = ['budget', 'moderate', 'upscale', 'fineDining'];
