'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Globe, Search, Users, QrCode, Home, Calendar, LayoutDashboard,
  Sparkles, CheckCircle, ArrowRight, Heart, MapPin, MessageSquare,
  TrendingUp, Smartphone, Zap, ShieldCheck, Clock, Gift, Star,
  Bed, Coffee, Waves, UtensilsCrossed, Wallet, BellRing, ListChecks,
  PaintBucket,
} from 'lucide-react';

type Service = {
  num: string;
  badge: string;
  icon: typeof Globe;
  title: string;
  tagline: string;
  intro: string;
  bullets: { icon: typeof CheckCircle; text: string }[];
  example: { title: string; body: string };
  win: string;
  gradient: string;
  iconBg: string;
};

type Content = {
  hero: { eyebrow: string; title: string; highlight: string; subtitle: string; cta: string; cta2: string; trust: string[] };
  intro: { title: string; body: string };
  servicesTitle: string;
  servicesSubtitle: string;
  services: Service[];
  freeBanner: { title: string; subtitle: string; price: string; reason: string };
  comparison: { title: string; subtitle: string; cols: { us: string; others: string }; rows: { feature: string; us: string; others: string }[] };
  finalCta: { title: string; subtitle: string; button: string; hint: string };
};

const content: Record<string, Content> = {
  el: {
    hero: {
      eyebrow: '🎁 100% Δωρεάν — Για Πάντα',
      title: 'Όλα όσα παρέχουμε στους ιδιοκτήτες',
      highlight: 'καταλυμάτων στη Χαλκιδική',
      subtitle: 'Από την προβολή σε 30.000 τουρίστες τον μήνα μέχρι ένα ολοκληρωμένο σύστημα διαχείρισης κρατήσεων — δωρεάν, χωρίς προμήθειες, χωρίς κρυφές χρεώσεις.',
      cta: 'Ξεκινήστε Δωρεάν',
      cta2: 'Δείτε τι παίρνετε ↓',
      trust: ['Χωρίς πιστωτική κάρτα', 'Χωρίς προμήθεια', 'Χωρίς δέσμευση'],
    },
    intro: {
      title: 'Δεν είμαστε άλλη μια πλατφόρμα κρατήσεων',
      body: 'Είμαστε η μοναδική πλατφόρμα φτιαγμένη ΜΟΝΟ για τη Χαλκιδική. Δεν παίρνουμε προμήθεια από τις κρατήσεις σας. Δεν σας χρεώνουμε για να εμφανιστείτε. Δεν σας κρύβουμε πίσω από πληρωμένες θέσεις. Σας δίνουμε δωρεάν τα ίδια εργαλεία που οι μεγάλες αλυσίδες πληρώνουν χιλιάδες ευρώ τον μήνα — επειδή θέλουμε η Χαλκιδική να ξεχωρίζει.',
    },
    servicesTitle: 'Τα 4 πράγματα που σας δίνουμε δωρεάν',
    servicesSubtitle: 'Καθένα από αυτά θα κόστιζε εκατοντάδες ευρώ τον μήνα κάπου αλλού.',
    services: [
      {
        num: '01',
        badge: 'Προβολή & Marketing',
        icon: Globe,
        title: 'Δωρεάν καταχώρηση + SEO σε 7 γλώσσες + προβολή σε 30.000 στοχευμένους τουρίστες κάθε μήνα',
        tagline: 'Ο τουρίστας από το Μόναχο, τη Σόφια και το Βελιγράδι θα βρει εσάς — όχι τον γείτονα.',
        intro: 'Καταχωρείτε το κατάλυμά σας μία φορά, στα Ελληνικά. Από εκεί και πέρα η τεχνητή νοημοσύνη μας μεταφράζει αυτόματα την περιγραφή σε Αγγλικά, Γερμανικά, Βουλγαρικά, Ρωσικά, Ρουμανικά και Σερβικά — με σωστή ορθογραφία, τοπικούς όρους και κλειδιά SEO που πιάνουν στην πρώτη σελίδα της Google κάθε χώρας. Ταυτόχρονα, το κατάλυμά σας μπαίνει στο feed που βλέπουν 30.000+ στοχευμένοι επισκέπτες κάθε μήνα — άνθρωποι που ψάχνουν ενεργά για διακοπές στη Χαλκιδική.',
        bullets: [
          { icon: Globe, text: '7 γλώσσες αυτόματα — Ελληνικά, Αγγλικά, Γερμανικά, Βουλγαρικά, Ρωσικά, Ρουμανικά, Σερβικά' },
          { icon: Search, text: 'Meta tags, structured data και κλειδιά SEO σε κάθε γλώσσα — εμφανίζεστε στη Google' },
          { icon: Users, text: '30.000+ μηνιαίοι επισκέπτες που ψάχνουν συγκεκριμένα Χαλκιδική (όχι «κάπου στην Ελλάδα»)' },
          { icon: TrendingUp, text: 'Προβολή σε σελίδες παραλιών, χωριών, εστιατορίων — οι τουρίστες σάς βρίσκουν φυσικά' },
        ],
        example: {
          title: 'Παράδειγμα: Η Μαρία από το Πευκοχώρι',
          body: 'Η Μαρία ανέβασε τη βίλα της στα Ελληνικά σε 4 λεπτά. Μέσα σε 24 ώρες, το κατάλυμα εμφανιζόταν στη Google ως "Villa in Pefkochori, Halkidiki" για Γερμανούς, ως "Хижа Касандра" για Βούλγαρους και ως "Vila Halkidiki" για Σέρβους. Δεν έγραψε ούτε μία λέξη σε ξένη γλώσσα.',
        },
        win: 'Κερδίζετε: Πρόσβαση σε 5+ τουριστικές αγορές της Βαλκανικής και της Κεντρικής Ευρώπης χωρίς να ξέρετε ξένη γλώσσα και χωρίς να πληρώσετε ούτε ευρώ σε διαφημίσεις.',
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-50 text-blue-600',
      },
      {
        num: '02',
        badge: 'Εμπειρία Επισκέπτη',
        icon: QrCode,
        title: 'Προσωπικό QR Code — οι πελάτες σας ανακαλύπτουν τη Χαλκιδική με ένα σκανάρισμα',
        tagline: 'Τυπώστε το, κολλήστε το στο ψυγείο. Κάθε επισκέπτης γίνεται «τοπικός» σε 3 δευτερόλεπτα.',
        intro: 'Σας δίνουμε ένα μοναδικό QR Code, εκτυπωμένο όμορφα, για να το βάλετε στο κατάλυμα — στο ψυγείο, στον καθρέφτη, στο μενού καλωσορίσματος. Όταν ο πελάτης σας το σκανάρει με το κινητό, ανοίγει αμέσως ένας ψηφιακός οδηγός με ΟΛΑ όσα υπάρχουν γύρω του: τις πιο όμορφες παραλίες σε 5 χιλιόμετρα, τα καλύτερα ταβερνάκια, τα αξιοθέατα, τις δραστηριότητες (κανό, καταδύσεις, ιππασία), τα φαρμακεία, ακόμα και τους χάρτες. Όλα στη γλώσσα του — Γερμανικά, Ρωσικά, Σερβικά, ό,τι και να μιλάει.',
        bullets: [
          { icon: Waves, text: 'Κοντινές παραλίες με φωτογραφίες, βαθμολογίες και οδηγίες πρόσβασης' },
          { icon: UtensilsCrossed, text: 'Ταβερνάκια, καφέ και beach bars της περιοχής με τιμές και ώρες' },
          { icon: MapPin, text: 'Δραστηριότητες, αξιοθέατα και κρυφά διαμάντια — όχι ό,τι βρίσκει η Google' },
          { icon: Smartphone, text: 'Λειτουργεί σε κάθε κινητό, χωρίς εφαρμογή, στη γλώσσα του τουρίστα' },
        ],
        example: {
          title: 'Παράδειγμα: Ο Γιάννης στη Σιθωνία',
          body: 'Ο Γιάννης κουραζόταν να δίνει οδηγίες στους πελάτες του για το πού να φάνε. Τύπωσε το QR Code που του δώσαμε σε 6 αντίτυπα και τα έβαλε στα δωμάτια. Τον πρώτο μήνα, οι πελάτες σκανάρισαν 142 φορές. Πήρε 23 5άστερες κριτικές που ανέφεραν συγκεκριμένα τον "ψηφιακό οδηγό". Δεν χρειάστηκε να απαντήσει σε καμία ερώτηση τύπου "πού πάμε για φαγητό".',
        },
        win: 'Κερδίζετε: Καλύτερες κριτικές, λιγότερα τηλέφωνα-ερωτήσεις, πελάτες που νιώθουν φροντισμένοι σαν να είχατε personal concierge — χωρίς να σηκώσετε το τηλέφωνο.',
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-50 text-purple-600',
      },
      {
        num: '03',
        badge: 'Online Παρουσία',
        icon: Home,
        title: 'Δική σας προσωπική σελίδα με διαθεσιμότητες και ημερολόγιο',
        tagline: 'Σαν να έχετε δικό σας site — αλλά χωρίς web designer, χωρίς hosting, χωρίς πονοκέφαλο.',
        intro: 'Κάθε κατάλυμα παίρνει τη δική του προσωπική σελίδα — μια όμορφη, επαγγελματική σελίδα παρουσίασης που μπορείτε να δώσετε ως link σε όποιον σας ρωτήσει: στα social media, στο WhatsApp, στην υπογραφή του email σας. Με μεγάλες φωτογραφίες, αναλυτική περιγραφή σε 7 γλώσσες, χάρτη, παροχές, κριτικές, και — το πιο σημαντικό — διαδραστικό ημερολόγιο διαθεσιμότητας. Ο πελάτης βλέπει ζωντανά ποιες ημερομηνίες είναι ελεύθερες, επιλέγει check-in και check-out, βλέπει την τιμή και κλείνει απευθείας — χωρίς να σας περιμένει, χωρίς να σας τηλεφωνήσει, χωρίς "θα σας πω αύριο".',
        bullets: [
          { icon: Calendar, text: 'Ζωντανό ημερολόγιο διαθεσιμότητας — ο πελάτης βλέπει αμέσως τι είναι ελεύθερο' },
          { icon: PaintBucket, text: 'Επαγγελματικό design με μεγάλες φωτογραφίες και mobile-first εμφάνιση' },
          { icon: Sparkles, text: 'Δικό σας URL τύπου chalkidikihub.gr/villa-thalassini που μοιράζετε εύκολα' },
          { icon: MessageSquare, text: 'Φόρμα κρατήσεων + κουμπιά για WhatsApp/τηλέφωνο/email — επιλέγει ο πελάτης' },
        ],
        example: {
          title: 'Παράδειγμα: Η οικογένεια Παπαδάκη',
          body: 'Η οικογένεια Παπαδάκη είχε ένα πολύ όμορφο σπίτι αλλά καμία online παρουσία. Πριν τη δημιουργία της προσωπικής τους σελίδας, έπαιρναν τηλέφωνα τύπου "πόσο κάνει;" και έχαναν 30 λεπτά την ημέρα στο τηλέφωνο. Τώρα στέλνουν απλά το link τους — οι πελάτες βλέπουν τα πάντα μόνοι τους και ζητάνε κράτηση μόνο όταν είναι έτοιμοι.',
        },
        win: 'Κερδίζετε: Σταματάτε να εξηγείτε τα ίδια πράγματα 50 φορές την ημέρα. Η σελίδα δουλεύει για εσάς 24/7 — ακόμα και όταν κοιμάστε ή έχετε άλλους πελάτες.',
        gradient: 'from-amber-500 to-orange-500',
        iconBg: 'bg-amber-50 text-amber-600',
      },
      {
        num: '04',
        badge: 'PMS — Property Management',
        icon: LayoutDashboard,
        title: 'Πλήρες Σύστημα Διαχείρισης Καταλύματος (PMS) — δωρεάν',
        tagline: 'Ό,τι κάνει το Hostfully, το Lodgify ή το Smoobu — αλλά χωρίς να πληρώνετε 50€-200€ τον μήνα.',
        intro: 'Αυτό που λένε «PMS» οι μεγάλες ξενοδοχειακές αλυσίδες — εμείς σας το δίνουμε δωρεάν. Είναι ένας ολοκληρωμένος πίνακας ελέγχου από όπου διαχειρίζεστε όλη σας τη δουλειά: κρατήσεις, ημερολόγιο, τιμές, οικονομικά, μηνύματα, καθαριότητες, αυτοματισμούς. Τέλος τα ραβασάκια στο τετράδιο, τέλος τα Excel που χάνονται, τέλος οι διπλοκρατήσεις. Όλα σε ένα σημείο, σε κινητό και υπολογιστή, με ειδοποιήσεις και αυτοματισμούς που σας γλιτώνουν ώρες κάθε εβδομάδα.',
        bullets: [
          { icon: Calendar, text: 'Ημερολόγιο κρατήσεων — δείτε με μια ματιά τον μήνα ολόκληρο' },
          { icon: Wallet, text: 'Οικονομικά: έσοδα, έξοδα, καθαρό κέρδος, αναφορές για τον λογιστή' },
          { icon: BellRing, text: 'Αυτόματα μηνύματα: καλωσόρισμα, οδηγίες check-in, ευχαριστίες μετά την αναχώρηση' },
          { icon: ListChecks, text: 'Αυτόματες εργασίες καθαριότητας — η καθαρίστρια ξέρει πότε και πού' },
          { icon: TrendingUp, text: 'Δυναμικές τιμές — υψηλότερη χρέωση τα Σαββατοκύριακα και τον Αύγουστο, αυτόματα' },
          { icon: MessageSquare, text: 'Ενιαία επικοινωνία με όλους τους πελάτες σε ένα μέρος' },
        ],
        example: {
          title: 'Παράδειγμα: Ο Νίκος με τα 4 διαμερίσματα',
          body: 'Ο Νίκος νοίκιαζε 4 διαμερίσματα και ζούσε με post-it στο ψυγείο. Από τότε που μπήκε στο PMS μας: όλες οι κρατήσεις φαίνονται σε ένα ημερολόγιο, η καθαρίστρια λαμβάνει αυτόματα ειδοποίηση μετά από κάθε check-out, οι πελάτες παίρνουν αυτόματα τις οδηγίες κλειδιού 2 ώρες πριν, και κάθε μήνα του βγαίνει αναφορά εσόδων-εξόδων που τη στέλνει στον λογιστή. Κέρδισε περίπου 6 ώρες την εβδομάδα.',
        },
        win: 'Κερδίζετε: Χρόνο, ηρεμία και επαγγελματισμό. Διαχειρίζεστε 1, 5 ή 20 καταλύματα σαν επαγγελματίας hotel manager — χωρίς να πληρώσετε ούτε ένα ευρώ συνδρομή.',
        gradient: 'from-emerald-500 to-teal-500',
        iconBg: 'bg-emerald-50 text-emerald-600',
      },
    ],
    freeBanner: {
      title: 'Πόσο κοστίζουν όλα αυτά;',
      subtitle: 'Σε άλλες πλατφόρμες θα πληρώνατε 200€-500€ τον μήνα. Σε εμάς:',
      price: '0€ / για πάντα',
      reason: 'Δεν είμαστε εμπορική επιχείρηση. Είμαστε μη κερδοσκοπική πρωτοβουλία ντόπιων που θέλουμε η Χαλκιδική να ανθίσει. Όσο πιο γνωστή γίνεται η περιοχή, τόσο πιο πολλοί τουρίστες έρχονται — και αυτό βοηθάει όλους εμάς.',
    },
    comparison: {
      title: 'Σύγκριση με τις μεγάλες πλατφόρμες',
      subtitle: 'Ναι, είμαστε δωρεάν. Αλλά είμαστε και καλύτεροι σε αυτό που έχει σημασία.',
      cols: { us: 'ChalkidikiHub', others: 'Booking / Airbnb' },
      rows: [
        { feature: 'Προμήθεια ανά κράτηση', us: '0%', others: '15% — 25%' },
        { feature: 'Μηνιαία συνδρομή', us: 'Δωρεάν', others: '0€ — 500€' },
        { feature: 'Αυτόματες μεταφράσεις', us: '7 γλώσσες', others: 'Περιορισμένα' },
        { feature: 'QR οδηγός για επισκέπτες', us: 'Ναι', others: 'Όχι' },
        { feature: 'Δική σας σελίδα με URL', us: 'Ναι', others: 'Όχι' },
        { feature: 'PMS (διαχείριση)', us: 'Πλήρες, δωρεάν', others: 'Έξτρα χρέωση' },
        { feature: 'Επικοινωνία απευθείας με πελάτη', us: 'Ναι', others: 'Μέσω πλατφόρμας' },
        { feature: 'Εστίαση μόνο σε Χαλκιδική', us: 'Ναι', others: 'Όχι' },
      ],
    },
    finalCta: {
      title: 'Αξίζει 5 λεπτά να δοκιμάσετε.',
      subtitle: 'Δημιουργήστε λογαριασμό δωρεάν, καταχωρήστε το κατάλυμά σας, και δείτε μόνοι σας. Αν δεν σας αρέσει, διαγράφετε. Δεν δεσμεύεστε σε τίποτα.',
      button: 'Ξεκινήστε Δωρεάν Τώρα →',
      hint: 'Χωρίς πιστωτική κάρτα • Χωρίς προμήθεια • Χωρίς δέσμευση',
    },
  },
  en: {
    hero: {
      eyebrow: '🎁 100% Free — Forever',
      title: 'Everything we offer to property owners',
      highlight: 'in Halkidiki',
      subtitle: 'From exposure to 30,000 monthly tourists to a complete booking management system — free, no commissions, no hidden fees.',
      cta: 'Start Free',
      cta2: 'See what you get ↓',
      trust: ['No credit card', 'No commission', 'No commitment'],
    },
    intro: {
      title: 'We are not just another booking platform',
      body: 'We are the only platform built ONLY for Halkidiki. We do not take commissions on your bookings. We do not charge you to appear. We do not hide you behind paid placements. We give you for free the same tools that big hotel chains pay thousands of euros per month for — because we want Halkidiki to shine.',
    },
    servicesTitle: 'The 4 things we give you for free',
    servicesSubtitle: 'Each one would cost you hundreds of euros per month elsewhere.',
    services: [
      {
        num: '01',
        badge: 'Exposure & Marketing',
        icon: Globe,
        title: 'Free listing + SEO in 7 languages + visibility to 30,000 targeted tourists every month',
        tagline: 'The tourist from Munich, Sofia and Belgrade will find YOU — not your neighbor.',
        intro: 'You list your property once, in Greek. From then on, our AI automatically translates your description into English, German, Bulgarian, Russian, Romanian and Serbian — with proper grammar, local terms and SEO keywords that rank on the first page of Google in every country. At the same time, your property enters a feed seen by 30,000+ targeted visitors per month — people actively searching for a vacation in Halkidiki.',
        bullets: [
          { icon: Globe, text: '7 languages automatically — Greek, English, German, Bulgarian, Russian, Romanian, Serbian' },
          { icon: Search, text: 'Meta tags, structured data and SEO keywords in every language — you appear on Google' },
          { icon: Users, text: '30,000+ monthly visitors specifically searching Halkidiki (not "somewhere in Greece")' },
          { icon: TrendingUp, text: 'Visibility on beach pages, village pages, restaurant pages — tourists find you naturally' },
        ],
        example: {
          title: 'Example: Maria from Pefkochori',
          body: 'Maria uploaded her villa in Greek in 4 minutes. Within 24 hours, the property appeared on Google as "Villa in Pefkochori, Halkidiki" for Germans, "Хижа Касандра" for Bulgarians and "Vila Halkidiki" for Serbs. She did not write a single word in any foreign language.',
        },
        win: 'You gain: Access to 5+ tourist markets in the Balkans and Central Europe without speaking a foreign language and without paying a single euro in advertising.',
        gradient: 'from-blue-500 to-cyan-500',
        iconBg: 'bg-blue-50 text-blue-600',
      },
      {
        num: '02',
        badge: 'Guest Experience',
        icon: QrCode,
        title: 'Personal QR Code — your guests discover Halkidiki with one scan',
        tagline: 'Print it, stick it on the fridge. Every guest becomes a "local" in 3 seconds.',
        intro: 'We give you a unique QR Code, beautifully printed, to place in your property — on the fridge, on the mirror, in your welcome menu. When a guest scans it with their phone, a digital guide instantly opens with EVERYTHING around them: the most beautiful beaches within 5 km, the best taverns, attractions, activities (kayaking, diving, horse riding), pharmacies, even maps. Everything in their language — German, Russian, Serbian, whatever they speak.',
        bullets: [
          { icon: Waves, text: 'Nearby beaches with photos, ratings and access directions' },
          { icon: UtensilsCrossed, text: 'Local taverns, cafés and beach bars with prices and hours' },
          { icon: MapPin, text: 'Activities, attractions and hidden gems — not just what Google shows' },
          { icon: Smartphone, text: 'Works on any phone, no app needed, in the tourist\'s own language' },
        ],
        example: {
          title: 'Example: Yannis in Sithonia',
          body: 'Yannis was tired of giving directions to guests about where to eat. He printed the QR Code we gave him in 6 copies and put them in the rooms. In the first month, guests scanned it 142 times. He got 23 five-star reviews specifically mentioning the "digital guide". He never had to answer another "where do we go for food" question.',
        },
        win: 'You gain: Better reviews, fewer phone-call questions, guests who feel taken care of like you have a personal concierge — without picking up the phone.',
        gradient: 'from-purple-500 to-pink-500',
        iconBg: 'bg-purple-50 text-purple-600',
      },
      {
        num: '03',
        badge: 'Online Presence',
        icon: Home,
        title: 'Your own personal page with availability and calendar',
        tagline: 'Like having your own website — but without a web designer, hosting, or headaches.',
        intro: 'Every property gets its own personal page — a beautiful, professional landing page you can share with anyone who asks: on social media, on WhatsApp, in your email signature. With large photos, detailed descriptions in 7 languages, a map, amenities, reviews, and — most importantly — an interactive availability calendar. The guest sees in real time which dates are free, picks check-in and check-out, sees the price and books directly — without waiting for you, without calling you, without "I\'ll let you know tomorrow".',
        bullets: [
          { icon: Calendar, text: 'Live availability calendar — guests instantly see what is free' },
          { icon: PaintBucket, text: 'Professional design with large photos and mobile-first layout' },
          { icon: Sparkles, text: 'Your own URL like chalkidikihub.gr/villa-thalassini that you share easily' },
          { icon: MessageSquare, text: 'Booking form + WhatsApp/phone/email buttons — guest chooses' },
        ],
        example: {
          title: 'Example: The Papadakis family',
          body: 'The Papadakis family had a beautiful house but no online presence. Before their personal page, they got calls like "how much is it?" and lost 30 minutes a day on the phone. Now they just send their link — guests see everything themselves and only ask to book when they are ready.',
        },
        win: 'You gain: Stop explaining the same things 50 times a day. The page works for you 24/7 — even when you sleep or have other guests.',
        gradient: 'from-amber-500 to-orange-500',
        iconBg: 'bg-amber-50 text-amber-600',
      },
      {
        num: '04',
        badge: 'PMS — Property Management',
        icon: LayoutDashboard,
        title: 'Complete Property Management System (PMS) — for free',
        tagline: 'Everything Hostfully, Lodgify or Smoobu offer — but without paying €50-€200 per month.',
        intro: 'What big hotel chains call a "PMS" — we give you for free. It is a complete dashboard from where you manage your entire business: bookings, calendar, prices, finances, messages, cleaning, automations. No more notebooks, no more lost Excel files, no more double bookings. Everything in one place, on phone and computer, with notifications and automations that save you hours every week.',
        bullets: [
          { icon: Calendar, text: 'Booking calendar — see your entire month at a glance' },
          { icon: Wallet, text: 'Finances: income, expenses, net profit, reports for your accountant' },
          { icon: BellRing, text: 'Automatic messages: welcome, check-in instructions, thank-you after departure' },
          { icon: ListChecks, text: 'Automatic cleaning tasks — your cleaner knows when and where' },
          { icon: TrendingUp, text: 'Dynamic pricing — higher rates on weekends and August, automatically' },
          { icon: MessageSquare, text: 'Unified communication with all guests in one place' },
        ],
        example: {
          title: 'Example: Nikos with 4 apartments',
          body: 'Nikos rented 4 apartments and lived by post-it notes on the fridge. Since joining our PMS: all bookings show on one calendar, the cleaner gets notified automatically after each check-out, guests get key instructions automatically 2 hours before, and every month he gets an income-expense report he sends to his accountant. He saved about 6 hours a week.',
        },
        win: 'You gain: Time, peace of mind and professionalism. Manage 1, 5 or 20 properties like a pro hotel manager — without paying a single euro in subscriptions.',
        gradient: 'from-emerald-500 to-teal-500',
        iconBg: 'bg-emerald-50 text-emerald-600',
      },
    ],
    freeBanner: {
      title: 'How much does all this cost?',
      subtitle: 'On other platforms you would pay €200-€500 per month. With us:',
      price: '€0 / forever',
      reason: 'We are not a commercial business. We are a non-profit local initiative that wants Halkidiki to flourish. The more well-known the area becomes, the more tourists arrive — and that helps all of us.',
    },
    comparison: {
      title: 'Comparison with the big platforms',
      subtitle: 'Yes, we are free. But we are also better at what matters.',
      cols: { us: 'ChalkidikiHub', others: 'Booking / Airbnb' },
      rows: [
        { feature: 'Commission per booking', us: '0%', others: '15% — 25%' },
        { feature: 'Monthly subscription', us: 'Free', others: '€0 — €500' },
        { feature: 'Automatic translations', us: '7 languages', others: 'Limited' },
        { feature: 'QR guest guide', us: 'Yes', others: 'No' },
        { feature: 'Your own page with URL', us: 'Yes', others: 'No' },
        { feature: 'PMS (management)', us: 'Full, free', others: 'Extra charge' },
        { feature: 'Direct guest communication', us: 'Yes', others: 'Through platform' },
        { feature: 'Halkidiki-only focus', us: 'Yes', others: 'No' },
      ],
    },
    finalCta: {
      title: 'It\'s worth 5 minutes to try.',
      subtitle: 'Create a free account, list your property, and see for yourself. If you don\'t like it, delete it. No commitment whatsoever.',
      button: 'Start Free Now →',
      hint: 'No credit card • No commission • No commitment',
    },
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

function buildJsonLd(locale: string, t: Content) {
  const pageUrl = locale === 'el'
    ? `${SITE_URL}/for-owners/services`
    : `${SITE_URL}/${locale}/for-owners/services`;
  const homeUrl = locale === 'el' ? SITE_URL : `${SITE_URL}/${locale}`;
  const forOwnersUrl = locale === 'el'
    ? `${SITE_URL}/for-owners`
    : `${SITE_URL}/${locale}/for-owners`;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'el' ? 'Αρχική' : 'Home', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: locale === 'el' ? 'Για Ιδιοκτήτες' : 'For Owners', item: forOwnersUrl },
      { '@type': 'ListItem', position: 3, name: t.hero.title, item: pageUrl },
    ],
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t.hero.title,
    description: t.hero.subtitle,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: 'ChalkidikiHub',
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512.png`,
    },
    areaServed: { '@type': 'Place', name: 'Halkidiki, Greece' },
    audience: { '@type': 'BusinessAudience', name: locale === 'el' ? 'Ιδιοκτήτες καταλυμάτων' : 'Property owners' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: t.freeBanner.reason,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t.servicesTitle,
      itemListElement: t.services.map(s => ({
        '@type': 'Offer',
        name: s.title,
        description: s.intro,
        price: '0',
        priceCurrency: 'EUR',
      })),
    },
  };

  return [breadcrumbs, service];
}

export default function ServicesPage() {
  const locale = useLocale();
  const t = content[locale] || content.en;
  const jsonLd = buildJsonLd(locale, t);

  return (
    <div className="bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-teal-700 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur text-sm font-medium mb-6">
            {t.hero.eyebrow}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t.hero.title}{' '}
            <span className="text-amber-300">{t.hero.highlight}</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-50 mb-10 max-w-3xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/register" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-all shadow-xl hover:-translate-y-0.5">
              {t.hero.cta}
            </Link>
            <a href="#services" className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-colors">
              {t.hero.cta2}
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-primary-100">
            {t.hero.trust.map((tx, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-300" /> {tx}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{t.intro.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t.intro.body}</p>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.servicesTitle}</h2>
            <p className="text-lg text-gray-600">{t.servicesSubtitle}</p>
          </div>

          <div className="space-y-12 md:space-y-20">
            {t.services.map((s, idx) => (
              <article key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${s.gradient}`} />
                <div className="p-6 md:p-10 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: number + icon + badge */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                        <span className={`text-6xl md:text-7xl font-black bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent leading-none`}>
                          {s.num}
                        </span>
                        <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center`}>
                          <s.icon className="w-7 h-7" />
                        </div>
                      </div>
                      <span className="inline-block mt-4 px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        {s.badge}
                      </span>
                    </div>

                    {/* Right: content */}
                    <div className="lg:col-span-9">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{s.title}</h3>
                      <p className="text-lg text-primary-700 italic mb-6 font-medium">{s.tagline}</p>
                      <p className="text-gray-700 leading-relaxed mb-8">{s.intro}</p>

                      {/* Bullets */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {s.bullets.map((b, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                            <b.icon className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-relaxed">{b.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Example */}
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl mb-6">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                          {locale === 'el' ? '💡 Πραγματικό παράδειγμα' : '💡 Real example'}
                        </p>
                        <p className="font-bold text-gray-900 mb-1.5">{s.example.title}</p>
                        <p className="text-gray-700 leading-relaxed text-sm">{s.example.body}</p>
                      </div>

                      {/* Win */}
                      <div className={`bg-gradient-to-r ${s.gradient} rounded-xl p-5 text-white`}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5 opacity-90">
                          {locale === 'el' ? '✨ Τι κερδίζετε' : '✨ What you gain'}
                        </p>
                        <p className="leading-relaxed">{s.win}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FREE BANNER ─── */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Gift className="w-14 h-14 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.freeBanner.title}</h2>
          <p className="text-lg text-gray-600 mb-6">{t.freeBanner.subtitle}</p>
          <div className="text-6xl md:text-7xl font-black text-emerald-600 mb-6">{t.freeBanner.price}</div>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{t.freeBanner.reason}</p>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t.comparison.title}</h2>
            <p className="text-lg text-gray-600">{t.comparison.subtitle}</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 md:px-6 py-4 text-sm font-bold text-gray-700"></th>
                  <th className="px-4 md:px-6 py-4 text-sm font-bold text-primary-700 text-center bg-primary-50">
                    {t.comparison.cols.us}
                  </th>
                  <th className="px-4 md:px-6 py-4 text-sm font-bold text-gray-500 text-center">
                    {t.comparison.cols.others}
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-emerald-700 font-bold text-center bg-primary-50/30">
                      {row.us}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-600 text-center">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: ShieldCheck, label: locale === 'el' ? 'Ασφαλές' : 'Secure', sub: 'SSL / GDPR' },
              { icon: Heart, label: locale === 'el' ? 'Δωρεάν' : 'Free', sub: locale === 'el' ? 'Για πάντα' : 'Forever' },
              { icon: Clock, label: locale === 'el' ? 'Γρήγορο' : 'Fast', sub: locale === 'el' ? '< 5 λεπτά' : '< 5 minutes' },
              { icon: Star, label: locale === 'el' ? 'Αξιόπιστο' : 'Trusted', sub: locale === 'el' ? 'Χαλκιδική' : 'Halkidiki' },
              { icon: Zap, label: 'AI-Powered', sub: locale === 'el' ? '7 γλώσσες' : '7 languages' },
              { icon: Bed, label: 'PMS', sub: locale === 'el' ? 'Πλήρες' : 'Full suite' },
              { icon: Coffee, label: 'QR Guide', sub: locale === 'el' ? 'Για επισκέπτες' : 'For guests' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.finalCta.title}</h2>
          <p className="text-lg text-primary-50 mb-8">{t.finalCta.subtitle}</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold rounded-2xl text-lg hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            <ArrowRight className="w-5 h-5" />
            {t.finalCta.button}
          </Link>
          <p className="mt-4 text-sm text-primary-200">{t.finalCta.hint}</p>
        </div>
      </section>
    </div>
  );
}
