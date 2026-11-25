'use client';

import { useMemo, useState } from 'react';
import { Loader2, Search, Send, Eye, X, CheckCircle, AlertTriangle, ChevronDown, MailQuestion } from 'lucide-react';
import type { OwnerResponseRate } from '@/lib/response-rates';

const BATCH = 20;
const RECENT_DAYS = 30;
const DAY = 86400000;

const AREA: Record<string, string> = { kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως', mainland: 'Ενδοχώρα' };
const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : '—');

function rateClass(rate: number) {
  if (rate < 25) return 'bg-red-100 text-red-800';
  if (rate < 50) return 'bg-amber-100 text-amber-800';
  return 'bg-green-100 text-green-800';
}

/**
 * Response rate per owner (mass availability requests + inquiries from a
 * listing's page) and a polite reminder to press "not available" instead of
 * leaving requests unanswered. The admin picks who gets it: by rate ceiling,
 * minimum requests, "the N lowest", or one by one.
 */
export function ResponseCampaign() {
  const [owners, setOwners] = useState<OwnerResponseRate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [maxRate, setMaxRate] = useState(30);
  const [minReceived, setMinReceived] = useState(5);
  const [includeList, setIncludeList] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [topN, setTopN] = useState(10);
  const [preview, setPreview] = useState<{ to: string; subject: string; html: string } | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<{ sent: number; failed: number; failedEmails: string[] } | null>(null);
  const [error, setError] = useState('');

  const recent = (o: OwnerResponseRate) => !!o.lastSentAt && Date.now() - new Date(o.lastSentAt).getTime() < RECENT_DAYS * DAY;

  /** Owners under the filters, lowest rate first. */
  const shown = useMemo(
    () => (owners || []).filter((o) => o.rate <= maxRate && o.received >= minReceived),
    [owners, maxRate, minReceived],
  );

  const stats = useMemo(() => {
    if (!owners?.length) return null;
    const received = owners.reduce((n, o) => n + o.received, 0);
    const answered = owners.reduce((n, o) => n + o.answered, 0);
    return { received, answered, rate: Math.round((answered / Math.max(1, received)) * 100) };
  }, [owners]);

  async function scan() {
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/admin/response-email');
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Σφάλμα');
      const list = j.owners as OwnerResponseRate[];
      setOwners(list);
      setSelected(new Set(list.filter((o) => o.rate <= maxRate && o.received >= minReceived && !recent(o)).map((o) => o.ownerId)));
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }

  /** Keep only the ticked owners that the filters still show. */
  function applyFilters(nextMax: number, nextMin: number) {
    setMaxRate(nextMax); setMinReceived(nextMin);
    if (!owners) return;
    setSelected(new Set(owners.filter((o) => o.rate <= nextMax && o.received >= nextMin && !recent(o)).map((o) => o.ownerId)));
  }

  async function showPreview(ownerId: string) {
    setPreviewing(ownerId); setError('');
    try {
      const res = await fetch(`/api/admin/response-email?preview=${encodeURIComponent(ownerId)}&list=${includeList ? 1 : 0}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Σφάλμα');
      setPreview(j);
    } catch (e) { setError((e as Error).message); }
    setPreviewing(null);
  }

  async function send() {
    const ids = shown.filter((o) => selected.has(o.ownerId)).map((o) => o.ownerId);
    if (!ids.length) return;
    if (!confirm(`Αποστολή email ανταπόκρισης σε ${ids.length} ιδιοκτήτες;`)) return;
    setSending(true); setError(''); setResult(null);
    setProgress({ done: 0, total: ids.length });
    const total = Math.ceil(ids.length / BATCH);
    let sent = 0, failed = 0;
    const failedEmails: string[] = [];
    try {
      for (let i = 0; i < total; i++) {
        const slice = ids.slice(i * BATCH, (i + 1) * BATCH);
        const res = await fetch('/api/admin/response-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerIds: slice, includeList, batchIndex: i, batchTotal: total }),
        });
        const j = await res.json();
        if (!res.ok) { setError(`${j.error || 'Αποτυχία'} (διακοπή στο πακέτο ${i + 1}/${total})`); break; }
        sent += j.sent || 0; failed += j.failed || 0;
        (j.results as { email: string; ok: boolean }[]).filter((r) => !r.ok).forEach((r) => failedEmails.push(r.email));
        setProgress({ done: Math.min((i + 1) * BATCH, ids.length), total: ids.length });
      }
      setResult({ sent, failed, failedEmails });
      await scan();
    } catch (e) { setError((e as Error).message); }
    setProgress(null);
    setSending(false);
  }

  const toggle = (set: Set<string>, id: string) => { const n = new Set(set); if (n.has(id)) n.delete(id); else n.add(id); return n; };
  const selectedShown = shown.filter((o) => selected.has(o.ownerId)).length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 shrink-0"><MailQuestion className="w-4 h-4" /></span>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900">Ανταπόκριση σε αιτήματα</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Υπολογίζει για κάθε ιδιοκτήτη σε πόσα αιτήματα απάντησε (μαζικά αιτήματα διαθεσιμότητας και αιτήματα από τη σελίδα του καταλύματος, τους τελευταίους 12 μήνες,
            όχι όσα στάλθηκαν τις τελευταίες 48 ώρες). Στέλνει σε όποιους διαλέξετε ένα ευγενικό email με το ποσοστό τους και την παράκληση να πατούν «Δεν είμαι διαθέσιμος».
          </p>
        </div>
        <button type="button" onClick={scan} disabled={loading || sending}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold disabled:opacity-50 shrink-0">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          {owners ? 'Νέος υπολογισμός' : 'Υπολογισμός'}
        </button>
      </div>

      {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">{error}</div>}

      {result && (
        <div className={`mb-3 p-3 rounded-lg border text-sm flex items-start gap-2 ${result.failed ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          {result.failed ? <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
          <div>
            <strong>{result.sent} στάλθηκαν</strong>
            {result.failed > 0 && <>, {result.failed} απέτυχαν ({result.failedEmails.join(', ')})</>}
          </div>
        </div>
      )}

      {progress && (
        <div className="mb-3">
          <div className="text-xs text-sky-800 mb-1">Αποστολή… {progress.done} / {progress.total}</div>
          <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden"><div className="h-full bg-sky-600 transition-all" style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }} /></div>
        </div>
      )}

      {owners && stats && (
        <>
          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-gray-50 p-2"><div className="text-lg font-bold text-gray-900 tabular-nums">{owners.length}</div><div className="text-[11px] text-gray-500">ιδιοκτήτες με αιτήματα</div></div>
            <div className="rounded-lg bg-gray-50 p-2"><div className="text-lg font-bold text-gray-900 tabular-nums">{stats.answered} / {stats.received}</div><div className="text-[11px] text-gray-500">απαντήσεις / αιτήματα</div></div>
            <div className="rounded-lg bg-gray-50 p-2"><div className="text-lg font-bold text-gray-900 tabular-nums">{stats.rate}%</div><div className="text-[11px] text-gray-500">συνολικό ποσοστό</div></div>
          </div>

          <div className="mb-3 grid gap-3 sm:grid-cols-2 text-xs">
            <label className="block">
              <span className="text-gray-700">Ποσοστό απαντήσεων έως <strong>{maxRate}%</strong></span>
              <input type="range" min={0} max={100} step={5} value={maxRate} onChange={(e) => applyFilters(Number(e.target.value), minReceived)} className="w-full accent-sky-600" />
            </label>
            <label className="block">
              <span className="text-gray-700">Τουλάχιστον <strong>{minReceived}</strong> αιτήματα</span>
              <input type="range" min={1} max={30} value={minReceived} onChange={(e) => applyFilters(maxRate, Number(e.target.value))} className="w-full accent-sky-600" />
            </label>
          </div>

          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-600">Εμφανίζονται <strong>{shown.length}</strong> · επιλεγμένοι <strong>{selectedShown}</strong></span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                Οι
                <input type="number" min={1} max={shown.length || 1} value={topN} onChange={(e) => setTopN(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 rounded border border-gray-300 px-1.5 py-0.5 text-xs" />
                <button type="button" className="text-sky-700 hover:underline"
                  onClick={() => setSelected(new Set(shown.slice(0, topN).map((o) => o.ownerId)))}>
                  με το χαμηλότερο ποσοστό
                </button>
              </span>
              <span className="text-gray-300">|</span>
              <button type="button" className="text-sky-700 hover:underline"
                onClick={() => setSelected(selectedShown === shown.length ? new Set() : new Set(shown.map((o) => o.ownerId)))}>
                {selectedShown === shown.length && shown.length ? 'Αποεπιλογή όλων' : 'Επιλογή όλων'}
              </button>
            </span>
          </div>

          {shown.length === 0 ? (
            <div className="p-4 text-center text-sm text-green-700 bg-green-50 rounded-lg">Κανένας ιδιοκτήτης δεν ταιριάζει στα φίλτρα.</div>
          ) : (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
              {shown.map((o) => {
                const isOpen = open.has(o.ownerId);
                return (
                  <div key={o.ownerId} className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <input type="checkbox" checked={selected.has(o.ownerId)} onChange={() => setSelected(toggle(selected, o.ownerId))} className="rounded text-sky-600" />
                      <span className={`w-12 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-bold tabular-nums ${rateClass(o.rate)}`}>{o.rate}%</span>
                      <button type="button" onClick={() => setOpen(toggle(open, o.ownerId))} className="flex-1 min-w-0 text-left">
                        <div className="text-sm font-medium text-gray-900 truncate">{o.name || o.email}</div>
                        <div className="text-[11px] text-gray-500 truncate">
                          {o.email} · απάντησε σε {o.answered} από {o.received}
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
                      <div className="mt-2 ml-7 space-y-1.5 text-xs text-gray-700">
                        <div>
                          <strong>Μαζικά αιτήματα:</strong> {o.mass.answered} απαντήσεις από {o.mass.received}
                          {o.mass.unavailable > 0 && <> ({o.mass.unavailable} «δεν είμαι διαθέσιμος»)</>}
                        </div>
                        {o.listings.map((l) => (
                          <div key={l.id}><strong>{l.title}:</strong> {l.answered} από {l.received} αιτήματα από τη σελίδα του</div>
                        ))}
                        {o.unanswered.length > 0 && (
                          <div className="text-gray-500">
                            Αναπάντητα (πιο πρόσφατα): {o.unanswered.map((u) => `${AREA[u.area || ''] || u.area} ${fmt(u.checkIn)}→${fmt(u.checkOut)}`).join(' · ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <label className="mt-3 flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" checked={includeList} onChange={(e) => setIncludeList(e.target.checked)} className="rounded text-sky-600" />
            Να μπαίνει στο email και η λίστα με τα αναπάντητα αιτήματα (έως 10, με κουμπί απάντησης όσο είναι ανοιχτά)
          </label>

          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={send} disabled={sending || selectedShown === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Αποστολή σε {selectedShown} ιδιοκτήτες
            </button>
            <span className="text-[11px] text-gray-500">Όσοι το έλαβαν τις τελευταίες {RECENT_DAYS} ημέρες δεν επιλέγονται αυτόματα.</span>
          </div>
        </>
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
