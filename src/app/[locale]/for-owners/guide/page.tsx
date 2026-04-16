'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  UserPlus, Home, PenLine, ImagePlus, MapPin, Globe, Sparkles, Eye,
  QrCode, BarChart3, CheckCircle, Shield, Clock, ArrowRight, ArrowDown,
  Phone, Mail, MousePointerClick, Star, Heart, Zap, MessageCircle,
  ExternalLink, Smartphone,
} from 'lucide-react';

/* ────────────────────────────────────────────────── */
/*  CONTENT — EL / EN                                 */
/* ────────────────────────────────────────────────── */

interface StepContent {
  num: number;
  icon: typeof UserPlus;
  title: string;
  desc: string;
  details: string[];
  tip?: string;
  color: string;
}

interface GuideContent {
  hero: { badge: string; title: string; subtitle: string; cta: string; trust: string[] };
  overview: { title: string; desc: string };
  stepsTitle: string;
  steps: StepContent[];
  after: { title: string; features: { icon: typeof QrCode; title: string; desc: string }[] };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; subtitle: string; button: string; hint: string };
}

const content: Record<string, GuideContent> = {
  el: {
    hero: {
      badge: '📖 Αναλυτικός Οδηγός',
      title: 'Πώς καταχωρώ το κατάλυμά μου στο ChalkidikiHub',
      subtitle: 'Βήμα-βήμα, εύκολα, σε λιγότερο από 5 λεπτά. Δωρεάν, χωρίς κρυφές χρεώσεις.',
      cta: 'Ξεκινήστε Τώρα →',
      trust: ['100% Δωρεάν', 'Χωρίς Προμήθεια', '5 λεπτά', '7 Γλώσσες'],
    },
    overview: {
      title: 'Η διαδικασία σε 30 δευτερόλεπτα',
      desc: 'Δημιουργείτε λογαριασμό, συμπληρώνετε τα στοιχεία του καταλύματός σας μόνο στα Ελληνικά, ανεβάζετε φωτογραφίες, και πατάτε «Δημοσίευση». Αυτό ήταν! Η τεχνητή νοημοσύνη αναλαμβάνει τα υπόλοιπα — μεταφράσεις σε 6 γλώσσες, SEO, βελτιστοποίηση εικόνων.',
    },
    stepsTitle: 'Αναλυτικά Βήματα',
    steps: [
      {
        num: 1, icon: UserPlus, color: 'from-blue-500 to-blue-600',
        title: 'Δημιουργία Λογαριασμού',
        desc: 'Η εγγραφή γίνεται σε 30 δευτερόλεπτα. Δεν χρειάζεται πιστωτική κάρτα.',
        details: [
          'Πατήστε «Εγγραφή» (πάνω δεξιά στη σελίδα)',
          'Συμπληρώστε: Ονοματεπώνυμο, Email, Τηλέφωνο, Κωδικό',
          'Πατήστε «Εγγραφή» — μπαίνετε αυτόματα στον πίνακα ελέγχου',
        ],
        tip: 'Χρησιμοποιήστε ένα email που ελέγχετε τακτικά — εκεί θα λαμβάνετε τα αιτήματα κρατήσεων.',
      },
      {
        num: 2, icon: PenLine, color: 'from-emerald-500 to-emerald-600',
        title: 'Συμπληρώστε τα Στοιχεία',
        desc: 'Γράψτε μόνο στα Ελληνικά — η τεχνητή νοημοσύνη μεταφράζει αυτόματα!',
        details: [
          'Στον πίνακα ελέγχου, πατήστε «Νέο Κατάλυμα»',
          'Βάλτε τίτλο (π.χ. «Βίλα Θαλασσινή — Κασσάνδρα»)',
          'Γράψτε μια περιγραφή 3-4 προτάσεις',
          'Επιλέξτε περιοχή (Κασσάνδρα, Σιθωνία, Άθως, Ενδοχώρα)',
          'Βάλτε τιμή ανά βραδιά, υπνοδωμάτια, μπάνια, μέγιστους επισκέπτες',
        ],
        tip: 'Δεν χρειάζεται να είναι τέλειο! Μπορείτε πάντα να επεξεργαστείτε αργότερα.',
      },
      {
        num: 3, icon: ImagePlus, color: 'from-amber-500 to-orange-500',
        title: 'Ανεβάστε Φωτογραφίες',
        desc: 'Οι φωτογραφίες κάνουν τη διαφορά! Ανεβάστε τις καλύτερές σας.',
        details: [
          'Πατήστε «Προσθήκη Εικόνων»',
          'Επιλέξτε φωτογραφίες από τη συσκευή σας (ή τραβήξτε νέες!)',
          'Σύρετε για να αλλάξετε σειρά — η πρώτη γίνεται εξώφυλλο',
          'Συνιστώμενες: τουλάχιστον 5 φωτογραφίες',
        ],
        tip: 'Βάλτε φωτογραφίες: εξωτερικό, σαλόνι, κρεβατοκάμαρα, μπάνιο, θέα. Φυσικό φως = καλύτερο αποτέλεσμα!',
      },
      {
        num: 4, icon: MapPin, color: 'from-red-500 to-rose-500',
        title: 'Τοποθεσία στο Χάρτη',
        desc: 'Σύρετε τον χάρτη στην ακριβή τοποθεσία του καταλύματός σας.',
        details: [
          'Ο χάρτης εμφανίζεται αυτόματα',
          'Κάντε κλικ ή σύρετε τον δείκτη στη σωστή θέση',
          'Γράψτε το όνομα της περιοχής (π.χ. «Πευκοχώρι, Κασσάνδρα»)',
        ],
        tip: 'Η ακριβής τοποθεσία βοηθάει τους επισκέπτες να βρουν κοντινές παραλίες και εστιατόρια.',
      },
      {
        num: 5, icon: Home, color: 'from-purple-500 to-violet-500',
        title: 'Παροχές & Booking Links',
        desc: 'Τσεκάρετε τις παροχές και συνδέστε τα booking links σας.',
        details: [
          'Επιλέξτε παροχές: WiFi, Parking, A/C, Πισίνα, Κουζίνα, Θέα θάλασσα...',
          'Προσθέστε link Booking.com (αν έχετε)',
          'Προσθέστε link Airbnb (αν έχετε)',
          'Ή βάλτε το δικό σας site/τηλέφωνο',
        ],
        tip: 'Τα booking links δεν είναι υποχρεωτικά. Οι ενδιαφερόμενοι μπορούν να σας στείλουν αίτημα κράτησης μέσω φόρμας.',
      },
      {
        num: 6, icon: Eye, color: 'from-teal-500 to-cyan-500',
        title: 'Δημοσίευση!',
        desc: 'Πατήστε «Αποθήκευση» και το κατάλυμά σας είναι online!',
        details: [
          'Ελέγξτε τα στοιχεία — όλα σωστά;',
          'Πατήστε «Αποθήκευση»',
          'Το κατάλυμα δημοσιεύεται αμέσως',
          'Η AI ξεκινάει μεταφράσεις σε 6 γλώσσες αυτόματα',
        ],
        tip: 'Μπορείτε να αλλάξετε κατάσταση σε «Draft» ανά πάσα στιγμή αν θέλετε να κρύψετε προσωρινά το κατάλυμα.',
      },
    ],
    after: {
      title: 'Μετά τη δημοσίευση — Τι κερδίζετε',
      features: [
        {
          icon: Globe, title: '7 Γλώσσες Αυτόματα',
          desc: 'Η AI μεταφράζει σε Αγγλικά, Γερμανικά, Βουλγαρικά, Ρωσικά, Ρουμανικά, Σερβικά. Χωρίς να κάνετε τίποτα.',
        },
        {
          icon: QrCode, title: 'QR Guest Guide',
          desc: 'Λαμβάνετε ένα QR code. Οι πελάτες σκανάρουν και βλέπουν κοντινές παραλίες, εστιατόρια, δραστηριότητες.',
        },
        {
          icon: BarChart3, title: 'Στατιστικά',
          desc: 'Βλέπετε πόσοι είδαν τη σελίδα σας, πόσοι σκάναραν το QR, πόσα αιτήματα λάβατε.',
        },
        {
          icon: MessageCircle, title: 'Αιτήματα Κρατήσεων',
          desc: 'Οι ενδιαφερόμενοι στέλνουν αίτημα μέσω φόρμας — λαμβάνετε email αμέσως.',
        },
        {
          icon: Sparkles, title: 'AI SEO',
          desc: 'Αυτόματα meta tags, structured data, alt text εικόνων. Εμφανίζεστε στη Google σε 7 γλώσσες.',
        },
        {
          icon: Smartphone, title: 'Mobile App',
          desc: 'Η σελίδα λειτουργεί σαν εφαρμογή — οι πελάτες μπορούν να την «εγκαταστήσουν» στο κινητό τους.',
        },
      ],
    },
    faq: {
      title: 'Συχνές Ερωτήσεις',
      items: [
        { q: 'Κοστίζει κάτι;', a: 'Όχι. Είναι 100% δωρεάν. Δεν υπάρχουν κρυφές χρεώσεις, δεν υπάρχουν προμήθειες, δεν θα σας ζητήσουμε ποτέ κάρτα.' },
        { q: 'Χρειάζεται να γράψω σε πολλές γλώσσες;', a: 'Όχι! Γράφετε μόνο στα Ελληνικά. Η τεχνητή νοημοσύνη μεταφράζει αυτόματα σε 6 ακόμα γλώσσες.' },
        { q: 'Μπορώ να αλλάξω τα στοιχεία αργότερα;', a: 'Φυσικά! Μπαίνετε στον πίνακα ελέγχου σας ανά πάσα στιγμή και αλλάζετε ό,τι θέλετε.' },
        { q: 'Πώς λαμβάνω κρατήσεις;', a: 'Οι ενδιαφερόμενοι στέλνουν αίτημα μέσω φόρμας. Λαμβάνετε email με τα στοιχεία τους. Αν έχετε Booking/Airbnb, μπορείτε να βάλετε τα links σας.' },
        { q: 'Τι είναι το QR Guest Guide;', a: 'Ένα QR code που βάζετε στα δωμάτια. Οι πελάτες σκανάρουν με το κινητό και βλέπουν αμέσως κοντινές παραλίες, εστιατόρια, δραστηριότητες — σε 7 γλώσσες!' },
        { q: 'Χρειάζομαι τεχνικές γνώσεις;', a: 'Καθόλου. Αν ξέρετε να χρησιμοποιείτε email και Facebook, μπορείτε. Είναι πιο εύκολο από κράτηση σε εστιατόριο!' },
        { q: 'Τι γίνεται αν δεν μου αρέσει;', a: 'Μπαίνετε, σβήνετε το κατάλυμα, τελείωσε. Δεν δεσμεύεστε σε τίποτα.' },
      ],
    },
    cta: {
      title: 'Έτοιμοι; Ξεκινήστε σε 30 δευτερόλεπτα!',
      subtitle: 'Δημιουργήστε δωρεάν λογαριασμό και καταχωρήστε το κατάλυμά σας σήμερα.',
      button: 'Δωρεάν Εγγραφή',
      hint: 'Δεν χρειάζεται πιστωτική κάρτα • Δεν υπάρχουν δεσμεύσεις',
    },
  },
  en: {
    hero: {
      badge: '📖 Detailed Guide',
      title: 'How to list your property on ChalkidikiHub',
      subtitle: 'Step by step, easily, in less than 5 minutes. Free, with no hidden fees.',
      cta: 'Get Started →',
      trust: ['100% Free', 'No Commission', '5 minutes', '7 Languages'],
    },
    overview: {
      title: 'The process in 30 seconds',
      desc: 'Create an account, fill in your property details in Greek only, upload photos, and click "Publish". That\'s it! AI handles the rest — translations to 6 languages, SEO, image optimization.',
    },
    stepsTitle: 'Detailed Steps',
    steps: [
      {
        num: 1, icon: UserPlus, color: 'from-blue-500 to-blue-600',
        title: 'Create Account',
        desc: 'Registration takes 30 seconds. No credit card required.',
        details: [
          'Click "Register" (top right of the page)',
          'Fill in: Full Name, Email, Phone, Password',
          'Click "Register" — you\'re automatically taken to your dashboard',
        ],
        tip: 'Use an email you check regularly — that\'s where you\'ll receive booking requests.',
      },
      {
        num: 2, icon: PenLine, color: 'from-emerald-500 to-emerald-600',
        title: 'Fill in the Details',
        desc: 'Write in Greek only — AI translates automatically!',
        details: [
          'In the dashboard, click "New Listing"',
          'Add a title (e.g. "Villa Thalassini — Kassandra")',
          'Write a description (3-4 sentences)',
          'Select area (Kassandra, Sithonia, Athos, Mainland)',
          'Add price per night, bedrooms, bathrooms, max guests',
        ],
        tip: 'It doesn\'t need to be perfect! You can always edit later.',
      },
      {
        num: 3, icon: ImagePlus, color: 'from-amber-500 to-orange-500',
        title: 'Upload Photos',
        desc: 'Photos make the difference! Upload your best ones.',
        details: [
          'Click "Add Images"',
          'Select photos from your device',
          'Drag to reorder — first one becomes the cover',
          'Recommended: at least 5 photos',
        ],
        tip: 'Include photos of: exterior, living room, bedroom, bathroom, view. Natural light = best results!',
      },
      {
        num: 4, icon: MapPin, color: 'from-red-500 to-rose-500',
        title: 'Location on Map',
        desc: 'Drag the map to your property\'s exact location.',
        details: [
          'The map appears automatically',
          'Click or drag the pin to the correct spot',
          'Type the area name (e.g. "Pefkochori, Kassandra")',
        ],
        tip: 'Accurate location helps visitors find nearby beaches and restaurants.',
      },
      {
        num: 5, icon: Home, color: 'from-purple-500 to-violet-500',
        title: 'Amenities & Booking Links',
        desc: 'Check amenities and connect your booking links.',
        details: [
          'Select amenities: WiFi, Parking, A/C, Pool, Kitchen, Sea View...',
          'Add Booking.com link (if available)',
          'Add Airbnb link (if available)',
          'Or add your own website/phone',
        ],
        tip: 'Booking links are optional. Interested guests can send requests through the contact form.',
      },
      {
        num: 6, icon: Eye, color: 'from-teal-500 to-cyan-500',
        title: 'Publish!',
        desc: 'Click "Save" and your property goes live!',
        details: [
          'Review your details — everything correct?',
          'Click "Save"',
          'Property is published immediately',
          'AI starts translating to 6 languages automatically',
        ],
        tip: 'You can switch to "Draft" anytime if you want to temporarily hide your listing.',
      },
    ],
    after: {
      title: 'After publishing — What you get',
      features: [
        {
          icon: Globe, title: '7 Languages Automatically',
          desc: 'AI translates to English, German, Bulgarian, Russian, Romanian, Serbian. Without you doing anything.',
        },
        {
          icon: QrCode, title: 'QR Guest Guide',
          desc: 'You receive a QR code. Guests scan it and see nearby beaches, restaurants, activities.',
        },
        {
          icon: BarChart3, title: 'Statistics',
          desc: 'See how many viewed your page, how many scanned the QR, how many requests you received.',
        },
        {
          icon: MessageCircle, title: 'Booking Requests',
          desc: 'Interested guests send requests through a form — you receive an email instantly.',
        },
        {
          icon: Sparkles, title: 'AI SEO',
          desc: 'Automatic meta tags, structured data, image alt text. You appear on Google in 7 languages.',
        },
        {
          icon: Smartphone, title: 'Mobile App',
          desc: 'The site works like an app — guests can "install" it on their phone.',
        },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Does it cost anything?', a: 'No. It\'s 100% free. No hidden fees, no commissions, we\'ll never ask for a card.' },
        { q: 'Do I need to write in multiple languages?', a: 'No! Write only in Greek. AI automatically translates to 6 more languages.' },
        { q: 'Can I edit later?', a: 'Of course! Log into your dashboard anytime and change anything you want.' },
        { q: 'How do I receive bookings?', a: 'Interested guests send requests through a form. You receive an email with their details. If you have Booking/Airbnb, you can add your links.' },
        { q: 'What is the QR Guest Guide?', a: 'A QR code you place in your rooms. Guests scan with their phone and instantly see nearby beaches, restaurants, activities — in 7 languages!' },
        { q: 'Do I need technical skills?', a: 'Not at all. If you can use email and Facebook, you can do this. It\'s easier than making a restaurant reservation!' },
        { q: 'What if I don\'t like it?', a: 'Log in, delete your listing, done. No commitments whatsoever.' },
      ],
    },
    cta: {
      title: 'Ready? Start in 30 seconds!',
      subtitle: 'Create a free account and list your property today.',
      button: 'Free Registration',
      hint: 'No credit card required • No commitments',
    },
  },
};

