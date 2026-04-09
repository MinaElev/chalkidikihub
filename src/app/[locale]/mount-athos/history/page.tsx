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
    ? 'Ιστορία & Θρύλοι του Αγίου Όρους | Χαλκιδική'
    : 'History & Legends of Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Η ιστορία του Αγίου Όρους, βυζαντινή κληρονομιά, θαυματουργές εικόνες, διάσημοι μοναχοί και γιατί είναι μοναδικό.'
    : 'The history of Mount Athos, Byzantine heritage, miraculous icons, famous monks, and why it is unique.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/history`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/history`])),
    },
  };
}

export default async function HistoryPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Ιστορία & Θρύλοι' : 'History & Legends'}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{isEl ? 'Ιστορία & Θρύλοι του Αγίου Όρους' : 'History & Legends of Mount Athos'}</h1>

        <h2>{isEl ? 'Γιατί το Άγιο Όρος Είναι Σημαντικό' : 'Why Mount Athos Matters'}</h2>

        <p>
          {isEl
            ? 'Το Άγιο Όρος είναι το αρχαιότερο εν λειτουργία μοναστικό κέντρο στον κόσμο. Η μοναστική ζωή εδώ λειτουργεί αδιάλειπτα από τον 10ο αιώνα, κάνοντάς το ένα ζωντανό μνημείο της βυζαντινής παράδοσης. Τα μοναστήρια φυλάσσουν ανεκτίμητα χειρόγραφα, εικόνες και κειμήλια ηλικίας άνω των 1.000 ετών.'
            : 'Mount Athos is the oldest continuously operating monastic center in the world. Monastic life here has continued uninterrupted since the 10th century, making it a living monument to Byzantine tradition. The monasteries safeguard priceless manuscripts, icons, and relics over 1,000 years old.'}
        </p>

        <p>
          {isEl
            ? 'Ο πολιτιστικός πλούτος είναι τεράστιος: βιβλιοθήκες με σπάνια χειρόγραφα, βυζαντινές τοιχογραφίες, χρυσοκέντητα άμφια και λειτουργικά σκεύη που αντιπροσωπεύουν αιώνες τέχνης και πίστης.'
            : 'The cultural wealth is immense: libraries with rare manuscripts, Byzantine frescoes, gold-embroidered vestments, and liturgical vessels representing centuries of art and faith.'}
        </p>

        <h2>{isEl ? 'Μυστήρια & Θρύλοι' : 'Mysteries & Legends'}</h2>

        <ul>
          <li>
            <strong>{isEl ? 'Θαυματουργές εικόνες' : 'Miraculous icons'}</strong> —{' '}
            {isEl
              ? 'Πολλά μοναστήρια φυλάσσουν εικόνες στις οποίες αποδίδονται θαύματα, όπως η Παναγία η Τριχερούσα και η Παναγία η Πορταΐτισσα.'
              : 'Many monasteries house icons attributed with miracles, such as the Panagia Tricherousa and the Panagia Portaitissa.'}
          </li>
          <li>
            <strong>{isEl ? 'Ερημίτες σε σπηλιές' : 'Hermits in caves'}</strong> —{' '}
            {isEl
              ? 'Ακόμα και σήμερα, ασκητές ζουν σε απρόσιτες σπηλιές στους βράχους της χερσονήσου, ακολουθώντας την αρχαία παράδοση της ερημιτικής ζωής.'
              : 'Even today, ascetics live in inaccessible caves on the cliffs of the peninsula, following the ancient tradition of hermitic life.'}
          </li>
          <li>
            <strong>{isEl ? 'Θαύματα & Προφητείες' : 'Miracles & Prophecies'}</strong> —{' '}
            {isEl
              ? 'Αναρίθμητες αφηγήσεις θαυμάτων και προφητειών συνδέονται με το Άγιο Όρος, τρέφοντας τον μύθο και τη μυστική του αύρα.'
              : 'Countless accounts of miracles and prophecies are connected to Mount Athos, feeding its myth and mystical aura.'}
          </li>
        </ul>

        <h2>{isEl ? 'Διάσημοι Μοναχοί' : 'Famous Monks'}</h2>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          {[
            {
              name: isEl ? 'Γέροντας Παΐσιος ο Αγιορείτης' : 'Elder Paisios the Athonite',
              desc: isEl
                ? 'Ένας από τους πιο αγαπημένους γέροντες του 20ού αιώνα, γνωστός για τη σοφία, το χιούμορ και τα χαρίσματά του.'
                : 'One of the most beloved elders of the 20th century, known for his wisdom, humor, and spiritual gifts.',
            },
            {
              name: isEl ? 'Γέροντας Ιωσήφ ο Ησυχαστής' : 'Elder Joseph the Hesychast',
              desc: isEl
                ? 'Μεγάλος ασκητής και δάσκαλος της νοεράς προσευχής, του οποίου η επιρροή διαμόρφωσε ολόκληρη γενιά μοναχών.'
                : 'A great ascetic and teacher of the prayer of the heart, whose influence shaped an entire generation of monks.',
            },
            {
              name: isEl ? 'Άγιος Σιλουανός ο Αθωνίτης' : 'Saint Silouan the Athonite',
              desc: isEl
                ? 'Ρώσος μοναχός που αγιοποιήθηκε, γνωστός για τα γραπτά του περί ταπείνωσης και αγάπης.'
                : 'A Russian monk who was canonized, known for his writings on humility and love.',
            },
          ].map(m => (
            <div key={m.name} className="bg-amber-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{m.desc}</p>
            </div>
          ))}
        </div>

        <h2>{isEl ? 'Γιατί Είναι Μοναδικό' : 'Why It Is Unique'}</h2>

        <p>
          {isEl
            ? 'Το Άγιο Όρος λειτουργεί αδιάλειπτα από τον 10ο αιώνα, με δική του αυτοδιοίκηση, και παραμένει το πνευματικό κέντρο της Ορθοδοξίας. Εδώ συνεχίζεται η αυθεντική μοναστική ζωή όπως ακριβώς βιωνόταν στο Βυζάντιο. Για πολλούς ανθρώπους, αποτελεί έναν από τους πιο ιερούς τόπους στον πλανήτη.'
            : 'Mount Athos has operated continuously since the 10th century, with its own self-governance, and remains the spiritual center of Orthodoxy. Here, authentic monastic life continues exactly as it was experienced in Byzantium. For many people, it is one of the holiest places on the planet.'}
        </p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/hiking" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{isEl ? 'Ανάβαση στον Άθω' : 'Hiking to the Peak'}</span>
        </Link>
        <div />
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isEl ? 'Ιστορία & Θρύλοι του Αγίου Όρους' : 'History & Legends of Mount Athos',
        description: isEl
          ? 'Η ιστορία, οι θρύλοι και η σημασία του Αγίου Όρους.'
          : 'The history, legends, and significance of Mount Athos.',
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        datePublished: '2025-06-01',
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
      })}} />
    </article>
  );
}
