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
    ? 'Ανάβαση στην Κορυφή του Άθω | Χαλκιδική'
    : 'Climbing Mount Athos Peak | Halkidiki';
  const description = locale === 'el'
    ? 'Ανεβείτε στην κορυφή του Άθω στα 2.033 μέτρα: διαδρομή, διάρκεια 6-8 ώρες, συμβουλές και τι να περιμένετε.'
    : 'Climb to the peak of Mount Athos at 2,033 meters: route, 6-8 hour duration, tips, and what to expect.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/hiking`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/hiking`])),
    },
  };
}

export default async function HikingPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Ανάβαση στον Άθω' : 'Hiking to the Peak'}</span>
      </nav>

      {/* Content */}
      <div className="prose prose-gray max-w-none">
        <h1>{isEl ? 'Ανάβαση στην Κορυφή του Άθω' : 'Climbing Mount Athos Peak'}</h1>

        <p>
          {isEl
            ? 'Η ανάβαση στην κορυφή του Άθω, στα 2.033 μέτρα, αποτελεί μία από τις πιο εντυπωσιακές πεζοπορίες στην Ελλάδα. Η θέα από την κορυφή εκτείνεται σε ολόκληρο το Αιγαίο, ενώ η εμπειρία συνδυάζει τη φυσική πρόκληση με τη βαθιά πνευματικότητα του τόπου.'
            : 'The ascent to the peak of Mount Athos, at 2,033 meters, is one of the most impressive hikes in Greece. The view from the summit stretches across the entire Aegean Sea, while the experience combines physical challenge with the deep spirituality of the place.'}
        </p>

        {/* Quick facts */}
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          {[
            { label: isEl ? 'Υψόμετρο' : 'Altitude', value: '2.033 m' },
            { label: isEl ? 'Διάρκεια' : 'Duration', value: isEl ? '6-8 ώρες' : '6-8 hours' },
            { label: isEl ? 'Δυσκολία' : 'Difficulty', value: isEl ? 'Υψηλή' : 'High' },
            { label: isEl ? 'Αφετηρία' : 'Starting point', value: isEl ? 'Μ. Αγ. Παύλου' : 'Agios Pavlos Mon.' },
          ].map(f => (
            <div key={f.label} className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide">{f.label}</div>
              <div className="text-lg font-bold text-amber-900 mt-1">{f.value}</div>
            </div>
          ))}
        </div>

        <h2>{isEl ? 'Η Διαδρομή' : 'The Route'}</h2>

        <p>
          {isEl
            ? 'Η πιο συνηθισμένη αφετηρία είναι η Μονή Αγίου Παύλου, η οποία βρίσκεται στη νοτιοδυτική πλευρά της χερσονήσου. Από εκεί, το μονοπάτι ανεβαίνει σταδιακά μέσα από πυκνά δάση καστανιάς και οξιάς, περνώντας από το εκκλησάκι της Παναγίας και τελικά φτάνει στην κορυφή, όπου βρίσκεται ο ναός της Μεταμορφώσεως του Σωτήρος.'
            : 'The most common starting point is the Monastery of Agios Pavlos (Saint Paul), located on the southwestern side of the peninsula. From there, the path climbs gradually through dense chestnut and beech forests, passing the small chapel of the Virgin Mary, and ultimately reaches the summit where the Church of the Transfiguration of the Savior stands.'}
        </p>

        <h2>{isEl ? 'Συμβουλές & Τι να Περιμένετε' : 'Tips & What to Expect'}</h2>

        <ul>
          <li>{isEl ? 'Ξεκινήστε νωρίς το πρωί για να αποφύγετε τη ζέστη και να έχετε αρκετό φως' : 'Start early in the morning to avoid the heat and ensure enough daylight'}</li>
          <li>{isEl ? 'Πάρτε αρκετό νερό (τουλάχιστον 2-3 λίτρα) και τροφή' : 'Bring plenty of water (at least 2-3 liters) and food'}</li>
          <li>{isEl ? 'Φορέστε στιβαρά ορειβατικά παπούτσια' : 'Wear sturdy hiking boots'}</li>
          <li>{isEl ? 'Ο καιρός αλλάζει απότομα στην κορυφή — πάρτε αντιανεμικό' : 'Weather changes rapidly at the summit - bring a windbreaker'}</li>
          <li>{isEl ? 'Η κατάβαση είναι εξίσου απαιτητική — μην υποτιμάτε τον χρόνο' : 'The descent is equally demanding - do not underestimate the time needed'}</li>
          <li>{isEl ? 'Η θέα από την κορυφή είναι ανεπανάληπτη, ιδιαίτερα κατά την ανατολή του ηλίου' : 'The view from the peak is breathtaking, especially at sunrise'}</li>
        </ul>

        <h2>{isEl ? 'Η Εμπειρία' : 'The Experience'}</h2>

        <p>
          {isEl
            ? 'Η ανάβαση στον Άθω δεν είναι απλά μια πεζοπορία — είναι ένα προσκύνημα. Πολλοί πεζοπόροι περιγράφουν μια βαθιά αίσθηση γαλήνης καθώς πλησιάζουν στην κορυφή. Η σιωπή, η απομόνωση και η ιερότητα του τόπου δημιουργούν μια μοναδική εμπειρία που συνδυάζει τη σωματική δοκιμασία με την πνευματική ανύψωση.'
            : 'Climbing Athos is not merely a hike - it is a pilgrimage. Many hikers describe a profound sense of peace as they approach the summit. The silence, isolation, and sacredness of the place create a unique experience that combines physical challenge with spiritual elevation.'}
        </p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link href="/mount-athos/daily-life" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <ChevronLeft className="w-4 h-4" />
          <span>{isEl ? 'Καθημερινή Ζωή' : 'Daily Life'}</span>
        </Link>
        <Link href="/mount-athos/history" className="group flex items-center gap-2 text-sm text-gray-600 hover:text-amber-800">
          <span>{isEl ? 'Ιστορία & Θρύλοι' : 'History & Legends'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isEl ? 'Ανάβαση στην Κορυφή του Άθω' : 'Climbing Mount Athos Peak',
        description: isEl
          ? 'Οδηγός ανάβασης στην κορυφή του Άθω στα 2.033 μέτρα.'
          : 'Guide to climbing the peak of Mount Athos at 2,033 meters.',
        author: { '@type': 'Organization', name: 'ChalkidikiHub' },
        datePublished: '2025-06-01',
        publisher: { '@type': 'Organization', name: 'ChalkidikiHub', url: SITE_URL },
      })}} />
    </article>
  );
}
