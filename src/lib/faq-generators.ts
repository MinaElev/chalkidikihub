/**
 * Auto-generate FAQ Q&A pairs from content data.
 * Each generator returns FAQs based on available fields.
 * Used by FaqSection component for visible FAQ + FAQPage JSON-LD schema.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

type Locale = string;

// ── Translation templates ────────────────────────────────────────────
const t = {
  beach: {
    whereIs: {
      el: (name: string) => `Πού βρίσκεται η παραλία ${name};`,
      en: (name: string) => `Where is ${name} beach located?`,
      de: (name: string) => `Wo befindet sich der Strand ${name}?`,
      bg: (name: string) => `Къде се намира плажът ${name}?`,
      ru: (name: string) => `Где находится пляж ${name}?`,
      ro: (name: string) => `Unde se află plaja ${name}?`,
      sr: (name: string) => `Gde se nalazi plaža ${name}?`,
    },
    whereIsAnswer: {
      el: (loc: string, area: string) => `Η παραλία βρίσκεται στην περιοχή ${loc}, ${area}, Χαλκιδική.`,
      en: (loc: string, area: string) => `The beach is located in ${loc}, ${area}, Halkidiki.`,
      de: (loc: string, area: string) => `Der Strand befindet sich in ${loc}, ${area}, Chalkidiki.`,
      bg: (loc: string, area: string) => `Плажът се намира в ${loc}, ${area}, Халкидики.`,
      ru: (loc: string, area: string) => `Пляж расположен в ${loc}, ${area}, Халкидики.`,
      ro: (loc: string, area: string) => `Plaja se află în ${loc}, ${area}, Halkidiki.`,
      sr: (loc: string, area: string) => `Plaža se nalazi u ${loc}, ${area}, Halkidiki.`,
    },
    whatType: {
      el: (name: string) => `Τι τύπος παραλίας είναι η ${name};`,
      en: (name: string) => `What type of beach is ${name}?`,
      de: (name: string) => `Was für ein Strandtyp ist ${name}?`,
      bg: (name: string) => `Какъв тип плаж е ${name}?`,
      ru: (name: string) => `Какой тип пляжа ${name}?`,
      ro: (name: string) => `Ce tip de plajă este ${name}?`,
      sr: (name: string) => `Koji tip plaže je ${name}?`,
    },
    hasSunbeds: {
      el: (name: string) => `Έχει ξαπλώστρες και ομπρέλες η ${name};`,
      en: (name: string) => `Does ${name} have sunbeds and umbrellas?`,
      de: (name: string) => `Hat ${name} Sonnenliegen und Sonnenschirme?`,
      bg: (name: string) => `Има ли ${name} шезлонги и чадъри?`,
      ru: (name: string) => `Есть ли на ${name} шезлонги и зонтики?`,
      ro: (name: string) => `Are ${name} șezlonguri și umbrele?`,
      sr: (name: string) => `Da li ${name} ima ležaljke i suncobrane?`,
    },
    goodForKids: {
      el: (name: string) => `Είναι η ${name} κατάλληλη για παιδιά;`,
      en: (name: string) => `Is ${name} suitable for children?`,
      de: (name: string) => `Ist ${name} für Kinder geeignet?`,
      bg: (name: string) => `Подходящ ли е ${name} за деца?`,
      ru: (name: string) => `Подходит ли ${name} для детей?`,
      ro: (name: string) => `Este ${name} potrivită pentru copii?`,
      sr: (name: string) => `Da li je ${name} pogodna za decu?`,
    },
    hasParking: {
      el: () => `Υπάρχει πάρκινγκ κοντά στην παραλία;`,
      en: () => `Is there parking near the beach?`,
      de: () => `Gibt es Parkplätze in Strandnähe?`,
      bg: () => `Има ли паркинг близо до плажа?`,
      ru: () => `Есть ли парковка рядом с пляжем?`,
      ro: () => `Există parcare lângă plajă?`,
      sr: () => `Da li postoji parking blizu plaže?`,
    },
    rating: {
      el: (name: string) => `Τι βαθμολογία έχει η παραλία ${name};`,
      en: (name: string) => `What is the rating of ${name} beach?`,
      de: (name: string) => `Welche Bewertung hat der Strand ${name}?`,
      bg: (name: string) => `Каква е оценката на плаж ${name}?`,
      ru: (name: string) => `Какой рейтинг пляжа ${name}?`,
      ro: (name: string) => `Ce rating are plaja ${name}?`,
      sr: (name: string) => `Koju ocenu ima plaža ${name}?`,
    },
  },
  restaurant: {
    whatCuisine: {
      el: (name: string) => `Τι κουζίνα σερβίρει το ${name};`,
      en: (name: string) => `What cuisine does ${name} serve?`,
      de: (name: string) => `Welche Küche serviert ${name}?`,
      bg: (name: string) => `Каква кухня предлага ${name}?`,
      ru: (name: string) => `Какую кухню предлагает ${name}?`,
      ro: (name: string) => `Ce bucătărie servește ${name}?`,
      sr: (name: string) => `Koju kuhinju služi ${name}?`,
    },
    priceRange: {
      el: (name: string) => `Ποιο είναι το εύρος τιμών στο ${name};`,
      en: (name: string) => `What is the price range at ${name}?`,
      de: (name: string) => `Was ist die Preisspanne bei ${name}?`,
      bg: (name: string) => `Какъв е ценовият диапазон в ${name}?`,
      ru: (name: string) => `Каков диапазон цен в ${name}?`,
      ro: (name: string) => `Care este intervalul de prețuri la ${name}?`,
      sr: (name: string) => `Koji je raspon cena u ${name}?`,
    },
    hours: {
      el: (name: string) => `Ποιες ώρες είναι ανοιχτό το ${name};`,
      en: (name: string) => `What are the opening hours of ${name}?`,
      de: (name: string) => `Wann hat ${name} geöffnet?`,
      bg: (name: string) => `Кога е отворен ${name}?`,
      ru: (name: string) => `Каковы часы работы ${name}?`,
      ro: (name: string) => `Care sunt orele de funcționare ale ${name}?`,
      sr: (name: string) => `Koje je radno vreme ${name}?`,
    },
    reservations: {
      el: (name: string) => `Δέχεται κρατήσεις το ${name};`,
      en: (name: string) => `Does ${name} accept reservations?`,
      de: (name: string) => `Nimmt ${name} Reservierungen an?`,
      bg: (name: string) => `Приема ли ${name} резервации?`,
      ru: (name: string) => `Принимает ли ${name} бронирование?`,
      ro: (name: string) => `Acceptă ${name} rezervări?`,
      sr: (name: string) => `Da li ${name} prima rezervacije?`,
    },
    whereIs: {
      el: (name: string) => `Πού βρίσκεται το ${name};`,
      en: (name: string) => `Where is ${name} located?`,
      de: (name: string) => `Wo befindet sich ${name}?`,
      bg: (name: string) => `Къде се намира ${name}?`,
      ru: (name: string) => `Где находится ${name}?`,
      ro: (name: string) => `Unde se află ${name}?`,
      sr: (name: string) => `Gde se nalazi ${name}?`,
    },
    seaView: {
      el: (name: string) => `Έχει θέα θάλασσα το ${name};`,
      en: (name: string) => `Does ${name} have a sea view?`,
      de: (name: string) => `Hat ${name} Meerblick?`,
      bg: (name: string) => `Има ли ${name} изглед към морето?`,
      ru: (name: string) => `Есть ли в ${name} вид на море?`,
      ro: (name: string) => `Are ${name} vedere la mare?`,
      sr: (name: string) => `Da li ${name} ima pogled na more?`,
    },
  },
  activity: {
    whereIs: {
      el: (name: string) => `Πού γίνεται η δραστηριότητα ${name};`,
      en: (name: string) => `Where does the ${name} activity take place?`,
      de: (name: string) => `Wo findet die Aktivität ${name} statt?`,
      bg: (name: string) => `Къде се провежда дейността ${name}?`,
      ru: (name: string) => `Где проходит мероприятие ${name}?`,
      ro: (name: string) => `Unde are loc activitatea ${name}?`,
      sr: (name: string) => `Gde se odvija aktivnost ${name}?`,
    },
    howMuch: {
      el: (name: string) => `Πόσο κοστίζει η δραστηριότητα ${name};`,
      en: (name: string) => `How much does ${name} cost?`,
      de: (name: string) => `Wie viel kostet ${name}?`,
      bg: (name: string) => `Колко струва ${name}?`,
      ru: (name: string) => `Сколько стоит ${name}?`,
      ro: (name: string) => `Cât costă ${name}?`,
      sr: (name: string) => `Koliko košta ${name}?`,
    },
    duration: {
      el: (name: string) => `Πόσο διαρκεί η δραστηριότητα ${name};`,
      en: (name: string) => `How long does ${name} last?`,
      de: (name: string) => `Wie lange dauert ${name}?`,
      bg: (name: string) => `Колко време трае ${name}?`,
      ru: (name: string) => `Сколько длится ${name}?`,
      ro: (name: string) => `Cât durează ${name}?`,
      sr: (name: string) => `Koliko traje ${name}?`,
    },
    rating: {
      el: (name: string) => `Τι βαθμολογία έχει η δραστηριότητα ${name};`,
      en: (name: string) => `What is the rating of ${name}?`,
      de: (name: string) => `Welche Bewertung hat ${name}?`,
      bg: (name: string) => `Каква е оценката на ${name}?`,
      ru: (name: string) => `Какой рейтинг у ${name}?`,
      ro: (name: string) => `Ce rating are ${name}?`,
      sr: (name: string) => `Koju ocenu ima ${name}?`,
    },
  },
  listing: {
    howMuch: {
      el: (name: string) => `Πόσο κοστίζει η διαμονή στο ${name};`,
      en: (name: string) => `How much does a stay at ${name} cost?`,
      de: (name: string) => `Wie viel kostet ein Aufenthalt in ${name}?`,
      bg: (name: string) => `Колко струва нощувката в ${name}?`,
      ru: (name: string) => `Сколько стоит проживание в ${name}?`,
      ro: (name: string) => `Cât costă cazarea la ${name}?`,
      sr: (name: string) => `Koliko košta smeštaj u ${name}?`,
    },
    capacity: {
      el: (name: string) => `Πόσα άτομα χωράει το ${name};`,
      en: (name: string) => `How many guests can ${name} accommodate?`,
      de: (name: string) => `Wie viele Gäste passen in ${name}?`,
      bg: (name: string) => `Колко гости побира ${name}?`,
      ru: (name: string) => `Сколько гостей вмещает ${name}?`,
      ro: (name: string) => `Câți oaspeți poate găzdui ${name}?`,
      sr: (name: string) => `Koliko gostiju može da primi ${name}?`,
    },
    amenities: {
      el: (name: string) => `Τι παροχές έχει το ${name};`,
      en: (name: string) => `What amenities does ${name} offer?`,
      de: (name: string) => `Welche Ausstattung bietet ${name}?`,
      bg: (name: string) => `Какви удобства предлага ${name}?`,
      ru: (name: string) => `Какие удобства предлагает ${name}?`,
      ro: (name: string) => `Ce facilități oferă ${name}?`,
      sr: (name: string) => `Koje pogodnosti nudi ${name}?`,
    },
    whereIs: {
      el: (name: string) => `Πού βρίσκεται το ${name};`,
      en: (name: string) => `Where is ${name} located?`,
      de: (name: string) => `Wo befindet sich ${name}?`,
      bg: (name: string) => `Къде се намира ${name}?`,
      ru: (name: string) => `Где находится ${name}?`,
      ro: (name: string) => `Unde se află ${name}?`,
      sr: (name: string) => `Gde se nalazi ${name}?`,
    },
    howToBook: {
      el: (name: string) => `Πώς μπορώ να κλείσω το ${name};`,
      en: (name: string) => `How can I book ${name}?`,
      de: (name: string) => `Wie kann ich ${name} buchen?`,
      bg: (name: string) => `Как мога да резервирам ${name}?`,
      ru: (name: string) => `Как забронировать ${name}?`,
      ro: (name: string) => `Cum pot rezerva ${name}?`,
      sr: (name: string) => `Kako mogu da rezervišem ${name}?`,
    },
  },
  yes: { el: 'Ναι', en: 'Yes', de: 'Ja', bg: 'Да', ru: 'Да', ro: 'Da', sr: 'Da' },
  no: { el: 'Όχι', en: 'No', de: 'Nein', bg: 'Не', ru: 'Нет', ro: 'Nu', sr: 'Ne' },
} as const;

// ── Helper to get localized string ───────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loc(map: Record<string, any>, locale: string, ...args: string[]): string {
  const fn = map[locale] || map.en;
  return typeof fn === 'function' ? fn(...args) : (fn as string);
}

// ── Area display names ───────────────────────────────────────────────
const areaNames: Record<string, Record<string, string>> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra', de: 'Kassandra', bg: 'Касандра', ru: 'Кассандра', ro: 'Kassandra', sr: 'Kasandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia', de: 'Sithonia', bg: 'Ситония', ru: 'Ситония', ro: 'Sithonia', sr: 'Sitonija' },
  athos: { el: 'Άθως', en: 'Athos', de: 'Athos', bg: 'Атон', ru: 'Афон', ro: 'Athos', sr: 'Atos' },
  mainland: { el: 'Ηπειρωτική Χαλκιδική', en: 'Mainland Halkidiki', de: 'Festland Chalkidiki', bg: 'Континентален Халкидики', ru: 'Материковый Халкидики', ro: 'Halkidiki continental', sr: 'Kopneni Halkidiki' },
};

// ── Feature translations ─────────────────────────────────────────────
const featureLabels: Record<string, Record<string, string>> = {
  sandy: { el: 'αμμώδης', en: 'sandy', de: 'sandig', bg: 'пясъчен', ru: 'песчаный', ro: 'nisipos', sr: 'peščana' },
  pebble: { el: 'βοτσαλωτή', en: 'pebble', de: 'Kiesel', bg: 'чакълест', ru: 'галечный', ro: 'cu pietriș', sr: 'šljunkovita' },
  organized: { el: 'οργανωμένη', en: 'organized', de: 'organisiert', bg: 'организиран', ru: 'организованный', ro: 'organizată', sr: 'organizovana' },
  free: { el: 'ελεύθερη', en: 'free/unorganized', de: 'frei', bg: 'свободен', ru: 'свободный', ro: 'liberă', sr: 'slobodna' },
};

const amenityLabels: Record<string, Record<string, string>> = {
  wifi: { el: 'WiFi', en: 'WiFi' },
  parking: { el: 'Πάρκινγκ', en: 'Parking' },
  airConditioning: { el: 'Κλιματισμός', en: 'Air conditioning' },
  pool: { el: 'Πισίνα', en: 'Swimming pool' },
  kitchen: { el: 'Κουζίνα', en: 'Kitchen' },
  tv: { el: 'Τηλεόραση', en: 'TV' },
  washingMachine: { el: 'Πλυντήριο', en: 'Washing machine' },
  balcony: { el: 'Μπαλκόνι', en: 'Balcony' },
  seaView: { el: 'Θέα θάλασσα', en: 'Sea view' },
  garden: { el: 'Κήπος', en: 'Garden' },
  bbq: { el: 'BBQ', en: 'BBQ' },
  petsAllowed: { el: 'Δεκτά κατοικίδια', en: 'Pets allowed' },
};

const priceLevels: Record<string, Record<string, string>> = {
  budget: { el: 'Οικονομικό (€)', en: 'Budget (€)', de: 'Günstig (€)' },
  moderate: { el: 'Μέτριο (€€)', en: 'Moderate (€€)', de: 'Moderat (€€)' },
  upscale: { el: 'Υψηλό (€€€)', en: 'Upscale (€€€)', de: 'Gehoben (€€€)' },
  fineDining: { el: 'Fine Dining (€€€€)', en: 'Fine Dining (€€€€)', de: 'Fine Dining (€€€€)' },
};

// ── Beach FAQ Generator ──────────────────────────────────────────────
export function generateBeachFaqs(
  beach: Record<string, unknown>,
  locale: Locale,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const name = (beach.name as Record<string, string>)?.[locale] || (beach.name as Record<string, string>)?.el || '';
  const features = (beach.features as string[]) || [];
  const area = (beach.area as string) || '';
  const locationName = (beach.location_name as string) || '';
  const rating = beach.rating as number;
  const reviewsCount = beach.reviews_count as number;

  // 1. Location
  if (locationName && area) {
    const areaName = areaNames[area]?.[locale] || areaNames[area]?.en || area;
    faqs.push({
      question: loc(t.beach.whereIs, locale, name),
      answer: loc(t.beach.whereIsAnswer, locale, locationName, areaName),
    });
  }

  // 2. Beach type
  if (features.length > 0) {
    const typeFeatures = features.filter(f => ['sandy', 'pebble', 'organized', 'free'].includes(f));
    if (typeFeatures.length > 0) {
      const typeLabels = typeFeatures.map(f => featureLabels[f]?.[locale] || featureLabels[f]?.en || f);
      const answer = locale === 'el'
        ? `Η ${name} είναι ${typeLabels.join(', ')} παραλία.`
        : `${name} is a ${typeLabels.join(', ')} beach.`;
      faqs.push({ question: loc(t.beach.whatType, locale, name), answer });
    }
  }

  // 3. Sunbeds
  if (features.includes('sunbeds') || features.includes('organized')) {
    const answer = locale === 'el'
      ? `Ναι, η ${name} διαθέτει ξαπλώστρες και ομπρέλες.`
      : `Yes, ${name} offers sunbeds and umbrellas.`;
    faqs.push({ question: loc(t.beach.hasSunbeds, locale, name), answer });
  } else if (features.includes('free')) {
    const answer = locale === 'el'
      ? `Η ${name} είναι ελεύθερη παραλία χωρίς ξαπλώστρες. Φέρτε τη δική σας ομπρέλα!`
      : `${name} is a free beach without sunbeds. Bring your own umbrella!`;
    faqs.push({ question: loc(t.beach.hasSunbeds, locale, name), answer });
  }

  // 4. Kids friendly
  if (features.includes('shallowWater')) {
    const answer = locale === 'el'
      ? `Ναι, η ${name} έχει ρηχά νερά και είναι ιδανική για οικογένειες με παιδιά.`
      : `Yes, ${name} has shallow waters and is ideal for families with children.`;
    faqs.push({ question: loc(t.beach.goodForKids, locale, name), answer });
  }

  // 5. Parking
  if (features.includes('parking')) {
    const answer = locale === 'el'
      ? `Ναι, υπάρχει διαθέσιμο πάρκινγκ κοντά στην παραλία ${name}.`
      : `Yes, there is parking available near ${name} beach.`;
    faqs.push({ question: loc(t.beach.hasParking, locale, name), answer });
  }

  // 6. Rating
  if (rating && rating > 0) {
    const answer = locale === 'el'
      ? `Η παραλία ${name} έχει βαθμολογία ${rating}/5${reviewsCount ? ` βασισμένη σε ${reviewsCount} κριτικές` : ''}.`
      : `${name} beach has a rating of ${rating}/5${reviewsCount ? ` based on ${reviewsCount} reviews` : ''}.`;
    faqs.push({ question: loc(t.beach.rating, locale, name), answer });
  }

  return faqs;
}

// ── Restaurant FAQ Generator ─────────────────────────────────────────
export function generateRestaurantFaqs(
  restaurant: Record<string, unknown>,
  locale: Locale,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const name = (restaurant.name as Record<string, string>)?.[locale] || (restaurant.name as Record<string, string>)?.el || '';
  const locationName = (restaurant.location_name as string) || '';
  const area = (restaurant.area as string) || '';

  // 1. Cuisine
  const cuisine = (restaurant.cuisine as string[]) || [];
  if (cuisine.length > 0) {
    const answer = locale === 'el'
      ? `Το ${name} σερβίρει ${cuisine.join(', ')} κουζίνα.`
      : `${name} serves ${cuisine.join(', ')} cuisine.`;
    faqs.push({ question: loc(t.restaurant.whatCuisine, locale, name), answer });
  }

  // 2. Price range
  const priceLevel = restaurant.price_level as string;
  if (priceLevel) {
    const level = priceLevels[priceLevel]?.[locale] || priceLevels[priceLevel]?.en || priceLevel;
    const answer = locale === 'el'
      ? `Το εύρος τιμών στο ${name} είναι ${level}.`
      : `The price range at ${name} is ${level}.`;
    faqs.push({ question: loc(t.restaurant.priceRange, locale, name), answer });
  }

  // 3. Hours
  const hours = restaurant.hours as string;
  if (hours) {
    const answer = locale === 'el'
      ? `Το ${name} λειτουργεί: ${hours}.`
      : `${name} is open: ${hours}.`;
    faqs.push({ question: loc(t.restaurant.hours, locale, name), answer });
  }

  // 4. Reservations
  if (restaurant.accepts_reservations !== undefined) {
    const accepts = restaurant.accepts_reservations as boolean;
    const phone = restaurant.phone as string;
    const answer = accepts
      ? (locale === 'el'
        ? `Ναι, το ${name} δέχεται κρατήσεις${phone ? ` στο τηλέφωνο ${phone}` : ''}.`
        : `Yes, ${name} accepts reservations${phone ? ` at ${phone}` : ''}.`)
      : (locale === 'el'
        ? `Το ${name} δεν δέχεται κρατήσεις. Λειτουργεί με σειρά προτεραιότητας.`
        : `${name} does not accept reservations. It operates on a first-come, first-served basis.`);
    faqs.push({ question: loc(t.restaurant.reservations, locale, name), answer });
  }

  // 5. Sea view
  if (restaurant.has_sea_view) {
    const answer = locale === 'el'
      ? `Ναι, το ${name} προσφέρει θέα θάλασσα.`
      : `Yes, ${name} offers a sea view.`;
    faqs.push({ question: loc(t.restaurant.seaView, locale, name), answer });
  }

  // 6. Location
  if (locationName && area) {
    const areaName = areaNames[area]?.[locale] || areaNames[area]?.en || area;
    const answer = locale === 'el'
      ? `Το ${name} βρίσκεται στην περιοχή ${locationName}, ${areaName}, Χαλκιδική.`
      : `${name} is located in ${locationName}, ${areaName}, Halkidiki.`;
    faqs.push({ question: loc(t.restaurant.whereIs, locale, name), answer });
  }

  return faqs;
}

// ── Activity FAQ Generator ───────────────────────────────────────────
export function generateActivityFaqs(
  activity: Record<string, unknown>,
  locale: Locale,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const name = (activity.name as Record<string, string>)?.[locale] || (activity.name as Record<string, string>)?.el || '';
  const locationName = (activity.location_name as string) || '';
  const area = (activity.area as string) || '';

  // 1. Location
  if (locationName && area) {
    const areaName = areaNames[area]?.[locale] || areaNames[area]?.en || area;
    const answer = locale === 'el'
      ? `Η δραστηριότητα ${name} πραγματοποιείται στην περιοχή ${locationName}, ${areaName}, Χαλκιδική.`
      : `The ${name} activity takes place in ${locationName}, ${areaName}, Halkidiki.`;
    faqs.push({ question: loc(t.activity.whereIs, locale, name), answer });
  }

  // 2. Price
  const priceRange = activity.price_range as string;
  if (priceRange) {
    const answer = locale === 'el'
      ? `Η τιμή για ${name} είναι ${priceRange}.`
      : `The price for ${name} is ${priceRange}.`;
    faqs.push({ question: loc(t.activity.howMuch, locale, name), answer });
  }

  // 3. Duration
  const duration = activity.duration as string;
  if (duration) {
    const answer = locale === 'el'
      ? `Η δραστηριότητα ${name} διαρκεί ${duration}.`
      : `The ${name} activity lasts ${duration}.`;
    faqs.push({ question: loc(t.activity.duration, locale, name), answer });
  }

  // 4. Rating
  const rating = activity.rating as number;
  const reviewsCount = activity.reviews_count as number;
  if (rating && rating > 0) {
    const answer = locale === 'el'
      ? `Η δραστηριότητα ${name} έχει βαθμολογία ${rating}/5${reviewsCount ? ` (${reviewsCount} κριτικές)` : ''}.`
      : `${name} has a rating of ${rating}/5${reviewsCount ? ` (${reviewsCount} reviews)` : ''}.`;
    faqs.push({ question: loc(t.activity.rating, locale, name), answer });
  }

  return faqs;
}

// ── Listing FAQ Generator ────────────────────────────────────────────
export function generateListingFaqs(
  listing: Record<string, unknown>,
  locale: Locale,
): FaqItem[] {
  const faqs: FaqItem[] = [];
  const name = (listing.title as Record<string, string>)?.[locale] || (listing.title as Record<string, string>)?.el || '';
  const locationName = (listing.location_name as string) || '';
  const area = (listing.area as string) || '';

  // 1. Price
  const price = listing.price_per_night as number;
  const currency = (listing.currency as string) || '€';
  if (price) {
    const answer = locale === 'el'
      ? `Η τιμή διαμονής στο ${name} ξεκινά από ${currency}${price} ανά βράδυ.`
      : `Accommodation at ${name} starts from ${currency}${price} per night.`;
    faqs.push({ question: loc(t.listing.howMuch, locale, name), answer });
  }

  // 2. Capacity
  const guests = listing.guests_max as number;
  const bedrooms = listing.bedrooms as number;
  const bathrooms = listing.bathrooms as number;
  if (guests || bedrooms) {
    const parts: string[] = [];
    if (locale === 'el') {
      if (guests) parts.push(`${guests} άτομα`);
      if (bedrooms) parts.push(`${bedrooms} υπνοδωμάτια`);
      if (bathrooms) parts.push(`${bathrooms} μπάνια`);
    } else {
      if (guests) parts.push(`${guests} guests`);
      if (bedrooms) parts.push(`${bedrooms} bedrooms`);
      if (bathrooms) parts.push(`${bathrooms} bathrooms`);
    }
    const answer = locale === 'el'
      ? `Το ${name} φιλοξενεί ${parts.join(', ')}.`
      : `${name} accommodates ${parts.join(', ')}.`;
    faqs.push({ question: loc(t.listing.capacity, locale, name), answer });
  }

  // 3. Amenities
  const amenities = (listing.amenities as string[]) || [];
  if (amenities.length > 0) {
    const labels = amenities.map(a => amenityLabels[a]?.[locale] || amenityLabels[a]?.en || a);
    const answer = locale === 'el'
      ? `Το ${name} προσφέρει: ${labels.join(', ')}.`
      : `${name} offers: ${labels.join(', ')}.`;
    faqs.push({ question: loc(t.listing.amenities, locale, name), answer });
  }

  // 4. Location
  if (locationName && area) {
    const areaName = areaNames[area]?.[locale] || areaNames[area]?.en || area;
    const answer = locale === 'el'
      ? `Το ${name} βρίσκεται στην περιοχή ${locationName}, ${areaName}, Χαλκιδική.`
      : `${name} is located in ${locationName}, ${areaName}, Halkidiki.`;
    faqs.push({ question: loc(t.listing.whereIs, locale, name), answer });
  }

  // 5. How to book
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = listing as any;
  const hasBooking = ext.booking_url || ext.airbnb_url || ext.website_url || ext.contact_phone;
  if (hasBooking) {
    const channels: string[] = [];
    if (locale === 'el') {
      if (ext.booking_url) channels.push('Booking.com');
      if (ext.airbnb_url) channels.push('Airbnb');
      if (ext.website_url) channels.push('την ιστοσελίδα του');
      if (ext.contact_phone) channels.push(`τηλεφωνικά στο ${ext.contact_phone}`);
    } else {
      if (ext.booking_url) channels.push('Booking.com');
      if (ext.airbnb_url) channels.push('Airbnb');
      if (ext.website_url) channels.push('the property website');
      if (ext.contact_phone) channels.push(`phone at ${ext.contact_phone}`);
    }
    const answer = locale === 'el'
      ? `Μπορείτε να κλείσετε το ${name} μέσω ${channels.join(', ')}.`
      : `You can book ${name} via ${channels.join(', ')}.`;
    faqs.push({ question: loc(t.listing.howToBook, locale, name), answer });
  }

  return faqs;
}

// ─────────────────────────────────────────────────────────────────
// Editorial guide FAQs (best / itinerary / from-city / costs).
// These generate FAQPage schema for the templated SEO pages added in
// commits b05882e, 7634c6c, 78e0fe9. They give Google rich-result
// surfaces and let LLMs ingest concrete Q&As, not just prose.

type L7 = Record<string, string>; // 7-locale string map; falls back to en/el.

/** Resolve a 7-locale field; falls back through user-locale → en → el → first non-empty. */
function pick(m: L7 | undefined, locale: string, fallback = ''): string {
  if (!m) return fallback;
  return m[locale] || m.en || m.el || Object.values(m).find(Boolean) || fallback;
}

