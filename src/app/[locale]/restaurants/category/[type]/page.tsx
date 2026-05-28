import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import RestaurantTypePage from './_client';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export const revalidate = 3600; // ISR: 1 hour

/* ── Type labels in all 7 languages ───────────────────────────────── */
const TYPE_LABELS: Record<string, Record<string, string>> = {
  traditional: {
    el: 'Παραδοσιακά Εστιατόρια', en: 'Traditional Restaurants', de: 'Traditionelle Restaurants',
    bg: 'Традиционни ресторанти', ru: 'Традиционные рестораны', ro: 'Restaurante tradiționale', sr: 'Tradicionalni restorani',
  },
  seafood: {
    el: 'Ψαροταβέρνες', en: 'Seafood Restaurants', de: 'Fischrestaurants',
    bg: 'Рибни ресторанти', ru: 'Рыбные рестораны', ro: 'Restaurante cu fructe de mare', sr: 'Riblji restorani',
  },
  pizza: {
    el: 'Πιτσαρίες', en: 'Pizzerias', de: 'Pizzerien',
    bg: 'Пицарии', ru: 'Пиццерии', ro: 'Pizzerii', sr: 'Picerije',
  },
  grill: {
    el: 'Ψησταριές', en: 'Grill Houses', de: 'Grillhäuser',
    bg: 'Грил къщи', ru: 'Грильные', ro: 'Case de grătar', sr: 'Roštiljnice',
  },
  brunch: {
    el: 'Brunch & Πρωινό', en: 'Brunch & Breakfast', de: 'Brunch & Frühstück',
    bg: 'Бранч & Закуска', ru: 'Бранч & Завтрак', ro: 'Brunch & Mic dejun', sr: 'Brunch & Doručak',
  },
  'beach-bar': {
    el: 'Beach Bars', en: 'Beach Bars', de: 'Beach Bars',
    bg: 'Плажни барове', ru: 'Пляжные бары', ro: 'Beach Bars', sr: 'Beach Bars',
  },
  cafe: {
    el: 'Καφετέριες', en: 'Cafés', de: 'Cafés',
    bg: 'Кафенета', ru: 'Кафе', ro: 'Cafenele', sr: 'Kafići',
  },
  bakery: {
    el: 'Αρτοποιεία & Ζαχαροπλαστεία', en: 'Bakeries & Pastry Shops', de: 'Bäckereien & Konditoreien',
    bg: 'Пекарни & Сладкарници', ru: 'Пекарни & Кондитерские', ro: 'Brutării & Cofetării', sr: 'Pekare & Poslastičarnice',
  },
  souvlaki: {
    el: 'Σουβλατζίδικα', en: 'Souvlaki Shops', de: 'Souvlaki-Läden',
    bg: 'Сувлаки заведения', ru: 'Сувлаки', ro: 'Magazine de souvlaki', sr: 'Suvlaki radnje',
  },
  'fine-dining': {
    el: 'Fine Dining', en: 'Fine Dining', de: 'Fine Dining',
    bg: 'Фино хранене', ru: 'Высокая кухня', ro: 'Fine Dining', sr: 'Fine Dining',
  },
};

