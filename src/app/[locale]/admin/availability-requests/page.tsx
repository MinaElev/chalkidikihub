'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Mail, Phone, Calendar, Users, MapPin, ExternalLink, Send, MessageSquare, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';

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

interface Recipient {
  id: string;
  owner_id: string;
  send_status: 'sent' | 'failed' | 'skipped';
  sent_at: string;
  error: string | null;
  owner_name: string;
  owner_email: string;
  responded_status: 'available' | 'unavailable' | null;
}

export default function AdminAvailabilityRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'expired'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recipientsCache, setRecipientsCache] = useState<Record<string, Recipient[]>>({});
  const [loadingRecipients, setLoadingRecipients] = useState<string | null>(null);

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

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (recipientsCache[id]) return;

    setLoadingRecipients(id);
    const supabase = createClient();
    const [recipRes, respRes] = await Promise.all([
      supabase
        .from('availability_request_recipients')
        .select('id, owner_id, send_status, sent_at, error')
        .eq('request_id', id)
        .order('sent_at', { ascending: true }),
      supabase
        .from('availability_responses')
        .select('owner_id, status')
        .eq('request_id', id),
    ]);

    type RecipRow = { id: string; owner_id: string; send_status: 'sent' | 'failed' | 'skipped'; sent_at: string; error: string | null };
    type RespRow = { owner_id: string; status: 'available' | 'unavailable' };

    const recipients = (recipRes.data as RecipRow[] | null) || [];
    const responses = (respRes.data as RespRow[] | null) || [];
    const responseMap = new Map<string, 'available' | 'unavailable'>();
    for (const r of responses) responseMap.set(r.owner_id, r.status);

    // Fetch profiles for names + emails
    const ownerIds = Array.from(new Set(recipients.map(r => r.owner_id)));
    const profileMap = new Map<string, { name: string; email: string }>();
    if (ownerIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ownerIds);
      for (const p of (profiles || []) as { id: string; full_name: string }[]) {
        profileMap.set(p.id, { name: p.full_name || '—', email: '' });
      }
    }

    const enriched: Recipient[] = recipients.map(r => ({
      ...r,
      owner_name: profileMap.get(r.owner_id)?.name || 'Ιδιοκτήτης',
      owner_email: '',
      responded_status: responseMap.get(r.owner_id) ?? null,
    }));

    setRecipientsCache(prev => ({ ...prev, [id]: enriched }));
    setLoadingRecipients(null);
  }

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
        {filtered.map(r => {
          const isExpanded = expandedId === r.id;
          const recipients = recipientsCache[r.id];
          const isLoadingRecip = loadingRecipients === r.id;
          return (
            <div key={r.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4">
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600 my-3">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{AREA_LABELS[r.area] || r.area}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmt(r.check_in)} → {fmt(r.check_out)}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.adults}+{r.children}</span>
                </div>

                {/* Email + response stats — prominent */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                      <Send className="w-3 h-3" /> Email στάλθηκαν
                    </div>
                    <div className="text-xl font-bold text-blue-900 mt-0.5">
                      {r.recipients_count} <span className="text-sm font-normal text-blue-700">ιδιοκτήτες</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Απαντήσεις
                    </div>
                    <div className="text-xl font-bold text-emerald-900 mt-0.5">
                      {r.responses_count}
                      <span className="text-sm font-normal text-emerald-700">
                        {r.recipients_count > 0
                          ? ` (${Math.round((r.responses_count / r.recipients_count) * 100)}%)`
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => toggleExpand(r.id)}
                    className="text-xs text-gray-700 hover:text-gray-900 inline-flex items-center gap-1 font-medium"
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? 'Απόκρυψη παραληπτών' : `Δες τους ${r.recipients_count} παραλήπτες`}
                  </button>
                  <a
                    href={`/requests/${r.public_token}`}
                    target="_blank"
                    rel="noopener"
                    className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1"
                  >
                    Άνοιξε το guest dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Recipients list (expanded) */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                  {isLoadingRecip ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                      <Loader2 className="w-4 h-4 animate-spin" /> Φόρτωση...
                    </div>
                  ) : !recipients || recipients.length === 0 ? (
                    <div className="text-sm text-gray-500 py-3">Δεν στάλθηκε σε κανέναν ιδιοκτήτη.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {recipients.map(rec => (
                        <div key={rec.id} className="flex items-center justify-between gap-3 px-2 py-1.5 bg-white rounded-md border border-gray-100 text-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              rec.send_status === 'sent' ? 'bg-emerald-500' :
                              rec.send_status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                            }`} />
                            <span className="font-medium text-gray-900 truncate">{rec.owner_name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {rec.responded_status === 'available' && (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Διαθέσιμο
                              </span>
                            )}
                            {rec.responded_status === 'unavailable' && (
                              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                                Όχι διαθέσιμο
                              </span>
                            )}
                            {rec.responded_status === null && (
                              <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                Αναμένει
                              </span>
                            )}
                            {rec.send_status === 'failed' && (
                              <span title={rec.error || ''} className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                                <AlertCircle className="w-3 h-3" /> Send failed
                              </span>
                            )}
                            <span className="text-xs text-gray-400">{new Date(rec.sent_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit' });
}