// ─── /best/[slug] ─────────────────────────────────────────────────
export function generateBestGuideFaqs(
  guide: {
    contentType: 'beaches' | 'restaurants' | 'activities' | 'mixed';
    title: L7;
  },
  itemCount: number,
  locale: string,
): FaqItem[] {
  const title = pick(guide.title, locale);
  const t = guide.contentType;

  const noun: L7 = t === 'beaches'
    ? { el: 'παραλίες', en: 'beaches', de: 'Strände', bg: 'плажове', ru: 'пляжей', ro: 'plaje', sr: 'plaža' }
    : t === 'restaurants'
    ? { el: 'εστιατόρια', en: 'restaurants', de: 'Restaurants', bg: 'ресторанта', ru: 'ресторанов', ro: 'restaurante', sr: 'restorana' }
    : { el: 'δραστηριότητες', en: 'activities', de: 'Aktivitäten', bg: 'дейности', ru: 'мероприятий', ro: 'activități', sr: 'aktivnosti' };
  const nounStr = pick(noun, locale);

  const q1: L7 = {
    el: `Πόσες ${nounStr} περιλαμβάνει αυτός ο οδηγός;`,
    en: `How many ${nounStr} does this guide cover?`,
    de: `Wie viele ${nounStr} umfasst dieser Guide?`,
    bg: `Колко ${nounStr} обхваща този справочник?`,
    ru: `Сколько ${nounStr} включает этот гид?`,
    ro: `Câte ${nounStr} include acest ghid?`,
    sr: `Koliko ${nounStr} pokriva ovaj vodič?`,
  };
  const a1: L7 = {
    el: `Ο οδηγός «${title}» καλύπτει ${itemCount} επιλεγμένες ${nounStr}, ταξινομημένες με βάση αξιολογήσεις και κριτήρια ποιότητας.`,
    en: `The "${title}" guide covers ${itemCount} curated ${nounStr}, ranked by rating and quality criteria.`,
    de: `Der Guide „${title}" deckt ${itemCount} ausgewählte ${nounStr} ab, sortiert nach Bewertung und Qualität.`,
    bg: `Справочникът „${title}" обхваща ${itemCount} подбрани ${nounStr}, подредени по рейтинг и качество.`,
    ru: `Гид «${title}» охватывает ${itemCount} отобранных ${nounStr}, отсортированных по рейтингу и качеству.`,
    ro: `Ghidul „${title}" acoperă ${itemCount} ${nounStr} selectate, clasate după evaluare și calitate.`,
    sr: `Vodič „${title}" pokriva ${itemCount} odabranih ${nounStr}, rangiranih po oceni i kvalitetu.`,
  };

  const q2: L7 = {
    el: 'Πώς γίνεται η κατάταξη;',
    en: 'How is the ranking decided?',
    de: 'Wie wird die Reihenfolge bestimmt?',
    bg: 'Как се определя класирането?',
    ru: 'Как составляется рейтинг?',
    ro: 'Cum este stabilit clasamentul?',
    sr: 'Kako se utvrđuje rangiranje?',
  };
  const a2: L7 = {
    el: 'Η κατάταξη βασίζεται σε αξιολογήσεις χρηστών, ποιότητα και δημοτικότητα. Δεν δεχόμαστε πληρωμές για κατάταξη — οι προτάσεις είναι αμερόληπτες.',
    en: 'Ranking is based on user ratings, quality, and popularity. We do not accept payment for placement — recommendations are independent.',
    de: 'Die Rangliste basiert auf Bewertungen, Qualität und Beliebtheit. Es gibt keine bezahlten Platzierungen.',
    bg: 'Класирането се основава на оценки, качество и популярност. Не приемаме плащане за позициониране.',
    ru: 'Рейтинг основан на оценках пользователей, качестве и популярности. Платных размещений нет.',
    ro: 'Clasamentul se bazează pe evaluări, calitate și popularitate. Nu acceptăm plăți pentru poziționare.',
    sr: 'Rangiranje se zasniva na ocenama, kvalitetu i popularnosti. Ne prihvatamo plaćanje za poziciju.',
  };

  const q3: L7 = {
    el: 'Ποια εποχή είναι η καλύτερη για επίσκεψη;',
    en: 'When is the best time to visit?',
    de: 'Wann ist die beste Reisezeit?',
    bg: 'Кое е най-доброто време за посещение?',
    ru: 'Когда лучше всего посещать?',
    ro: 'Care este cea mai bună perioadă pentru a vizita?',
    sr: 'Kada je najbolje vreme za posetu?',
  };
  const a3: L7 = {
    el: 'Η Χαλκιδική έχει υψηλή σεζόν Ιούνιο–Σεπτέμβριο. Για λιγότερο πλήθος και καλύτερες τιμές, προτιμήστε Μάιο, Ιούνιο αρχές ή Σεπτέμβριο.',
    en: 'Halkidiki peak season is June–September. For fewer crowds and better prices, choose May, early June, or September.',
    de: 'Hochsaison ist Juni–September. Für weniger Andrang Mai, Anfang Juni oder September wählen.',
    bg: 'Пиковият сезон е юни–септември. За по-малко тълпи изберете май, началото на юни или септември.',
    ru: 'Высокий сезон — июнь–сентябрь. Для меньшего наплыва выбирайте май, начало июня или сентябрь.',
    ro: 'Sezonul de vârf este iunie–septembrie. Pentru mai puțină aglomerație, alegeți mai, începutul lui iunie sau septembrie.',
    sr: 'Sezona je jun–septembar. Za manje gužve birajte maj, početak juna ili septembar.',
  };

  const q4: L7 = {
    el: 'Πώς να χρησιμοποιήσω τις προτάσεις στον οδηγό;',
    en: 'How do I use these recommendations?',
    de: 'Wie nutze ich diese Empfehlungen?',
    bg: 'Как да използвам тези препоръки?',
    ru: 'Как пользоваться этими рекомендациями?',
    ro: 'Cum folosesc aceste recomandări?',
    sr: 'Kako da koristim ove preporuke?',
  };
  const a4: L7 = {
    el: 'Κάθε επιλογή στον οδηγό έχει δική της σελίδα με φωτογραφίες, χάρτη, χαρακτηριστικά και κοντινά καταλύματα. Κάντε κλικ σε ό,τι σας ενδιαφέρει για λεπτομέρειες.',
    en: 'Each pick has its own page with photos, map, features, and nearby accommodation. Click any item for full details.',
    de: 'Jeder Eintrag hat eine eigene Seite mit Fotos, Karte, Merkmalen und nahegelegenen Unterkünften.',
    bg: 'Всяка позиция има отделна страница със снимки, карта, характеристики и близки настанявания.',
    ru: 'У каждого пункта своя страница с фото, картой, характеристиками и ближайшим жильем.',
    ro: 'Fiecare opțiune are pagină proprie cu fotografii, hartă, caracteristici și cazări apropiate.',
    sr: 'Svaka stavka ima svoju stranicu sa fotografijama, mapom, karakteristikama i obližnjim smeštajem.',
  };

  return [
    { question: pick(q1, locale), answer: pick(a1, locale) },
    { question: pick(q2, locale), answer: pick(a2, locale) },
    { question: pick(q3, locale), answer: pick(a3, locale) },
    { question: pick(q4, locale), answer: pick(a4, locale) },
  ];
}