/* ── SEO meta descriptions (~160 chars) ───────────────────────────── */
const TYPE_META_DESC: Record<string, Record<string, string>> = {
  traditional: {
    el: 'Τα καλύτερα παραδοσιακά εστιατόρια στη Χαλκιδική — σπιτική κουζίνα, τοπικές γεύσεις, ελληνική φιλοξενία.',
    en: 'Best traditional restaurants in Halkidiki — homemade cuisine, local flavors, Greek hospitality.',
    de: 'Die besten traditionellen Restaurants in Chalkidiki — hausgemachte Küche, lokale Aromen, griechische Gastfreundschaft.',
    bg: 'Най-добрите традиционни ресторанти в Халкидики — домашна кухня, местни вкусове, гръцко гостоприемство.',
    ru: 'Лучшие традиционные рестораны на Халкидики — домашняя кухня, местные вкусы, греческое гостеприимство.',
    ro: 'Cele mai bune restaurante tradiționale din Halkidiki — bucătărie casnică, arome locale, ospitalitate grecească.',
    sr: 'Najbolji tradicionalni restorani na Halkidikiju — domaća kuhinja, lokalni ukusi, grčko gostoprimstvo.',
  },
  seafood: {
    el: 'Οι καλύτερες ψαροταβέρνες στη Χαλκιδική — φρέσκα ψάρια, χταπόδι σχάρας, αστακομακαρονάδα, θέα θάλασσα.',
    en: 'Best seafood restaurants in Halkidiki — fresh fish, grilled octopus, lobster pasta, sea views.',
    de: 'Die besten Fischrestaurants in Chalkidiki — frischer Fisch, gegrillter Oktopus, Hummer-Pasta, Meerblick.',
    bg: 'Най-добрите рибни ресторанти в Халкидики — прясна риба, октопод на скара, омарна паста, морска гледка.',
    ru: 'Лучшие рыбные рестораны на Халкидики — свежая рыба, осьминог на гриле, паста с лобстером, вид на море.',
    ro: 'Cele mai bune restaurante cu fructe de mare din Halkidiki — pește proaspăt, caracatiță la grătar, paste cu homar.',
    sr: 'Najbolji riblji restorani na Halkidikiju — sveža riba, hobotnica sa roštilja, pasta sa jastogom, pogled na more.',
  },
  pizza: {
    el: 'Οι καλύτερες πιτσαρίες στη Χαλκιδική — ξυλόφουρνος, ιταλικές συνταγές, delivery & take away.',
    en: 'Best pizzerias in Halkidiki — wood-fired oven, Italian recipes, delivery & takeaway.',
    de: 'Die besten Pizzerien in Chalkidiki — Holzofen, italienische Rezepte, Lieferung & Abholung.',
    bg: 'Най-добрите пицарии в Халкидики — пещ на дърва, италиански рецепти, доставка.',
    ru: 'Лучшие пиццерии на Халкидики — дровяная печь, итальянские рецепты, доставка.',
    ro: 'Cele mai bune pizzerii din Halkidiki — cuptor pe lemne, rețete italiene, livrare.',
    sr: 'Najbolje picerije na Halkidikiju — peć na drva, italijanski recepti, dostava.',
  },
  grill: {
    el: 'Οι καλύτερες ψησταριές στη Χαλκιδική — σουβλάκι, μπιφτέκια, κοντοσούβλι, παϊδάκια στα κάρβουνα.',
    en: 'Best grill houses in Halkidiki — souvlaki, burgers, kontosouvli, charcoal-grilled lamb chops.',
    de: 'Die besten Grillhäuser in Chalkidiki — Souvlaki, Frikadellen, Kontosouvli, Lammkoteletts vom Holzkohlegrill.',
    bg: 'Най-добрите грил заведения в Халкидики — сувлаки, кюфтета, контосувли, агнешки котлети на скара.',
    ru: 'Лучшие грильные на Халкидики — сувлаки, котлеты, контосувли, бараньи рёбрышки на углях.',
    ro: 'Cele mai bune case de grătar din Halkidiki — souvlaki, chiftele, kontosouvli, coaste de miel la grătar.',
    sr: 'Najbolje roštiljnice na Halkidikiju — suvlaki, ćevapi, kontosouvli, jagnjeći kotleti na ćumuru.',
  },
  brunch: {
    el: 'Τα καλύτερα brunch & πρωινά στη Χαλκιδική — pancakes, eggs benedict, smoothie bowls, specialty coffee.',
    en: 'Best brunch & breakfast spots in Halkidiki — pancakes, eggs benedict, smoothie bowls, specialty coffee.',
    de: 'Die besten Brunch- & Frühstückslokale in Chalkidiki — Pancakes, Eggs Benedict, Smoothie Bowls, Spezialitätenkaffee.',
    bg: 'Най-добрите бранч & закуски в Халкидики — палачинки, яйца Бенедикт, смути боулс, specialty кафе.',
    ru: 'Лучшие бранчи и завтраки на Халкидики — панкейки, яйца Бенедикт, смузи-боулы, кофе.',
    ro: 'Cele mai bune brunch-uri & mic dejunuri din Halkidiki — clătite, ouă Benedict, smoothie bowls, cafea.',
    sr: 'Najbolji brunch & doručak na Halkidikiju — palačinke, jaja Benedict, smoothie bowls, specialty kafa.',
  },
  'beach-bar': {
    el: 'Τα καλύτερα beach bars στη Χαλκιδική — cocktails, DJ sets, sunset parties, θέα θάλασσα.',
    en: 'Best beach bars in Halkidiki — cocktails, DJ sets, sunset parties, sea views.',
    de: 'Die besten Beach Bars in Chalkidiki — Cocktails, DJ-Sets, Sunset-Partys, Meerblick.',
    bg: 'Най-добрите плажни барове в Халкидики — коктейли, DJ сетове, залезни партита, морска гледка.',
    ru: 'Лучшие пляжные бары на Халкидики — коктейли, DJ-сеты, закатные вечеринки, вид на море.',
    ro: 'Cele mai bune beach bars din Halkidiki — cocktail-uri, DJ sets, petreceri la apus, vedere la mare.',
    sr: 'Najbolji beach barovi na Halkidikiju — kokteli, DJ setovi, sunset žurke, pogled na more.',
  },
  cafe: {
    el: 'Οι καλύτερες καφετέριες στη Χαλκιδική — ελληνικός καφές, freddo cappuccino, γλυκά, χαλαρή ατμόσφαιρα.',
    en: 'Best cafés in Halkidiki — Greek coffee, freddo cappuccino, pastries, relaxed atmosphere.',
    de: 'Die besten Cafés in Chalkidiki — griechischer Kaffee, Freddo Cappuccino, Gebäck, entspannte Atmosphäre.',
    bg: 'Най-добрите кафенета в Халкидики — гръцко кафе, freddo cappuccino, сладкиши, спокойна атмосфера.',
    ru: 'Лучшие кафе на Халкидики — греческий кофе, фреддо капучино, выпечка, расслабленная атмосфера.',
    ro: 'Cele mai bune cafenele din Halkidiki — cafea grecească, freddo cappuccino, produse de patiserie.',
    sr: 'Najbolji kafići na Halkidikiju — grčka kafa, freddo cappuccino, poslastice, opuštena atmosfera.',
  },
  bakery: {
    el: 'Τα καλύτερα αρτοποιεία & ζαχαροπλαστεία στη Χαλκιδική — φρέσκο ψωμί, κρουασάν, τούρτες, γλυκά.',
    en: 'Best bakeries & pastry shops in Halkidiki — fresh bread, croissants, cakes, traditional sweets.',
    de: 'Die besten Bäckereien & Konditoreien in Chalkidiki — frisches Brot, Croissants, Torten, traditionelle Süßigkeiten.',
    bg: 'Най-добрите пекарни & сладкарници в Халкидики — пресен хляб, кроасани, торти, традиционни сладкиши.',
    ru: 'Лучшие пекарни и кондитерские на Халкидики — свежий хлеб, круассаны, торты, традиционные сладости.',
    ro: 'Cele mai bune brutării & cofetării din Halkidiki — pâine proaspătă, croissante, torturi, dulciuri tradiționale.',
    sr: 'Najbolje pekare & poslastičarnice na Halkidikiju — svež hleb, kroasani, torte, tradicionalni kolači.',
  },
  souvlaki: {
    el: 'Τα καλύτερα σουβλατζίδικα στη Χαλκιδική — χοιρινό, κοτόπουλο, γύρος, πίτα, πατάτες.',
    en: 'Best souvlaki shops in Halkidiki — pork, chicken, gyros, pita, fries.',
    de: 'Die besten Souvlaki-Läden in Chalkidiki — Schwein, Hähnchen, Gyros, Pita, Pommes.',
    bg: 'Най-добрите сувлаки заведения в Халкидики — свинско, пилешко, гирос, пита, пържени картофи.',
    ru: 'Лучшие сувлаки на Халкидики — свинина, курица, гирос, пита, картофель фри.',
    ro: 'Cele mai bune magazine de souvlaki din Halkidiki — porc, pui, gyros, pita, cartofi prăjiți.',
    sr: 'Najbolje suvlaki radnje na Halkidikiju — svinjetina, piletina, giros, pita, pomfrit.',
  },
  'fine-dining': {
    el: 'Τα καλύτερα fine dining εστιατόρια στη Χαλκιδική — gourmet κουζίνα, εκλεκτά κρασιά, κορυφαία εμπειρία.',
    en: 'Best fine dining restaurants in Halkidiki — gourmet cuisine, select wines, premium experience.',
    de: 'Die besten Fine-Dining-Restaurants in Chalkidiki — Gourmetküche, erlesene Weine, erstklassiges Erlebnis.',
    bg: 'Най-добрите ресторанти за фино хранене в Халкидики — гурме кухня, избрани вина, премиум изживяване.',
    ru: 'Лучшие рестораны высокой кухни на Халкидики — гурме-кухня, избранные вина, премиум-опыт.',
    ro: 'Cele mai bune restaurante fine dining din Halkidiki — bucătărie gourmet, vinuri selecte, experiență premium.',
    sr: 'Najbolji fine dining restorani na Halkidikiju — gurme kuhinja, izabrana vina, premium iskustvo.',
  },
};

