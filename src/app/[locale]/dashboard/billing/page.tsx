'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, Loader2, Receipt, ExternalLink, Ticket, RefreshCw, Landmark, FileText, Star,
} from 'lucide-react';
import { ANNUAL_PLAN, PREMIUM_PLAN } from '@/lib/billing';

type BillingListing = {
  id: string;
  title_el: string | null;
  slug: string | null;
  status: string;
  billing_exempt: boolean;
  plan: string;
  plan_status: string;
  plan_expires_at: string | null;
  bank_transfer_requested_at: string | null;
};

type Payment = {
  id: string;
  listing_id: string | null;
  amount_cents: number;
  currency: string;
  plan: string;
  paid_at: string;
};

type InvoiceDetails = { invoice_name: string; invoice_vat: string; invoice_tax_office: string; invoice_address: string };
const BLANK_INVOICE: InvoiceDetails = { invoice_name: '', invoice_vat: '', invoice_tax_office: '', invoice_address: '' };

export default function BillingPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<BillingListing[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [applied, setApplied] = useState<{ code: string; finalCents: number; discountCents: number; free: boolean } | null>(null);
  const [bankInfo, setBankInfo] = useState<{ iban: string; beneficiary: string; bank: string; bic: string; amountLabel: string } | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetails>(BLANK_INVOICE);
  const [showInvoice, setShowInvoice] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [invoiceSaved, setInvoiceSaved] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'premium'>('annual');

  const justPaid = params.get('paid') === '1';
  const cancelled = params.get('cancelled') === '1';

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (alive) setLoading(false); return; }

      const [{ data: ls }, { data: ps }] = await Promise.all([
        supabase
          .from('listings')
          .select('id, title_el, slug, status, billing_exempt, plan, plan_status, plan_expires_at, bank_transfer_requested_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('billing_payments')
          .select('id, listing_id, amount_cents, currency, plan, paid_at')
          .eq('owner_id', user.id)
          .order('paid_at', { ascending: false }),
      ]);
      if (!alive) return;
      setListings((ls as BillingListing[]) || []);
      setPayments((ps as Payment[]) || []);
      // Prefill invoice details (best-effort).
      try {
        const r = await fetch('/api/billing/invoice-details');
        const j = await r.json().catch(() => ({}));
        if (alive && j.details) setInvoice({ ...BLANK_INVOICE, ...j.details });
      } catch { /* ignore */ }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  // Validate the typed code and show its effect on the price before paying.
  async function applyCode() {
    const c = code.trim();
    setError('');
    setApplied(null);
    if (!c) return;
    setValidating(true);
    try {
      const res = await fetch('/api/billing/validate-code', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: c, plan: selectedPlan }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.valid) {
        setApplied({ code: json.code, finalCents: json.finalCents, discountCents: json.discountCents, free: json.free });
      } else {
        setError(el ? 'Ο κωδικός δεν είναι έγκυρος ή έχει λήξει.' : 'The code is invalid or expired.');
      }
    } catch {
      setError(el ? 'Σφάλμα δικτύου κατά τον έλεγχο του κωδικού.' : 'Network error validating the code.');
    }
    setValidating(false);
  }

  async function payFor(listingId: string) {
    setError('');
    setPayingId(listingId);
    try {
      // Send the applied (validated) code when present, else the raw input.
      const sendCode = (applied?.code || code).trim() || undefined;
      const res = await fetch('/api/billing/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, code: sendCode, plan: selectedPlan }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) { window.location.assign(json.url); return; }
      // A code that zeroes the price activates without Stripe → land on success.
      if (res.ok && json.free) { window.location.assign(`/${locale}/dashboard/billing?paid=1&listing=${listingId}`); return; }
      if (res.status === 422 || json.error === 'invalid_code') {
        setError(el ? 'Ο κωδικός έκπτωσης δεν είναι έγκυρος ή έχει λήξει.' : 'The discount code is invalid or expired.');
      } else if (json.error === 'stripe_not_configured') {
        setError(el ? 'Η πληρωμή με κάρτα δεν είναι διαθέσιμη (λείπει το Stripe key). Οι κωδικοί 100%/δωρεάν όμως δουλεύουν.' : 'Card payment is unavailable (Stripe key missing). 100%/free codes still work.');
      } else if (json.error === 'listing_exempt') {
        setError(el ? 'Αυτή η καταχώρηση είναι ήδη δωρεάν (grandfathered) — δεν χρειάζεται πληρωμή.' : 'This listing is already free (grandfathered) — no payment needed.');
      } else if (json.error === 'already_paid') {
        setError(el ? 'Η καταχώρηση έχει ήδη ενεργό πακέτο.' : 'This listing already has an active plan.');
      } else if (json.error === 'not_payable') {
        setError(el ? `Η καταχώρηση δεν είναι σε κατάσταση πληρωμής (status: ${json.status || '—'}).` : `Listing is not in a payable state (status: ${json.status || '—'}).`);
      } else if (json.error === 'unauthorized') {
        setError(el ? 'Η σύνδεσή σας έληξε. Κάντε ξανά είσοδο.' : 'Your session expired. Please sign in again.');
      } else {
        setError((el ? 'Δεν ξεκίνησε η πληρωμή. ' : 'Could not start payment. ') + (json.error ? `(${json.error})` : ''));
      }
    } catch {
      setError(el ? 'Σφάλμα δικτύου.' : 'Network error.');
    }
    setPayingId(null);
  }

  // Renew an already-paid listing (near expiry / past due / lapsed) at the same
  // tier, or upgrade to Premium (targetPlan='premium'). Extends without unpublishing.
  async function renewFor(listingId: string, targetPlan: string) {
    setError('');
    setPayingId(listingId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, renew: true, plan: targetPlan, code: (applied?.code || code).trim() || undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) { window.location.assign(json.url); return; }
      if (res.ok && json.free) { window.location.assign(`/${locale}/dashboard/billing?paid=1&listing=${listingId}`); return; }
      if (res.status === 422 || json.error === 'invalid_code') setError(el ? 'Ο κωδικός δεν είναι έγκυρος.' : 'Invalid code.');
      else if (json.error === 'stripe_not_configured') setError(el ? 'Η πληρωμή με κάρτα δεν είναι διαθέσιμη (λείπει Stripe key). Οι κωδικοί 100% δουλεύουν.' : 'Card payment unavailable (Stripe key missing).');
      else setError((el ? 'Δεν ξεκίνησε η ανανέωση. ' : 'Renewal failed. ') + (json.error ? `(${json.error})` : ''));
    } catch { setError(el ? 'Σφάλμα δικτύου.' : 'Network error.'); }
    setPayingId(null);
  }

  // Owner opts to pay by bank transfer → flag it + show IBAN instructions.
  async function requestBank(listingId: string) {
    setError('');
    setPayingId(listingId);
    try {
      const res = await fetch('/api/billing/bank-transfer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, plan: selectedPlan }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setBankInfo({ iban: json.iban || '', beneficiary: json.beneficiary || '', bank: json.bank || '', bic: json.bic || '', amountLabel: json.amount_label || (selectedPlan === 'premium' ? PREMIUM_PLAN.priceLabel : ANNUAL_PLAN.priceLabel) });
        setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, bank_transfer_requested_at: new Date().toISOString() } : l));
      } else setError(el ? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.' : 'Something went wrong.');
    } catch { setError(el ? 'Σφάλμα δικτύου.' : 'Network error.'); }
    setPayingId(null);
  }

  async function saveInvoice() {
    setSavingInvoice(true); setInvoiceSaved(false); setError('');
    try {
      const res = await fetch('/api/billing/invoice-details', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invoice),
      });
      if (res.ok) setInvoiceSaved(true);
      else setError(el ? 'Αποτυχία αποθήκευσης στοιχείων.' : 'Failed to save details.');
    } catch { setError(el ? 'Σφάλμα δικτύου.' : 'Network error.'); }
    setSavingInvoice(false);
  }

  function fmtDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(el ? 'el-GR' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtAmount(cents: number, currency: string) {
    return new Intl.NumberFormat(el ? 'el-GR' : 'en-GB', { style: 'currency', currency: (currency || 'eur').toUpperCase() }).format(cents / 100);
  }

  // Which lifecycle bucket a listing is in, for the badge + CTA.
  function planView(l: BillingListing): { label: string; cls: string; icon: React.ElementType; cta: boolean } {
    if (l.billing_exempt) return { label: el ? 'Δωρεάν (grandfathered)' : 'Free (grandfathered)', cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, cta: false };
    if (l.plan_status === 'active') return { label: el ? 'Ενεργό ετήσιο' : 'Active annual', cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, cta: false };
    if (l.plan_status === 'expired') return { label: el ? 'Έληξε' : 'Expired', cls: 'bg-rose-100 text-rose-700', icon: AlertCircle, cta: true };
    if (l.status === 'pending_payment') return { label: el ? 'Εκκρεμεί πληρωμή' : 'Payment pending', cls: 'bg-amber-100 text-amber-700', icon: Clock, cta: true };
    return { label: el ? 'Χωρίς πληρωμή' : 'Unpaid', cls: 'bg-slate-100 text-slate-600', icon: AlertCircle, cta: true };
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

  const unpaid = listings.filter((l) => !l.billing_exempt && l.plan_status !== 'active');

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm">
          <CreditCard className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{el ? 'Χρέωση' : 'Billing'}</h1>
          <p className="text-sm text-slate-500">{el ? 'Ετήσιο πακέτο καταχώρησης & ιστορικό πληρωμών' : 'Annual listing package & payment history'}</p>
        </div>
      </div>

      {justPaid && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">{el ? 'Η πληρωμή ολοκληρώθηκε!' : 'Payment complete!'}</h2>
          <p className="mt-1 text-sm text-slate-600">{el
            ? 'Ευχαριστούμε! Η καταχώρησή σας μπαίνει σε έλεγχο και δημοσιεύεται σύντομα. Λάβατε email επιβεβαίωσης.'
            : 'Thank you! Your listing is now in review and will be published soon. A confirmation email is on its way.'}</p>

          {/* Lifecycle stepper */}
          <div className="mt-6 flex items-center justify-center gap-0 max-w-xl mx-auto">
            {[
              { label: el ? 'Υποβολή' : 'Submitted', done: true },
              { label: el ? 'Πληρωμή' : 'Payment', done: true },
              { label: el ? 'Έλεγχος' : 'Review', done: false, current: true },
              { label: el ? 'Live' : 'Live', done: false },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.done ? 'bg-emerald-500 text-white' : s.current ? 'bg-white border-2 border-emerald-500 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`mt-1.5 text-[11px] font-medium ${s.done || s.current ? 'text-slate-700' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < arr.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-4 ${arr[i + 1].done || s.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}
      {cancelled && (
        <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{el
            ? 'Η πληρωμή ακυρώθηκε. Η καταχώρηση αποθηκεύτηκε — μπορείτε να ολοκληρώσετε την πληρωμή όποτε θέλετε από εδώ.'
            : 'Payment cancelled. Your listing is saved — you can complete the payment any time from here.'}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {/* Package summary */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-sky-600">{el ? 'Ετήσιο πακέτο' : 'Annual package'}</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{ANNUAL_PLAN.priceLabel} <span className="text-sm font-medium text-slate-500">/ {el ? 'έτος ανά κατάλυμα' : 'year per listing'}</span></div>
          </div>
          <span className="text-xs text-slate-400">{el ? 'Τιμή με ΦΠΑ 24%' : 'Incl. 24% VAT'}</span>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {el
            ? 'Οι υπάρχουσες καταχωρήσεις σας παραμένουν δωρεάν για πάντα. Το ετήσιο πακέτο αφορά μόνο νέες καταχωρήσεις.'
            : 'Your existing listings stay free forever. The annual package applies to new listings only.'}
        </p>
      </div>

      {/* Invoice details (for τιμολόγιο) */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white">
        <button onClick={() => setShowInvoice((s) => !s)}
          className="w-full flex items-center justify-between px-5 py-4 text-left">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            {el ? 'Στοιχεία τιμολόγησης (για τιμολόγιο)' : 'Invoice details (for a tax invoice)'}
          </span>
          <span className="text-xs text-slate-400">{showInvoice ? '▲' : '▼'}</span>
        </button>
        {showInvoice && (
          <div className="px-5 pb-5 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500 mb-3">{el
              ? 'Συμπληρώστε τα εφόσον χρειάζεστε τιμολόγιο. Αποθηκεύονται και χρησιμοποιούνται για όλες τις καταχωρήσεις σας.'
              : 'Fill these only if you need a tax invoice. Saved and reused for all your listings.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={invoice.invoice_name} onChange={(e) => { setInvoice({ ...invoice, invoice_name: e.target.value }); setInvoiceSaved(false); }}
                placeholder={el ? 'Επωνυμία / Ονοματεπώνυμο' : 'Company / Full name'} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              <input value={invoice.invoice_vat} onChange={(e) => { setInvoice({ ...invoice, invoice_vat: e.target.value }); setInvoiceSaved(false); }}
                placeholder={el ? 'ΑΦΜ' : 'VAT number'} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              <input value={invoice.invoice_tax_office} onChange={(e) => { setInvoice({ ...invoice, invoice_tax_office: e.target.value }); setInvoiceSaved(false); }}
                placeholder={el ? 'ΔΟΥ' : 'Tax office'} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              <input value={invoice.invoice_address} onChange={(e) => { setInvoice({ ...invoice, invoice_address: e.target.value }); setInvoiceSaved(false); }}
                placeholder={el ? 'Διεύθυνση' : 'Address'} className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button onClick={saveInvoice} disabled={savingInvoice}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold">
                {savingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{el ? 'Αποθήκευση' : 'Save'}
              </button>
              {invoiceSaved && <span className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />{el ? 'Αποθηκεύτηκε' : 'Saved'}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Unpaid call-to-action */}
      {unpaid.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-2">{el ? 'Εκκρεμείς πληρωμές' : 'Pending payments'}</h2>
          {/* Plan selector: Basic vs Premium */}
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {([['annual', ANNUAL_PLAN], ['premium', PREMIUM_PLAN]] as const).map(([k, p]) => {
              const active = selectedPlan === k;
              return (
                <button key={k} type="button" onClick={() => { setSelectedPlan(k); setApplied(null); setBankInfo(null); }}
                  className={`text-left rounded-xl border-2 px-4 py-3 transition-colors ${active ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {k === 'premium' && <Star className="w-4 h-4 text-amber-500" />}
                      {k === 'premium' ? 'Premium' : (el ? 'Βασικό' : 'Basic')}
                    </span>
                    <span className="font-bold text-slate-900">{p.priceLabel}<span className="text-xs font-normal text-slate-500">/{el ? 'έτος' : 'yr'}</span></span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {k === 'premium'
                      ? (el ? 'Προτεραιότητα στα αποτελέσματα + Featured badge' : 'Priority ranking + Featured badge')
                      : (el ? 'Πλήρης καταχώρηση, 0% προμήθεια' : 'Full listing, 0% commission')}
                  </div>
                </button>
              );
            })}
          </div>
          {/* Optional discount code — validate it up front so the new price shows. */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">{el ? 'Κωδικός έκπτωσης (προαιρετικά)' : 'Discount code (optional)'}</label>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="text" value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setApplied(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCode(); } }}
                placeholder={el ? 'π.χ. FRIEND2027' : 'e.g. FRIEND2027'}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm uppercase tracking-wide focus:ring-2 focus:ring-sky-500 w-48" />
              <button type="button" onClick={applyCode} disabled={validating || !code.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-300 bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 disabled:opacity-50">
                {validating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                {el ? 'Εφαρμογή' : 'Apply'}
              </button>
              {applied && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  {applied.free
                    ? (el ? 'Δωρεάν με τον κωδικό!' : 'Free with this code!')
                    : (el ? `Νέα τιμή: ${fmtAmount(applied.finalCents, 'eur')} (−${fmtAmount(applied.discountCents, 'eur')})`
                          : `New price: ${fmtAmount(applied.finalCents, 'eur')} (−${fmtAmount(applied.discountCents, 'eur')})`)}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {unpaid.map((l) => {
              const planLabel = selectedPlan === 'premium' ? PREMIUM_PLAN.priceLabel : ANNUAL_PLAN.priceLabel;
              const payLabel = applied
                ? (applied.free ? (el ? 'Δωρεάν ενεργοποίηση' : 'Activate free') : `${el ? 'Πληρωμή' : 'Pay'} ${fmtAmount(applied.finalCents, 'eur')}`)
                : `${el ? 'Πληρωμή κάρτα' : 'Pay by card'} ${planLabel}`;
              const awaitingBank = !!l.bank_transfer_requested_at;
              return (
                <div key={l.id} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-900 truncate">{l.title_el || (el ? '(χωρίς τίτλο)' : '(untitled)')}</div>
                    <div className="text-xs text-slate-500">
                      {awaitingBank
                        ? (el ? '🏦 Εκκρεμεί επιβεβαίωση κατάθεσης από την ομάδα μας' : '🏦 Awaiting deposit confirmation from our team')
                        : (el ? 'Δεν δημοσιεύεται μέχρι να ολοκληρωθεί η πληρωμή' : 'Not published until payment is complete')}
                    </div>
                  </div>
                  {!awaitingBank && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => payFor(l.id)} disabled={payingId === l.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold transition-colors">
                        {payingId === l.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        {payLabel}
                      </button>
                      <button onClick={() => requestBank(l.id)} disabled={payingId === l.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium">
                        <Landmark className="w-4 h-4" />{el ? 'Κατάθεση' : 'Bank'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* IBAN instructions after choosing bank transfer */}
          {bankInfo && (
            <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900">
              <div className="font-semibold mb-2 flex items-center gap-1.5"><Landmark className="w-4 h-4" />{el ? 'Στοιχεία κατάθεσης' : 'Bank deposit details'}</div>
              {bankInfo.iban ? (
                <div className="space-y-1">
                  {bankInfo.bank && <div>{el ? 'Τράπεζα' : 'Bank'}: <strong>{bankInfo.bank}</strong></div>}
                  {bankInfo.beneficiary && <div>{el ? 'Δικαιούχος' : 'Beneficiary'}: <strong>{bankInfo.beneficiary}</strong></div>}
                  <div>IBAN: <strong className="font-mono">{bankInfo.iban}</strong></div>
                  {bankInfo.bic && <div>BIC/SWIFT: <strong className="font-mono">{bankInfo.bic}</strong></div>}
                  <div>{el ? 'Ποσό' : 'Amount'}: <strong>{bankInfo.amountLabel}</strong></div>
                  <p className="mt-2 text-xs text-sky-700">{el
                    ? 'Στην αιτιολογία γράψτε τον τίτλο του καταλύματος. Μόλις λάβουμε την κατάθεση, ενεργοποιούμε την καταχώρηση και λαμβάνετε απόδειξη.'
                    : 'Add your listing title as the reference. Once we receive the deposit, we activate the listing and you get a receipt.'}</p>
                </div>
              ) : (
                <p className="text-xs">{el
                  ? 'Καταγράψαμε το αίτημά σας. Θα επικοινωνήσουμε μαζί σας με τα στοιχεία κατάθεσης.'
                  : 'We recorded your request. We will contact you with the deposit details.'}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* All listings status */}
      <h2 className="text-sm font-semibold text-slate-700 mb-2">{el ? 'Οι καταχωρήσεις σας' : 'Your listings'}</h2>
      {listings.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
          {el ? 'Δεν έχετε καταχωρήσεις ακόμα.' : 'You have no listings yet.'}{' '}
          <Link href="/dashboard/listings/new" className="text-sky-600 font-medium hover:underline">{el ? 'Νέα καταχώρηση' : 'Add one'}</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-semibold">{el ? 'Κατάλυμα' : 'Listing'}</th>
                <th className="px-4 py-3 font-semibold">{el ? 'Πακέτο' : 'Plan'}</th>
                <th className="px-4 py-3 font-semibold">{el ? 'Λήξη' : 'Expires'}</th>
                <th className="px-4 py-3 font-semibold text-right">{el ? 'Ενέργεια' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => {
                const v = planView(l);
                const Icon = v.icon;
                const canRenew = !l.billing_exempt && ['active', 'past_due', 'expired'].includes(l.plan_status);
                return (
                  <tr key={l.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{l.title_el || (el ? '(χωρίς τίτλο)' : '(untitled)')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${v.cls}`}>
                        <Icon className="w-3.5 h-3.5" />{v.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {l.billing_exempt ? '—' : fmtDate(l.plan_expires_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canRenew && l.plan === 'annual' && (
                          <button onClick={() => renewFor(l.id, 'premium')} disabled={payingId === l.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-semibold hover:from-amber-500 hover:to-amber-600 disabled:opacity-50">
                            <Star className="w-3.5 h-3.5" />{el ? 'Premium' : 'Premium'}
                          </button>
                        )}
                        {canRenew && (
                          <button onClick={() => renewFor(l.id, l.plan === 'premium' ? 'premium' : 'annual')} disabled={payingId === l.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-sky-300 bg-sky-50 text-sky-700 text-xs font-semibold hover:bg-sky-100 disabled:opacity-50">
                            {payingId === l.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            {el ? 'Ανανέωση' : 'Renew'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment history */}
      {payments.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-slate-700 mt-8 mb-2 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />{el ? 'Ιστορικό πληρωμών' : 'Payment history'}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="px-4 py-3 font-semibold">{el ? 'Ημερομηνία' : 'Date'}</th>
                  <th className="px-4 py-3 font-semibold">{el ? 'Ποσό' : 'Amount'}</th>
                  <th className="px-4 py-3 font-semibold">{el ? 'Πακέτο' : 'Plan'}</th>
                  <th className="px-4 py-3 font-semibold text-right">{el ? 'Απόδειξη' : 'Receipt'}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 text-slate-600">{fmtDate(p.paid_at)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{(p.amount_cents || 0) === 0 ? (el ? 'Δωρεάν' : 'Free') : fmtAmount(p.amount_cents, p.currency)}</td>
                    <td className="px-4 py-3 text-slate-600">{el ? 'Ετήσιο' : 'Annual'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/billing/receipt/${p.id}`} className="inline-flex items-center gap-1 text-sky-600 hover:underline text-xs font-medium">
                        <Receipt className="w-3.5 h-3.5" />{el ? 'Άνοιγμα' : 'Open'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {el
              ? 'Για τιμολόγιο/παραστατικό επικοινωνήστε μαζί μας απαντώντας στο email επιβεβαίωσης.'
              : 'For an invoice, reply to your confirmation email and we’ll issue one.'}
          </p>
        </>
      )}

      <div className="mt-8">
        <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:underline">
          {el ? 'Δείτε τι περιλαμβάνει το πακέτο' : 'See what the package includes'} <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