// ─── /itinerary/[days] ────────────────────────────────────────────
export function generateItineraryFaqs(
  guide: { slug: string; title: L7 },
  locale: string,
): FaqItem[] {
  const days = parseInt(guide.slug.replace(/[^0-9]/g, ''), 10) || 0;
  const dayWord: L7 = days === 1
    ? { el: 'μέρα', en: 'day', de: 'Tag', bg: 'ден', ru: 'день', ro: 'zi', sr: 'dan' }
    : { el: 'μέρες', en: 'days', de: 'Tage', bg: 'дни', ru: 'дней', ro: 'zile', sr: 'dana' };

  return [
    {
      question: pick({
        el: `Είναι αυτό το πρόγραμμα ${days} ${pick(dayWord, locale)} κατάλληλο για πρώτη επίσκεψη;`,
        en: `Is this ${days}-${pick(dayWord, locale)} itinerary good for first-timers?`,
        de: `Ist diese ${days}-${pick(dayWord, locale)}-Route für Erstbesucher geeignet?`,
        bg: `Подходящ ли е този маршрут за първо посещение?`,
        ru: `Подходит ли этот маршрут на ${days} ${pick(dayWord, locale)} для первой поездки?`,
        ro: `Este acest itinerariu de ${days} ${pick(dayWord, locale)} potrivit pentru prima vizită?`,
        sr: `Da li je ovaj plan od ${days} ${pick(dayWord, locale)} dobar za prvu posetu?`,
      }, locale),
      answer: pick({
        el: 'Ναι. Καλύπτει τα κορυφαία αξιοθέατα και τις 3 περιοχές της Χαλκιδικής (Κασσάνδρα, Σιθωνία, Μαινλάντ) χωρίς να γίνεται κουραστικό.',
        en: 'Yes. It covers the top sights across all three Halkidiki legs (Kassandra, Sithonia, mainland) without feeling rushed.',
        de: 'Ja. Es deckt die Top-Sehenswürdigkeiten aller drei Halbinseln ab, ohne hektisch zu wirken.',
        bg: 'Да. Покрива основните забележителности на трите полуострова без бързане.',
        ru: 'Да. Маршрут охватывает главные места всех трёх «ног» Халкидики, без спешки.',
        ro: 'Da. Acoperă principalele atracții ale celor trei peninsule, fără să fie agitat.',
        sr: 'Da. Pokriva glavne znamenitosti sva tri poluostrva bez žurbe.',
      }, locale),
    },
    {
      question: pick({
        el: 'Χρειάζομαι αυτοκίνητο;',
        en: 'Do I need a car?',
        de: 'Brauche ich ein Auto?',
        bg: 'Имам ли нужда от кола?',
        ru: 'Нужна ли машина?',
        ro: 'Am nevoie de mașină?',
        sr: 'Da li mi treba auto?',
      }, locale),
      answer: pick({
        el: 'Έντονα συνιστάται. Οι παραλίες και τα χωριά είναι διασκορπισμένα — τα λεωφορεία υπάρχουν αλλά είναι αραιά. Νοίκι αμαξιού από Θεσσαλονίκη ξεκινά ~25€/μέρα.',
        en: 'Strongly recommended. Beaches and villages are spread out — buses exist but run rarely. Car rental from Thessaloniki starts ~€25/day.',
        de: 'Sehr empfohlen. Strände und Dörfer sind weit verteilt — Busse fahren selten. Mietwagen ab Thessaloniki ab ca. 25€/Tag.',
        bg: 'Силно препоръчително. Плажовете и селата са разпръснати; автобусите са редки. Кола под наем от Солун ~25€/ден.',
        ru: 'Настоятельно рекомендуем. Пляжи и деревни разбросаны, автобусы ходят редко. Аренда от Салоник от ~25€/день.',
        ro: 'Recomandat. Plajele și satele sunt răspândite; autobuzele sunt rare. Închiriere mașină de la Salonic ~25€/zi.',
        sr: 'Snažno preporučujemo. Plaže i sela su raštrkani; autobusi su retki. Rentiranje od Soluna ~25€/dan.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πόσο ευέλικτο είναι το πρόγραμμα;',
        en: 'How flexible is this plan?',
        de: 'Wie flexibel ist dieser Plan?',
        bg: 'Колко гъвкав е този план?',
        ru: 'Насколько гибок этот план?',
        ro: 'Cât de flexibil este planul?',
        sr: 'Koliko je ovaj plan fleksibilan?',
      }, locale),
      answer: pick({
        el: 'Πλήρως ευέλικτο. Μπορείτε να ανταλλάξετε ημέρες, να αφαιρέσετε ή να προσθέσετε προορισμούς — το πρόγραμμα είναι οδηγός, όχι αυστηρή ατζέντα.',
        en: 'Fully flexible. Swap days, drop or add destinations as you like — the plan is a guide, not a fixed schedule.',
        de: 'Vollständig flexibel. Tauschen, weglassen oder ergänzen Sie Ziele nach Belieben.',
        bg: 'Напълно гъвкав. Можете да разменяте дните, да премахвате или добавяте дестинации.',
        ru: 'Полностью гибкий. Меняйте дни, убирайте или добавляйте места по желанию.',
        ro: 'Complet flexibil. Schimbați zilele, eliminați sau adăugați destinații după preferințe.',
        sr: 'Potpuno fleksibilan. Menjajte dane, izbacujte ili dodajte destinacije po želji.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πού να μείνω για αυτή τη διαμονή;',
        en: 'Where should I stay during this trip?',
        de: 'Wo soll ich während dieser Reise übernachten?',
        bg: 'Къде да отседна по време на това пътуване?',
        ru: 'Где остановиться во время этой поездки?',
        ro: 'Unde să stau în această călătorie?',
        sr: 'Gde da odsednem tokom ovog putovanja?',
      }, locale),
      answer: pick({
        el: 'Δείτε τα καταλύματά μας στο /listings — απευθείας με τον ιδιοκτήτη, χωρίς προμήθεια κράτησης. Φιλτράρετε ανά περιοχή (Κασσάνδρα, Σιθωνία, Μαινλάντ).',
        en: 'Browse /listings — book directly with owners, no booking fees. Filter by area (Kassandra, Sithonia, mainland).',
        de: 'Auf /listings — direkt beim Eigentümer ohne Buchungsgebühren. Filter nach Region.',
        bg: 'Разгледайте /listings — директно от собственика, без такси. Филтър по район.',
        ru: 'Смотрите /listings — бронирование напрямую без комиссий. Фильтр по региону.',
        ro: 'Vedeți /listings — direct de la proprietar, fără comisioane. Filtru pe regiune.',
        sr: 'Pogledajte /listings — direktno od vlasnika, bez provizije. Filter po regiji.',
      }, locale),
    },
  ];
}

