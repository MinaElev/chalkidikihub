'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CheckCircle2, Globe, Search, QrCode, Bell, Calendar, PaintBucket,
  BarChart3, ShieldCheck, ArrowRight, Sparkles,
} from 'lucide-react';
import { Star, TrendingUp } from 'lucide-react';
import { ANNUAL_PLAN, PREMIUM_PLAN } from '@/lib/billing';

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  priceNote: string;
  perYear: string;
  vat: string;
  includedTitle: string;
  included: { icon: typeof Globe; text: string }[];
  grandfatherTitle: string;
  grandfatherBody: string;
  cta: string;
  ctaHint: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const COPY: Record<string, Copy> = {
  el: {
    eyebrow: 'Τιμολόγηση',
    title: 'Μία απλή, ετήσια τιμή',
    subtitle: 'Καταχωρήστε το κατάλυμά σας δωρεάν έως τις 31 Δεκεμβρίου 2026 και μένει δωρεάν για πάντα. Από 1 Ιανουαρίου 2027, οι νέες καταχωρήσεις έχουν ένα ξεκάθαρο ετήσιο πακέτο — πάντα χωρίς προμήθειες στις κρατήσεις.',
    priceNote: 'ανά κατάλυμα / έτος',
    perYear: 'ανά έτος',
    vat: 'Τιμή με ΦΠΑ 24%',
    includedTitle: 'Τι περιλαμβάνει',
    included: [
      { icon: Globe, text: 'Καταχώρηση μεταφρασμένη αυτόματα σε 7 γλώσσες' },
      { icon: Search, text: 'SEO βελτιστοποίηση & δομημένα δεδομένα για Google' },
      { icon: Bell, text: 'Αιτήματα διαθεσιμότητας από επισκέπτες, με 0% προμήθεια' },
      { icon: Calendar, text: 'Ημερολόγιο διαθεσιμότητας' },
      { icon: QrCode, text: 'QR code καταλύματος με οδηγό περιοχής για τους επισκέπτες' },
      { icon: PaintBucket, text: 'Brand site & έτοιμα γραφιστικά για social media' },
      { icon: BarChart3, text: 'Στατιστικά προβολών (beta)' },
    ],
    grandfatherTitle: 'Καταχωρήστε έως τις 31/12/2026 — δωρεάν για πάντα',
    grandfatherBody: 'Κάθε κατάλυμα που καταχωρείται έως τις 31 Δεκεμβρίου 2026 παραμένει δωρεάν εφ\' όρου ζωής, με όλα τα χαρακτηριστικά του. Το ετήσιο πακέτο 90€ αφορά μόνο νέες καταχωρήσεις από την 1 Ιανουαρίου 2027 και μετά.',
    cta: 'Καταχώρησε το κατάλυμά σου',
    ctaHint: 'Ασφαλής πληρωμή με κάρτα μέσω Viva. Δημοσίευση μετά από έλεγχο ποιότητας.',
    faqTitle: 'Συχνές ερωτήσεις',
    faq: [
      { q: 'Παίρνετε προμήθεια από τις κρατήσεις;', a: 'Όχι. 0% προμήθεια. Οι επισκέπτες επικοινωνούν απευθείας μαζί σας. Πληρώνετε μόνο το ετήσιο πακέτο.' },
      { q: 'Πότε χρεώνομαι;', a: 'Μία φορά τον χρόνο, ανά κατάλυμα, κατά την υποβολή της νέας καταχώρησης. Δεν υπάρχει αυτόματη ανανέωση χωρίς την έγκρισή σας.' },
      { q: 'Θα πάρω τιμολόγιο/απόδειξη;', a: 'Ναι. Το εκδίδουμε κατόπιν επικοινωνίας — απαντήστε στο email επιβεβαίωσης της πληρωμής.' },
      { q: 'Τι γίνεται αν απορριφθεί η καταχώρησή μου;', a: 'Κάθε νέο κατάλυμα ελέγχεται για ποιότητα. Αν δεν εγκριθεί, επικοινωνούμε μαζί σας για διόρθωση ή επιστροφή χρημάτων.' },
    ],
  },
  en: {
    eyebrow: 'Pricing',
    title: 'One simple, annual price',
    subtitle: 'List your property free until December 31, 2026 and it stays free forever. From January 1, 2027, new listings have one clear annual package — always zero booking commission.',
    priceNote: 'per listing / year',
    perYear: 'per year',
    vat: 'Incl. 24% VAT',
    includedTitle: 'What’s included',
    included: [
      { icon: Globe, text: 'Listing auto-translated into 7 languages' },
      { icon: Search, text: 'SEO optimization & structured data for Google' },
      { icon: Bell, text: 'Guest availability requests, with 0% commission' },
      { icon: Calendar, text: 'Availability calendar' },
      { icon: QrCode, text: 'Property QR code with a guest area guide' },
      { icon: PaintBucket, text: 'Brand site & ready-made social media graphics' },
      { icon: BarChart3, text: 'View analytics (beta)' },
    ],
    grandfatherTitle: 'List by Dec 31, 2026 — free forever',
    grandfatherBody: 'Every property listed by December 31, 2026 stays free for life, with all its features. The €90 annual package applies only to new listings from January 1, 2027 onward.',
    cta: 'List your property',
    ctaHint: 'Secure card payment via Viva. Published after a quality review.',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Do you take a booking commission?', a: 'No. 0% commission. Guests contact you directly. You only pay the annual package.' },
      { q: 'When am I charged?', a: 'Once a year, per listing, when you submit the new listing. No automatic renewal without your approval.' },
      { q: 'Do I get an invoice?', a: 'Yes. We issue one on request — just reply to your payment confirmation email.' },
      { q: 'What if my listing is rejected?', a: 'Every new property is quality-checked. If it isn’t approved, we contact you to fix it or issue a refund.' },
    ],
  },
};

