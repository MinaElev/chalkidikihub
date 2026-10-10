'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Wallet, Loader2, TrendingUp, CalendarClock, Ticket, Undo2, AlertCircle, Landmark, CheckCircle2, XCircle } from 'lucide-react';

type Payment = {
  id: string;
  listing_id: string | null;
  amount_cents: number;
  currency: string;
  discount_code: string | null;
  discount_cents: number;
  paid_at: string;
  refunded_at: string | null;
  refund_amount_cents: number;
  listings: { title_el: string | null; status: string; plan_status: string } | null;
};
type Expiry = { id: string; title_el: string | null; plan_status: string; plan_expires_at: string | null };

export default function AdminBillingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expiries, setExpiries] = useState<Expiry[]>([]);
  const [bankPending, setBankPending] = useState<{ id: string; title_el: string | null; bank_transfer_requested_at: string | null; plan_status: string }[]>([]);
  const [health, setHealth] = useState<{ stripe_secret: boolean; webhook_secret: boolean; cron_secret: boolean; iban_set: boolean; last_billing_event: string | null } | null>(null);
  const [iban, setIban] = useState({ billing_iban: '', billing_beneficiary: '', billing_bank: '', billing_bic: '' });
  const [ibanSaved, setIbanSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      const [{ data: pays }, { data: exp }, { data: bank }, { data: sett }] = await Promise.all([
        supabase
          .from('billing_payments')
          .select('id, listing_id, amount_cents, currency, discount_code, discount_cents, paid_at, refunded_at, refund_amount_cents, listings(title_el, status, plan_status)')
          .order('paid_at', { ascending: false })
          .limit(500),
        supabase
          .from('listings')
          .select('id, title_el, plan_status, plan_expires_at')
          .in('plan_status', ['active', 'past_due'])
          .order('plan_expires_at', { ascending: true })
          .limit(50),
        supabase
          .from('listings')
          .select('id, title_el, bank_transfer_requested_at, plan_status')
          .not('bank_transfer_requested_at', 'is', null)
          .neq('plan_status', 'active')
          .order('bank_transfer_requested_at', { ascending: true }),
        supabase.from('site_settings').select('key, value').in('key', ['billing_iban', 'billing_beneficiary', 'billing_bank', 'billing_bic']),
      ]);
      if (!alive) return;
      setPayments((pays as unknown as Payment[]) || []);
      setExpiries((exp as Expiry[]) || []);
      setBankPending((bank as typeof bankPending) || []);
      const sm: Record<string, string> = {};
      (sett || []).forEach((s: { key: string; value: string }) => { sm[s.key] = s.value; });
      setIban({ billing_iban: sm.billing_iban || '', billing_beneficiary: sm.billing_beneficiary || '', billing_bank: sm.billing_bank || '', billing_bic: sm.billing_bic || '' });
      try { const h = await fetch('/api/admin/billing/health').then((r) => r.json()); if (alive) setHealth(h); } catch { /* ignore */ }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  async function reloadBank() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listings').select('id, title_el, bank_transfer_requested_at, plan_status')
      .not('bank_transfer_requested_at', 'is', null).neq('plan_status', 'active')
      .order('bank_transfer_requested_at', { ascending: true });
    setBankPending((data as typeof bankPending) || []);
  }

  async function confirmBank(l: { id: string; title_el: string | null }) {
    if (!confirm(`Επιβεβαίωση κατάθεσης & ενεργοποίηση «${l.title_el || ''}»;`)) return;
    setError(''); setBusy(l.id);
    try {
      const res = await fetch('/api/admin/billing/confirm-bank', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing_id: l.id }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setError(j.error || 'Αποτυχία.');
      else { await reloadBank(); await reload(); }
    } catch { setError('Σφάλμα δικτύου.'); }
    setBusy(null);
  }

  async function saveIban() {
    setError(''); setIbanSaved(false); setBusy('iban');
    try {
      const supabase = createClient();
      for (const key of ['billing_iban', 'billing_beneficiary', 'billing_bank', 'billing_bic'] as const) {
        await supabase.from('site_settings').upsert({ key, value: iban[key] }, { onConflict: 'key' });
      }
      setIbanSaved(true);
    } catch { setError('Αποτυχία αποθήκευσης IBAN.'); }
    setBusy(null);
  }

  async function reload() {
    const supabase = createClient();
    const { data } = await supabase
      .from('billing_payments')
      .select('id, listing_id, amount_cents, currency, discount_code, discount_cents, paid_at, refunded_at, refund_amount_cents, listings(title_el, status, plan_status)')
      .order('paid_at', { ascending: false }).limit(500);
    setPayments((data as unknown as Payment[]) || []);
  }

  async function refund(p: Payment) {
    if (!p.listing_id) return;
    if (!confirm(`Επιστροφή χρημάτων & απενεργοποίηση της καταχώρησης «${p.listings?.title_el || ''}»;`)) return;
    setError('');
    setBusy(p.id);
    try {
      const res = await fetch('/api/admin/billing/refund', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: p.listing_id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error === 'stripe_not_configured' ? 'Λείπει το Stripe key.' : (json.error || 'Αποτυχία επιστροφής.'));
      else await reload();
    } catch { setError('Σφάλμα δικτύου.'); }
    setBusy(null);
  }

  function eur(cents: number) { return (cents / 100).toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'; }
  function fmtDate(iso: string | null) { return iso ? new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }

  // Metrics (net = excludes refunded).
  const net = payments.filter((p) => !p.refunded_at);
  const totalNet = net.reduce((s, p) => s + (p.amount_cents || 0), 0);
  const now = new Date();
  const monthNet = net.filter((p) => { const d = new Date(p.paid_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, p) => s + (p.amount_cents || 0), 0);
  const refundedCount = payments.filter((p) => p.refunded_at).length;
  const freeCount = net.filter((p) => (p.amount_cents || 0) === 0).length;

  // Discount usage.
  const codeUsage: Record<string, number> = {};
  for (const p of net) if (p.discount_code) codeUsage[p.discount_code] = (codeUsage[p.discount_code] || 0) + 1;

  const daysTo = (iso: string | null) => iso ? Math.round((new Date(iso).getTime() - now.getTime()) / 86400000) : null;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-900">Χρεώσεις — Επισκόπηση</h1>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Health */}
      {health && (
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { ok: health.stripe_secret, label: 'Stripe key' },
            { ok: health.webhook_secret, label: 'Webhook secret' },
            { ok: health.cron_secret, label: 'Cron secret' },
            { ok: health.iban_set, label: 'IBAN' },
          ].map((h) => (
            <span key={h.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${h.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {h.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}{h.label}
            </span>
          ))}
          {health.last_billing_event && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-gray-500 border border-gray-200">
              Τελ. event: {fmtDate(health.last_billing_event)}
            </span>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600"><TrendingUp className="w-3.5 h-3.5" />Έσοδα (καθαρά)</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{eur(totalNet)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-sky-600">Αυτόν τον μήνα</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{eur(monthNet)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Πληρωμές</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{net.length}<span className="text-sm font-medium text-gray-400"> ({freeCount} δωρεάν)</span></div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-rose-500">Επιστροφές</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{refundedCount}</div>
        </div>
      </div>

      {/* Discount usage */}
      {Object.keys(codeUsage).length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Ticket className="w-4 h-4 text-gray-400" />Χρήση κωδικών</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(codeUsage).sort((a, b) => b[1] - a[1]).map(([c, n]) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-sm font-medium text-violet-700">
                {c} <span className="text-violet-400">×{n}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending bank transfers */}
      {bankPending.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Landmark className="w-4 h-4 text-gray-400" />Εκκρεμείς καταθέσεις</h2>
          <div className="space-y-2">
            {bankPending.map((l) => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/60 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{l.title_el || '—'}</div>
                  <div className="text-xs text-gray-500">Ζητήθηκε: {fmtDate(l.bank_transfer_requested_at)}</div>
                </div>
                <button onClick={() => confirmBank(l)} disabled={busy === l.id}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-semibold">
                  {busy === l.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Επιβεβαίωση πληρωμής
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IBAN settings */}
      <details className="mb-8 rounded-xl border border-gray-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-gray-400" />Στοιχεία κατάθεσης (IBAN) — εμφανίζονται στους ιδιοκτήτες
        </summary>
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input value={iban.billing_bank} onChange={(e) => { setIban({ ...iban, billing_bank: e.target.value }); setIbanSaved(false); }}
            placeholder="Τράπεζα" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={iban.billing_beneficiary} onChange={(e) => { setIban({ ...iban, billing_beneficiary: e.target.value }); setIbanSaved(false); }}
            placeholder="Δικαιούχος" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <input value={iban.billing_iban} onChange={(e) => { setIban({ ...iban, billing_iban: e.target.value }); setIbanSaved(false); }}
            placeholder="IBAN" className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
          <input value={iban.billing_bic} onChange={(e) => { setIban({ ...iban, billing_bic: e.target.value }); setIbanSaved(false); }}
            placeholder="BIC / SWIFT" className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
          <div className="sm:col-span-3 flex items-center gap-3">
            <button onClick={saveIban} disabled={busy === 'iban'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold">
              {busy === 'iban' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Αποθήκευση
            </button>
            {ibanSaved && <span className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Αποθηκεύτηκε</span>}
          </div>
        </div>
      </details>

      {/* Upcoming expiries */}
      <div className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><CalendarClock className="w-4 h-4 text-gray-400" />Επερχόμενες λήξεις</h2>
        {expiries.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-400">Καμία ενεργή συνδρομή.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-semibold">Κατάλυμα</th><th className="px-4 py-3 font-semibold">Λήξη</th><th className="px-4 py-3 font-semibold">Σε</th><th className="px-4 py-3 font-semibold">Κατάσταση</th>
              </tr></thead>
              <tbody>
                {expiries.map((e) => {
                  const d = daysTo(e.plan_expires_at);
                  return (
                    <tr key={e.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{e.title_el || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(e.plan_expires_at)}</td>
                      <td className={`px-4 py-3 font-medium ${d != null && d < 30 ? 'text-amber-600' : 'text-gray-600'}`}>{d != null ? `${d} μέρες` : '—'}</td>
                      <td className="px-4 py-3">{e.plan_status === 'past_due'
                        ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">past due</span>
                        : <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">active</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payments */}
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Πληρωμές</h2>
      {payments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400">Καμία πληρωμή ακόμα.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Ημ/νία</th><th className="px-4 py-3 font-semibold">Κατάλυμα</th><th className="px-4 py-3 font-semibold">Ποσό</th><th className="px-4 py-3 font-semibold">Κωδικός</th><th className="px-4 py-3 font-semibold text-right">Ενέργεια</th>
            </tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className={`border-b border-gray-50 last:border-0 ${p.refunded_at ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 text-gray-600">{fmtDate(p.paid_at)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.listings?.title_el || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {(p.amount_cents || 0) === 0 ? <span className="text-emerald-600">Δωρεάν</span> : eur(p.amount_cents)}
                    {p.refunded_at && <span className="ml-2 text-[10px] uppercase text-rose-500 font-semibold">επεστράφη</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.discount_code || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {p.refunded_at ? (
                      <span className="text-xs text-gray-400">{fmtDate(p.refunded_at)}</span>
                    ) : (
                      <button onClick={() => refund(p)} disabled={busy === p.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium disabled:opacity-50">
                        {busy === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Undo2 className="w-3.5 h-3.5" />}
                        Επιστροφή
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
