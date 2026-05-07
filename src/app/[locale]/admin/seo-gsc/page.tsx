'use client';

import { useEffect, useState, useCallback } from 'react';
import { BarChart3, Loader2, ExternalLink, RefreshCw, Target, TrendingDown, AlertCircle, CheckCircle, Search } from 'lucide-react';

type Row = {
  query?: string;
  page?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

type Status = {
  connected: boolean;
  email: string | null;
  last_run: { id: number; started_at: string; finished_at: string | null; status: string; pages_synced: number; queries_synced: number; error: string | null } | null;
  summary: {
    total_clicks: number;
    total_impressions: number;
    overall_ctr: number;
    overall_position: number;
    page_count: number;
    query_count: number;
  };
  top_pages: Row[];
  top_queries: Row[];
  opportunities: Row[];
  ctr_dive: Row[];
};

function fmtPct(n: number) { return `${(n * 100).toFixed(1)}%`; }
function fmtPos(n: number) { return n > 0 ? n.toFixed(1) : '—'; }
function shortPath(url: string) { return url.replace(/^https?:\/\/[^/]+/, '') || '/'; }

export default function SeoGscPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/gsc/status');
      if (!res.ok) throw new Error(`status_failed ${res.status}`);
      setStatus(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    // Read URL params for connect feedback
    const u = new URL(window.location.href);
    const err = u.searchParams.get('error');
    if (err) setError(`OAuth error: ${err}`);
  }, [reload]);

  async function runSync() {
    setSyncing(true); setError(null);
    try {
      const res = await fetch('/api/admin/gsc/sync?trigger=manual', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `sync_failed ${res.status}`);
      await reload();
    } catch (e) {
      setError(String(e));
    } finally {
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
      </div>
    );
  }

  // Not yet connected
  if (status && !status.connected) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          SEO – Google Search Console
        </h1>
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">{error}</div>
        )}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Δεν είναι ακόμα συνδεδεμένο</h2>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            Συνδέσου με τον Google account που έχει το chalkidikihub.gr verified στο Search Console για να δεις queries, impressions, opportunities, και CTR fixes.
          </p>
          <a
            href="/api/admin/gsc/connect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl"
          >
            <ExternalLink className="w-4 h-4" />
            Σύνδεση με Google
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Read-only scope: <code className="text-gray-500">webmasters.readonly</code>
          </p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  const last = status.last_run;
  const lastWhen = last?.finished_at ? new Date(last.finished_at).toLocaleString('el-GR') : 'ποτέ';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            SEO – Google Search Console
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Συνδεδεμένο: <span className="text-gray-800">{status.email}</span>
            <span className="mx-2 text-gray-300">·</span>
            Last sync: <span className="text-gray-800">{lastWhen}</span>
            {last && last.status === 'failed' && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" /> failed
              </span>
            )}
          </p>
        </div>
        <button
          onClick={runSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm"
        >
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {syncing ? 'Συγχρονισμός…' : 'Sync now'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">{error}</div>
      )}

      {last?.error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">
          Τελευταίο sync απέτυχε: <code className="text-xs">{last.error}</code>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <SummaryCard label="Clicks (28d)" value={status.summary.total_clicks.toLocaleString('el-GR')} />
        <SummaryCard label="Impressions (28d)" value={status.summary.total_impressions.toLocaleString('el-GR')} />
        <SummaryCard label="Avg CTR" value={fmtPct(status.summary.overall_ctr)} />
        <SummaryCard label="Avg Position" value={fmtPos(status.summary.overall_position)} />
      </div>

      {/* No data yet */}
      {status.summary.page_count === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-amber-800 mb-3">
            Συνδεθήκαμε αλλά δεν έχει γίνει ακόμα sync. Πάτα το <strong>Sync now</strong> για να φέρεις τα data των τελευταίων 28 ημερών.
          </p>
        </div>
      )}

      {status.summary.page_count > 0 && (
        <>
          {/* Opportunities — rank 11-20 with high impressions */}
          <Section
            title="Quick wins — rank #11–20 με υψηλά impressions"
            description="Σελίδες/queries που είσαι ακριβώς εκτός 1ης σελίδας. Λίγη ενίσχυση = εκθετικό traffic."
            icon={<Target className="w-5 h-5 text-emerald-600" />}
            rows={status.opportunities}
            empty="Δεν υπάρχουν queries στο rank 11-20 με ≥50 impressions."
            showQuery
          />

          {/* CTR dive — rank 1-10 with low CTR */}
          <Section
            title="CTR dive — rank #1–10 αλλά χαμηλό click-through"
            description="Είσαι σε καλή θέση αλλά δεν παίρνεις clicks. Συνήθως σημαίνει κακό title/meta description — rewrite = instant traffic boost."
            icon={<TrendingDown className="w-5 h-5 text-amber-600" />}
            rows={status.ctr_dive}
            empty="Δεν υπάρχουν queries στο rank 1-10 με CTR < 3%."
            showQuery
          />

          {/* Top queries */}
          <Section
            title="Top queries (28 ημέρες)"
            icon={<Search className="w-5 h-5 text-primary-600" />}
            rows={status.top_queries}
            limit={30}
            showQuery
          />

          {/* Top pages */}
          <Section
            title="Top pages (28 ημέρες)"
            icon={<BarChart3 className="w-5 h-5 text-primary-600" />}
            rows={status.top_pages}
            limit={30}
          />
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
    </div>
  );
}

function Section({
  title, description, icon, rows, empty, limit, showQuery,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  rows: Row[];
  empty?: string;
  limit?: number;
  showQuery?: boolean;
}) {
  const display = limit ? rows.slice(0, limit) : rows;
  return (
    <section className="mb-10">
      <div className="flex items-start gap-2 mb-1">
        {icon}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      {description && <p className="text-sm text-gray-500 mb-3 ml-7">{description}</p>}
      {display.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {empty || 'Άδειο.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-600">
                {showQuery && <th className="px-3 py-2.5">Query</th>}
                <th className="px-3 py-2.5">Page</th>
                <th className="px-3 py-2.5 text-right">Clicks</th>
                <th className="px-3 py-2.5 text-right">Impressions</th>
                <th className="px-3 py-2.5 text-right">CTR</th>
                <th className="px-3 py-2.5 text-right">Pos</th>
              </tr>
            </thead>
            <tbody>
              {display.map((r, i) => (
                <tr key={`${r.query || ''}|${r.page || ''}|${i}`} className="border-t border-gray-100 hover:bg-gray-50/50">
                  {showQuery && (
                    <td className="px-3 py-2 text-gray-900">{r.query}</td>
                  )}
                  <td className="px-3 py-2 max-w-md">
                    {r.page ? (
                      <a href={r.page} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline inline-flex items-center gap-1 break-all">
                        {shortPath(r.page)}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.clicks.toLocaleString('el-GR')}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.impressions.toLocaleString('el-GR')}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtPct(r.ctr)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtPos(r.position)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
