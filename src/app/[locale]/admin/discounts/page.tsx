'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Ticket, Plus, Loader2, Trash2, Power, PowerOff, AlertCircle } from 'lucide-react';
import { normalizeCode, ANNUAL_PLAN, type DiscountKind } from '@/lib/billing';

type Row = {
  id: string;
  code: string;
  kind: DiscountKind;
  value: number;
  active: boolean;
  max_redemptions: number | null;
  times_redeemed: number;
  expires_at: string | null;
  note: string | null;
  created_at: string;
};

const BLANK = { code: '', kind: 'percent' as DiscountKind, value: 10, maxRedemptions: '', expiresAt: '', note: '' };

export default function AdminDiscountsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(BLANK);

  useEffect(() => {
    let alive = true;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('discount_codes')
        .select('id, code, kind, value, active, max_redemptions, times_redeemed, expires_at, note, created_at')
        .order('created_at', { ascending: false });
      if (!alive) return;
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  async function reload() {
    const supabase = createClient();
    const { data } = await supabase
      .from('discount_codes')
      .select('id, code, kind, value, active, max_redemptions, times_redeemed, expires_at, note, created_at')
      .order('created_at', { ascending: false });
    setRows((data as Row[]) || []);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const code = normalizeCode(form.code);
    if (!code) { setError('Ο κωδικός είναι υποχρεωτικός.'); return; }
    // fixed value entered in euros → store cents. percent stored as-is. free = 0.
    let value = 0;
    if (form.kind === 'percent') value = Math.max(1, Math.min(100, Math.round(Number(form.value) || 0)));
    else if (form.kind === 'fixed') value = Math.max(1, Math.round((Number(form.value) || 0) * 100));

    setSaving(true);
    const supabase = createClient();
    const { error: insErr } = await supabase.from('discount_codes').insert({
      code,
      kind: form.kind,
      value,
      max_redemptions: form.maxRedemptions ? Math.max(1, Math.round(Number(form.maxRedemptions))) : null,
      expires_at: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      note: form.note.trim() || null,
    });
    setSaving(false);
    if (insErr) {
      setError(/duplicate|unique/i.test(insErr.message) ? 'Υπάρχει ήδη κωδικός με αυτό το όνομα.' : insErr.message);
      return;
    }
    setForm(BLANK);
    reload();
  }

  async function toggle(row: Row) {
    const supabase = createClient();
    await supabase.from('discount_codes').update({ active: !row.active }).eq('id', row.id);
    reload();
  }

  async function remove(row: Row) {
    if (!confirm(`Διαγραφή κωδικού ${row.code};`)) return;
    const supabase = createClient();
    await supabase.from('discount_codes').delete().eq('id', row.id);
    reload();
  }

  function valueLabel(r: Row) {
    if (r.kind === 'free') return 'Δωρεάν (100%)';
    if (r.kind === 'percent') return `-${r.value}%`;
    return `-${(r.value / 100).toFixed(2)}€`;
  }
  function fmtDate(iso: string | null) {
    return iso ? new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-900">Κωδικοί έκπτωσης</h1>
      </div>

      <p className="mb-6 text-sm text-slate-600 max-w-2xl">
        Εκπτωτικοί κωδικοί για την ετήσια καταχώρηση ({ANNUAL_PLAN.priceLabel}). Ο owner τους εισάγει στη σελίδα Χρέωσης.
        Κωδικός <strong>«Δωρεάν»</strong> ή <strong>-100%</strong> ενεργοποιεί την καταχώρηση χωρίς πληρωμή.
      </p>

      {/* Create form */}
      <form onSubmit={create} className="bg-white border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Κωδικός *</label>
          <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="FRIEND2027" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase tracking-wide" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Τύπος</label>
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as DiscountKind })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="percent">Ποσοστό %</option>
            <option value="fixed">Σταθερό €</option>
            <option value="free">Δωρεάν (100%)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {form.kind === 'percent' ? 'Ποσοστό (%)' : form.kind === 'fixed' ? 'Ποσό (€)' : '—'}
          </label>
          <input type="number" value={form.kind === 'free' ? '' : form.value} disabled={form.kind === 'free'}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Μέγ. χρήσεις</label>
          <input type="number" value={form.maxRedemptions} onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })}
            placeholder="∞" min={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Λήξη</label>
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div className="md:col-span-5">
          <label className="block text-xs font-medium text-gray-600 mb-1">Σημείωση (για ποιον/τι)</label>
          <input type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="π.χ. Συνεργάτης Παναγιώτης" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <div>
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-semibold rounded-lg">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Δημιουργία
          </button>
        </div>
        {error && (
          <div className="md:col-span-6 flex items-center gap-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}
      </form>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-600" /></div>
      ) : rows.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-400">Δεν υπάρχουν κωδικοί ακόμα.</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="px-4 py-3 font-semibold">Κωδικός</th>
                <th className="px-4 py-3 font-semibold">Έκπτωση</th>
                <th className="px-4 py-3 font-semibold">Χρήσεις</th>
                <th className="px-4 py-3 font-semibold">Λήξη</th>
                <th className="px-4 py-3 font-semibold">Σημείωση</th>
                <th className="px-4 py-3 font-semibold text-right">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-b border-gray-50 last:border-0 ${!r.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-gray-900">{r.code}</span>
                    {!r.active && <span className="ml-2 text-[10px] uppercase text-gray-400">ανενεργός</span>}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-700">{valueLabel(r)}</td>
                  <td className="px-4 py-3 text-gray-600 tabular-nums">{r.times_redeemed}{r.max_redemptions != null ? ` / ${r.max_redemptions}` : ''}</td>
                  <td className="px-4 py-3 text-gray-600">{fmtDate(r.expires_at)}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.note || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggle(r)} title={r.active ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        {r.active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button onClick={() => remove(r)} title="Διαγραφή" className="p-1.5 rounded hover:bg-rose-50 text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