/* ── Rich unique content per type (el + en) ───────────────────────── */
const TYPE_CONTENT: Record<string, Record<string, string>> = {
  traditional: {
    el: 'Η Χαλκιδική φημίζεται για την παραδοσιακή ελληνική κουζίνα. Σε αυτά τα εστιατόρια θα βρείτε σπιτικά φαγητά — μουσακά, παστίτσιο, γεμιστά, μπριάμ, κατσικάκι, κοκορέτσι. Πολλά βρίσκονται σε παραδοσιακά χωριά: η Αρναία, ο Παρθενώνας, η παλιά Νικήτη προσφέρουν αυθεντική γαστρονομική εμπειρία με τοπικά υλικά και ελληνική φιλοξενία.',
    en: 'Halkidiki is renowned for its traditional Greek cuisine. At these restaurants you will find homemade dishes — moussaka, pastitsio, gemista, briam, roast goat, kokoretsi. Many are located in traditional villages: Arnaia, Parthenonas, and old Nikiti offer authentic dining experiences with local ingredients and Greek hospitality.',
  },
  seafood: {
    el: 'Φρέσκα ψάρια κατευθείαν από τη θάλασσα! Οι ψαροταβέρνες στη Χαλκιδική σερβίρουν ψάρια ημέρας, χταπόδι σχάρας, γαρίδες, αστακομακαρονάδα. Κορυφαίες τοποθεσίες: Πόρτο Κουφό (φυσικό λιμάνι), Νέος Μαρμαράς, Βουρβουρού, Ουρανούπολη — με θέα τη θάλασσα και γεύσεις Αιγαίου.',
    en: 'Fresh fish straight from the sea! Seafood restaurants in Halkidiki serve the catch of the day, grilled octopus, shrimp, and lobster pasta. Top locations: Porto Koufo (a natural harbour), Neos Marmaras, Vourvourou, Ouranoupoli — with sea views and Aegean flavors.',
  },
  pizza: {
    el: 'Ποιοτικές πιτσαρίες βρίσκονται σε όλη τη Χαλκιδική, ειδικά στα τουριστικά κέντρα — Χανιώτη, Καλλιθέα, Σάρτη. Ξυλόφουρνος, ιταλικές συνταγές, delivery. Ιδανική επιλογή για οικογένειες και γρήγορο γεύμα μετά την παραλία.',
    en: 'Quality pizzerias are found throughout Halkidiki, especially in tourist centres — Hanioti, Kallithea, Sarti. Wood-fired ovens, Italian recipes, delivery available. An ideal choice for families and a quick meal after the beach.',
  },
  grill: {
    el: 'Σουβλάκι, μπιφτέκια, κοντοσούβλι, παϊδάκια — οι ψησταριές της Χαλκιδικής σερβίρουν κρέας στα κάρβουνα με παραδοσιακές συνταγές. Δοκιμάστε τοπικό κοντοσούβλι στην Κασσάνδρα ή γνήσια παϊδάκια στη Σιθωνία.',
    en: 'Souvlaki, burgers, kontosouvli, lamb chops — Halkidiki grill houses serve charcoal-grilled meat with traditional recipes. Try the local kontosouvli in Kassandra or authentic lamb chops in Sithonia.',
  },
  'beach-bar': {
    el: 'Cocktails με τα πόδια στην άμμο! Τα beach bars της Χαλκιδικής είναι θρυλικά — Cabana, Cavo, Ammos, με DJ sets και sunset parties. Από τη Χανιώτη μέχρι τη Σάρτη, κάθε παραλία έχει το δικό της beach bar με μοναδική ατμόσφαιρα.',
    en: 'Cocktails with your feet in the sand! Halkidiki beach bars are legendary — Cabana, Cavo, Ammos, with DJ sets and sunset parties. From Hanioti to Sarti, every beach has its own bar with a unique atmosphere.',
  },
  brunch: {
    el: 'Πρωινό & brunch δίπλα στη θάλασσα — pancakes, eggs benedict, smoothie bowls, καφέ specialities. Τα καλύτερα brunch spots βρίσκονται στη Νικήτη, τη Χανιώτη και τον Νέο Μαρμαρά, ιδανικά για αργό πρωινό στις διακοπές.',
    en: 'Breakfast & brunch by the sea — pancakes, eggs benedict, smoothie bowls, specialty coffees. The best brunch spots are in Nikiti, Hanioti, and Neos Marmaras, perfect for a slow holiday morning.',
  },
  cafe: {
    el: 'Ελληνικός καφές, freddo cappuccino, γλυκά — η καφετέρια είναι κομμάτι της ελληνικής κουλτούρας. Στη Χαλκιδική θα βρείτε καφετέριες με θέα θάλασσα, πλατείες με πλατάνια, και specialty coffee shops σε κάθε χωριό.',
    en: 'Greek coffee, freddo cappuccino, pastries — the café is part of Greek culture. In Halkidiki you will find cafés with sea views, village squares shaded by plane trees, and specialty coffee shops in every town.',
  },
  bakery: {
    el: 'Φρέσκο ψωμί, τυρόπιτες, κρουασάν, τούρτες, παραδοσιακά γλυκά. Τα αρτοποιεία και ζαχαροπλαστεία της Χαλκιδικής ξεκινούν τη δουλειά τους πριν ξημερώσει για να σερβίρουν φρέσκα προϊόντα κάθε πρωί.',
    en: 'Fresh bread, cheese pies, croissants, cakes, traditional sweets. Halkidiki bakeries and pastry shops start work before dawn to serve fresh products every morning.',
  },
  souvlaki: {
    el: 'Χοιρινό, κοτόπουλο, γύρος, πίτα, πατάτες — τα σουβλατζίδικα της Χαλκιδικής είναι η πιο δημοφιλής επιλογή για γρήγορο φαγητό. Δοκιμάστε σε Πολύχρονο, Κασσανδρεία ή Νέα Μουδανιά.',
    en: 'Pork, chicken, gyros, pita, fries — Halkidiki souvlaki shops are the most popular choice for fast food. Try them in Polychrono, Kassandreia, or Nea Moudania.',
  },
  'fine-dining': {
    el: 'Gourmet κουζίνα στη Χαλκιδική — δημιουργικά πιάτα, εκλεκτά κρασιά, κομψή ατμόσφαιρα. Τα fine dining εστιατόρια βρίσκονται κυρίως σε πολυτελή resorts και boutique ξενοδοχεία της Κασσάνδρας και Σιθωνίας.',
    en: 'Gourmet cuisine in Halkidiki — creative dishes, select wines, elegant atmosphere. Fine dining restaurants are mainly found in luxury resorts and boutique hotels in Kassandra and Sithonia.',
  },
};

