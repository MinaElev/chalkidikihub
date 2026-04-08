import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const versions = [
    {
      version: 'v1.3.0',
      date: '7 Απριλίου 2026',
      highlights: 'User Reviews, Blog Comments, Performance Boost',
      features: [
        { emoji: '⭐', title: 'User Reviews', desc: 'Οι χρήστες αφήνουν κριτικές σε παραλίες, εστιατόρια, δραστηριότητες (login required)' },
        { emoji: '💬', title: 'Blog Comments', desc: 'Σχόλια κάτω από κάθε blog article με moderation' },
        { emoji: '🔍', title: 'Interlinking Score', desc: 'Εργαλείο ανάλυσης internal links ανά σελίδα + AI βελτίωση αδύναμων σελίδων' },
        { emoji: '📸', title: 'Photo Filler (Unsplash)', desc: 'Βρίσκει σελίδες χωρίς φωτό → αναζήτηση δωρεάν φωτογραφιών από Unsplash' },
        { emoji: '🤖', title: 'AI Data Import', desc: 'Bulk import παραλιών, εστιατορίων, δραστηριοτήτων μέσω AI σε 6 γλώσσες' },
        { emoji: '⚡', title: 'Performance Boost', desc: 'Optimized API calls (~80% λιγότερα data), cache headers, targeted queries' },
        { emoji: '🍞', title: 'Φούρνος', desc: 'Νέος τύπος κατηγορίας Φαγητό & Ποτό' },
        { emoji: '🛡️', title: 'Anti-Spam', desc: 'Honeypot fields + rate limiting σε register, contact, reviews' },
        { emoji: '👤', title: 'User Delete', desc: 'Ο admin μπορεί να διαγράψει χρήστες (cascading cleanup)' },
      ],
    },
    {
      version: 'v1.2.0',
      date: '7 Απριλίου 2026',
      highlights: 'Booking Integration, Mass Email, External Emails',
      features: [
        { emoji: '📊', title: 'Booking Click Tracking', desc: 'Κάθε κλικ σε Booking.com, Airbnb, Phone, Email καταγράφεται' },
        { emoji: '📱', title: 'Mobile Sticky Booking Bar', desc: 'Fixed bar με τιμή + CTA κουμπί σε mobile listing pages' },
        { emoji: '📅', title: 'Ζητήστε Διαθεσιμότητα', desc: 'Inquiry form σε κάθε listing — στέλνει email στον ιδιοκτήτη' },
        { emoji: '📧', title: 'Mass Email (Gmail SMTP)', desc: 'Αποστολή emails σε χρήστες — 5 λίστες + εξωτερικά emails' },
        { emoji: '📬', title: 'Email History', desc: 'Ιστορικό αποστολών με sent/failed counts' },
        { emoji: '🔔', title: 'Notification Banners', desc: 'Pending submissions + unread messages alerts στο admin dashboard' },
        { emoji: '🍽️', title: 'Φαγητό & Ποτό', desc: 'Μετονομασία σε "Φαγητό & Ποτό" + νέοι τύποι: Bar, Cocktail Bar, Brunch, Café-Bar, Beach Bar' },
        { emoji: '📋', title: 'Admin Quick Actions', desc: '15 κουμπιά γρήγορης πρόσβασης στο admin dashboard' },
        { emoji: '🇬🇷', title: 'Ελληνικοί μετρητές', desc: 'Dashboard stats στα ελληνικά' },
      ],
    },
    {
      version: 'v1.1.0',
      date: '7 Απριλίου 2026',
      highlights: 'QR Guest Guide, Engagement Features, SEO Fixes',
      features: [
        { emoji: '📱', title: 'QR Guest Guide', desc: 'Digital concierge — ο πελάτης σκανάρει QR στο δωμάτιο, βλέπει παραλίες, εστιατόρια, τηλέφωνα' },
        { emoji: '❤️', title: 'Favorites Counter', desc: 'Heart icon στο header με αριθμό αγαπημένων' },
        { emoji: '🕐', title: 'Recently Viewed', desc: '"Είδατε πρόσφατα" strip σε κάθε detail page' },
        { emoji: '🔢', title: 'Notification Badges', desc: 'Badges σε sidebar για pending submissions + messages' },
        { emoji: '🔗', title: 'Share/Copy Link', desc: 'Κουμπί αντιγραφής link σε κάθε σελίδα (Facebook, WhatsApp, Telegram, Email)' },
        { emoji: '✏️', title: 'AI Content Formatting', desc: 'Κουμπί "AI Μορφοποίηση" — ξαναγράφει κείμενο σε παραγράφους, τίτλους, bullet points' },
        { emoji: '🖼️', title: 'Inline Blog Images', desc: 'Εισαγωγή φωτογραφιών μέσα στο κείμενο blog articles' },
        { emoji: '📐', title: 'Mobile Admin Panel', desc: 'Hamburger menu + drawer navigation σε mobile' },
        { emoji: '🎯', title: 'User Dashboard Redesign', desc: '4 χρωματιστά CTA cards: Κατάλυμα, Εστιατόριο, Δραστηριότητα, Άρθρο' },
      ],
    },
    {
      version: 'v1.0.0',
      date: '6 Απριλίου 2026',
      highlights: 'Full Platform Launch',
      features: [
        { emoji: '🏠', title: 'Καταλύματα', desc: 'Καταχώρηση ενοικιαζόμενων δωματίων με φωτογραφίες, χάρτη, amenities' },
        { emoji: '🏖️', title: 'Παραλίες', desc: '13+ παραλίες Χαλκιδικής με features, rating, crowd estimation' },
        { emoji: '🍽️', title: 'Εστιατόρια', desc: '70+ εστιατόρια & beach bars με reviews, τηλέφωνα, ωράρια' },
        { emoji: '🏛️', title: 'Δραστηριότητες', desc: 'Αξιοθέατα, εκδρομές, water sports, πεζοπορία' },
        { emoji: '📝', title: 'Blog', desc: 'Άρθρα & οδηγοί με AI auto-linking σε παραλίες, εστιατόρια, δραστηριότητες' },
        { emoji: '⚡', title: 'EV Chargers', desc: 'Live δεδομένα φορτιστών ηλεκτρικών οχημάτων (Open Charge Map)' },
        { emoji: '🌍', title: '6 Γλώσσες', desc: 'Ελληνικά, Αγγλικά, Γερμανικά, Βουλγαρικά, Ρωσικά, Ρουμανικά' },
        { emoji: '🤖', title: 'AI Auto-Complete', desc: 'Μετάφραση + SEO σε 6 γλώσσες με ένα κλικ (GPT-4o-mini)' },
        { emoji: '🔍', title: 'Fuzzy Search', desc: 'Αναζήτηση Greek↔Latin: "σάρτη" = "sarti" = "σαρτι"' },
        { emoji: '🗺️', title: 'Interactive Maps', desc: 'Leaflet χάρτες με location picker σε κάθε καταχώρηση' },
        { emoji: '📊', title: 'SEO Complete', desc: 'JSON-LD, canonical, hreflang, meta tags, sitemap σε κάθε σελίδα' },
        { emoji: '📋', title: 'User Submissions', desc: 'Χρήστες προτείνουν εστιατόρια, δραστηριότητες, άρθρα → admin moderation' },
        { emoji: '📈', title: 'Activity Logs', desc: 'Καταγραφή ενεργειών χρηστών, errors, admin actions' },
        { emoji: '🎨', title: 'Admin Panel', desc: 'Πλήρες panel: Users, Listings, Content, SEO, Tools, Settings, Email' },
        { emoji: '📱', title: 'PWA', desc: 'Progressive Web App — offline support, mobile install' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Changelog</h1>
        <p className="mt-2 text-lg text-gray-600">Όλες οι ενημερώσεις και τα νέα features του ChalkidikiHub</p>
      </div>

      <div className="space-y-12">
        {versions.map((v, vi) => (
          <div key={v.version}>
            {/* Version header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="px-4 py-2 bg-primary-600 text-white rounded-xl font-bold text-lg">{v.version}</div>
              <div>
                <p className="text-sm text-gray-500">{v.date}</p>
                <p className="font-medium text-gray-900">{v.highlights}</p>
              </div>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {v.features.map((f, fi) => (
                <div key={fi} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                  <span className="text-xl shrink-0">{f.emoji}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Separator */}
            {vi < versions.length - 1 && <hr className="mt-12 border-gray-200" />}
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-gray-400">
        <p>Built with Next.js, Supabase, Tailwind CSS & AI</p>
        <p className="mt-1">ChalkidikiHub.gr — Η πλατφόρμα τουρισμού της Χαλκιδικής</p>
      </div>
    </div>
  );
}
