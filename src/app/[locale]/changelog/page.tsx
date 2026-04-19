import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const versions = [
    {
      version: 'v3.18.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Pricing Rules — Seasonal, Weekend, LOS, Last-Minute',
      features: [
        { emoji: '💰', title: 'Λίστα Κανόνων /dashboard/pms/pricing', desc: 'Όλοι οι κανόνες σε κάρτες με type icon (Seasonal/Weekend/Long Stay/Last-minute/Custom), Active ή Paused pill, condition summary (date range, weekdays, min nights, days before) και οικονομικό impact σε χρώμα (+prasino πρόσθεση, -kokkino έκπτωση, =ble override, ×portokali multiply)' },
        { emoji: '🎯', title: '5 Τύποι Κανόνων', desc: 'Seasonal (date range, π.χ. Peak Ιουλ-Αυγ +40%), Weekend (Πα-Κυ +20% με day pills picker), Long Stay (≥7 νύχτες -10%, ≥14 -15%), Last-minute (≤7 μέρες πριν -15%), Custom (όλα τα fields optional για hybrid rules)' },
        { emoji: '🔄', title: '4 Operations × 2 Units', desc: 'Set price (override), Add, Subtract, Multiply — με toggle μεταξύ Percentage (%) ή Absolute (€). Radio cards με icon + περιγραφή για να καταλαβαίνει κανένας τι κάνει ο κανόνας χωρίς εξήγηση' },
        { emoji: '🔍', title: 'Live Price Preview', desc: 'Βλέπεις σε real-time το "Βασική τιμή → Τελική τιμή" με % difference καθώς αλλάζεις amount/operation/unit. Χρωματισμός: emerald αν ανέβασες, rose αν κατέβασες, slate αν ίδια. Χρησιμοποιεί το listing.price_per_night' },
        { emoji: '📅', title: 'Weekday Picker', desc: '7 pill buttons (Κυ-Σα) για weekend και custom rules — tap για select/deselect. Αποθηκεύεται ως INT[] στη βάση (0=Κυριακή). Αν πατήσεις όλα τα Σα & Κυ, έχεις κλασικό Σαββατοκύριακο' },
        { emoji: '⚡', title: 'Priority + Active Toggle', desc: 'Priority 0-1000 (default 100) — υψηλότερο νούμερο υπερισχύει όταν επικαλύπτονται κανόνες. Active toggle για pause/resume χωρίς διαγραφή (π.χ. παύση winter rates το καλοκαίρι)' },
      ],
    },
    {
      version: 'v3.17.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Bookings — Λίστα Κρατήσεων + Manual Entry',
      features: [
        { emoji: '📋', title: 'Λίστα Κρατήσεων /dashboard/pms/bookings', desc: 'Όλες οι κρατήσεις σε κάρτες με dates block, status pill (Ερώτημα/Εκκρεμεί/Επιβεβαιωμένη/Έχει φτάσει/Έφυγε/Ακυρώθηκε), source dot (Direct/Airbnb/Booking/VRBO/Manual), payment pill (Απλήρωτο/Προκαταβολή/Εξοφλημένο), guest info + listing + nights + total amount — sorted με πιο πρόσφατες πάνω' },
        { emoji: '📊', title: 'Stats Σύνοψη σε 4 κάρτες', desc: 'Έρχονται (check-in στις επόμενες 7 μέρες), Τώρα στο κατάλυμα (checked-in guests), Έσοδα μήνα (confirmed + in-stay bookings του τρέχοντα μήνα), Σύνολο (όλες οι ενεργές — εκτός cancelled/blocked)' },
        { emoji: '🔎', title: 'Smart Filters', desc: 'Status pills (όλα τα 7 state), listing dropdown (όλα τα καταλύματά σου), live search σε guest_name/email/phone. Clear filters button όταν δεν ταιριάζει τίποτα' },
        { emoji: '➕', title: 'Νέα Κράτηση — Manual Entry', desc: '/dashboard/pms/bookings/new — κατάχωρηση κράτησης που ήρθε τηλεφωνικά, με email ή walk-in. 5 sections: Διαμονή (listing + dates με auto nights count), Επισκέπτης (name/email/phone/country/ενήλικες/παιδιά), Status & Source, Οικονομικά (τιμή × νύχτες + καθαριότητα + φόροι → auto total ή manual override), Σημειώσεις' },
        { emoji: '✏️', title: 'Επεξεργασία + Διαγραφή', desc: '/dashboard/pms/bookings/[id] — όλα τα πεδία editable, change status με ένα click, delete με confirm prompt. Shared <BookingForm/> component για create & edit paths' },
        { emoji: '🛑', title: 'Block Mode', desc: 'Όταν status=blocked ή source=blocked, κρύβονται guest/financials fields και εμφανίζεται μόνο "Αιτία μπλοκαρίσματος" (π.χ. συντήρηση, προσωπική χρήση) — για όταν θες να κλείσεις ημερομηνίες χωρίς guest' },
        { emoji: '💳', title: 'Payment Status Pills', desc: '5 καταστάσεις: Unpaid (rose), Deposit Paid (amber), Fully Paid (emerald), Refunded (slate), N/A. Χειροκίνητη ενημέρωση μέχρι να ενεργοποιηθεί το Stripe Connect flow' },
      ],
    },
    {
      version: 'v3.16.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Settings — Φορολογικά, Πολιτικές, Cancellation & Ειδοποιήσεις',
      features: [
        { emoji: '🧾', title: 'Φορολογικά στοιχεία σε ένα μέρος', desc: 'ΑΦΜ, ΑΜΑ (Αριθμός Μητρώου Ακινήτου βραχυχρόνιας μίσθωσης ΑΑΔΕ), συντελεστής ΦΠΑ (default 13% τουριστικός), toggle για τουριστικό φόρο με ποσό ανά διανυκτέρευση — όλα αποθηκεύονται στο pms_owner_settings και θα περιλαμβάνονται αυτόματα στα emails επιβεβαίωσης για νόμιμη τιμολόγηση' },
        { emoji: '📆', title: 'Πολιτικές Κράτησης Defaults', desc: 'Instant Book toggle (αν OFF, κάθε κράτηση περνά από έγκριση), ώρες check-in/out, min/max διανυκτερεύσεις, advance notice σε ώρες, preparation days buffer μεταξύ κρατήσεων — defaults που θα κληρονομούν όλα τα καταλύματα (per-listing overrides αργότερα)' },
        { emoji: '❌', title: 'Cancellation Policy 4-in-1', desc: 'Radio cards για Ευέλικτη (24h πριν) / Μέτρια (7 μέρες πριν) / Αυστηρή (no refund) / Custom (δικά σου λόγια με textarea) — θα εμφανίζεται στο public listing και στα emails επιβεβαίωσης κράτησης' },
        { emoji: '💳', title: 'Payments Preview', desc: 'Stripe Connect status card (read-only μέχρι να ολοκληρωθεί το OAuth onboarding flow), deposit percentage (default 20%), balance due days before check-in (default 14) — ready για όταν ενεργοποιηθεί direct bookings με 0% commission' },
        { emoji: '🔔', title: 'Ειδοποιήσεις Owner', desc: 'Reply-to email για guests (fallback στο account email αν κενό), τηλέφωνο ειδοποιήσεων, SMS toggle (coming soon) — πού να βρίσκουν τον owner οι guests και πού να φτάνουν τα alerts για νέες κρατήσεις' },
        { emoji: '🎨', title: 'Color-Coded Sections', desc: '5 κάρτες με ξεχωριστή παλέτα ring+icon (amber tax, sky booking, rose cancellation, emerald payments, violet notifications), sticky save bar σε mobile (fixed bottom) + inline σε desktop, upsert με onConflict: owner_id — single atomic save για όλο το form' },
      ],
    },
    {
      version: 'v3.15.1',
      date: '19 Απριλίου 2026',
      highlights: 'Bug Fix — PMS Calendar έδειχνε "Δεν έχεις listings ακόμα"',
      features: [
        { emoji: '🐛', title: 'Query ζητούσε ανύπαρκτη column', desc: 'Το /dashboard/pms/calendar έστελνε select στη column listings.is_active που δεν υπάρχει (το schema έχει status: draft/published/archived) — η Postgres γύριζε 42703 "column does not exist" και η σελίδα έπεφτε στο empty state παρόλο που ο owner είχε καταχωρημένο κατάλυμα. Αλλαγή σε status + error surfacing + fallback link στο /dashboard/listings' },
      ],
    },
    {
      version: 'v3.15.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Calendar — Ένα Ημερολόγιο ανά Κατάλυμα',
      features: [
        { emoji: '📅', title: 'Stacked Sections — Ένα Calendar per Listing', desc: 'Το /dashboard/pms/calendar δεν δείχνει πλέον ένα μόνο ημερολόγιο με dropdown επιλογής καταλύματος — δείχνει ξεχωριστή ενότητα για κάθε κατάλυμα του owner, στοιβαγμένες κάθετα. Κάθε section έχει δικά της feeds, export URL, block-dates, event details — όλα ανεξάρτητα μεταξύ τους' },
        { emoji: '📱', title: 'Mobile-First Layout', desc: 'Grid που στοιβάζει σε mobile (feeds panel πάνω, calendar κάτω) και γίνεται side-by-side σε desktop (340px feeds | rest calendar). Το μηνιαίο navigation και το χρωματικό legend είναι shared και sticky στο top' },
        { emoji: '🔄', title: 'Next.js 16 Proxy Migration', desc: 'Το deprecated middleware.ts μετονομάστηκε σε src/proxy.ts σύμφωνα με την Next.js 16 convention. Χωρίς αυτό το rename, όλα τα locale-less URLs (/auth/login, /listings, /dashboard) επέστρεφαν 404 — το next-intl locale routing δεν έτρεχε καθόλου. Now back to normal' },
      ],
    },
    {
      version: 'v3.14.1',
      date: '19 Απριλίου 2026',
      highlights: 'Bug Fix — Password Reset Email Έβγαζε σε localhost:3000',
      features: [
        { emoji: '🐛', title: 'Bypass του Supabase Redirect Flow', desc: 'Το /auth/v1/verify του Supabase αγνοούσε το δικό μας redirect_to (δεν ήταν στο allow-list των Redirect URLs) και έπεφτε πίσω στο project Site URL που ήταν http://localhost:3000 — ο χρήστης κατέληγε σε σελίδα που δεν υπάρχει στο production. Το email link τώρα δείχνει απευθείας στο /auth/reset-password με token_hash και η σελίδα κάνει verifyOtp στο client, χωρίς περάσμα από τον Supabase verify endpoint' },
      ],
    },
    {
      version: 'v3.14.0',
      date: '19 Απριλίου 2026',
      highlights: 'Super-Admin — One-Click Password Reset Email per User',
      features: [
        { emoji: '🔑', title: 'Password Reset Button στο /admin/users', desc: 'Νέο εικονίδιο κλειδιού δίπλα από κάθε χρήστη στο admin users table — ένα κλικ στέλνει στον χρήστη email επαναφοράς κωδικού. Με confirm prompt + loading spinner + activity log entry' },
        { emoji: '✉️', title: 'Branded Recovery Email', desc: 'Νέο /api/admin/send-password-reset endpoint — δημιουργεί recovery link μέσω Supabase admin API και το στέλνει με το υπάρχον Gmail SMTP. Branded HTML template (teal gradient header, CTA button, fallback link, security note) ίδιου στιλ με τα QR emails' },
        { emoji: '🔐', title: 'Νέα /auth/reset-password Σελίδα', desc: 'Public landing page όπου καταλήγει ο χρήστης από το email — διαβάζει tokens από το URL hash, κάνει setSession, ζητά νέο κωδικό (≥6 χαρακτήρες, με confirm field), redirect στο login μετά την επιτυχή αλλαγή' },
      ],
    },
    {
      version: 'v3.13.1',
      date: '18 Απριλίου 2026',
      highlights: 'Bug Fix — Type Filter Pages Έδειχναν Μόνο τα 50 Πιο Πρόσφατα',
      features: [
        { emoji: '🐛', title: 'Όλα τα Καταλύματα στο /listings/type/*', desc: 'Το /listings/type/with-pool (και όλες οι type-filter σελίδες: sea-view, pet-friendly, family, budget, luxury) ζητούσε μόνο 50 καταλύματα — όσα έχουμε πλέον > 50 publishes, τα παλαιότερα κόβονταν ΠΡΙΝ εφαρμοστεί το client-side φίλτρο. Αποτέλεσμα: καταλύματα με πισίνα σαν το Thespis Villa 2 λείπανε. Αφαιρέθηκε το limit για να ταιριάζει με τη συμπεριφορά του /listings' },
      ],
    },
    {
      version: 'v3.13.0',
      date: '17 Απριλίου 2026',
      highlights: 'Free Social Media Kit Auto-Generator per Listing',
      features: [
        { emoji: '🎨', title: 'Social Media Kit', desc: 'Νέα σελίδα /dashboard/listings/[id]/social-kit — ο owner κατεβάζει με ένα κλικ ZIP με 3 έτοιμα γραφιστικά (Instagram Square 1080×1080, Instagram Story 1080×1920, Facebook/X Card 1200×630) φτιαγμένα από τη cover + title + tagline + location του καταλύματος' },
        { emoji: '📱', title: 'QR σε κάθε Graphic', desc: 'Κάθε εικόνα περιέχει branded QR code που δείχνει στη σελίδα του listing (/listings/[slug]) — όποιος το σκανάρει πάει κατευθείαν στην κράτηση' },
        { emoji: '📝', title: 'Ready-to-Post Caption', desc: 'Έτοιμο ελληνικό κείμενο με emojis, hashtags (#Halkidiki #ChalkidikiHub #VisitGreece) + copy button — για γρήγορο share χωρίς να γράφει τίποτα ο owner' },
        { emoji: '📦', title: 'ZIP Bundle + README', desc: 'Lazy-loaded JSZip φτιάχνει client-side το ZIP με τα 3 PNGs + README.txt που έχει filenames, dimensions, platform mapping και το caption' },
        { emoji: '⚡', title: 'Edge Runtime + Satori', desc: '/api/social-kit/[format] τρέχει σε edge με next/og ImageResponse — base64-embedded cover + QR (api.qrserver.com), όχι Node-only APIs. 5-10 min browser cache για γρήγορο preview' },
        { emoji: '🎓', title: 'First-Visit Onboarding', desc: '3-step modal (Welcome → 3 formats, 1 click → Γιατί έχει σημασία) + 30s "How it works" + 6 benefit tiles + FAQ accordion + bottom CTA — explains γιατί αξίζει χωρίς jargon' },
        { emoji: '🔗', title: 'Entry στο Dashboard Listings', desc: 'Νέο pink-rose gradient κουμπί "Social Kit" δίπλα στο QR button σε κάθε listing card — όχι κρυμμένο σε menu' },
      ],
    },
    {
      version: 'v3.12.0',
      date: '17 Απριλίου 2026',
      highlights: 'Owner UX Overhaul + Analytics Beta + Clean Translation Split',
      features: [
        { emoji: '🪄', title: 'Dashboard Listings Redesign', desc: 'Cards με cover thumbnail, Ενεργό/Κλειστό pill, labeled action bar (Στοιχεία, Site, Ημερολόγιο, QR, Στατιστικά), search + status pills με live counts' },
        { emoji: '📱', title: 'QR Code Marketing Boost', desc: 'Full-width dismissible promo banner + purple→fuchsia gradient button "QR για επισκέπτες" με pulsing amber dot — αντικαθιστά το invisible icon' },
        { emoji: '🔒', title: 'Translation Moved to Admins', desc: 'Owners γράφουν μόνο ελληνικά. Αφαιρέθηκαν ~540 γραμμές AI translation UI από FaqsEditor, EmergencyContactsEditor, HouseRulesEditor, PracticalInfoEditor, ExtrasEditor, PhotoCaptionsEditor, ClosedStateEditor + brand page' },
        { emoji: '🌐', title: 'Admin Brand Editor Expanded', desc: '13 multilingual fields × 7 locales = 91 cells σε ένα side-by-side editor: title, description, tagline, owner_story, closed_reason, house_rules_extra, how_to_reach, wifi_info, parking_info, check_in_info, meta_title, meta_description, image_alt' },
        { emoji: '📊', title: 'Analytics Dashboard (Beta)', desc: '/dashboard/listings/[id]/analytics με seeded deterministic demo data: 30-day sparkline (inline SVG), country/source/language breakdown, click actions ranking, stat cards με period deltas' },
        { emoji: '🎯', title: 'Clean Sidebar', desc: 'Αφαιρέθηκαν "Ημερολόγια" + "Φτιάξε το site σου" από owner menu — όλα accessible από cards, λιγότερα menu items' },
        { emoji: '🛡️', title: 'Resilient Queries', desc: 'select("*") pattern στο my-listings survives schema drift — αν λείπει column, το page δεν σκάει, δείχνει error banner με hint' },
        { emoji: '🗄️', title: 'Migration 030', desc: 'image_alt_{7 locales} στο listings table + backfill του single image_alt στο image_alt_el' },
      ],
    },
    {
      version: 'v3.11.0',
      date: '17 Απριλίου 2026',
      highlights: 'Temporarily Closed Flag per Listing',
      features: [
        { emoji: '🔒', title: 'Is-Closed Toggle', desc: 'Owners μπορούν να κλείσουν προσωρινά το κατάλυμα (σεζόν, ανακαίνιση, προσωπικοί λόγοι) χωρίς να το διαγράψουν ή να κάνουν unpublish' },
        { emoji: '📅', title: 'Reopening Date + Reason', desc: 'Optional ημερομηνία επαναλειτουργίας + αιτιολογία (π.χ. "Ανακαίνιση — επανερχόμαστε Απρίλιο 2026") σε 7 γλώσσες' },
        { emoji: '🎨', title: 'Closed Banner στο /stay', desc: 'Amber-to-orange gradient banner στην κορυφή της σελίδας όταν το κατάλυμα είναι κλειστό — contact buttons παραμένουν για μελλοντικές κρατήσεις' },
        { emoji: '🏷️', title: 'Κλειστό Chip Παντού', desc: 'Visible chip στο /dashboard/listings cards, site-builder hub, admin brand-sites — καθαρή διάκριση από draft/published status' },
        { emoji: '🗄️', title: 'Migration 029', desc: 'listings.is_closed (boolean, default false) + listings.reopening_date + closed_reason_{7 locales}' },
      ],
    },
    {
      version: 'v3.10.0',
      date: '17 Απριλίου 2026',
      highlights: 'Admin Brand Sites Manager + Multilingual Editor + SEO Generator',
      features: [
        { emoji: '🏠', title: '/admin/brand-sites Hub', desc: 'Super-admin βλέπει όλα τα brand pages: coverage badges ανά γλώσσα (x/7), completeness score 0–6, search + area filter, counts για FAQs / Emergency / Extras / Captions' },
        { emoji: '🌍', title: 'Side-by-Side 7-Language Editor', desc: 'Νέο MultilangField component: tabs ανά γλώσσα με ✓ checkmark όταν έχει content, coverage x/7, per-field "Fill missing" button που γεμίζει ελλείπουσες γλώσσες με AI' },
        { emoji: '✨', title: 'Bulk "Translate Missing" Action', desc: 'Ένα κλικ περπατάει όλα τα fields × 6 locales και γεμίζει ελλείπουσες μεταφράσεις από EL ή EN fallback — 54+ translations σε ένα save' },
        { emoji: '🔍', title: 'AI SEO Meta Generator', desc: 'Νέο /api/ai/generate-seo endpoint: GPT-4o-mini παράγει meta_title (55-60 chars) + meta_description (140-160 chars) σε όλες τις 7 γλώσσες — benefit-focused, preserves proper nouns' },
        { emoji: '👥', title: 'Site-Builder για Admins', desc: 'Super-admin στο /dashboard/site-builder βλέπει πλέον ΟΛΑ τα καταλύματα (όχι μόνο τα δικά του) με violet "Admin mode" banner + owner email chip σε κάθε card' },
      ],
    },
    {
      version: 'v3.9.0',
      date: '17 Απριλίου 2026',
      highlights: 'House Rules + Practical Info + Extras + Photo Captions + Nearby Overrides',
      features: [
        { emoji: '🛡️', title: 'House Rules', desc: 'Check-in/out times, κάπνισμα (allowed/outside/no), κατοικίδια (allowed/on_request/no), πάρτι, παιδιά, ώρες κοινής ησυχίας + free-text extras. Pill-button selectors για κάθε κανόνα' },
        { emoji: 'ℹ️', title: 'Practical Info', desc: '4 textareas: Πώς θα φτάσετε, Οδηγίες check-in, Wi-Fi, Στάθμευση. Εμφανίζονται σε 2×2 grid cards στο /stay page' },
        { emoji: '✨', title: 'Extras & Services', desc: 'Unlimited add-ons με 9 icon types (Πρωινό, Μεταφορά, Καθαριότητα, Ποδήλατο, Σκάφος, Spa κ.λπ.), τιμή + μονάδα (ανά διαμονή/βράδυ/άτομο/χρήση) ή "Περιλαμβάνεται δωρεάν"' },
        { emoji: '📸', title: 'Photo Captions', desc: 'Λεζάντες ανά φωτογραφία, εμφανίζονται σε hover overlay στη gallery του /stay. Helps SEO alt text + guest context' },
        { emoji: '🗺️', title: 'Nearby Overrides', desc: 'Auto-computed λίστα κοντινών παραλιών/εστιατορίων/δραστηριοτήτων/χωριών με Haversine. Owner μπορεί να hide/unhide individual items' },
        { emoji: '🗄️', title: 'Migration 028', desc: 'listings.check_in_time, rule_*, quiet_hours_*, house_rules_extra_{7}, how_to_reach_{7}, wifi_info_{7}, parking_info_{7}, check_in_info_{7} + listing_images.caption_{7} + new listing_extras table' },
      ],
    },
    {
      version: 'v3.8.0',
      date: '17 Απριλίου 2026',
      highlights: 'FAQs CRUD + Emergency Contacts + Legal Compliance',
      features: [
        { emoji: '❓', title: 'FAQs με FAQPage Schema', desc: 'Owners προσθέτουν custom Q&A — inline FAQPage microdata (Schema.org Question/Answer) στο /stay → Google rich results με expandable FAQ carousel στα SERP' },
        { emoji: '🚨', title: 'Emergency Contacts', desc: '6 default ΕΕ/Ελλάδας numbers εμφανίζονται ΠΑΝΤΑ (112, 100 Αστυνομία, 166 ΕΚΑΒ, 199 Πυροσβεστική, 108 Λιμενικό, 10135 Δηλητηριάσεις) + owner adds τοπικές επαφές' },
        { emoji: '⚖️', title: 'Greek Legal Compliance Info', desc: 'Amber info banner στον editor: "Σύμφωνα με Ν. 4276/2014 (τουριστικά καταλύματα), Ν. 4179/2013, κανονισμούς πυρασφάλειας…" — καλή πρακτική για βραχυχρόνιες μισθώσεις' },
        { emoji: '📱', title: 'Tap-to-Call Everywhere', desc: 'Κάθε τηλέφωνο είναι <a href="tel:…"> — ο guest πατάει και καλεί κατευθείαν από το κινητό του' },
        { emoji: '🗄️', title: 'Migration 027', desc: 'listing_emergency_contacts table: icon_key (10 types), phone, label_{7 locales}, notes_{7 locales}. RLS: public SELECT, owner/admin write' },
      ],
    },
    {
      version: 'v3.7.0',
      date: '17 Απριλίου 2026',
      highlights: 'Dedicated /stay/[slug] Brand Page',
      features: [
        { emoji: '✨', title: 'Standalone Brand Site', desc: 'Κάθε κατάλυμα αποκτά δική του full-bleed σελίδα στο /stay/[slug], τελείως διαφορετική εμπειρία από το απλό /listings/[slug] directory entry' },
        { emoji: '🖼️', title: 'Hero with Personality', desc: '70vh full-width cover image, italic tagline, sticky facts bar (guests · beds · baths · price), contact CTAs (WhatsApp, phone, email)' },
        { emoji: '📖', title: 'Story-Driven Layout', desc: 'Sections με ιεραρχία: Our Story (gradient centered) → Gallery → Description → Amenities → What\'s Nearby → Map → Availability → FAQs → Contact CTA → Emergency' },
        { emoji: '🔗', title: 'Smart Sitemap', desc: '/stay/{slug} URLs εμφανίζονται στο sitemap ΜΟΝΟ όταν ο owner έχει γράψει tagline ή story — αποφεύγει duplicate content με /listings' },
        { emoji: '🎯', title: 'Directory Cross-Link', desc: 'Gradient pill "Δείτε το site του καταλύματος →" στο /listings όταν το listing έχει brand content' },
      ],
    },
    {
      version: 'v3.6.0',
      date: '17 Απριλίου 2026',
      highlights: 'Brand Page Tier-1: Tagline, Our Story, Auto Nearby, FAQs Display',
      features: [
        { emoji: '🎯', title: 'Tagline / Σλόγκαν', desc: 'Μικρή φράση (~80 chars) κάτω από τον τίτλο του καταλύματος. Είναι το πρώτο πράγμα που τραβά το μάτι του επισκέπτη' },
        { emoji: '📖', title: '"Η ιστορία μας"', desc: 'Προσωπική αφήγηση του owner για το κατάλυμα (gradient card). Differentiator που κανένα listing site δεν προσφέρει' },
        { emoji: '🌍', title: 'Auto "What\'s Nearby"', desc: 'Haversine distance calculation με lat/lng bounding box — εμφανίζει nearest παραλίες, εστιατόρια, δραστηριότητες, χωριά με αποστάσεις σε km/m' },
        { emoji: '🗺️', title: 'Nearby API Endpoint', desc: 'Νέο /api/nearby?listing_id=X — returns grouped results, respects owner overrides (hidden items + custom notes)' },
        { emoji: '❓', title: 'FAQ Display', desc: 'Accordion με FAQPage JSON-LD στο /stay. CRUD editor έρχεται στο v3.8' },
        { emoji: '🤖', title: 'Translate-Fields API', desc: 'Generic /api/ai/translate-fields endpoint: send {sourceLocale, fields: {name: text…}}, get back 6-locale translations per field. GPT-4o-mini με JSON response format' },
        { emoji: '🗄️', title: 'Migration 026', desc: 'listings.tagline_{7} + owner_story_{7} + listing_faqs table + listing_nearby_overrides table (owner can hide/reorder auto-suggestions)' },
      ],
    },
    {
      version: 'v3.5.0',
      date: '17 Απριλίου 2026',
      highlights: 'Calendars Hub + Public Visibility Toggle',
      features: [
        { emoji: '📅', title: 'New Calendars Hub', desc: 'Dashboard → Ημερολόγια → βλέπεις όλα τα καταλύματα σου με blocked-days counter ανά κατάλυμα' },
        { emoji: '👁️', title: 'Show Calendar Toggle', desc: 'Eye/EyeOff toggle per listing — default OFF (safe for existing listings), owner opt-in. Ελέγχει αν το calendar εμφανίζεται στο /listings directory page' },
        { emoji: '🔓', title: 'Always on /stay', desc: 'Στην προσωπική σελίδα /stay/[slug] το calendar εμφανίζεται ΠΑΝΤΑ — το toggle αφορά μόνο το directory listing' },
        { emoji: '🗄️', title: 'Migration 025', desc: 'listings.show_calendar boolean NOT NULL DEFAULT false' },
      ],
    },
    {
      version: 'v3.4.0',
      date: '17 Απριλίου 2026',
      highlights: 'Availability Calendar για Listings',
      features: [
        { emoji: '📆', title: 'Owner Calendar Editor', desc: '3-month grid με click-to-toggle: 🟠 Μπλοκαρισμένη, 🔴 Κρατημένη, 🟢 Διαθέσιμη. Batch save με pending-changes counter, bulk clear all, past dates disabled, today highlighted' },
        { emoji: '👀', title: 'Public Mini Calendar', desc: '2-month read-only view στο listing page — άσπρα cells = διαθέσιμη, κόκκινα = μη διαθέσιμη. Localized month/day names για όλες τις 7 γλώσσες' },
        { emoji: '📱', title: 'Mobile Tap Targets', desc: 'Responsive grid, touch-friendly buttons, active:scale-98 feedback' },
        { emoji: '🔐', title: 'RLS Security', desc: 'listing_availability table με public read + owner/admin write policies — RLS ελέγχει ότι δεν πειράζει κανένας κάποιο άλλο listing' },
        { emoji: '🗄️', title: 'Migration 024', desc: 'Νέα listing_availability table με (listing_id, date, status ∈ {blocked,booked}, note). Unique (listing_id, date), auto-updated timestamps' },
      ],
    },
    {
      version: 'v3.3.0',
      date: '17 Απριλίου 2026',
      highlights: '9 Νέοι SEO Hook Guides: Comparisons + Niche + Practical Tips',
      features: [
        { emoji: '⚖️', title: 'Halkidiki vs Crete', desc: 'Σύγκριση με την Κρήτη: παραλίες, πρόσβαση, κόστος, φαγητό, ποιος νικάει. Target: "Halkidiki vs Crete" keyword' },
        { emoji: '⚖️', title: 'Halkidiki vs Rhodes', desc: 'Σύγκριση με τη Ρόδο — ιστορία, παραλίες, κλίμα, κόστος διαμονής' },
        { emoji: '⚖️', title: 'Halkidiki vs Corfu', desc: 'Ιόνιο vs Αιγαίο — climate, beaches, access, Venetian architecture' },
        { emoji: '👵', title: 'For Seniors', desc: 'Guide για ηλικιωμένους: εύκολη πρόσβαση, ήρεμες παραλίες, ιατρικές υπηρεσίες, all-inclusive resorts' },
        { emoji: '💑', title: 'For Couples', desc: 'Πέρα από honeymoon — ρομαντικές παραλίες, δείπνα με θέα, ιδανική περίοδος (Μάιος/Σεπτέμβριος)' },
        { emoji: '🧳', title: 'For Solo Travelers', desc: 'Ασφάλεια, μεταφορές KTEL, social spots, budget €60-100/μέρα, πού να μείνεις' },
        { emoji: '💡', title: 'Halkidiki Tips', desc: '20+ insider tips: booking timing, beaches, food, exploration, practical — με εσωτερικούς συνδέσμους σε /guide/*' },
        { emoji: '⚠️', title: 'Mistakes to Avoid', desc: 'Συχνά λάθη τουριστών (last-minute booking, only Kassandra, tourist trap restaurants, no cash)' },
        { emoji: '🛡️', title: 'Scams to Avoid', desc: 'Taxi meter, menu χωρίς τιμές, "free" loungers, DCC σε κάρτες, fake "τοπικό" λάδι — πώς να προστατευτείς' },
        { emoji: '📊', title: '63 Νέα SEO URLs', desc: '9 guides × 7 γλώσσες στο sitemap. Όλα με Article + BreadcrumbList JSON-LD + εσωτερικά links' },
      ],
    },
    {
      version: 'v3.2.5',
      date: '17 Απριλίου 2026',
      highlights: 'SEO Hook Pages Expansion: +126 Travel / Itinerary / Cost URLs',
      features: [
        { emoji: '🚗', title: 'Travel from [City] Pages', desc: '8 νέες σελίδες: από Σόφια, Βουκουρέστι, Βελιγράδι, Θεσσαλονίκη, Μόναχο, Κωνσταντινούπολη, Σκόπια, Αθήνα. Πλούσιο περιεχόμενο με internal links, χρόνοι διαδρομής, συμβουλές' },
        { emoji: '📅', title: 'Itinerary Pages', desc: '5 μέρες, 7 μέρες, 10 μέρες, 3 μέρες, weekend — detailed day-by-day planning με εσωτερικούς συνδέσμους σε beaches/restaurants/villages' },
        { emoji: '💶', title: 'Cost Guide Pages', desc: '5 budget guides: daily budget, food prices, accommodation prices, car rental prices, family budget — πραγματικές τιμές για Χαλκιδική 2026' },
        { emoji: '🔗', title: 'Internal Linking Strategy', desc: 'Κάθε νέα σελίδα έχει 2-4 internal links προς beaches / restaurants / activities / villages / άλλους guides → traffic funneling στο κεντρικό site' },
        { emoji: '🌐', title: '+126 SEO URLs', desc: '18 slugs × 7 γλώσσες = 126 νέα sitemap entries με Article + BreadcrumbList JSON-LD' },
        { emoji: '🧹', title: 'Cleanup Fixes', desc: 'Redesigned villages grid στο /areas για mobile (uniform 2-column cards), new /places index page, ItemList JSON-LD για rich results, Mega.webp orphan removed' },
      ],
    },
    {
      version: 'v3.2.0',
      date: '14 Απριλίου 2026',
      highlights: 'Performance Overhaul, Keyword SEO Articles, Smart Search, Auth Fix',
      features: [
        { emoji: '⚡', title: 'ISR + Server-Side Data', desc: 'Όλες οι σελίδες (collection + detail) φορτώνουν server-side — zero skeleton flash, 10x γρηγορότερο πρώτο load' },
        { emoji: '🖼️', title: 'next/image Παντού', desc: 'Όλα τα cards + blog images χρησιμοποιούν next/image — auto WebP/AVIF, responsive srcSet, 60% μικρότερα αρχεία' },
        { emoji: '🔄', title: 'On-Demand Revalidation', desc: 'Νέο /api/revalidate — admin save → instant cache purge σε 7 γλώσσες. ISR 1 ώρα + on-demand = 95% λιγότερα writes' },
        { emoji: '📦', title: 'generateStaticParams', desc: '571+ restaurants, 100+ beaches, 70+ activities pre-built στο deploy — zero latency στο πρώτο visit' },
        { emoji: '🔍', title: 'Server-Side Search', desc: 'Νέο /api/search — GlobalSearch κάνει 1 debounced call αντί 5 full-data fetches. -70% bandwidth' },
        { emoji: '🔗', title: 'Combined Related Content API', desc: 'Detail pages κάνουν 1 fetch αντί 3-4 — /api/related-content endpoint. -200-400ms ανά σελίδα' },
        { emoji: '📜', title: 'Script Optimization', desc: 'Google Analytics/AdSense χρησιμοποιούν next/script lazyOnload αντί blocking <script> tags' },
        { emoji: '🔑', title: '20 Keyword SEO Articles', desc: 'Generator 20 θεματικών articles γύρω από bold keywords χωριών — 246 keywords → auto internal links' },
        { emoji: '🌐', title: 'Blog Translation Fix', desc: 'Batch translation (2 γλώσσες/κλήση × 3 batches) — δεν σκάει σε μεγάλα κείμενα + progress indicator' },
        { emoji: '🔐', title: 'Admin Auth Rewrite', desc: 'requireSuperAdmin() χρησιμοποιεί @supabase/ssr αντί manual cookie parsing — φτιάχνει delete user, send email, reviews' },
        { emoji: '🤖', title: 'OpenAI Retry Logic', desc: 'Όλα τα 6 AI routes: auto-retry, rate limit handling (429), empty response validation' },
        { emoji: '🗺️', title: 'OSM Preconnect', desc: 'Preconnect + dns-prefetch για OpenStreetMap tiles — πιο γρήγοροι χάρτες' },
        { emoji: '💾', title: 'Vercel Limits Fix', desc: 'ISR revalidate 60s → 3600s — μείωση 95% ISR writes (171K/200K → ~5K/μήνα)' },
        { emoji: '🏖️', title: 'Charger Slug Fetch', desc: '/api/chargers?slug=X — fetch μόνο 1 charger αντί όλους' },
        { emoji: '🖼️', title: 'Lightbox Lazy Loading', desc: 'ImageGallery modal image χρησιμοποιεί loading="lazy"' },
      ],
    },
    {
      version: 'v3.1.0',
      date: '12 Απριλίου 2026',
      highlights: 'SEO Overhaul, Dynamic OG Images, Google AdSense, Airbnb Import',
      features: [
        { emoji: '🔍', title: 'SEO Overhaul', desc: 'OG images, metadata σε όλες τις σελίδες, breadcrumbs, split sitemap, canonical URLs' },
        { emoji: '🖼️', title: 'Dynamic OG Images', desc: 'Αυτόματα generated Open Graph images ανά σελίδα για social sharing' },
        { emoji: '💰', title: 'Google AdSense', desc: 'Ενσωμάτωση Google AdSense (ca-pub-9694572418424066) + ads.txt' },
        { emoji: '🏠', title: 'Import Airbnb/Booking', desc: 'Import listings από Airbnb/Booking URL στο admin — auto-parse τίτλο, φωτό, amenities' },
        { emoji: '🇷🇸', title: 'Serbian στο Blog', desc: 'SR tabs σε blog edit, title/excerpt/content/SEO translations' },
        { emoji: '📝', title: 'Village Article Generator', desc: 'AI blog articles ανά χωριό + Beach Article Generator ανά παραλία' },
        { emoji: '🔗', title: 'Auto Internal Links HTML', desc: 'Auto-linking λειτουργεί και σε HTML blog articles (όχι μόνο markdown)' },
        { emoji: '🛡️', title: 'Full i18n', desc: 'Μετάφραση 25+ αρχείων hardcoded text σε 7 γλώσσες' },
        { emoji: '📐', title: '308 Redirects', desc: 'Αλλαγή 307→308 permanent redirects για καλύτερο SEO' },
        { emoji: '🔎', title: 'Admin Search & Filters', desc: 'Αναζήτηση + φίλτρα σε beaches, restaurants, activities, blog admin pages' },
        { emoji: '⚡', title: '2-Step Article Generation', desc: 'Article generators σπασμένοι σε 2 βήματα — αποφεύγουν Vercel timeout' },
      ],
    },
    {
      version: 'v3.0.0',
      date: '11 Απριλίου 2026',
      highlights: 'Serbian Language, Hero Image, Full SEO Audit, 4,000+ URLs',
      features: [
        { emoji: '🇷🇸', title: 'Σερβικά (7η γλώσσα)', desc: 'Πλήρης υποστήριξη Σερβικών: UI, DB columns, AI translations, SEO meta, sitemap — 573 νέα URLs' },
        { emoji: '🖼️', title: 'Hero Background Image', desc: 'Ρυθμιζόμενη background εικόνα στο hero section της αρχικής σελίδας μέσω admin Settings' },
        { emoji: '🔍', title: 'Full SEO Audit & Fix', desc: 'Hreflang 7 γλωσσών σε ΟΛΕΣ τις σελίδες, canonical URLs, meta titles σε SR, terms/privacy/map metadata' },
        { emoji: '⛪', title: 'Mount Athos SR', desc: 'Πλήρης μετάφραση οδηγού Αγίου Όρους στα Σερβικά — 8 σελίδες + 20 μονές' },
        { emoji: '🤖', title: 'AI 7 Languages', desc: 'AI Auto-Complete, Bulk Fill, Auto-Blog — όλα υποστηρίζουν 7 γλώσσες + undefined guard' },
        { emoji: '📊', title: '4,011 Sitemap URLs', desc: '573 σελίδες × 7 γλώσσες = 4,011 URLs στο sitemap, 0 errors' },
      ],
    },
    {
      version: 'v2.5.0',
      date: '10 Απριλίου 2026',
      highlights: 'Seasonal Guides, Listing Types, Broken Links Scanner, Blog Fix',
      features: [
        { emoji: '🗺️', title: 'Seasonal Guides', desc: '7 θεματικοί οδηγοί (summer, easter, honeymoon, families, budget, winter, nightlife) × 6 γλώσσες = 42 URLs' },
        { emoji: '🏠', title: 'Listing Type Pages', desc: '6 τύποι καταλυμάτων (pool, sea-view, pet-friendly, family, budget, luxury) × 6 γλώσσες = 36 URLs' },
        { emoji: '🔗', title: 'Broken Links Scanner', desc: 'Νέο εργαλείο στο admin — σκανάρει εσωτερικούς links σε όλο το content, βρίσκει broken' },
        { emoji: '📝', title: 'Blog HTML Fix', desc: 'AI articles τώρα renderάρονται σωστά με HTML formatting αντί raw tags' },
        { emoji: '🤖', title: 'Auto-Blog Fix', desc: 'Κάθε κλικ = διαφορετικό άρθρο (topic rotation βάσει count), Unsplash photos' },
      ],
    },
    {
      version: 'v2.4.0',
      date: '10 Απριλίου 2026',
      highlights: 'Best Of Guides, Auto-Blog Settings, Unsplash Photos',
      features: [
        { emoji: '🏆', title: 'Best Of Guide Pages', desc: '12 οδηγοί (beaches, restaurants, activities per area/theme) × 6 γλώσσες = 72 SEO URLs' },
        { emoji: '⚙️', title: 'Auto-Blog Settings', desc: 'On/Off, συχνότητα (ώρες), ώρα εκτέλεσης — ρυθμιζόμενα από admin Settings' },
        { emoji: '📸', title: 'Unsplash Photos', desc: 'AI articles αυτόματα βρίσκουν σχετική φωτογραφία μέσω Unsplash API' },
        { emoji: '✍️', title: 'Rich Formatting', desc: 'AI articles με h2/h3/lists/blockquote/bold — travel blog style' },
        { emoji: '🔒', title: 'Auth Fix', desc: 'Auto-blog auth μέσω Bearer token + admin client role check' },
      ],
    },
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