/* ── Helpers ───────────────────────────────────────────────────────── */

type Props = { params: Promise<{ locale: string; type: string }> };

function getTypeLabel(type: string, locale: string): string {
  return TYPE_LABELS[type]?.[locale] || TYPE_LABELS[type]?.en || type;
}

/* ── Metadata ─────────────────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = await params;
  const typeLabel = getTypeLabel(type, locale);

  const title =
    locale === 'de'
      ? `${typeLabel} in Chalkidiki`
      : locale === 'el'
        ? `${typeLabel} στη Χαλκιδική`
        : `${typeLabel} in Halkidiki`;

  const desc =
    TYPE_META_DESC[type]?.[locale] ||
    TYPE_META_DESC[type]?.en ||
    `${typeLabel} in Halkidiki`;

  const path = `restaurants/category/${type}`;
  const image = ogImageUrl(typeLabel, 'restaurant');

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
      locale,
      siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, path),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeUrl(l, path)])),
        'x-default': localeUrl('el', path),
      },
    },
  };
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default async function Page({ params }: Props) {
  const { locale, type } = await params;
  setRequestLocale(locale);

  const typeLabel = getTypeLabel(type, locale);
  const content = TYPE_CONTENT[type]?.[locale] || TYPE_CONTENT[type]?.en || null;
  const desc = TYPE_META_DESC[type]?.[locale] || TYPE_META_DESC[type]?.en || '';
  const inSuffix = locale === 'el' ? 'στη Χαλκιδική' : locale === 'de' ? 'in Chalkidiki' : 'in Halkidiki';

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{typeLabel} {inSuffix}</h1>
        {desc && <p className="text-gray-600 mb-4">{desc}</p>}
        {content && (
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>
        )}
      </section>
      <RestaurantTypePage />
    </>
  );
}
