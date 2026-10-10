'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ScrollText, RefreshCw, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface LogEntry {
  id: string;
  type: string;
  severity: string;
  message: string;
  details: Record<string, unknown>;
  created_at: string;
}

const severityColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  error: 'bg-red-50 text-red-600',
  user_action: 'bg-green-50 text-green-600',
  admin_action: 'bg-purple-50 text-purple-600',
  system: 'bg-gray-50 text-gray-600',
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const limit = 50;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (filterType) query = query.eq('type', filterType);
    if (filterSeverity) query = query.eq('severity', filterSeverity);

    const { data, count } = await query;
    setLogs((data as LogEntry[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [page, filterType, filterSeverity]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadLogs, 30000);
    return () => clearInterval(interval);
  }, [loadLogs]);

  async function handleDeleteAll() {
    if (!confirm('Διαγραφή ΟΛΩΝ των logs; Αυτή η ενέργεια δεν αναιρείται.')) return;
    const supabase = createClient();
    await supabase.from('activity_logs').delete().gte('created_at', '2000-01-01');
    loadLogs();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ScrollText className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <span className="text-sm text-gray-500">({total} entries)</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadLogs} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={handleDeleteAll} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-4 h-4" /> Delete All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All types</option>
          <option value="error">Errors</option>
          <option value="user_action">User actions</option>
          <option value="admin_action">Admin actions</option>
          <option value="system">System</option>
        </select>
        <select value={filterSeverity} onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <span className="text-xs text-gray-400">Auto-refresh: 30s</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No logs found</div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id}>
                <button onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left text-sm">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${severityColors[log.severity]}`}>
                    {log.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${typeColors[log.type]}`}>
                    {log.type}
                  </span>
                  <span className="flex-1 text-gray-900 truncate">{log.message}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(log.created_at).toLocaleString('el')}
                  </span>
                </button>
                {expanded === log.id && log.details && Object.keys(log.details).length > 0 && (
                  <div className="px-4 pb-3">
                    <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto text-gray-600">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
