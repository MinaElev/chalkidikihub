import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isGreek = locale === 'el';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isGreek ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        {isGreek ? (
          <>
            <p className="text-sm text-gray-400">Τελευταία ενημέρωση: Απρίλιος 2026</p>

            <h2 className="text-xl font-semibold text-gray-900">1. Ποιοι είμαστε</h2>
            <p>Η ιστοσελίδα <strong>chalkidikihub.gr</strong> λειτουργεί από τον Μηνά Ελευθεριάδη. Email επικοινωνίας: <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>

            <h2 className="text-xl font-semibold text-gray-900">2. Ποια δεδομένα συλλέγουμε</h2>
            <p>Συλλέγουμε μόνο τα δεδομένα που μας παρέχετε εσείς:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Ιδιοκτήτες:</strong> Όνομα, email, τηλέφωνο, στοιχεία καταλύματος</li>
              <li><strong>Επισκέπτες:</strong> Δεν συλλέγουμε προσωπικά δεδομένα</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">3. Πώς χρησιμοποιούμε τα δεδομένα</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Για τη λειτουργία του λογαριασμού σας</li>
              <li>Για την εμφάνιση των καταχωρήσεών σας</li>
              <li>Για τη βελτίωση της ιστοσελίδας</li>
            </ul>
            <p><strong>Δεν πουλάμε, δεν μοιραζόμαστε και δεν διαβιβάζουμε τα δεδομένα σας σε τρίτους.</strong></p>

            <h2 className="text-xl font-semibold text-gray-900">4. Αποθήκευση δεδομένων</h2>
            <p>Τα δεδομένα αποθηκεύονται ασφαλώς στο Supabase (EU servers). Τα passwords κρυπτογραφούνται και δεν είναι προσβάσιμα σε κανέναν.</p>

            <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
            <p>Χρησιμοποιούμε μόνο τα απολύτως απαραίτητα cookies για τη λειτουργία του site (session, γλώσσα). Δεν χρησιμοποιούμε cookies παρακολούθησης ή διαφημίσεων.</p>

            <h2 className="text-xl font-semibold text-gray-900">6. Τα δικαιώματά σας</h2>
            <p>Έχετε δικαίωμα:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Πρόσβασης στα δεδομένα σας</li>
              <li>Διόρθωσης εσφαλμένων δεδομένων</li>
              <li>Διαγραφής του λογαριασμού σας</li>
              <li>Εξαγωγής των δεδομένων σας</li>
            </ul>
            <p>Για οποιοδήποτε αίτημα, επικοινωνήστε στο <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>

            <h2 className="text-xl font-semibold text-gray-900">7. Τροποποιήσεις</h2>
            <p>Ενδέχεται να ενημερώσουμε την παρούσα πολιτική. Θα ενημερωθεί η ημερομηνία στην κορυφή αυτής της σελίδας.</p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400">Last updated: April 2026</p>

            <h2 className="text-xl font-semibold text-gray-900">1. Who we are</h2>
            <p>The website <strong>chalkidikihub.gr</strong> is operated by Minas Eleftheriadis. Contact email: <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>

            <h2 className="text-xl font-semibold text-gray-900">2. What data we collect</h2>
            <p>We only collect data that you provide:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Property owners:</strong> Name, email, phone, property details</li>
              <li><strong>Visitors:</strong> We do not collect personal data</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900">3. How we use data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To operate your account</li>
              <li>To display your listings</li>
              <li>To improve the website</li>
            </ul>
            <p><strong>We do not sell, share or transfer your data to third parties.</strong></p>

            <h2 className="text-xl font-semibold text-gray-900">4. Data storage</h2>
            <p>Data is stored securely on Supabase (EU servers). Passwords are encrypted and not accessible to anyone.</p>

            <h2 className="text-xl font-semibold text-gray-900">5. Cookies</h2>
            <p>We use only essential cookies for site operation (session, language). We do not use tracking or advertising cookies.</p>

            <h2 className="text-xl font-semibold text-gray-900">6. Your rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account</li>
              <li>Export your data</li>
            </ul>
            <p>For any request, contact <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">mnc@hotmail.gr</a></p>

            <h2 className="text-xl font-semibold text-gray-900">7. Changes</h2>
            <p>We may update this policy. The date at the top of this page will be updated accordingly.</p>
          </>
        )}
      </div>
    </div>
  );
}
