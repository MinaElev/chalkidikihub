'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Loader2 } from 'lucide-react';
import { trackEvent } from '@/components/layout/TrafficCounter';

export type SimilarStay = { slug: string; name: string; image: string | null; price: string | null; guests: string };

/**
 * Shown after a request: other stays free on the same dates. The visitor taps
 * the ones they like and sends the same request to them with one button;
 * nothing is sent without that tap.
 */
export function SimilarStays({
  stays, offer, labels,
}: {
  stays: SimilarStay[];
  /** Server-signed copy of the request, accepted by /api/inquiry/also. */
  offer: string;
  labels: { title: string; intro: string; send: string; sent: string; error: string; sending: string };
}) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  if (state === 'done') {
    return (
      <p role="status" className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />{labels.sent}
      </p>
    );
  }

  async function send() {
    setState('sending');
    try {
      const res = await fetch('/api/inquiry/also', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer, slugs: chosen }),
      });
      const json = (await res.json().catch(() => ({}))) as { sent?: number };
      if (res.ok) for (let i = 0; i < (json.sent ?? chosen.length); i++) trackEvent('inquiry_similar');
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  const toggle = (slug: string) => setChosen((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug]));

  return (
    <section aria-labelledby="similar-title" className="space-y-3">
      <div>
        <h3 id="similar-title" className="font-semibold text-slate-900">{labels.title}</h3>
        <p className="mt-0.5 text-sm text-slate-600">{labels.intro}</p>
      </div>
      <ul className="space-y-2">
        {stays.map((s) => {
          const on = chosen.includes(s.slug);
          return (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => toggle(s.slug)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-2 text-left transition ${on ? 'border-sea-500 bg-sea-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- already an optimizer URL
                  <img src={s.image} alt="" width={64} height={64} className="size-16 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="size-16 shrink-0 rounded-lg bg-slate-100" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-semibold text-slate-900">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{[s.guests, s.price].filter(Boolean).join(' · ')}</span>
                </span>
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-sea-600 bg-sea-600 text-white' : 'border-slate-300 bg-white'}`}>
                  {on && <Check className="size-4" aria-hidden />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={send}
        disabled={!chosen.length || state === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sea-600 px-4 py-3 font-semibold text-white hover:bg-sea-700 disabled:opacity-50"
      >
        {state === 'sending' && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {state === 'sending' ? labels.sending : labels.send.replace('{count}', String(chosen.length))}
      </button>
      {state === 'error' && <p role="alert" className="text-sm text-red-700">{labels.error}</p>}
    </section>
  );
}
