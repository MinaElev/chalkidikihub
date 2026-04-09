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
    ? 'Καθημερινή Ζωή στο Άγιο Όρος | Χαλκιδική'
    : 'Daily Life on Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Ανακαλύψτε την καθημερινή ζωή στο Άγιο Όρος: πρόγραμμα μοναχών, προσευχή, εργασία, τι κάνει ο επισκέπτης και η πνευματική εμπειρία.'
    : 'Discover daily life on Mount Athos: monk schedules, prayer, work, what visitors experience, and the spiritual journey.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/daily-life`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/daily-life`])),
    },
  };
}

export default async function DailyLifePage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Καθημερινή Ζωή' : 'Daily Life'}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{isEl ? 'Καθημερινή Ζωή στο Άγιο Όρος' : 'Daily Life on Mount Athos'}</h1>

        <p>
          {isEl
            ? 'Η ζωή στο Άγιο Όρος ακολουθεί έναν ρυθμό που παραμένει σχεδόν αναλλοίωτος εδώ και αιώνες. Βασίζεται σε τέσσερις πυλώνες: προσευχή, εργασία, υπακοή και ταπεινοφροσύνη. Κάθε μέρα ακολουθεί ένα αυστηρό πρόγραμμα που εναλλάσσει τη λατρεία με τη χειρωνακτική εργασία.'
            : 'Life on Mount Athos follows a rhythm that has remained virtually unchanged for centuries. It is built upon four pillars: prayer, work, obedience, and humility. Each day follows a strict schedule that alternates worship with manual labor.'}
        </p>

        <h2>{isEl ? 'Ημερήσιο Πρόγραμμα Μοναχών' : "Monks' Daily Schedule"}</h2>

        <div className="not-prose overflow-hidden rounded-xl border border-gray-200 mb-8">
          <table className="w-full text-sm">
            <thead className="bg-amber-50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">{isEl ? 'Ώρα' : 'Time'}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">{isEl ? 'Δραστηριότητα' : 'Activity'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr><td className="px-4 py-3 font-medium text-amber-800">03:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Όρθρος (πρωινή ακολουθία)' : 'Orthros (morning service)'}</td></tr>
              <tr><td className="px-4 py-3 font-medium text-amber-800">06:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Θεία Λειτουργία' : 'Divine Liturgy'}</td></tr>
              <tr><td className="px-4 py-3 font-medium text-amber-800">08:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Εργασία (διακονήματα)' : 'Work (obediences)'}</td></tr>
              <tr><td className="px-4 py-3 font-medium text-amber-800">13:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Κοινό γεύμα στην τράπεζα' : 'Communal meal in the refectory'}</td></tr>
              <tr><td className="px-4 py-3 font-medium text-amber-800">14:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Απογευματινή εργασία ή προσευχή' : 'Afternoon work or prayer'}</td></tr>
              <tr><td className="px-4 py-3 font-medium text-amber-800">19:00</td><td className="px-4 py-3 text-gray-700">{isEl ? 'Εσπερινός' : 'Vespers'}</td></tr>
            </tbody>
          </table>
        </div>

        <h2>{isEl ? 'Τι Κάνει ο Επισκέπτης' : 'What Visitors Do'}</h2>

        <ul>
          <li>{isEl ? 'Προσκύνηση εικόνων και ιερών λειψάνων' : 'Venerate holy icons and sacred relics'}</li>
          <li>{isEl ? 'Συζητήσεις με μοναχούς για πνευματικά θέματα' : 'Conversations with monks on spiritual topics'}</li>
          <li>{isEl ? 'Περπάτημα σε μονοπάτια μέσα στη φύση' : 'Walking on paths through nature'}</li>
          <li>{isEl ? 'Παρακολούθηση ακολουθιών και λειτουργιών' : 'Attending services and liturgies'}</li>
          <li>{isEl ? 'Βίωση της σιωπής και της ησυχίας της φύσης' : "Experiencing nature's silence and stillness"}</li>
        </ul>

        <h2>{isEl ? 'Πνευματικό Ταξίδι' : 'A Spiritual Journey'}</h2>

        <p>
          {isEl
            ? 'Για πολλούς επισκέπτες, η παραμονή στο Άγιο Όρος αποτελεί ένα βαθύ πνευματικό ταξίδι. Μακριά από τον θόρυβο και τις υποχρεώσεις της σύγχρονης ζωής, το Άγιο Όρος λειτουργεί ως ένα είδος αποτοξίνωσης από τον σύγχρονο κόσμο. Η απλότητα, η σιωπή και η ησυχαστική ατμόσφαιρα φέρνουν τον επισκέπτη σε επαφή με τον εαυτό του και το πνευματικό του βάθος.'
            : 'For many visitors, staying on Mount Athos is a profound spiritual journey. Far from the noise and obligations of modern life, Mount Athos serves as a kind of detox from the contemporary world. The simplicity, silence, and hesychastic atmosphere bring visitors into contact with themselves and their spiritual depth.'}
        </p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/accommodation" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{isEl ? 'Διαμονή' : 'Accommodation'}</span>
        </Link>
        <Link href="/mount-athos/hiking" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <span>{isEl ? 'Ανάβαση στον Άθω' : 'Hiking to the Peak'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isEl ? 'Καθημερινή Ζωή στο Άγιο Όρος' : 'Daily Life on Mount Athos',
        description: isEl
          ? 'Πρόγραμμα μοναχών, τι κάνει ο επισκέπτης και η πνευματική εμπειρία στο Άγιο Όρος.'
          : "Monks' schedule, what visitors do, and the spiritual experience on Mount Athos.",
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        datePublished: '2025-06-01',
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
      })}} />
    </article>
  );
}
