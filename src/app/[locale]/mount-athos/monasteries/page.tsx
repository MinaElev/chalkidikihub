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
    ? 'Οι 20 Μονές του Αγίου Όρους | Χαλκιδική'
    : 'The 20 Monasteries of Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Πλήρης λίστα και των 20 μοναστηριών του Αγίου Όρους κατά σειρά ιεραρχίας, με πληροφορίες για σκήτες, κελιά και καλύβες.'
    : 'Complete list of all 20 monasteries of Mount Athos in hierarchical order, with information about sketes, cells and hermitages.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/monasteries`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/monasteries`])),
    },
  };
}

const MONASTERIES = [
  { rank: 1, el: 'Μεγίστης Λαύρας', en: 'Great Lavra', founded: 963, nation: 'el' },
  { rank: 2, el: 'Βατοπαιδίου', en: 'Vatopedi', founded: 972, nation: 'el' },
  { rank: 3, el: 'Ιβήρων', en: 'Iviron', founded: 976, nation: 'el' },
  { rank: 4, el: 'Χιλανδαρίου', en: 'Chilandariou', founded: 1198, nation: 'rs' },
  { rank: 5, el: 'Διονυσίου', en: 'Dionysiou', founded: 1375, nation: 'el' },
  { rank: 6, el: 'Κουτλουμουσίου', en: 'Koutloumousiou', founded: 1169, nation: 'el' },
  { rank: 7, el: 'Παντοκράτορος', en: 'Pantokratoros', founded: 1363, nation: 'el' },
  { rank: 8, el: 'Ξηροποτάμου', en: 'Xeropotamou', founded: 956, nation: 'el' },
  { rank: 9, el: 'Ζωγράφου', en: 'Zografou', founded: 971, nation: 'bg' },
  { rank: 10, el: 'Δοχειαρίου', en: 'Dochiariou', founded: 1045, nation: 'el' },
  { rank: 11, el: 'Καρακάλου', en: 'Karakalou', founded: 1070, nation: 'el' },
  { rank: 12, el: 'Φιλοθέου', en: 'Philotheou', founded: 992, nation: 'el' },
  { rank: 13, el: 'Σίμωνος Πέτρας', en: 'Simonos Petras', founded: 1257, nation: 'el' },
  { rank: 14, el: 'Αγίου Παύλου', en: 'Agiou Pavlou', founded: 934, nation: 'el' },
  { rank: 15, el: 'Σταυρονικήτα', en: 'Stavronikita', founded: 1541, nation: 'el' },
  { rank: 16, el: 'Ξενοφώντος', en: 'Xenofontos', founded: 998, nation: 'el' },
  { rank: 17, el: 'Γρηγορίου', en: 'Gregoriou', founded: 1345, nation: 'el' },
  { rank: 18, el: 'Εσφιγμένου', en: 'Esphigmenou', founded: 1001, nation: 'el' },
  { rank: 19, el: 'Αγίου Παντελεήμονος', en: 'Agiou Panteleimonos', founded: 1169, nation: 'ru' },
  { rank: 20, el: 'Κωνσταμονίτου', en: 'Konstamonitou', founded: 1080, nation: 'el' },
] as const;

function nationLabel(code: string, isEl: boolean) {
  const map: Record<string, [string, string]> = {
    el: ['Ελληνική', 'Greek'],
    rs: ['Σερβική', 'Serbian'],
    bg: ['Βουλγαρική', 'Bulgarian'],
    ru: ['Ρωσική', 'Russian'],
  };
  const entry = map[code];
  return entry ? (isEl ? entry[0] : entry[1]) : '';
}

