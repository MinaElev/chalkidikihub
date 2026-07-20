'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  BarChart3, Play, RefreshCw, Send, Loader2, CheckCircle, AlertTriangle,
  Eye, Mail, ChevronDown, ChevronRight, TrendingUp, TrendingDown, MousePointerClick, Users, Globe,
} from 'lucide-react';

interface QueryLine { query: string; impressions: number; clicks: number }
interface ListingLine {
  listing_id: string; slug: string; title: string;
  impressions: number; clicks: number; inquiries: number;
  prevImpressions: number; impressionsPct: number | null; topQueries: QueryLine[];
}
interface OwnerReport {
  ownerId: string; email: string; name: string; listings: ListingLine[];
  totalImpressions: number; totalClicks: number; totalInquiries: number;
  totalPct: number | null; alreadySentAt: string | null;
}
interface TopCountry { code: string; flag: string; name: string; impressions: number; pct: number }
interface SiteStats { totalImpressions: number; totalClicks: number; countries: TopCountry[] }
interface PreviewData {
  month: string; monthLabel: string; ownerCount: number;
  totals: { impressions: number; clicks: number; inquiries: number; pendingOwners: number };
  site: SiteStats;
  owners: OwnerReport[];
}

function defaultMonth(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.toISOString().slice(0, 7);
}

function Pct({ p }: { p: number | null }) {
  if (p === null) return <span className="text-slate-400 text-xs">νέο</span>;
  if (p > 0) return <span className="text-green-600 font-semibold text-xs inline-flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{p}%</span>;
  if (p < 0) return <span className="text-red-600 font-semibold text-xs inline-flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{p}%</span>;
  return <span className="text-slate-400 text-xs">0%</span>;
}

