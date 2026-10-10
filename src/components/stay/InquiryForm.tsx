'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export type InquiryLabels = Record<
  | 'formTitle' | 'formIntro' | 'formCheckIn' | 'formCheckOut' | 'formGuests' | 'formName' | 'formEmail'
  | 'formPhone' | 'formMessage' | 'formMessagePlaceholder' | 'formSubmit' | 'formSending' | 'formSuccess'
  | 'formError' | 'formTooMany' | 'formPrivacy',
  string
>;

type Status = 'idle' | 'sending' | 'done' | 'error' | 'limited';

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-200';

export function InquiryForm({ slug, locale, maxGuests, labels }: { slug: string; locale: string; maxGuests: number; labels: InquiryLabels }) {
  const [status, setStatus] = useState<Status>('idle');
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug, locale }),
      });
      setStatus(res.ok ? 'done' : res.status === 429 ? 'limited' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
        {labels.formSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{labels.formTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{labels.formIntro}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-medium text-slate-700">
          {labels.formCheckIn}
          <input type="date" name="checkIn" min={today} required className={field} />
        </label>
        <label className="text-xs font-medium text-slate-700">
          {labels.formCheckOut}
          <input type="date" name="checkOut" min={today} required className={field} />
        </label>
      </div>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formGuests}
        <input type="number" name="guests" min={1} max={Math.max(maxGuests, 1)} defaultValue={2} required className={field} />
      </label>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formName}
        <input name="name" autoComplete="name" required maxLength={120} className={field} />
      </label>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formEmail}
        <input type="email" name="email" autoComplete="email" required maxLength={200} className={field} />
      </label>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formPhone}
        <input type="tel" name="phone" autoComplete="tel" maxLength={30} className={field} />
      </label>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formMessage}
        <textarea name="message" rows={3} maxLength={2000} placeholder={labels.formMessagePlaceholder} className={field} />
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-xl bg-sea-600 px-4 py-3 font-semibold text-white hover:bg-sea-700 disabled:opacity-60"
      >
        {status === 'sending' ? labels.formSending : labels.formSubmit}
      </button>
      {(status === 'error' || status === 'limited') && (
        <p role="alert" className="text-sm text-red-700">
          {status === 'limited' ? labels.formTooMany : labels.formError}
        </p>
      )}
      <p className="text-xs text-slate-500">{labels.formPrivacy}</p>
    </form>
  );
}
