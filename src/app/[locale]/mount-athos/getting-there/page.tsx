import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, Bus, Ship, MapPin, Clock, AlertTriangle } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'el'
    ? 'Πώς να Πάτε στο Άγιο Όρος | Χαλκιδική'
    : 'How to Get to Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Αναλυτικές οδηγίες μετακίνησης προς το Άγιο Όρος: από Θεσσαλονίκη στην Ουρανούπολη, πλοίο προς Δάφνη, εναλλακτική είσοδος από Ιερισσό.'
    : 'Detailed transport guide to Mount Athos: from Thessaloniki to Ouranoupoli, boat to Dafni, alternative entry from Ierissos.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/getting-there`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/getting-there`])),
    },
  };
}

export default async function GettingTherePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEl = locale === 'el';

  return (
    <article>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-700">{isEl ? 'Αρχική' : 'Home'}</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/mount-athos" className="hover:text-amber-700">{isEl ? 'Άγιο Όρος' : 'Mount Athos'}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{isEl ? 'Πώς να Πάτε' : 'Getting There'}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {isEl ? 'Πώς να Πάτε στο Άγιο Όρος' : 'How to Get to Mount Athos'}
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {isEl
            ? 'Η πρόσβαση στο Άγιο Όρος γίνεται αποκλειστικά διά θαλάσσης. Δεν υπάρχει χερσαία σύνδεση, καθώς τα σύνορα της μοναστικής πολιτείας φυλάσσονται. Ο κύριος δρόμος περνά μέσω Ουρανούπολης, ενώ η Ιερισσός αποτελεί εναλλακτική πύλη εισόδου.'
            : 'Access to Mount Athos is exclusively by sea. There is no overland connection, as the borders of the monastic state are guarded. The main route goes through Ouranoupoli, while Ierissos serves as an alternative gateway.'}
        </p>

        {/* Step 1: Thessaloniki to Ouranoupoli */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Bus className="w-6 h-6 text-amber-700" />
          {isEl ? '1. Θεσσαλονίκη → Ουρανούπολη' : '1. Thessaloniki → Ouranoupoli'}
        </h2>
        <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-4 py-2 not-prose mb-4 mt-2">
          <Clock className="w-4 h-4" />
          <span>{isEl ? 'Διάρκεια: περίπου 2,5 ώρες' : 'Duration: approximately 2.5 hours'}</span>
        </div>
        <p>
          {isEl
            ? 'Η Ουρανούπολη είναι το τελευταίο χωριό πριν από το Άγιο Όρος και η κύρια αφετηρία των πλοίων. Βρίσκεται περίπου 130 χιλιόμετρα ανατολικά της Θεσσαλονίκης.'
            : 'Ouranoupoli is the last village before Mount Athos and the main departure point for boats. It is located approximately 130 kilometers east of Thessaloniki.'}
        </p>
        <ul>
          <li>
            <strong>{isEl ? 'Αυτοκίνητο:' : 'By car:'}</strong>{' '}
            {isEl
              ? 'Ακολουθήστε την εθνική οδό Θεσσαλονίκης-Μουδανιών και στη συνέχεια τη χερσόνησο της Κασσάνδρας/Άθω. Υπάρχουν χώροι στάθμευσης στην Ουρανούπολη.'
              : 'Follow the Thessaloniki-Moudania highway and then the Kassandra/Athos peninsula road. Parking is available in Ouranoupoli.'}
          </li>
          <li>
            <strong>{isEl ? 'Λεωφορείο (ΚΤΕΛ):' : 'Bus (KTEL):'}</strong>{' '}
            {isEl
              ? 'Υπάρχουν τακτικά δρομολόγια ΚΤΕΛ από τη Θεσσαλονίκη (σταθμός Χαλκιδικής) προς Ουρανούπολη. Συνιστάται κράτηση εκ των προτέρων τους καλοκαιρινούς μήνες.'
              : 'Regular KTEL bus services run from Thessaloniki (Halkidiki bus station) to Ouranoupoli. Advance booking is recommended during summer months.'}
          </li>
          <li>
            <strong>{isEl ? 'Ταξί / Transfer:' : 'Taxi / Transfer:'}</strong>{' '}
            {isEl
              ? 'Ιδιωτικές μεταφορές από Θεσσαλονίκη ή το αεροδρόμιο «Μακεδονία» είναι διαθέσιμες, συνήθως με κόστος 100-150 ευρώ.'
              : 'Private transfers from Thessaloniki or Makedonia Airport are available, typically costing 100-150 euros.'}
          </li>
        </ul>

        {/* Step 2: Ouranoupoli to Dafni */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Ship className="w-6 h-6 text-amber-700" />
          {isEl ? '2. Ουρανούπολη → Δάφνη (Λιμάνι Αγίου Όρους)' : '2. Ouranoupoli → Dafni (Port of Mount Athos)'}
        </h2>
        <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 rounded-lg px-4 py-2 not-prose mb-4 mt-2">
          <Clock className="w-4 h-4" />
          <span>{isEl ? 'Διάρκεια: περίπου 2 ώρες' : 'Duration: approximately 2 hours'}</span>
        </div>
        <p>
          {isEl
            ? 'Η Δάφνη είναι το κεντρικό λιμάνι του Αγίου Όρους και σημείο αποβίβασης για τους περισσότερους επισκέπτες. Το πλοίο σταματά σε αρκετές μονές κατά μήκος της δυτικής ακτής πριν φτάσει στη Δάφνη.'
            : 'Dafni is the main port of Mount Athos and the disembarkation point for most visitors. The boat makes stops at several monasteries along the western coast before reaching Dafni.'}
        </p>
        <ul>
          <li>
            <strong>{isEl ? 'Μεγάλο πλοίο (φέρι):' : 'Large ferry boat:'}</strong>{' '}
            {isEl
              ? 'Αναχωρεί καθημερινά από την Ουρανούπολη, συνήθως στις 09:45. Κάνει ενδιάμεσες στάσεις σε μονές (Δοχειαρίου, Ξενοφώντος, κ.ά.).'
              : 'Departs daily from Ouranoupoli, usually at 09:45. Makes intermediate stops at monasteries (Dochiariou, Xenophontos, etc.).'}
          </li>
          <li>
            <strong>{isEl ? 'Ταχύπλοο:' : 'Speedboat:'}</strong>{' '}
            {isEl
              ? 'Ταχύτερη εναλλακτική (περίπου 1 ώρα) με αυξημένο κόστος. Δεν κάνει πάντα ενδιάμεσες στάσεις.'
              : 'Faster alternative (about 1 hour) at higher cost. Does not always make intermediate stops.'}
          </li>
        </ul>

        {/* Step 3: Within Mount Athos */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <MapPin className="w-6 h-6 text-amber-700" />
          {isEl ? '3. Μετακινήσεις εντός Αγίου Όρους' : '3. Getting Around Mount Athos'}
        </h2>
        <p>
          {isEl
            ? 'Από τη Δάφνη μπορείτε να μετακινηθείτε προς τις μονές με διάφορα μέσα. Οι αποστάσεις μεταξύ μοναστηριών μπορεί να είναι μεγάλες και οι δρόμοι χωματένιοι.'
            : 'From Dafni, you can travel to the monasteries by various means. Distances between monasteries can be significant and roads are often unpaved.'}
        </p>
        <ul>
          <li>
            <strong>{isEl ? 'Λεωφορεία:' : 'Buses:'}</strong>{' '}
            {isEl
              ? 'Μικρά λεωφορεία (μίνι-μπας) συνδέουν τη Δάφνη με τις Καρυές, την πρωτεύουσα του Αγίου Όρους.'
              : 'Small buses (mini-buses) connect Dafni with Karyes, the capital of Mount Athos.'}
          </li>
          <li>
            <strong>{isEl ? 'Μικρά πλοία (αρσανάδες):' : 'Small boats (arsanades):'}</strong>{' '}
            {isEl
              ? 'Ακτοπλοϊκά σκάφη μεταφέρουν επισκέπτες σε μονές κατά μήκος της ακτής.'
              : 'Coastal boats transport visitors to monasteries along the coastline.'}
          </li>
          <li>
            <strong>{isEl ? 'Αγροτικά οχήματα:' : 'Agricultural vehicles:'}</strong>{' '}
            {isEl
              ? 'Ορισμένες μονές χρησιμοποιούν 4x4 αγροτικά οχήματα για τη μεταφορά προσκυνητών σε δύσβατες περιοχές.'
              : 'Some monasteries use 4x4 agricultural vehicles to transport pilgrims in difficult terrain.'}
          </li>
          <li>
            <strong>{isEl ? 'Πεζοπορία:' : 'Hiking:'}</strong>{' '}
            {isEl
              ? 'Πολλοί επισκέπτες προτιμούν να περπατήσουν μεταξύ μοναστηριών. Υπάρχουν σημαδεμένα μονοπάτια, αλλά απαιτείται καλή φυσική κατάσταση.'
              : 'Many visitors prefer to walk between monasteries. There are marked trails, but good physical condition is required.'}
          </li>
        </ul>

        {/* Ierissos alternative */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Ship className="w-6 h-6 text-amber-700" />
          {isEl ? 'Εναλλακτική: Ιερισσός (Ανατολική πλευρά)' : 'Alternative: Ierissos (East Side)'}
        </h2>
        <p>
          {isEl
            ? 'Η Ιερισσός βρίσκεται στην ανατολική πλευρά της χερσονήσου και εξυπηρετεί τις μονές της ανατολικής ακτής. Από εκεί αναχωρούν πλοία προς τη Μεγίστη Λαύρα, τη Μονή Ιβήρων και άλλα μοναστήρια.'
            : 'Ierissos is located on the eastern side of the peninsula and serves the monasteries of the eastern coast. Boats depart from there to the Great Lavra, Iviron Monastery and other monasteries.'}
        </p>
        <ul>
          <li>
            {isEl
              ? 'Ιδανική επιλογή αν θέλετε να επισκεφθείτε μονές στην ανατολική πλευρά.'
              : 'Ideal choice if you want to visit monasteries on the eastern side.'}
          </li>
          <li>
            {isEl
              ? 'Λιγότερο πολυσύχναστη σε σύγκριση με την Ουρανούπολη.'
              : 'Less crowded compared to Ouranoupoli.'}
          </li>
          <li>
            {isEl
              ? 'Απαιτείται ξεχωριστό εισιτήριο πλοίου.'
              : 'Requires a separate boat ticket.'}
          </li>
        </ul>

        {/* Practical tips */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <AlertTriangle className="w-6 h-6 text-amber-700" />
          {isEl ? 'Πρακτικές Συμβουλές' : 'Practical Tips'}
        </h2>
        <ul>
          <li>
            {isEl
              ? 'Κλείστε εισιτήριο πλοίου εκ των προτέρων, ειδικά σε περιόδους αιχμής (Πάσχα, καλοκαίρι, μεγάλες γιορτές).'
              : 'Book your boat ticket in advance, especially during peak periods (Easter, summer, major feast days).'}
          </li>
          <li>
            {isEl
              ? 'Φτάστε στην Ουρανούπολη ένα βράδυ νωρίτερα αν ταξιδεύετε από μακριά.'
              : 'Arrive in Ouranoupoli the evening before if traveling from far away.'}
          </li>
          <li>
            {isEl
              ? 'Έχετε μαζί σας το διαμονητήριο (άδεια εισόδου) — χωρίς αυτό δεν μπορείτε να επιβιβαστείτε.'
              : 'Carry your diamonitirion (entry permit) with you — you cannot board the boat without it.'}
          </li>
          <li>
            {isEl
              ? 'Πάρτε μαζί νερό, σνακ και άνετα παπούτσια πεζοπορίας αν σκοπεύετε να περπατήσετε.'
              : 'Bring water, snacks and comfortable hiking shoes if you plan to walk between monasteries.'}
          </li>
          <li>
            {isEl
              ? 'Το κινητό τηλέφωνο έχει περιορισμένο σήμα σε πολλά σημεία του Αγίου Όρους.'
              : 'Mobile phone signal is limited in many parts of Mount Athos.'}
          </li>
        </ul>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <Link href="/mount-athos/how-to-visit" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          <ChevronLeft className="w-4 h-4" />
          {isEl ? 'Πώς να Επισκεφθείτε' : 'How to Visit'}
        </Link>
        <Link href="/mount-athos/accommodation" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          {isEl ? 'Διαμονή' : 'Accommodation'} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isEl ? 'Πώς να Πάτε στο Άγιο Όρος' : 'How to Get to Mount Athos',
        description: isEl
          ? 'Αναλυτικές οδηγίες μετακίνησης προς το Άγιο Όρος από Θεσσαλονίκη, Ουρανούπολη και Ιερισσό.'
          : 'Detailed transport guide to Mount Athos from Thessaloniki, Ouranoupoli and Ierissos.',
        author: { '@type': 'Organization', name: 'Chalkidiki Hub' },
        publisher: { '@type': 'Organization', name: 'Chalkidiki Hub', url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/${locale}/mount-athos/getting-there`,
      })}} />
    </article>
  );
}
