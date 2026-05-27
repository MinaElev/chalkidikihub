'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Save, Loader2, CheckCircle2 } from 'lucide-react';

const AREAS = [
  { value: 'kassandra', label: 'Κασσάνδρα' },
  { value: 'sithonia', label: 'Σιθωνία' },
  { value: 'athos', label: 'Άθως' },
  { value: 'mainland', label: 'Ενδοχώρα' },
];

export default function BroadcastSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [opted_out, setOptedOut] = useState(false);
  const [max_per_week, setMaxPerWeek] = useState(10);
  const [areas, setAreas] = useState<string[]>([]);
  const [stats, setStats] = useState({ received_last_week: 0 });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/availability-broadcast-settings');
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setOptedOut(!!json.settings.opted_out);
      setMaxPerWeek(json.settings.max_per_week ?? 10);
      setAreas(Array.isArray(json.settings.areas) ? json.settings.areas : []);
      setStats(json.stats || { received_last_week: 0 });
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/availability-broadcast-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opted_out, max_per_week, areas }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  function toggleArea(a: string) {
    setAreas(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Αιτήματα διαθεσιμότητας</h1>
      <p className="text-gray-600 mb-6">
        Όταν επισκέπτες ζητούν διαθεσιμότητα σε ένα πόδι, ειδοποιούμε ιδιοκτήτες με ταιριαστά καταλύματα. Ρύθμισε εδώ τι λαμβάνεις.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-900">
        Έλαβες <strong>{stats.received_last_week}</strong> αιτήματα την τελευταία εβδομάδα.
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
        {/* Master toggle */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {opted_out ? (
              <BellOff className="w-5 h-5 text-gray-400 mt-0.5" />
            ) : (
              <Bell className="w-5 h-5 text-emerald-600 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-gray-900">Λαμβάνω αιτήματα διαθεσιμότητας</div>
              <div className="text-sm text-gray-500">Απενεργοποίηση = δεν θα παίρνεις κανένα email αιτημάτων.</div>
            </div>
          </div>
          <button
            onClick={() => setOptedOut(v => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              !opted_out ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                !opted_out ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Max per week */}
        <div className={opted_out ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block">
            <div className="font-semibold text-gray-900 mb-1">Μέγιστα αιτήματα/εβδομάδα</div>
            <div className="text-sm text-gray-500 mb-2">Όταν το ξεπεράσεις, σταματάμε να σου στέλνουμε νέα μέχρι την επόμενη εβδομάδα.</div>
            <input
              type="number"
              min={0}
              max={50}
              value={max_per_week}
              onChange={e => setMaxPerWeek(Math.max(0, Math.min(50, parseInt(e.target.value, 10) || 0)))}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg"
            />
          </label>
        </div>

        {/* Areas */}
        <div className={opted_out ? 'opacity-50 pointer-events-none' : ''}>
          <div className="font-semibold text-gray-900 mb-1">Πόδια που με ενδιαφέρουν</div>
          <div className="text-sm text-gray-500 mb-3">Αν δεν επιλέξεις κανένα, λαμβάνεις αιτήματα για όλα τα πόδια όπου έχεις καταλύματα.</div>
          <div className="grid grid-cols-2 gap-2">
            {AREAS.map(a => (
              <label key={a.value} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={areas.includes(a.value)}
                  onChange={() => toggleArea(a.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">{a.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Αποθήκευση...
          </>
        ) : saved ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Αποθηκεύτηκε
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Αποθήκευση
          </>
        )}
      </button>
    </div>
  );
}
