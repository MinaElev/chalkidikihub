'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

type Status = 'available' | 'unavailable';

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-200';

/** The owner's answer: available (with an optional total price) or not, plus an optional message. */
export function InquiryReplyForm({
  token, initial, answered, nights,
}: {
  token: string;
  initial: Status;
  answered: { status: string; at: string } | null;
  nights: number | null;
}) {
  const [status, setStatus] = useState<Status>(initial);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'answered'>(answered ? 'answered' : 'idle');

  if (state === 'answered' || state === 'done') {
    const was = state === 'done' ? status : answered?.status;
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p>
          {state === 'done' ? 'Η απάντησή σας στάλθηκε στον επισκέπτη.' : `Έχετε ήδη απαντήσει${answered?.at ? ` (${answered.at})` : ''}.`}{' '}
          {was === 'available' ? 'Αν σας απαντήσει, το email του θα έρθει απευθείας σε εσάς.' : 'Ευχαριστούμε που απαντήσατε.'}
        </p>
      </div>
    );
  }

  async function send() {
    setState('sending');
    try {
      const res = await fetch(`/api/inquiry-reply/${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, price: status === 'available' ? price : '', message }),
      });
      setState(res.ok ? 'done' : res.status === 409 ? 'answered' : 'error');
    } catch {
      setState('error');
    }
  }

  const choice = (s: Status, label: string, Icon: typeof CheckCircle2, on: string) => (
    <button
      type="button"
      onClick={() => setStatus(s)}
      aria-pressed={status === s}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition ${status === s ? on : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
    >
      <Icon className="size-5" aria-hidden />{label}
    </button>
  );

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex gap-3">
        {choice('available', 'Είναι διαθέσιμο', CheckCircle2, 'border-emerald-500 bg-emerald-50 text-emerald-800')}
        {choice('unavailable', 'Δεν είναι διαθέσιμο', XCircle, 'border-slate-500 bg-slate-50 text-slate-800')}
      </div>
      {status === 'available' && (
        <label className="block text-sm font-medium text-slate-700">
          Συνολική τιμή για τη διαμονή{nights ? ` (${nights} βράδια)` : ''} σε € — προαιρετικό
          <input type="number" inputMode="numeric" min={1} value={price} onChange={(e) => setPrice(e.target.value)} className={field} placeholder="π.χ. 450" />
        </label>
      )}
      <label className="block text-sm font-medium text-slate-700">
        Μήνυμα προς τον επισκέπτη — προαιρετικό
        <textarea
          rows={4}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={field}
          placeholder={status === 'available' ? 'π.χ. Η τιμή περιλαμβάνει καθαριότητα. Καλέστε με στο 69…' : 'π.χ. Είμαστε ελεύθεροι από 10 Απριλίου.'}
        />
      </label>
      <p className="text-xs text-slate-500">Το υπόλοιπο email μεταφράζεται αυτόματα στη γλώσσα του επισκέπτη, αλλά το μήνυμά σας στέλνεται όπως το γράψετε. Αν ο επισκέπτης δεν μιλά ελληνικά, γράψτε το στα αγγλικά.</p>
      <button
        type="button"
        onClick={send}
        disabled={state === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sea-600 px-4 py-3 font-semibold text-white hover:bg-sea-700 disabled:opacity-60"
      >
        {state === 'sending' && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Αποστολή απάντησης στον επισκέπτη
      </button>
      {state === 'error' && <p role="alert" className="text-sm text-red-700">Δεν στάλθηκε. Δοκιμάστε ξανά σε λίγο ή απαντήστε απευθείας στο email του επισκέπτη.</p>}
    </div>
  );
}
