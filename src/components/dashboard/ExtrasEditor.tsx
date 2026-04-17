'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Trash2, Loader2, Wand2, Save, Check, Coffee, Car, Droplets, Bike, Ship,
  Utensils, Flower2, ShowerHead, Sparkle,
} from 'lucide-react';

interface ExtraRow {
  id: string;
  sort_order: number;
  icon_key: string;
  price: number | null;
  currency: string;
  price_unit: string | null;
  included: boolean;
  label_el: string | null;
  description_el: string | null;
  [key: string]: unknown;
}

interface Draft {
  icon_key: string;
  price: string;  // kept as string in the form, parsed on save
  currency: string;
  price_unit: string;
  included: boolean;
  label_el: string;
  description_el: string;
  translations?: Record<string, string>;
  isDirty: boolean;
  translating: boolean;
}

const ICONS = [
  { key: 'breakfast', label: 'Πρωινό',      Icon: Coffee },
  { key: 'transfer',  label: 'Μεταφορά',    Icon: Car },
  { key: 'cleaning',  label: 'Καθαριότητα', Icon: Droplets },
  { key: 'bike',      label: 'Ποδήλατο',    Icon: Bike },
  { key: 'boat',      label: 'Σκάφος',      Icon: Ship },
  { key: 'food',      label: 'Φαγητό',      Icon: Utensils },
  { key: 'spa',       label: 'Spa',         Icon: Flower2 },
  { key: 'towels',    label: 'Πετσέτες',    Icon: ShowerHead },
  { key: 'sparkle',   label: 'Άλλο',        Icon: Sparkle },
];

const UNITS = [
  { key: '',             label: '—' },
  { key: 'per_stay',     label: 'ανά διαμονή' },
  { key: 'per_night',    label: 'ανά βράδυ' },
  { key: 'per_day',      label: 'ανά ημέρα' },
  { key: 'per_person',   label: 'ανά άτομο' },
  { key: 'per_use',      label: 'ανά χρήση' },
];

