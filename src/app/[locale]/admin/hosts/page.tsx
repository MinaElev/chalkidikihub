'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ExternalLink, Eye, EyeOff, Search, Users, Globe } from 'lucide-react';

interface HostRow {
  id: string;
  full_name: string;
  email: string;
  public_slug: string | null;
  public_display_name: string | null;
  public_page_enabled: boolean;
  public_avatar_url: string | null;
  bio_el: string | null;
  bio_en: string | null;
  listings_count: number;
  eligible: boolean; // ≥2 published listings
}

export default function AdminHostsPage() {
  const [rows, setRows] = useState<HostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'enabled' | 'eligible' | 'all'>('enabled');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const supabase = createClient();

    // Profiles (all owners)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email, public_slug, public_display_name, public_page_enabled, public_avatar_url, bio_el, bio_en')
      .order('full_name', { ascending: true });

    // Published-listing counts grouped by owner_id
    const { data: listings } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('status', 'published');

    const counts = new Map<string, number>();
    for (const l of listings || []) {
      const k = (l as { owner_id: string }).owner_id;
      counts.set(k, (counts.get(k) || 0) + 1);
    }

    const hostRows: HostRow[] = (profiles || []).map((p) => {
      const c = counts.get(p.id) || 0;
      return { ...p, listings_count: c, eligible: c >= 2 };
    });

    setRows(hostRows);
    setLoading(false);
  }

  async function toggleEnabled(row: HostRow) {
    if (!row.public_slug) {
      alert('Ο owner δεν έχει public_slug ακόμα — δεν μπορεί να ενεργοποιηθεί.');
      return;
    }
    setSavingId(row.id);
    const supabase = createClient();
    const next = !row.public_page_enabled;
    const { error } = await supabase
      .from('profiles')
      .update({ public_page_enabled: next })
      .eq('id', row.id);
    setSavingId(null);
    if (error) { alert('Σφάλμα: ' + error.message); return; }
    // Trigger revalidate so prod cache reflects change
    fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'host', slug: row.public_slug }),
    }).catch(() => {});
    load();
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === 'enabled' && !(r.public_page_enabled && r.public_slug)) return false;
      if (filter === 'eligible' && !r.eligible) return false;
      if (needle) {
        const hay = [r.full_name, r.email, r.public_slug, r.public_display_name].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, filter]);

  const stats = useMemo(() => ({
    enabled: rows.filter((r) => r.public_page_enabled && r.public_slug).length,
    eligible: rows.filter((r) => r.eligible).length,
    eligibleNotEnabled: rows.filter((r) => r.eligible && !r.public_page_enabled).length,
    total: rows.length,
  }), [rows]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Globe className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Public Host Pages</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Όλοι οι owners και η κατάσταση της δημόσιας σελίδας τους (<code>/host/[slug]</code>).
        Eligible = έχει ≥2 published listings.
      </p>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
          <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">Enabled</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{stats.enabled}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 ring-1 ring-amber-100">
          <p className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Eligible, not enabled</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.eligibleNotEnabled}</p>
        </div>
        <div className="p-4 rounded-2xl bg-sky-50 ring-1 ring-sky-100">
          <p className="text-xs uppercase tracking-wide text-sky-700 font-semibold">Total eligible (≥2)</p>
          <p className="text-2xl font-bold text-sky-900 mt-1">{stats.eligible}</p>
        </div>
        <div className="p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">All owners</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, slug…"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden self-start">
          {(['enabled', 'eligible', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium transition ${
                filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f === 'enabled' ? 'Enabled' : f === 'eligible' ? 'Eligible' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Owner</th>
                <th className="text-left px-4 py-3">Slug / URL</th>
                <th className="text-left px-4 py-3">Listings</th>
                <th className="text-left px-4 py-3">Bio</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No matching owners.</td></tr>
              )}
              {filtered.map((r) => {
                const url = r.public_slug ? `/host/${r.public_slug}` : null;
                const fullUrl = url ? `https://chalkidikihub.gr${url}` : null;
                const hasBio = Boolean(r.bio_el?.trim() || r.bio_en?.trim());
                return (
                  <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.public_avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.public_avatar_url} alt={r.full_name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                            {(r.public_display_name || r.full_name || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {r.public_display_name || r.full_name || '(unnamed)'}
                          </div>
                          {r.email && <div className="text-xs text-gray-500 truncate">{r.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.public_slug ? (
                        <a
                          href={fullUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:underline font-mono text-xs"
                        >
                          /host/{r.public_slug}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">no slug</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 ${r.eligible ? 'text-gray-900' : 'text-gray-400'}`}>
                        <Users className="w-3.5 h-3.5" />
                        {r.listings_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {hasBio
                        ? <span className="text-xs text-emerald-700">✓ filled</span>
                        : <span className="text-xs text-gray-400 italic">empty</span>}
                    </td>
                    <td className="px-4 py-3">
                      {r.public_page_enabled && r.public_slug ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <Eye className="w-3 h-3" /> Live
                        </span>
                      ) : r.eligible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                          <EyeOff className="w-3 h-3" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-gray-500 text-xs">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleEnabled(r)}
                        disabled={savingId === r.id || !r.public_slug}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {savingId === r.id ? '…' : r.public_page_enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
