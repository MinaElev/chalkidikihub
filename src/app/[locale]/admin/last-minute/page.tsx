'use client';

/**
 * Admin — Last-Minute Availability
 * -----------------------------------------------------------------------
 * Superadmin view of every last-minute opening the owners have published.
 * Reads directly from Supabase — the `lmd_owner_all` RLS policy grants
 * admin/superadmin full read (and delete, for moderation) on all rows.
 * Owner names come from `profiles` in a second query (same pattern as the
 * availability-requests admin page).
 */

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2, Zap, MapPin, Calendar, User, ExternalLink, Trash2, Share2, CheckCircle2,
} from 'lucide-react';

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα',
};

interface Row {
  id: string;
  listing_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  status: string;
  fb_post_id: string | null;
  fb_posted_at: string | null;
  created_at: string;
  listings: {
    slug: string;
    title_el: string;
    title_en: string;
    area: string;
    status: string;
  } | null;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtRange(s: string, e: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const sd = new Date(s + 'T00:00:00').toLocaleDateString('el-GR', opts);
  const ed = new Date(e + 'T00:00:00').toLocaleDateString('el-GR', opts);
  return s === e ? sd : `${sd} → ${ed}`;
}

export default function AdminLastMinutePage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [ownerNames, setOwnerNames] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('last_minute_deals')
        .select('id, listing_id, owner_id, start_date, end_date, note, status, fb_post_id, fb_posted_at, created_at, listings(slug, title_el, title_en, area, status)')
        .order('start_date', { ascending: true });

      const list = (data as unknown as Row[]) || [];
      setRows(list);

      // Resolve owner names in one round-trip.
      const ownerIds = Array.from(new Set(list.map(r => r.owner_id)));
      if (ownerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', ownerIds);
        const map: Record<string, string> = {};
        for (const p of (profiles || []) as { id: string; full_name: string }[]) {
          map[p.id] = p.full_name || '—';
        }
        setOwnerNames(map);
      }
      setLoading(false);
    })();
  }, []);

  // "Active" = live on the public page: status active AND not yet ended.
  const today = todayStr();
  const isLive = (r: Row) => r.status === 'active' && r.end_date >= today;

  const filtered = useMemo(
    () => rows.filter(r => (filter === 'all' ? true : isLive(r))),
    [rows, filter, today],
  );

  const liveRows = rows.filter(isLive);
  const stats = {
    active: liveRows.length,
    listings: new Set(liveRows.map(r => r.listing_id)).size,
    owners: new Set(liveRows.map(r => r.owner_id)).size,
    fbPosted: liveRows.filter(r => r.fb_post_id).length,
  };

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('last_minute_deals').delete().eq('id', id);
    if (!error) setRows(prev => prev.filter(r => r.id !== id));
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-100 text-amber-600">
          <Zap className="w-4 h-4" />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">Διαθεσιμότητα τελευταίας στιγμής</h1>
      </div>
      <p className="text-gray-600 mb-6 ml-10">Όλες οι προσφορές τελευταίας στιγμής που έχουν καταχωρήσει οι ιδιοκτήτες.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Ενεργές προσφορές" value={stats.active} />
        <StatCard label="Καταλύματα" value={stats.listings} />
        <StatCard label="Ιδιοκτήτες" value={stats.owners} />
        <StatCard label="Ποσταρίστηκαν στο FB" value={stats.fbPosted} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['active', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'active' ? `Ενεργές (${stats.active})` : `Όλες (${rows.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Καμία εγγραφή.</div>
        )}
        {filtered.map(r => {
          const live = isLive(r);
          const title = r.listings?.title_el || r.listings?.title_en || '—';
          const area = r.listings ? (AREA_LABELS[r.listings.area] || r.listings.area) : '—';
          return (
            <div key={r.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{title}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      live ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {live ? 'Ενεργή' : r.status === 'active' ? 'Έληξε' : r.status === 'expired' ? 'Έληξε' : 'Ακυρώθηκε'}
                    </span>
                    {r.listings && r.listings.status !== 'published' && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Κατάλυμα μη δημοσιευμένο
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{ownerNames[r.owner_id] || 'Ιδιοκτήτης'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{area}</span>
                    <span className="flex items-center gap-1 font-medium text-gray-700"><Calendar className="w-3 h-3" />{fmtRange(r.start_date, r.end_date)}</span>
                    {r.fb_post_id && (
                      <span className="flex items-center gap-1 text-blue-600"><Share2 className="w-3 h-3" />Στο Facebook</span>
                    )}
                  </div>
                  {r.note && <p className="text-sm text-gray-600 mt-1.5">{r.note}</p>}
                  <div className="text-[11px] text-gray-400 mt-1.5">
                    Καταχωρήθηκε {new Date(r.created_at).toLocaleString('el-GR')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {r.listings?.slug && (
                    <a
                      href={`/el/listings/${r.listings.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      Κατάλυμα <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    title="Διαγραφή"
                  >
                    {deletingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-1.5">
        {label === 'Ποσταρίστηκαν στο FB' && typeof value === 'number' && value > 0 && (
          <CheckCircle2 className="w-4 h-4 text-blue-500" />
        )}
        {value}
      </div>
    </div>
  );
}
