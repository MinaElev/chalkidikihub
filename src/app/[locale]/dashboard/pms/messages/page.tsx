'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Inbox, Plus, Loader2, AlertCircle, Search, ArrowLeft, Zap,
  Mail, MessageCircle, Circle, ArrowUpRight, ArrowDownLeft, Bot,
} from 'lucide-react';
import { CHANNEL_META, type MessageChannel } from '@/components/pms/MessageComposer';

interface MessageRow {
  id: string;
  listing_id: string;
  booking_id: string | null;
  direction: 'inbound' | 'outbound' | 'system';
  channel: MessageChannel;
  guest_name: string | null;
  guest_email: string | null;
  subject: string | null;
  body: string;
  is_automated: boolean;
  read_at: string | null;
  created_at: string;
  listings?: { slug: string; title_el: string | null; title_en: string | null } | null;
}

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

interface Thread {
  key: string;
  firstMessageId: string;
  listing_id: string;
  booking_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  lastMessage: MessageRow;
  messageCount: number;
  unreadInbound: number;
  listingName: string;
}

export default function PmsMessagesPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [listings, setListings] = useState<ListingLite[]>([]);

  const [q, setQ] = useState('');
  const [listingFilter, setListingFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<MessageChannel | 'all'>('all');

  const t = {
    back: el ? 'Πίσω στο PMS' : 'Back to PMS',
    title: el ? 'Ενοποιημένα Μηνύματα' : 'Unified Messages',
    sub: el
      ? 'Ένα inbox για όλες τις συνομιλίες με guests — ανά κράτηση ή ανά email.'
      : 'One inbox for every guest conversation — per booking or per email.',
    newMsg: el ? 'Νέο μήνυμα' : 'New message',
    search: el ? 'Αναζήτηση (guest, subject, body)…' : 'Search (guest, subject, body)…',
    allListings: el ? 'Όλα τα καταλύματα' : 'All listings',
    allChannels: el ? 'Όλα τα κανάλια' : 'All channels',
    emptyTitle: el ? 'Άδειο inbox' : 'Empty inbox',
    emptyBody: el ? 'Δεν έχεις μηνύματα ακόμη. Δημιούργησε το πρώτο thread.' : 'No messages yet. Start your first thread.',
    noMatch: el ? 'Δεν υπάρχουν μηνύματα που να ταιριάζουν.' : 'No messages match.',
    threadsLabel: el ? 'Threads' : 'Threads',
    unreadLabel: el ? 'Αδιάβαστα' : 'Unread',
    totalLabel: el ? 'Σύνολο μηνυμάτων' : 'Total messages',
    errLoad: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    nobooking: el ? 'Ανεξάρτητο thread (χωρίς κράτηση)' : 'Standalone thread (no booking)',
    anon: el ? 'Ανώνυμος guest' : 'Unknown guest',
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) { setError(authErr?.message || 'Not signed in'); return; }

        const [lRes, mRes] = await Promise.all([
          supabase.from('listings')
            .select('id, slug, title_el, title_en')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('pms_messages')
            .select('id, listing_id, booking_id, direction, channel, guest_name, guest_email, subject, body, is_automated, read_at, created_at, listings!inner(slug, title_el, title_en)')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
            .limit(500),
        ]);

        if (lRes.error) { setError(lRes.error.message); return; }
        if (mRes.error) { setError(mRes.error.message); return; }
        setListings(lRes.data || []);
        setRows(((mRes.data || []) as unknown) as MessageRow[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, Thread>();
    for (const m of rows) {
      const key = m.booking_id ? `b:${m.booking_id}` : `g:${m.listing_id}:${(m.guest_email || 'anon').toLowerCase()}`;
      const listingName = (el ? m.listings?.title_el : m.listings?.title_en) || m.listings?.title_el || m.listings?.title_en || m.listings?.slug || '';
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          key,
          firstMessageId: m.id,
          listing_id: m.listing_id,
          booking_id: m.booking_id,
          guest_name: m.guest_name,
          guest_email: m.guest_email,
          lastMessage: m,
          messageCount: 1,
          unreadInbound: m.direction === 'inbound' && !m.read_at ? 1 : 0,
          listingName,
        });
      } else {
        existing.messageCount++;
        if (m.direction === 'inbound' && !m.read_at) existing.unreadInbound++;
        if (new Date(m.created_at) > new Date(existing.lastMessage.created_at)) {
          existing.lastMessage = m;
        }
        if (!existing.guest_name && m.guest_name) existing.guest_name = m.guest_name;
        if (!existing.guest_email && m.guest_email) existing.guest_email = m.guest_email;
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );
  }, [rows, el]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return threads.filter(th => {
      if (listingFilter !== 'all' && th.listing_id !== listingFilter) return false;
      if (channelFilter !== 'all' && th.lastMessage.channel !== channelFilter) return false;
      if (needle) {
        const hay = [th.guest_name, th.guest_email, th.lastMessage.subject, th.lastMessage.body, th.listingName]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [threads, q, listingFilter, channelFilter]);

  const stats = useMemo(() => {
    let unread = 0;
    for (const th of threads) unread += th.unreadInbound;
    return { threads: threads.length, unread, total: rows.length };
  }, [threads, rows]);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
                <Zap className="w-3 h-3" fill="currentColor" /> PMS
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{t.title}</h1>
              <p className="text-white/85 text-sm leading-relaxed max-w-xl">{t.sub}</p>
            </div>
          </div>
          <Link href="/dashboard/pms/messages/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-violet-700 hover:bg-violet-50 font-semibold rounded-xl shadow-sm shrink-0">
            <Plus className="w-4 h-4" /> {t.newMsg}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={MessageCircle} color="violet" label={t.threadsLabel} value={String(stats.threads)} />
        <StatCard icon={Circle} color="rose" label={t.unreadLabel} value={String(stats.unread)} />
        <StatCard icon={Mail} color="sky" label={t.totalLabel} value={String(stats.total)} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 space-y-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none text-sm transition"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select value={listingFilter} onChange={e => setListingFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allListings}</option>
            {listings.map(l => (
              <option key={l.id} value={l.id}>
                {(el ? l.title_el : l.title_en) || l.title_el || l.title_en || l.slug}
              </option>
            ))}
          </select>
          <select value={channelFilter} onChange={e => setChannelFilter(e.target.value as MessageChannel | 'all')}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
            <option value="all">{t.allChannels}</option>
            {(Object.keys(CHANNEL_META) as MessageChannel[]).map(k => (
              <option key={k} value={k}>{el ? CHANNEL_META[k].el : CHANNEL_META[k].en}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.errLoad}: <span className="font-mono text-xs">{error}</span></span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">{t.emptyTitle}</h3>
          <p className="text-sm text-slate-500 mb-4">{t.emptyBody}</p>
          <Link href="/dashboard/pms/messages/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-sm">
            <Plus className="w-4 h-4" /> {t.newMsg}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center text-sm text-slate-500">
          {t.noMatch}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(th => {
            const last = th.lastMessage;
            const chan = CHANNEL_META[last.channel];
            const bodyPreview = last.body.slice(0, 140);
            const when = new Date(last.created_at);
            const now = Date.now();
            const minutes = Math.floor((now - when.getTime()) / 60000);
            let ago: string;
            if (minutes < 1) ago = el ? 'τώρα' : 'now';
            else if (minutes < 60) ago = el ? `${minutes}λ πριν` : `${minutes}m ago`;
            else if (minutes < 1440) ago = el ? `${Math.floor(minutes / 60)}ώ πριν` : `${Math.floor(minutes / 60)}h ago`;
            else ago = when.toLocaleDateString(el ? 'el-GR' : 'en-US', { day: '2-digit', month: 'short' });

            const unreadish = th.unreadInbound > 0;

            return (
              <li key={th.key}>
                <Link href={`/dashboard/pms/messages/${th.firstMessageId}`}
                  className={`group block bg-white border ${unreadish ? 'border-violet-300 ring-1 ring-violet-100' : 'border-slate-200'} hover:border-violet-400 hover:shadow-md rounded-2xl p-3 md:p-4 transition`}>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white font-bold text-sm flex items-center justify-center">
                      {(th.guest_name || th.guest_email || '?').trim().slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className={`text-sm font-semibold truncate ${unreadish ? 'text-slate-900' : 'text-slate-700'}`}>
                          {th.guest_name || th.guest_email || t.anon}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${chan.cls}`}>
                          {el ? chan.el : chan.en}
                        </span>
                        {last.is_automated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            <Bot className="w-3 h-3" /> Auto
                          </span>
                        )}
                        {th.unreadInbound > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-600 text-white">
                            {th.unreadInbound} {t.unreadLabel.toLowerCase()}
                          </span>
                        )}
                        <span className="ml-auto text-[11px] text-slate-500 shrink-0">{ago}</span>
                      </div>
                      {last.subject && (
                        <div className="text-sm font-medium text-slate-800 truncate mb-0.5">{last.subject}</div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        {last.direction === 'outbound' && <ArrowUpRight className="w-3 h-3 text-emerald-600 shrink-0" />}
                        {last.direction === 'inbound' && <ArrowDownLeft className="w-3 h-3 text-sky-600 shrink-0" />}
                        <span className="truncate">{bodyPreview}{last.body.length > 140 ? '…' : ''}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 truncate">
                        {th.listingName}
                        {!th.booking_id && <> · <span className="italic">{t.nobooking}</span></>}
                        {th.messageCount > 1 && <> · {th.messageCount} {el ? 'μηνύματα' : 'messages'}</>}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  color: 'violet' | 'rose' | 'sky';
  label: string; value: string;
}) {
  const cls =
    color === 'violet' ? 'bg-violet-100 text-violet-700 ring-violet-200'
    : color === 'rose' ? 'bg-rose-100 text-rose-700 ring-rose-200'
    : 'bg-sky-100 text-sky-700 ring-sky-200';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ring-4 ${cls}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
          <div className="text-lg font-bold text-slate-900 leading-tight">{value}</div>
        </div>
      </div>
    </div>
  );
}
