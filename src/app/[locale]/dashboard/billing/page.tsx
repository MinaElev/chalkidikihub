'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, AlertTriangle, Loader2, Receipt, ExternalLink, Ticket,
  RefreshCw, Landmark, FileText, Star, CalendarClock, Gift, Pencil, X, ChevronDown, Info, ImageOff,
} from 'lucide-react';
import { ANNUAL_PLAN, PREMIUM_PLAN, BILLING_CUTOFF } from '@/lib/billing';
import { subscriptionView, compareSubs, type SubView, type SubState } from '@/lib/billing-view';

type BillingListing = {
  id: string;
  title_el: string | null;
  slug: string | null;
  status: string;
  billing_exempt: boolean;
  plan: string | null;
  plan_status: string | null;
  plan_expires_at: string | null;
  bank_transfer_requested_at: string | null;
  image_url: string | null;
  listing_images: { image_url: string; is_cover: boolean; sort_order: number }[] | null;
};

/** Cover photo: the flagged cover, else the first by order, else the legacy column. */
function coverOf(l: BillingListing): string | null {
  const imgs = [...(l.listing_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  return imgs.find((i) => i.is_cover)?.image_url || imgs[0]?.image_url || l.image_url || null;
}

type Payment = {
  id: string;
  listing_id: string | null;
  amount_cents: number;
  currency: string;
  plan: string | null;
  method: string | null;
  discount_code: string | null;
  discount_cents: number | null;
  paid_at: string;
  refunded_at: string | null;
  refund_amount_cents: number | null;
};

type PlanKey = 'annual' | 'premium';
type Panel = { listingId: string; mode: 'pay' | 'renew' };
type BankInfo = { listingId: string; iban: string; beneficiary: string; bank: string; bic: string; amountLabel: string };
type InvoiceDetails = { invoice_name: string; invoice_vat: string; invoice_tax_office: string; invoice_address: string };
const BLANK_INVOICE: InvoiceDetails = { invoice_name: '', invoice_vat: '', invoice_tax_office: '', invoice_address: '' };

const INTL_LOCALE: Record<string, string> = {
  el: 'el-GR', en: 'en-GB', de: 'de-DE', ro: 'ro-RO', sr: 'sr-Latn-RS', bg: 'bg-BG', ru: 'ru-RU',
};

// Badge colour + icon per lifecycle state.
const STATE_STYLE: Record<SubState, { cls: string; icon: React.ElementType }> = {
  free_forever: { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: Gift },
  active: { cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: CheckCircle2 },
  expiring: { cls: 'bg-amber-50 text-amber-800 ring-amber-200', icon: CalendarClock },
  grace: { cls: 'bg-rose-50 text-rose-700 ring-rose-200', icon: AlertTriangle },
  expired: { cls: 'bg-rose-50 text-rose-700 ring-rose-200', icon: AlertCircle },
  awaiting_bank: { cls: 'bg-sky-50 text-sky-700 ring-sky-200', icon: Landmark },
  unpaid: { cls: 'bg-amber-50 text-amber-800 ring-amber-200', icon: Clock },
};

export default function BillingPage() {
  const locale = useLocale();
  const t = useTranslations('billing');
  const intl = INTL_LOCALE[locale] || 'en-GB';
  const params = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<BillingListing[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [panel, setPanel] = useState<Panel | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('annual');
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [applied, setApplied] = useState<{ code: string; finalCents: number; discountCents: number; free: boolean } | null>(null);
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetails>(BLANK_INVOICE);
  const [showInvoice, setShowInvoice] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [invoiceSaved, setInvoiceSaved] = useState(false);

  const justPaid = params.get('paid') === '1';
  const cancelled = params.get('cancelled') === '1';
  const pendingConfirm = params.get('pending') === '1';
  // Arriving from a "Pay" / "Renew" button on My Listings.
  const payTarget = params.get('pay');
  const [handledTarget, setHandledTarget] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (alive) setLoading(false); return; }

      const [{ data: ls }, { data: ps }] = await Promise.all([
        supabase
          .from('listings')
          .select('id, title_el, slug, status, billing_exempt, plan, plan_status, plan_expires_at, bank_transfer_requested_at, image_url, listing_images(image_url, is_cover, sort_order)')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('billing_payments')
          .select('id, listing_id, amount_cents, currency, plan, method, discount_code, discount_cents, paid_at, refunded_at, refund_amount_cents')
          .eq('owner_id', user.id)
          .order('paid_at', { ascending: false }),
      ]);
      if (!alive) return;
      setListings((ls as BillingListing[]) || []);
      setPayments((ps as Payment[]) || []);
      try {
        const r = await fetch('/api/billing/invoice-details');
        const j = await r.json().catch(() => ({}));
        if (alive && j.details) setInvoice({ ...BLANK_INVOICE, ...j.details });
      } catch { /* best-effort prefill */ }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const subs = useMemo(() => {
    const now = new Date();
    return listings
      .map((l) => ({ l, v: subscriptionView(l, payments, now) }))
      .sort((a, b) => compareSubs(a.v, b.v));
  }, [listings, payments]);

  // Open that listing's payment panel once the data is in, and bring it into view.
  useEffect(() => {
    if (loading || handledTarget || !payTarget) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot reaction to the ?pay= deep link
    setHandledTarget(true);
    const hit = subs.find((s) => s.l.id === payTarget);
    if (!hit) return;
    if (hit.v.state === 'awaiting_bank') requestBank(hit.l.id, hit.l.plan === 'premium' ? 'premium' : 'annual');
    else if (hit.v.action) openPanel(hit.l, hit.v.action);
    requestAnimationFrame(() => document.getElementById(`sub-${payTarget}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once, when loading finishes
  }, [loading, payTarget, handledTarget, subs]);

  const titleOf = useMemo(() => {
    const m = new Map(listings.map((l) => [l.id, l.title_el || t('untitled')]));
    return (id: string | null) => (id && m.get(id)) || t('deletedListing');
  }, [listings, t]);

  // ── Formatting ──────────────────────────────────────────────────────────
  const fmtDate = (d: Date | string | null) =>
    d ? new Date(d).toLocaleDateString(intl, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtAmount = (cents: number, currency = 'eur') =>
    new Intl.NumberFormat(intl, { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
  const freeUntil = fmtDate(new Date(BILLING_CUTOFF.getTime() - 86400000));
  const planCfg = (k: PlanKey) => (k === 'premium' ? PREMIUM_PLAN : ANNUAL_PLAN);
  const tierName = (tier: SubView['tier']) =>
    tier === 'premium' ? t('tier.premium') : tier === 'annual' ? t('tier.annual') : tier === 'free' ? t('tier.free') : t('tier.none');

  // ── Payment actions ─────────────────────────────────────────────────────
  function openPanel(l: BillingListing, mode: 'pay' | 'renew') {
    setError('');
    setCode('');
    setApplied(null);
    setBankInfo(null);
    setSelectedPlan(l.plan === 'premium' ? 'premium' : 'annual');
    setPanel({ listingId: l.id, mode });
  }

  function choosePlan(k: PlanKey) {
    setSelectedPlan(k);
    setApplied(null);   // the code's effect depends on the plan price
    setBankInfo(null);
  }

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
      if (res.ok && json.valid) setApplied({ code: json.code, finalCents: json.finalCents, discountCents: json.discountCents, free: json.free });
      else setError(t('err.invalidCode'));
    } catch {
      setError(t('err.network'));
    }
    setValidating(false);
  }

  async function payByCard(listingId: string, mode: 'pay' | 'renew') {
    setError('');
    setBusyId(listingId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          plan: selectedPlan,
          renew: mode === 'renew' || undefined,
          code: (applied?.code || code).trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.url) { window.location.assign(json.url); return; }
      // A code that zeroes the price activates without Viva → land on success.
      if (res.ok && json.free) { window.location.assign(`/${locale}/dashboard/billing?paid=1&listing=${listingId}`); return; }
      if (res.status === 422 || json.error === 'invalid_code') setError(t('err.invalidCode'));
      else if (json.error === 'payments_not_configured' || json.error === 'payment_provider_error') setError(t('err.cardUnavailable'));
      else if (json.error === 'listing_exempt') setError(t('err.exempt'));
      else if (json.error === 'already_paid') setError(t('err.alreadyPaid'));
      else if (json.error === 'not_payable' || json.error === 'not_renewable') setError(t('err.notPayable'));
      else if (json.error === 'unauthorized') setError(t('err.session'));
      else setError(t('err.generic', { code: json.error || res.status }));
    } catch {
      setError(t('err.network'));
    }
    setBusyId(null);
  }

  // Bank transfer: flags the listing for the admin and returns the IBAN. Also
  // used to show the deposit details again for a request already made.
  async function requestBank(listingId: string, plan: PlanKey) {
    setError('');
    setBusyId(listingId);
    try {
      const res = await fetch('/api/billing/bank-transfer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId, plan }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setBankInfo({
          listingId, iban: json.iban || '', beneficiary: json.beneficiary || '', bank: json.bank || '', bic: json.bic || '',
          amountLabel: json.amount_label || planCfg(plan).priceLabel,
        });
        setPanel(null);
        setListings((prev) => prev.map((l) => (l.id === listingId
          ? { ...l, plan, bank_transfer_requested_at: l.bank_transfer_requested_at || new Date().toISOString() }
          : l)));
      } else setError(t('err.bankFailed'));
    } catch { setError(t('err.network')); }
    setBusyId(null);
  }

  async function saveInvoice() {
    setSavingInvoice(true); setInvoiceSaved(false); setError('');
    try {
      const res = await fetch('/api/billing/invoice-details', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(invoice),
      });
      if (res.ok) setInvoiceSaved(true);
      else setError(t('err.saveFailed'));
    } catch { setError(t('err.network')); }
    setSavingInvoice(false);
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
      </div>
    );
  }

  // ── Summary numbers ─────────────────────────────────────────────────────
  const paidActive = subs.filter((s) => s.v.state === 'active' || s.v.state === 'expiring').length;
  const freeCount = subs.filter((s) => s.v.state === 'free_forever').length;
  const actionCount = subs.filter((s) => s.v.needsAction).length;
  const nextExpiry = subs
    .filter((s) => s.v.expiresAt && (s.v.state === 'active' || s.v.state === 'expiring'))
    .sort((a, b) => a.v.expiresAt!.getTime() - b.v.expiresAt!.getTime())[0];
  const allFree = subs.length > 0 && freeCount === subs.length;
  const netPaid = payments.reduce((sum, p) => sum + (p.refunded_at ? 0 : p.amount_cents || 0), 0);
  const invoiceFilled = Boolean(invoice.invoice_name || invoice.invoice_vat);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm">
          <CreditCard className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{t('subtitle')}</p>
        </div>
      </div>

      {/* Flash messages from the payment redirect */}
      {justPaid && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">{t('flash.paidTitle')}</h2>
          <p className="mt-1 text-sm text-slate-600">{t('flash.paidBody')}</p>
          <div className="mt-6 flex items-center justify-center max-w-xl mx-auto">
            {[
              { label: t('steps.submitted'), done: true },
              { label: t('steps.payment'), done: true },
              { label: t('steps.review'), done: false, current: true },
              { label: t('steps.live'), done: false },
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
                {i < arr.length - 1 && <div className={`h-0.5 flex-1 mx-1 mb-4 ${s.done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}
      {cancelled && <Notice tone="amber">{t('flash.cancelled')}</Notice>}
      {pendingConfirm && <Notice tone="sky">{t('flash.pending')}</Notice>}
      {error && <Notice tone="rose">{error}</Notice>}

      {/* At a glance */}
      {subs.length > 0 && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryTile label={t('summary.paid')} value={String(paidActive)} />
          <SummaryTile label={t('summary.free')} value={String(freeCount)} />
          <SummaryTile label={t('summary.action')} value={String(actionCount)} warn={actionCount > 0} />
          <SummaryTile
            label={t('summary.nextExpiry')}
            value={nextExpiry ? fmtDate(nextExpiry.v.expiresAt) : '—'}
            hint={nextExpiry ? nextExpiry.l.title_el || t('untitled') : undefined}
            small
          />
        </div>
      )}

      {allFree && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4">
          <Gift className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-emerald-900">{t('allFree.title')}</div>
            <p className="text-sm text-emerald-800 mt-0.5">{t('allFree.body', { date: freeUntil })}</p>
          </div>
        </div>
      )}

      {/* Subscriptions — one card per listing */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-900">{t('subs.heading')}</h2>
        <p className="text-sm text-slate-500 mb-3">{t('subs.hint')}</p>

        {subs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            {t('subs.empty')}{' '}
            <Link href="/dashboard/listings/new" className="text-sky-600 font-semibold hover:underline">{t('subs.addListing')}</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map(({ l, v }) => {
              const style = STATE_STYLE[v.state];
              const Icon = style.icon;
              const open = panel?.listingId === l.id;
              const busy = busyId === l.id;
              const showBank = bankInfo?.listingId === l.id;
              const accent = v.needsAction ? (v.state === 'grace' || v.state === 'expired' ? 'border-rose-200' : 'border-amber-200') : 'border-slate-200';
              return (
                <article key={l.id} id={`sub-${l.id}`} className={`scroll-mt-24 rounded-2xl border ${accent} bg-white overflow-hidden`}>
                  <div className="p-4 sm:p-5">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0">
                      <div className="relative w-20 h-16 sm:w-24 sm:h-[72px] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {coverOf(l) ? (
                          <Image src={coverOf(l)!} alt="" fill sizes="96px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageOff className="w-5 h-5" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 text-base leading-snug">{l.title_el || t('untitled')}</h3>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                          {v.tier === 'premium' && <Star className="w-4 h-4 text-amber-500 fill-amber-400" />}
                          <span className="font-medium">{tierName(v.tier)}</span>
                          {v.tier === 'premium' || v.tier === 'annual' ? (
                            <span className="text-slate-400">· {planCfg(v.tier).priceLabel}{t('perYear')}</span>
                          ) : null}
                        </div>
                      </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${style.cls}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {v.state === 'expiring' ? t('state.expiring', { days: Math.max(0, v.daysLeft ?? 0) }) : t(`state.${v.state}`)}
                      </span>
                    </div>

                    {/* Facts */}
                    {v.expiresAt && (
                      <>
                        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
                          <Fact label={t('field.validFrom')} value={fmtDate(v.termStart)} />
                          <Fact label={v.state === 'grace' || v.state === 'expired' ? t('field.expiredOn') : t('field.expires')} value={fmtDate(v.expiresAt)} strong />
                          <Fact
                            label={t('field.lastPayment')}
                            value={v.lastPayment ? `${fmtAmount(v.lastPayment.amount_cents)} · ${fmtDate(v.lastPayment.paid_at)}` : '—'}
                          />
                        </dl>
                        {v.termUsed != null && (v.state === 'active' || v.state === 'expiring') && (
                          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-hidden>
                            <div
                              className={`h-full rounded-full ${v.state === 'expiring' ? 'bg-amber-400' : 'bg-emerald-400'}`}
                              style={{ width: `${Math.round(v.termUsed * 100)}%` }}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* What this means */}
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {v.state === 'free_forever' && t('note.free', { date: freeUntil })}
                      {v.state === 'active' && t('note.active')}
                      {v.state === 'expiring' && t('note.expiring', { date: fmtDate(v.expiresAt) })}
                      {v.state === 'grace' && t('note.grace', { date: fmtDate(v.graceEndsAt) })}
                      {v.state === 'expired' && t('note.expired')}
                      {v.state === 'awaiting_bank' && t('note.awaitingBank')}
                      {v.state === 'unpaid' && t('note.unpaid')}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {v.action && !open && v.state !== 'awaiting_bank' && (
                        <button onClick={() => openPanel(l, v.action!)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            v.needsAction ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'border border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                          }`}>
                          {v.action === 'pay' ? <CreditCard className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                          {v.action === 'pay' ? t('action.pay') : t('action.renew')}
                        </button>
                      )}
                      {v.state === 'active' && v.tier === 'annual' && !open && (
                        <button onClick={() => { openPanel(l, 'renew'); setSelectedPlan('premium'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-sm font-semibold hover:bg-amber-100">
                          <Star className="w-4 h-4" />{t('action.upgrade')}
                        </button>
                      )}
                      {v.state === 'awaiting_bank' && !showBank && (
                        <button onClick={() => requestBank(l.id, l.plan === 'premium' ? 'premium' : 'annual')} disabled={busy}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-300 bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 disabled:opacity-50">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Landmark className="w-4 h-4" />}{t('action.showBank')}
                        </button>
                      )}
                      {v.state === 'awaiting_bank' && v.action && !open && (
                        <button onClick={() => openPanel(l, v.action!)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900">
                          <CreditCard className="w-4 h-4" />{t('action.cardInstead')}
                        </button>
                      )}
                      <Link href={`/dashboard/listings/${l.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-1 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800">
                        <Pencil className="w-3.5 h-3.5" />{t('action.editListing')}
                      </Link>
                    </div>

                    {showBank && bankInfo && <BankDetails info={bankInfo} t={t} />}
                  </div>

                  {/* Inline payment panel */}
                  {open && panel && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-900">{panel.mode === 'pay' ? t('panel.titlePay') : t('panel.titleRenew')}</h4>
                        <button onClick={() => setPanel(null)} aria-label={t('action.close')} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(['annual', 'premium'] as const).map((k) => {
                          const active = selectedPlan === k;
                          return (
                            <button key={k} type="button" onClick={() => choosePlan(k)} aria-pressed={active}
                              className={`text-left rounded-xl border-2 bg-white px-4 py-3 transition-colors ${active ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200 hover:border-slate-300'}`}>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                                  {k === 'premium' && <Star className="w-4 h-4 text-amber-500" />}
                                  {k === 'premium' ? t('tier.premium') : t('tier.annual')}
                                </span>
                                <span className="font-bold text-slate-900">{planCfg(k).priceLabel}<span className="text-xs font-normal text-slate-500">{t('perYear')}</span></span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">{k === 'premium' ? t('tierDesc.premium') : t('tierDesc.annual')}</div>
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-px" />
                        <span>
                          {panel.mode === 'renew'
                            ? (v.expiresAt && v.expiresAt > new Date()
                              ? t('panel.renewFrom', { date: fmtDate(v.expiresAt) })
                              : t('panel.renewToday'))
                            : t('panel.payInfo')}
                          {panel.mode === 'renew' && selectedPlan === 'premium' && v.tier === 'annual' && ` ${t('panel.premiumNow')}`}
                          {' '}{t('panel.vat')}
                        </span>
                      </p>

                      {/* Discount code */}
                      <div className="mt-4">
                        <label htmlFor={`code-${l.id}`} className="block text-xs font-medium text-slate-500 mb-1">{t('panel.code')}</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <input id={`code-${l.id}`} type="text" value={code}
                            onChange={(e) => { setCode(e.target.value.toUpperCase()); setApplied(null); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCode(); } }}
                            placeholder={t('panel.codePlaceholder')}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm uppercase tracking-wide bg-white focus:ring-2 focus:ring-sky-500 w-48" />
                          <button type="button" onClick={applyCode} disabled={validating || !code.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                            {validating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ticket className="w-3.5 h-3.5" />}
                            {t('panel.apply')}
                          </button>
                          {applied && (
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                              <CheckCircle2 className="w-4 h-4" />
                              {applied.free
                                ? t('panel.codeFree')
                                : t('panel.codeNewPrice', { price: fmtAmount(applied.finalCents), discount: fmtAmount(applied.discountCents) })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pay */}
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <button onClick={() => payByCard(l.id, panel.mode)} disabled={busy}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white text-sm font-semibold transition-colors">
                          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                          {applied?.free
                            ? t('panel.activateFree')
                            : t('panel.payCard', { price: applied ? fmtAmount(applied.finalCents) : planCfg(selectedPlan).priceLabel })}
                        </button>
                        {l.plan_status !== 'active' && !applied?.free && (
                          <button onClick={() => requestBank(l.id, selectedPlan)} disabled={busy}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium">
                            <Landmark className="w-4 h-4" />{t('panel.bank')}
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-400">{t('panel.secure')}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Payment history */}
      <section className="mb-10">
        <div className="flex items-end justify-between gap-3 flex-wrap mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-400" />{t('history.heading')}
            </h2>
            <p className="text-sm text-slate-500">{t('history.hint')}</p>
          </div>
          {payments.length > 0 && (
            <div className="text-sm text-slate-600">{t('history.total')} <strong className="text-slate-900">{fmtAmount(netPaid)}</strong></div>
          )}
        </div>

        {payments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">{t('history.empty')}</div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* Column headers (desktop) */}
            <div className="hidden sm:grid grid-cols-[110px_1fr_120px_100px_130px] gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <span>{t('history.date')}</span>
              <span>{t('history.listing')}</span>
              <span>{t('history.method')}</span>
              <span className="text-right">{t('history.amount')}</span>
              <span className="text-right">{t('history.receipt')}</span>
            </div>
            <ul>
              {payments.map((p) => {
                const tier = p.plan === 'premium' ? t('tier.premium') : t('tier.annual');
                // A zero-amount row was settled by a 100% code, whatever method it carries.
                const m = (p.amount_cents || 0) === 0 && p.discount_code ? 'free' : p.method || '';
                const method = ['card', 'bank_transfer', 'free', 'comp'].includes(m) ? t(`method.${m}`) : '—';
                const refunded = Boolean(p.refunded_at);
                return (
                  <li key={p.id} className={`grid grid-cols-[1fr_auto] sm:grid-cols-[110px_1fr_120px_100px_130px] gap-x-3 gap-y-1 px-4 py-3 border-b border-slate-50 last:border-0 text-sm ${refunded ? 'bg-slate-50/60' : ''}`}>
                    <span className="text-slate-500 sm:text-slate-600 order-2 sm:order-none text-xs sm:text-sm">{fmtDate(p.paid_at)}</span>
                    <div className="min-w-0 order-1 sm:order-none col-span-1">
                      <div className="font-medium text-slate-900 truncate">{titleOf(p.listing_id)}</div>
                      <div className="text-xs text-slate-500">
                        {t('history.packageLine', { tier })}
                        {p.discount_code && (p.discount_cents || 0) > 0 && (
                          <> · {t('history.discount', { code: p.discount_code, amount: fmtAmount(p.discount_cents || 0) })}</>
                        )}
                      </div>
                    </div>
                    <span className="hidden sm:block text-slate-600">{method}</span>
                    <span className={`text-right font-semibold order-1 sm:order-none ${refunded ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {(p.amount_cents || 0) === 0 ? t('history.free') : fmtAmount(p.amount_cents, p.currency)}
                    </span>
                    <span className="text-right order-2 sm:order-none">
                      {refunded ? (
                        <span className="text-xs font-medium text-rose-600">{t('history.refunded', { date: fmtDate(p.refunded_at) })}</span>
                      ) : (
                        <Link href={`/dashboard/billing/receipt/${p.id}`} className="inline-flex items-center gap-1 text-sky-600 hover:underline text-xs font-semibold">
                          <Receipt className="w-3.5 h-3.5" />{t('history.open')}
                        </Link>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      {/* Invoice details */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white">
        <button onClick={() => setShowInvoice((s) => !s)} aria-expanded={showInvoice}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">{t('invoice.heading')}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${invoiceFilled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {invoiceFilled ? t('invoice.filled') : t('invoice.notFilled')}
            </span>
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showInvoice ? 'rotate-180' : ''}`} />
        </button>
        {showInvoice && (
          <div className="px-5 pb-5 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500 mb-3">{t('invoice.hint')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                ['invoice_name', t('invoice.name')],
                ['invoice_vat', t('invoice.vat')],
                ['invoice_tax_office', t('invoice.taxOffice')],
                ['invoice_address', t('invoice.address')],
              ] as const).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
                  <input value={invoice[k]} onChange={(e) => { setInvoice({ ...invoice, [k]: e.target.value }); setInvoiceSaved(false); }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button onClick={saveInvoice} disabled={savingInvoice}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold">
                {savingInvoice && <Loader2 className="w-4 h-4 animate-spin" />}{t('invoice.save')}
              </button>
              {invoiceSaved && <span className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />{t('invoice.saved')}</span>}
            </div>
            <p className="mt-3 text-xs text-slate-400">{t('invoice.note')}</p>
          </div>
        )}
      </section>

      <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-sky-600 hover:underline">
        {t('compare')} <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function Notice({ tone, children }: { tone: 'amber' | 'sky' | 'rose'; children: React.ReactNode }) {
  const cls = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    sky: 'bg-sky-50 border-sky-200 text-sky-800',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
  }[tone];
  return (
    <div role={tone === 'rose' ? 'alert' : 'status'} className={`mb-4 flex items-start gap-3 border rounded-xl px-4 py-3 text-sm ${cls}`}>
      <AlertCircle className="w-5 h-5 shrink-0 mt-px" /><span>{children}</span>
    </div>
  );
}

function SummaryTile({ label, value, hint, warn, small }: { label: string; value: string; hint?: string; warn?: boolean; small?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${warn ? 'border-amber-200 bg-amber-50/60' : 'border-slate-200 bg-white'}`}>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={`mt-1 font-bold ${warn ? 'text-amber-800' : 'text-slate-900'} ${small ? 'text-base' : 'text-2xl'}`}>{value}</div>
      {hint && <div className="text-xs text-slate-500 truncate" title={hint}>{hint}</div>}
    </div>
  );
}

function Fact({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-0.5 ${strong ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{value}</dd>
    </div>
  );
}

function BankDetails({ info, t }: { info: BankInfo; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900">
      <div className="font-semibold mb-2 flex items-center gap-1.5"><Landmark className="w-4 h-4" />{t('bank.title')}</div>
      {info.iban ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          {info.bank && <><dt className="text-sky-700">{t('bank.bank')}</dt><dd className="font-semibold">{info.bank}</dd></>}
          {info.beneficiary && <><dt className="text-sky-700">{t('bank.beneficiary')}</dt><dd className="font-semibold">{info.beneficiary}</dd></>}
          <dt className="text-sky-700">IBAN</dt><dd className="font-mono font-semibold break-all">{info.iban}</dd>
          {info.bic && <><dt className="text-sky-700">BIC/SWIFT</dt><dd className="font-mono font-semibold">{info.bic}</dd></>}
          <dt className="text-sky-700">{t('bank.amount')}</dt><dd className="font-semibold">{info.amountLabel}</dd>
        </dl>
      ) : (
        <p className="text-xs">{t('bank.noIban')}</p>
      )}
      {info.iban && <p className="mt-3 text-xs text-sky-700">{t('bank.reference')}</p>}
    </div>
  );
}
