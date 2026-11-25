'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { PhoneField } from '@/components/forms/PhoneField';
import { trackEvent } from '@/components/layout/TrafficCounter';
import { nightsBetween, setStayDates, useStayDates } from './stayDates';
import { saveGuestDetails, useGuestDetails } from './guestDetails';
import { SimilarStays, type SimilarStay } from './SimilarStays';

export type InquiryLabels = Record<
  | 'formTitle' | 'formIntro' | 'formCheckIn' | 'formCheckOut' | 'formGuests' | 'formName' | 'formEmail'
  | 'formPhone' | 'formMessage' | 'formMessagePlaceholder' | 'formSubmit' | 'formSending' | 'formSuccess'
  | 'formError' | 'formTooMany' | 'formPrivacy'
  | 'formAddDate' | 'formPickCheckIn' | 'formPickCheckOut' | 'formClearDates' | 'formDone' | 'formMissingDates'
  | 'availabilityPrev' | 'availabilityNext'
  | 'datesFree' | 'datesBusy' | 'savedDetails' | 'savedClear' | 'similarTitle' | 'similarIntro' | 'similarSend' | 'similarSent',
  string
> & {
  /** "{count} nights" per plural category (one/few/many/other); functions can't cross from the server. */
  formNights: Partial<Record<Intl.LDMLPluralRule, string>>;
};

type Status = 'idle' | 'sending' | 'done' | 'error' | 'limited';

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-200';

export function InquiryForm({
  slug, locale, maxGuests, labels, blocked, searchLabel,
}: {
  slug: string;
  locale: string;
  maxGuests: number;
  labels: InquiryLabels;
  /** Booked nights from the stay's calendar, so they can't be picked. */
  blocked?: string[];
  /** Placeholder of the phone country search. */
  searchLabel?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [similar, setSimilar] = useState<{ stays: SimilarStay[]; offer: string } | null>(null);
  // Shared with the availability calendar: tapping dates there fills them in here.
  const dates = useStayDates();
  const [missingDatesTried, setMissingDates] = useState(false);
  // Dates picked later on the calendar clear the warning too.
  const missingDates = missingDatesTried && !(dates.checkIn && dates.checkOut);
  const plural = useMemo(() => new Intl.PluralRules(locale), [locale]);
  const nights = (count: number) => (labels.formNights[plural.select(count)] ?? labels.formNights.other ?? '{count}').replace('{count}', String(count));

  // Details from the visitor's last request on this device, until they type their own.
  const saved = useGuestDetails();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneKey, setPhoneKey] = useState(0);
  const usingSaved = Boolean(saved) && name === null && email === null;

  // With the stay's calendar at hand, say straight away whether the dates (perhaps kept from another stay) are free.
  const blockedSet = useMemo(() => new Set(blocked ?? []), [blocked]);
  const datesFree =
    blocked && dates.checkIn && dates.checkOut ? nightsBetween(dates.checkIn, dates.checkOut).every((n) => !blockedSet.has(n)) : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dates.checkIn || !dates.checkOut) {
      setMissingDates(true);
      return;
    }
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data, checkIn: dates.checkIn, checkOut: dates.checkOut, slug, locale,
          source: dates.fromCalendar ? 'calendar' : 'form',
        }),
      });
      if (res.ok) {
        trackEvent('inquiry');
        // Counted apart (not as an extra contact) to see how many requests the clickable calendar brings.
        if (dates.fromCalendar) trackEvent('inquiry_calendar');
        saveGuestDetails({ name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '' });
        const json = (await res.json().catch(() => ({}))) as { similar?: SimilarStay[]; offer?: string | null };
        if (json.similar?.length && json.offer) setSimilar({ stays: json.similar, offer: json.offer });
      }
      setStatus(res.ok ? 'done' : res.status === 429 ? 'limited' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="space-y-5">
        <div role="status" className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
          {labels.formSuccess}
        </div>
        {similar && (
          <SimilarStays
            stays={similar.stays}
            offer={similar.offer}
            labels={{
              title: labels.similarTitle, intro: labels.similarIntro, send: labels.similarSend, sent: labels.similarSent,
              error: labels.formError, sending: labels.formSending,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{labels.formTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{labels.formIntro}</p>
      </div>
      {/* One linked calendar: check-out can't be before check-in, and booked nights can't be picked. */}
      <div>
        <DateRangePicker
          checkIn={dates.checkIn}
          checkOut={dates.checkOut}
          onChange={(v) => { setStayDates({ ...v, fromCalendar: false }); if (v.checkIn && v.checkOut) setMissingDates(false); }}
          locale={locale}
          blocked={blocked}
          single
          invalid={missingDates}
          labels={{
            checkIn: labels.formCheckIn, checkOut: labels.formCheckOut, addDate: labels.formAddDate,
            pickCheckIn: labels.formPickCheckIn, pickCheckOut: labels.formPickCheckOut,
            clear: labels.formClearDates, done: labels.formDone, prev: labels.availabilityPrev, next: labels.availabilityNext,
            nights,
          }}
        />
        {missingDates && (
          <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="size-3 shrink-0" aria-hidden />{labels.formMissingDates}
          </p>
        )}
        {datesFree !== null && (
          <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${datesFree ? 'text-emerald-700' : 'text-amber-700'}`}>
            {datesFree ? <CheckCircle2 className="size-3.5 shrink-0" aria-hidden /> : <XCircle className="size-3.5 shrink-0" aria-hidden />}
            {datesFree ? labels.datesFree : labels.datesBusy}
          </p>
        )}
      </div>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formGuests}
        <input type="number" name="guests" min={1} max={Math.max(maxGuests, 1)} defaultValue={2} required className={field} />
      </label>
      {usingSaved && (
        <p className="text-xs text-slate-500">
          {labels.savedDetails}{' '}
          <button
            type="button"
            onClick={() => { saveGuestDetails(null); setName(''); setEmail(''); setPhoneKey((k) => k + 1); }}
            className="font-medium text-sea-700 underline underline-offset-2"
          >
            {labels.savedClear}
          </button>
        </p>
      )}
      <label className="block text-xs font-medium text-slate-700">
        {labels.formName}
        <input
          id="inquiry-name" name="name" autoComplete="name" required maxLength={120} className={field}
          value={name ?? saved?.name ?? ''} onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block text-xs font-medium text-slate-700">
        {labels.formEmail}
        <input
          id="inquiry-email" type="email" name="email" autoComplete="email" required maxLength={200} className={field}
          value={email ?? saved?.email ?? ''} onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <PhoneField
        key={phoneKey} name="phone" label={labels.formPhone} locale={locale} inputClassName={field} searchLabel={searchLabel}
        defaultValue={phoneKey === 0 ? saved?.phone : ''}
      />
      <label className="block text-xs font-medium text-slate-700">
        {labels.formMessage}
        <textarea name="message" rows={3} maxLength={2000} placeholder={labels.formMessagePlaceholder} className={field} />
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button
        id="inquiry-submit"
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
