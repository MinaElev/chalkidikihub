'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Waves, CheckCircle, AlertTriangle } from 'lucide-react';

const AREAS = [
  { value: 'kassandra', label: 'Κασσάνδρα' },
  { value: 'sithonia', label: 'Σιθωνία' },
  { value: 'athos', label: 'Άθως' },
  { value: 'mainland', label: 'Ενδοχώρα' },
];

export default function AIImportPage() {
  const [type, setType] = useState('beaches');
  const [area, setArea] = useState('kassandra');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number; total: number; errors: string[] } | null>(null);
  const [error, setError] = useState('');

  async function handleImport() {
    if (!confirm(`Εισαγωγή ${count} ${type} για ${area} μέσω AI;\n\nΤο AI θα δημιουργήσει πραγματικά δεδομένα και θα τα αποθηκεύσει στη βάση.`)) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, area, count }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-900">AI Data Import</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Χρησιμοποιήστε AI για να γεμίσετε τη βάση με πραγματικά δεδομένα. Τα data δημιουργούνται από GPT-4
        και εισάγονται αυτόματα. Ελέγξτε τα μετά στις αντίστοιχες σελίδες διαχείρισης.
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">Import ολοκληρώθηκε!</p>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p>Εισήχθησαν: <strong>{result.inserted}</strong></p>
            <p>Παραλείφθηκαν (ήδη υπάρχουν): <strong>{result.skipped}</strong></p>
            <p>Σύνολο AI: <strong>{result.total}</strong></p>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 p-2 bg-white rounded-lg">
              <p className="text-xs font-medium text-red-700">Σφάλματα:</p>
              {result.errors.map((err, i) => <p key={i} className="text-xs text-red-600 font-mono">{err}</p>)}
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
        {/* Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Τύπος δεδομένων</label>
          <div className="flex gap-2">
            <button onClick={() => setType('beaches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'beaches' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <Waves className="w-4 h-4" /> Παραλίες
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Περισσότεροι τύποι σύντομα (εστιατόρια, δραστηριότητες)</p>
        </div>

        {/* Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Περιοχή</label>
          <div className="grid grid-cols-2 gap-2">
            {AREAS.map(a => (
              <button key={a.value} onClick={() => setArea(a.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  area === a.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Πόσα να δημιουργήσει;</label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map(n => (
              <button key={n} onClick={() => setCount(n)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  count === n ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-700">
            <p className="font-medium">Σημαντικό:</p>
            <p>Τα δεδομένα δημιουργούνται από AI. Ελέγξτε τα GPS coordinates και τις περιγραφές μετά την εισαγωγή. Τα duplicates παραλείπονται αυτόματα.</p>
          </div>
        </div>

        {/* Import button */}
        <button onClick={handleImport} disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl disabled:opacity-50 transition-all">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI δημιουργεί {count} {type}... (20-40 δευτ.)
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Εισαγωγή {count} {AREAS.find(a => a.value === area)?.label} {type}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
