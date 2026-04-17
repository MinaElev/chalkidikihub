import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Download, TrendingUp, Users, Sparkles, ArrowLeft, Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Row {
  id: number;
  listing_id: string;
  user_id: string | null;
  created_at: string;
}

export default async function SocialKitStatsPage() {
  const supabase = await createClient();

  // Auth + admin gate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/dashboard');

  // Pull every download event (will switch to aggregation once volume grows).
  const { data: downloads = [] } = await supabase
    .from('social_kit_downloads')
    .select('id, listing_id, user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(5000);

  const rows = (downloads ?? []) as Row[];
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const total = rows.length;
  const last24h = rows.filter(r => now - new Date(r.created_at).getTime() < day).length;
  const last7d  = rows.filter(r => now - new Date(r.created_at).getTime() < 7 * day).length;
  const last30d = rows.filter(r => now - new Date(r.created_at).getTime() < 30 * day).length;
  const uniqueUsers = new Set(rows.map(r => r.user_id).filter(Boolean)).size;
  const uniqueListings = new Set(rows.map(r => r.listing_id)).size;

  // Top listings
  const byListing = new Map<string, number>();
  rows.forEach(r => byListing.set(r.listing_id, (byListing.get(r.listing_id) || 0) + 1));
  const topListingIds = [...byListing.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Fetch titles for top listings
  const ids = topListingIds.map(([id]) => id);
  const { data: listingsData } = ids.length
    ? await supabase.from('listings').select('id, slug, title_el, title_en').in('id', ids)
    : { data: [] as Array<{ id: string; slug: string; title_el: string | null; title_en: string | null }> };
  const listingMap = new Map((listingsData ?? []).map(l => [l.id, l]));

  // 30-day daily chart
  const dayBuckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * day);
    const key = d.toISOString().slice(0, 10);
    dayBuckets[key] = 0;
  }
  rows.forEach(r => {
    const key = r.created_at.slice(0, 10);
    if (key in dayBuckets) dayBuckets[key]++;
  });
  const chartData = Object.entries(dayBuckets);
  const chartMax = Math.max(1, ...chartData.map(([, v]) => v));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Admin
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-600 mb-1">
          <Sparkles className="inline w-3 h-3 mr-1" /> Analytics
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Social Kit Downloads</h1>
        <p className="text-sm text-slate-500 mt-1">Πόσοι owners κατέβασαν το Social Media Kit για τα listings τους.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Download} label="Σύνολο downloads" value={total} accent="emerald" />
        <StatCard icon={TrendingUp} label="Τελευταίες 24 ώρες" value={last24h} accent="violet" />
        <StatCard icon={TrendingUp} label="Τελευταίες 7 ημέρες" value={last7d} accent="sky" />
        <StatCard icon={TrendingUp} label="Τελευταίες 30 ημέρες" value={last30d} accent="amber" />
        <StatCard icon={Users} label="Unique owners" value={uniqueUsers} accent="rose" />
        <StatCard icon={Sparkles} label="Unique listings" value={uniqueListings} accent="indigo" />
        <StatCard
          icon={TrendingUp}
          label="Avg downloads/listing"
          value={uniqueListings > 0 ? (total / uniqueListings).toFixed(1) : '0'}
          accent="emerald"
        />
        <StatCard
          icon={Users}
          label="Avg per owner"
          value={uniqueUsers > 0 ? (total / uniqueUsers).toFixed(1) : '0'}
          accent="slate"
        />
      </div>

      {/* 30-day chart */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Τελευταίες 30 ημέρες</h2>
        <div className="flex items-end gap-1 h-32">
          {chartData.map(([date, v]) => (
            <div key={date} className="flex-1 flex flex-col items-center justify-end group relative">
              <div
                className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all"
                style={{ height: `${(v / chartMax) * 100}%`, minHeight: v > 0 ? '4px' : '0' }}
              />
              <span className="absolute -top-6 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                {date}: {v}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
          <span>{chartData[0]?.[0]}</span>
          <span>{chartData[chartData.length - 1]?.[0]}</span>
        </div>
      </section>

      {/* Top listings */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-slate-900">Top 10 listings</h2>
        </div>
        {topListingIds.length === 0 ? (
          <p className="text-xs text-slate-400">Κανένα download ακόμα.</p>
        ) : (
          <div className="space-y-2">
            {topListingIds.map(([id, count], i) => {
              const l = listingMap.get(id);
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-mono tabular-nums text-slate-400 text-right">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    {l ? (
                      <Link
                        href={`/listings/${l.slug}`}
                        className="text-sm font-medium text-slate-800 hover:text-emerald-700 truncate block"
                      >
                        {l.title_el || l.title_en || l.slug}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Διαγραμμένο listing</span>
                    )}
                    <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-900">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Πρόσφατα downloads</h2>
        {rows.length === 0 ? (
          <p className="text-xs text-slate-400">Καμία δραστηριότητα.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {rows.slice(0, 20).map(r => {
              const l = listingMap.get(r.listing_id);
              const when = new Date(r.created_at);
              return (
                <div key={r.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm text-slate-800 truncate">
                      {l ? (l.title_el || l.title_en || l.slug) : <span className="text-slate-400 italic">{r.listing_id.slice(0, 8)}…</span>}
                    </div>
                    <div className="text-[11px] text-slate-400">{when.toLocaleString('el-GR')}</div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {r.user_id ? `user:${r.user_id.slice(0, 6)}` : 'anon'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, accent,
}: {
  icon: typeof Download;
  label: string;
  value: number | string;
  accent: 'emerald' | 'violet' | 'sky' | 'amber' | 'rose' | 'indigo' | 'slate';
}) {
  const accents: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    violet:  'bg-violet-50  text-violet-600',
    sky:     'bg-sky-50     text-sky-600',
    amber:   'bg-amber-50   text-amber-600',
    rose:    'bg-rose-50    text-rose-600',
    indigo:  'bg-indigo-50  text-indigo-600',
    slate:   'bg-slate-100  text-slate-600',
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${accents[accent]} mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
