'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { LinkIcon, Loader2, AlertTriangle, CheckCircle, Search, ExternalLink } from 'lucide-react';

interface BrokenLink {
  source: string;
  sourceType: string;
  sourceSlug: string;
  link: string;
  status: number | string;
}

interface ScanResult {
  totalScanned: number;
  validPaths: number;
  brokenLinks: BrokenLink[];
  brokenCount: number;
}

export default function BrokenLinksPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleScan() {
    setLoading(true); setError(''); setResult(null);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/broken-links', {
        headers: { 'Authorization': `Bearer ${session?.access_token || ''}` },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError((err as Error).message); }
    setLoading(false);
  }

  const TYPE_COLORS: Record<string, string> = {
    blog: 'bg-indigo-100 text-indigo-700',
    beach: 'bg-cyan-100 text-cyan-700',
    restaurant: 'bg-red-100 text-red-700',
    activity: 'bg-amber-100 text-amber-700',
    village: 'bg-teal-100 text-teal-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LinkIcon className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Broken Links Scanner</h1>
        </div>
        <button onClick={handleScan} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {result && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{result.totalScanned}</div>
              <div className="text-xs text-gray-500">Pages Scanned</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{result.validPaths}</div>
              <div className="text-xs text-gray-500">Known Valid Paths</div>
            </div>
            <div className={`border rounded-xl p-4 text-center ${result.brokenCount === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${result.brokenCount === 0 ? 'text-green-700' : 'text-red-700'}`}>{result.brokenCount}</div>
              <div className="text-xs text-gray-500">Broken Links</div>
            </div>
          </div>

          {result.brokenCount === 0 ? (
            <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">No broken links found!</p>
                <p className="text-sm text-green-600">All internal links are valid.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {result.brokenLinks.map((bl, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${TYPE_COLORS[bl.sourceType] || 'bg-gray-100 text-gray-600'}`}>
                        {bl.sourceType}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">{bl.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded font-mono">{bl.link}</code>
                      <span className="text-[10px] text-gray-400">→ {bl.status}</span>
                    </div>
                  </div>
                  <Link href={`/admin/${bl.sourceType === 'blog' ? 'blog' : bl.sourceType === 'beach' ? 'beaches' : bl.sourceType === 'restaurant' ? 'restaurants' : bl.sourceType === 'activity' ? 'activities' : 'villages'}/${bl.sourceSlug}/edit`}
                    className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Fix
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!result && !loading && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Σκανάρει εσωτερικούς links σε blog, παραλίες, εστιατόρια, δραστηριότητες, χωριά</p>
          <p className="text-xs text-gray-400">Πατήστε "Scan Now" για να ξεκινήσει ο έλεγχος</p>
        </div>
      )}
    </div>
  );
}
