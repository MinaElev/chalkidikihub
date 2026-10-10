'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { netFromGross } from '@/lib/billing';

type Payment = {
  id: string; listing_id: string | null; amount_cents: number; currency: string;
  discount_code: string | null; discount_cents: number; method: string; paid_at: string;
  refunded_at: string | null;
};

export default function ReceiptPage() {
  const params = useParams();
  const id = String(params?.id || '');
  const [loading, setLoading] = useState(true);
  const [pay, setPay] = useState<Payment | null>(null);
  const [listingTitle, setListingTitle] = useState('');
  const [invoice, setInvoice] = useState<{ invoice_name?: string; invoice_vat?: string; invoice_tax_office?: string; invoice_address?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (alive) setLoading(false); return; }
      const { data: p } = await supabase
        .from('billing_payments')
        .select('id, listing_id, amount_cents, currency, discount_code, discount_cents, method, paid_at, refunded_at')
        .eq('id', id).maybeSingle();
      if (!alive) return;
      setPay((p as Payment) || null);
      if (p?.listing_id) {
        const { data: l } = await supabase.from('listings').select('title_el').eq('id', p.listing_id).maybeSingle();
        setListingTitle(l?.title_el || '');
      }
      const { data: prof } = await supabase
        .from('profiles').select('invoice_name, invoice_vat, invoice_tax_office, invoice_address').eq('id', user.id).maybeSingle();
      setInvoice(prof || null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id]);

  const eur = (c: number) => (c / 100).toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€';
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric' });
  const methodLabel: Record<string, string> = { card: 'Κάρτα', bank_transfer: 'Τραπεζική κατάθεση', free: 'Κωδικός έκπτωσης', comp: 'Δωρεάν (comp)' };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>;
  if (!pay) return (
    <div className="max-w-md text-center py-16">
      <p className="text-slate-600">Η απόδειξη δεν βρέθηκε.</p>
      <Link href="/dashboard/billing" className="text-sky-600 hover:underline text-sm mt-2 inline-block">← Επιστροφή στη Χρέωση</Link>
    </div>
  );

  const amount = pay.amount_cents || 0;
  const isFree = amount <= 0;
  const netCents = Math.round(netFromGross(amount) * 100);
  const vatCents = amount - netCents;
  const hasInvoice = invoice && (invoice.invoice_name || invoice.invoice_vat);

  return (
    <div className="max-w-2xl">
      {/* Screen-only toolbar */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <Link href="/dashboard/billing" className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Χρέωση
        </Link>
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold">
          <Printer className="w-4 h-4" /> Εκτύπωση / PDF
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 print:border-0 print:p-0">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-5">
          <div>
            <div className="text-xl font-bold text-slate-900">ChalkidikiHub</div>
            <div className="text-sm text-slate-500">chalkidikihub.gr</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Απόδειξη</div>
            <div className="text-sm text-slate-600 mt-0.5">{fmt(pay.paid_at)}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">#{pay.id.slice(0, 8)}</div>
          </div>
        </div>

        {hasInvoice && (
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Στοιχεία πελάτη</div>
            <div className="text-sm text-slate-700 leading-relaxed">
              {invoice?.invoice_name && <div className="font-medium text-slate-900">{invoice.invoice_name}</div>}
              {invoice?.invoice_vat && <div>ΑΦΜ: {invoice.invoice_vat}{invoice.invoice_tax_office ? ` · ΔΟΥ: ${invoice.invoice_tax_office}` : ''}</div>}
              {invoice?.invoice_address && <div>{invoice.invoice_address}</div>}
            </div>
          </div>
        )}

        <table className="w-full text-sm mb-5">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 text-slate-600">Ετήσια καταχώρηση{listingTitle ? ` — ${listingTitle}` : ''}</td>
              <td className="py-2.5 text-right text-slate-900">{isFree ? '0,00€' : eur(netCents + vatCents)}</td>
            </tr>
            {pay.discount_code && (
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-600">Έκπτωση ({pay.discount_code})</td>
                <td className="py-2.5 text-right text-emerald-700">−{eur(pay.discount_cents || 0)}</td>
              </tr>
            )}
            {!isFree && (
              <>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-600">Καθαρή αξία</td>
                  <td className="py-2.5 text-right text-slate-900">{eur(netCents)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-600">ΦΠΑ 24%</td>
                  <td className="py-2.5 text-right text-slate-900">{eur(vatCents)}</td>
                </tr>
              </>
            )}
            <tr>
              <td className="py-3 font-bold text-slate-900">Σύνολο</td>
              <td className="py-3 text-right font-bold text-slate-900">{isFree ? 'Δωρεάν' : eur(amount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate-600 border-t border-slate-100 pt-4">
          <div>Τρόπος πληρωμής: <span className="text-slate-900">{methodLabel[pay.method] || pay.method}</span></div>
          {pay.refunded_at && <div className="text-rose-600 font-medium">Επεστράφη: {fmt(pay.refunded_at)}</div>}
        </div>

        <p className="mt-6 text-xs text-slate-400 leading-relaxed">
          Το ποσό περιλαμβάνει ΦΠΑ 24%. Για επίσημο φορολογικό παραστατικό (τιμολόγιο) με τα στοιχεία σας,
          συμπληρώστε τα «Στοιχεία τιμολόγησης» στη σελίδα Χρέωσης ή απαντήστε στο email επιβεβαίωσης.
        </p>
      </div>
    </div>
  );
}
