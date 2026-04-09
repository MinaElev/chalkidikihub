import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'el'
    ? 'Πώς να Επισκεφθείτε το Άγιο Όρος | Χαλκιδική'
    : 'How to Visit Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Κανόνες επίσκεψης Αγίου Όρους: Άβατον, διαμονητήριο, ποιος μπορεί να μπει, πρόσβαση μέσω Ουρανούπολης.'
    : 'Mount Athos visiting rules: Avaton, Diamonitirion permit, who can enter, access via Ouranoupoli.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/how-to-visit`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/how-to-visit`])),
    },
  };
}

export default async function HowToVisitPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Πώς να Επισκεφθείτε' : 'How to Visit'}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {isEl ? 'Πώς να Επισκεφθείτε το Άγιο Όρος' : 'How to Visit Mount Athos'}
      </h1>

      <div className="prose prose-gray max-w-none mb-10">
        {isEl ? (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Η επίσκεψη στο Άγιο Όρος δεν είναι σαν κάθε άλλο ταξίδι. Απαιτεί <strong>προγραμματισμό εβδομάδων</strong>, ειδική άδεια εισόδου και τήρηση αυστηρών κανόνων που ισχύουν εδώ και αιώνες.
            </p>

            {/* Who can enter */}
            <h2>Ποιος Μπορεί να Επισκεφθεί</h2>
            <p>
              Η είσοδος στο Άγιο Όρος επιτρέπεται <strong>αποκλειστικά σε άνδρες</strong> που έχουν συμπληρώσει το <strong>18ο έτος</strong> της ηλικίας τους. Δεν υπάρχει εξαίρεση σε αυτόν τον κανόνα — ισχύει ανεξαρτήτως θρησκεύματος ή εθνικότητας.
            </p>

            {/* Avaton */}
            <h2>Το Άβατον</h2>
            <p>
              Το <strong>Άβατον</strong> είναι η απαγόρευση εισόδου γυναικών στο Άγιο Όρος. Ισχύει εδώ και περίπου <strong>1.000 χρόνια</strong> (από τον 10ο-11ο αιώνα) και είναι κατοχυρωμένο τόσο στον Καταστατικό Χάρτη του Αγίου Όρους όσο και στο ελληνικό Σύνταγμα. Η παραβίαση του Αβάτου αποτελεί ποινικό αδίκημα.
            </p>

            {/* Diamonitirion */}
            <h2>Διαμονητήριο (Άδεια Εισόδου)</h2>
            <p>
              Για να εισέλθει κανείς στο Άγιο Όρος χρειάζεται ειδική άδεια που ονομάζεται <strong>Διαμονητήριο</strong>. Η κράτηση γίνεται μέσω του <strong>Γραφείου Προσκυνητών του Αγίου Όρους</strong> στη Θεσσαλονίκη ή ηλεκτρονικά. Συνιστάται να κάνετε κράτηση <strong>τουλάχιστον 2-4 εβδομάδες νωρίτερα</strong>, ειδικά τους καλοκαιρινούς μήνες και τις περιόδους μεγάλων εορτών.
            </p>
            <ul>
              <li><strong>Ορθόδοξοι Χριστιανοί:</strong> Έως 100 επισκέπτες ημερησίως</li>
              <li><strong>Μη Ορθόδοξοι:</strong> Έως 10 επισκέπτες ημερησίως</li>
              <li><strong>Διάρκεια:</strong> Το τυπικό διαμονητήριο ισχύει για 4 ημέρες και 3 διανυκτερεύσεις</li>
              <li><strong>Κόστος:</strong> Περίπου 25 ευρώ (εκδίδεται στην Ουρανούπολη)</li>
            </ul>

            {/* How to get there */}
            <h2>Πρόσβαση: Ουρανούπολη - Δάφνη</h2>
            <p>
              Η είσοδος στο Άγιο Όρος γίνεται <strong>αποκλειστικά δια θαλάσσης</strong>. Το σημείο αναχώρησης είναι η <strong>Ουρανούπολη</strong>, ένα μικρό παραθαλάσσιο χωριό στο τέλος του οδικού δικτύου της Χαλκιδικής. Από εκεί αναχωρεί το πλοίο (φέρι) προς τη <strong>Δάφνη</strong>, το μοναδικό λιμάνι εισόδου.
            </p>
            <ul>
              <li>Το πλοίο αναχωρεί κάθε πρωί (συνήθως στις 9:45)</li>
              <li>Η διαδρομή διαρκεί περίπου 2 ώρες</li>
              <li>Κατά τη διαδρομή, το πλοίο κάνει στάσεις σε διάφορα μοναστήρια κατά μήκος της ακτογραμμής</li>
            </ul>

            {/* What to bring */}
            <h2>Τι να Πάρετε Μαζί σας</h2>
            <ul>
              <li>Ταυτότητα ή διαβατήριο</li>
              <li>Άνετα ρούχα — απαγορεύονται τα κοντά παντελόνια και τα αμάνικα</li>
              <li>Καλά παπούτσια πεζοπορίας</li>
              <li>Νερό, βασικά τρόφιμα, φαρμακείο πρώτων βοηθειών</li>
              <li>Φακός — πολλά μοναστήρια δεν έχουν πλήρη φωτισμό</li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Visiting Mount Athos is not like any other trip. It requires <strong>weeks of planning</strong>, a special entry permit, and strict observance of rules that have been in place for centuries.
            </p>

            {/* Who can enter */}
            <h2>Who Can Visit</h2>
            <p>
              Entry to Mount Athos is permitted <strong>exclusively to men</strong> who are at least <strong>18 years old</strong>. There are no exceptions to this rule — it applies regardless of religion or nationality.
            </p>

            {/* Avaton */}
            <h2>The Avaton</h2>
            <p>
              The <strong>Avaton</strong> is the prohibition of women from entering Mount Athos. It has been in effect for approximately <strong>1,000 years</strong> (since the 10th-11th century) and is enshrined in both the Constitutional Charter of Mount Athos and the Greek Constitution. Violating the Avaton is a criminal offense.
            </p>

            {/* Diamonitirion */}
            <h2>Diamonitirion (Entry Permit)</h2>
            <p>
              To enter Mount Athos, you need a special permit called the <strong>Diamonitirion</strong>. Reservations are made through the <strong>Mount Athos Pilgrims' Bureau</strong> in Thessaloniki or online. It is recommended to book <strong>at least 2-4 weeks in advance</strong>, especially during summer months and major feast days.
            </p>
            <ul>
              <li><strong>Orthodox Christians:</strong> Up to 100 visitors per day</li>
              <li><strong>Non-Orthodox:</strong> Up to 10 visitors per day</li>
              <li><strong>Duration:</strong> The standard permit is valid for 4 days and 3 nights</li>
              <li><strong>Cost:</strong> Approximately 25 euros (issued in Ouranoupoli)</li>
            </ul>

            {/* How to get there */}
            <h2>Access: Ouranoupoli to Dafni</h2>
            <p>
              Entry to Mount Athos is <strong>exclusively by sea</strong>. The departure point is <strong>Ouranoupoli</strong>, a small seaside village at the end of Halkidiki's road network. From there, a ferry departs to <strong>Dafni</strong>, the sole entry port.
            </p>
            <ul>
              <li>The ferry departs every morning (usually at 9:45 AM)</li>
              <li>The journey takes approximately 2 hours</li>
              <li>Along the way, the ferry stops at various monasteries along the coastline</li>
            </ul>

            {/* What to bring */}
            <h2>What to Bring</h2>
            <ul>
              <li>ID card or passport</li>
              <li>Comfortable clothing — shorts and sleeveless tops are prohibited</li>
              <li>Good hiking shoes</li>
              <li>Water, basic food supplies, first-aid kit</li>
              <li>Flashlight — many monasteries do not have full lighting</li>
            </ul>
          </>
        )}
      </div>

      {/* Important notice box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10">
        <h3 className="font-bold text-amber-900 mb-2">
          {isEl ? 'Σημαντική Σημείωση' : 'Important Note'}
        </h3>
        <p className="text-sm text-amber-800">
          {isEl
            ? 'Το Άγιο Όρος είναι τόπος λατρείας και προσευχής. Οι επισκέπτες καλούνται να σέβονται την ησυχία, τους κανόνες των μοναστηριών και τον μοναστικό τρόπο ζωής. Η φωτογράφιση και η βιντεοσκόπηση επιτρέπονται μόνο σε εξωτερικούς χώρους, εκτός αν δοθεί ρητή άδεια.'
            : 'Mount Athos is a place of worship and prayer. Visitors are expected to respect the silence, monastery rules, and the monastic way of life. Photography and video recording are only allowed in exterior areas unless explicit permission is given.'}
        </p>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-10">
        <Link href="/mount-athos/monasteries" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {isEl ? 'Μοναστήρια' : 'Monasteries'}
        </Link>
        <Link href="/mount-athos/getting-there" className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
          {isEl ? 'Πώς να Πάτε' : 'Getting There'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: isEl ? 'Ποιος μπορεί να επισκεφθεί το Άγιο Όρος;' : 'Who can visit Mount Athos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isEl
                ? 'Μόνο άνδρες άνω των 18 ετών μπορούν να εισέλθουν στο Άγιο Όρος.'
                : 'Only men aged 18 and over can enter Mount Athos.',
            },
          },
          {
            '@type': 'Question',
            name: isEl ? 'Πώς εκδίδεται το διαμονητήριο;' : 'How do I get a Diamonitirion?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isEl
                ? 'Μέσω του Γραφείου Προσκυνητών Αγίου Όρους στη Θεσσαλονίκη ή ηλεκτρονικά, τουλάχιστον 2-4 εβδομάδες νωρίτερα.'
                : 'Through the Mount Athos Pilgrims\' Bureau in Thessaloniki or online, at least 2-4 weeks in advance.',
            },
          },
          {
            '@type': 'Question',
            name: isEl ? 'Πόσοι επισκέπτες επιτρέπονται ημερησίως;' : 'How many visitors are allowed per day?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: isEl
                ? '100 Ορθόδοξοι Χριστιανοί και 10 μη Ορθόδοξοι ημερησίως.'
                : '100 Orthodox Christians and 10 non-Orthodox visitors per day.',
            },
          },
        ],
      })}} />
    </article>
  );
}