export default function MonthlyReportPage() {
  const [month, setMonth] = useState(defaultMonth());
  const [boost, setBoost] = useState(0);
  const [running, setRunning] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ sent: number; failed: number; skipped: number; errors?: string[] } | null>(null);

  const selectableOwners = useMemo(() => preview?.owners ?? [], [preview]);
  const allSelected = selectableOwners.length > 0 && selected.size === selectableOwners.length;

  const selectedPending = useMemo(
    () => selectableOwners.filter(o => selected.has(o.ownerId) && !o.alreadySentAt).length,
    [selectableOwners, selected],
  );

  async function runSnapshot() {
    setRunning(true); setError(''); setNotice(''); setResult(null);
    try {
      const res = await fetch('/api/admin/monthly-report/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Αποτυχία snapshot');
      setNotice(`Snapshot ολοκληρώθηκε: ${data.upserted} καταλύματα καταγράφηκαν${data.gscError ? ` (⚠️ GSC: ${data.gscError})` : ''}. Φόρτωσε το preview.`);
      await loadPreview();
    } catch (err) {
      setError((err as Error).message);
    }
    setRunning(false);
  }

  async function loadPreview() {
    setLoadingPreview(true); setError(''); setResult(null);
    try {
      const res = await fetch(`/api/admin/monthly-report/preview?month=${month}&boost=${boost}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Αποτυχία preview');
      setPreview(data);
      // Pre-select everyone not already sent.
      setSelected(new Set(data.owners.filter((o: OwnerReport) => !o.alreadySentAt).map((o: OwnerReport) => o.ownerId)));
    } catch (err) {
      setError((err as Error).message);
      setPreview(null);
    }
    setLoadingPreview(false);
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(selectableOwners.map(o => o.ownerId)));
  }
  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }
  function toggleExpand(id: string) {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  }

  async function sendTest() {
    setError(''); setNotice(''); setResult(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError('Δεν βρέθηκε το email σας.'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/admin/monthly-report/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, boost, testTo: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Αποτυχία test');
      setNotice(`Δοκιμαστικό email στάλθηκε στο ${data.sentTo} (δείγμα: ${data.sampleOwner}).`);
    } catch (err) {
      setError((err as Error).message);
    }
    setSending(false);
  }

  async function sendReal() {
    if (selected.size === 0) { setError('Επιλέξτε τουλάχιστον έναν ιδιοκτήτη.'); return; }
    if (!confirm(`Αποστολή μηνιαίας αναφοράς σε ${selectedPending} ιδιοκτήτες για ${preview?.monthLabel};${boost > 0 ? `\n\n➕ Με boost +${boost} εμφανίσεις ανά κατάλυμα.` : ''}`)) return;
    setSending(true); setError(''); setNotice(''); setResult(null);
    try {
      const res = await fetch('/api/admin/monthly-report/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, boost, ownerIds: [...selected] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Αποτυχία αποστολής');
      setResult({ sent: data.sent, failed: data.failed, skipped: data.skipped, errors: data.errors });
      await loadPreview(); // refresh "already sent" badges
    } catch (err) {
      setError((err as Error).message);
    }
    setSending(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-sky-600" />
        <h1 className="text-2xl font-bold text-gray-900">Μηνιαία Αναφορά Ιδιοκτητών</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
      {notice && <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-800 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 shrink-0" />{notice}</div>}

      {result && (
        <div className={`mb-6 p-4 border rounded-xl ${result.sent > 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2">
            {result.sent > 0 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
            <p className="font-semibold text-gray-800">
              Στάλθηκαν: {result.sent}
              {result.failed > 0 && <span className="text-red-600">, {result.failed} απέτυχαν</span>}
              {result.skipped > 0 && <span className="text-slate-500">, {result.skipped} παραλείφθηκαν (ήδη σταλμένα)</span>}
            </p>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 text-xs text-red-600 font-mono space-y-0.5">{result.errors.map((e, i) => <p key={i}>{e}</p>)}</div>
          )}
        </div>
      )}

      {/* Step 1 — controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Μήνας</label>
            <input type="month" value={month} onChange={e => { setMonth(e.target.value); setPreview(null); setResult(null); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-amber-600 mb-1">➕ Επιπλέον εμφανίσεις / κατάλυμα</label>
            <input type="number" min={0} step={1} value={boost}
              onChange={e => { setBoost(Math.max(0, Math.floor(Number(e.target.value) || 0))); setPreview(null); setResult(null); }}
              className="w-40 px-3 py-2 border border-amber-300 bg-amber-50 rounded-lg text-sm focus:ring-2 focus:ring-amber-500" />
          </div>
          <button onClick={runSnapshot} disabled={running || sending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg disabled:opacity-50">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {running ? 'Τρέχει…' : '1. Υπολογισμός νούμερων (snapshot)'}
          </button>
          <button onClick={loadPreview} disabled={loadingPreview || running}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg disabled:opacity-50">
            {loadingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            2. Προβολή αποτελεσμάτων
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Το «snapshot» τραβάει εμφανίσεις/κλικ από το Google Search Console + αιτήματα για τον μήνα και τα κλειδώνει. Μετά δες τι θα σταλεί ανά ιδιοκτήτη και στείλε.
          {boost > 0 && <span className="text-amber-600"> · Το boost <strong>+{boost}</strong> προστίθεται στις εμφανίσεις κάθε καταλύματος (μόνο στην εμφάνιση — δεν αλλάζει τα αποθηκευμένα δεδομένα).</span>}
        </p>
      </div>

      {/* Step 2 — preview */}
      {preview && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <Stat icon={Users} label="Ιδιοκτήτες" value={preview.ownerCount} sub={`${preview.totals.pendingOwners} εκκρεμούν`} />
            <Stat icon={Eye} label="Εμφανίσεις" value={preview.totals.impressions} />
            <Stat icon={MousePointerClick} label="Κλικ" value={preview.totals.clicks} />
            <Stat icon={Mail} label="Αιτήματα" value={preview.totals.inquiries} />
          </div>

          {/* Site-wide + countries (what the email's "Όλο το ChalkidikiHub" section shows) */}
          {preview.site && preview.site.totalImpressions > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <div className="bg-gradient-to-br from-sky-900 to-sky-700 text-white rounded-xl p-5">
                <div className="text-[11px] uppercase tracking-wide text-sky-200 mb-1">Όλο το site · {preview.monthLabel}</div>
                <div className="text-3xl font-bold tabular-nums">{preview.site.totalImpressions.toLocaleString('el-GR')}</div>
                <div className="text-sm text-sky-100 mt-1">εμφανίσεις σε αναζητήσεις · {preview.site.totalClicks.toLocaleString('el-GR')} επισκέψεις</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 text-gray-400 mb-3"><Globe className="w-4 h-4" /><span className="text-xs">Χώρες επισκεπτών</span></div>
                <div className="space-y-2">
                  {preview.site.countries.length === 0 && <p className="text-xs text-gray-400">Δεν υπάρχουν δεδομένα χωρών (GSC).</p>}
                  {preview.site.countries.map(c => (
                    <div key={c.code}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-800">{c.flag} {c.name}</span>
                        <span className="font-semibold text-sky-700 tabular-nums">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-sky-100 rounded-full mt-1"><div className="h-1.5 bg-sky-600 rounded-full" style={{ width: `${Math.max(c.pct, 2)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {preview.owners.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">
              Δεν υπάρχουν δεδομένα για {preview.monthLabel}. Τρέξε πρώτα το snapshot (κουμπί 1).
            </div>
          ) : (
            <>
              {/* Send bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4 sticky top-20 z-10 bg-slate-50/95 backdrop-blur border border-gray-200 rounded-xl p-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded text-sky-600 focus:ring-sky-500" />
                  Επιλογή όλων ({selected.size}/{selectableOwners.length})
                </label>
                <div className="flex-1" />
                <button onClick={sendTest} disabled={sending}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-sky-300 text-sky-700 hover:bg-sky-50 text-sm font-medium rounded-lg disabled:opacity-50">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  Δοκιμαστικό σε εμένα
                </button>
                <button onClick={sendReal} disabled={sending || selected.size === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  3. Αποστολή ({selectedPending})
                </button>
              </div>

              {/* Owner list */}
              <div className="space-y-2">
                {preview.owners.map(o => {
                  const open = expanded.has(o.ownerId);
                  return (
                    <div key={o.ownerId} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <input type="checkbox" checked={selected.has(o.ownerId)} onChange={() => toggleOne(o.ownerId)}
                          className="rounded text-sky-600 focus:ring-sky-500" />
                        <button onClick={() => toggleExpand(o.ownerId)} className="text-gray-400 hover:text-gray-600">
                          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{o.name || o.email}</p>
                          <p className="text-xs text-gray-400 truncate">{o.email} · {o.listings.length} {o.listings.length === 1 ? 'κατάλυμα' : 'καταλύματα'}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-right shrink-0">
                          <div><div className="text-sm font-bold text-sky-700 tabular-nums">{o.totalImpressions.toLocaleString('el-GR')}</div><div className="text-[10px] text-gray-400">εμφαν. <Pct p={o.totalPct} /></div></div>
                          <div><div className="text-sm font-bold text-gray-800 tabular-nums">{o.totalClicks.toLocaleString('el-GR')}</div><div className="text-[10px] text-gray-400">κλικ</div></div>
                          <div><div className="text-sm font-bold text-green-700 tabular-nums">{o.totalInquiries.toLocaleString('el-GR')}</div><div className="text-[10px] text-gray-400">αιτήμ.</div></div>
                        </div>
                        {o.alreadySentAt && (
                          <span className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-medium" title={new Date(o.alreadySentAt).toLocaleString('el')}>στάλθηκε</span>
                        )}
                      </div>

                      {open && (
                        <div className="border-t border-gray-100 bg-slate-50/50 px-4 py-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-[11px] uppercase tracking-wide text-gray-400 text-left">
                                <th className="py-1 font-medium">Κατάλυμα</th>
                                <th className="py-1 font-medium text-right">Εμφαν.</th>
                                <th className="py-1 font-medium text-right">vs προηγ.</th>
                                <th className="py-1 font-medium text-right">Κλικ</th>
                                <th className="py-1 font-medium text-right">Αιτήμ.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {o.listings.map(l => (
                                <tr key={l.listing_id} className="border-t border-gray-100 align-top">
                                  <td className="py-2 pr-2">
                                    <div className="font-medium text-gray-800">{l.title}</div>
                                    {l.topQueries.length > 0 && (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {l.topQueries.slice(0, 4).map((q, i) => (
                                          <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{q.query}</span>
                                        ))}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-2 text-right tabular-nums text-gray-800">{l.impressions.toLocaleString('el-GR')}</td>
                                  <td className="py-2 text-right"><Pct p={l.impressionsPct} /></td>
                                  <td className="py-2 text-right tabular-nums text-gray-600">{l.clicks.toLocaleString('el-GR')}</td>
                                  <td className="py-2 text-right tabular-nums text-green-700 font-medium">{l.inquiries.toLocaleString('el-GR')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs">{label}</span></div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{value.toLocaleString('el-GR')}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}
