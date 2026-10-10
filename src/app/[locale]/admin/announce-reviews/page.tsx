'use client';

import { useEffect, useState } from 'react';
import { Star, Send, Loader2, CheckCircle, AlertTriangle, FlaskConical, Home } from 'lucide-react';

interface OwnerRow {
  ownerId: string;
  email: string;
  name: string;
  listings: string[];
}

export default function AnnounceReviewsPage() {
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [testTo, setTestTo] = useState('');
  const [sending, setSending] = useState<'test' | 'real' | null>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/announce-reviews')
      .then(r => r.json())
      .then(data => {
        if (data.owners) {
          setOwners(data.owners);
          setSubject(data.subject || '');
          setSelected(new Set(data.owners.map((o: OwnerRow) => o.ownerId)));
        } else {
          setError(data.error || 'Αποτυχία φόρτωσης');
        }
      })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function send(test: boolean) {
    setError('');
    setResult('');
    if (test && !/\S+@\S+\.\S+/.test(testTo)) {
      setError('Δώστε έγκυρο email για το test.');
      return;
    }
    if (!test) {
      if (selected.size === 0) { setError('Δεν έχετε επιλέξει παραλήπτες.'); return; }
      if (!confirm(`Οριστική αποστολή της ανακοίνωσης σε ${selected.size} ιδιοκτήτες;`)) return;
    }
    setSending(test ? 'test' : 'real');
    try {
      const res = await fetch('/api/admin/announce-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test ? { testTo } : { ownerIds: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Αποτυχία αποστολής');
      } else if (data.test) {
        setResult(`Test εστάλη στο ${data.sentTo} (δείγμα: ${data.sampleOwner}).`);
      } else {
        setResult(`Εστάλησαν ${data.sent} email${data.failed ? `, ${data.failed} απέτυχαν` : ''}.`);
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSending(null);
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
        <h1 className="text-2xl font-bold text-gray-900">Ανακοίνωση: Κριτικές καταλυμάτων</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Εξατομικευμένο email σε κάθε ιδιοκτήτη με δημοσιευμένο κατάλυμα — με απευθείας λινκ στη φόρμα
        κριτικής του καταλύματός του. Θέμα: <span className="font-medium text-gray-700">{subject}</span>
      </p>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
      {result && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" />{result}</div>}

      {/* Test send */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-600" />Δοκιμαστική αποστολή</h2>
        <div className="flex gap-2">
          <input type="email" value={testTo} onChange={e => setTestTo(e.target.value)}
            placeholder="το email σας"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
          <button onClick={() => send(true)} disabled={sending !== null}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {sending === 'test' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
            Στείλε test
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Στέλνει ένα δείγμα (με τα δεδομένα του πρώτου ιδιοκτήτη) μόνο στο email σας.</p>
      </div>

      {/* Recipients */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Παραλήπτες ({selected.size}/{owners.length})</h2>
          <button type="button"
            onClick={() => setSelected(selected.size === owners.length ? new Set() : new Set(owners.map(o => o.ownerId)))}
            className="text-xs text-primary-600 hover:underline">
            {selected.size === owners.length ? 'Αποεπιλογή όλων' : 'Επιλογή όλων'}
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {owners.map(o => (
            <label key={o.ownerId} className="flex items-center gap-3 py-2 px-1 cursor-pointer hover:bg-gray-50 rounded">
              <input type="checkbox" checked={selected.has(o.ownerId)}
                onChange={() => {
                  const next = new Set(selected);
                  if (next.has(o.ownerId)) next.delete(o.ownerId); else next.add(o.ownerId);
                  setSelected(next);
                }}
                className="rounded text-primary-600 focus:ring-primary-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{o.name || o.email}</p>
                <p className="text-xs text-gray-400 truncate">{o.email}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0" title={o.listings.join(', ')}>
                <Home className="w-3.5 h-3.5" />{o.listings.length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Real send */}
      <button onClick={() => send(false)} disabled={sending !== null || selected.size === 0}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl disabled:opacity-50">
        {sending === 'real' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        Αποστολή σε {selected.size} ιδιοκτήτες
      </button>
    </div>
  );
}
