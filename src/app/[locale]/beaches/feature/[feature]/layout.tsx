import type { Metadata } from 'next';
import { localeUrl, ogImageUrl } from '@/lib/seo';

const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const FEATURE_META: Record<string, Record<string, { title: string; desc: string }>> = {
  sandy: {
    el: { title: 'Αμμώδεις Παραλίες Χαλκιδικής', desc: 'Οι καλύτερες αμμώδεις παραλίες στη Χαλκιδική — λεπτή άμμος, τιρκουάζ νερά, ιδανικές για οικογένειες.' },
    en: { title: 'Sandy Beaches in Halkidiki', desc: 'Best sandy beaches in Halkidiki — fine sand, turquoise waters, perfect for families.' },
    de: { title: 'Sandstrände in Chalkidiki', desc: 'Die besten Sandstrände in Chalkidiki — feiner Sand, türkisfarbenes Wasser, perfekt für Familien.' },
    bg: { title: 'Пясъчни плажове в Халкидики', desc: 'Най-добрите пясъчни плажове в Халкидики — фин пясък, тюркоазени води, идеални за семейства.' },
    ru: { title: 'Песчаные пляжи Халкидики', desc: 'Лучшие песчаные пляжи Халкидики — мелкий песок, бирюзовые воды, идеальны для семей.' },
    ro: { title: 'Plaje cu nisip în Halkidiki', desc: 'Cele mai bune plaje cu nisip din Halkidiki — nisip fin, ape turcoaz, perfecte pentru familii.' },
    sr: { title: 'Peščane plaže Halkidikija', desc: 'Najbolje peščane plaže na Halkidikiju — fin pesak, tirkizne vode, idealne za porodice.' },
  },
  pebble: {
    el: { title: 'Παραλίες με Βότσαλο στη Χαλκιδική', desc: 'Βοτσαλωτές παραλίες Χαλκιδικής — κρυστάλλινα νερά, φυσική ομορφιά, ήρεμο περιβάλλον.' },
    en: { title: 'Pebble Beaches in Halkidiki', desc: 'Pebble beaches in Halkidiki — crystal clear waters, natural beauty, peaceful setting.' },
    de: { title: 'Kiesstrände in Chalkidiki', desc: 'Kiesstrände in Chalkidiki — kristallklares Wasser, natürliche Schönheit, ruhige Umgebung.' },
    bg: { title: 'Каменисти плажове в Халкидики', desc: 'Каменисти плажове в Халкидики — кристално чисти води, природна красота.' },
    ru: { title: 'Галечные пляжи Халкидики', desc: 'Галечные пляжи Халкидики — кристально чистые воды, природная красота.' },
    ro: { title: 'Plaje cu pietriș în Halkidiki', desc: 'Plaje cu pietriș în Halkidiki — ape cristalline, frumusețe naturală.' },
    sr: { title: 'Šljunkovite plaže Halkidikija', desc: 'Šljunkovite plaže na Halkidikiju — kristalno čiste vode, prirodna lepota, mirno okruženje.' },
  },
  organized: {
    el: { title: 'Οργανωμένες Παραλίες Χαλκιδικής', desc: 'Οργανωμένες παραλίες με ξαπλώστρες, ομπρέλες, beach bar και ναυαγοσώστη στη Χαλκιδική.' },
    en: { title: 'Organized Beaches in Halkidiki', desc: 'Organized beaches with sunbeds, umbrellas, beach bars and lifeguards in Halkidiki.' },
    de: { title: 'Organisierte Strände in Chalkidiki', desc: 'Organisierte Strände mit Liegen, Sonnenschirmen, Strandbars und Rettungsschwimmern.' },
    bg: { title: 'Организирани плажове в Халкидики', desc: 'Организирани плажове с шезлонги, чадъри, плажни барове и спасители.' },
    ru: { title: 'Организованные пляжи Халкидики', desc: 'Организованные пляжи с шезлонгами, зонтами, пляжными барами и спасателями.' },
    ro: { title: 'Plaje organizate în Halkidiki', desc: 'Plaje organizate cu șezlonguri, umbrele, baruri de plajă și salvamari.' },
    sr: { title: 'Organizovane plaže Halkidikija', desc: 'Organizovane plaže sa ležaljkama, suncobranima, beach barovima i spasiocima na Halkidikiju.' },
  },
  free: {
    el: { title: 'Ελεύθερες Παραλίες Χαλκιδικής', desc: 'Δωρεάν παραλίες χωρίς είσοδο στη Χαλκιδική — φύση, ελευθερία, αυθεντική εμπειρία.' },
    en: { title: 'Free Beaches in Halkidiki', desc: 'Free beaches with no entry fee in Halkidiki — nature, freedom, authentic experience.' },
    de: { title: 'Freie Strände in Chalkidiki', desc: 'Kostenlose Strände ohne Eintritt in Chalkidiki — Natur, Freiheit, authentisches Erlebnis.' },
    bg: { title: 'Безплатни плажове в Халкидики', desc: 'Безплатни плажове без вход в Халкидики — природа, свобода, автентично преживяване.' },
    ru: { title: 'Бесплатные пляжи Халкидики', desc: 'Бесплатные пляжи без входной платы — природа, свобода, подлинный опыт.' },
    ro: { title: 'Plaje gratuite în Halkidiki', desc: 'Plaje gratuite fără taxă de intrare — natură, libertate, experiență autentică.' },
    sr: { title: 'Besplatne plaže Halkidikija', desc: 'Besplatne plaže bez ulaznice na Halkidikiju — priroda, sloboda, autentično iskustvo.' },
  },
  shallowWater: {
    el: { title: 'Παραλίες με Ρηχά Νερά στη Χαλκιδική', desc: 'Ιδανικές παραλίες για παιδιά και οικογένειες με ρηχά, ασφαλή νερά στη Χαλκιδική.' },
    en: { title: 'Shallow Water Beaches in Halkidiki', desc: 'Perfect beaches for children and families with shallow, safe waters in Halkidiki.' },
    de: { title: 'Strände mit flachem Wasser in Chalkidiki', desc: 'Perfekte Strände für Kinder und Familien mit flachem, sicherem Wasser.' },
    bg: { title: 'Плажове с плитка вода в Халкидики', desc: 'Перфектни плажове за деца и семейства с плитки, безопасни води.' },
    ru: { title: 'Пляжи с мелководьем в Халкидики', desc: 'Идеальные пляжи для детей и семей с мелкой безопасной водой.' },
    ro: { title: 'Plaje cu apă puțin adâncă în Halkidiki', desc: 'Plaje perfecte pentru copii și familii cu ape puțin adânci și sigure.' },
    sr: { title: 'Plaže sa plitkom vodom na Halkidikiju', desc: 'Savršene plaže za decu i porodice sa plitkom, bezbednom vodom na Halkidikiju.' },
  },
  waterSports: {
    el: { title: 'Παραλίες με Θαλάσσια Σπορ στη Χαλκιδική', desc: 'Παραλίες για θαλάσσια σπορ — windsurf, jet ski, kayak, SUP, σκι στη Χαλκιδική.' },
    en: { title: 'Water Sports Beaches in Halkidiki', desc: 'Beaches for water sports — windsurf, jet ski, kayak, SUP, skiing in Halkidiki.' },
    de: { title: 'Wassersport-Strände in Chalkidiki', desc: 'Strände für Wassersport — Windsurfen, Jet-Ski, Kajak, SUP, Wasserski.' },
    bg: { title: 'Плажове за водни спортове в Халкидики', desc: 'Плажове за водни спортове — уиндсърф, джет ски, каяк, SUP.' },
    ru: { title: 'Пляжи для водных видов спорта в Халкидики', desc: 'Пляжи для водного спорта — виндсёрфинг, гидроцикл, каяк, SUP.' },
    ro: { title: 'Plaje pentru sporturi nautice în Halkidiki', desc: 'Plaje pentru sporturi nautice — windsurf, jet ski, caiac, SUP.' },
    sr: { title: 'Plaže za vodene sportove na Halkidikiju', desc: 'Plaže za vodene sportove — windsurf, jet ski, kajak, SUP na Halkidikiju.' },
  },
  accessible: {
    el: { title: 'Προσβάσιμες Παραλίες Χαλκιδικής', desc: 'Παραλίες με πρόσβαση για ΑΜΕΑ — ράμπες, ειδικά αμαξίδια θάλασσας στη Χαλκιδική.' },
    en: { title: 'Accessible Beaches in Halkidiki', desc: 'Wheelchair accessible beaches with ramps and sea wheelchairs in Halkidiki.' },
    de: { title: 'Barrierefreie Strände in Chalkidiki', desc: 'Rollstuhlgerechte Strände mit Rampen und Strandrollstühlen.' },
    bg: { title: 'Достъпни плажове в Халкидики', desc: 'Достъпни плажове с рампи и морски инвалидни колички.' },
    ru: { title: 'Доступные пляжи Халкидики', desc: 'Пляжи с доступом для инвалидов — пандусы, морские коляски.' },
    ro: { title: 'Plaje accesibile în Halkidiki', desc: 'Plaje accesibile cu rampe și scaune cu rotile pentru mare.' },
    sr: { title: 'Pristupačne plaže Halkidikija', desc: 'Plaže pristupačne za invalidska kolica sa rampama i morskim kolicima na Halkidikiju.' },
  },
  beachBar: {
    el: { title: 'Παραλίες με Beach Bar στη Χαλκιδική', desc: 'Παραλίες με beach bar — κοκτέιλ, μουσική, ατμόσφαιρα δίπλα στη θάλασσα.' },
    en: { title: 'Beach Bar Beaches in Halkidiki', desc: 'Beaches with beach bars — cocktails, music, atmosphere by the sea.' },
    de: { title: 'Strände mit Beach Bar in Chalkidiki', desc: 'Strände mit Beach Bar — Cocktails, Musik, Atmosphäre am Meer.' },
    bg: { title: 'Плажове с Beach Bar в Халкидики', desc: 'Плажове с плажен бар — коктейли, музика, атмосфера край морето.' },
    ru: { title: 'Пляжи с Beach Bar в Халкидики', desc: 'Пляжи с пляжными барами — коктейли, музыка, атмосфера у моря.' },
    ro: { title: 'Plaje cu Beach Bar în Halkidiki', desc: 'Plaje cu baruri de plajă — cocktailuri, muzică, atmosferă lângă mare.' },
    sr: { title: 'Plaže sa Beach Bar-om na Halkidikiju', desc: 'Plaže sa beach barovima — kokteli, muzika, atmosfera pored mora.' },
  },
  sunbeds: {
    el: { title: 'Παραλίες με Ξαπλώστρες στη Χαλκιδική', desc: 'Παραλίες με ξαπλώστρες και ομπρέλες — άνεση και χαλάρωση στη Χαλκιδική.' },
    en: { title: 'Beaches with Sunbeds in Halkidiki', desc: 'Beaches with sunbeds and umbrellas — comfort and relaxation in Halkidiki.' },
    de: { title: 'Strände mit Liegen in Chalkidiki', desc: 'Strände mit Liegen und Sonnenschirmen — Komfort und Entspannung.' },
    bg: { title: 'Плажове с шезлонги в Халкидики', desc: 'Плажове с шезлонги и чадъри — комфорт и релакс.' },
    ru: { title: 'Пляжи с шезлонгами в Халкидики', desc: 'Пляжи с шезлонгами и зонтами — комфорт и отдых.' },
    ro: { title: 'Plaje cu șezlonguri în Halkidiki', desc: 'Plaje cu șezlonguri și umbrele — confort și relaxare.' },
    sr: { title: 'Plaže sa ležaljkama na Halkidikiju', desc: 'Plaže sa ležaljkama i suncobranima — komfor i opuštanje na Halkidikiju.' },
  },
  lifeguard: {
    el: { title: 'Παραλίες με Ναυαγοσώστη στη Χαλκιδική', desc: 'Ασφαλείς παραλίες με ναυαγοσώστη στη Χαλκιδική — ιδανικές για οικογένειες με παιδιά.' },
    en: { title: 'Lifeguard Beaches in Halkidiki', desc: 'Safe beaches with lifeguards in Halkidiki — ideal for families with children.' },
    de: { title: 'Strände mit Rettungsschwimmer in Chalkidiki', desc: 'Sichere Strände mit Rettungsschwimmern — ideal für Familien mit Kindern.' },
    bg: { title: 'Плажове със спасител в Халкидики', desc: 'Безопасни плажове със спасители — идеални за семейства с деца.' },
    ru: { title: 'Пляжи со спасателями в Халкидики', desc: 'Безопасные пляжи со спасателями — идеальны для семей с детьми.' },
    ro: { title: 'Plaje cu salvamari în Halkidiki', desc: 'Plaje sigure cu salvamari — ideale pentru familii cu copii.' },
    sr: { title: 'Plaže sa spasiocima na Halkidikiju', desc: 'Bezbedne plaže sa spasiocima na Halkidikiju — idealne za porodice sa decom.' },
  },
  nudist: {
    el: { title: 'Παραλίες Γυμνιστών στη Χαλκιδική', desc: 'Παραλίες γυμνιστών στη Χαλκιδική — απομονωμένες, φυσικές, ελεύθερες.' },
    en: { title: 'Nudist Beaches in Halkidiki', desc: 'Nudist beaches in Halkidiki — secluded, natural, free-spirited.' },
    de: { title: 'FKK-Strände in Chalkidiki', desc: 'FKK-Strände in Chalkidiki — abgelegen, natürlich, frei.' },
    bg: { title: 'Нудистки плажове в Халкидики', desc: 'Нудистки плажове в Халкидики — уединени, естествени, свободни.' },
    ru: { title: 'Нудистские пляжи Халкидики', desc: 'Нудистские пляжи Халкидики — уединённые, природные, свободные.' },
    ro: { title: 'Plaje nudiste în Halkidiki', desc: 'Plaje nudiste în Halkidiki — izolate, naturale, libere.' },
    sr: { title: 'Nudističke plaže Halkidikija', desc: 'Nudističke plaže na Halkidikiju — izolovane, prirodne, slobodne.' },
  },
  parking: {
    el: { title: 'Παραλίες με Πάρκινγκ στη Χαλκιδική', desc: 'Παραλίες με εύκολη πρόσβαση και δωρεάν πάρκινγκ στη Χαλκιδική.' },
    en: { title: 'Beaches with Parking in Halkidiki', desc: 'Beaches with easy access and free parking in Halkidiki.' },
    de: { title: 'Strände mit Parkplatz in Chalkidiki', desc: 'Strände mit einfachem Zugang und kostenlosem Parkplatz.' },
    bg: { title: 'Плажове с паркинг в Халкидики', desc: 'Плажове с лесен достъп и безплатен паркинг.' },
    ru: { title: 'Пляжи с парковкой в Халкидики', desc: 'Пляжи с удобным доступом и бесплатной парковкой.' },
    ro: { title: 'Plaje cu parcare în Halkidiki', desc: 'Plaje cu acces ușor și parcare gratuită.' },
    sr: { title: 'Plaže sa parkingom na Halkidikiju', desc: 'Plaže sa lakim pristupom i besplatnim parkingom na Halkidikiju.' },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; feature: string }> }): Promise<Metadata> {
  const { locale, feature } = await params;
  const meta = FEATURE_META[feature]?.[locale] || FEATURE_META[feature]?.en;
  if (!meta) return { title: 'Beaches' };

  const image = ogImageUrl(meta.title, 'beach');
  return {
    title: meta.title,
    description: meta.desc,
    openGraph: {
      title: meta.title, description: meta.desc, type: 'website', locale, siteName: 'Chalkidiki Hub',
      images: [{ url: image, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image', title: meta.title, description: meta.desc, images: [image],
    },
    alternates: {
      canonical: localeUrl(locale, `beaches/feature/${feature}`),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, `beaches/feature/${feature}`)])),
        'x-default': localeUrl('el', `beaches/feature/${feature}`),
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