export default function PricingPage() {
  const locale = useLocale();
  const c = COPY[locale] || COPY.en;

  return (
    <div className="bg-slate-50/60 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
            <Sparkles className="w-3.5 h-3.5" />{c.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">{c.title}</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto leading-relaxed">{c.subtitle}</p>
        </div>

        {/* Price card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-8 text-white text-center">
            <div className="text-5xl font-bold">{ANNUAL_PLAN.priceLabel}</div>
            <div className="mt-1 text-emerald-50 text-sm">{c.priceNote}</div>
            <div className="mt-1 text-emerald-100/80 text-xs">{c.vat}</div>
          </div>
          <div className="px-8 py-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-4">{c.includedTitle}</div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {c.included.map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 text-center">
              <Link href="/dashboard/listings/new"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors">
                {c.cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-2 text-xs text-slate-400">{c.ctaHint}</p>
            </div>
          </div>
        </div>

        {/* Premium upsell */}
        <div className="mt-6 rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-lg font-bold text-slate-900">Premium</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{PREMIUM_PLAN.priceLabel}<span className="text-sm font-medium text-slate-500"> / {({"el":"έτος","en":"year","de":"Jahr","bg":"година","ru":"год","ro":"an","sr":"godina"} as Record<string, string>)[locale] ?? "year"}</span></div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {locale === 'el'
                ? 'Ό,τι περιλαμβάνει το βασικό πακέτο, συν μεγαλύτερη προβολή:'
                : 'Everything in the basic package, plus more visibility:'}
            </p>
            <ul className="mt-4 grid sm:grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, text: ({"el":"Προτεραιότητα στα αποτελέσματα αναζήτησης & περιοχής","en":"Priority ranking in search & area results","de":"Vorrang in Such- und Regionsergebnissen","bg":"Приоритет в резултатите от търсене и по райони","ru":"Приоритет в результатах поиска и по районам","ro":"Prioritate în rezultatele căutării și pe zone","sr":"Prioritet u rezultatima pretrage i po oblastima"} as Record<string, string>)[locale] ?? "Priority ranking in search & area results" },
                { icon: Star, text: ({"el":"«Featured» badge στην κάρτα του καταλύματος","en":"\"Featured\" badge on your listing card","de":"„Featured“-Abzeichen auf Ihrer Unterkunftskarte","bg":"Значка „Featured“ върху картата на обекта","ru":"Значок «Featured» на карточке объекта","ro":"Insigna „Featured” pe cardul unității","sr":"Oznaka „Featured“ na kartici smeštaja"} as Record<string, string>)[locale] ?? "\"Featured\" badge on your listing card" },
                { icon: BarChart3, text: ({"el":"Αναλυτικά στατιστικά προβολών","en":"Detailed view analytics","de":"Detaillierte Aufrufstatistiken","bg":"Подробна статистика за прегледите","ru":"Подробная статистика просмотров","ro":"Statistici detaliate ale vizualizărilor","sr":"Detaljna statistika pregleda"} as Record<string, string>)[locale] ?? "Detailed view analytics" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-600 shrink-0"><Icon className="w-3.5 h-3.5" /></span>
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Grandfathered */}
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-5 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <div className="font-semibold text-emerald-900">{c.grandfatherTitle}</div>
            <p className="mt-1 text-sm text-emerald-800/90 leading-relaxed">{c.grandfatherBody}</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
                <div className="flex items-start gap-2 font-medium text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{item.q}
                </div>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