/* ────────────────────────────────────────────────── */
/*  COMPONENT                                         */
/* ────────────────────────────────────────────────── */

export default function OwnerGuidePage() {
  const locale = useLocale();
  const t = content[locale] || content.en;

  return (
    <div className="bg-white">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-teal-800">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-20 md:py-28 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm font-medium mb-6 border border-white/10">
            {t.hero.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl text-lg hover:bg-primary-50 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5">
            {t.hero.cta}
          </Link>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {t.hero.trust.map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OVERVIEW ─── */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t.overview.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{t.overview.desc}</p>

          {/* Visual mini-flow */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-10 flex-wrap">
            {[
              { icon: UserPlus, label: locale === 'el' ? 'Εγγραφή' : 'Register', color: 'bg-blue-100 text-blue-600' },
              { icon: PenLine, label: locale === 'el' ? 'Στοιχεία' : 'Details', color: 'bg-emerald-100 text-emerald-600' },
              { icon: ImagePlus, label: locale === 'el' ? 'Φωτό' : 'Photos', color: 'bg-amber-100 text-amber-600' },
              { icon: Sparkles, label: locale === 'el' ? 'AI Magic' : 'AI Magic', color: 'bg-purple-100 text-purple-600' },
              { icon: Globe, label: locale === 'el' ? 'Online!' : 'Online!', color: 'bg-teal-100 text-teal-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${item.color} rounded-2xl flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-[11px] md:text-xs font-semibold text-gray-600">{item.label}</span>
                </div>
                {i < 4 && <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STEPS ─── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-16">{t.stepsTitle}</h2>

          <div className="space-y-8 md:space-y-12">
            {t.steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connector line */}
                {idx < t.steps.length - 1 && (
                  <div className="absolute left-6 md:left-8 top-[100px] bottom-[-32px] md:bottom-[-48px] w-0.5 bg-gradient-to-b from-gray-200 to-transparent hidden md:block" />
                )}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Step header */}
                  <div className={`bg-gradient-to-r ${step.color} px-6 md:px-8 py-5 flex items-center gap-4`}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm font-medium">
                          {locale === 'el' ? 'Βήμα' : 'Step'} {step.num}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    </div>
                  </div>

                  {/* Step body */}
                  <div className="px-6 md:px-8 py-6">
                    <p className="text-gray-600 mb-5 text-[15px]">{step.desc}</p>

                    {/* Checklist */}
                    <div className="space-y-3">
                      {step.details.map((detail, di) => (
                        <div key={di} className="flex items-start gap-3">
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-[15px]">{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tip */}
                    {step.tip && (
                      <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <span className="text-lg shrink-0">💡</span>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          <strong className="font-semibold">Tip:</strong> {step.tip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AFTER PUBLISHING ─── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">{t.after.title}</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            {locale === 'el'
              ? 'Μετά τη δημοσίευση, αυτά τα εργαλεία ενεργοποιούνται αυτόματα:'
              : 'After publishing, these tools activate automatically:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.after.features.map((f, i) => (
              <div key={i} className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">{t.faq.title}</h2>
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span className="pr-4">{item.q}</span>
                  <ArrowDown className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: Shield, label: locale === 'el' ? 'Ασφαλές' : 'Secure', sub: 'SSL / GDPR' },
              { icon: Heart, label: locale === 'el' ? 'Δωρεάν' : 'Free', sub: locale === 'el' ? 'Για πάντα' : 'Forever' },
              { icon: Clock, label: locale === 'el' ? 'Γρήγορο' : 'Fast', sub: locale === 'el' ? '< 5 λεπτά' : '< 5 minutes' },
              { icon: Star, label: locale === 'el' ? 'Αξιόπιστο' : 'Trusted', sub: locale === 'el' ? 'Χαλκιδική' : 'Halkidiki' },
              { icon: Zap, label: 'AI-Powered', sub: locale === 'el' ? '7 γλώσσες' : '7 languages' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-[11px] text-gray-400">{item.sub}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-primary-100 mb-8">{t.cta.subtitle}</p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary-700 font-bold rounded-2xl text-lg hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
            <UserPlus className="w-5 h-5" />
            {t.cta.button}
          </Link>
          <p className="mt-4 text-sm text-primary-200">{t.cta.hint}</p>
        </div>
      </section>

    </div>
  );
}
