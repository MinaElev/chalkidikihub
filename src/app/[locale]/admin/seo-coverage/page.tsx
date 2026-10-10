'use client';

import { useCallback, useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import {
  Layers, Loader2, RefreshCw, ExternalLink, AlertCircle, AlertTriangle,
  CheckCircle, Info, ChevronDown, ChevronRight, Search,
} from 'lucide-react';

type Sample = {
  url: string;
  in_sitemap: boolean;
  page_fetch_state: string | null;
  google_canonical: string | null;
  user_canonical: string | null;
};
type StateRow = {
  state: string;
  category: string;
  severity: 'ok' | 'info' | 'warn' | 'critical';
  labelEl: string;
  adviceEl: string;
  count: number;
  in_sitemap_count: number;
  samples: Sample[];
};
type Coverage = {
  connected: boolean;
  last_run: { id: number; started_at: string; finished_at: string | null; status: string; urls_seeded: number; urls_inspected: number; quota_hit: boolean; error: string | null } | null;
  progress: { total: number; inspected: number; uninspected: number; pct: number };
  totals: { indexed: number; non_indexed: number; in_sitemap: number; in_sitemap_non_indexed: number };
  states: StateRow[];
  categories: Array<{ category: string; count: number }>;
  flags: Array<{ code: string; severity: string; count: number; messageEl: string }>;
};

const SEV = {
  ok: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', Icon: CheckCircle },
  info: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500', Icon: Info },
  warn: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', Icon: AlertTriangle },
  critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500', Icon: AlertCircle },
} as const;

function shortPath(url: string) { return url.replace(/^https?:\/\/[^/]+/, '') || '/'; }

export default function SeoCoveragePage() {
  const [data, setData] = useState<Coverage | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [onlySitemap, setOnlySitemap] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/gsc/coverage');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) { setError(String(e)); } finally { setLoading(false); }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  async function runInspect(seed = false) {
    setRunning(true); setError(null);
    try {
      const res = await fetch(`/api/admin/gsc/inspect?trigger=manual${seed ? '&seed=1' : ''}`, { method: 'POST' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      await reload();
    } catch (e) { setError(String(e)); } finally { setRunning(false); }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" /></div>;
  }

  if (data && !data.connected) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Layers className="w-6 h-6 text-primary-600" />Indexing Coverage</h1>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Δεν είναι συνδεδεμένο το GSC</h2>
          <p className="text-sm text-gray-600 mb-6">Σύνδεσε πρώτα το Search Console για να τραβήξουμε την κατάσταση ευρετηρίασης ανά URL.</p>
          <Link href="/admin/seo-gsc" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"><ExternalLink className="w-4 h-4" />Πήγαινε στη σύνδεση</Link>
        </div>
      </div>
    );
  }
  if (!data) return null;

  const last = data.last_run;
  const lastWhen = last?.finished_at ? new Date(last.finished_at).toLocaleString('el-GR') : (last ? 'σε εξέλιξη…' : 'ποτέ');
  const visibleStates = onlySitemap ? data.states.filter((s) => s.in_sitemap_count > 0) : data.states;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Layers className="w-6 h-6 text-primary-600" />Indexing Coverage</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ανακατασκευασμένη εικόνα «Page indexing» ανά URL (URL Inspection API).
            <span className="mx-2 text-gray-300">·</span>Last inspect: <span className="text-gray-800">{lastWhen}</span>
            {last?.quota_hit && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">quota reached</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => runInspect(true)} disabled={running} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-medium rounded-xl text-sm">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}Seed + inspect
          </button>
          <button onClick={() => runInspect(false)} disabled={running} className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}Inspect next batch
          </button>
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">{error}</div>}
      {last?.error && <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">Τελευταίο batch απέτυχε: <code className="text-xs">{last.error}</code></div>}

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-gray-900">Πρόοδος σάρωσης</span>
          <span className="text-gray-500 tabular-nums">{data.progress.inspected.toLocaleString('el-GR')} / {data.progress.total.toLocaleString('el-GR')} URLs ({data.progress.pct}%)</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${data.progress.pct}%` }} />
        </div>
        {data.progress.uninspected > 0 && (
          <p className="text-xs text-gray-500 mt-2">Απομένουν {data.progress.uninspected.toLocaleString('el-GR')} URLs. Λόγω quota (2.000/μέρα) η πλήρης σάρωση θέλει λίγες μέρες — μετά συντηρείται μόνη της.</p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Ευρετηριασμένες" value={data.totals.indexed} tone="ok" />
        <Card label="Μη ευρετηριασμένες" value={data.totals.non_indexed} tone="critical" />
        <Card label="Σε sitemap" value={data.totals.in_sitemap} tone="info" />
        <Card label="Σε sitemap & ΜΗ indexed" value={data.totals.in_sitemap_non_indexed} tone="warn" />
      </div>

      {/* Flags */}
      {data.flags.length > 0 && (
        <div className="space-y-2 mb-8">
          {data.flags.map((f) => {
            const s = SEV[(f.severity as keyof typeof SEV)] || SEV.info;
            const Icon = s.Icon;
            return (
              <div key={f.code} className={`flex items-start gap-3 rounded-2xl border ${s.border} ${s.bg} p-4`}>
                <Icon className={`w-5 h-5 shrink-0 ${s.text}`} />
                <div className="text-sm">
                  <span className={`font-bold ${s.text}`}>{f.count.toLocaleString('el-GR')}</span>
                  <span className="text-gray-700"> — {f.messageEl}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {data.progress.inspected === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-sm text-amber-800">
          Δεν έχει γίνει ακόμα καμία επιθεώρηση. Πάτα <strong>Seed + inspect</strong> για να χτίσουμε το URL-σύμπαν και να ξεκινήσει η σάρωση.
        </div>
      )}

      {/* Reasons breakdown */}
      {data.progress.inspected > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Ανάλυση ανά λόγο</h2>
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={onlySitemap} onChange={(e) => setOnlySitemap(e.target.checked)} className="rounded border-gray-300" />
              Μόνο URLs στο sitemap
            </label>
          </div>
          <div className="space-y-2">
            {visibleStates.map((st) => {
              const s = SEV[st.severity] || SEV.info;
              const open = expanded === st.state;
              return (
                <div key={st.state} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <button onClick={() => setExpanded(open ? null : st.state)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/50">
                    {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span className="flex-1 font-medium text-gray-900">{st.labelEl}</span>
                    {st.in_sitemap_count > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold tabular-nums">{st.in_sitemap_count.toLocaleString('el-GR')} σε sitemap</span>
                    )}
                    <span className="text-lg font-bold text-gray-900 tabular-nums ml-2">{st.count.toLocaleString('el-GR')}</span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      {st.adviceEl && <p className={`text-sm ${s.text} bg-gray-50 rounded-xl p-3 my-3`}>💡 {st.adviceEl}</p>}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead><tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                            <th className="py-2 pr-3">URL</th><th className="py-2 px-2">Sitemap;</th><th className="py-2 px-2">Fetch</th><th className="py-2 pl-2">Google canonical</th>
                          </tr></thead>
                          <tbody>
                            {st.samples.map((sm) => (
                              <tr key={sm.url} className="border-t border-gray-100 align-top">
                                <td className="py-2 pr-3"><a href={sm.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline break-all inline-flex items-center gap-1">{shortPath(sm.url)}<ExternalLink className="w-3 h-3 shrink-0" /></a></td>
                                <td className="py-2 px-2">{sm.in_sitemap ? '✓' : '—'}</td>
                                <td className="py-2 px-2 text-gray-500 text-xs">{sm.page_fetch_state || '—'}</td>
                                <td className="py-2 pl-2 text-gray-500 text-xs break-all">{sm.google_canonical && sm.google_canonical !== sm.url ? shortPath(sm.google_canonical) : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {st.count > st.samples.length && <p className="text-xs text-gray-400 mt-2">Δείγμα {st.samples.length} από {st.count.toLocaleString('el-GR')}.</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Card({ label, value, tone }: { label: string; value: number; tone: keyof typeof SEV }) {
  const s = SEV[tone];
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
      <div className={`text-xs font-medium mb-1 ${s.text}`}>{label}</div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{value.toLocaleString('el-GR')}</div>
    </div>
  );
}