// ─── /from/[city] ────────────────────────────────────────────────
export function generateFromCityFaqs(
  guide: { slug: string; title: L7; description: L7 },
  locale: string,
): FaqItem[] {
  const city = pick(guide.title, locale).replace(/^From\s+|^Από\s+|^Von\s+|^От\s+|^Из\s+|^De\s+la\s+|^Од\s+/i, '').replace(/\s+to.*$|\s+στη.*$|\s+nach.*$|\s+до.*$|\s+в.*$|\s+la\s+.*$|\s+do.*$/i, '');
  // Pull distance/duration hint from description (e.g. "330 km, ~4 hours drive")
  const descEn = pick(guide.description, 'en');
  const km = descEn.match(/(\d{2,4})\s*km/i)?.[1];
  const hrs = descEn.match(/~?\s*(\d{1,2})\s*hours?/i)?.[1];

  return [
    {
      question: pick({
        el: `Πόσο κάνει από ${city} στη Χαλκιδική;`,
        en: `How long does the trip from ${city} to Halkidiki take?`,
        de: `Wie lange dauert die Fahrt von ${city} nach Chalkidiki?`,
        bg: `Колко време отнема пътуването от ${city} до Халкидики?`,
        ru: `Сколько занимает дорога из ${city} в Халкидики?`,
        ro: `Cât durează drumul de la ${city} la Halkidiki?`,
        sr: `Koliko traje put od ${city} do Halkidikija?`,
      }, locale),
      answer: hrs && km
        ? pick({
            el: `Περίπου ${hrs} ώρες οδήγηση, ${km} χλμ.`,
            en: `Roughly ${hrs} hours by car, ${km} km.`,
            de: `Etwa ${hrs} Stunden mit dem Auto, ${km} km.`,
            bg: `Около ${hrs} часа с кола, ${km} км.`,
            ru: `Около ${hrs} часов на машине, ${km} км.`,
            ro: `Aproximativ ${hrs} ore cu mașina, ${km} km.`,
            sr: `Oko ${hrs} sati autom, ${km} km.`,
          }, locale)
        : pick(guide.description, locale),
    },
    {
      question: pick({
        el: 'Ποιες είναι οι επιλογές μεταφοράς;',
        en: 'What are the transport options?',
        de: 'Welche Verkehrsmittel gibt es?',
        bg: 'Какви са транспортните опции?',
        ru: 'Какие есть варианты транспорта?',
        ro: 'Care sunt opțiunile de transport?',
        sr: 'Koje su opcije prevoza?',
      }, locale),
      answer: pick({
        el: 'Αυτοκίνητο (ιδανικό για ευελιξία), λεωφορείο (KTEL Χαλκιδικής από Θεσσαλονίκη), και πτήση προς Θεσσαλονίκη (SKG) με συνδυασμό αυτοκινήτου ή μεταφοράς. Δείτε λεπτομέρειες στον οδηγό παραπάνω.',
        en: 'Car (best for flexibility), bus (KTEL Halkidiki from Thessaloniki), or fly to Thessaloniki (SKG) and continue by car/transfer. Details in the guide above.',
        de: 'Auto (am flexibelsten), Bus (KTEL Chalkidiki ab Thessaloniki) oder Flug nach Thessaloniki (SKG) plus Auto/Transfer.',
        bg: 'Кола (за гъвкавост), автобус (KTEL Халкидики от Солун) или полет до Солун (SKG) и допълнителен транспорт.',
        ru: 'Машина (для гибкости), автобус (KTEL Халкидики из Салоник) или перелёт в Салоники (SKG) + трансфер.',
        ro: 'Mașină (flexibilitate), autobuz (KTEL Halkidiki din Salonic) sau zbor la Salonic (SKG) + transfer.',
        sr: 'Auto (najfleksibilnije), autobus (KTEL Halkidiki iz Soluna) ili let do Soluna (SKG) + transfer.',
      }, locale),
    },
    {
      question: pick({
        el: 'Χρειάζομαι βίζα;',
        en: 'Do I need a visa?',
        de: 'Brauche ich ein Visum?',
        bg: 'Имам ли нужда от виза?',
        ru: 'Нужна ли виза?',
        ro: 'Am nevoie de viză?',
        sr: 'Da li mi treba viza?',
      }, locale),
      answer: pick({
        el: 'Η Ελλάδα είναι στη Σένγκεν. Πολίτες ΕΕ/ΕΟΧ δεν χρειάζονται βίζα. Άλλες υπηκοότητες — ελέγξτε με την αρμόδια προξενική αρχή.',
        en: 'Greece is in Schengen. EU/EEA citizens need no visa. Other nationalities — check with the relevant consulate.',
        de: 'Griechenland gehört zum Schengen-Raum. EU/EWR-Bürger benötigen kein Visum. Sonst beim Konsulat prüfen.',
        bg: 'Гърция е в Шенген. Граждани на ЕС/ЕИП не се нуждаят от виза. Други — проверете в консулството.',
        ru: 'Греция в Шенгене. Гражданам ЕС/ЕЭП виза не нужна. Остальным — уточняйте в консульстве.',
        ro: 'Grecia este în Schengen. Cetățenii UE/SEE nu au nevoie de viză. Alții — verificați la consulat.',
        sr: 'Grčka je u Šengenu. Građanima EU/EEA viza nije potrebna. Ostali — proverite kod konzulata.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πότε είναι η καλύτερη εποχή για ταξίδι;',
        en: 'When is the best time to travel?',
        de: 'Wann ist die beste Reisezeit?',
        bg: 'Кое е най-доброто време за пътуване?',
        ru: 'Когда лучше всего ехать?',
        ro: 'Care este cea mai bună perioadă de călătorie?',
        sr: 'Kada je najbolje vreme za putovanje?',
      }, locale),
      answer: pick({
        el: 'Μάιος – Σεπτέμβριος για παραλίες. Ιούλιος–Αύγουστος είναι η αιχμή (πιο ζεστά, πιο ακριβά). Για ήσυχες διακοπές με καλό καιρό, προτιμήστε Ιούνιο ή Σεπτέμβριο.',
        en: 'May–September for beaches. July–August is peak (hottest, priciest). For quieter trips with great weather, pick June or September.',
        de: 'Mai–September für Strände. Juli–August Hochsaison. Für ruhigere Reisen Juni oder September.',
        bg: 'Май–септември за плажове. Юли–август е пикът. За по-спокойни почивки изберете юни или септември.',
        ru: 'Май–сентябрь для пляжей. Июль–август — пик. Для спокойной поездки выбирайте июнь или сентябрь.',
        ro: 'Mai–septembrie pentru plaje. Iulie–august este vârful. Pentru sejururi liniștite, alegeți iunie sau septembrie.',
        sr: 'Maj–septembar za plaže. Jul–avgust je vrhunac. Za mirnije putovanje, jun ili septembar.',
      }, locale),
    },
  ];
}

