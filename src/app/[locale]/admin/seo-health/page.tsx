'use client';

import { useState } from 'react';
import { Activity, Loader2, AlertTriangle, AlertCircle, CheckCircle, ExternalLink, Filter } from 'lucide-react';

type PageCheck = {
  url: string;
  bucket: string;
  status: number | 'error';
  redirectedTo?: string;
  ms: number;
  title: string;
  titleLen: number;
  description: string;
  descriptionLen: number;
  h1: string;
  robots: string;
  canonical: string;
  hreflangCount: number;
  jsonLdCount: number;
  imagesWithoutAlt: number;
  issues: string[];
};

type Report = {
  duration_ms: number;
  summary: {
    total: number;
    clean: number;
    with_warnings: number;
    with_criticals: number;
  };
  top_issues: Array<{ code: string; count: number }>;
  results: PageCheck[];
};

function severityOf(issue: string): 'critical' | 'warning' | 'info' {
  if (issue.startsWith('critical:')) return 'critical';
  if (issue.startsWith('warning:')) return 'warning';
  return 'info';
}

function highestSeverity(issues: string[]): 'critical' | 'warning' | 'info' | 'clean' {
  if (issues.length === 0) return 'clean';
  if (issues.some((i) => i.startsWith('critical:'))) return 'critical';
  if (issues.some((i) => i.startsWith('warning:'))) return 'warning';
  return 'info';
}

const SEVERITY_STYLES = {
  clean: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'OK', Icon: CheckCircle },
  info: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', label: 'Info', Icon: Activity },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Warning', Icon: AlertTriangle },
  critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', label: 'Critical', Icon: AlertCircle },
} as const;

export default function SeoHealthPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sample, setSample] = useState(5);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info' | 'clean'>('all');
  const [filterBucket, setFilterBucket] = useState<string>('all');

  async function runCheck() {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch(`/api/admin/seo-health?sample=${sample}`, { method: 'POST' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReport(data as Report);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const buckets = report ? Array.from(new Set(report.results.map((r) => r.bucket))).sort() : [];

  const filtered = report
    ? report.results.filter((r) => {
        if (filterBucket !== 'all' && r.bucket !== filterBucket) return false;
        if (filterSeverity === 'all') return true;
        return highestSeverity(r.issues) === filterSeverity;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-600" />
            SEO Health (live HTML crawl)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fetches a sample of rendered pages and checks the signals Googlebot would actually see.
            Different scope from /admin/seo (DB content) and /admin/quality (data completeness).
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sample per content type</label>
          <input
            type="number"
            min={2}
            max={20}
            value={sample}
            onChange={(e) => setSample(Math.max(2, Math.min(20, Number(e.target.value) || 5)))}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <button
          onClick={runCheck}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-xl text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          {loading ? 'Crawling…' : 'Run check'}
        </button>
        {report && (
          <span className="text-xs text-gray-500">
            Last run: {(report.duration_ms / 1000).toFixed(1)}s · {report.summary.total} pages
          </span>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 text-sm text-rose-700">
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {(['clean', 'info', 'warning', 'critical'] as const).map((sev) => {
              const count =
                sev === 'clean'
                  ? report.summary.clean
                  : sev === 'critical'
                    ? report.summary.with_criticals
                    : sev === 'warning'
                      ? report.summary.with_warnings
                      : report.summary.total - report.summary.clean - report.summary.with_warnings - report.summary.with_criticals;
              const s = SEVERITY_STYLES[sev];
              const Icon = s.Icon;
              return (
                <div
                  key={sev}
                  className={`rounded-2xl border ${s.border} ${s.bg} p-4 cursor-pointer ${filterSeverity === sev ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                  onClick={() => setFilterSeverity(filterSeverity === sev ? 'all' : sev)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${s.text}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${s.text}`}>{s.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Top issues */}
          {report.top_issues.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Top issue codes</h3>
              <div className="flex flex-wrap gap-2">
                {report.top_issues.map((it) => (
                  <span
                    key={it.code}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                  >
                    <code className="font-mono text-gray-900">{it.code}</code>
                    <span className="text-gray-500">×{it.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBucket}
              onChange={(e) => setFilterBucket(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="all">All buckets</option>
              {buckets.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">
              {filtered.length} / {report.summary.total} shown
            </span>
          </div>

          {/* Results table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-wider text-gray-600">
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">URL</th>
                  <th className="px-3 py-2.5">Bucket</th>
                  <th className="px-3 py-2.5 text-right">HTTP</th>
                  <th className="px-3 py-2.5 text-right">ms</th>
                  <th className="px-3 py-2.5 text-right">Title</th>
                  <th className="px-3 py-2.5 text-right">Desc</th>
                  <th className="px-3 py-2.5 text-right">H1</th>
                  <th className="px-3 py-2.5 text-right">Canon</th>
                  <th className="px-3 py-2.5 text-right">Hreflang</th>
                  <th className="px-3 py-2.5 text-right">LD</th>
                  <th className="px-3 py-2.5">Issues</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const sev = highestSeverity(r.issues);
                  const s = SEVERITY_STYLES[sev];
                  return (
                    <tr key={r.url} className="border-t border-gray-100 hover:bg-gray-50/50 align-top">
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.bg} ${s.text} border ${s.border}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-3 py-2 max-w-xs">
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline inline-flex items-center gap-1 break-all">
                          {r.url.replace(/^https?:\/\/[^/]+/, '')}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{r.bucket}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.status}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-gray-500">{r.ms}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.titleLen}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.descriptionLen}</td>
                      <td className="px-3 py-2 text-right">{r.h1 ? '✓' : '—'}</td>
                      <td className="px-3 py-2 text-right">{r.canonical ? '✓' : '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.hreflangCount}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{r.jsonLdCount}</td>
                      <td className="px-3 py-2 text-xs">
                        {r.issues.length === 0 ? (
                          <span className="text-emerald-600">—</span>
                        ) : (
                          <div className="space-y-1">
                            {r.issues.slice(0, 3).map((issue, i) => {
                              const [severity, , message] = issue.split(':');
                              const sevS = SEVERITY_STYLES[severity as keyof typeof SEVERITY_STYLES] || SEVERITY_STYLES.info;
                              return (
                                <div key={i} className={sevS.text}>
                                  • {message}
                                </div>
                              );
                            })}
                            {r.issues.length > 3 && (
                              <div className="text-gray-400">+{r.issues.length - 3} more</div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!report && !loading && !error && (
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm">Click "Run check" to crawl a sample of rendered pages.</p>
          <p className="text-xs mt-1">Takes ~30-60 seconds. Crawls ~120 URLs at a sample of 5.</p>
        </div>
      )}
    </div>
  );
}