export default async function MonasteriesPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Μοναστήρια' : 'Monasteries'}</span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {isEl ? 'Οι 20 Μονές του Αγίου Όρους' : 'The 20 Monasteries of Mount Athos'}
      </h1>

      {/* Intro */}
      <div className="prose prose-gray max-w-none mb-10">
        {isEl ? (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Στο Άγιο Όρος λειτουργούν <strong>ακριβώς 20 μοναστήρια</strong> — ούτε ένα περισσότερο, ούτε ένα λιγότερο. Ο αριθμός αυτός είναι κατοχυρωμένος στον Καταστατικό Χάρτη του Αγίου Όρους και δεν μπορεί να αυξηθεί ή να μειωθεί. Κάθε μοναστήρι κατέχει μια θέση στην ιεραρχία που καθορίστηκε αιώνες πριν.
            </p>
            <p>
              Από τα 20 μοναστήρια, τα <strong>17 είναι ελληνικά</strong>, ένα είναι <strong>ρωσικό</strong> (Αγίου Παντελεήμονος), ένα <strong>σερβικό</strong> (Χιλανδαρίου) και ένα <strong>βουλγαρικό</strong> (Ζωγράφου). Όλα μαζί αποτελούν την Ιερά Κοινότητα, το κεντρικό διοικητικό σώμα της Αθωνικής Πολιτείας, με έδρα τις Καρυές.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 leading-relaxed">
              Mount Athos is home to <strong>exactly 20 monasteries</strong> — no more, no less. This number is enshrined in the Constitutional Charter of Mount Athos and cannot be increased or decreased. Each monastery holds a position in the hierarchy that was determined centuries ago.
            </p>
            <p>
              Of the 20 monasteries, <strong>17 are Greek</strong>, one is <strong>Russian</strong> (Agiou Panteleimonos), one is <strong>Serbian</strong> (Chilandariou), and one is <strong>Bulgarian</strong> (Zografou). Together they form the Holy Community, the central governing body of the Athonite State, headquartered in Karyes.
            </p>
          </>
        )}
      </div>

      {/* Monasteries table */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {isEl ? 'Πλήρης Κατάταξη' : 'Complete Ranking'}
      </h2>
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-amber-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 w-12">#</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                {isEl ? 'Μοναστήρι' : 'Monastery'}
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                {isEl ? 'Ίδρυση' : 'Founded'}
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                {isEl ? 'Εθνικότητα' : 'Nationality'}
              </th>
            </tr>
          </thead>
          <tbody>
            {MONASTERIES.map((m) => (
              <tr key={m.rank} className="border-t border-gray-100 hover:bg-amber-50/50 transition-colors">
                <td className="px-4 py-3 text-gray-500 font-medium">{m.rank}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{isEl ? m.el : m.en}</div>
                  <div className="text-xs text-gray-400 sm:hidden">
                    {m.founded} &middot; {nationLabel(m.nation, isEl)}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{m.founded}</td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                  {m.nation !== 'el' ? (
                    <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      {nationLabel(m.nation, isEl)}
                    </span>
                  ) : (
                    nationLabel(m.nation, isEl)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other monastic institutions */}
      <div className="prose prose-gray max-w-none mb-10">
        <h2>{isEl ? 'Άλλα Μοναστικά Ιδρύματα' : 'Other Monastic Institutions'}</h2>
        {isEl ? (
          <>
            <p>
              Εκτός από τα 20 κυρίαρχα μοναστήρια, στο Άγιο Όρος υπάρχουν και πολλά άλλα μοναστικά ιδρύματα που υπάγονται στα μοναστήρια:
            </p>
            <ul>
              <li><strong>Σκήτες:</strong> Μικρότερες μοναστικές κοινότητες που εξαρτώνται από κάποιο μοναστήρι. Υπάρχουν 12 σκήτες, ορισμένες με κοινοβιακή οργάνωση και δικό τους ναό.</li>
              <li><strong>Κελιά:</strong> Μεμονωμένα κτίσματα με παρεκκλήσι, όπου ζουν μικρές ομάδες μοναχών (συνήθως 2-6). Ανήκουν σε κάποιο μοναστήρι και παραχωρούνται εφ' όρου ζωής.</li>
              <li><strong>Καλύβες:</strong> Απλούστερες κατοικίες μοναχών, συχνά χωρίς παρεκκλήσι. Συγκεντρώνονται σε ομάδες που σχηματίζουν σκήτες.</li>
              <li><strong>Ησυχαστήρια:</strong> Απομονωμένα καταφύγια για μοναχούς που αφιερώνονται αποκλειστικά στην προσευχή και την ησυχία. Βρίσκονται σε δυσπρόσιτα σημεία, ακόμη και σε σπηλιές.</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              Besides the 20 sovereign monasteries, Mount Athos is home to many other monastic institutions that are dependent on the monasteries:
            </p>
            <ul>
              <li><strong>Sketes:</strong> Smaller monastic communities dependent on a monastery. There are 12 sketes, some with a communal organization and their own church.</li>
              <li><strong>Kellia (Cells):</strong> Individual buildings with a chapel where small groups of monks live (usually 2-6). They belong to a monastery and are granted for the lifetime of the monks.</li>
              <li><strong>Kalyves (Huts):</strong> Simpler monk dwellings, often without a chapel. They are grouped together to form sketes.</li>
              <li><strong>Hesychasteria (Hermitages):</strong> Isolated retreats for monks devoted exclusively to prayer and silence. They are found in remote locations, sometimes even in caves.</li>
            </ul>
          </>
        )}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-10">
        <Link href="/mount-athos" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-amber-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {isEl ? 'Άγιο Όρος' : 'Mount Athos'}
        </Link>
        <Link href="/mount-athos/how-to-visit" className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
          {isEl ? 'Πώς να Επισκεφθείτε' : 'How to Visit'}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: isEl ? 'Οι 20 Μονές του Αγίου Όρους' : 'The 20 Monasteries of Mount Athos',
        description: isEl
          ? 'Πλήρης λίστα των 20 μοναστηριών του Αγίου Όρους κατά σειρά ιεραρχίας'
          : 'Complete list of the 20 monasteries of Mount Athos in hierarchical order',
        numberOfItems: 20,
        itemListElement: MONASTERIES.map(m => ({
          '@type': 'ListItem',
          position: m.rank,
          item: {
            '@type': 'Monastery',
            name: isEl ? m.el : m.en,
            foundingDate: String(m.founded),
          },
        })),
      })}} />
    </article>
  );
}
