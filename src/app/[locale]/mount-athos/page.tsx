import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { Church, MapPin, Users, Bus, BedDouble, Clock, Mountain, BookOpen, ChevronRight } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'el' ? 'Άγιο Όρος - Ο Πλήρης Οδηγός | Χαλκιδική' : 'Mount Athos - Complete Guide | Halkidiki';
  const description = locale === 'el'
    ? 'Όλα όσα πρέπει να ξέρετε για το Άγιο Όρος: μοναστήρια, πώς να πάτε, κανόνες επίσκεψης, διαμονή, ιστορία.'
    : 'Everything you need to know about Mount Athos: monasteries, how to visit, rules, accommodation, history.';
  return {
    title, description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos`])),
    },
  };
}

const GUIDE_SECTIONS = [
  { href: '/mount-athos/monasteries', icon: Church, titleEl: 'Οι 20 Μονές', titleEn: 'The 20 Monasteries', descEl: 'Αναλυτική λίστα όλων των μοναστηριών, ιστορία και εθνικότητα', descEn: 'Complete list of all monasteries, history and nationality' },
  { href: '/mount-athos/how-to-visit', icon: Users, titleEl: 'Πώς να Επισκεφθείτε', titleEn: 'How to Visit', descEl: 'Κανόνες εισόδου, διαμονητήριο, Άβατον, ποιος μπορεί να μπει', descEn: 'Entry rules, permits, Avaton, who can enter' },
  { href: '/mount-athos/getting-there', icon: Bus, titleEl: 'Πώς να Πάτε', titleEn: 'Getting There', descEl: 'Μεταφορές από Θεσσαλονίκη, Ουρανούπολη, πλοία προς Δάφνη', descEn: 'Transport from Thessaloniki, Ouranoupoli, boats to Dafni' },
  { href: '/mount-athos/accommodation', icon: BedDouble, titleEl: 'Διαμονή', titleEn: 'Accommodation', descEl: 'Αρχονταρίκι, ξενώνες μονών, φιλοξενία και κόστος', descEn: 'Archontariki, monastery guesthouses, hospitality and costs' },
  { href: '/mount-athos/daily-life', icon: Clock, titleEl: 'Καθημερινή Ζωή', titleEn: 'Daily Life', descEl: 'Πρόγραμμα μοναχών, τι κάνει ο επισκέπτης, πνευματικό ταξίδι', descEn: 'Monks schedule, what visitors do, spiritual journey' },
  { href: '/mount-athos/hiking', icon: Mountain, titleEl: 'Ανάβαση στον Άθω', titleEn: 'Hiking to the Peak', descEl: 'Κορυφή 2.033 μέτρα, διαδρομή 6-8 ώρες, πρακτικές πληροφορίες', descEn: 'Summit 2,033 meters, 6-8 hour route, practical information' },
  { href: '/mount-athos/history', icon: BookOpen, titleEl: 'Ιστορία & Θρύλοι', titleEn: 'History & Legends', descEl: 'Βυζαντινή κληρονομιά, θαυματουργές εικόνες, διάσημοι μοναχοί', descEn: 'Byzantine heritage, miraculous icons, famous monks' },
];

export default async function MountAthosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEl = locale === 'el';

  return (
    <article>
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 rounded-2xl p-8 md:p-12 text-white mb-8">
        <nav className="flex items-center gap-2 text-sm text-amber-200 mb-4">
          <Link href="/" className="hover:text-white">{isEl ? 'Αρχική' : 'Home'}</Link>
          <ChevronRight className="w-3 h-3" />
          <span>{isEl ? 'Άγιο Όρος' : 'Mount Athos'}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {isEl ? 'Το Άγιο Όρος' : 'Mount Athos'}
        </h1>
        <p className="text-lg text-amber-100 max-w-3xl">
          {isEl
            ? 'Ο πλήρης οδηγός για την Αθωνική Πολιτεία — το σημαντικότερο κέντρο του ορθόδοξου μοναχισμού παγκοσμίως'
            : 'The complete guide to the Athonite State — the most important center of Orthodox monasticism worldwide'}
        </p>
        <div className="flex flex-wrap gap-4 mt-6 text-sm text-amber-200">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {isEl ? 'Χερσόνησος Άθω, Χαλκιδική' : 'Athos Peninsula, Halkidiki'}</span>
          <span className="flex items-center gap-1.5"><Mountain className="w-4 h-4" /> 2.033 m</span>
          <span className="flex items-center gap-1.5"><Church className="w-4 h-4" /> 20 {isEl ? 'Μοναστήρια' : 'Monasteries'}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> ~2.000 {isEl ? 'Μοναχοί' : 'Monks'}</span>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose prose-gray max-w-none mb-10">
        {isEl ? (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Το Άγιο Όρος αποτελεί έναν από τους πιο ιδιαίτερους και πνευματικά σημαντικούς τόπους στον κόσμο. Πρόκειται για μια μοναστική πολιτεία με ιστορία άνω των 1.000 ετών, η οποία βρίσκεται στην τρίτη χερσόνησο της Χαλκιδικής, γνωστή και ως χερσόνησος του Άθω.
            </p>
            <p>
              Συχνά αποκαλείται <strong>«Περιβόλι της Παναγίας»</strong>, καθώς σύμφωνα με την ορθόδοξη παράδοση θεωρείται τόπος αφιερωμένος στην Παναγία. Λειτουργεί ως <strong>Αυτόνομη Μοναστική Πολιτεία</strong> σύμφωνα με το άρθρο 105 του ελληνικού Συντάγματος, με δικούς του κανόνες διοίκησης.
            </p>
            <p>
              Η περιοχή εκτείνεται σε <strong>335 τετραγωνικά χιλιόμετρα</strong>, με το ψηλότερο σημείο να είναι το βουνό Άθως στα <strong>2.033 μέτρα</strong>. Σήμερα φιλοξενεί περίπου <strong>2.000 μοναχούς</strong> από πολλές χώρες.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Mount Athos is one of the most unique and spiritually significant places in the world. It is a monastic state with a history spanning over 1,000 years, located on the third peninsula of Halkidiki, known as the Athos peninsula.
            </p>
            <p>
              Often called <strong>"The Garden of the Virgin Mary"</strong>, it functions as an <strong>Autonomous Monastic State</strong> under Article 105 of the Greek Constitution, with its own governing rules. The area covers <strong>335 square kilometers</strong>, with Mount Athos peak reaching <strong>2,033 meters</strong>. Today it is home to approximately <strong>2,000 monks</strong> from many countries.
            </p>
          </>
        )}
      </div>

      {/* Guide sections grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEl ? 'Οδηγός Αγίου Όρους' : 'Mount Athos Guide'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {GUIDE_SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}
            className="group flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
              <s.icon className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">
                {isEl ? s.titleEl : s.titleEn}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{isEl ? s.descEl : s.descEn}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 mt-1 shrink-0 transition-colors" />
          </Link>
        ))}
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: isEl ? 'Άγιο Όρος' : 'Mount Athos',
        description: isEl ? 'Αυτόνομη Μοναστική Πολιτεία στη Χαλκιδική' : 'Autonomous Monastic State in Halkidiki, Greece',
        geo: { '@type': 'GeoCoordinates', latitude: 40.1572, longitude: 24.3264 },
        isAccessibleForFree: true,
        touristType: 'Pilgrimage',
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Halkidiki, Greece' },
      })}} />
    </article>
  );
}
