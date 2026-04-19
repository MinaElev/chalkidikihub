'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft, Loader2, AlertCircle, MessagesSquare, Zap, Mail,
  ArrowUpRight, ArrowDownLeft, Bot, User as UserIcon,
  Trash2, CheckCircle2,
} from 'lucide-react';
import { MessageComposer, CHANNEL_META, type MessageChannel } from '@/components/pms/MessageComposer';

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
}

interface ListingLite {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
}

interface BookingLite {
  id: string;
  check_in: string;
  check_out: string;
  guest_name: string | null;
  guest_email: string | null;
}

export default function MessageThreadPage() {
  const locale = useLocale();
  const el = locale === 'el';
  const params = useParams<{ id: string }>();
  const msgId = params?.id;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [seedMsg, setSeedMsg] = useState<MessageRow | null>(null);
  const [threadMsgs, setThreadMsgs] = useState<MessageRow[]>([]);
  const [listing, setListing] = useState<ListingLite | null>(null);
  const [booking, setBooking] = useState<BookingLite | null>(null);

  const t = {
    back: el ? 'Πίσω στο inbox' : 'Back to inbox',
    title: el ? 'Συνομιλία' : 'Thread',
    sub: el ? 'Όλα τα μηνύματα στο thread σε χρονολογική σειρά.' : 'All messages in this thread, in chronological order.',
    loadError: el ? 'Σφάλμα φόρτωσης' : 'Load error',
    notFound: el ? 'Το μήνυμα δεν βρέθηκε.' : 'Message not found.',
    reply: el ? 'Απάντηση' : 'Reply',
    log: el ? 'Καταχώρηση εισερχομένου' : 'Log inbound',
    markAllRead: el ? 'Σήμανση όλων ως αναγνωσμένα' : 'Mark all as read',
    guest: el ? 'Guest' : 'Guest',
    booking: el ? 'Κράτηση' : 'Booking',
    openBooking: el ? 'Άνοιξε κράτηση' : 'Open booking',
    nobooking: el ? 'Ανεξάρτητο thread — χωρίς κράτηση' : 'Standalone thread — no booking',
    deleteAction: el ? 'Διαγραφή thread' : 'Delete thread',
    deleteConfirm: el ? 'Σίγουρα; Όλα τα μηνύματα του thread θα διαγραφούν οριστικά.' : 'Are you sure? All messages in this thread will be permanently deleted.',
  };

  const load = useCallback(async () => {
    if (!msgId) return;
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) { setLoadError(authErr?.message || 'Not signed in'); setLoading(false); return; }

    const { data: seed, error: seedErr } = await supabase
      .from('pms_messages')
      .select('*')
      .eq('id', msgId)
      .eq('owner_id', user.id)
      .maybeSingle();

    if (seedErr) { setLoadError(seedErr.message); setLoading(false); return; }
    if (!seed) { setLoadError(t.notFound); setLoading(false); return; }
    setSeedMsg(seed);

    let threadQ = supabase.from('pms_messages').select('*').eq('owner_id', user.id);
    if (seed.booking_id) {
      threadQ = threadQ.eq('booking_id', seed.booking_id);
    } else if (seed.guest_email) {
      threadQ = threadQ.eq('listing_id', seed.listing_id).eq('guest_email', seed.guest_email).is('booking_id', null);
    } else {
      threadQ = threadQ.eq('id', seed.id);
    }
    const { data: thread, error: threadErr } = await threadQ.order('created_at', { ascending: true });
    if (threadErr) { setLoadError(threadErr.message); setLoading(false); return; }
    setThreadMsgs((thread || []) as MessageRow[]);

    const [listingRes, bookingRes] = await Promise.all([
      supabase.from('listings').select('id, slug, title_el, title_en').eq('id', seed.listing_id).maybeSingle(),
      seed.booking_id
        ? supabase.from('pms_bookings').select('id, check_in, check_out, guest_name, guest_email').eq('id', seed.booking_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);
    if (listingRes.data) setListing(listingRes.data as ListingLite);
    if (bookingRes.data) setBooking(bookingRes.data as BookingLite);

    const unreadIds = (thread || []).filter(m => m.direction === 'inbound' && !m.read_at).map(m => m.id);
    if (unreadIds.length > 0) {
      await supabase.from('pms_messages').update({ read_at: new Date().toISOString() }).in('id', unreadIds);
    }

    setLoading(false);
  }, [msgId, t.notFound]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    if (!seedMsg) return;
    if (!confirm(t.deleteConfirm)) return;
    const supabase = createClient();
    const ids = threadMsgs.map(m => m.id);
    const { error } = await supabase.from('pms_messages').delete().in('id', ids);
    if (error) { alert(error.message); return; }
    window.location.href = `/${locale}/dashboard/pms/messages`;
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  }

  const listingName = listing ? ((el ? listing.title_el : listing.title_en) || listing.title_el || listing.title_en || listing.slug) : '';
  const guestName = seedMsg?.guest_name || booking?.guest_name || null;
  const guestEmail = seedMsg?.guest_email || booking?.guest_email || null;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/pms/messages" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>

      <header className="relative overflow-hidden rounded-3xl p-6 md:p-8 text-white bg-gradient-to-br from-violet-500 via-violet-600 to-purple-700">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 shrink-0">
            <MessagesSquare className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-[0.15em] mb-2">
              <Zap className="w-3 h-3" fill="currentColor" /> PMS
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1 truncate">
              {guestName || guestEmail || t.guest}
            </h1>
            <p className="text-white/85 text-sm leading-relaxed truncate">{listingName}</p>
          </div>
        </div>
      </header>

      {loadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{t.loadError}: <span className="font-mono text-xs">{loadError}</span></span>
        </div>
      )}

      {seedMsg && (
        <>
          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">{t.guest}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-800">
              {guestName && (
                <div className="inline-flex items-center gap-1.5"><UserIcon className="w-4 h-4 text-slate-500" /> {guestName}</div>
              )}
              {guestEmail && (
                <a href={`mailto:${guestEmail}`} className="inline-flex items-center gap-1.5 text-violet-700 hover:underline">
                  <Mail className="w-4 h-4" /> {guestEmail}
                </a>
              )}
            </div>
            {booking ? (
              <div className="text-xs text-slate-600 flex items-center gap-2">
                <span>{t.booking}: {new Date(booking.check_in).toLocaleDateString(el ? 'el-GR' : 'en-US')} → {new Date(booking.check_out).toLocaleDateString(el ? 'el-GR' : 'en-US')}</span>
                <Link href={`/dashboard/pms/bookings/${booking.id}`} className="text-violet-700 hover:underline font-medium">{t.openBooking}</Link>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">{t.nobooking}</div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">{t.title}</h2>
            <ul className="space-y-3">
              {threadMsgs.map(m => {
                const chan = CHANNEL_META[m.channel];
                const when = new Date(m.created_at);
                const isOut = m.direction === 'outbound';
                const isSys = m.direction === 'system';
                return (
                  <li key={m.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 ${
                      isSys ? 'bg-slate-100 text-slate-700 text-xs italic'
                      : isOut ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className={`flex items-center gap-1.5 flex-wrap mb-1 ${isOut ? 'justify-end' : 'justify-start'}`}>
                        {isOut ? <ArrowUpRight className="w-3 h-3" /> : isSys ? null : <ArrowDownLeft className="w-3 h-3" />}
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${isOut ? 'bg-white/20 text-white' : chan.cls}`}>
                          {el ? chan.el : chan.en}
                        </span>
                        {m.is_automated && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800">
                            <Bot className="w-3 h-3" /> Auto
                          </span>
                        )}
                      </div>
                      {m.subject && <div className="text-sm font-bold mb-1">{m.subject}</div>}
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">{m.body}</div>
                      <div className={`text-[10px] mt-1 ${isOut ? 'text-white/70' : 'text-slate-500'}`}>
                        {when.toLocaleDateString(el ? 'el-GR' : 'en-US', { day: '2-digit', month: 'short' })} · {when.toLocaleTimeString(el ? 'el-GR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {threadMsgs.filter(m => m.direction === 'inbound' && !m.read_at).length === 0 && threadMsgs.some(m => m.direction === 'inbound') && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {t.markAllRead}
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">{t.reply}</h2>
            <MessageComposer
              context={{
                listing_id: seedMsg.listing_id,
                booking_id: seedMsg.booking_id,
                guest_name: guestName,
                guest_email: guestEmail,
                direction: 'outbound',
              }}
              el={el}
              onSent={load}
            />
          </section>

          <div className="flex justify-end">
            <button type="button" onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold rounded-xl transition-colors text-sm">
              <Trash2 className="w-4 h-4" /> {t.deleteAction}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