export function ExtrasEditor({ listingId, canTranslate = false }: { listingId: string; canTranslate?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ExtraRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listing_extras')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true });
    const list = (data || []) as ExtraRow[];
    setRows(list);
    const d: Record<string, Draft> = {};
    list.forEach(r => {
      d[r.id] = {
        icon_key: r.icon_key || 'sparkle',
        price: r.price != null ? String(r.price) : '',
        currency: r.currency || 'EUR',
        price_unit: r.price_unit || '',
        included: !!r.included,
        label_el: r.label_el || '',
        description_el: r.description_el || '',
        isDirty: false, translating: false,
      };
    });
    setDrafts(d);
    setLoading(false);
  }

  async function addRow() {
    setAdding(true);
    const supabase = createClient();
    const nextOrder = rows.length > 0 ? Math.max(...rows.map(r => r.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from('listing_extras')
      .insert({ listing_id: listingId, sort_order: nextOrder, icon_key: 'breakfast' })
      .select('*')
      .single();
    if (!error && data) {
      const row = data as ExtraRow;
      setRows(prev => [...prev, row]);
      setDrafts(prev => ({
        ...prev,
        [row.id]: {
          icon_key: 'breakfast', price: '', currency: 'EUR', price_unit: 'per_person',
          included: false, label_el: '', description_el: '',
          isDirty: false, translating: false,
        },
      }));
    }
    setAdding(false);
  }

  async function deleteRow(id: string) {
    if (!confirm('Διαγραφή αυτής της υπηρεσίας;')) return;
    const supabase = createClient();
    await supabase.from('listing_extras').delete().eq('id', id);
    setRows(prev => prev.filter(r => r.id !== id));
    setDrafts(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...patch, isDirty: true } }));
  }

  async function translate(id: string) {
    const d = drafts[id];
    if (!d?.label_el.trim()) { alert('Γράψε πρώτα την ετικέτα στα ελληνικά.'); return; }
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], translating: true } }));
    try {
      const fields: Record<string, string> = { label: d.label_el };
      if (d.description_el.trim()) fields.description = d.description_el;
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: 'el', fields }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const flat: Record<string, string> = {};
      Object.entries((data.label || {}) as Record<string, string>).forEach(([k, v]) => { flat[`label_${k}`] = v; });
      Object.entries((data.description || {}) as Record<string, string>).forEach(([k, v]) => { flat[`description_${k}`] = v; });
      setDrafts(prev => ({ ...prev, [id]: { ...prev[id], translations: flat, translating: false, isDirty: true } }));
    } catch (err) {
      setDrafts(prev => ({ ...prev, [id]: { ...prev[id], translating: false } }));
      alert('Αποτυχία: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  }

  async function save(id: string) {
    const d = drafts[id];
    if (!d.label_el.trim()) { alert('Συμπλήρωσε την ετικέτα στα ελληνικά.'); return; }
    setSaving(prev => ({ ...prev, [id]: true }));
    const supabase = createClient();
    const payload: Record<string, unknown> = {
      icon_key: d.icon_key,
      price: d.included ? null : (d.price.trim() ? Number(d.price) : null),
      currency: d.currency || 'EUR',
      price_unit: d.price_unit || null,
      included: d.included,
      label_el: d.label_el.trim(),
      description_el: d.description_el.trim() || null,
      ...(d.translations || {}),
    };
    const { error } = await supabase.from('listing_extras').update(payload).eq('id', id);
    if (error) alert('Σφάλμα: ' + error.message);
    else setDrafts(prev => ({ ...prev, [id]: { ...prev[id], isDirty: false, translations: undefined } }));
    setSaving(prev => ({ ...prev, [id]: false }));
  }

  if (loading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;

  return (
    <div>
      {rows.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          Δεν έχεις προσθέσει υπηρεσίες.
        </div>
      )}
      <div className="space-y-3">
        {rows.map((row, idx) => {
          const d = drafts[row.id];
          if (!d) return null;
          const IconComp = ICONS.find(i => i.key === d.icon_key)?.Icon || Sparkle;
          return (
            <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-700">
                  <IconComp className="w-4 h-4" />
                </span>
                <span className="text-xs text-gray-500">#{idx + 1}</span>
                <button type="button" onClick={() => deleteRow(row.id)} className="ml-auto p-1 rounded hover:bg-red-50 text-red-500" title="Διαγραφή">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Τύπος</label>
                  <select value={d.icon_key} onChange={(e) => updateDraft(row.id, { icon_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                    {ICONS.map(i => <option key={i.key} value={i.key}>{i.label}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ετικέτα (ελληνικά)</label>
                  <input type="text" value={d.label_el} onChange={(e) => updateDraft(row.id, { label_el: e.target.value })}
                    placeholder="π.χ. Πρωινό στο δωμάτιο"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Περιγραφή (προαιρετικό)</label>
                <textarea rows={2} value={d.description_el} onChange={(e) => updateDraft(row.id, { description_el: e.target.value })}
                  placeholder="π.χ. Πλούσιο πρωινό με τοπικά προϊόντα, κάθε πρωί 8:00–11:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={d.included} onChange={(e) => updateDraft(row.id, { included: e.target.checked })}
                    className="rounded text-primary-600" />
                  Δωρεάν / περιλαμβάνεται
                </label>
                {!d.included && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Τιμή (€)</label>
                      <input type="number" step="0.5" value={d.price} onChange={(e) => updateDraft(row.id, { price: e.target.value })}
                        placeholder="12" className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Μονάδα</label>
                      <select value={d.price_unit} onChange={(e) => updateDraft(row.id, { price_unit: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        {UNITS.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                {canTranslate && (
                  <>
                    <button type="button" onClick={() => translate(row.id)} disabled={d.translating || !d.label_el.trim()}
                      className="text-xs flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40">
                      {d.translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      Μετάφραση με AI
                    </button>
                    {d.translations && <span className="text-xs text-green-700 flex items-center gap-1"><Check className="w-3 h-3" /> 6 γλώσσες έτοιμες</span>}
                  </>
                )}
                <div className="ml-auto flex items-center gap-2">
                  {d.isDirty && <span className="text-xs text-amber-700">Μη αποθηκευμένες</span>}
                  <button type="button" onClick={() => save(row.id)} disabled={saving[row.id] || !d.isDirty}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40">
                    {saving[row.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Αποθήκευση
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={addRow} disabled={adding}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50">
        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Προσθήκη υπηρεσίας
      </button>
    </div>
  );
}
