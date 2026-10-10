'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export type MessageChannel = 'direct' | 'email' | 'whatsapp' | 'airbnb' | 'booking' | 'system';

export const CHANNEL_META: Record<MessageChannel, { el: string; en: string; cls: string }> = {
  direct:   { el: 'Direct',   en: 'Direct',    cls: 'bg-slate-100 text-slate-700' },
  email:    { el: 'Email',    en: 'Email',     cls: 'bg-sky-100 text-sky-700' },
  whatsapp: { el: 'WhatsApp', en: 'WhatsApp',  cls: 'bg-emerald-100 text-emerald-700' },
  airbnb:   { el: 'Airbnb',   en: 'Airbnb',    cls: 'bg-rose-100 text-rose-700' },
  booking:  { el: 'Booking',  en: 'Booking',   cls: 'bg-indigo-100 text-indigo-700' },
  system:   { el: 'System',   en: 'System',    cls: 'bg-violet-100 text-violet-700' },
};

export interface ComposeContext {
  listing_id: string;
  booking_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  direction?: 'inbound' | 'outbound';
}

export function MessageComposer({
  context, el, onSent, compact = false,
}: {
  context: ComposeContext;
  el: boolean;
  onSent?: () => void;
  compact?: boolean;
}) {
  const [channel, setChannel] = useState<MessageChannel>('direct');
  const [direction, setDirection] = useState<'inbound' | 'outbound'>(context.direction || 'outbound');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);

  const t = {
    channel: el ? 'Κανάλι' : 'Channel',
    direction: el ? 'Κατεύθυνση' : 'Direction',
    outbound: el ? 'Προς guest (εξερχόμενο)' : 'To guest (outbound)',
    inbound: el ? 'Από guest (εισερχόμενο)' : 'From guest (inbound)',
    subject: el ? 'Θέμα' : 'Subject',
    body: el ? 'Μήνυμα' : 'Message',
    send: el ? 'Αποστολή / Καταχώρηση' : 'Send / Log',
    sending: el ? 'Αποθηκεύεται…' : 'Saving…',
    sent: el ? 'Αποθηκεύτηκε' : 'Saved',
    errorBody: el ? 'Γράψε κάτι στο μήνυμα' : 'Message body required',
    notSignedIn: el ? 'Δεν είσαι συνδεδεμένος' : 'Not signed in',
    hintOutbound: el ? 'Log για δική σου εξερχόμενη επικοινωνία. Το σύστημα δεν στέλνει ακόμη email/SMS — το μήνυμα αποθηκεύεται στο thread.' : 'Log your own outbound reply. System does not yet send email/SMS — the message is stored in the thread.',
    hintInbound: el ? 'Καταχώρησε μήνυμα που έλαβες εξωτερικά (π.χ. από email) για να μείνει στο thread.' : 'Record a message you received externally (e.g. via email) so it stays in the thread.',
  };

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setJustSent(false);
    if (!body.trim()) { setError(t.errorBody); return; }

    setSending(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError(t.notSignedIn); return; }

      const { error: insErr } = await supabase.from('pms_messages').insert({
        owner_id: user.id,
        listing_id: context.listing_id,
        booking_id: context.booking_id,
        direction,
        channel,
        guest_name: context.guest_name,
        guest_email: context.guest_email,
        subject: subject.trim() || null,
        body: body.trim(),
        is_automated: false,
        read_at: direction === 'inbound' ? new Date().toISOString() : null,
      });

      if (insErr) { setError(insErr.message); return; }
      setBody('');
      setSubject('');
      setJustSent(true);
      setTimeout(() => setJustSent(false), 3000);
      onSent?.();
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSend} className={compact ? 'space-y-2' : 'space-y-3'}>
      {!compact && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.direction}</div>
              <div className="flex gap-1.5">
                {(['outbound', 'inbound'] as const).map(d => (
                  <button type="button" key={d}
                    onClick={() => setDirection(d)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
                      direction === d ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                    {d === 'outbound' ? t.outbound : t.inbound}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.channel}</div>
              <select value={channel} onChange={e => setChannel(e.target.value as MessageChannel)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700">
                {(Object.keys(CHANNEL_META) as MessageChannel[]).filter(c => c !== 'system').map(c => (
                  <option key={c} value={c}>{el ? CHANNEL_META[c].el : CHANNEL_META[c].en}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.subject}</div>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700" />
          </div>
        </>
      )}
      <div>
        {!compact && <div className="text-xs font-semibold text-slate-700 mb-1.5">{t.body}</div>}
        <textarea rows={compact ? 3 : 5} value={body} onChange={e => setBody(e.target.value)}
          placeholder={compact ? (el ? 'Γράψε απάντηση…' : 'Write a reply…') : undefined}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition" />
      </div>
      {!compact && (
        <p className="text-xs text-slate-500">{direction === 'outbound' ? t.hintOutbound : t.hintInbound}</p>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {justSent && (
            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> {t.sent}
            </div>
          )}
          {error && (
            <div className="inline-flex items-center gap-2 text-xs text-rose-700 font-mono">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
        <button type="submit" disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-sm transition-colors text-sm">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
