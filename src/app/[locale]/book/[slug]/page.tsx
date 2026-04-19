'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import {
  CalendarDays, Users, Sparkles, CreditCard, CheckCircle2, AlertCircle,
  Loader2, Send, Mail, Phone, Globe2, MessageSquare, BadgeCheck, Shield,
} from 'lucide-react';

type Quote = {
  nights: number;
  subtotal: number;
  nightly_average: number;
  applied: Array<{
    rule_id: string; name: string; rule_type: string; operation: string;
    scope: 'night' | 'booking'; nights_affected: number; delta: number;
  }>;
} | null;

type Policy = {
  checkin_time: string; checkout_time: string;
  min_nights: number; max_nights: number | null;
  cancellation_policy: string; cancellation_policy_text: string | null;
  deposit_percentage: number; balance_due_days_before: number;
  instant_book: boolean;
};

type ListingMeta = {
  id: string; slug: string;
  title_el: string | null; title_en: string | null;
  currency: string; guests_max: number | null;
  price_per_night: number; cover_image: string | null;
  policy: Policy;
} | null;

type QuoteResponse = {
  listing: ListingMeta;
  availability: { available: boolean; conflicts: Array<{ kind: string; detail: string }> };
  quote: Quote;
};

function today() { return new Date().toISOString().slice(0, 10); }
function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function PublicBookingPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug || '';

  const t = {
    title: el ? 'Κλείσε απευθείας' : 'Book direct',
    subtitle: el
      ? '0% προμήθεια, απευθείας με τον ιδιοκτήτη. Καμία OTA δεν μπαίνει στη μέση.'
      : '0% commission, direct with the owner. No OTA in the middle.',
    dates: el ? 'Ημερομηνίες' : 'Dates',
    checkIn: el ? 'Check-in' : 'Check-in',
    checkOut: el ? 'Check-out' : 'Check-out',
    guests: el ? 'Άτομα' : 'Guests',
    yourDetails: el ? 'Τα στοιχεία σου' : 'Your details',
    name: el ? 'Ονοματεπώνυμο' : 'Full name',
    email: 'Email',
    phone: el ? 'Τηλέφωνο' : 'Phone',
    country: el ? 'Χώρα (ISO π.χ. GR/DE)' : 'Country (ISO e.g. GR/DE)',
    notes: el ? 'Σημειώσεις για τον ιδιοκτήτη' : 'Notes for the host',
    quote: el ? 'Τιμολόγιο' : 'Quote',
    nightly: el ? 'Μέση τιμή/νύχτα' : 'Avg / night',
    subtotal: el ? 'Σύνολο' : 'Total',
    nights: el ? 'νύχτες' : 'nights',
    deposit: el ? 'Προκαταβολή' : 'Deposit',
    depositHint: el
      ? 'Το υπόλοιπο πληρώνεται πριν το check-in.'
      : 'Balance paid before check-in.',
    cancellation: el ? 'Πολιτική ακύρωσης' : 'Cancellation policy',
    policyFlexible: el ? 'Ευέλικτη — πλήρης επιστροφή έως 24h πριν.' : 'Flexible — full refund up to 24h before.',
    policyModerate: el ? 'Μέτρια — πλήρης επιστροφή έως 7 μέρες πριν.' : 'Moderate — full refund up to 7 days before.',
    policyStrict: el ? 'Αυστηρή — χωρίς επιστροφή μετά την κράτηση.' : 'Strict — no refund after booking.',
    instantBook: el ? 'Instant Book — η κράτηση επιβεβαιώνεται αυτόματα.' : 'Instant Book — confirmed automatically.',
    needsApproval: el ? 'Χρειάζεται έγκριση — θα σου απαντήσουμε σε 24h.' : 'Needs approval — reply within 24h.',
    submit: el ? 'Στείλε κράτηση' : 'Send booking',
    submitting: el ? 'Γίνεται αποστολή…' : 'Sending…',
    unavailable: el ? 'Μη διαθέσιμο για αυτές τις ημερομηνίες' : 'Not available for these dates',
    loadingQuote: el ? 'Υπολογίζεται τιμή…' : 'Loading quote…',
    listingNotFound: el ? 'Το κατάλυμα δεν βρέθηκε' : 'Listing not found',
    networkError: el ? 'Σφάλμα δικτύου' : 'Network error',
    required: el ? 'Υποχρεωτικό' : 'Required',
    whyDirect: el ? 'Γιατί απευθείας;' : 'Why direct?',
    whyDirectBullet1: el ? 'Χωρίς προμήθεια OTA — καλύτερη τιμή για σένα.' : 'No OTA commission — better price for you.',
    whyDirectBullet2: el ? 'Άμεση επικοινωνία με τον ιδιοκτήτη.' : 'Direct chat with the host.',
    whyDirectBullet3: el ? 'Ευέλικτες αλλαγές — όχι chat bots.' : 'Flexible changes — no chat bots.',
  };

  const [checkIn, setCheckIn] = useState(addDays(today(), 7));
  const [checkOut, setCheckOut] = useState(addDays(today(), 10));
  const [numGuests, setNumGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');

  const [data, setData] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadQuote = useCallback(async () => {
    if (!slug || !checkIn || !checkOut || checkIn >= checkOut) return;
    setLoadingQuote(true);
    setQuoteError(null);
    try {
      const res = await fetch('/api/pms/public/quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, check_in: checkIn, check_out: checkOut }),
      });
      const json = await res.json();
      if (!res.ok) {
        setQuoteError(json.error === 'listing_not_found' ? t.listingNotFound : (json.error || t.networkError));
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setQuoteError(t.networkError);
    } finally {
      setLoadingQuote(false);
    }
  }, [slug, checkIn, checkOut, t.listingNotFound, t.networkError]);

  useEffect(() => { loadQuote(); }, [loadQuote]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/pms/public/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slug, check_in: checkIn, check_out: checkOut,
          num_guests: numGuests,
          guest_name: name, guest_email: email,
          guest_phone: phone || null, guest_country: country || null,
          notes: notes || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || t.networkError);
        return;
      }
      if (json.stripe_enabled) {
        const co = await fetch('/api/pms/public/checkout', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ booking_id: json.booking_id }),
        });
        const coJson = await co.json();
        if (co.ok && coJson.url) {
          window.location.href = coJson.url;
          return;
        }
      }
      router.push(`/book/${slug}/confirmed?id=${json.booking_id}`);
    } catch {
      setSubmitError(t.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  const listing = data?.listing;
  const title = listing ? (el ? (listing.title_el || listing.title_en) : (listing.title_en || listing.title_el)) : '';
  const available = data?.availability.available ?? false;
  const quote = data?.quote;
  const policy = listing?.policy;

  const depositAmount = quote && policy ? (quote.subtotal * policy.deposit_percentage) / 100 : 0;
  const policyText = policy ? (
    policy.cancellation_policy === 'flexible' ? t.policyFlexible :
    policy.cancellation_policy === 'moderate' ? t.policyModerate :
    policy.cancellation_policy === 'strict' ? t.policyStrict :
    (policy.cancellation_policy_text || '')
  ) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-3xl text-white bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 shadow-xl mb-6">
          {listing?.cover_image && (
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${listing.cover_image})` }} />
            </div>
          )}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative p-6 md:p-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-[0.15em] mb-3">
              <BadgeCheck className="w-3.5 h-3.5" /> {t.title}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title || t.loadingQuote}</h1>
            <p className="text-white/90 text-sm md:text-base max-w-xl leading-relaxed">{t.subtitle}</p>
          </div>
        </header>

        {/* Why direct */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[t.whyDirectBullet1, t.whyDirectBullet2, t.whyDirectBullet3].map((b, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-white rounded-2xl border border-rose-100">
              <Shield className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div className="text-xs md:text-sm text-slate-700">{b}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* LEFT — form inputs */}
          <div className="space-y-4">
            {/* Dates & guests */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 inline-flex items-center justify-center ring-4 ring-sky-200">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{t.dates}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t.checkIn}>
                  <input type="date" value={checkIn} min={today()}
                    onChange={e => setCheckIn(e.target.value)} className="pub-input" required />
                </Field>
                <Field label={t.checkOut}>
                  <input type="date" value={checkOut} min={addDays(checkIn, 1)}
                    onChange={e => setCheckOut(e.target.value)} className="pub-input" required />
                </Field>
              </div>
              <div className="mt-3">
                <Field label={`${t.guests}${listing?.guests_max ? ` (max ${listing.guests_max})` : ''}`}>
                  <div className="inline-flex items-center gap-2">
                    <button type="button" onClick={() => setNumGuests(Math.max(1, numGuests - 1))}
                      className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 font-bold">−</button>
                    <div className="w-14 text-center font-semibold tabular-nums flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" /> {numGuests}
                    </div>
                    <button type="button"
                      onClick={() => setNumGuests(Math.min(listing?.guests_max || 50, numGuests + 1))}
                      className="w-9 h-9 rounded-lg border border-slate-300 text-slate-700 font-bold">+</button>
                  </div>
                </Field>
              </div>
            </section>

            {/* Guest info */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 inline-flex items-center justify-center ring-4 ring-emerald-200">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{t.yourDetails}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={`${t.name} *`}>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="pub-input" autoComplete="name" />
                </Field>
                <Field label={`${t.email} *`}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="pub-input pl-9" autoComplete="email" />
                  </div>
                </Field>
                <Field label={t.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="pub-input pl-9" autoComplete="tel" placeholder="+30 69..." />
                  </div>
                </Field>
                <Field label={t.country}>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input type="text" value={country} onChange={e => setCountry(e.target.value.toUpperCase())}
                      className="pub-input pl-9" maxLength={2} placeholder="GR" />
                  </div>
                </Field>
              </div>
              <div className="mt-3">
                <Field label={t.notes}>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                      className="pub-input pl-9 resize-none"
                      placeholder={el ? 'Αφίξεις αργά, κατοικίδια, παιδιά...' : 'Late arrival, pets, kids...'} />
                  </div>
                </Field>
              </div>
            </section>

            {submitError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="font-mono text-xs">{submitError}</span>
              </div>
            )}
          </div>

          {/* RIGHT — quote & submit */}
          <aside className="lg:sticky lg:top-4 space-y-4 self-start">
            <section className="bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-fuchsia-100 text-fuchsia-700 inline-flex items-center justify-center ring-4 ring-fuchsia-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{t.quote}</h2>
              </div>

              {loadingQuote && (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin" /> {t.loadingQuote}
                </div>
              )}

              {quoteError && !loadingQuote && (
                <div className="text-sm text-rose-700 py-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{quoteError}</span>
                </div>
              )}

              {!loadingQuote && !quoteError && data && !available && (
                <div className="text-sm text-rose-700 py-3 space-y-1">
                  <div className="font-semibold">⚠ {t.unavailable}</div>
                  {data.availability.conflicts.map((c, i) => (
                    <div key={i} className="text-xs text-slate-600">• {c.detail}</div>
                  ))}
                </div>
              )}

              {!loadingQuote && !quoteError && available && quote && listing && (
                <>
                  <div className="flex items-baseline justify-between text-sm mb-2">
                    <span className="text-slate-600">{t.nightly}</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {quote.nightly_average.toFixed(0)} {listing.currency}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-sm mb-2">
                    <span className="text-slate-600">{quote.nights} {t.nights}</span>
                    <span className="text-slate-600 tabular-nums">×</span>
                  </div>
                  <div className="border-t border-fuchsia-200 pt-2 mt-2 flex items-baseline justify-between">
                    <span className="text-slate-900 font-semibold">{t.subtotal}</span>
                    <span className="text-2xl font-bold text-fuchsia-700 tabular-nums">
                      {quote.subtotal.toFixed(0)} {listing.currency}
                    </span>
                  </div>

                  {quote.applied.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-fuchsia-200 space-y-1">
                      {quote.applied.map((a, i) => (
                        <div key={i} className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-600 truncate">{a.name}</span>
                          <span className={`tabular-nums font-medium ${a.delta >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {a.delta >= 0 ? '+' : ''}{a.delta.toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {policy && policy.deposit_percentage > 0 && (
                    <div className="mt-4 bg-white rounded-xl p-3 border border-fuchsia-100">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
                        <CreditCard className="w-3.5 h-3.5" /> {t.deposit} ({policy.deposit_percentage}%)
                      </div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        {depositAmount.toFixed(0)} {listing.currency}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{t.depositHint}</div>
                    </div>
                  )}
                </>
              )}
            </section>

            {policy && (
              <section className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  {policy.instant_book ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  )}
                  <span className="text-slate-800">
                    {policy.instant_book ? t.instantBook : t.needsApproval}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                  <Shield className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold text-slate-800">{t.cancellation}:</span> {policyText}
                  </span>
                </div>
              </section>
            )}

            <button type="submit" disabled={submitting || !available || !name || !email}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/30 transition">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? t.submitting : t.submit}
            </button>
          </aside>
        </form>
      </div>

      <style jsx global>{`
        .pub-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.75rem;
          background: white;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pub-input:focus {
          outline: none;
          border-color: rgb(244 63 94);
          box-shadow: 0 0 0 3px rgb(254 205 211 / 0.4);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
