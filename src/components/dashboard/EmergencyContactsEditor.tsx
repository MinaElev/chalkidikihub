'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Trash2, Loader2, Save, Info,
  ShieldAlert, Flame, HeartPulse, Hospital, Pill, LifeBuoy, Car, User, AlertTriangle,
} from 'lucide-react';

interface ContactRow {
  id: string;
  sort_order: number;
  icon_key: string;
  phone: string;
  label_el: string | null;
  notes_el: string | null;
  [key: string]: unknown;
}

interface Draft {
  phone: string;
  icon_key: string;
  label_el: string;
  notes_el: string;
  isDirty: boolean;
}

const ICONS = [
  { key: 'police',      label: 'Αστυνομία',       Icon: ShieldAlert },
  { key: 'hospital',    label: 'Νοσοκομείο',      Icon: Hospital },
  { key: 'medical',     label: 'Ιατρείο',         Icon: HeartPulse },
  { key: 'pharmacy',    label: 'Φαρμακείο',       Icon: Pill },
  { key: 'fire',        label: 'Πυροσβεστική',    Icon: Flame },
  { key: 'coast_guard', label: 'Λιμενικό',        Icon: LifeBuoy },
  { key: 'taxi',        label: 'Ταξί',            Icon: Car },
  { key: 'host',        label: 'Ιδιοκτήτης',      Icon: User },
  { key: 'other',       label: 'Άλλο',            Icon: AlertTriangle },
];

export function EmergencyContactsEditor({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listing_emergency_contacts')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true });

    const list = (data || []) as ContactRow[];
    setRows(list);
    const d: Record<string, Draft> = {};
    list.forEach(r => {
      d[r.id] = {
        phone: r.phone || '',
        icon_key: r.icon_key || 'other',
        label_el: r.label_el || '',
        notes_el: r.notes_el || '',
        isDirty: false,
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
      .from('listing_emergency_contacts')
      .insert({
        listing_id: listingId, sort_order: nextOrder,
        phone: '', icon_key: 'police',
      })
      .select('*')
      .single();
    if (!error && data) {
      const row = data as ContactRow;
      setRows(prev => [...prev, row]);
      setDrafts(prev => ({
        ...prev,
        [row.id]: {
          phone: '', icon_key: 'police', label_el: '', notes_el: '',
          isDirty: false,
        },
      }));
    }
    setAdding(false);
  }

  async function deleteRow(id: string) {
    if (!confirm('Διαγραφή αυτής της επαφής;')) return;
    const supabase = createClient();
    await supabase.from('listing_emergency_contacts').delete().eq('id', id);
    setRows(prev => prev.filter(r => r.id !== id));
    setDrafts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch, isDirty: true },
    }));
  }

  async function save(id: string) {
    const d = drafts[id];
    if (!d.phone.trim()) { alert('Συμπλήρωσε τον αριθμό τηλεφώνου.'); return; }
    if (!d.label_el.trim()) { alert('Συμπλήρωσε την ετικέτα στα ελληνικά.'); return; }

    setSaving(prev => ({ ...prev, [id]: true }));
    const supabase = createClient();
    const payload: Record<string, string | null> = {
      phone: d.phone.trim(),
      icon_key: d.icon_key,
      label_el: d.label_el.trim(),
      notes_el: d.notes_el.trim() || null,
    };
    const { error } = await supabase
      .from('listing_emergency_contacts')
      .update(payload)
      .eq('id', id);
    if (error) {
      alert('Σφάλμα: ' + error.message);
    } else {
      setDrafts(prev => ({
        ...prev,
        [id]: { ...prev[id], isDirty: false },
      }));
    }
    setSaving(prev => ({ ...prev, [id]: false }));
  }

  if (loading) {
    return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      {/* Legal info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex gap-3 text-sm text-amber-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p>
            <strong>Νομική ενημέρωση</strong>: Στην Ελλάδα η ενημέρωση των επισκεπτών για τηλέφωνα
            έκτακτης ανάγκης θεωρείται καλή πρακτική (Ν. 4276/2014, Ν. 4179/2013,
            κανονισμοί πυρασφάλειας). Στη σελίδα σου εμφανίζονται ήδη <strong>αυτόματα</strong> τα
            βασικά: <strong>112</strong> (EU), <strong>100</strong> (Αστυνομία),
            <strong> 166</strong> (ΕΚΑΒ), <strong>199</strong> (Πυροσβεστική),
            <strong> 108</strong> (Λιμενικό), <strong>10135</strong> (Δηλητηριάσεις).
          </p>
          <p>
            Εδώ πρόσθεσε <strong>τοπικά τηλέφωνα</strong>: το αστυνομικό τμήμα της περιοχής,
            το πλησιέστερο ιατρείο / νοσοκομείο / φαρμακείο, ένα τοπικό ταξί,
            τον δικό σου αριθμό ως οικοδεσπότη.
          </p>
        </div>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          Δεν έχεις προσθέσει τοπικές επαφές.
        </div>
      )}

      <div className="space-y-3">
        {rows.map((row, idx) => {
          const d = drafts[row.id];
          if (!d) return null;
          const IconComp = ICONS.find(i => i.key === d.icon_key)?.Icon || AlertTriangle;

          return (
            <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600">
                  <IconComp className="w-4 h-4" />
                </span>
                <span className="text-xs text-gray-500">#{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteRow(row.id)}
                  className="ml-auto p-1 rounded hover:bg-red-50 text-red-500"
                  title="Διαγραφή"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Icon / type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Τύπος</label>
                  <select
                    value={d.icon_key}
                    onChange={(e) => updateDraft(row.id, { icon_key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {ICONS.map(i => (
                      <option key={i.key} value={i.key}>{i.label}</option>
                    ))}
                  </select>
                </div>

                {/* Label */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ετικέτα (ελληνικά)</label>
                  <input
                    type="text"
                    value={d.label_el}
                    onChange={(e) => updateDraft(row.id, { label_el: e.target.value })}
                    placeholder="π.χ. Αστυνομικό Τμήμα Κασσανδρείας"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Τηλέφωνο</label>
                  <input
                    type="tel"
                    value={d.phone}
                    onChange={(e) => updateDraft(row.id, { phone: e.target.value })}
                    placeholder="π.χ. 23740 22222"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Σημειώσεις <span className="text-gray-400 font-normal">(προαιρετικό)</span>
                  </label>
                  <input
                    type="text"
                    value={d.notes_el}
                    onChange={(e) => updateDraft(row.id, { notes_el: e.target.value })}
                    placeholder="π.χ. 24ωρη λειτουργία, 3 χλμ από το κατάλυμα"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <div className="ml-auto flex items-center gap-2">
                  {d.isDirty && <span className="text-xs text-amber-700">Μη αποθηκευμένες αλλαγές</span>}
                  <button
                    type="button"
                    onClick={() => save(row.id)}
                    disabled={saving[row.id] || !d.isDirty}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40"
                  >
                    {saving[row.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Αποθήκευση
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={adding}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50"
      >
        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Προσθήκη επαφής
      </button>
    </div>
  );
}
