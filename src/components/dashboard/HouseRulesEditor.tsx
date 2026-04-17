'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Wand2, Check } from 'lucide-react';

type RuleOption<T extends string> = { value: T; label: string };

const SMOKING: RuleOption<'allowed' | 'outside' | 'not_allowed'>[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπεται' },
  { value: 'outside',     label: 'Μόνο εξωτερικά' },
  { value: 'allowed',     label: 'Επιτρέπεται' },
];
const PETS: RuleOption<'allowed' | 'on_request' | 'not_allowed'>[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπονται' },
  { value: 'on_request',  label: 'Κατόπιν συνεννόησης' },
  { value: 'allowed',     label: 'Επιτρέπονται' },
];
const PARTIES: RuleOption<'allowed' | 'not_allowed'>[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπονται' },
  { value: 'allowed',     label: 'Επιτρέπονται' },
];
const KIDS: RuleOption<'welcome' | 'on_request' | 'not_suitable'>[] = [
  { value: 'welcome',      label: 'Καλωσορίζονται' },
  { value: 'on_request',   label: 'Κατόπιν συνεννόησης' },
  { value: 'not_suitable', label: 'Μη κατάλληλο' },
];

interface State {
  check_in_time: string;
  check_out_time: string;
  rule_smoking: string;
  rule_pets: string;
  rule_parties: string;
  rule_kids: string;
  quiet_hours_from: string;
  quiet_hours_to: string;
  house_rules_extra_el: string;
}

export function HouseRulesEditor({ listingId, canTranslate = false }: { listingId: string; canTranslate?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [state, setState] = useState<State>({
    check_in_time: '15:00',
    check_out_time: '11:00',
    rule_smoking: 'not_allowed',
    rule_pets: 'not_allowed',
    rule_parties: 'not_allowed',
    rule_kids: 'welcome',
    quiet_hours_from: '',
    quiet_hours_to: '',
    house_rules_extra_el: '',
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listings')
      .select('check_in_time, check_out_time, rule_smoking, rule_pets, rule_parties, rule_kids, quiet_hours_from, quiet_hours_to, house_rules_extra_el')
      .eq('id', listingId)
      .single();
    if (data) {
      setState({
        check_in_time: data.check_in_time || '15:00',
        check_out_time: data.check_out_time || '11:00',
        rule_smoking: data.rule_smoking || 'not_allowed',
        rule_pets: data.rule_pets || 'not_allowed',
        rule_parties: data.rule_parties || 'not_allowed',
        rule_kids: data.rule_kids || 'welcome',
        quiet_hours_from: data.quiet_hours_from || '',
        quiet_hours_to: data.quiet_hours_to || '',
        house_rules_extra_el: data.house_rules_extra_el || '',
      });
    }
    setLoading(false);
  }

  function update<K extends keyof State>(key: K, value: State[K]) {
    setState(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function translate() {
    if (!state.house_rules_extra_el.trim()) {
      alert('Γράψε πρώτα τις επιπλέον σημειώσεις στα ελληνικά.');
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: 'el', fields: { house_rules_extra: state.house_rules_extra_el } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const flat: Record<string, string> = {};
      Object.entries((data.house_rules_extra || {}) as Record<string, string>).forEach(([k, v]) => {
        flat[`house_rules_extra_${k}`] = v;
      });
      setTranslations(flat);
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία μετάφρασης: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setTranslating(false);
    }
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const payload: Record<string, string | null> = {
      check_in_time: state.check_in_time || null,
      check_out_time: state.check_out_time || null,
      rule_smoking: state.rule_smoking,
      rule_pets: state.rule_pets,
      rule_parties: state.rule_parties,
      rule_kids: state.rule_kids,
      quiet_hours_from: state.quiet_hours_from || null,
      quiet_hours_to: state.quiet_hours_to || null,
      house_rules_extra_el: state.house_rules_extra_el.trim() || null,
      ...translations,
    };
    const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
    if (error) alert('Σφάλμα: ' + error.message);
    else {
      setDirty(false);
      setTranslations({});
    }
    setSaving(false);
  }

  if (loading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;

  const hasTranslations = Object.keys(translations).length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
          <input type="time" value={state.check_in_time} onChange={(e) => update('check_in_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
          <input type="time" value={state.check_out_time} onChange={(e) => update('check_out_time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        </div>
      </div>

      <RuleSelect label="Κάπνισμα" value={state.rule_smoking} onChange={(v) => update('rule_smoking', v)} options={SMOKING} />
      <RuleSelect label="Κατοικίδια" value={state.rule_pets} onChange={(v) => update('rule_pets', v)} options={PETS} />
      <RuleSelect label="Πάρτι / Εκδηλώσεις" value={state.rule_parties} onChange={(v) => update('rule_parties', v)} options={PARTIES} />
      <RuleSelect label="Παιδιά" value={state.rule_kids} onChange={(v) => update('rule_kids', v)} options={KIDS} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Κοινή ησυχία από</label>
          <input type="time" value={state.quiet_hours_from} onChange={(e) => update('quiet_hours_from', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">έως</label>
          <input type="time" value={state.quiet_hours_to} onChange={(e) => update('quiet_hours_to', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-600">Επιπλέον κανόνες / σημειώσεις (ελληνικά)</label>
          {canTranslate && (
            <button type="button" onClick={translate} disabled={translating || !state.house_rules_extra_el.trim()}
              className="text-xs flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40">
              {translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              Μετάφραση με AI
            </button>
          )}
        </div>
        <textarea rows={3} value={state.house_rules_extra_el} onChange={(e) => update('house_rules_extra_el', e.target.value)}
          placeholder="π.χ. Μέγιστος αριθμός επισκεπτών στο σπίτι, κανόνες για την πισίνα, ανακύκλωση κ.λπ."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
        {canTranslate && hasTranslations && <p className="text-xs text-green-700 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Μεταφράστηκε σε 6 γλώσσες</p>}
      </div>

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

function RuleSelect<T extends string>({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: T) => void; options: RuleOption<T>[];
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              value === o.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
