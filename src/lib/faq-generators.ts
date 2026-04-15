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
