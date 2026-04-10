import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const versions = [
    {
      version: 'v2.3.0',
      date: '10 Απριλίου 2026',
      highlights: 'Auto-Blog AI, Beach Features, Village Combos, 3,300 SEO URLs',
      features: [
        { emoji: '🤖', title: 'Auto-Blog Generator', desc: 'AI γράφει 1 άρθρο/ημέρα αυτόματα — 14 rotating topics, πραγματικά data, 6 γλώσσες, SEO, δημοσίευση' },
        { emoji: '🏖️', title: 'Beach Feature Pages', desc: '12 χαρακτηριστικά παραλιών (sandy, organized, nudist κλπ) × 6 γλώσσες = 72 SEO URLs' },
        { emoji: '🏘️', title: 'Village Content Combos', desc: '68 χωριά × 3 types (beaches/restaurants/activities) × 6 γλώσσες = 1,224 SEO URLs' },
        { emoji: '📍', title: 'Village Pills σε Areas', desc: 'Κάθε area page δείχνει τα χωριά της ως clickable pills με πληθυσμό' },
        { emoji: '📊', title: '3,300 Sitemap URLs', desc: 'Σύνολο σελίδων στο sitemap — 0 errors σε full crawl' },
      ],
    },
    {
      version: 'v2.2.0',
      date: '10 Απριλίου 2026',
      highlights: 'Sun & Sea Logo, Monastery Images, Brand Identity',
      features: [
        { emoji: '☀️', title: 'Sun & Sea Logo', desc: 'Νέο brand logo — ήλιος + κύματα σε cyan φόντο. Εφαρμογή σε header, footer, favicon, PWA manifest' },
        { emoji: '🖼️', title: 'Monastery Images', desc: 'Κάθε μονή δείχνει φωτογραφία στο hero + full image section στη σελίδα της' },
        { emoji: '🎨', title: 'Brand Identity', desc: 'Reusable BrandIcon component, updated theme-color #0891B2, SVG favicons' },
      ],
    },
    {
      version: 'v2.1.0',
      date: '10 Απριλίου 2026',
      highlights: 'Monastery Admin, Village Filters, Security Hardening, 68 Villages',
      features: [
        { emoji: '⛪', title: 'Monasteries Admin CRUD', desc: 'Επεξεργασία μονών Αγίου Όρους: 6 γλώσσες, AI Generate description + highlights, AI Auto-Complete SEO' },
        { emoji: '🏘️', title: '68 Χωριά (29 Ενδοχώρα)', desc: '29 νέα χωριά Ενδοχώρας — Πολύγυρος, Αρναία, Ολυμπιάδα, Γερακινή κ.α. Σύνολο 408 SEO URLs' },
        { emoji: '🔍', title: 'Village Filters & Sorting', desc: 'Αναζήτηση, φίλτρα (area, image, SEO, population), sortable columns, stats bar' },
        { emoji: '🔒', title: 'Security Hardening', desc: 'Auth checks σε όλα τα admin API, input validation, XSS sanitization, service role key protection' },
        { emoji: '⚡', title: 'Performance Fixes', desc: 'Sitemap ISR, map page limits, comments/inquiry caching' },
        { emoji: '⛪', title: '20 Monastery Pages', desc: 'Κάθε μονή δική της σελίδα — 120 SEO URLs, prev/next navigation, JSON-LD, 6 γλώσσες' },
      ],
    },
    {
      version: 'v2.0.0',
      date: '10 Απριλίου 2026',
      highlights: 'Mount Athos Guide, 6-Language Translations, Area Banner',
      features: [
        { emoji: '⛪', title: 'Οδηγός Αγίου Όρους', desc: '8 σελίδες: μοναστήρια, κανόνες, μεταφορές, διαμονή, ζωή, πεζοπορία, ιστορία — πλήρης μετάφραση 6 γλωσσών' },
        { emoji: '🌍', title: '48 SEO URLs', desc: '8 σελίδες × 6 γλώσσες με meta titles, descriptions, hreflang, JSON-LD schemas' },
        { emoji: '🏷️', title: 'Athos Area Banner', desc: 'Ωραίο banner στη σελίδα /areas/athos που οδηγεί στον πλήρη οδηγό Αγίου Όρους' },
        { emoji: '📝', title: 'JSON-LD Schemas', desc: 'TouristAttraction, Article, FAQPage, ItemList — πλούσια δεδομένα για Google' },
      ],
    },
    {
      version: 'v1.9.0',
      date: '10 Απριλίου 2026',
      highlights: 'Live Weather, AI Formatted Descriptions, SEO Tools Update',
      features: [
        { emoji: '🌤️', title: 'Live Weather Badge', desc: 'Τρέχων καιρός (θερμοκρασία + icon) στο hero κάθε χωριού μέσω OpenWeatherMap' },
        { emoji: '📝', title: 'AI Formatted Descriptions', desc: 'Το AI Generate γράφει μορφοποιημένο HTML (headings, lists, bold) για ωραία ανάγνωση' },
        { emoji: '🔍', title: 'Villages στα SEO Tools', desc: 'Τα χωριά συμπεριλαμβάνονται σε Quality Checker, Translation Matrix, SEO Dashboard, AI Bulk SEO' },
        { emoji: '🏘️', title: '39 Χωριά Updated', desc: 'Κασσάνδρα (18), Σιθωνία (15), Άθως (6) — σωστή λίστα με νέα χωριά' },
      ],
    },
    {
      version: 'v1.8.0',
      date: '10 Απριλίου 2026',
      highlights: 'Village Pages, Admin Restructure, Footer Upgrade',
      features: [
        { emoji: '🏘️', title: '39 Village Pages', desc: 'Σελίδα ανά χωριό Χαλκιδικής — Κασσάνδρα (18), Σιθωνία (15), Άθως (6) με κοντινές παραλίες, εστιατόρια, δραστηριότητες' },
        { emoji: '🤖', title: 'AI Village Generator', desc: 'Αυτόματη δημιουργία περιγραφής + πληθυσμού ανά χωριό μέσω AI' },
        { emoji: '🗺️', title: 'Village Admin CRUD', desc: 'Πλήρης διαχείριση χωριών: New/Edit/Delete + AI Auto-Complete σε 6 γλώσσες + SEO' },
        { emoji: '📍', title: '~234 νέα SEO URLs', desc: '39 χωριά × 6 γλώσσες = 234 νέες σελίδες στο sitemap για Google indexing' },
        { emoji: '🏠', title: 'Footer Upgrade', desc: '"Γιατί ChalkidikiHub;" section + CTA card + Chalkidiki Sales link στο footer' },
        { emoji: '👁️', title: 'Admin Preview Fix', desc: 'Τα preview links σε beaches, restaurants, activities, blog, sales ανοίγουν σωστά με locale' },
      ],
    },
    {
      version: 'v1.7.0',
      date: '9 Απριλίου 2026',
      highlights: 'Admin & Dashboard Redesign, Translation Matrix, Quality Checker',
      features: [
        { emoji: '🎛️', title: 'Admin Panel Redesign', desc: '7 ξεκάθαρα sections αντί για 5 — Places, Properties, Editorial, Moderation, Data & Media, System' },
        { emoji: '📊', title: 'Dashboard Redesign (Admin)', desc: 'SEO Health, Translation Coverage, Action Required banners, Recent Activity feed' },
        { emoji: '🌍', title: 'Translation Matrix', desc: 'Νέα σελίδα — matrix 159 items × 6 γλώσσες με AI Fill button' },
        { emoji: '🛡️', title: 'Quality Checker', desc: 'Νέα σελίδα — σκανάρει όλο το περιεχόμενο, εντοπίζει missing translations, SEO, images' },
        { emoji: '👁️', title: 'Preview Links', desc: 'Κουμπί Preview σε κάθε admin list (beaches, restaurants, activities, blog, sales)' },
        { emoji: '👤', title: 'User Dashboard Redesign', desc: 'Welcome message, Sales stats, compact quick actions, collapsible inquiries' },
        { emoji: '🏠', title: 'Footer Upgrade', desc: '"Γιατί ChalkidikiHub;" section + CTA card + Chalkidiki Sales link' },
        { emoji: '⭐', title: 'Review Badges', desc: 'Pending reviews badge count στο admin sidebar' },
      ],
    },
    {
      version: 'v1.6.0',
      date: '9 Απριλίου 2026',
      highlights: 'Sales Section, SEO Ghost Pages, Admin Edit',
      features: [
        { emoji: '🏡', title: 'Πωλήσεις Ακινήτων', desc: 'Ολοκληρωμένο section πωλήσεων — κατοικίες, διαμερίσματα, γη, επαγγελματικά χώροι' },
        { emoji: '🎨', title: 'Sales Custom Layout', desc: 'Ανεξάρτητη αρχική, header, footer με emerald branding για τις πωλήσεις' },
        { emoji: '📝', title: 'Admin Edit Sales', desc: 'Επεξεργασία ακινήτων σε 6 γλώσσες + AI Auto-Complete + AI Format' },
        { emoji: '🌍', title: 'Sales 6 Γλώσσες', desc: 'Πλήρης μετάφραση sales section σε EL, EN, DE, BG, RU, RO' },
        { emoji: '👻', title: '156 SEO Ghost Pages', desc: 'Κρυφές σελίδες ανά περιοχή/κατηγορία — μόνο στο sitemap για Google ranking' },
        { emoji: '🍽️', title: 'Restaurant Category Pages', desc: 'SEO σελίδες ανά τύπο εστιατορίου (/restaurants/category/[type])' },
        { emoji: '🏗️', title: 'Sales Dashboard', desc: 'Χρήστες δημιουργούν/διαχειρίζονται τις αγγελίες τους' },
        { emoji: '🛡️', title: 'Admin Sales Moderation', desc: 'Publish/unpublish, delete, edit ακινήτων από admin panel' },
        { emoji: '📊', title: 'Sales Homepage', desc: 'Hero, carousel, property types, οδηγίες καταχώρησης, "Τι κάνουμε στο παρασκήνιο"' },
      ],
    },
    {
      version: 'v1.5.0',
      date: '8 Απριλίου 2026',
      highlights: 'Dynamic Business Types, Google Import Activities',
      features: [
        { emoji: '🏷️', title: 'Dynamic Business Types', desc: 'Οι κατηγορίες εστιατορίων αποθηκεύονται στη DB — ο admin προσθέτει νέες χωρίς κώδικα' },
        { emoji: '🤖', title: 'AI Translate Types', desc: 'Μετάφραση κατηγοριών σε 6 γλώσσες με ένα κλικ' },
        { emoji: '🏛️', title: 'Google Import Activities', desc: 'Import δραστηριοτήτων από Google Places API με φωτογραφίες + AI περιγραφή' },
      ],
    },
    {
      version: 'v1.4.0',
      date: '8 Απριλίου 2026',
      highlights: 'Performance Optimization, Image Compression',
      features: [
        { emoji: '⚡', title: 'Performance Limits', desc: 'Όλα τα API calls έχουν πλέον ?limit= — ~80% μείωση μεταφοράς δεδομένων' },
        { emoji: '📸', title: 'Image Compression', desc: 'Αυτόματη συμπίεση εικόνων κατά το upload' },
        { emoji: '🔍', title: 'Google Import Photos', desc: 'Επιλογή φωτογραφιών + AI περιγραφή στο Google Import εστιατορίων' },
        { emoji: '🗺️', title: 'Area Override', desc: 'Επιλογή περιοχής κατά το Google Import' },
      ],
    },
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