// ─── /costs/[topic] ──────────────────────────────────────────────
export function generateCostsFaqs(
  guide: { slug: string; title: L7 },
  locale: string,
): FaqItem[] {
  return [
    {
      question: pick({
        el: 'Πότε είναι φθηνότερη η Χαλκιδική;',
        en: 'When is Halkidiki cheapest?',
        de: 'Wann ist Chalkidiki am günstigsten?',
        bg: 'Кога Халкидики е най-евтина?',
        ru: 'Когда Халкидики дешевле всего?',
        ro: 'Când este Halkidiki cel mai ieftin?',
        sr: 'Kada je Halkidiki najjeftiniji?',
      }, locale),
      answer: pick({
        el: 'Μάιος, αρχές Ιουνίου και Σεπτέμβριος έχουν τιμές 30-50% χαμηλότερες από Ιούλιο–Αύγουστο, με καλό καιρό και θερμή θάλασσα.',
        en: 'May, early June, and September are 30–50% cheaper than July–August, with great weather and warm sea.',
        de: 'Mai, Anfang Juni und September sind 30–50% günstiger als Juli–August.',
        bg: 'Май, началото на юни и септември са 30–50% по-евтини от юли–август.',
        ru: 'Май, начало июня и сентябрь — на 30–50% дешевле июля–августа.',
        ro: 'Mai, începutul lui iunie și septembrie sunt cu 30–50% mai ieftine decât iulie–august.',
        sr: 'Maj, početak juna i septembar su 30–50% jeftiniji od jula–avgusta.',
      }, locale),
    },
    {
      question: pick({
        el: 'Ποιο είναι το μεγαλύτερο έξοδο;',
        en: 'What is the biggest expense?',
        de: 'Was ist die größte Ausgabe?',
        bg: 'Кой е най-големият разход?',
        ru: 'Какая статья расходов самая большая?',
        ro: 'Care este cea mai mare cheltuială?',
        sr: 'Koji je najveći trošak?',
      }, locale),
      answer: pick({
        el: 'Συνήθως το κατάλυμα. Κρατώντας απευθείας με τον ιδιοκτήτη (όχι μέσω Booking/Airbnb) γλιτώνετε 15–20% από προμήθειες.',
        en: 'Accommodation usually. Booking directly with the owner (skipping Booking.com/Airbnb) saves 15–20% in fees.',
        de: 'Meist die Unterkunft. Direkt beim Eigentümer buchen spart 15–20% an Gebühren.',
        bg: 'Обикновено настаняването. Резервация директно от собственика спестява 15–20%.',
        ru: 'Обычно проживание. Бронирование напрямую у владельца экономит 15–20% комиссий.',
        ro: 'De obicei cazarea. Rezervând direct de la proprietar economisiți 15–20% din comisioane.',
        sr: 'Najčešće smeštaj. Direktna rezervacija od vlasnika štedi 15–20% provizije.',
      }, locale),
    },
    {
      question: pick({
        el: 'Σε τι νόμισμα γίνονται οι πληρωμές;',
        en: 'What currency is used?',
        de: 'Welche Währung wird verwendet?',
        bg: 'Каква валута се използва?',
        ru: 'Какая валюта используется?',
        ro: 'Ce monedă se folosește?',
        sr: 'Koja valuta se koristi?',
      }, locale),
      answer: pick({
        el: 'Ευρώ (EUR). Οι κάρτες γίνονται αποδεκτές παντού· σε μικρά χωριά και ταβέρνες κρατήστε λίγα μετρητά.',
        en: 'Euro (EUR). Cards are accepted nearly everywhere; keep some cash for small villages and tavernas.',
        de: 'Euro (EUR). Karten fast überall akzeptiert; etwas Bargeld für kleine Dörfer mitnehmen.',
        bg: 'Евро (EUR). Карти се приемат почти навсякъде; пазете в брой за малки села.',
        ru: 'Евро (EUR). Карты принимаются почти везде; немного наличных для деревень.',
        ro: 'Euro (EUR). Cardurile sunt acceptate aproape peste tot; păstrați numerar pentru sate mici.',
        sr: 'Evro (EUR). Kartice se prihvataju skoro svuda; ponesite nešto keša za mala sela.',
      }, locale),
    },
    {
      question: pick({
        el: 'Πώς να εξοικονομήσω χρήματα στις διακοπές;',
        en: 'How can I save money on my trip?',
        de: 'Wie spare ich Geld auf der Reise?',
        bg: 'Как мога да спестя пари по време на пътуването?',
        ru: 'Как сэкономить в поездке?',
        ro: 'Cum pot economisi în călătorie?',
        sr: 'Kako da uštedim na putovanju?',
      }, locale),
      answer: pick({
        el: '1) Ταξίδι εκτός σεζόν (Μάιος/Σεπτέμβριος). 2) Απευθείας κράτηση με ιδιοκτήτη. 3) Ελεύθερες παραλίες αντί ξαπλώστρες (15–25€/μέρα). 4) Σούπερ μάρκετ για πρωινό/βραδινό· ταβέρνα για μεσημέρι (μεσημεριανό μενού ~10€).',
        en: '1) Travel off-peak (May/Sept). 2) Book direct with owners. 3) Use free beaches instead of sunbed pairs (€15–25/day). 4) Supermarket for breakfast/snacks, taverna lunch menu ~€10.',
        de: '1) Nebensaison (Mai/Sep). 2) Direkt beim Eigentümer buchen. 3) Freie Strände statt Liegen (15–25€/Tag). 4) Supermarkt für Frühstück, Taverne mittags ~10€.',
        bg: '1) Извън сезона (май/септ). 2) Директна резервация. 3) Безплатни плажове вместо шезлонги (15–25€). 4) Супермаркет за закуска, обяд в таверна ~10€.',
        ru: '1) Низкий сезон (май/сент). 2) Бронируйте напрямую. 3) Бесплатные пляжи вместо шезлонгов (15–25€). 4) Супермаркет на завтрак, таверна на обед ~10€.',
        ro: '1) Extrasezon (mai/sept). 2) Rezervare directă. 3) Plaje libere în loc de șezlonguri (15–25€). 4) Supermarket pentru mic dejun, prânz la tavernă ~10€.',
        sr: '1) Van sezone (maj/sept). 2) Direktna rezervacija. 3) Slobodne plaže umesto ležaljki (15–25€). 4) Supermarket za doručak, ručak u taverni ~10€.',
      }, locale),
    },
  ];
}
