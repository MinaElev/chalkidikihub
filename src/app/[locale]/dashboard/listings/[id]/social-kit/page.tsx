'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Download, Loader2, Clipboard, ClipboardCheck, Info,
  Sparkles, Image as ImageIcon, Smartphone, Share2, ArrowUpRight,
  Clock, Palette, TrendingUp, Globe, RefreshCw, CircleDollarSign,
  HelpCircle, ChevronDown,
} from 'lucide-react';

interface Listing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  tagline_el: string | null;
  location_name: string | null;
}

const FORMATS = [
  { key: 'ig-square', label: 'Instagram Square',  dims: '1080×1080', aspect: 'aspect-square',       icon: Share2,     platform: 'Instagram feed' },
  { key: 'ig-story',  label: 'Instagram Story',   dims: '1080×1920', aspect: 'aspect-[9/16]',       icon: Smartphone, platform: 'IG Stories + Reels cover' },
  { key: 'fb-post',   label: 'Facebook / X Card', dims: '1200×630',  aspect: 'aspect-[1200/630]',   icon: Share2,     platform: 'Facebook · LinkedIn · X' },
];

export default function SocialKitPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = id;
  const locale = useLocale();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('id, slug, title_el, title_en, tagline_el, location_name')
        .eq('id', listingId)
        .single();
      if (data) setListing(data);
      setLoading(false);

      if (typeof window !== 'undefined' && !localStorage.getItem('social-kit-onboarded')) {
        setShowOnboarding(true);
      }
    })();
  }, [listingId]);

  function dismissOnboarding() {
    setShowOnboarding(false);
    if (typeof window !== 'undefined') localStorage.setItem('social-kit-onboarded', '1');
  }

  const title = listing?.title_el || listing?.title_en || '';
  const tagline = listing?.tagline_el || '';
  const location = listing?.location_name || 'Χαλκιδική';

  const caption = [
    `✨ Ανακαλύψτε το ${title}`,
    tagline ? tagline : `Μοναδική εμπειρία στη ${location}.`,
    ``,
    `📍 ${location}`,
    `Κλείσε απευθείας → link in bio`,
    ``,
    `#Halkidiki #Χαλκιδική #GreekHolidays #ChalkidikiHub #SummerInGreece #VisitGreece`,
  ].join('\n');

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    } catch {}
  }

  async function downloadKit() {
    if (!listing) return;
    setDownloading(true);
    try {
      // Lazy-load jszip to keep initial bundle small
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Fetch every format and add to zip
      await Promise.all(
        FORMATS.map(async (fmt) => {
          const res = await fetch(`/api/social-kit/${fmt.key}?slug=${listing.slug}`);
          if (!res.ok) throw new Error(`${fmt.key}: ${res.status}`);
          const blob = await res.blob();
          zip.file(`${fmt.key}.png`, blob);
        }),
      );

      // README with caption + instructions
      zip.file('README.txt', [
        `Social Media Kit — ${title}`,
        `chalkidikihub.gr/listings/${listing.slug}`,
        ``,
        `Files:`,
        ...FORMATS.map(f => `  · ${f.key}.png (${f.dims}) — ${f.platform}`),
        ``,
        `── Caption ──`,
        caption,
      ].join('\n'));

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `social-kit-${listing.slug}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Fire-and-forget analytics: track one download per click.
      fetch('/api/social-kit/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      }).catch(() => {});
    } catch (err) {
      alert('Σφάλμα: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  }
  if (!listing) {
    return <div className="text-center py-12 text-sm text-slate-500">Δεν βρέθηκε το κατάλυμα.</div>;
  }

  const onboardingSteps = [
    { emoji: '👋', title: 'Welcome to your Social Media Kit!', body: 'Φτιάξαμε ό\'τι χρειάζεσαι για να προωθήσεις το κατάλυμά σου online — εντελώς δωρεάν.' },
    { emoji: '📦', title: '3 formats, 1 click', body: 'Κατέβασε έτοιμα γραφιστικά για Instagram, Facebook και X σε ένα ZIP.' },
    { emoji: '📈', title: 'Γιατί έχει σημασία', body: 'Κάθε graphic έχει QR code. Όποιος το σκανάρει, πάει στη σελίδα σου — περισσότερα scans = περισσότερες κρατήσεις.' },
  ];

  return (
    <div className="space-y-8">
      {/* Onboarding modal (first visit) */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">{onboardingSteps[onboardingStep].emoji}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{onboardingSteps[onboardingStep].title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{onboardingSteps[onboardingStep].body}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {onboardingSteps.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === onboardingStep ? 'w-8 bg-emerald-500' : 'w-1.5 bg-slate-200'}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                if (onboardingStep < onboardingSteps.length - 1) setOnboardingStep(onboardingStep + 1);
                else dismissOnboarding();
              }}
              className="mt-6 w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors"
            >
              {onboardingStep < onboardingSteps.length - 1 ? 'Συνέχεια' : 'Κατάλαβα!'}
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <Link href="/dashboard/listings" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700">
        <ArrowLeft className="w-4 h-4" />Πίσω στα καταλύματα
      </Link>

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" aria-hidden />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-300 mb-2">
            <Sparkles className="inline w-3 h-3 mr-1" />
            Social Media Kit
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Γραφιστικά για το {title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed">
            Κατέβασε έτοιμα γραφιστικά για Instagram, Facebook και X — <strong>χωρίς να χρειάζεται
            να σχεδιάσεις τίποτα</strong>. Ποστάρεις, οι followers σκανάρουν το QR code, επισκέπτονται
            τη σελίδα σου.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadKit}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-70"
            >
              {downloading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Δημιουργία…</>
                : <><Download className="w-4 h-4" /> Κατέβασε όλο το kit (ZIP)</>
              }
            </button>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl transition-colors"
            >
              <ImageIcon className="w-4 h-4" /> Προεπισκόπηση
            </a>
          </div>
        </div>
      </header>

      {/* 3-step explanation */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Info className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">Πώς δουλεύει σε 30 δευτερόλεπτα</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Step
            num={1}
            title="Πατάς «Κατέβασε»"
            body="Ένα ZIP με έτοιμα γραφιστικά για κάθε social platform — square, stories, feed posts."
          />
          <Step
            num={2}
            title="Ποστάρεις στα social σου"
            body="Διάλεξε το μέγεθος που χρειάζεσαι και το ανεβάζεις κατευθείαν από το κινητό."
          />
          <Step
            num={3}
            title="Οι followers βλέπουν το κατάλυμά σου"
            body="Κάθε graphic περιέχει QR code που οδηγεί στη σελίδα σου — κάθε σκανάρισμα = πιθανή κράτηση."
          />
        </div>
      </section>

      {/* Preview grid */}
      <section id="preview">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Προεπισκόπηση γραφιστικών</h2>
            <p className="text-xs text-slate-500 mt-0.5">Δες πώς θα φαίνονται πριν κατέβασμα</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FORMATS.map((f) => {
            const PlatformIcon = f.icon;
            return (
              <div key={f.key} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`relative ${f.aspect} bg-slate-100 overflow-hidden`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/social-kit/${f.key}?slug=${listing.slug}`}
                    alt={f.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <PlatformIcon className="w-4 h-4 text-slate-600" />
                      <h3 className="text-sm font-semibold text-slate-900">{f.label}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">{f.dims}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{f.platform}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Caption generator */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Έτοιμο κείμενο για το post</h2>
            <p className="text-xs text-slate-500 mt-0.5">Αντιγραφή με ένα κλικ</p>
          </div>
          <button
            type="button"
            onClick={copyCaption}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
          >
            {captionCopied
              ? <><ClipboardCheck className="w-3.5 h-3.5 text-emerald-300" /> Αντιγράφτηκε!</>
              : <><Clipboard className="w-3.5 h-3.5" /> Αντιγραφή</>
            }
          </button>
        </div>
        <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 rounded-xl p-4 border border-slate-100">
{caption}
        </pre>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Γιατί να το χρησιμοποιήσεις</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Benefit icon={Clock}         title="Γλιτώνεις ώρες"             body="2-3 ώρες Canva work → 10 δευτερόλεπτα" />
          <Benefit icon={Palette}       title="Professional αισθητική"    body="Σαν να πλήρωσες designer — δωρεάν" />
          <Benefit icon={TrendingUp}    title="Φέρνει επισκέπτες στο site" body="Κάθε σκανάρισμα = πιθανή κράτηση" />
          <Benefit icon={Globe}         title="Έτοιμο για sharing"        body="Αυτόματα προσαρμοσμένο σε κάθε platform" />
          <Benefit icon={RefreshCw}     title="Ξαναφτιάξτο ό'ποτε"         body="Αλλάζεις φωτό ή tagline → νέο kit" />
          <Benefit icon={CircleDollarSign} title="100% δωρεάν"            body="Canva Pro: €12/μήνα — εδώ €0" />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-900">Συχνές ερωτήσεις</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            {
              q: 'Γιατί να χρησιμοποιήσω έτοιμα γραφιστικά αντί δικά μου;',
              a: 'Είναι branded, συνεπή και έχουν QR code που φέρνει τους followers σου πίσω στη σελίδα σου. Αν θες δικά σου, μπορείς φυσικά — αυτό είναι απλά shortcut για τις μέρες που βιάζεσαι.',
            },
            {
              q: 'Αλλάζουν όταν αλλάζω τα στοιχεία του καταλύματος;',
              a: 'Ναι! Αν αλλάξεις φωτογραφία, tagline ή τοποθεσία, πάτα ξανά «Κατέβασε» και παίρνεις refreshed pack με τα τελευταία στοιχεία.',
            },
            {
              q: 'Μπορώ να τα τροποποιήσω πριν ποστάρω;',
              a: 'Τα PNGs είναι final — αλλά μπορείς να τα ανοίξεις σε Canva, Photoshop ή οποιονδήποτε editor για extra edits.',
            },
            {
              q: 'Θα δουλέψει σε TikTok / Reels;',
              a: 'Ναι — το Instagram Story format (1080×1920) είναι standard για TikTok και Reels thumbnails.',
            },
            {
              q: 'Πρέπει να ταγκάρω το ChalkidikiHub;',
              a: 'Δεν είναι υποχρεωτικό. Αν το κάνεις, βοηθάς την κοινότητα να μεγαλώσει και μπορεί να σε repostάρουμε! Mention @chalkidikihub 🤝',
            },
          ].map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="text-sm font-medium text-slate-800">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <p className="text-xs text-slate-600 leading-relaxed pb-3">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Έτοιμος να ποστάρεις;</h2>
        <p className="text-sm text-slate-600 mb-4">Ένα κλικ — και έχεις όλα όσα χρειάζεσαι.</p>
        <button
          type="button"
          onClick={downloadKit}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-70"
        >
          {downloading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Δημιουργία…</>
            : <><Download className="w-4 h-4" /> Κατέβασε το Social Media Kit</>
          }
          <ArrowUpRight className="w-4 h-4 opacity-60" />
        </button>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
function Step({ num, title, body }: { num: number; title: string; body: string }) {
  return (
    <div className="relative p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold tabular-nums mb-3">
        {num}
      </span>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Benefit({ icon: Icon, title, body }: { icon: typeof Clock; title: string; body: string }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 mb-2">
        <Icon className="w-4 h-4" />
      </span>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{body}</p>
    </div>
  );
}
