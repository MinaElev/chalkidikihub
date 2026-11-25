'use client';

import { useState } from 'react';
import { Loader2, Search, Send, Eye, X, CheckCircle, AlertTriangle, ChevronDown, Sparkles } from 'lucide-react';

type Issue = { key: string; weight: 'important' | 'helpful'; title: string; detail: string };
type Owner = {
  ownerId: string; email: string; name: string | null;
  listings: { id: string; title: string; issues: Issue[] }[];
  lastSentAt: string | null;
};

const BATCH = 20;
const RECENT_DAYS = 30;
const DAY = 86400000;

/**
 * Personalised quality reminder: finds published listings with gaps (photos,
 * description, map pin, contact, amenities…) and emails each owner exactly what
 * to fix, per listing. Owners mailed in the last 30 days start unticked.
 */
export function QualityCampaign() {
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<{ to: string; subject: string; html: string } | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<{ sent: number; failed: number; skipped: number; failedEmails: string[] } | null>(null);
  const [error, setError] = useState('');

  async function scan() {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/admin/quality-email');
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Σφάλμα');
      const list = j.owners as Owner[];
      setOwners(list);
      const recent = (o: Owner) => o.lastSentAt && Date.now() - new Date(o.lastSentAt).getTime() < RECENT_DAYS * DAY;
      setSelected(new Set(list.filter((o) => !recent(o)).map((o) => o.ownerId)));
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }

  async function showPreview(ownerId: string) {
    setPreviewing(ownerId); setError('');
    try {
      const res = await fetch(`/api/admin/quality-email?preview=${encodeURIComponent(ownerId)}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Σφάλμα');
      setPreview(j);
    } catch (e) { setError((e as Error).message); }
    setPreviewing(null);
  }

  async function send() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!confirm(`Αποστολή εξατομικευμένου email σε ${ids.length} ιδιοκτήτες;`)) return;
    setSending(true); setError(''); setResult(null);
    setProgress({ done: 0, total: ids.length });
    const total = Math.ceil(ids.length / BATCH);
    let sent = 0, failed = 0, skipped = 0;
    const failedEmails: string[] = [];
    try {
      for (let i = 0; i < total; i++) {
        const slice = ids.slice(i * BATCH, (i + 1) * BATCH);
        const res = await fetch('/api/admin/quality-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerIds: slice, batchIndex: i, batchTotal: total }),
        });
        const j = await res.json();
        if (!res.ok) { setError(`${j.error || 'Αποτυχία'} (διακοπή στο πακέτο ${i + 1}/${total})`); break; }
        sent += j.sent || 0; failed += j.failed || 0; skipped += j.skipped || 0;
        (j.results as { email: string; ok: boolean }[]).filter((r) => !r.ok).forEach((r) => failedEmails.push(r.email));
        setProgress({ done: Math.min((i + 1) * BATCH, ids.length), total: ids.length });
      }
      setResult({ sent, failed, skipped, failedEmails });
      await scan();
    } catch (e) { setError((e as Error).message); }
    setProgress(null);
    setSending(false);
  }

  const toggle = (set: Set<string>, id: string) => { const n = new Set(set); if (n.has(id)) n.delete(id); else n.add(id); return n; };
  const listingTotal = owners?.reduce((n, o) => n + o.listings.length, 0) || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 text-sky-600 shrink-0"><Sparkles className="w-4 h-4" /></span>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900">Ενημέρωση για ελλείψεις καταχωρήσεων</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Εντοπίζει δημοσιευμένα καταλύματα με λίγες φωτογραφίες, σύντομη περιγραφή, λάθος πινέζα, χωρίς στοιχεία επικοινωνίας ή παροχές κ.ά.,
            και στέλνει σε κάθε ιδιοκτήτη ένα προσωπικό email με το τι χρειάζεται <em>κάθε</em> κατάλυμά του.
          </p>
        </div>
        <button type="button" onClick={scan} disabled={loading || sending}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold disabled:opacity-50 shrink-0">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          {owners ? 'Νέος έλεγχος' : 'Εντοπισμός'}
        </button>
      </div>

      {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">{error}</div>}

      {result && (
        <div className={`mb-3 p-3 rounded-lg border text-sm flex items-start gap-2 ${result.failed ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          {result.failed ? <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
          <div>
            <strong>{result.sent} στάλθηκαν</strong>
            {result.failed > 0 && <>, {result.failed} απέτυχαν ({result.failedEmails.join(', ')})</>}
            {result.skipped > 0 && <>, {result.skipped} παραλείφθηκαν (διόρθωσαν ήδη τις ελλείψεις)</>}
          </div>
        </div>
      )}

      {progress && (
        <div className="mb-3">
          <div className="text-xs text-sky-800 mb-1">Αποστολή… {progress.done} / {progress.total}</div>
          <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden"><div className="h-full bg-sky-600 transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
        </div>
      )}

      {owners && (
        owners.length === 0 ? (
          <div className="p-4 text-center text-sm text-green-700 bg-green-50 rounded-lg">Κανένα δημοσιευμένο κατάλυμα δεν έχει ελλείψεις. 🎉</div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 mb-2 text-xs">
              <span className="text-gray-600"><strong>{owners.length}</strong> ιδιοκτήτες · <strong>{listingTotal}</strong> καταλύματα με ελλείψεις · επιλεγμένοι <strong>{selected.size}</strong></span>
              <button type="button" className="text-sky-700 hover:underline"
                onClick={() => setSelected(selected.size === owners.length ? new Set() : new Set(owners.map((o) => o.ownerId)))}>
                {selected.size === owners.length ? 'Αποεπιλογή όλων' : 'Επιλογή όλων'}
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
              {owners.map((o) => {
                const isOpen = open.has(o.ownerId);
                const issueCount = o.listings.reduce((n, l) => n + l.issues.length, 0);
                return (
                  <div key={o.ownerId} className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={selected.has(o.ownerId)} onChange={() => setSelected(toggle(selected, o.ownerId))} className="rounded text-sky-600" />
                      <button type="button" onClick={() => setOpen(toggle(open, o.ownerId))} className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium text-gray-900 truncate">{o.name || o.email}</div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {o.email} · {o.listings.length} {o.listings.length === 1 ? 'κατάλυμα' : 'καταλύματα'} · {issueCount} ελλείψεις
                          {o.lastSentAt && <span className="text-amber-700"> · στάλθηκε {new Date(o.lastSentAt).toLocaleDateString('el-GR')}</span>}
                        </div>
                      </button>
                      <button type="button" onClick={() => showPreview(o.ownerId)} disabled={previewing === o.ownerId}
                        className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline shrink-0">
                        {previewing === o.ownerId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}Προεπισκόπηση
                      </button>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && (
                      <div className="mt-2 ml-7 space-y-2">
                        {o.listings.map((l) => (
                          <div key={l.id}>
                            <div className="text-xs font-semibold text-gray-800">{l.title}</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {l.issues.map((i) => (
                                <span key={i.key} title={i.detail}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${i.weight === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-sky-50 text-sky-700'}`}>
                                  {i.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={send} disabled={sending || selected.size === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl disabled:opacity-50">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Αποστολή σε {selected.size} ιδιοκτήτες
              </button>
              <span className="text-[11px] text-gray-500">Όσοι έλαβαν το email τις τελευταίες {RECENT_DAYS} ημέρες είναι αποεπιλεγμένοι.</span>
            </div>
          </>
        )
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100">
              <div className="min-w-0 text-xs text-gray-600">
                <div><span className="text-gray-400">Προς:</span> {preview.to}</div>
                <div className="font-semibold text-gray-900 text-sm truncate"><span className="text-gray-400 font-normal">Θέμα:</span> {preview.subject}</div>
              </div>
              <button type="button" onClick={() => setPreview(null)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <iframe title="Προεπισκόπηση email" srcDoc={preview.html} sandbox="" className="w-full flex-1 min-h-[70vh] border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
