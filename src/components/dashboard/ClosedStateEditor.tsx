'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Wand2, Check, Lock, LockOpen } from 'lucide-react';

interface State {
  is_closed: boolean;
  reopening_date: string;      // YYYY-MM-DD or ''
  closed_reason_el: string;
}

interface Props {
  listingId: string;
  canTranslate?: boolean;
}

export function ClosedStateEditor({ listingId, canTranslate = false }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<State>({
    is_closed: false, reopening_date: '', closed_reason_el: '',
  });

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listings')
      .select('is_closed, reopening_date, closed_reason_el')
      .eq('id', listingId)
      .single();
    if (data) {
      setState({
        is_closed: !!data.is_closed,
        reopening_date: data.reopening_date || '',
        closed_reason_el: data.closed_reason_el || '',
      });
    }
    setLoading(false);
  }

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function translate() {
    if (!state.closed_reason_el.trim()) { alert('Γράψε πρώτα την αιτιολογία στα ελληνικά.'); return; }
    setTranslating(true);
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: 'el', fields: { closed_reason: state.closed_reason_el } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const flat: Record<string, string> = {};
      Object.entries((data.closed_reason || {}) as Record<string, string>).forEach(([k, v]) => {
        flat[`closed_reason_${k}`] = v;
      });
      setTranslated(flat);
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setTranslating(false);
    }
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const payload: Record<string, string | boolean | null> = {
      is_closed: state.is_closed,
      reopening_date: state.reopening_date || null,
      closed_reason_el: state.closed_reason_el.trim() || null,
      ...translated,
    };
    const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
    if (error) alert('Σφάλμα: ' + error.message);
    else { setDirty(false); setTranslated({}); }
    setSaving(false);
  }

  if (loading) {
    return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;
  }

  const hasTranslated = Object.keys(translated).length > 0;

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <label
        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
          state.is_closed
            ? 'bg-amber-50 border-amber-300'
            : 'bg-green-50 border-green-200 hover:bg-green-100'
        }`}
      >
        <input
          type="checkbox"
          checked={state.is_closed}
          onChange={(e) => update('is_closed', e.target.checked)}
          className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500"
        />
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${
          state.is_closed ? 'bg-amber-200 text-amber-700' : 'bg-green-200 text-green-700'
        }`}>
          {state.is_closed ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
        </span>
        <div className="flex-1">
          <div className="font-medium text-gray-900 text-sm">
            {state.is_closed ? 'Κλειστό προσωρινά' : 'Ανοιχτό — δέχεται κρατήσεις'}
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            {state.is_closed
              ? 'Στη δημόσια σελίδα εμφανίζεται banner ότι το κατάλυμα δεν δέχεται κρατήσεις αυτήν την περίοδο.'
              : 'Το κατάλυμα εμφανίζεται κανονικά σε όλους τους επισκέπτες.'}
          </div>
        </div>
      </label>

      {/* Extra fields — only relevant when closed */}
      {state.is_closed && (
        <div className="pl-4 border-l-2 border-amber-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ημερομηνία επαναλειτουργίας <span className="text-gray-400">(προαιρετικό)</span>
            </label>
            <input
              type="date"
              value={state.reopening_date}
              onChange={(e) => update('reopening_date', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Αν την ορίσεις, εμφανίζεται στους επισκέπτες ως «Επαναλειτουργεί την X».
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600">
                Αιτιολογία <span className="text-gray-400">(προαιρετικό, ελληνικά)</span>
              </label>
              {canTranslate && (
                <button type="button" onClick={translate} disabled={translating || !state.closed_reason_el.trim()}
                  className="text-xs flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40">
                  {translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  Μετάφραση με AI
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={state.closed_reason_el}
              onChange={(e) => update('closed_reason_el', e.target.value)}
              placeholder="π.χ. Ανακαίνιση — επανερχόμαστε Απρίλιο 2026"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {canTranslate && hasTranslated && (
              <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Μεταφράστηκε σε 6 γλώσσες
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        {dirty && <span className="text-xs text-amber-700">Μη αποθηκευμένες αλλαγές</span>}
        <button type="button" onClick={save} disabled={saving || !dirty}
          className="text-sm flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση
        </button>
      </div>
    </div>
  );
}
