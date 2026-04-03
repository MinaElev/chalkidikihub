import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isGreek = locale === 'el';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isGreek ? 'Όροι Χρήσης' : 'Terms of Use'}
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        {isGreek ? (
          <>
            <p className="text-sm text-gray-400">Τελευταία ενημέρωση: Απρίλιος 2026</p>

            <h2 className="text-xl font-semibold text-gray-900">1. Γενικά</h2>
            <p>Η ιστοσελίδα <strong>chalkidikihub.gr</strong> (εφεξής &quot;ChalkidikiHub&quot;) δημιουργήθηκε και συντηρείται από τον <strong>Μηνά Ελευθεριάδη</strong> ως μη κερδοσκοπική πρωτοβουλία για την προβολή και προώθηση του τουρισμού στη Χαλκιδική.</p>
            <p>Η ιστοσελίδα δεν αποτελεί τουριστικό γραφείο, μεσιτικό γραφείο ή πλατφόρμα κρατήσεων. Λειτουργεί αποκλειστικά ως καταλόγος πληροφοριών για καταλύματα, παραλίες, εστιατόρια, αξιοθέατα και δραστηριότητες στη Χαλκιδική.</p>

            <h2 className="text-xl font-semibold text-gray-900">2. Μη κερδοσκοπικός χαρακτήρας</h2>
            <p>Το ChalkidikiHub είναι μη κερδοσκοπικού χαρακτήρα. Δεν χρεώνει τους ιδιοκτήτες καταλυμάτων για την καταχώρησή τους, ούτε τους επισκέπτες για τη χρήση της πλατφόρμας. Ενδέχεται μελλοντικά να εισαχθούν διαφημίσεις ή προαιρετικές υπηρεσίες για τη συντήρηση του site.</p>

            <h2 className="text-xl font-semibold text-gray-900">3. Περιεχόμενο & Καταχωρήσεις</h2>
            <p>Οι ιδιοκτήτες καταλυμάτων είναι αποκλειστικά υπεύθυνοι για την ακρίβεια των πληροφοριών που καταχωρούν (περιγραφές, φωτογραφίες, τιμές, στοιχεία επικοινωνίας). Το ChalkidikiHub δεν ελέγχει και δεν εγγυάται την ακρίβεια των καταχωρήσεων.</p>
            <p>Οι τιμές που εμφανίζονται είναι ενδεικτικές (&quot;από...&quot;) και ενδέχεται να διαφέρουν ανάλογα με την εποχή, τη διαθεσιμότητα και τους όρους κράτησης.</p>

            <h2 className="text-xl font-semibold text-gray-900">4. Κρατήσεις & Συναλλαγές</h2>
            <p>Το ChalkidikiHub <strong>δεν διεκπεραιώνει κρατήσεις ή πληρωμές</strong>. Οι κρατήσεις γίνονται απευθείας μεταξύ του επισκέπτη και του ιδιοκτήτη, ή μέσω τρίτων πλατφορμών (Booking.com, Airbnb κλπ). Δεν φέρουμε καμία ευθύνη για τις συναλλαγές αυτές.</p>

            <h2 className="text-xl font-semibold text-gray-900">5. Αποποίηση ευθύνης</h2>
            <p>Το ChalkidikiHub δεν φέρει ευθύνη για:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Την ακρίβεια, πληρότητα ή επικαιρότητα των πληροφοριών</li>
              <li>Την ποιότητα των καταλυμάτων, εστιατορίων ή υπηρεσιών</li>
              <li>Οποιαδήποτε ζημία προκύψει από τη χρήση της ιστοσελίδας</li>
              <li>Τη διαθεσιμότητα ή τις τιμές των καταλυμάτων</li>
              <li>Τις συναλλαγές μεταξύ χρηστών και ιδιοκτητών</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">6. Λογαριασμοί χρηστών</h2>
            <p>Οι ιδιοκτήτες που δημιουργούν λογαριασμό είναι υπεύθυνοι για τη διατήρηση της ασφάλειας του λογαριασμού τους. Διατηρούμε το δικαίωμα να αφαιρέσουμε καταχωρήσεις ή λογαριασμούς που παραβιάζουν τους όρους χρήσης ή περιέχουν ψευδείς πληροφορίες.</p>

            <h2 className="text-xl font-semibold text-gray-900">7. Πνευματική ιδιοκτησία</h2>
            <p>Το περιεχόμενο της ιστοσελίδας (κείμενα, σχεδιασμός, λογότυπο) αποτελεί πνευματική ιδιοκτησία του Μηνά Ελευθεριάδη. Οι φωτογραφίες των καταλυμάτων ανήκουν στους αντίστοιχους ιδιοκτήτες.</p>

            <h2 className="text-xl font-semibold text-gray-900">8. Τροποποιήσεις</h2>
            <p>Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους ανά πάσα στιγμή. Η συνέχιση χρήσης της ιστοσελίδας μετά από τροποποίηση συνεπάγεται αποδοχή των νέων όρων.</p>

            <h2 className="text-xl font-semibold text-gray-900">9. Επικοινωνία</h2>
            <p>Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας στο: <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400">Last updated: April 2026</p>

            <h2 className="text-xl font-semibold text-gray-900">1. General</h2>
            <p>The website <strong>chalkidikihub.gr</strong> (hereinafter &quot;ChalkidikiHub&quot;) was created and is maintained by <strong>Minas Eleftheriadis</strong> as a non-profit initiative for the promotion of tourism in Halkidiki, Greece.</p>
            <p>The website is not a travel agency, real estate agency or booking platform. It operates exclusively as an information directory for accommodations, beaches, restaurants, attractions and activities in Halkidiki.</p>

            <h2 className="text-xl font-semibold text-gray-900">2. Non-profit nature</h2>
            <p>ChalkidikiHub is non-profit. It does not charge property owners for listings or visitors for using the platform. Advertisements or optional services may be introduced in the future to maintain the site.</p>

            <h2 className="text-xl font-semibold text-gray-900">3. Content & Listings</h2>
            <p>Property owners are solely responsible for the accuracy of the information they submit (descriptions, photos, prices, contact details). ChalkidikiHub does not verify or guarantee the accuracy of listings.</p>
            <p>Prices shown are indicative (&quot;from...&quot;) and may vary depending on the season, availability and booking terms.</p>

            <h2 className="text-xl font-semibold text-gray-900">4. Bookings & Transactions</h2>
            <p>ChalkidikiHub <strong>does not process bookings or payments</strong>. Bookings are made directly between the visitor and the owner, or through third-party platforms (Booking.com, Airbnb etc). We bear no responsibility for these transactions.</p>

            <h2 className="text-xl font-semibold text-gray-900">5. Disclaimer</h2>
            <p>ChalkidikiHub is not responsible for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The accuracy, completeness or timeliness of the information</li>
              <li>The quality of accommodations, restaurants or services</li>
              <li>Any damage resulting from use of the website</li>
              <li>Availability or prices of accommodations</li>
              <li>Transactions between users and property owners</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">6. User accounts</h2>
            <p>Owners who create accounts are responsible for maintaining the security of their accounts. We reserve the right to remove listings or accounts that violate the terms of use or contain false information.</p>

            <h2 className="text-xl font-semibold text-gray-900">7. Intellectual property</h2>
            <p>The website content (texts, design, logo) is the intellectual property of Minas Eleftheriadis. Accommodation photos belong to their respective owners.</p>

            <h2 className="text-xl font-semibold text-gray-900">8. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the website after modification implies acceptance of the new terms.</p>

            <h2 className="text-xl font-semibold text-gray-900">9. Contact</h2>
            <p>For any questions about the terms of use, contact us at: <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>
          </>
        )}
      </div>
    </div>
  );
}
