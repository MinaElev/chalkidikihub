'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, Phone, Calendar, Users, MapPin, ExternalLink } from 'lucide-react';

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα',
};

interface Row {
  id: string;
  public_token: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  area: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  status: string;
  recipients_count: number;
  responses_count: number;
  created_at: string;
  expires_at: string;
}

export default function AdminAvailabilityRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'expired'>('all');

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('availability_requests')
        .select('id, public_token, guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children, status, recipients_count, responses_count, created_at, expires_at')
        .order('created_at', { ascending: false })
        .limit(200);
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter(r => filter === 'all' || r.status === filter);

  const stats = {
    total: rows.length,
    active: rows.filter(r => r.status === 'active').length,
    withResponses: rows.filter(r => r.responses_count > 0).length,
    totalEmails: rows.reduce((s, r) => s + (r.recipients_count || 0), 0),
  };

  const conversionRate = stats.total ? Math.round((stats.withResponses / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Αιτήματα διαθεσιμότητας</h1>
      <p className="text-gray-600 mb-6">Αιτήματα από επισκέπτες χωρίς λογαριασμό + στατιστικά απαντήσεων.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Σύνολο αιτημάτων" value={stats.total} />
        <StatCard label="Ενεργά" value={stats.active} />
        <StatCard label="Με απάντηση" value={`${stats.withResponses} (${conversionRate}%)`} />
        <StatCard label="Συνολικά broadcast emails" value={stats.totalEmails} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'active', 'closed', 'expired'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Όλα' : f === 'active' ? 'Ενεργά' : f === 'closed' ? 'Κλειστά' : 'Έληξαν'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">Καμία εγγραφή.</div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="font-semibold text-gray-900">{r.guest_name}</div>
                <div className="text-xs text-gray-500 flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.guest_email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.guest_phone}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  r.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  r.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {r.status === 'active' ? 'Ενεργό' : r.status === 'closed' ? 'Κλειστό' : 'Έληξε'}
                </span>
                <div className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleString('el-GR')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 my-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{AREA_LABELS[r.area] || r.area}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmt(r.check_in)} → {fmt(r.check_out)}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.adults}+{r.children}</span>
              <span>
                <strong className="text-gray-900">{r.responses_count}</strong>/{r.recipients_count} απαντήσεις
              </span>
            </div>

            <a
              href={`/requests/${r.public_token}`}
              target="_blank"
              rel="noopener"
              className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
            >
              Άνοιξε το guest dashboard <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit' });
}
