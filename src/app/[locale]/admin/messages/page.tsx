'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pager, PAGE_SIZE } from '@/components/ui/Pager';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Mail, Loader2, Check, Trash2 } from 'lucide-react';

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  read: boolean;
  created_at: string;
}

const INQUIRY_PATTERN = 'Αίτημα διαθεσιμότητας%';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<'messages' | 'inquiries'>('messages');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ messages: 0, inquiries: 0, unread: 0 });

  // One page from the database at a time (the table grows daily and an
  // unpaged select stops at PostgREST's 1,000-row cap). Tab counts come
  // from head-only count queries.
  const loadMessages = useCallback(async () => {
    const supabase = createClient();
    let q = supabase.from('contact_messages')
      .select('id, name, email, subject, message, locale, read, created_at', { count: 'exact' })
      .order('created_at', { ascending: false }).order('id')
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    q = tab === 'inquiries'
      ? q.like('subject', INQUIRY_PATTERN)
      : q.or(`subject.is.null,subject.not.like."${INQUIRY_PATTERN}"`);
    const head = () => supabase.from('contact_messages').select('id', { count: 'exact', head: true });
    const [list, all, inq, unreadAll, unreadInq] = await Promise.all([
      q,
      head(),
      head().like('subject', INQUIRY_PATTERN),
      head().eq('read', false),
      head().eq('read', false).like('subject', INQUIRY_PATTERN),
    ]);
    // Deleting the last message on the last page: step back a page.
    if (!list.data?.length && page > 1) { setPage(page - 1); return; }
    setMessages((list.data as ContactMsg[]) || []);
    setTotal(list.count || 0);
    setCounts({
      messages: (all.count || 0) - (inq.count || 0),
      inquiries: inq.count || 0,
      unread: (unreadAll.count || 0) - (unreadInq.count || 0),
    });
    setLoading(false);
  }, [page, tab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data load on page/tab change
    loadMessages();
  }, [loadMessages]);

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ read: true }).eq('id', id);
    loadMessages();
  }

  async function deleteMsg(id: string) {
    if (!confirm('Διαγραφή μηνύματος;')) return;
    const supabase = createClient();
    await supabase.from('contact_messages').delete().eq('id', id);
    if (selected === id) setSelected(null);
    loadMessages();
  }

  const filtered = messages;
  const unreadCount = counts.unread;
  const inquiryCount = counts.inquiries;
  const selectedMsg = messages.find((m) => m.id === selected);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Μηνύματα</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => { setTab('messages'); setPage(1); setSelected(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'messages' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Μηνύματα ({counts.messages})
          {unreadCount > 0 && <span className="px-1.5 py-0.5 bg-white/30 rounded-full text-[10px] font-bold">{unreadCount}</span>}
        </button>
        <button onClick={() => { setTab('inquiries'); setPage(1); setSelected(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'inquiries' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Αιτήματα Διαθεσιμότητας ({inquiryCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{tab === 'inquiries' ? 'Δεν υπάρχουν αιτήματα' : 'Δεν υπάρχουν μηνύματα'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Message list */}
          <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
            {filtered.map((msg) => (
              <button key={msg.id} onClick={() => { setSelected(msg.id); if (!msg.read) markRead(msg.id); }}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  selected === msg.id ? 'border-red-300 bg-red-50' :
                  !msg.read ? 'border-primary-200 bg-primary-50' :
                  'border-gray-200 bg-white hover:bg-gray-50'
                }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${!msg.read ? 'text-gray-900' : 'text-gray-600'}`}>{msg.name}</span>
                  {!msg.read && <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                </div>
                <div className="text-xs text-gray-500 truncate">{msg.subject}</div>
                <div className="text-[10px] text-gray-400 mt-1">{new Date(msg.created_at).toLocaleDateString('el')}</div>
              </button>
            ))}
            <Pager page={page} total={total} onPage={(p) => { setPage(p); setSelected(null); }} className="flex-wrap text-xs" />
          </div>

          {/* Message detail */}
          <div className="md:col-span-2">
            {selectedMsg ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedMsg.subject}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{selectedMsg.name}</span>
                      <a href={`mailto:${selectedMsg.email}`} className="text-primary-600 hover:underline flex items-center gap-1">
                        <Mail className="w-3 h-3" />{selectedMsg.email}
                      </a>
                      <span>{new Date(selectedMsg.created_at).toLocaleString('el')}</span>
                      <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{selectedMsg.locale}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteMsg(selectedMsg.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <hr className="mb-4" />
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
                <div className="mt-6">
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors">
                    <Mail className="w-4 h-4" />Reply
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
