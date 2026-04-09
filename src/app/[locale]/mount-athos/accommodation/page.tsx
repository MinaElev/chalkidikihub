import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { ChevronRight, ChevronLeft, BedDouble, Church, UtensilsCrossed, Wallet, Info } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro'] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'el'
    ? 'Διαμονή στο Άγιο Όρος | Χαλκιδική'
    : 'Accommodation on Mount Athos | Halkidiki';
  const description = locale === 'el'
    ? 'Πού να μείνετε στο Άγιο Όρος: αρχονταρίκια μονών, φιλοξενία, κόστος, τι να περιμένετε και πρακτικές πληροφορίες.'
    : 'Where to stay on Mount Athos: monastery guest quarters, hospitality, costs, what to expect and practical information.';
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `${SITE_URL}/${locale}/mount-athos/accommodation`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${SITE_URL}/${l}/mount-athos/accommodation`])),
    },
  };
}

export default async function AccommodationPage({ params }: Props) {
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
        <span className="text-gray-900 font-medium">{isEl ? 'Διαμονή' : 'Accommodation'}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {isEl ? 'Διαμονή στο Άγιο Όρος' : 'Accommodation on Mount Athos'}
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          {isEl
            ? 'Στο Άγιο Όρος δεν υπάρχουν ξενοδοχεία ή τουριστικά καταλύματα. Η φιλοξενία παρέχεται δωρεάν από τα μοναστήρια στους αρχονταρίκια (ξενώνες), σύμφωνα με την αρχαία μοναστική παράδοση. Η διαμονή είναι απλή αλλά αυθεντική — ένα πνευματικό ταξίδι, όχι διακοπές πολυτελείας.'
            : 'There are no hotels or tourist accommodations on Mount Athos. Hospitality is provided free of charge by the monasteries in their archontariki (guest quarters), following the ancient monastic tradition. The stay is simple but authentic — a spiritual journey, not a luxury vacation.'}
        </p>

        {/* Archontariki */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <BedDouble className="w-6 h-6 text-amber-700" />
          {isEl ? 'Αρχονταρίκι (Ξενώνας Μονής)' : 'Archontariki (Monastery Guest Quarters)'}
        </h2>
        <p>
          {isEl
            ? 'Κάθε μοναστήρι διαθέτει αρχονταρίκι — τον ειδικό χώρο υποδοχής και φιλοξενίας προσκυνητών. Πρόκειται για δωμάτια με κρεβάτια, συνήθως πολύκλινα, με κοινόχρηστο μπάνιο.'
            : 'Each monastery has an archontariki — the dedicated area for receiving and hosting pilgrims. These are rooms with beds, usually shared dormitory-style, with communal bathrooms.'}
        </p>
        <ul>
          <li>
            {isEl
              ? 'Η διαμονή παρέχεται δωρεάν σε όλους τους κατόχους διαμονητηρίου.'
              : 'Accommodation is provided free of charge to all permit holders.'}
          </li>
          <li>
            {isEl
              ? 'Κατά την άφιξη προσφέρεται λουκούμι, τσίπουρο ή γλυκό κουταλιού μαζί με νερό.'
              : 'Upon arrival, guests are offered loukoumi (Turkish delight), tsipouro or spoon sweets along with water.'}
          </li>
          <li>
            {isEl
              ? 'Τα δωμάτια είναι καθαρά και απλά. Παρέχονται σεντόνια και κουβέρτες.'
              : 'Rooms are clean and simple. Sheets and blankets are provided.'}
          </li>
          <li>
            {isEl
              ? 'Ο αρχοντάρης (υπεύθυνος μοναχός) οργανώνει τη διαμονή και ενημερώνει για το πρόγραμμα.'
              : 'The archontaris (the monk in charge) organizes the stay and informs guests about the schedule.'}
          </li>
        </ul>

        {/* Food */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <UtensilsCrossed className="w-6 h-6 text-amber-700" />
          {isEl ? 'Γεύματα & Τράπεζα' : 'Meals & Dining'}
        </h2>
        <p>
          {isEl
            ? 'Τα μοναστήρια παρέχουν γεύματα στους επισκέπτες στην κοινή τράπεζα (τραπεζαρία). Η τροφή είναι απλή, λιτή και σύμφωνη με τους εκκλησιαστικούς κανόνες νηστείας.'
            : 'Monasteries provide meals to visitors in the common trapeza (refectory). The food is simple, frugal and follows the ecclesiastical fasting rules.'}
        </p>
        <ul>
          <li>
            {isEl
              ? 'Συνήθως δύο γεύματα την ημέρα (πρωινό μετά τη Θεία Λειτουργία, γεύμα/δείπνο).'
              : 'Usually two meals per day (breakfast after the Divine Liturgy, lunch/dinner).'}
          </li>
          <li>
            {isEl
              ? 'Η διατροφή βασίζεται σε όσπρια, λαχανικά, ψωμί, ελιές και φρούτα. Κρέας δεν σερβίρεται ποτέ.'
              : 'The diet is based on legumes, vegetables, bread, olives and fruit. Meat is never served.'}
          </li>
          <li>
            {isEl
              ? 'Κατά τις γιορτές μπορεί να σερβιριστεί ψάρι, κρασί και γλυκά.'
              : 'During feast days, fish, wine and sweets may be served.'}
          </li>
          <li>
            {isEl
              ? 'Τα γεύματα γίνονται σε σιωπή, ενώ ένας μοναχός διαβάζει πνευματικά κείμενα.'
              : 'Meals take place in silence, while a monk reads spiritual texts.'}
          </li>
        </ul>

        {/* Participation in services */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Church className="w-6 h-6 text-amber-700" />
          {isEl ? 'Συμμετοχή στις Ακολουθίες' : 'Participation in Services'}
        </h2>
        <p>
          {isEl
            ? 'Οι προσκυνητές αναμένεται να συμμετέχουν στις θρησκευτικές ακολουθίες, ειδικά στον εσπερινό και τη Θεία Λειτουργία. Αυτό αποτελεί αναπόσπαστο μέρος της εμπειρίας στο Άγιο Όρος.'
            : 'Pilgrims are expected to participate in the religious services, especially vespers and the Divine Liturgy. This is an integral part of the Mount Athos experience.'}
        </p>
        <ul>
          <li>
            {isEl
              ? 'Ο εσπερινός τελείται συνήθως γύρω στις 4-5 το απόγευμα (βυζαντινή ώρα).'
              : 'Vespers is usually held around 4-5 in the afternoon (Byzantine time).'}
          </li>
          <li>
            {isEl
              ? 'Η Θεία Λειτουργία ξεκινά πολύ νωρίς, συχνά στις 3-4 τα ξημερώματα.'
              : 'The Divine Liturgy starts very early, often at 3-4 in the morning.'}
          </li>
          <li>
            {isEl
              ? 'Η συμμετοχή δεν είναι υποχρεωτική, αλλά θεωρείται σημάδι σεβασμού.'
              : 'Participation is not mandatory, but is considered a sign of respect.'}
          </li>
        </ul>

        {/* Sketes */}
        <h3 className="text-xl font-bold text-gray-900 mt-8">
          {isEl ? 'Διαμονή σε Σκήτες και Κελιά' : 'Staying in Sketes and Cells'}
        </h3>
        <p>
          {isEl
            ? 'Εκτός από τα μεγάλα μοναστήρια, μπορείτε να μείνετε και σε σκήτες (μικρότερες μοναστικές κοινότητες) ή μεμονωμένα κελιά. Η φιλοξενία εκεί είναι ακόμα πιο λιτή, αλλά η εμπειρία ιδιαίτερα αυθεντική.'
            : 'Besides the large monasteries, you can also stay in sketes (smaller monastic communities) or individual cells. Hospitality there is even more frugal, but the experience is particularly authentic.'}
        </p>
        <ul>
          <li>
            {isEl
              ? 'Απαιτείται τηλεφωνική επικοινωνία εκ των προτέρων.'
              : 'Prior telephone contact is required.'}
          </li>
          <li>
            {isEl
              ? 'Ο αριθμός φιλοξενούμενων είναι πολύ περιορισμένος.'
              : 'The number of guests is very limited.'}
          </li>
        </ul>

        {/* What to expect */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Info className="w-6 h-6 text-amber-700" />
          {isEl ? 'Τι να Περιμένετε' : 'What to Expect'}
        </h2>
        <p>
          {isEl
            ? 'Η διαμονή στο Άγιο Όρος είναι μια εμπειρία λιτότητας και πνευματικής αναζήτησης. Δεν πρόκειται για τουριστική φιλοξενία — πρόκειται για μοναστική ζωή.'
            : 'Staying on Mount Athos is an experience of simplicity and spiritual seeking. It is not tourist hospitality — it is monastic life.'}
        </p>
        <ul>
          <li>{isEl ? 'Δεν υπάρχει Wi-Fi ή τηλεόραση.' : 'There is no Wi-Fi or television.'}</li>
          <li>{isEl ? 'Το ηλεκτρικό ρεύμα μπορεί να είναι περιορισμένο σε ορισμένα μοναστήρια.' : 'Electricity may be limited in some monasteries.'}</li>
          <li>{isEl ? 'Η ησυχία και η σιωπή είναι θεμελιώδεις αξίες.' : 'Quiet and silence are fundamental values.'}</li>
          <li>{isEl ? 'Κατάλληλη ενδυμασία: μακριά παντελόνια, πουκάμισο με μανίκια.' : 'Appropriate clothing: long trousers, shirt with sleeves.'}</li>
          <li>{isEl ? 'Αποφύγετε τη φωτογράφιση χωρίς άδεια.' : 'Avoid photographing without permission.'}</li>
        </ul>

        {/* Costs */}
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 mt-10">
          <Wallet className="w-6 h-6 text-amber-700" />
          {isEl ? 'Κόστος Επίσκεψης' : 'Visit Costs'}
        </h2>
        <p>
          {isEl
            ? 'Η συνολική επίσκεψη στο Άγιο Όρος είναι σχετικά οικονομική, δεδομένου ότι η διαμονή και η σίτιση προσφέρονται δωρεάν.'
            : 'An overall visit to Mount Athos is relatively affordable, since accommodation and meals are provided free of charge.'}
        </p>
        <ul>
          <li>
            <strong>{isEl ? 'Διαμονητήριο:' : 'Permit (Diamonitirion):'}</strong>{' '}
            {isEl ? 'Περίπου 25 ευρώ (για Έλληνες και Ευρωπαίους πολίτες).' : 'Approximately 25 euros (for Greek and EU citizens).'}
          </li>
          <li>
            <strong>{isEl ? 'Εισιτήριο πλοίου:' : 'Boat ticket:'}</strong>{' '}
            {isEl ? 'Περίπου 10-15 ευρώ (μονή διαδρομή).' : 'Approximately 10-15 euros (one way).'}
          </li>
          <li>
            <strong>{isEl ? 'Μεταφορές εντός:' : 'Internal transport:'}</strong>{' '}
            {isEl ? 'Λεωφορεία/σκάφη: 5-15 ευρώ ανά διαδρομή.' : 'Buses/boats: 5-15 euros per route.'}
          </li>
          <li>
            <strong>{isEl ? 'Διαμονή & φαγητό:' : 'Accommodation & food:'}</strong>{' '}
            {isEl ? 'Δωρεάν (δωρεές δεκτές αλλά προαιρετικές).' : 'Free (donations are accepted but optional).'}
          </li>
        </ul>
        <p>
          {isEl
            ? 'Συνολικά, ένα τριήμερο ταξίδι μπορεί να κοστίσει μόνο 50-100 ευρώ, εξαιρουμένης της μετακίνησης προς Ουρανούπολη.'
            : 'Overall, a three-day trip can cost as little as 50-100 euros, excluding transport to Ouranoupoli.'}
        </p>
      </div>

      {/* Prev / Next */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
        <Link href="/mount-athos/getting-there" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          <ChevronLeft className="w-4 h-4" />
          {isEl ? 'Πώς να Πάτε' : 'Getting There'}
        </Link>
        <Link href="/mount-athos/daily-life" className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900">
          {isEl ? 'Καθημερινή Ζωή' : 'Daily Life'} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isEl ? 'Διαμονή στο Άγιο Όρος' : 'Accommodation on Mount Athos',
        description: isEl
          ? 'Πού να μείνετε στο Άγιο Όρος: αρχονταρίκια, φιλοξενία, κόστος και τι να περιμένετε.'
          : 'Where to stay on Mount Athos: guest quarters, hospitality, costs and what to expect.',
        author: { '@type': 'Organization', name: 'Chalkidiki Hub' },
        publisher: { '@type': 'Organization', name: 'Chalkidiki Hub', url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/${locale}/mount-athos/accommodation`,
      })}} />
    </article>
  );
}
