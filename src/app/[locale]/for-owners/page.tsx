'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Globe, Search, Sparkles, Users, BarChart3, Shield, CheckCircle, ArrowRight, Zap, ImageIcon } from 'lucide-react';

export default function ForOwnersPage() {
  const locale = useLocale();
  const isGreek = locale === 'el';

  const t = {
    hero: {
      title: isGreek ? 'Προβάλετε το κατάλυμά σας σε 6 γλώσσες. Δωρεάν.' : 'Promote your property in 6 languages. For free.',
      subtitle: isGreek
        ? 'Το ChalkidikiHub είναι η μοναδική πλατφόρμα της Χαλκιδικής που προβάλλει αυτόματα το κατάλυμά σας σε Ελληνικά, Αγγλικά, Γερμανικά, Βουλγάρικα, Ρωσικά και Ρουμάνικα.'
        : 'ChalkidikiHub is the only Halkidiki platform that automatically promotes your property in Greek, English, German, Bulgarian, Russian and Romanian.',
      cta: isGreek ? 'Δωρεάν Εγγραφή' : 'Free Registration',
      cta2: isGreek ? 'Δείτε πώς λειτουργεί' : 'See how it works',
    },
    features: [
      {
        icon: Globe,
        title: isGreek ? '6 Γλώσσες Αυτόματα' : '6 Languages Automatically',
        desc: isGreek
          ? 'Γράφετε μόνο στα Ελληνικά. Το AI μεταφράζει αυτόματα σε 5 ακόμα γλώσσες. Φτάνετε τουρίστες από Γερμανία, Βουλγαρία, Ρωσία, Ρουμανία.'
          : 'Write only in Greek. AI automatically translates to 5 more languages. Reach tourists from Germany, Bulgaria, Russia, Romania.',
      },
      {
        icon: Search,
        title: isGreek ? 'SEO στη Google' : 'Google SEO',
        desc: isGreek
          ? 'Κάθε κατάλυμα βελτιστοποιείται αυτόματα για τη Google σε κάθε γλώσσα. Meta titles, descriptions, structured data.'
          : 'Every property is automatically optimized for Google in each language. Meta titles, descriptions, structured data.',
      },
      {
        icon: Sparkles,
        title: isGreek ? 'AI-Powered' : 'AI-Powered',
        desc: isGreek
          ? 'Τεχνητή νοημοσύνη δημιουργεί SEO tags, μεταφράσεις και βελτιστοποιεί τις φωτογραφίες σας αυτόματα.'
          : 'Artificial intelligence creates SEO tags, translations and optimizes your photos automatically.',
      },
      {
        icon: Users,
        title: isGreek ? 'Χιλιάδες Επισκέπτες' : 'Thousands of Visitors',
        desc: isGreek
          ? 'Παραλίες, εστιατόρια, αξιοθέατα, blog - το site κρατάει τους επισκέπτες μέσα και τους οδηγεί στο κατάλυμά σας.'
          : 'Beaches, restaurants, attractions, blog - the site keeps visitors engaged and leads them to your property.',
      },
      {
        icon: ImageIcon,
        title: isGreek ? 'Φωτογραφίες & Χάρτης' : 'Photos & Map',
        desc: isGreek
          ? 'Ανεβάστε φωτογραφίες, επιλέξτε τοποθεσία στο χάρτη. Αυτόματη βελτιστοποίηση εικόνων.'
          : 'Upload photos, pick location on map. Automatic image optimization.',
      },
      {
        icon: Zap,
        title: isGreek ? 'Links Κρατήσεων' : 'Booking Links',
        desc: isGreek
          ? 'Συνδέστε Booking.com, Airbnb, το site σας. Οι επισκέπτες κλείνουν απευθείας.'
          : 'Connect Booking.com, Airbnb, your website. Visitors book directly.',
      },
    ],
    howItWorks: {
      title: isGreek ? 'Πώς λειτουργεί' : 'How it works',
      steps: [
        {
          num: '1',
          title: isGreek ? 'Εγγραφή' : 'Register',
          desc: isGreek ? 'Δημιουργήστε δωρεάν λογαριασμό σε 30 δευτερόλεπτα.' : 'Create a free account in 30 seconds.',
        },
        {
          num: '2',
          title: isGreek ? 'Καταχώρηση' : 'List',
          desc: isGreek ? 'Βάλτε τίτλο, περιγραφή, φωτογραφίες, τιμή. Μόνο στα Ελληνικά.' : 'Add title, description, photos, price. Only in Greek.',
        },
        {
          num: '3',
          title: isGreek ? 'AI Μαγεία' : 'AI Magic',
          desc: isGreek ? 'Το AI μεταφράζει, δημιουργεί SEO, βελτιστοποιεί εικόνες αυτόματα.' : 'AI translates, creates SEO, optimizes images automatically.',
        },
        {
          num: '4',
          title: isGreek ? 'Online!' : 'Online!',
          desc: isGreek ? 'Το κατάλυμά σας εμφανίζεται σε 6 γλώσσες στη Google.' : 'Your property appears in 6 languages on Google.',
        },
      ],
    },
    free: {
      title: isGreek ? 'Πόσο κοστίζει;' : 'How much does it cost?',
      answer: isGreek ? 'ΤΙΠΟΤΑ. Εντελώς δωρεάν.' : 'NOTHING. Completely free.',
      desc: isGreek
        ? 'Το ChalkidikiHub είναι μη κερδοσκοπική πρωτοβουλία για την προώθηση του τουρισμού στη Χαλκιδική. Δεν χρεώνουμε τίποτα.'
        : 'ChalkidikiHub is a non-profit initiative for promoting tourism in Halkidiki. We charge nothing.',
    },
    whyUs: {
      title: isGreek ? 'Γιατί ChalkidikiHub;' : 'Why ChalkidikiHub?',
      items: isGreek
        ? ['Η μόνη πλατφόρμα με 6 γλώσσες', 'AI-powered SEO & μεταφράσεις', 'Δωρεάν για πάντα', 'Φτιαγμένο ειδικά για τη Χαλκιδική', 'Παραλίες, εστιατόρια, blog = πολλοί επισκέπτες', 'Mobile app (PWA)']
        : ['The only platform with 6 languages', 'AI-powered SEO & translations', 'Free forever', 'Built specifically for Halkidiki', 'Beaches, restaurants, blog = many visitors', 'Mobile app (PWA)'],
    },
    cta: {
      title: isGreek ? 'Έτοιμοι;' : 'Ready?',
      subtitle: isGreek ? 'Καταχωρήστε το κατάλυμά σας σε 2 λεπτά. Δωρεάν.' : 'List your property in 2 minutes. Free.',
      button: isGreek ? 'Δωρεάν Εγγραφή →' : 'Free Registration →',
    },
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{t.hero.title}</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-colors shadow-lg">
              {t.hero.cta}
            </Link>
            <a href="#how" className="px-8 py-4 border-2 border-white/30 text-white font-medium rounded-xl text-lg hover:bg-white/10 transition-colors">
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.map((f, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {t.howItWorks.steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
                {idx < 3 && <ArrowRight className="w-5 h-5 text-primary-400 mx-auto mt-4 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free */}
      <section className="py-16 md:py-24 bg-green-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.free.title}</h2>
          <div className="text-5xl font-bold text-green-600 mb-4">{t.free.answer}</div>
          <p className="text-gray-600">{t.free.desc}</p>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t.whyUs.title}</h2>
          <div className="space-y-3">
            {t.whyUs.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-primary-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg text-primary-100 mb-8">{t.cta.subtitle}</p>
          <Link href="/auth/register"
            className="inline-flex px-10 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-colors shadow-lg">
            {t.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
