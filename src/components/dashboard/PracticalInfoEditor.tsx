'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Wand2, Check, Navigation, KeyRound, Wifi, ParkingCircle } from 'lucide-react';

interface State {
  how_to_reach_el: string;
  check_in_info_el: string;
  wifi_info_el: string;
  parking_info_el: string;
}

const FIELDS: { key: keyof State; label: string; placeholder: string; icon: React.ElementType }[] = [
  { key: 'how_to_reach_el', label: 'Πώς θα φτάσετε', placeholder: 'π.χ. Από το αεροδρόμιο Θεσσαλονίκης, 70 χλμ προς Κασσάνδρα. Μετά το Flogita...', icon: Navigation },
  { key: 'check_in_info_el', label: 'Οδηγίες check-in', placeholder: 'π.χ. Η είσοδος γίνεται μέσω keybox. Θα λάβετε κωδικό 24 ώρες πριν την άφιξη...', icon: KeyRound },
  { key: 'wifi_info_el', label: 'Wi-Fi', placeholder: 'π.χ. Δίκτυο: Villa_Maria · Κωδικός: δίνεται κατά την άφιξη', icon: Wifi },
  { key: 'parking_info_el', label: 'Στάθμευση', placeholder: 'π.χ. Δωρεάν ιδιωτικό parking για 2 αυτοκίνητα στην αυλή', icon: ParkingCircle },
];

export function PracticalInfoEditor({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<State>({ how_to_reach_el: '', check_in_info_el: '', wifi_info_el: '', parking_info_el: '' });
  const [translating, setTranslating] = useState<Record<string, boolean>>({});
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listings')
      .select('how_to_reach_el, check_in_info_el, wifi_info_el, parking_info_el')
      .eq('id', listingId)
      .single();
    if (data) {
      setState({
        how_to_reach_el: data.how_to_reach_el || '',
        check_in_info_el: data.check_in_info_el || '',
        wifi_info_el: data.wifi_info_el || '',
        parking_info_el: data.parking_info_el || '',
      });
    }
    setLoading(false);
  }

  function update(key: keyof State, val: string) {
    setState(prev => ({ ...prev, [key]: val }));
    setDirty(true);
  }

  async function translate(key: keyof State) {
    const source = state[key];
    if (!source.trim()) {
      alert('Γράψε πρώτα κείμενο στα ελληνικά.');
      return;
    }
    const fieldBase = key.replace(/_el$/, '');
    setTranslating(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: 'el', fields: { [fieldBase]: source } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const flat: Record<string, string> = { ...translated };
      Object.entries((data[fieldBase] || {}) as Record<string, string>).forEach(([loc, v]) => {
        flat[`${fieldBase}_${loc}`] = v;
      });
      setTranslated(flat);
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setTranslating(prev => ({ ...prev, [key]: false }));
    }
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const payload: Record<string, string | null> = {
      how_to_reach_el: state.how_to_reach_el.trim() || null,
      check_in_info_el: state.check_in_info_el.trim() || null,
      wifi_info_el: state.wifi_info_el.trim() || null,
      parking_info_el: state.parking_info_el.trim() || null,
      ...translated,
    };
    const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
    if (error) alert('Σφάλμα: ' + error.message);
    else {
      setDirty(false);
      setTranslated({});
    }
    setSaving(false);
  }

  if (loading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-4">
      {FIELDS.map(({ key, label, placeholder, icon: Icon }) => {
        const fieldBase = key.replace(/_el$/, '');
        const isTranslated = !!translated[`${fieldBase}_en`];
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <Icon className="w-3.5 h-3.5 text-indigo-500" />
                {label} <span className="text-gray-400">(ελληνικά)</span>
              </label>
              <button type="button" onClick={() => translate(key)} disabled={translating[key] || !state[key].trim()}
                className="text-xs flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40">
                {translating[key] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                Μετάφραση με AI
              </button>
            </div>
            <textarea rows={3} value={state[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
            {isTranslated && <p className="text-xs text-green-700 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Μεταφράστηκε σε 6 γλώσσες</p>}
          </div>
        );
      })}
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
