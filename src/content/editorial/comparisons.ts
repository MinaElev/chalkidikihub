import type { Locale } from '@/i18n/config';

/**
 * "X vs Y" comparison tables for the /guide comparison pages, ported from v3
 * (src/lib/comparisons.ts) and completed for all 7 locales. Rendered as a real
 * <table> near the top of the page: the scannable answer Google lifts into a
 * featured snippet. Figures match the audited guide texts (drive times from
 * Thessaloniki airport as in /from/thessaloniki).
 */

type T = Record<Locale, string>;
export type ComparisonRow = { label: T; a: T; b: T };
export type Comparison = { title: T; colA: T; colB: T; verdict: T; rows: ComparisonRow[] };

const l = (el: string, en: string, de: string, ro: string, bg: string, sr: string, ru: string): T => ({ el, en, de, ro, bg, sr, ru });

export const IN_SHORT: T = l('Με λίγα λόγια:', 'In short:', 'Kurz gesagt:', 'Pe scurt:', 'Накратко:', 'Ukratko:', 'Коротко:');

export const COMPARISONS: Record<string, Comparison> = {
  'kassandra-vs-sithonia': {
    title: l('Κασσάνδρα ή Σιθωνία;', 'Kassandra or Sithonia?', 'Kassandra oder Sithonia?', 'Kassandra sau Sithonia?', 'Касандра или Ситония?', 'Kasandra ili Sitonija?', 'Кассандра или Ситония?'),
    colA: l('Κασσάνδρα', 'Kassandra', 'Kassandra', 'Kassandra', 'Касандра', 'Kasandra', 'Кассандра'),
    colB: l('Σιθωνία', 'Sithonia', 'Sithonia', 'Sithonia', 'Ситония', 'Sitonija', 'Ситония'),
    verdict: l(
      'Κασσάνδρα για ζωντάνια, οργανωμένες παραλίες και ευκολία· Σιθωνία για φύση, εξωτικούς κόλπους και ηρεμία.',
      'Choose Kassandra for buzz, organised beaches and convenience; Sithonia for nature, exotic coves and quiet.',
      'Kassandra für Trubel, organisierte Strände und Komfort; Sithonia für Natur, exotische Buchten und Ruhe.',
      'Kassandra pentru animație, plaje organizate și confort; Sithonia pentru natură, golfuri exotice și liniște.',
      'Касандра – за оживление, уредени плажове и удобство; Ситония – за природа, екзотични заливи и спокойствие.',
      'Kasandra za živahnost, uređene plaže i udobnost; Sitonija za prirodu, egzotične uvale i mir.',
      'Кассандра — для оживлённого отдыха, организованных пляжей и удобства; Ситония — для природы, живописных бухт и тишины.',
    ),
    rows: [
      {
        label: l('Χαρακτήρας', 'Character', 'Charakter', 'Caracter', 'Характер', 'Karakter', 'Характер'),
        a: l('Πιο κοσμική και οργανωμένη', 'Livelier and more developed', 'Lebhafter und stärker erschlossen', 'Mai animată și mai dezvoltată', 'По-оживена и по-развита', 'Živahnija i razvijenija', 'Оживлённее и обустроеннее'),
        b: l('Πιο άγρια και φυσική', 'Wilder and more natural', 'Wilder und naturbelassener', 'Mai sălbatică și mai naturală', 'По-дива и по-естествена', 'Divlja i prirodnija', 'Более дикая и природная'),
      },
      {
        label: l('Παραλίες', 'Beaches', 'Strände', 'Plaje', 'Плажове', 'Plaže', 'Пляжи'),
        a: l('Μεγάλες, αμμώδεις, οργανωμένες', 'Long, sandy, organised', 'Lang, sandig, organisiert', 'Lungi, nisipoase, organizate', 'Дълги, пясъчни, уредени', 'Duge, peščane, uređene', 'Длинные, песчаные, организованные'),
        b: l('Εξωτικοί κόλποι, τιρκουάζ νερά', 'Exotic coves, turquoise water', 'Exotische Buchten, türkisfarbenes Wasser', 'Golfuri exotice, apă turcoaz', 'Екзотични заливи, тюркоазена вода', 'Egzotične uvale, tirkizna voda', 'Живописные бухты, бирюзовая вода'),
      },
      {
        label: l('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben', 'Viață de noapte', 'Нощен живот', 'Noćni život', 'Ночная жизнь'),
        a: l('Έντονη: beach bars και clubs', 'Vibrant: beach bars and clubs', 'Lebhaft: Beachbars und Clubs', 'Intensă: beach baruri și cluburi', 'Оживен: бийч барове и клубове', 'Živ: bitč barovi i klubovi', 'Активная: пляжные бары и клубы'),
        b: l('Πιο ήσυχη και χαλαρή', 'Quieter and laid-back', 'Ruhiger und entspannter', 'Mai liniștită și relaxată', 'По-тих и спокоен', 'Mirniji i opušteniji', 'Спокойнее и размереннее'),
      },
      {
        label: l('Κόσμος', 'Crowds', 'Andrang', 'Aglomerație', 'Навалица', 'Gužva', 'Многолюдность'),
        a: l('Περισσότερος κόσμος', 'Busier', 'Mehr Betrieb', 'Mai aglomerată', 'Повече хора', 'Više ljudi', 'Больше людей'),
        b: l('Λιγότερος κόσμος, ηρεμία', 'Fewer people, calmer', 'Weniger Leute, mehr Ruhe', 'Mai puțină lume, mai liniștită', 'По-малко хора, по-спокойно', 'Manje ljudi, mirnije', 'Меньше людей, спокойнее'),
      },
      {
        label: l('Από το αεροδρόμιο Θεσσαλονίκης', 'From Thessaloniki airport', 'Ab Flughafen Thessaloniki', 'De la aeroportul din Salonic', 'От летище Солун', 'Od aerodroma u Solunu', 'От аэропорта Салоников'),
        a: l('1–1,5 ώρα (πιο κοντά)', '1–1.5 hours (closer)', '1–1,5 Stunden (näher)', '1–1,5 ore (mai aproape)', '1–1,5 часа (по-близо)', '1–1,5 sat (bliže)', '1–1,5 часа (ближе)'),
        b: l('1,5–2,5 ώρες', '1.5–2.5 hours', '1,5–2,5 Stunden', '1,5–2,5 ore', '1,5–2,5 часа', '1,5–2,5 sata', '1,5–2,5 часа'),
      },
      {
        label: l('Τιμές', 'Prices', 'Preise', 'Prețuri', 'Цени', 'Cene', 'Цены'),
        a: l('Λίγο υψηλότερες στα δημοφιλή σημεία', 'Slightly higher at the hotspots', 'An den Hotspots etwas höher', 'Ușor mai mari în zonele populare', 'Малко по-високи в популярните места', 'Nešto više na popularnim mestima', 'Немного выше в популярных местах'),
        b: l('Καλύτερη σχέση τιμής στα χωριά', 'Better value in the villages', 'In den Dörfern günstiger', 'Raport calitate-preț mai bun în sate', 'По-изгодно в селата', 'Povoljnije u selima', 'Выгоднее в деревнях'),
      },
      {
        label: l('Ιδανική για', 'Best for', 'Ideal für', 'Ideală pentru', 'Подходяща за', 'Idealna za', 'Подойдёт для'),
        a: l('Οικογένειες, διασκέδαση, ευκολία', 'Families, nightlife, convenience', 'Familien, Ausgehen, Komfort', 'Familii, distracție, confort', 'Семейства, забавления, удобство', 'Porodice, provod, udobnost', 'Семей, развлечений, удобства'),
        b: l('Ζευγάρια, φύση, snorkeling', 'Couples, nature, snorkelling', 'Paare, Natur, Schnorcheln', 'Cupluri, natură, snorkeling', 'Двойки, природа, шнорхелинг', 'Parove, prirodu, ronjenje s disalicom', 'Пар, природы, снорклинга'),
      },
    ],
  },
  'halkidiki-vs-thassos': {
    title: l('Χαλκιδική ή Θάσος;', 'Halkidiki or Thassos?', 'Chalkidiki oder Thassos?', 'Halkidiki sau Thassos?', 'Халкидики или Тасос?', 'Halkidiki ili Tasos?', 'Халкидики или Тасос?'),
    colA: l('Χαλκιδική', 'Halkidiki', 'Chalkidiki', 'Halkidiki', 'Халкидики', 'Halkidiki', 'Халкидики'),
    colB: l('Θάσος', 'Thassos', 'Thassos', 'Thassos', 'Тасос', 'Tasos', 'Тасос'),
    verdict: l(
      'Χαλκιδική για ποικιλία (τρεις χερσόνησοι, φτάνεις οδικώς)· Θάσος για καταπράσινο νησί με πεντακάθαρα νερά.',
      'Choose Halkidiki for variety (three peninsulas, reached by road); Thassos for a lush green island with crystal-clear water.',
      'Chalkidiki für Abwechslung (drei Halbinseln, mit dem Auto erreichbar); Thassos für eine grüne Insel mit glasklarem Wasser.',
      'Halkidiki pentru varietate (trei peninsule, acces rutier); Thassos pentru o insulă verde, cu apă cristalină.',
      'Халкидики – за разнообразие (три полуострова, стигате с кола); Тасос – за зелен остров с кристално чиста вода.',
      'Halkidiki za raznovrsnost (tri poluostrva, stiže se kolima); Tasos za zeleno ostrvo kristalno čiste vode.',
      'Халкидики — для разнообразия (три полуострова, добраться можно на машине); Тасос — для зелёного острова с кристально чистой водой.',
    ),
    rows: [
      {
        label: l('Πρόσβαση', 'Getting there', 'Anreise', 'Cum ajungi', 'Как се стига', 'Kako stići', 'Как добраться'),
        a: l('Οδικώς από Θεσσαλονίκη (SKG)', 'By road from Thessaloniki (SKG)', 'Auf der Straße ab Thessaloniki (SKG)', 'Pe șosea de la Salonic (SKG)', 'С кола от Солун (SKG)', 'Kolima od Soluna (SKG)', 'На машине из Салоников (SKG)'),
        b: l('Φέρι από Καβάλα ή Κεραμωτή', 'Ferry from Kavala or Keramoti', 'Fähre ab Kavala oder Keramoti', 'Feribot din Kavala sau Keramoti', 'Ферибот от Кавала или Керамоти', 'Trajekt iz Kavale ili Keramotija', 'Паром из Кавалы или Керамоти'),
      },
      {
        label: l('Τοπίο', 'Landscape', 'Landschaft', 'Peisaj', 'Пейзаж', 'Pejzaž', 'Ландшафт'),
        a: l('Τρεις χερσόνησοι, μεγάλη ποικιλία', 'Three peninsulas, lots of variety', 'Drei Halbinseln, viel Abwechslung', 'Trei peninsule, multă varietate', 'Три полуострова, голямо разнообразие', 'Tri poluostrva, velika raznovrsnost', 'Три полуострова, большое разнообразие'),
        b: l('Καταπράσινο νησί, πεύκα και ελιές', 'Lush green island, pines and olives', 'Grüne Insel, Pinien und Oliven', 'Insulă verde, pini și măslini', 'Зелен остров, борове и маслини', 'Zeleno ostrvo, borovi i masline', 'Зелёный остров, сосны и оливы'),
      },
      {
        label: l('Παραλίες', 'Beaches', 'Strände', 'Plaje', 'Плажове', 'Plaže', 'Пляжи'),
        a: l('Από οργανωμένες έως εξωτικούς κόλπους', 'From organised to exotic coves', 'Von organisiert bis zu exotischen Buchten', 'De la organizate la golfuri exotice', 'От уредени до екзотични заливи', 'Od uređenih do egzotičnih uvala', 'От организованных до диких бухт'),
        b: l('Πεντακάθαρα νερά, μερικές με λευκό μάρμαρο', 'Crystal-clear water, a few with white marble', 'Glasklares Wasser, einige mit weißem Marmor', 'Apă cristalină, câteva cu marmură albă', 'Кристална вода, някои с бял мрамор', 'Kristalna voda, neke s belim mermerom', 'Кристальная вода, на некоторых белый мрамор'),
      },
      {
        label: l('Μέγεθος', 'Size', 'Größe', 'Mărime', 'Размер', 'Veličina', 'Размер'),
        a: l('Μεγάλη, θέλει αυτοκίνητο', 'Large, a car is essential', 'Groß, ein Auto ist nötig', 'Mare, ai nevoie de mașină', 'Голяма, трябва кола', 'Velika, potreban je auto', 'Большая, нужна машина'),
        b: l('Μικρότερη, τον γύρο τον κάνεις σε μία μέρα', 'Smaller, you can drive round it in a day', 'Kleiner, in einem Tag einmal herum', 'Mai mică, o înconjori cu mașina într-o zi', 'По-малък, обикаля се с кола за ден', 'Manje, obiđe se kolima za jedan dan', 'Меньше, объехать можно за день'),
      },
      {
        label: l('Νυχτερινή ζωή', 'Nightlife', 'Nachtleben', 'Viață de noapte', 'Нощен живот', 'Noćni život', 'Ночная жизнь'),
        a: l('Πλούσια, ιδίως στην Κασσάνδρα', 'Plenty, especially in Kassandra', 'Vielfältig, vor allem auf Kassandra', 'Bogată, mai ales în Kassandra', 'Богат, особено в Касандра', 'Bogat, naročito na Kasandri', 'Насыщенная, особенно на Кассандре'),
        b: l('Πιο ήσυχη, οικογενειακή', 'Quieter, family-oriented', 'Ruhiger, familiär', 'Mai liniștită, pentru familii', 'По-тих, семеен', 'Mirniji, porodični', 'Спокойнее, семейная'),
      },
      {
        label: l('Ιδανική για', 'Best for', 'Ideal für', 'Ideală pentru', 'Подходяща за', 'Idealna za', 'Подойдёт для'),
        a: l('Ποικιλία, road trips, νυχτερινή ζωή', 'Variety, road trips, nightlife', 'Abwechslung, Roadtrips, Nachtleben', 'Varietate, road trips, viață de noapte', 'Разнообразие, пътешествия с кола, нощен живот', 'Raznovrsnost, putovanja kolima, noćni život', 'Разнообразия, автопутешествий, ночной жизни'),
        b: l('Ησυχία, φύση, νησιώτικη ατμόσφαιρα', 'Quiet, nature, an island feel', 'Ruhe, Natur, Inselgefühl', 'Liniște, natură, atmosferă de insulă', 'Спокойствие, природа, островна атмосфера', 'Mir, prirodu, ostrvsku atmosferu', 'Тишины, природы, островной атмосферы'),
      },
    ],
  },
};
