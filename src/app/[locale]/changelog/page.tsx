import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const versions = [
    {
      version: 'v3.41.0',
      date: '17 Ιουνίου 2026',
      highlights: 'AdSense re-submission readiness: hidden locales (sitemap/hreflang/UI cleanup σε EL+EN), feature-flag gated AdSense + external booking links, auto-noindex thin pages, schema dedup. 12 παραλίες χειροκίνητα enriched με sourced research. Cost cuts ~70-90% στο Vercel (sitemap TTL 48h, page ISR 24h, blocked aggressive crawlers). Νέο dashboard UX για owners με completeness score, photo/description nudges, και aggregated health banner.',
      features: [
        { emoji: '🌐', title: 'publicLocales = [el, en] — οι 5 ασθενείς γλώσσες κρύφτηκαν', desc: 'Νέο `publicLocales` array στο `src/i18n/config.ts` (διαχωρίζει από το πλήρες `locales` που έμεινε για routing). Sitemap, hreflang alternates, language switcher, llms.txt, και robots.txt εκπέμπουν πλέον μόνο el+en. Hidden locales (de/bg/ru/ro/sr) παραμένουν routable για inbound links αλλά εκπέμπουν αυτόματα robots noindex,nofollow μέσω του [locale]/layout.tsx και Disallow στο robots.txt. ~50 αρχεία ενημερωμένα μαζί ώστε το hreflang να μη διαφεύγει. Από ~3.500 indexable URLs → 2.441 (-30% crawl surface χωρίς απώλεια χρηστικού content).' },
        { emoji: '🚦', title: 'Feature flags για AdSense + external booking links (reversible)', desc: 'Νέο `src/lib/feature-flags.ts` με δύο NEXT_PUBLIC_* gates. `ADSENSE_ENABLED` ελέγχει lazy-loading του adsbygoogle.js μετά από first interaction — off κατά τη review, on όταν εγκριθείς. `EXTERNAL_BOOKING_LINKS_ENABLED` αφαιρεί Booking.com/Airbnb URLs από UI buttons, auto-generated FAQ, /api/md markdown endpoint και RSC hydration payload (4 ξεχωριστά surfaces) — εξαφανίζει το affiliate-aggregator signal που τράβηξε το "Low value content" rejection. Reversible μέσω env vars χωρίς code change.' },
        { emoji: '🚫', title: 'Auto-noindex thin pages — beaches/listings/restaurants/activities', desc: 'Επέκταση του `thinThreshold` hook στο `getContentMeta` για να καλύπτει όλους τους κύριους τύπους περιεχομένου. Thresholds: beaches 800 chars, listings 300 (bumped από 200), restaurants 400, activities 300. Σελίδες κάτω από το όριο εκπέμπουν αυτόματα `robots: noindex, follow` ώστε το PageRank συνεχίζει να ρέει αλλά η σελίδα δεν εμφανίζεται στο Google search. Reversible: μόλις ο owner/admin επεκτείνει την περιγραφή, η σελίδα re-indexάρεται στο επόμενο crawl. Initial impact: 17 thin beaches (από 130) + 3 thin listings (από 100) noindex-αρίστηκαν.' },
        { emoji: '🏷️', title: 'Schema dedup + BreadcrumbList παντού', desc: 'Detail σελίδες (Beach/Restaurant/Listing/Article) εκπέμπανε τα δικά τους JSON-LD blocks και από το route page.tsx και από το inner Dynamic*Detail component → duplicate schemas στο HTML. Καθαρίστηκε σε 4 components. Area σελίδες (/areas/[slug]) δεν εκπέμπανε BreadcrumbList → προστέθηκε. Homepage εκπέμπε 3 ξεχωριστά Organization+WebSite blocks (canonical του layout + standalone) που διαφήμιζαν "7 languages" — διαγράφηκαν τα duplicates, μένει μόνο το canonical @graph. Google Rich Results test καθαρό σε 7 page types.' },
        { emoji: '📋', title: 'Policy pages reframed για το 2-language reality', desc: 'Editorial Policy section 8 (Multilingual content) ξαναγράφτηκε για να αντικατοπτρίζει την ορατή κατάσταση: από "διαθέσιμο σε 7 γλώσσες, AI-translated" σε "publishes σε EL+EN με English edited from Greek master". Hidden translations αναγνωρίζονται ως draft-state, "δεν προωθούνται μέχρι native-speaker review". Privacy/Terms/Editorial Policy hreflang centralized μέσω publicLocales — δεν διαφημίζουν πλέον hidden locales στο sitemap. Owner Person schema παραμένει intact με real name + email.' },
        { emoji: '🏖️', title: '12 παραλίες enriched με researched, sourced data', desc: 'Manual content uplift πάνω από το 800-char AdSense-friendly threshold. Sources synthesised από WebSearch (Greeka, BeachAtlas, gr-beaches, visit-halkidiki, sandee, yallou, nikana, traveling-greece, sithoniagreece, halkidikisailing, offbeatgreece, justgreece, halkidiki.guide). Κάθε payload αποθηκεύτηκε ως JSON file στο `backups/` ως audit trail για το source provenance. Αναβαθμίστηκαν: Καλοπήγαδο (Αμμουλιανή), Παρ. Δεβελίκι Mainland, Κοβιού, Ανθέμου, Μυκονιάτικα Nudist, Τσάσκα/Banana, Φάκα, Λιμανάκι/Blue Lagoon, Τρίμη, Βουλίτσα, Αγριδιά + rename Δεβελίκι Άθω σε "Ντεβελίκι Ουρανούπολης" για disambiguation. Καμία επινόηση: όπου facts (parking, prices, bar names) δεν ήταν public-source, παραλείφθηκαν.' },
        { emoji: '🗺️', title: 'Area tag corrections — 5 παραλίες reclassified', desc: 'Discovery κατά τη research φάση: η βάση είχε γεωγραφικά λάθος area tags. Καλοπήγαδο/Τσάσκα/Φάκα ταγκαρίζονταν `mainland` ενώ είναι στο νησί Αμμουλιανή → άλλαξαν σε `athos` (administratively Δήμος Αριστοτέλη). Λιμανάκι/Αγριδιά ταγκαρίζονταν `athos` ενώ είναι στο νότιο τμήμα Σιθωνίας → άλλαξαν σε `sithonia`. Slugs αμετάβλητα (no URL breakage), μόνο το area filter affected: τώρα εμφανίζονται στο σωστό `/beaches/area/[area]` listing.' },
        { emoji: '💰', title: 'Vercel cost cuts — ~70-90% πτώση εκτιμώμενη', desc: 'Πέντε mitigations εφαρμοσμένες μετά από quota overrun σε ISR Writes (629K/200K), Fast Origin Transfer (26GB/10GB), Fluid Active CPU (8h/4h): (1) Sitemap revalidate 1h → 48h + explicit Cache-Control headers (`max-age=86400, s-maxage=172800, swr=604800`) σε sitemap.xml + image-sitemap.xml. (2) Page ISR 1h/5min → 24h σε 23 routes — admin saves παραμένουν instant μέσω on-demand revalidation. (3) robots.txt blocks Bytespider, CCBot, Amazonbot (aggressive crawlers με near-zero referral value για Greek tourism niche, ενώ διατηρούνται GPTBot/ClaudeBot/PerplexityBot/Google-Extended/Applebot-Extended). (4) next/image qualities config [45, 50, 60, 75] σιγάει spam warnings. (5) Sitemap Cache-Control headers.' },
        { emoji: '🎯', title: 'Listing health UX στο /dashboard/listings — completeness, nudges, polish', desc: 'Major UX overhaul για owner dashboard. Νέο `computeCompleteness()` weighted scoring (description, photos, amenities = heavy weight; check-in info/wifi/parking/how-to-reach/owner story/tagline/times = medium; price/capacity/house rules = light) με missing-fields breakdown. (1) CompletenessBadge στο card title row — color-coded pill (red <50, amber 50-79, green 80+), click ανοίγει popover με itemized list. (2) ListingHealthBanner πάνω από τη λίστα: aggregates issues (no photos / <5 photos / thin description / <50% complete / stale 6+ months), dismissible 7 ημέρες. (3) PhotoCountNudge (sky-blue strip) δίπλα στο ήδη υπάρχον ThinDescriptionNudge. (4) "Updated N weeks ago" badge στο meta row, amber tint αν stale. (5) Publish/unpublish toggle promoted out of overflow menu — inline button. (6) Action row scrolls horizontally σε mobile αντί να wrap-άρει σε ugly multi-row pile. Φιλικός tone παντού: "βοηθάει την Google να εντοπίσει το κατάλυμά σου" αντί για "πρέπει να συμπληρώσεις".' },
        { emoji: '📝', title: 'Areas page — markdown rendering για long descriptions', desc: 'Hotfix για το /areas/[slug] όπου long markdown descriptions (κυρίως μετά το v3.39 content overhaul) δεν renderάρονταν σωστά — εμφανιζόταν raw markdown syntax αντί styled content.' },
        { emoji: '⚡', title: 'Detail pages: drop force-dynamic — Next Data Cache re-enabled', desc: 'Από το v3.35.0 hotfix, listings/beaches/restaurants/activities/blog detail routes είχαν `export const dynamic = "force-dynamic"` για να παρακάμψουμε ένα Next 16 + Turbopack SSG-fallback bug. Παρενέργεια: ο React Data Cache δεν δούλευε καθόλου — κάθε request επανέφερε queries που ήταν ήδη wrapped σε `unstable_cache`. Removed σε όλες τις 5 detail routes ώστε ο cache να ξανα-ενεργοποιηθεί. Generated route comments εξηγούν το trade-off για future maintainers.' },
      ],
    },
    {
      version: 'v3.40.0',
      date: '3 Ιουνίου 2026',
      highlights: 'Διόρθωση: τα τελευταία άρθρα blog δεν εμφανίζονταν στην αρχική. Νέο lightweight query (μόνο πεδία της κάρτας, limit 3, φιλτράρει drafts/χωρίς εικόνα) που λύνει το Supabase statement timeout και κρατά μόνο εμφανίσιμα άρθρα.',
      features: [
        { emoji: '🐛', title: 'Blog section στην αρχική — άδειο grid λόγω Supabase timeout', desc: 'Το `getBlogArticles()` έκανε `SELECT *` πάνω στο `blog_articles` (117 rows × 7 locale columns content_* που είναι τεράστια HTML strings) → Postgres επέστρεφε 57014 statement timeout. Η συνάρτηση κατάπινε το error και επέστρεφε `[]`, οπότε το grid render-αρε άδειο χωρίς οπτική ένδειξη. Ίδιο pattern εμφανιζόταν και στα logs για `getListings`. Νέα `getLatestBlogArticles(limit)` που επιλέγει μόνο τα πεδία που χρειάζεται η κάρτα (title/excerpt/image/slug/category/published_at/read_time_min + relateds), προσθέτει `.limit()` server-side, και logάρει errors αντί να τα καταπίνει.' },
        { emoji: '🖼️', title: 'Φιλτράρισμα: μόνο δημοσιευμένα άρθρα με εικόνα στην αρχική', desc: 'Το προηγούμενο `order(published_at DESC)` με Postgres default έβαζε τα NULL published_at πρώτα — οπότε draft άρθρα μπορούσαν να εμφανιστούν στο home grid. Το νέο query προσθέτει `not(published_at, null)` ώστε να αποκλείονται drafts, και `not(image_url, null) + neq(image_url, "")` ώστε να εμφανίζονται μόνο άρθρα με cover image (αισθητικά συνεπές grid — όχι κενές γκρι κάρτες).' },
      ],
    },
    {
      version: 'v3.39.0',
      date: '3 Ιουνίου 2026',
      highlights: 'Μεγάλο content overhaul για AdSense: ~260 χειρόγραφες αναγραφές + ~1.700 μεταφράσεις σε 7 γλώσσες (blog, παραλίες, καταλύματα, εστιατόρια, μοναστήρια, περιοχές), 51 junk/duplicate διαγραφές, 100% image alt coverage. Νέα /editorial-policy, author bio στα άρθρα, πλουσιότερο Article schema. Διόρθωση price input στη φόρμα καταχώρησης.',
      features: [
        { emoji: '✍️', title: 'Content overhaul — ~260 rewrites σε 7 γλώσσες', desc: 'Συνολική αναβάθμιση ποιότητας: 81 blog άρθρα ξαναγράφτηκαν (avg 365→608 λέξεις), 130 παραλίες (90→168), 82 εστιατόρια (181→220), 28 thin καταλύματα, 20 μοναστήρια, 4 περιοχές, 5 thin δραστηριότητες, 3 sales. 13 εντελώς νέα άρθρα (7 fresh topics: Σιθωνία vs Κασσάνδρα, Πάσχα, budget, σκύλος, Οκτώβριος, ήσυχες παραλίες, Άγιο Όρος διαμονητήριο + 6 day trips: Θεσσαλονίκη, Βεργίνα, Όλυμπος/Δίον, Μετέωρα, Έδεσσα + hub). Κάθε ελληνικό master copy μεταφράστηκε σε en/de/bg/ru/ro/sr με gpt-4o-mini (HTML/τιμές/τοπωνύμια preserved). 51 spam/duplicate/off-topic entries διαγράφηκαν (carWash advertorial, spam slugs, διπλά). Blog: 104→117 άρθρα.' },
        { emoji: '🔍', title: 'E-E-A-T: editorial policy, author bio, richer schema', desc: 'Νέα /editorial-policy σελίδα (7 γλώσσες) με διαφανή δήλωση χρήσης AI (human-edited, AI-assisted — σύμφωνη με Google AI guidelines), πηγές, διαδικασία επιμέλειας, 0% commission disclosure. Νέο AuthorBio component στο τέλος κάθε blog άρθρου (ChalkidikiHub Writer Team byline + ημερομηνίες δημοσίευσης/ενημέρωσης). Article JSON-LD εμπλουτίστηκε: Organization author με url στο /about, inLanguage, articleSection, keywords, wordCount. Footer link + sitemap entry.' },
        { emoji: '🖼️', title: 'Image alt text — 100% coverage', desc: 'Auto-generated alt texts από structured data (όνομα + περιοχή + features) για 113 παραλίες (13%→100%) και 41 καταλύματα. Beaches alt στα ελληνικά, listings σε 7 γλώσσες (image_alt_<locale>). Σωστά ελληνικά άρθρα ανά περιοχή (στην Κασσάνδρα / στη Σιθωνία / στον Άθω), αφαίρεση διπλού "Παραλία" prefix.' },
        { emoji: '💶', title: 'Διόρθωση price input στη φόρμα καταχώρησης', desc: 'Owners ανέφεραν ότι δεν μπορούσαν να βάλουν την τιμή που ήθελαν — το NumberStepper κρατούσε κολλημένο leading zero (πληκτρολόγηση έδινε "0100" αντί "100") και τα +/- κουμπιά εμπόδιζαν. Νέο PriceInput component: καθαρό text field χωρίς spinners, local string state ώστε να μπορεί να αδειάσει το πεδίο και να γράψει ελεύθερα, strip leading zeros, ένας δεκαδικός, min enforcement στο blur. Εφαρμόστηκε σε dashboard new/edit + admin edit (guests/bedrooms/bathrooms κρατούν NumberStepper). Owner helper + public priceNote (7 γλώσσες) ξαναγράφτηκε: ενδεικτική τιμή "από", η ακριβής επιβεβαιώνεται μετά από επικοινωνία.' },
      ],
    },
    {
      version: 'v3.38.0',
      date: '27 Μαΐου 2026',
      highlights: 'Guest confirmation email με dashboard link (i18n el/en), admin RLS fix + expandable recipients list ανά αίτημα. Ο επισκέπτης παίρνει αμέσως email με τη μοναδική του διεύθυνση παρακολούθησης· ο admin βλέπει σε ποιους ιδιοκτήτες πήγε το broadcast και ποιος απάντησε.',
      features: [
        { emoji: '📬', title: 'Guest confirmation email αμέσως μετά την υποβολή', desc: 'Νέα `sendGuestConfirmation()` στο `dispatch.ts` που τρέχει inline μετά το dispatchBroadcast. Branded email με heading "Λάβαμε το αίτημά σου ✨", δυναμική γραμμή ("Στείλαμε σε X ιδιοκτήτες" ή "Δεν βρήκαμε ταιριαστούς, παραμένει ενεργό"), σύνοψη αιτήματος (περιοχή/ημερομηνίες/άτομα), μεγάλο CTA "Δες την πορεία του αιτήματος →" προς το /requests/[public_token], και κίτρινο tip card "Αποθήκευσε αυτό το email — το link είναι μοναδικό για εσένα". Plain-text mirror για deliverability.' },
        { emoji: '🌐', title: 'Locale-aware emails — δύο templates (el + en) με smart fallback', desc: 'Migration 045 πρόσθεσε `locale TEXT NOT NULL DEFAULT \'el\'` στο `availability_requests` με CHECK constraint για τα 7 supported locales. Form τώρα στέλνει το current locale μέσω useLocale() στο POST body, API validate-άρει + αποθηκεύει στη DB. Δύο plaintext copy maps (GUEST_COPY.confirmation/firstResponse × el/en), pickGuestLocale() επιστρέφει \'el\' για ελληνικά / \'en\' για όλα τα άλλα. Ο επισκέπτης λαμβάνει και τα δύο emails (confirmation + first-response notification) στην ίδια γλώσσα που επέλεξε στο site.' },
        { emoji: '📊', title: 'Admin: prominent email count + expandable recipients list', desc: 'Το /admin/availability-requests row layout ξαναγράφτηκε με δύο colored stat cards πάνω από κάθε αίτημα: μπλε "Email στάλθηκαν → N ιδιοκτήτες" και πράσινο "Απαντήσεις → N (Y%)". Νέο "Δες τους N παραλήπτες" toggle κάνει lazy-fetch τα availability_request_recipients + availability_responses και εμφανίζει per-owner λίστα με: όνομα, status dot (sent/failed/skipped), badge απάντησης (Διαθέσιμο/Όχι διαθέσιμο/Αναμένει), failure error tooltip, ώρα αποστολής. Caching ανά request_id ώστε το re-expand να μη ξανατραβάει.' },
        { emoji: '🛡️', title: 'Bugfix: Admin + owner SELECT policies στο RLS-gated availability schema', desc: 'Το migration 043 ενεργοποίησε RLS αλλά δεν είχε read policies, με αποτέλεσμα το /admin/availability-requests και το owner dashboard sidebar badge να επιστρέφουν πάντα 0 rows. Νέο migration 044 πρόσθεσε: "Superadmin reads" policies σε όλους τους 4 πίνακες (availability_requests, recipients, responses, owner_broadcast_settings) μέσω EXISTS check στο profiles.role=\'superadmin\', και "Owners read own" policies σε recipients + responses με auth.uid() = owner_id. Public flows (form submit, owner response, guest dashboard) παρέμειναν unaffected — πάνε από service-role client που bypass-άρει RLS.' },
      ],
    },
    {
      version: 'v3.37.0',
      date: '27 Μαΐου 2026',
      highlights: 'Discovery boost για το broadcast feature — floating CTA button σε όλο το site, exit-intent popup σε search-intent pages, και form leave guard για να μη χάνονται μισοτελειωμένα αιτήματα. Όλα σε 7 γλώσσες, dismiss persistence στο localStorage.',
      features: [
        { emoji: '🔔', title: 'Floating CTA button — bottom-right σε όλο το public site', desc: 'Νέο AvailabilityCTAs client component (`src/components/marketing/AvailabilityCTAs.tsx`) που εμφανίζεται 2.5s μετά το page load σε κάθε σελίδα του public site. Mobile: μόνο 🔔 icon με yellow "Νέο" badge (16px ring-2). Desktop: full pill με "Ζήτα διαθεσιμότητα" label + chevron arrow. Gradient primary-600→700 με shadow primary-700/30. Click → /availability-request. Hidden σε /admin, /dashboard, /auth, /availability-request, /requests, /r, /book, /host (όπου το CTA δεν έχει νόημα). Badge κρύβεται 30 ημέρες μετά από πρώτο click via localStorage `chh_avail_fab_badge_dismissed_at`, αλλά το button παραμένει visible για επαναχρησιμοποίηση.' },
        { emoji: '🎯', title: 'Exit-intent popup σε high-search-intent pages', desc: 'Bottom-sheet σε mobile / centered modal σε desktop με 3 παράλληλους triggers: (1) Exit-intent — mouseleave από document με clientY ≤ 0 (κίνηση προς close button / address bar), (2) Scroll-depth — όταν (scrollY + viewport) / docHeight > 0.7, (3) Idle 30s — αν δεν γίνει trigger από scroll/click. Allowed paths: /listings, /listings/area/*, /places/*, /beaches[/area/*], /restaurants[/area/*], /activities[/area/*], /search, /sales — μόνο εκεί που ο χρήστης ψάχνει συγκεκριμένο τύπο διαμονής. Glass-morphism modal με gradient header primary-600→indigo-700, decorative blur blobs, Sparkles badge "Νέο", headline "Δεν βρήκες αυτό που έψαχνες;" + body explanation + primary CTA + dismiss link. Dismiss → 7-day suppression via localStorage `chh_avail_popup_dismissed_at`. Backdrop click + close X κουμπί επίσης dismiss-ουν.' },
        { emoji: '🛡️', title: 'Form leave guard στο /availability-request — beforeunload prompt', desc: 'Νέο useEffect στο form `_client.tsx` που εγγράφει beforeunload listener: αν ο επισκέπτης έχει συμπληρώσει ΟΠΟΙΟΔΗΠΟΤΕ field (name/email/phone/check-in/check-out/notes) και πάει να κλείσει το tab χωρίς submit, εμφανίζεται browser-native "Leave site?" prompt. Modern Chrome/Firefox/Safari αγνοούν custom message text (σχεδιαστικά security restriction) οπότε δείχνουν generic copy — αλλά returnValue setάρεται με localized warning για legacy browsers. Listener cleanup στο unmount + skip αν το form έχει ήδη submit-αριστεί ή δείχνει success.' },
        { emoji: '🌍', title: 'Πλήρες i18n σε 7 γλώσσες — popup/floating/beforeUnload keys', desc: 'Νέα translation keys κάτω από το `availabilityRequest` namespace: popup.{headline, body, cta, dismiss, badge, free}, floating.{label, tooltip}, beforeUnloadWarning — όλα localized σε el/en/de/bg/ru/ro/sr. Το floating label και το popup body εξηγούν συμπυκνωμένα τη μηχανική: "Στείλε ένα αίτημα → ειδοποιούμε ταιριαστούς ιδιοκτήτες → όσοι έχουν διαθέσιμο σου απαντούν". CTA action verb προσαρμοσμένο ανά γλώσσα (Send a request / Anfrage senden / Изпрати запитване / κλπ).' },
        { emoji: '⚙️', title: 'localStorage-based dismiss persistence (καθαρό UX)', desc: 'Δύο helpers: `readDismiss(key, days)` διαβάζει ISO timestamp και ελέγχει αν είναι entos N ημερών (early return false σε quota errors / disabled storage), `setDismiss(key)` γράφει `new Date().toISOString()`. Popup χρησιμοποιεί 7-day window για να μην ενοχλεί ξανά τους ίδιους χρήστες, FAB badge 30-day για το "Νέο" indicator. SSR-safe: lazy useState initializer με `typeof window === "undefined"` guard ώστε να μην σπάει το build-time render. Animations με CSS keyframes (fade-in/slide-up/fade-up) σε scoped styled-jsx, cubic-bezier easing για native-feel motion.' },
      ],
    },
    {
      version: 'v3.36.0',
      date: '27 Μαΐου 2026',
      highlights: 'Broadcast availability requests — οι επισκέπτες κάνουν 1 αίτημα και η πλατφόρμα ειδοποιεί αυτόματα ταιριαστούς ιδιοκτήτες (no-account flow με token-protected dashboard, owner opt-out, admin stats). Πλήρες i18n σε 7 γλώσσες, animated stepper στο submit, διεθνή τηλέφωνα.',
      features: [
        { emoji: '📡', title: 'Broadcast availability — 1 αίτημα → ειδοποίηση σε έως 8 ιδιοκτήτες', desc: 'Νέο /availability-request όπου ο επισκέπτης (χωρίς λογαριασμό) στέλνει check-in/out + πόδι + άτομα + budget + τύπος + στοιχεία επικοινωνίας. Η πλατφόρμα κάνει matching (area + capacity ≥ συνολικά άτομα + opt-in + weekly cap + round-robin) και στέλνει Gmail broadcast inline σε max 8 ιδιοκτήτες με 300ms throttle. Migration 043 πρόσθεσε 4 πίνακες: availability_requests (με public_token + ip_hash + expires_at), availability_request_recipients (response_token + send_status), availability_responses (price/message/contact_phone), owner_broadcast_settings (opt-out + max_per_week + areas[]). Inline dispatch αντί cron για να χωρέσει σε Vercel Hobby — 8 emails × 300ms = ~3s, εντός 10s limit.' },
        { emoji: '🔐', title: 'No-account guest dashboard με token URLs (no magic-link emails)', desc: 'Ο επισκέπτης παίρνει unique URL /requests/[public_token] στη success page (32-char base64url token) και κάνει bookmark — δεν στέλνεται verification email (Gmail quota friendly). Auto-refresh κάθε 60s δείχνει live πόσοι ιδιοκτήτες απάντησαν "διαθέσιμο", τιμές, τηλέφωνα κλήσης, μηνύματα + link στο listing. Κουμπί "Βρήκα κατάλυμα" κλείνει το αίτημα. Ένα μόνο email στον επισκέπτη όταν έρθει η πρώτη απάντηση (1-shot).' },
        { emoji: '✉️', title: 'Owner response landing — 3 buttons με signed token, no login', desc: 'Νέο /r/[response_token] όπου ο ιδιοκτήτης από email κάνει click "Διαθέσιμο" / "Δεν είμαι διαθέσιμος" / "Λεπτομέρειες". Form για τιμή/βράδυ + μήνυμα + τηλέφωνο επικοινωνίας + dropdown με τα δικά του listings που χωράνε τους επισκέπτες. Καμία είσοδος στο dashboard. Idempotent upsert (request_id, owner_id) — μπορεί να αλλάξει απάντηση όσο το αίτημα είναι active.' },
        { emoji: '🛡️', title: 'Anti-spam χωρίς captcha — honeypot + rate limits + disposable blocklist', desc: 'Honeypot field + 3s min time-to-submit. Rate limits 1/email/24h, 3/IP/24h, 5/email/μήνα, 30/πλατφόρμα/μέρα (στο API route, query-based). Disposable email blocklist (mailinator/tempmail/yopmail κλπ). Phone validation: 6–18 ψηφία με optional + (international-safe, αγνοεί κενά/παύλες/παρενθέσεις). IP-hash αποθηκεύεται sha256-truncated για auditing χωρίς GDPR risk.' },
        { emoji: '⚙️', title: 'Owner opt-out + per-area filter + weekly cap στο /dashboard/broadcast-settings', desc: 'Default opt-in (όλοι οι ενεργοί ιδιοκτήτες με published listings λαμβάνουν). Νέα σελίδα στο owner dashboard με toggle master opt-out, max αιτήματα/εβδομάδα (0-50, default 10), checkboxes για πόδια ενδιαφέροντος (null = όλα). RLS policies στο owner_broadcast_settings — κάθε owner βλέπει/edit μόνο τα δικά του. Stats card δείχνει αιτήματα που έλαβε την τελευταία εβδομάδα.' },
        { emoji: '📊', title: 'Admin dashboard /admin/availability-requests με conversion stats', desc: 'Νέα admin σελίδα: 4 stat tiles (σύνολο / ενεργά / με ≥1 απάντηση + % / total broadcast emails), filter chips (Όλα/Ενεργά/Κλειστά/Έληξαν), λίστα τελευταίων 200 αιτημάτων με guest info, dates, area, responses_count/recipients_count, link στο guest dashboard. Badge στο admin sidebar δείχνει active count.' },
        { emoji: '🌍', title: 'Πλήρες i18n σε 7 γλώσσες + διεθνή τηλέφωνα', desc: 'Νέο `availabilityRequest` namespace σε el/en/de/bg/ru/ro/sr messages: form labels, area + property type options με localised πόδια (1ο/2ο/3ο πόδι, 1st/2nd/3rd leg, 1. Finger, ...), success states με ICU pluralization ({count} owners), error messages, hero CTA. Form metadata title/description ανά locale. Greek phone validation αντικαταστάθηκε από international (6-18 digits) ώστε να δουλεύει με ξένους επισκέπτες — placeholder ανά locale με local country code hint.' },
        { emoji: '✨', title: 'Animated stepper loading — αντί για frozen "Sending..."', desc: 'Με το submit, η φόρμα αντικαθίσταται από 3-step UI με pulsing spinner: 🔍 Αναζητούμε καταλύματα → ✨ Ταιριάζουμε με ιδιοκτήτες → ✉️ Στέλνουμε ειδοποιήσεις. Τα steps ανάβουν διαδοχικά (1.4s + 3.2s) με animated transitions, ενεργό spinner στο current, ✓ στα ολοκληρωμένα. Μεταφρασμένο και τα 7 locales. Ο επισκέπτης βλέπει progress αντί για στατικό button.' },
        { emoji: '📧', title: 'Owner email footer εξηγεί τη δυνατότητα + tonε στο opt-out', desc: 'Κάτω από τα reply buttons στο broadcast email: highlighted info block ("Νέα δυνατότητα — αν μπορείς να εξυπηρετήσεις, επικοινώνησε απευθείας με τον επισκέπτη στο τηλέφωνο παραπάνω") + κίτρινο opt-out block που τονίζει το path Dashboard → Αιτήματα διαθεσιμότητας. List-Unsubscribe header + plain-text version για καλό deliverability. Email body δεν εκθέτει το email του επισκέπτη — μόνο όνομα + τηλέφωνο (anti-abuse).' },
        { emoji: '🎯', title: 'Hero CTA + secondary entry points', desc: 'Στο homepage hero, κάτω από το search box: glass-card CTA "Δεν βρίσκεις αυτό που θες; → Ζήτα διαθεσιμότητα σε όλη την περιοχή" με ChevronRight icon, localised σε 7 γλώσσες μέσω useTranslations. Links πάνε στο /availability-request. Badges στα sidebars: owner dashboard δείχνει received_last_week (sky), admin sidebar δείχνει active count (amber).' },
      ],
    },
    {
      version: 'v3.35.0',
      date: '23 Μαΐου 2026',
      highlights: '140 νέες παραλίες από OpenStreetMap με unique AI περιγραφές × 7 γλώσσες (980 νέες indexable σελίδες), public host pages για owners με ≥2 καταλύματα (νέο /host/[slug] route), νέα admin tools (hosts dashboard + mass-email segment), build perf fix για να μην ξαναχτυπήσουμε το 45-min Vercel ceiling',
      features: [
        { emoji: '🏖️', title: '140 νέες παραλίες από OSM Overpass με unique περιεχόμενο', desc: 'Νέο pipeline σε 6 scripts (`scripts/import-beaches-osm.js` κλπ) που τραβάει όλες τις natural=beach POIs στη Χαλκιδική από OpenStreetMap (free, no key), κάνει dedupe με proximity + same-name (250m strict, 800m όταν όνομα ταιριάζει), αυτο-classify σε kassandra/sithonia/athos/mainland με γεωγραφικούς κανόνες lat/lng, και upsert στο Supabase. Φιλτράρει non-beach POIs (bar/restaurant/hotel/camping tags). Συνολικά 165 παραλίες στο DB από 25 πριν.' },
        { emoji: '✍️', title: 'AI-generated unique περιγραφές 140 × 7 γλώσσες (980 sections)', desc: 'Δύο OpenAI passes ανά παραλία: (1) gpt-4o-mini με per-beach style+tone seed από 8×3 = 24 παραλλαγές, hardcoded village proximity hints από lat/lng (~50 anchor villages), 80-120 word Ελληνικά κείμενο που αποφεύγει AI clichés ("κρυστάλλινα νερά", "παράδεισος") και ξεκινάει με μη-επαναλαμβανόμενες δομές. (2) Batch JSON translation σε 6 γλώσσες + per-locale meta_title (50-60 chars) + meta_description (140-155 chars). Συνολικό κόστος ~$0.80 για 140 παραλίες. Regex pass στο τέλος καθάρισε leftover coordinate strings που το AI έβαζε αυτούσιες (41 fixes).' },
        { emoji: '🏷️', title: 'OSM tag enrichment για features + crowd estimator', desc: 'Νέο scripts/enrich-beaches-osm-tags.js ξανατραβάει OSM beaches με πλήρη tags, ταιριάζει με τις DB rows με proximity (200m) και αντιστοιχίζει surface, sunbeds, naturism, wheelchair, lifeguard, access σε BeachFeature array. 81 παραλίες πήραν πραγματικά OSM features (sandy/pebble/nudist/free), 59 fallback "free". Όλες έχουν πλέον rating ≥ 3.5 ώστε ο crowd estimator (getPopularity στο crowd-estimation.ts) να βγάζει meaningful score αντί για 0.' },
        { emoji: '🖼️', title: 'Per-area Unsplash images + ad-hoc per-beach upgrades', desc: 'Δύο scripts: `assign-beach-images-by-area.js` τραβάει 1 Unsplash photo ανά region (Kassandra/Sithonia/Athos/Mainland), τα ανεβάζει σε Supabase Storage και τα assign-άρει σε όλες τις παραλίες της περιοχής. `assign-per-beach-unsplash.js` σταδιακά αναβαθμίζει σε per-beach photos όπου το Unsplash έχει σχετικό αποτέλεσμα — 38 παραλίες έχουν ήδη unique cover (rate-limited στο demo tier 50/hr, συνεχίζεται με scheduled task).' },
        { emoji: '👤', title: 'Public host pages — /host/[slug] για owners με 2+ καταλύματα', desc: 'Νέο SSR route που εμφανίζει την προσωπική σελίδα ενός ιδιοκτήτη με όλα του τα δημοσιευμένα καταλύματα σε grid, plus avatar/logo, 7-language bio, public contact (email/phone), social links (Facebook/Instagram/website), aggregate stats. Gating με ≥2 published listings + explicit toggle. Person JSON-LD schema + BreadcrumbList, canonical + 7 hreflang alternates, στο sitemap automatically. Migration 042 πρόσθεσε public_slug, public_page_enabled, bio_{el..sr}, social_*, public_{display_name,avatar,email,phone} στο profiles, με public-read RLS policy μόνο για enabled+slug rows.' },
        { emoji: '⚙️', title: 'Host page editor στο /dashboard/profile', desc: 'Το dashboard profile section επεκτάθηκε με sections για host-page management: enable toggle (disabled μέχρι ≥2 published listings), manual slug με live preview + sanitization, public display name, avatar URL, public email/phone, Facebook/Instagram/website inputs, και bio editor σε 7 γλώσσες με collapsible textareas. Αυτόματο revalidate trigger στο /api/revalidate?type=host μετά το Save ώστε το production cache να ενημερωθεί άμεσα.' },
        { emoji: '🪧', title: 'Marketing banner στο /dashboard/listings για eligible owners', desc: 'Νέο HostPagePromoBanner client component που εμφανίζεται σε owners με ≥2 published listings που δεν έχουν ακόμα ενεργοποιήσει host page. Gradient primary→indigo design με decorative blurs, 3 value props (one link / SEO+schema / AI discoverability), CTA σε /dashboard/profile. Όταν είναι enabled, αντικαθίσταται από compact "live" confirmation card με View page + Edit. Dismissable με sessionStorage persistence.' },
        { emoji: '🔗', title: 'HostLinkBanner στο /listings/[slug] (cross-portfolio nav)', desc: 'Server component που εμφανίζεται κάτω από κάθε listing detail page και προτείνει "Δες τα {N} άλλα καταλύματα του {host}" με link στο /host/[slug]. Φαίνεται μόνο όταν ο owner έχει public_page_enabled + ≥2 published + το current listing δεν είναι το μοναδικό άλλο. 7-locale copy.' },
        { emoji: '📊', title: 'Νέο admin panel /admin/hosts — επισκόπηση όλων των hosts', desc: 'Νέα σελίδα admin/hosts με 4 stat tiles (Enabled / Eligible-not-enabled για outreach / Total eligible / All owners) και sortable table που δείχνει για κάθε owner: avatar+name+email, slug+clickable production URL, listings count, bio fill status (✓/empty), status badge (Live/Eligible/—), και inline Enable/Disable button που κάνει αυτόματο revalidate. Filter chips (Enabled/Eligible/All) + search across name/email/slug.' },
        { emoji: '✉️', title: 'Νέο mass-email segment "2+ καταλύματα χωρίς host page"', desc: 'Στο /admin/email προστέθηκε νέα κατηγορία παραληπτών για στοχευμένη outreach προς owners που είναι eligible αλλά δεν έχουν ενεργοποιήσει τη σελίδα τους ακόμα. Bonus: το listingCount σε όλο το email panel μετράει πλέον μόνο published listings (πριν περιελάμβανε drafts/closed), ώστε οι αριθμοί να συμπίπτουν με αυτούς του /admin/hosts.' },
        { emoji: '⚡', title: 'Build perf — on-demand detail rendering για high-cardinality routes', desc: 'Μετά το 45-min Vercel build ceiling που χτύπησε με την εισαγωγή των +140 παραλιών (+980 SSG pages × 7 locales), το generateStaticParams για beaches/listings/restaurants/activities/blog άλλαξε σε `return []`. Pages renderάρονται στο first request και cache-άρονται για 1h μέσω του υπάρχοντος revalidate. Sitemap συνεχίζει να τις listάρει, οπότε το Google discovery δεν επηρεάζεται. Build time έπεσε από >45min σε ~3min.' },
        { emoji: '🚑', title: 'Force-dynamic hotfix για Next.js 16 SSG-to-dynamic edge case', desc: 'Μετά το perf change, το /listings/[slug] (και άλλα) βγάζανε 500 γιατί στο Next.js 16 + Turbopack το generateStaticParams() που επιστρέφει [] δεν κάνει αυτόματο fallback σε on-demand σωστά. Προστέθηκε `export const dynamic = "force-dynamic"` στις detail routes για να γίνει instant fix. Επόμενο cycle: investigation για proper ISR config χωρίς force-dynamic, μόλις ξεκαθαρίσει το Next 16 behavior.' },
        { emoji: '🌍', title: 'Area mismatch fix για southern Sithonia (Σάρτη, Νέος Μαρμαράς)', desc: 'Ο αρχικός import classifier marked beaches με lon ≥ 23.92 ως Athos, αλλά το νότιο άκρο της Σιθωνίας εκτείνεται μέχρι lon ~24.0 (Sykia, Kalamitsi area). Conservative reclassification fix στο `scripts/fix-beach-areas.js` διόρθωσε 2 ξεκάθαρα λάθη (Σάρτη + Νέος Μαρμαράς από athos σε sithonia), αφήνοντας borderline cases (Άγιος Γεώργιος Σιθωνίας @ 40.32) ως είχαν.' },
        { emoji: '🔧', title: 'Storage relabel + image-optimizer rollback (egress savings)', desc: 'Νέο /api/admin/storage-relabel endpoint που backfill-άρει long Cache-Control headers σε υπάρχοντα Supabase Storage uploads (πριν είχαν default 1h). Νέο storage-recompress για legacy oversized images. Vercel image optimizer απενεργοποιήθηκε προσωρινά για να ξεμπλοκάρει production downloads. Auto-blog cron μεταφέρθηκε σε weekly. PMS crons disabled (unused).' },
        { emoji: '🛡️', title: 'SEO meta improvements + auto-noindex thin translations', desc: 'Rich per-page meta descriptions αντί generic site-wide fallback (από v3.34 baseline). Duplicate "ChalkidikiHub" στους titles αφαιρέθηκε. Auto-noindex σε /guide και /places translations που έχουν source description < threshold — Google δεν τιμωρεί πλέον για thin foreign-language pages όταν δεν υπάρχει substantive content. AI auto-fill admin endpoint για bulk content generation σε αυτά τα slots.' },
        { emoji: '📝', title: 'Email send history με recipient list στο admin/email', desc: 'Το activity_logs τώρα αποθηκεύει την πλήρη λίστα emails που στάλθηκαν σε κάθε mass send. Νέο expandable panel στο send history δείχνει τη λίστα παραληπτών με Copy και "Επαναχρήση παραληπτών" buttons — άμεσο follow-up στους ίδιους χρήστες ως external recipients χωρίς να ξαναστήσεις το φίλτρο.' },
        { emoji: '⭐', title: 'Pinned featured listings (Amira House στο top)', desc: 'Νέο PINNED_LISTING_SLUG_PREFIXES array στο data.ts + pinFeaturedListings() helper που εξασφαλίζει συγκεκριμένα listings (αρχικά Amira House) εμφανίζονται πάντα πρώτα στο /listings index και στο homepage, ανεξάρτητα από τη χρονολογική σειρά δημιουργίας. Wire-up σε getListings().' },
      ],
    },
    {
      version: 'v3.34.0',
      date: '7 Μαΐου 2026',
      highlights: 'AdSense compliance overhaul, 532 νέες σελίδες με AI-generated owner stories (76 listings × 7 γλώσσες), 3 data-driven features (sea temperature, price benchmarks, driving distances), νέα /about, honest cookie consent + GDPR-clean privacy',
      features: [
        { emoji: '🛡️', title: 'AdSense compliance — διορθώσεις απόρριψης "low-value content"', desc: 'Συνολικό overhaul για το AdSense rejection. /book/[slug] "under construction" placeholders → 308 permanentRedirect στο /listings/[slug] (462 thin URLs εξαφανίστηκαν). AdSense adsbygoogle.js βγήκε από το interaction-gate και φορτώνει με afterInteractive ώστε ο reviewer crawler να το ανιχνεύει. /changelog noindex (internal/dev content). /in/[location]/[category] επιστρέφει 404 όταν τα results είναι 0, αντί για κενό template. /listings/[slug] auto-noindex όταν source description < 200 chars (νέο thinThreshold option στο getContentMeta).' },
        { emoji: '🍪', title: 'Honest cookie consent + NPA gating για AdSense', desc: 'CookieConsent ξαναγράφτηκε σε 7 γλώσσες με ειλικρινές copy (αναφέρει ρητά Google AdSense + Google Analytics + opt-in mechanism), granular επιλογή Accept all / Essential only, link σε privacy. DeferredScripts τώρα setάρει window.adsbygoogle.requestNonPersonalizedAds=1 πριν φορτώσει το script όταν consent είναι unknown ή rejected — non-personalized ads χωρίς consent. GA φορτώνει μόνο μετά από explicit accept (παραμένει gated σε interaction/idle για LCP/TBT).' },
        { emoji: '📄', title: 'Νέα /about σελίδα σε 7 γλώσσες', desc: 'Πλήρης About page (~430 λέξεις/locale) με sections "Mission / What you will find / How we are different / Get in touch", AboutPage JSON-LD με Organization mainEntity (founder, foundingDate, contact, areaServed, sameAs social), σωστά canonical + 7 hreflang alternates + x-default. Footer link στο "Legal" column με tNav("about"). Sitemap entry για /about × 7 locales. Trust signal που έλειπε για AdSense.' },
        { emoji: '🌡️', title: 'Live sea temperature card στο /beaches/[slug]', desc: 'Νέο /api/sea-temperature route που καλεί Open-Meteo Marine API (free, no key, edge-cached 1h). Νέο SeaTemperatureCard component εμφανίζει current temp + 7-day forecast + monthly historical heatmap (Aegean baseline) σε 60+ beach pages. Πραγματικά μοναδικά live data για κάθε παραλία.' },
        { emoji: '💶', title: 'Price benchmark + Cuisine ratio στο /places/[slug]', desc: 'Νέο place-stats.ts helper με 2 functions: getVillagePriceStats (avg/min/max με comparison vs Halkidiki overall, ≥3 listings required) και getVillageCuisineStats (Greek/traditional vs international ratio βασισμένο σε cuisine tags, area-fallback όταν <5 categorised). Δύο νέα cards στο VillagePage μετά το quick-stats grid, locale-aware copy σε 7 γλώσσες. Παράδειγμα Toroni: "€116/βραδιά, 14% πιο φθηνά από Χαλκιδική avg, δείγμα 6", "33% παραδοσιακά εστιατόρια / 67% διεθνή".' },
        { emoji: '🚗', title: 'Driving distance table στο /from/[city]', desc: 'Νέο driving-distances.ts: Haversine + 1.4× road factor + adaptive speed (55/70/85 km/h ανά trip length) χωρίς external routing API. Coordinates + localised names για όλες τις 8 origin cities. Νέο DistanceTable component εμφανίζει sortable table με 11 popular Halkidiki villages + km + drive time + links στο /places/[slug]. 7-locale copy + disclaimer.' },
        { emoji: '🤖', title: 'AI-generated owner stories — 532 νέες σελίδες με unique content', desc: 'Νέο /api/admin/generate-owner-stories endpoint που με 1 cURL γεμίζει το owner_story_<locale> field για όλα τα 76 published listings σε 7 γλώσσες. Δύο OpenAI calls per listing: gpt-4o-mini για 150-200 word Greek narrative grounded σε real facts (location, capacity, amenities), batch JSON translation σε en/de/bg/ru/ro/sr (sr σε Latin script). Bulk-run κάλυψε 100% των 76 listings (35 + 33 + 8 pre-existing) με 0 failures, ~$0.40 OpenAI cost. Total: 532 σελίδες με original AI-written content που δεν υπάρχει αλλού.' },
        { emoji: '📋', title: 'Privacy Policy honest cookies section (6 locales)', desc: 'Section 5 ξαναγράφτηκε σε el/en/de/bg/ru/ro με σαφή τρεις κατηγορίες cookies (essential / advertising-AdSense / analytics-GA) και reference στο cookie banner ως opt-in mechanism. Το προηγούμενο "no tracking cookies" copy ήταν σε αντίφαση με το νέο banner — αυτό από μόνο του θα μπορούσε να δικαιολογήσει AdSense rejection.' },
        { emoji: '🐛', title: 'Build fix για /stay/[slug]/guide (production-only)', desc: 'Δύο pre-existing bugs που εμφανίστηκαν μόνο σε next build (Turbopack dev mode τα έπιανε): import path του villages_body.json είχε 7 ../ levels (έβγαινε εκτός project root) → 6, και το cast listing as Record<string, string|null> χρειάστηκε intermediate as unknown γιατί το listing_images array δεν είναι compatible με string.' },
      ],
    },
    {
      version: 'v3.33.0',
      date: '21 Απριλίου 2026',
      highlights: 'Area guide σε όλα τα 66 καταλύματα × 7 γλώσσες (462 νέες indexable σελίδες), /book κλειδωμένο με contact-only, PMS kill-switch',
      features: [
        { emoji: '🗺️', title: 'Οδηγός περιοχής σε ΟΛΑ τα καταλύματα (462 νέες σελίδες)', desc: 'Το area guide που πριν δούλευε μόνο στο Thespis Villa 3 είναι τώρα live σε όλα τα 66 καταλύματα × 7 γλώσσες. Κάθε οδηγός έχει τις 6 κοντινότερες παραλίες, 8 εστιατόρια και 6 δραστηριότητες ταξινομημένα με Haversine distance, 3ήμερο προτεινόμενο itinerary, FAQ section με airport transfer info, και 4 internal links προς σχετικά καταλύματα (village-first, area-fallback). Κάθε guide: ~350KB HTML, ~10 JSON-LD schemas, πλήρως SSR, ISR revalidate 24h' },
        { emoji: '🎯', title: 'Cross-area POI fallback — καμία σελίδα με thin content', desc: 'Το πρώτο audit έδειξε 13 Kassandra listings με μόνο 3 εστιατόρια και 2 mainland listings με 2 παραλίες (λόγω sparse δεδομένων στις αντίστοιχες περιοχές). Αντί να περιοριστώ σε .eq("area", area), τώρα φέρνω POIs από όλη τη Χαλκιδική και ταξινομώ με πραγματική απόσταση. Η Χαλκιδική είναι αρκετά μικρή ώστε ένα beach 10χλμ μακριά να είναι πιο χρήσιμο από padding με 2-item section. Μετά το fix: όλα τα 66 guides έχουν 6 παραλίες + 8 εστιατόρια + 6 δραστηριότητες' },
        { emoji: '📰', title: 'Article JSON-LD + OG tags στα guides', desc: 'Κάθε area guide έχει τώρα Article schema με datePublished/dateModified, author (ChalkidikiHub), publisher με logo, εικόνα κάλυψη του καταλύματος. Open Graph image 1200×630 με alt text + Twitter summary_large_image card. Η Google τα πιάνει ως content articles αντί για product pages — unlocks "News & Discover" placement' },
        { emoji: '🔗', title: '1.848 νέα internal paths από related listings', desc: 'Κάθε guide δείχνει 4 σχετικά καταλύματα: priority στο ίδιο χωριό (stronger topical signal), fallback σε ίδια περιοχή αν το χωριό έχει <4 listings. Εικόνα, τιμή, link — το καθένα τραβάει crawl equity στο source listing. 462 guides × 4 links = 1.848 νέα εσωτερικά paths, αυξάνει crawl depth + PageRank flow σε όλο το directory' },
        { emoji: '🚧', title: '/book/[slug] κλειδωμένο με contact-only σελίδα', desc: 'Το online booking δεν είναι έτοιμο ακόμα. Αντί για half-baked form, η /book/[slug] σε 7 γλώσσες δείχνει "Online κρατήσεις υπό κατασκευή — επικοινωνήστε απευθείας με τον ιδιοκτήτη" με tel:/mailto:/wa.me/website buttons. robots: noindex, follow — δεν χάνουμε link equity, αλλά και δεν γεμίζουμε τη Google με thin "coming soon" pages. Link πίσω στο listing' },
        { emoji: '🔒', title: 'PMS kill-switch — owner-level disable', desc: 'Νέο pms_enabled flag στο pms_owner_settings (migration 039). Αν ένας owner έχει pms_enabled=false, όλα τα public API routes (/api/pms/public/{book,quote,checkout}) επιστρέφουν 503 pms_disabled. Admin dashboard τώρα έχει toggle για instant activation/deactivation χωρίς να πειράξουμε τα existing listings — χρήσιμο για phased rollout ή emergency stop' },
        { emoji: '📍', title: 'Guide CTA στη StayPage', desc: 'Το "Οδηγός περιοχής: {village}" CTA εμφανίζεται τώρα σε κάθε listing page (πριν εμφανιζόταν μόνο αν είχε lat/lon). BookOpen icon + area name, link σε /stay/{slug}/guide. 7-locale translations. Δίνει visibility στα νέα 462 guide URLs μέσα από τη φυσική user journey' },
        { emoji: '🗂️', title: 'Sitemap — 462 νέα guide URLs', desc: 'Το /sitemap.xml τώρα περιλαμβάνει uncontionally /stay/{slug}/guide για κάθε listing × 7 γλώσσες, priority 0.8, changefreq weekly, lastmod από updated_at. Η Google παίρνει ρητό signal ότι αυτές είναι canonical σελίδες που θέλουμε indexed' },
      ],
    },
    {
      version: 'v3.32.0',
      date: '21 Απριλίου 2026',
      highlights: 'SEO — SSR village pages, smart data-driven meta, FAQ schema: fix για 1.510 "Discovered, not indexed" URLs στο GSC',
      features: [
        { emoji: '🚑', title: 'Fix 500 errors σε όλα τα /places/[slug] routes', desc: 'Μετά το v3.31.0, η αλλαγή από dynamic="force-dynamic" σε revalidate=3600 έσπασε όλα τα village pages γιατί το generateStaticParams() επέστρεφε άδεια λίστα → Next.js προσπάθησε static render αλλά το setRequestLocale() καλεί headers() → "Page changed from static to dynamic at runtime" error. Hotfix επαναφέρει force-dynamic προσωρινά (eb9071e), permanent solution στο ίδιο version: το generateStaticParams τώρα κατεβάζει όλα τα village slugs από Supabase και τα pre-renderάρει' },
        { emoji: '⚡', title: 'SSR village pages με pre-rendered slugs (~1.900 pages στο edge)', desc: 'VillagePage + VillageContentPage μετατράπηκαν από Client Components με useEffect fetch σε Server Components με pre-fetched props. Η Google βλέπει πλήρες HTML χωρίς JS — ονόματα παραλιών, εστιατορίων, δραστηριοτήτων, FAQs, όλα στο initial response. generateStaticParams σε /places/[slug] + /beaches + /restaurants + /activities pre-renderάρει 67 χωριά × 7 γλώσσες × 4 σελίδες ≈ 1.876 static pages στο build time. Instant TTFB από Vercel edge cache αντί για Supabase query ανά crawl' },
        { emoji: '🏗️', title: 'ISR revalidate=3600 σε όλες τις village routes', desc: 'revalidate=3600 (1 ώρα) αντικαθιστά το force-dynamic hotfix. Κάθε village σελίδα ξανα-generάρεται μία φορά την ώρα στο background — ο crawler βλέπει cached HTML, οι real users βλέπουν fresh data. Η Supabase τώρα τρέχει ~67 queries/ώρα συνολικά αντί για ~67 queries ανά crawler visit. Crawl budget της Google δεν καίγεται σε slow dynamic responses' },
        { emoji: '📚', title: 'FAQPage JSON-LD ανά χωριό (rich results target)', desc: 'buildFaqs() helper στο /places/[slug]/page.tsx παράγει 2-4 questions ανά χωριό βασισμένες σε πραγματικά counts: "Πού βρίσκεται η {village};", "Υπάρχουν παραλίες κοντά;" (αν >0), "Πού να φάω;" (αν >0), "Τι να κάνω;" (αν >0). EL + EN variants — απαντήσεις template-ized με τα actual counts ώστε η Google να τα θεωρεί αξιόπιστα. BreadcrumbList + Place schema ήδη υπήρχαν, τώρα τρία schemas συν-εμφανίζονται στο head' },
        { emoji: '🧠', title: 'Smart meta descriptions στις κεντρικές village pages', desc: 'GSC audit έδειξε 66/67 villages με meta_description_el που ξεκινάει με "Ανακαλύψτε την X..." — near-duplicate template που η Google downrankάρει. Το generateMetadata στο /places/[slug]/page.tsx τώρα τρέχει 3 count-only queries (beaches/restaurants/activities για το area) παράλληλα με top 2 beach names, και χτίζει unique per-village meta: "Σάρτη (Σιθωνία, Χαλκιδική): 7 παραλίες (Κληματαριά, Καρύδι), 58 εστιατόρια και 8 δραστηριότητες. Οδηγός, κριτικές, χάρτες." Localized σε 7 γλώσσες με σωστά plurals + conjunctions (και/and/und/и/și/i)' },
        { emoji: '🎯', title: 'Smart meta + H1 στις subpages (beaches/restaurants/activities)', desc: 'Το meta-helper.ts τώρα φέρνει count + top 2 ranked items ανά (village, content type) και γράφει unique title + description + H1. Πριν: "Best beaches near Sarti, Χαλκιδική." Μετά: "7 παραλίες κοντά στο Σάρτη (Σιθωνία, Χαλκιδική) — Παραλία Κληματαριά, Καρύδι. Φωτογραφίες, χάρτες, κριτικές." Η ίδια λογική τρέχει και στο H1, οπότε και το heading της σελίδας είναι unique — όχι μόνο το head tag. Συνολικά ~1.407 νέα unique routes (67 × 7 × 3)' },
        { emoji: '🇷🇸', title: 'Serbian (sr) σε όλα τα SEO helpers', desc: 'Το sr locale έλειπε από τα LABELS του meta-helper.ts και από το metadata query στο /places/[slug]/page.tsx. Προστέθηκε στις 3 content-type maps (beaches/restaurants/activities), στα meta_title_sr + meta_description_sr columns του village query, και στο META_LABELS table για το smart description generator. Όλα τα 7 locales τώρα παράγουν properly localized output (Χαλκιδική/Halkidiki/Chalkidiki/Халкидики/...)' },
        { emoji: '🌐', title: 'x-default hreflang σε κάθε village URL', desc: 'Κάθε metadata.alternates.languages map τώρα περιλαμβάνει x-default που δείχνει στην Ελληνική έκδοση (default locale). Η Google / Bing ξέρουν ποια γλώσσα να σερβίρουν σε visitors εκτός των 7 υποστηριζόμενων locales αντί για guessing με Accept-Language header. Ενσωματωμένο σε /places/[slug] και στις 3 subpages' },
      ],
    },
    {
      version: 'v3.31.0',
      date: '20 Απριλίου 2026',
      highlights: '5 νέοι travel guides + SEO comprehensive upgrade: CSP, hreflang x-default, Activity Schema.org, noindex hardening',
      features: [
        { emoji: '🗺️', title: '5 νέοι travel guides με πλήρες SEO', desc: 'Νέα κείμενα στο /guide/first-time-halkidiki, /guide/kassandra-sithonia-athos, /guide/hiking-halkidiki, /guide/wine-tours-halkidiki, /guide/petralona-cave. Ελληνικό content ~2000 λέξεις ανά guide με τοπικά insider tips ώστε να μην φαίνεται AI-generated, + μεταφράσεις σε 6 γλώσσες (en/de/bg/ru/ro/sr). 96-139 internal links ανά guide με hub&spoke strategy προς /places/<village>, /best/<collection>, /beaches/feature/<feature>, /itinerary/<days>, /from/<city>, /mount-athos. Καθένας έχει Article JSON-LD, OG images, hreflang alternates σε 7 γλώσσες' },
        { emoji: '🔒', title: 'Content-Security-Policy header στο next.config.ts', desc: 'Προσθήκη CSP header σε όλες τις responses ως defense in depth vs XSS: default-src self, script-src self unsafe-inline unsafe-eval (για Next inline scripts), style-src self unsafe-inline (για Tailwind JIT), img-src self data: https:, font-src self data:, frame-src self https://js.stripe.com. Αν κάτι προσπαθήσει να κάνει inject remote script από unknown origin, ο browser το μπλοκάρει πριν εκτελεστεί' },
        { emoji: '🧠', title: 'Activity JSON-LD με Schema.org subtypes', desc: 'Το generateActivityLD() στο seo.ts μετατρέπει πλέον την κατηγορία (water-sports, spa, nightlife, religious, adventure) σε αντίστοιχο Schema.org subtype: SportsActivityLocation για water-sports/adventure, HealthAndBeautyBusiness για spa, NightClub για nightlife, PlaceOfWorship για religious. Προστέθηκαν επίσης πεδία touristType, image, priceRange, duration, geo.latitude/longitude και aggregateRating (conditional — μόνο αν υπάρχουν reviews). Google τώρα καταλαβαίνει τι είναι η κάθε δραστηριότητα αντί για γενικό TouristAttraction' },
        { emoji: '🌐', title: 'hreflang x-default σε κάθε page & layout', desc: 'Κάθε σελίδα (places, beaches, guides, activities, restaurants, blog, faq, itinerary, from, costs, ev-chargers, sales, stay, best, mount-athos και όλες οι υπόλοιπες) δηλώνει τώρα x-default alternate που δείχνει στην Ελληνική έκδοση του URL. Μαζί με τα 7 locale alternates, Google και Bing ξέρουν ποια γλώσσα να σερβίρουν σε επισκέπτες που δεν ταιριάζουν με κανένα από τα υποστηριζόμενα locales — αντί για guessing με βάση το Accept-Language header' },
        { emoji: '🤖', title: 'robots.ts + X-Robots-Tag noindex layered defense', desc: 'Το /robots.txt πλέον απαγορεύει ρητά τα paths /admin, /dashboard, /api, /auth, /owner, /_next για όλους τους crawlers. Επιπλέον, ο proxy.ts στέλνει X-Robots-Tag: noindex, nofollow header σε κάθε response από private routes — έτσι ακόμα κι αν κάποιος bot αγνοήσει το robots.txt (το οποίο είναι advisory, όχι enforcing), το header βλέπεται στο response πριν γίνει index. Defense in depth σε δύο επίπεδα' },
        { emoji: '🧹', title: 'Consolidation src/lib/seo.ts — removal src/lib/json-ld.ts', desc: 'Διαγραφή του legacy src/lib/json-ld.ts (51 lines που διπλάσιαζε helpers). Όλα τα JSON-LD builders πλέον ζουν σε ένα αρχείο: generateBreadcrumbLD, generateFAQLD, generateArticleLD, generateActivityLD, localeUrl, ogImageUrl, collectionMeta. +81 lines στο seo.ts για τα συνενωμένα helpers. Κάθε page/layout έχει ενημερωθεί ώστε να κάνει import από μόνο ένα place — μικρότερο bundle, λιγότερη duplication, ευκολότερη συντήρηση' },
        { emoji: '🗺️', title: 'Sitemap x-default + OG cache + a11y + localized 404', desc: 'Το /sitemap.xml τώρα περιλαμβάνει x-default alternate για κάθε URL alongside τα 7 locale alternates ώστε να είναι coherent με τα metadata alternates. /api/og route στέλνει Cache-Control: public, max-age=31536000, immutable — OG images cache-άρονται για 1 έτος από CDN + browsers χωρίς regeneration. ImageGallery thumbnail buttons έχουν aria-label για screen readers. Το not-found.tsx τώρα έχει localized metadata και translated strings και στις 7 γλώσσες αντί για hard-coded Ελληνικά' },
      ],
    },
    {
      version: 'v3.30.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS — Stripe Connect: OAuth onboarding + deposit auto-charge με 0% commission',
      features: [
        { emoji: '💳', title: 'Stripe Connect OAuth onboarding', desc: 'Νέο κουμπί "Connect with Stripe" στο /dashboard/pms/settings → Payments που κάνει redirect στο https://connect.stripe.com/oauth/authorize. Ο owner συνδέει τον Stripe λογαριασμό του (ή φτιάχνει καινούργιο με τα στοιχεία της επιχείρησης), και μετά το Stripe τον στέλνει πίσω στο /api/stripe/connect/callback όπου ανταλλάσσουμε το authorization code με stripe_user_id. Αποθηκεύεται σε pms_owner_settings.stripe_account_id + stripe_onboarded=true' },
        { emoji: '🔐', title: 'Anti-CSRF με random state token', desc: 'Πριν το redirect, το /api/stripe/connect/start γεννάει 64-char hex random state μέσω crypto.getRandomValues() και το αποθηκεύει στο pms_owner_settings.stripe_connect_state του owner. Το callback ψάχνει τον owner μέσω του state value — αν δεν ταιριάξει, επιστρέφει state_mismatch. Έτσι κανείς δεν μπορεί να προσαρτήσει Stripe account άλλου σε owner χωρίς να ξέρει το token. Καθαρίζεται μετά την επιτυχία ή αποτυχία' },
        { emoji: '💰', title: '0% commission με transfer_data.destination', desc: 'Όταν guest κάνει direct booking σε owner με Stripe onboarded, το /api/pms/public/checkout δημιουργεί Stripe Checkout Session με payment_intent_data[transfer_data][destination]=<owner>.stripe_account_id και application_fee_amount=0. Αυτό σημαίνει ότι τα χρήματα πάνε κατευθείαν στον owner — η ChalkidikiHub δεν κρατάει τίποτα. Το 0% commission είναι η υπόσχεση της πλατφόρμας υλοποιημένη σε κώδικα' },
        { emoji: '🎯', title: 'Deposit-only charge στο checkout', desc: 'Το Checkout χρεώνει μόνο το deposit portion (total × deposit_percentage / 100) σε cents, όχι ολόκληρο το ποσό. Έτσι ο guest δεν επιβαρύνεται με 100% προκαταβολή και το balance (70-80% συνήθως) τακτοποιείται off-platform με bank transfer ή cash πριν το check-in, όπως προτιμάνε οι Έλληνες ιδιοκτήτες. Currency = listing currency (default EUR), product_data.name = "Villa + check_in → check_out"' },
        { emoji: '🪝', title: 'Webhook /api/stripe/webhook με HMAC verification', desc: 'Νέο endpoint που λαμβάνει checkout.session.completed event. Επαληθεύει το stripe-signature header με HMAC-SHA256 μέσω Web Crypto API (crypto.subtle.importKey + sign) και 5-min tolerance window ενάντια σε replay attacks. Βάζει το booking σε payment_status=deposit_paid + stripe_paid_amount (από amount_total/100) + stripe_payment_method + stripe_checkout_session_id. Unsigned ή malformed webhooks απορρίπτονται με 400' },
        { emoji: '🪄', title: 'Αυτόματο redirect guest στο Stripe Checkout', desc: 'Αν ο owner έχει Stripe onboarded, το book API επιστρέφει stripe_enabled=true στο response. Το /book/[slug] τότε αντί να πάει στο confirmed, καλεί /api/pms/public/checkout και redirectάρει στο session.url. Ο guest πληρώνει στο Stripe-hosted checkout page, επιστρέφει στο /success → /confirmed. Αν αποτύχει (cancel button), πάει στο /cancelled με "Try paying again" button που ξανακαλεί το ίδιο endpoint' },
        { emoji: '🗄️', title: 'Migration 038_pms_stripe.sql', desc: 'ALTER pms_owner_settings ADD stripe_connect_state TEXT (nullable, για OAuth flow). ALTER pms_bookings ADD stripe_checkout_session_id TEXT + stripe_paid_amount NUMERIC(10,2) + stripe_payment_method TEXT. Partial index idx_pms_bookings_stripe_session WHERE stripe_checkout_session_id IS NOT NULL για γρήγορο lookup από webhook. Καθαρά nullable ώστε να μην σπάει existing rows — όλοι οι owners ξεκινούν non-onboarded και το stripe flow είναι opt-in' },
      ],
    },
    {
      version: 'v3.29.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS — Public direct booking page: 0% commission, απευθείας με τον ιδιοκτήτη',
      features: [
        { emoji: '🎯', title: 'Νέα public page /book/[slug]', desc: 'Guest-facing booking form σε rose→pink→fuchsia gradient χωρίς login. Hero με cover image του καταλύματος + εκπτωτικό badge "0% OTA". Split layout: αριστερά τα fields (dates, guests counter με +/-, name, email, phone, country, notes), δεξιά sticky quote card με nightly average, νύχτες, σύνολο, applied rules, deposit amount, cancellation policy & instant-book/needs-approval chip' },
        { emoji: '💰', title: 'Live pricing με pricing rules engine', desc: 'Κάθε αλλαγή σε dates/listing καλεί /api/pms/public/quote που εφαρμόζει όλα τα active pms_pricing_rules του καταλύματος (seasonal, weekend, LOS, last-minute, custom) μέσω του υπάρχοντος computeQuote(). Εμφανίζει applied rules με signed delta (+ rose αν ακριβότερο, − emerald αν φθηνότερο). Υπολογισμός deposit με βάση το effective deposit_percentage από mergeSettings()' },
        { emoji: '🛡️', title: 'Server-side availability checks', desc: 'Το /api/pms/public/quote ελέγχει ταυτόχρονα: (1) listing_availability blocks στο range, (2) επικαλυπτόμενες pms_bookings εκτός cancelled, (3) min/max nights από effective settings, (4) advance_notice_hours vs τρέχουσα ώρα. Επιστρέφει availability.available + conflicts[] list ώστε το UI να δείξει τον λόγο (π.χ. "Minimum 3 nights") αντί για generic "unavailable"' },
        { emoji: '📝', title: 'POST /api/pms/public/book', desc: 'Δημιουργεί pms_bookings row με source=direct και status=confirmed αν instant_book ON, αλλιώς inquiry. Service client παρακάμπτει RLS για το insert. Server-side re-validation όλων των checks (dates, min/max nights, availability, guest limits, email format) — ο client δεν ελέγχεται. Επιστρέφει 409 αν οι ημερομηνίες κλείστηκαν εν τω μεταξύ από άλλον channel' },
        { emoji: '✅', title: 'Confirmation page /book/[slug]/confirmed', desc: 'Redirect μετά το submit στο ?id=<booking-id>. Emerald-check icon αν confirmed, amber-clock αν inquiry. Δείχνει listing title, dates, guests, total σε fuchsia, booking ID σε mono. Contact tiles (phone/email) αν ο ιδιοκτήτης έχει ορίσει contact_phone/contact_email στο listing. "0% OTA" badge + link "Επιστροφή στο κατάλυμα"' },
        { emoji: '🔗', title: '"Book direct" CTA στο stay page', desc: 'Νέο rose button στο sticky price bar (δίπλα στην τιμή/νύχτα) που δείχνει "Κλείσε απευθείας — 0% προμήθεια" σε 7 γλώσσες (el/en/de/bg/ru/ro/sr). Sparkles icon + shadow-rose-500/30 για visual pop. Click → /book/<slug>. Inline στο ίδιο header με την τιμή ώστε να φαίνεται αμέσως η εναλλακτική σε OTA' },
        { emoji: '🔔', title: 'Αυτόματες ειδοποιήσεις owner (reuse)', desc: 'Όταν δημιουργείται direct booking με status=inquiry ή confirmed, πέφτει στο ίδιο pms_bookings table που σκανάρει το /api/cron/pms-notifications (v3.28.0). Ο owner παίρνει email στο next :53 cron run χωρίς extra code — το source=direct filter δεν υπάρχει στον cron, οπότε καλύπτεται by default. Τοξεύεται επίσης στο ίδιο inbox/calendar όπου φαίνονται όλες οι κρατήσεις' },
      ],
    },
    {
      version: 'v3.28.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS — Email alerts στον owner: inquiry, booking, overdue, check-in/out',
      features: [
        { emoji: '📧', title: 'Νέο hourly cron /api/cron/pms-notifications', desc: 'Τρέχει στο :53 κάθε ώρας (ξεχωριστό window από dispatch :29 και auto-tasks :41 ώστε να μην συνωστίζονται τα sends). Σκανάρει 5 kinds: new inquiry (last 2h), new booking confirmed/pending (last 2h), overdue task (scheduled_at < now), check-in σήμερα, check-out σήμερα. Service client για cross-owner' },
        { emoji: '🔔', title: '5 toggles στο /dashboard/pms/settings', desc: 'Νέο email-alerts block μέσα στο Notifications section με 5 Toggle switches: notify_new_inquiry (default ON), notify_new_booking (ON), notify_overdue_tasks (ON), notify_check_in_today (OFF), notify_check_out_today (OFF). Κάθε toggle έχει hint που εξηγεί πότε στέλνεται' },
        { emoji: '🌍', title: 'Bilingual EL + EN σε ένα email', desc: 'Όλα τα alerts γράφονται EL πάνω και EN από κάτω, χωρισμένα με horizontal divider ─────────────. Subject line: "Νέα κράτηση — Βίλα Καλλιθέα / New booking — Villa Kallithea". Έτσι δεν χρειάζεται να επιλέξεις locale — παίρνεις και τις δύο γλώσσες σε κάθε email' },
        { emoji: '🛡️', title: 'Idempotency ανά kind + ref', desc: 'Νέος πίνακας pms_notifications με UNIQUE (owner_id, kind, ref_id, COALESCE(ref_date, epoch)). Για new_inquiry/new_booking το ref_date είναι NULL (one-shot). Για overdue_task το ref_date=today ώστε να re-notifyεί μία φορά την ημέρα όσο το task παραμένει overdue. Για check_in/out_today ref_date είναι η ίδια η ημερομηνία. Cron safe σε re-runs' },
        { emoji: '📬', title: 'Έξυπνο destination resolution', desc: 'Email alerts πηγαίνουν στο reply_to_email του owner settings — αν κενό, fallback στο auth.users.email του account (μέσω service.auth.admin.getUserById). Έτσι δεν χρειάζεται εξτρά setup για να λειτουργήσει — δουλεύει out-of-the-box με τα stored credentials του account' },
        { emoji: '🧠', title: 'Νέο lib/pms/notifications.ts', desc: 'Export: sendOwnerAlert(supabase, {ownerId, kind, refId, refDate?, emailTo, subjectEl/En, bodyEl/En, creds?, footer?}) → "sent"|"skipped_duplicate"|"skipped_no_email"|"skipped_no_creds"|"failed". Reuses bodyToHtml + sendTemplateEmail + loadGmailCreds από dispatch.ts ώστε logic Gmail να είναι σε ένα μέρος. Records κάθε attempt (success or error) στο pms_notifications για audit' },
        { emoji: '🗄️', title: 'Migration 037_pms_notifications.sql', desc: 'ALTER pms_owner_settings ADD 5 BOOLEAN columns (notify_*) με sensible defaults. Νέος πίνακας pms_notifications: id, owner_id FK CASCADE, kind TEXT (CHECK 5 values), ref_id TEXT, ref_date DATE, email_to, subject, sent_at, error, created_at. UNIQUE index με COALESCE sentinel 1970-01-01. 2 regular indexes (owner, sent_at DESC). RLS owner reads own + admin reads all — inserts γίνονται μόνο από cron με service client' },
      ],
    },
    {
      version: 'v3.27.0',
      date: '20 Απριλίου 2026',
      highlights: 'PMS — Συνεργάτες (Vendors): λίστα επαφών για tasks',
      features: [
        { emoji: '🧑‍🔧', title: 'Νέο module /dashboard/pms/vendors', desc: 'Amber-orange-rose gradient hero, κάρτες ανά συνεργάτη με avatar icon ανά role (καθαριστής, συντήρηση, property manager, κλινοσκεπάσματα, κηπουρός, φωτογράφος, άλλο). Filter bar: search (όνομα/email/τηλ), role dropdown, toggle "show inactive". Activate/deactivate με ένα click — inactive απορρίπτονται από το task picker αλλά δεν χάνονται' },
        { emoji: '➕', title: 'Add/Edit modal με role picker', desc: 'Modal form με 7 role icons σε grid (tapping χρωματίζει με το chipCls του role), name, phone, email, default hourly rate, default flat rate, notes. Autofocus στο name field. Live validation — save disabled αν δεν υπάρχει όνομα. Inline error από Supabase με mono font bubble' },
        { emoji: '🔗', title: 'Νέο FK vendor_id στο pms_tasks', desc: 'Optional reference με ON DELETE SET NULL ώστε αν διαγραφεί ο συνεργάτης, τα ιστορικά tasks παραμένουν (με το snapshot assignee_name/phone/email που είχαν τη στιγμή της ανάθεσης). Έτσι τα reports παραμένουν accurate χωρίς dangling refs ή auto-cascade' },
        { emoji: '🎯', title: 'Vendor picker στο TaskForm', desc: 'Νέο violet section "Πιάσε από συνεργάτες" πάνω από τα assignee fields: dropdown φορτωμένο με όλους τους active vendors. Όταν επιλέξεις συνεργάτη, γεμίζουν αυτόματα το name/phone/email/cost (default_flat_rate). Μπορείς πάντα να overrideάρεις χειροκίνητα — δεν "κολλάνε" τα πεδία' },
        { emoji: '📊', title: 'Task count badge ανά vendor', desc: 'Κάθε κάρτα δείχνει αριθμό tasks που έχουν ανατεθεί σε αυτόν τον συνεργάτη (όλων των εποχών). Quick way να δεις ποιον χρησιμοποιείς πιο συχνά και ποιον ίσως αρχίζει να ξεχνάς. Ο αριθμός ενημερώνεται live κάθε φορά που φορτώνει η σελίδα' },
        { emoji: '💶', title: 'Default rates (hourly + flat)', desc: 'Κάθε vendor έχει προαιρετικά default_hourly_rate και default_flat_rate. Εμφανίζονται στην κάρτα με €amount/h και €flat font-mono. Όταν επιλεγεί στο task form, γεμίζει το flat rate αυτόματα στο cost field (αν δεν υπάρχει ήδη value). Hourly μένει για manual entry (e.g. αν η εργασία διήρκησε 2h)' },
        { emoji: '🗄️', title: 'Migration 036_pms_vendors.sql', desc: 'Νέος πίνακας pms_vendors: id, owner_id FK, name, role (CHECK σε 7 values), phone, email, default_hourly_rate, default_flat_rate, notes, active, timestamps. 2 indexes (owner, active). RLS owner manages own + admin reads all. ALTER TABLE pms_tasks ADD vendor_id UUID REFERENCES pms_vendors ON DELETE SET NULL + index pms_tasks_vendor_idx' },
      ],
    },
    {
      version: 'v3.26.0',
      date: '20 Απριλίου 2026',
      highlights: 'PMS — Per-listing overrides: κάθε κατάλυμα έχει τις δικές του πολιτικές',
      features: [
        { emoji: '🏠', title: 'Νέα /dashboard/pms/settings/listings/[id]', desc: 'Dedicated page ανά κατάλυμα όπου ορίζεις overrides για instant_book, min/max nights, advance notice, preparation days, check-in/out times, cancellation policy, deposit %, balance days, κόστος καθάρισμα και lead days. Indigo-violet hero με το slug + live link, 4 sections χρωματιστά όπως τα global settings' },
        { emoji: '🔗', title: 'Κληρονομικότητα με "Inherit" toggle', desc: 'Κάθε πεδίο έχει badge πάνω δεξιά: OVERRIDE (indigo, active) ή INHERIT (slate, πατώντας το επαναφέρει σε null). Όταν inherit, το input μετατρέπεται σε read-only box που δείχνει την effective τιμή από τα global defaults. Έτσι βλέπεις με μια ματιά ποια πεδία έχεις αλλάξει και ποια κληρονομεί' },
        { emoji: '📋', title: 'Index section στο main settings', desc: 'Νέα indigo section "Overrides ανά κατάλυμα" στο τέλος του /dashboard/pms/settings με λίστα όλων των καταλυμάτων. Κάθε row δείχνει title + slug + pinned badge με τον αριθμό των active overrides (π.χ. "3 overrides") ή "inherits defaults". Click → page του override' },
        { emoji: '🧠', title: 'Νέο lib/pms/settings.ts', desc: 'Exports mergeSettings(owner, listing) και resolveListingSettings(supabase, listingId, ownerId) που κάνουν tri-state resolution: listing override (αν not null) → owner default (αν not null) → hard default. Consumable από any route handler ή cron. Pure TS, καθαρά interfaces' },
        { emoji: '🔁', title: 'Auto-cleaning cron σέβεται overrides', desc: 'Το /api/cron/pms-auto-tasks τώρα φορτώνει pms_listing_settings ανά owner και merge-άρει checkout_time + cleaning_lead_days + cleaning_default_cost ανά listing πριν δημιουργήσει το task. Έτσι αν ένα ακίνητο έχει 10:00 check-out και άλλο 13:00, τα tasks προγραμματίζονται σωστά' },
        { emoji: '🗑️', title: 'Reset to defaults', desc: 'Κουμπί "Reset σε defaults" στο save bar που διαγράφει την entire row από pms_listing_settings (μέσω DELETE WHERE listing_id=...). Το κατάλυμα επιστρέφει σε full inheritance από owner settings σε όλα τα πεδία ταυτόχρονα — χωρίς να χρειάζεται να toggle-άρεις ένα-ένα' },
        { emoji: '🗄️', title: 'Migration 035_pms_listing_settings.sql', desc: 'Νέος πίνακας pms_listing_settings με PK listing_id, όλα τα override columns NULLABLE (NULL = inherit). CHECK constraint για cancellation_policy μόνο όταν not null. RLS: owner manages own (auth.uid()=owner_id) + admin reads all. Updated-at trigger reused από pms_touch_updated_at()' },
      ],
    },
    {
      version: 'v3.25.0',
      date: '20 Απριλίου 2026',
      highlights: 'PMS — Pricing Rules Engine: αυτόματο quote στο booking form',
      features: [
        { emoji: '💶', title: 'Νέο lib computeQuote()', desc: 'Pure TS function στο src/lib/pms/pricing.ts που παίρνει base_rate + dates + rules και υπολογίζει nightly breakdown. Per-night rules (seasonal/weekend/custom) εφαρμόζονται ανά ημέρα σε priority order, booking-scope rules (LOS/last-minute) μετά στο σύνολο. Σεβαστά operations: override/add/subtract/multiply, percentage ή absolute amount' },
        { emoji: '🤖', title: '/api/pms/pricing/quote', desc: 'POST {listing_id, check_in, check_out, booking_date?} → {base_rate, subtotal_*, nightly_average, applied[]}. RLS-scoped: verifyει ότι το listing ανήκει στον caller. Επιστρέφει array εφαρμοσμένων κανόνων με name, operation, scope (night/booking), nights_affected και signed delta σε €' },
        { emoji: '✨', title: 'Auto-quote στο BookingForm', desc: 'Gradient fuchsia→pink box μέσα στο Money section που εμφανίζεται όταν listing + dates είναι set. Auto-fetch κάθε φορά που αλλάζει listing_id/check_in/check_out/status. Δείχνει 4 KPIs (Base/night, Avg/night, Nights, Subtotal) + λίστα εφαρμοσμένων κανόνων με icon (↑ rose αν ακριβότερο, ↓ emerald αν φθηνότερο, % για booking-scope)' },
        { emoji: '🖱️', title: '"Εφαρμογή στα πεδία" button', desc: 'Κουμπί μέσα στο quote box που γεμίζει nightly_rate (avg) + total_amount (subtotal + cleaning + taxes). Έτσι βλέπεις πρώτα την τιμή, μετά επιλέγεις αν θα την κρατήσεις ή θα κάνεις manual override (το pricing rules engine προτείνει, δεν επιβάλλει)' },
        { emoji: '🎯', title: 'Αυτόματο skip σε blocks/inquiries', desc: 'Όταν το booking είναι status=blocked ή source=blocked το quote widget αποκρύπτεται (δεν έχει νόημα τιμολόγηση σε owner block). Το ίδιο ισχύει όταν απουσιάζουν dates ή check_in >= check_out. Error messages εμφανίζονται inline χωρίς να χαλάει η ροή του form' },
        { emoji: '📊', title: 'Tally ανά κανόνα', desc: 'Αν ο ίδιος κανόνας (π.χ. "Σαββατοκύριακα +20%") εφαρμοστεί σε 3 νύχτες, εμφανίζεται μια φορά με sum των deltas + "3 νύχτες" χαρακτηρισμός. Για LOS/last-minute εμφανίζεται "σε όλο το σύνολο". Tα % operations δεν compound — βασίζονται στο base_rate (per night) ή στο subtotal (per booking)' },
        { emoji: '🧮', title: 'Math σεβαστά με edge cases', desc: 'Math.max(0) clamp για να μην βγει αρνητική τιμή από aggressive subtract, days_until_checkin για last_minute rules υπολογίζεται σε ολόκληρες ημέρες UTC, weekdays array 0=Sun..6=Sat όπως Postgres. Seasonal ranges είναι inclusive [start_date, end_date]' },
      ],
    },
    {
      version: 'v3.24.0',
      date: '20 Απριλίου 2026',
      highlights: 'PMS — Auto-προγραμματισμός καθαρισμού όταν έρχεται check-out',
      features: [
        { emoji: '✨', title: 'Auto-cleaning task ανά booking', desc: 'Νέο hourly cron (/api/cron/pms-auto-tasks) που σκανάρει κρατήσεις με check-out τις επόμενες 14 ημέρες και δημιουργεί pending task καθαρισμού με τίτλο "Cleaning — <guest> checkout". Idempotency: δεν διπλοδημιουργεί αν υπάρχει ήδη task τύπου cleaning για το ίδιο booking' },
        { emoji: '⏰', title: 'Lead-days & checkout_time', desc: 'Scheduled_at = check_out date στην ώρα checkout_time του owner. Αν ο owner θέλει ο καθαριστής να έρχεται πιο νωρίς, ορίζει cleaning_lead_days=1 και το task προγραμματίζεται την προηγούμενη. Default: 0 (ίδια μέρα, ίδια ώρα με check-out)' },
        { emoji: '👤', title: 'Default assignee & cost', desc: 'Νέα πεδία στο pms_owner_settings: cleaning_default_assignee_name/phone/email + cleaning_default_cost. Κάθε auto task έρχεται προ-συμπληρωμένο. Αλλαγές γίνονται πάντα χειροκίνητα στο detail page του task (π.χ. override για συγκεκριμένη κράτηση)' },
        { emoji: '🔘', title: 'Toggle "Αυτόματος καθαρισμός"', desc: 'Νέα ενότητα στο /dashboard/pms/settings με toggle auto_cleaning_enabled. Όταν OFF, ο cron παραλείπει τον owner. Όταν ON, εμφανίζονται και τα assignee/cost/lead-days fields για customization. Opt-in by default (μην σπάσουμε υπάρχουσες workflows)' },
        { emoji: '🛡️', title: 'Respect status filter', desc: 'Κρατήσεις με status=cancelled ή blocked δεν λαμβάνουν auto-task. Έτσι ακυρώσεις τελευταίας στιγμής δεν αφήνουν task να εμφανιστεί στα Pending. Όταν μια κράτηση μετακινηθεί σε νέα ημερομηνία, επόμενος cron run δημιουργεί νέο task (αν δεν υπάρχει ήδη)' },
        { emoji: '🔁', title: 'Cron schedule', desc: 'Τρέχει στο :41 κάθε ώρας (vercel.json). Ξεχωριστό από το pms-dispatch (:29) ώστε spikes να μην επηρεάζουν email sends. Service client για να δουλεύει cross-owner χωρίς auth context' },
        { emoji: '🗄️', title: 'Migration 034_pms_auto_tasks.sql', desc: 'Προσθέτει 6 στήλες στο pms_owner_settings: auto_cleaning_enabled, cleaning_default_assignee_name/phone/email, cleaning_default_cost (NUMERIC), cleaning_lead_days (INT 0-7). RLS μένει το υπάρχον "owner manages own settings" — δεν χρειάζεται νέο policy' },
      ],
    },
    {
      version: 'v3.23.0',
      date: '20 Απριλίου 2026',
      highlights: 'PMS — Template Dispatch Engine: αυτόματα emails με triggers & {{variables}}',
      features: [
        { emoji: '📨', title: 'Αυτόματη Αποστολή στο Σωστό Trigger', desc: 'Νέο hourly cron (/api/cron/pms-dispatch) σκανάρει όλα τα active non-manual templates και στέλνει email όπου ταιριάζει booking: on_inquiry/on_book/on_cancel (με βάση status), 3/1 days before check-in, on_checkin, on_checkout, 7 days after. Καλείται από Vercel Cron στο λεπτό :29 κάθε ώρας' },
        { emoji: '🧠', title: '{{variables}} Substitution με Locale Fallback', desc: 'Κάθε template γίνεται render με guest_name, listing_name, check_in, check_out, nights, total, owner_name, owner_phone, owner_email. Η γλώσσα επιλέγεται από guest_country (GR/CY→el, DE/AT/CH→de, FR/BE/LU→fr, IT→it, ES/MX/AR→es, αλλιώς en), με fallback EN → EL → οποιοδήποτε locale έχει content' },
        { emoji: '🔁', title: 'Idempotency ανά (template, booking)', desc: 'Το dispatch engine ελέγχει αν υπάρχει ήδη message με ίδιο template_id + booking_id και skipάρει. Έτσι cron runs κάθε ώρα χωρίς κίνδυνο διπλού email. Force re-send επιτρέπεται με flag για edge cases (manual override)' },
        { emoji: '✉️', title: 'Gmail via Nodemailer', desc: 'Χρησιμοποιεί το ίδιο Gmail account με το password-reset flow (site_settings.gmail_address + gmail_app_password). Reply-to γεμίζει από pms_owner_settings.reply_to_email ή owner email, ώστε απαντήσεις guest να φτάνουν στον owner όχι στο system inbox' },
        { emoji: '🖱️', title: '<TemplatePicker/> στο Thread View', desc: 'Νέα section στο /dashboard/pms/messages/[id] όταν το thread έχει booking: λίστα όλων των templates που ταιριάζουν στο listing, preview subject+body με συμπληρωμένες variables, Send button ανά template. Έλεγχος γλώσσας, inline override (UI-only preview), "Εστάλη" badge + Re-send option' },
        { emoji: '🛡️', title: 'Owner-scoped API /api/pms/messages/send-template', desc: 'Endpoint για manual send από UI. Verifyει RLS-scoped ότι template + booking ανήκουν στον caller, φορτώνει listing + owner profile, και delegates στο shared dispatchTemplateToBooking lib. Service client μόνο για site_settings read + cross-policy pms_messages insert' },
        { emoji: '📝', title: 'Outbound Log στο Inbox', desc: 'Κάθε template send γράφεται σαν κανονικό outbound message στο pms_messages (channel=email, is_automated=true, template_id FK). Βλέπεις στο thread view τα auto emails με "Auto" badge δίπλα στο channel pill, ώστε να ξέρεις ακριβώς τι ειπώθηκε και πότε' },
      ],
    },
    {
      version: 'v3.22.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Finance — Revenue, ADR & Occupancy Dashboard',
      features: [
        { emoji: '📈', title: 'Dashboard /dashboard/pms/finance', desc: 'Year + listing filter → 4 KPI cards: Έσοδα (year-over-year delta σε % πάνω στην κάρτα), ADR (Average Daily Rate, €/νύχτα), Occupancy (πληρότητα %), Νύχτες booked (+ σύνολο κρατήσεων). Όλα υπολογίζονται από τα pms_bookings εξαιρώντας ακυρωμένα & blocked dates' },
        { emoji: '📊', title: 'Monthly Revenue Bar Chart', desc: '12 μήνες σε horizontal bars με gradient emerald→teal, scaled στο max μήνα, με τιμή αριστερά και €amount δεξιά σε tabular-nums. Fast visual για το peak/off-season σου. Προσοχή: αν μια κράτηση πατά δύο μήνες, το nightly amount σπάει ανά ημέρα στον σωστό μήνα (όχι όλο στον checkout month)' },
        { emoji: '🏠', title: 'Per-Listing Breakdown', desc: 'Κατάλογος καταλυμάτων sorted by revenue desc, κάθε κάρτα: revenue € + bar (% του totalYear) + κρατήσεις + νύχτες + ADR. Βλέπεις ποιο κατάλυμα είναι star performer και ποιο underperforms — χωρίς να κοιτάς spreadsheets' },
        { emoji: '📡', title: 'Per-Channel Breakdown', desc: 'Ανά source (Direct, Airbnb, Booking.com, VRBO, Manual, Other) με χρωματιστό pill + revenue + bar + % του συνολικού έτους. Βλέπεις άμεσα πόσο OTA commission αποφεύγεις μέσω direct — key motivator για marketing investment' },
        { emoji: '⚠️', title: 'Unpaid Alert Card', desc: 'Όταν υπάρχουν bookings με payment_status ≠ fully_paid (και όχι refunded/cancelled), εμφανίζεται amber alert με το σύνολο που οφείλεται. Quick reminder να βγάζεις invoices ή να χάκες reminders' },
        { emoji: '🧮', title: 'Smart Calculations', desc: 'Nightly equivalent = total_amount / booking_nights αν υπάρχει total, αλλιώς nightly_rate. Clip στα όρια του έτους για μετακινήσεις Δεκ→Ιαν. Occupancy = nights / (days_up_to_today × listings_count) × 100 — δεν τιμωρείται για μελλοντικές ημέρες που δεν έχει φτάσει ακόμη η χρονιά' },
        { emoji: '🟢', title: 'YoY Revenue Delta', desc: 'Κάτω από το revenue KPI εμφανίζεται +15.2% vs πέρυσι (emerald) ή -8% (rose) όταν υπάρχει πέρυσι data στο ίδιο scope (listing filter + calendar year). Είναι το νούμερο που ρωτάς πρώτο στα end-of-year reviews' },
      ],
    },
    {
      version: 'v3.21.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Automations — Message Templates σε 6 Γλώσσες με Triggers',
      features: [
        { emoji: '🤖', title: 'Λίστα /dashboard/pms/automations', desc: 'Όλα τα templates σε κάρτες με trigger icon + name + trigger pill + Active/Paused badge + body preview 120 χαρακτήρες + locale codes (EL · EN · DE…) + scope (Όλα τα καταλύματα ή N specific). Paused templates εμφανίζονται σε opacity 75% για να διακρίνονται' },
        { emoji: '⏰', title: '9 Triggers', desc: 'Manual (on-demand insertion σε thread), On inquiry (πρώτο guest message), On booking (confirmation), 3 days before / 1 day before (prep reminders), On check-in (welcome), On check-out (thank-you), 7 days after (review request), On cancel. Radio cards με icon + one-line περιγραφή' },
        { emoji: '🌍', title: '6 Locales σε Tabs', desc: 'EL 🇬🇷 · EN 🇬🇧 · DE 🇩🇪 · FR 🇫🇷 · IT 🇮🇹 · ES 🇪🇸 — κάθε locale tab δείχνει αν έχει content με πράσινο check. Subject + body per locale, αποθηκεύονται σε JSONB columns (subject_locales, body_locales) ώστε να στέλνεται το σωστό στη γλώσσα του guest χωρίς κόπο' },
        { emoji: '📌', title: 'Variables με Click-to-Copy', desc: '{{guest_name}}, {{listing_name}}, {{check_in}}, {{check_out}}, {{nights}}, {{total}}, {{owner_name}}, {{owner_phone}} — tap σε variable chip για αυτόματη αντιγραφή στο clipboard. Θα γίνεται substitution την ώρα της αποστολής (render step δεν υλοποιημένο ακόμη)' },
        { emoji: '🎯', title: 'Scope: Όλα ή Specific Listings', desc: 'Toggle buttons "Όλα τα καταλύματα" vs "Επιλεγμένα" — αν specific, checkboxes για κάθε κατάλυμα του owner. Αποθηκεύεται ως UUID[] (null = όλα, array = specific). Για απλά portfolios το "όλα" είναι one-click setup' },
        { emoji: '🔘', title: 'Active Toggle + 3 Stats', desc: 'Templates (σύνολο), Ενεργά, Γλώσσες (μοναδικές locales με content). Pause toggle για εποχική παύση (π.χ. winter rates) χωρίς διαγραφή. Filter bar: trigger dropdown + status (All/Active/Paused) + live search σε name + όλα τα locale bodies' },
        { emoji: '🧩', title: 'Shared <TemplateForm/>', desc: '4 sections: Basics (name + active), Trigger (9 radio cards), Content (6 locale tabs + subject + body + variables), Scope (all vs specific + checkboxes). Create/edit share the same form, delete with confirm στο edit page' },
      ],
    },
    {
      version: 'v3.20.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Messages — Ενοποιημένο Inbox με Threads ανά Κράτηση',
      features: [
        { emoji: '📥', title: 'Inbox /dashboard/pms/messages', desc: 'Όλα τα μηνύματα ομαδοποιούνται σε threads — ένα ανά κράτηση, ή ανά guest_email όταν δεν υπάρχει κράτηση. Κάθε thread κάρτα: avatar με αρχικό γράμματος guest, όνομα + channel pill + "Auto" badge για templates + unread counter, subject, body preview 140 char, listing name + message count, relative timestamp (τώρα/5λ πριν/3ώ πριν/18 Απρ)' },
        { emoji: '📊', title: '3 Stat Cards', desc: 'Threads (ομαδοποιημένες συνομιλίες), Αδιάβαστα (inbound χωρίς read_at), Σύνολο μηνυμάτων (όλα τα records)' },
        { emoji: '🎨', title: '6 Channels με Color Pills', desc: 'Direct (slate), Email (sky), WhatsApp (emerald), Airbnb (rose), Booking.com (indigo), System (violet) — βοηθάει να εντοπίζεις με μια ματιά από πού ήρθε το μήνυμα. Φιλτράρισμα ανά channel + listing + live search σε guest/subject/body' },
        { emoji: '💬', title: 'Thread View /dashboard/pms/messages/[id]', desc: 'Chat-style bubbles — εξερχόμενα δεξιά (violet), εισερχόμενα αριστερά (slate), system messages γκρι italic. Auto mark-as-read όταν ανοίγεις το thread. Guest panel στην κορυφή με name/email + link στην κράτηση, threaded συνομιλία σε χρονολογική σειρά, inline reply composer από κάτω' },
        { emoji: '✍️', title: 'Composer — Inbound ή Outbound Logging', desc: 'Toggle μεταξύ "Προς guest (εξερχόμενο)" και "Από guest (εισερχόμενο)" — ώστε να μπορείς να καταχωρήσεις ΚΑΙ μηνύματα που έλαβες εξωτερικά (π.χ. από προσωπικό email) στο ίδιο thread. Channel dropdown, optional subject, multi-line body. Auto sets read_at για inbound entries ώστε να μη φαίνονται unread' },
        { emoji: '➕', title: 'Νέο Thread /dashboard/pms/messages/new', desc: 'Διάλεξε listing (required) + optionally κράτηση → αν επιλέξεις booking, το guest name/email γεμίζουν αυτόματα. Support για standalone threads (inquiry που δεν έγινε booking) ή booking-tied threads. Prefill via ?listing_id=&booking_id= για δημιουργία από άλλες σελίδες' },
        { emoji: '🧩', title: 'Shared <MessageComposer/>', desc: 'Ένα component για reply (compact mode) και για new thread (full mode με subject). Reusable για μελλοντικά integrations — όταν συνδεθούν email/WhatsApp/Airbnb parsers, μόνο η μετά-αποστολή logic θα αλλάξει. Διαγραφή thread συνολικά από το [id] page' },
      ],
    },
    {
      version: 'v3.19.0',
      date: '19 Απριλίου 2026',
      highlights: 'PMS Tasks — Καθαρισμοί, Συντήρηση & Ανάθεση σε Συνεργάτες',
      features: [
        { emoji: '🧹', title: 'Λίστα Εργασιών /dashboard/pms/tasks', desc: 'Όλες οι εργασίες σε κάρτες με date block (μήνας + ημέρα + ώρα), type pill (Καθαρισμός/Συντήρηση/Επιθεώρηση/Κλινοσκεπάσματα/Υποδοχή/Αναχώρηση/Custom), status pill (Εκκρεμεί/Σε εξέλιξη/Ολοκληρωμένη/Ακυρώθηκε/Παραλείφθηκε), overdue badge όταν pending + περασμένη ώρα, assignee name & κόστος στα δεξιά' },
        { emoji: '📊', title: '4 Stat Cards στο Top', desc: 'Σήμερα (εργασίες προγραμματισμένες για σήμερα), Εκκρεμούν (status=pending), Καθυστερημένες (pending + passed scheduled_at — κόκκινο warning), Κόστος μήνα (sum completed tasks του τρέχοντα μήνα)' },
        { emoji: '🔎', title: '3-Column Filters + Live Search', desc: 'Listing dropdown, type dropdown (7 τύποι), status dropdown (5 states) + full-text search σε title/assignee/listing name — όλα combinable, instant filtering client-side' },
        { emoji: '➕', title: 'Νέα Εργασία — 4 Sections', desc: '/dashboard/pms/tasks/new — WHAT (type radio cards με icons + title + listing + description), WHEN (scheduled datetime + 5 status pills — completed_at field εμφανίζεται μόνο όταν status=completed), WHO (assignee name/phone/email), MONEY (cost σε € + internal notes)' },
        { emoji: '📅', title: 'Auto-Default σε Αύριο 10:00', desc: 'Νέα εργασία ξεκινά με scheduled_at = αύριο 10πμ — sensible default για cleanings/maintenance. Prefill via ?listing_id=&booking_id=&scheduled_at= querystring για αυτόματη δημιουργία από checkout flow στο μέλλον' },
        { emoji: '✏️', title: 'Επεξεργασία + Διαγραφή', desc: '/dashboard/pms/tasks/[id] — όλα τα πεδία editable, one-click status change, delete με confirm prompt. Shared <TaskForm/> component μεταξύ create & edit. Όταν status→completed, το completed_at γεμίζει αυτόματα με το τώρα αν ήταν κενό' },
        { emoji: '🎨', title: 'Rose Theme + Overdue Highlighting', desc: 'Rose/pink hero gradient, τύποι εργασιών με δικό τους χρωματικό chip, date block γίνεται rose όταν overdue. Status pills είναι buttons στο form (amber pending, sky in-progress, emerald completed, rose cancelled, slate skipped)' },
      ],
    },
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
