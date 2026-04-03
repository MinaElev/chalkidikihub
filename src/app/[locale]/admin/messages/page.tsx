'use client';

import { useEffect, useState } from 'react';
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    const supabase = createClient();
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages((data as ContactMsg[]) || []);
    setLoading(false);
  }

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

  const unreadCount = messages.filter((m) => !m.read).length;
  const selectedMsg = messages.find((m) => m.id === selected);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Messages ({messages.length})</h1>
        {unreadCount > 0 && (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">{unreadCount} new</span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Message list */}
          <div className="md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
            {messages.map((msg) => (
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
