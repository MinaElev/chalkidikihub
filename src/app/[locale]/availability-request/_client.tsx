'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { CalendarDays, Users, Wallet, Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail, User, Search, Sparkles, MailCheck, Loader2, Minus, Plus } from 'lucide-react';
import { DateRangePicker, isoDate } from '@/components/forms/DateRangePicker';
import { hasSupabaseAuthCookie } from '@/lib/auth-cookie';
import { trackEvent } from '@/components/layout/TrafficCounter';

const AREA_KEYS = ['kassandra', 'sithonia', 'athos', 'mainland'] as const;
/** Budget per night. Stays on the site: median 100€, a quarter above 160€ (Nov 2026). */
const BUDGETS = [
  { key: 'any', min: '', max: '' },
  { key: 'upTo100', min: '', max: '100' },
  { key: 'upTo150', min: '', max: '150' },
  { key: 'over', min: '150', max: '' },
] as const;
const STORAGE_KEY = 'chub_availability_request_v1';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AvailabilityRequestClient({ initialArea }: { initialArea: string }) {
  const t = useTranslations('availabilityRequest');
  const locale = useLocale();
  const router = useRouter();
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [done, setDone] = useState<{ url: string; recipients: number; no_matches: boolean } | null>(null);

  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    area: AREA_KEYS.includes(initialArea as never) ? initialArea : '',
    check_in: '',
    check_out: '',
    adults: 2,
    children: 0,
    budget_min: '' as string,
    budget_max: '' as string,
    // No property type: owners are matched on area and guests only, so asking for it did nothing.
    notes: '',
    website: '', // honeypot
  });

  // Restore a previously-typed (but unsubmitted) form after mount. Done in an
  // effect — not a lazy initializer — to avoid an SSR/client hydration mismatch.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        delete saved.property_type; // drafts saved before the field was removed
        // Drafts from the old free-text budget: keep only a pair a button can show.
        if (!BUDGETS.some(b => b.min === String(saved.budget_min ?? '') && b.max === String(saved.budget_max ?? ''))) {
          saved.budget_min = '';
          saved.budget_max = '';
        }
        // Restoring from localStorage must happen after mount (see above), so setState in an effect is intended.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(f => ({
          ...f,
          ...saved,
          website: '', // never restore the honeypot
          // A valid area from the URL wins over a saved one.
          area: AREA_KEYS.includes(initialArea as never) ? initialArea : (saved.area ?? f.area),
        }));
      }
    } catch {
      // ignore corrupt or unavailable storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save the form locally so an accidental navigation doesn't lose it.
  useEffect(() => {
    if (done) return;
    const touched =
      form.guest_name || form.guest_email || form.guest_phone ||
      form.check_in || form.check_out || form.notes ||
      form.budget_min || form.budget_max;
    try {
      if (touched) {
        const { website: _hp, ...rest } = form;
        void _hp;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      }
    } catch {
      // ignore quota / unavailable storage
    }
  }, [form, done]);

  // Warn before navigating away if the form has been touched and not submitted.
  // Modern browsers ignore custom message text, but still show their generic
  // "Leave site?" prompt when returnValue is set.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (submitting || done) return;
      const filled =
        form.guest_name.trim() ||
        form.guest_email.trim() ||
        form.guest_phone.trim() ||
        form.check_in ||
        form.check_out ||
        form.notes.trim();
      if (!filled) return;
      e.preventDefault();
      e.returnValue = t('beforeUnloadWarning');
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [form, submitting, done, t]);

  // Signed-in visitors: fill name, email and phone from their account, only
  // where the field is still empty (a restored draft wins).
  useEffect(() => {
    if (!hasSupabaseAuthCookie()) return;
    let alive = true;
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((me: { signedIn?: boolean; name?: string; email?: string; phone?: string } | null) => {
        if (!alive || !me?.signedIn) return;
        setForm((f) => ({
          ...f,
          guest_name: f.guest_name || me.name || '',
          guest_email: f.guest_email || me.email || '',
          guest_phone: f.guest_phone || me.phone || '',
        }));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Local date, not toISOString(): that is UTC and reads as "yesterday" just after midnight in Greece.
  const minCheckIn = useMemo(() => isoDate(new Date()), []);

  // Live, per-field validation (only flags fields the user has actually filled —
  // empties are handled by the native `required` attributes). Mirrors the
  // server-side checks so problems surface before the round-trip.
  const fieldErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    // The area chips and the calendar are buttons, so `required` can't catch these.
    if (!form.area) errs.area = t('error.invalid_area');
    if (!form.check_in || !form.check_out) errs.dates = t('missingDates');
    const name = form.guest_name.trim();
    if (name && name.length < 2) errs.guest_name = t('error.missing_name');
    const email = form.guest_email.trim();
    if (email && !EMAIL_RE.test(email)) errs.guest_email = t('error.invalid_email');
    if (form.guest_phone.trim()) {
      const digits = form.guest_phone.replace(/\D/g, '');
      if (digits.length < 6 || digits.length > 18) errs.guest_phone = t('error.invalid_phone');
    }
    if (form.check_in && form.check_in < minCheckIn) errs.check_in = t('error.checkin_in_past');
    if (form.check_in && form.check_out && form.check_out <= form.check_in) {
      errs.check_out = t('error.checkout_before_checkin');
    }
    const bmin = form.budget_min !== '' ? Number(form.budget_min) : null;
    const bmax = form.budget_max !== '' ? Number(form.budget_max) : null;
    if (bmin !== null && bmax !== null && bmax < bmin) errs.budget_max = t('error.budget_order');
    return errs;
  }, [form, t, minCheckIn]);

  // Compact live summary ("5 nights · 3 guests") once valid dates are picked.
  const summary = useMemo(() => {
    if (!form.check_in || !form.check_out || form.check_out <= form.check_in) return null;
    const nights = Math.max(
      1,
      Math.round((new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86_400_000),
    );
    const guests = (Number(form.adults) || 0) + (Number(form.children) || 0);
    return { nights, guests };
  }, [form.check_in, form.check_out, form.adults, form.children]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAttempted(true);
    if (Object.keys(fieldErrors).length > 0) {
      const first = document.querySelector('[data-field-error="1"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    const startedAt = Date.now();
    try {
      const res = await fetch('/api/availability-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          locale,
          elapsed: mountedAt.current ? Date.now() - mountedAt.current : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(messageFor(t, json.error) || json.message || t('error.generic'));
        setSubmitting(false);
        return;
      }
      trackEvent('availability_request');
      // The API responds almost instantly (the emails are sent afterwards). Hold
      // the 3-step overlay long enough for all steps to play through and read as
      // completed before we reveal the success screen.
      const MIN_OVERLAY_MS = 3600;
      const remaining = MIN_OVERLAY_MS - (Date.now() - startedAt);
      if (remaining > 0) await new Promise(r => setTimeout(r, remaining));
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      setSubmitting(false);
      setDone({
        url: json.dashboard_url,
        recipients: json.recipients_count,
        no_matches: !!json.no_matches,
      });
    } catch {
      setError(t('error.network'));
      setSubmitting(false);
    }
  }

  if (submitting) {
    return <LoadingOverlay t={t} />;
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {done.no_matches
              ? t('success.titleNoMatch')
              : t('success.titleSent', { count: done.recipients })}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {done.no_matches ? t('success.bodyNoMatch') : t('success.bodySent')}
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <MailCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-900">
                <strong>{t('success.emailTitle')}</strong> {t('success.emailBody')}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>{t('success.importantTitle')}</strong> {t('success.importantBody')}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(done.url as never)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition"
          >
            {t('success.seeResponses')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-gray-600 text-lg leading-relaxed">{t('subtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          aria-hidden="true"
        />

        {/* Area: one tap instead of a dropdown */}
        <Field group label={t('areaLabel')} icon={MapPin} required error={attempted ? fieldErrors.area : undefined}>
          <div className="grid grid-cols-2 gap-2">
            {AREA_KEYS.map(a => (
              <button
                key={a}
                type="button"
                aria-pressed={form.area === a}
                onClick={() => setForm(f => ({ ...f, area: a }))}
                className={chip(form.area === a, 'px-2 py-2.5 leading-tight')}
              >
                {t(`area.${a}`)}
              </button>
            ))}
          </div>
        </Field>

        {/* Dates: one linked calendar, check-out can't be before check-in */}
        <Field group label={t('datesLabel')} icon={CalendarDays} required error={attempted ? (fieldErrors.dates || fieldErrors.check_in || fieldErrors.check_out) : undefined}>
          <DateRangePicker
            checkIn={form.check_in}
            checkOut={form.check_out}
            onChange={({ checkIn, checkOut }) => setForm(f => ({ ...f, check_in: checkIn, check_out: checkOut }))}
            locale={locale}
            invalid={attempted && Boolean(fieldErrors.dates || fieldErrors.check_in || fieldErrors.check_out)}
            labels={{
              checkIn: t('checkIn'), checkOut: t('checkOut'), addDate: t('addDate'),
              pickCheckIn: t('pickCheckIn'), pickCheckOut: t('pickCheckOut'),
              clear: t('clearDates'), done: t('done'), prev: t('prevMonth'), next: t('nextMonth'),
              nights: (count) => t('nights', { count }),
            }}
          />
        </Field>

        {/* Guests: steppers instead of number boxes */}
        <div className="grid grid-cols-2 gap-4">
          <Field group label={t('adults')} icon={Users} required>
            <Stepper value={form.adults} min={1} max={20} onChange={v => setForm(f => ({ ...f, adults: v }))} less={t('fewer')} more={t('more')} />
          </Field>
          <Field group label={t('children')} icon={Users}>
            <Stepper value={form.children} min={0} max={15} onChange={v => setForm(f => ({ ...f, children: v }))} less={t('fewer')} more={t('more')} />
          </Field>
        </div>

        {/* Budget */}
        {/* Budget: preset buttons, one tap. Still sent as budget_min / budget_max, so owners' emails read as before. */}
        <Field group label={t('budgetLabel')} icon={Wallet}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BUDGETS.map(b => {
              const on = form.budget_min === b.min && form.budget_max === b.max;
              const label = b.key === 'any' ? t('budgetAny') : b.key === 'over' ? t('budgetOver', { amount: b.min }) : t('budgetUpTo', { amount: b.max });
              return (
                <button
                  key={b.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setForm(f => ({ ...f, budget_min: b.min, budget_max: b.max }))}
                  className={chip(on, 'px-2 py-2.5 leading-tight')}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Field>

        <hr className="border-gray-100" />

        {/* Contact */}
        <Field label={t('nameLabel')} icon={User} required error={attempted ? fieldErrors.guest_name : undefined}>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.guest_name}
            onChange={e => setForm({ ...form, guest_name: e.target.value })}
            className="input"
            placeholder={t('namePlaceholder')}
          />
        </Field>

        <Field label={t('emailLabel')} icon={Mail} required error={attempted ? fieldErrors.guest_email : undefined}>
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={form.guest_email}
            onChange={e => setForm({ ...form, guest_email: e.target.value })}
            className="input"
            placeholder="email@example.com"
          />
        </Field>

        <Field label={t('phoneLabel')} icon={Phone} required error={attempted ? fieldErrors.guest_phone : undefined}>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={form.guest_phone}
            onChange={e => setForm({ ...form, guest_phone: e.target.value })}
            className="input"
            placeholder={t('phonePlaceholder')}
          />
        </Field>

        {/* Notes */}
        <Field label={t('notesLabel')}>
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className="input min-h-[100px]"
            placeholder={t('notesPlaceholder')}
            maxLength={1000}
          />
        </Field>

        {summary && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-primary-50/60 border border-primary-100 rounded-xl py-2.5">
            <CalendarDays className="w-4 h-4 text-primary-600" />
            <span>{t('summaryBar', { nights: summary.nights, guests: summary.guests })}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? t('submitting') : (
            <>
              <Send className="w-4 h-4" />
              {t('submit')}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center leading-relaxed">{t('consent')}</p>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 0.95rem;
          background: #fff;
          color: #111827;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }
      `}</style>
    </div>
  );
}

function LoadingOverlay({ t }: { t: (key: string) => string }) {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    // Advance through the steps, then mark the last one done (activeStep === 3)
    // so all three read as completed while the success screen is revealed.
    const timers = [
      setTimeout(() => setActiveStep(1), 1400),
      setTimeout(() => setActiveStep(2), 2600),
      setTimeout(() => setActiveStep(3), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const allDone = activeStep >= 3;

  const steps = [
    { icon: Search, label: t('loading.step1') },
    { icon: Sparkles, label: t('loading.step2') },
    { icon: MailCheck, label: t('loading.step3') },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="relative mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                allDone ? 'bg-emerald-100' : 'bg-primary-100'
              }`}
            >
              {allDone ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
              )}
            </div>
            {!allDone && (
              <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping opacity-30" />
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {allDone ? t('loading.completedTitle') : t('loading.title')}
          </h1>
          <p className="text-sm text-gray-500">
            {allDone ? t('loading.completedSubtitle') : t('loading.subtitle')}
          </p>
        </div>

        <ol className="space-y-3">
          {steps.map((s, i) => {
            const state: 'done' | 'active' | 'pending' =
              i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending';
            const Icon = s.icon;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  state === 'done'
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : state === 'active'
                      ? 'border-primary-200 bg-primary-50/60 shadow-sm'
                      : 'border-gray-100 bg-gray-50/40 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    state === 'done'
                      ? 'bg-emerald-500 text-white'
                      : state === 'active'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {state === 'done' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : state === 'active' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    state === 'done'
                      ? 'text-emerald-800'
                      : state === 'active'
                        ? 'text-gray-900'
                        : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

const chip = (on: boolean, size: string) =>
  `rounded-xl ${size} text-sm font-medium transition ${on ? 'bg-sea-600 text-white shadow-sm' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-sea-300'}`;

function Stepper({ value, min, max, onChange, less, more }: { value: number; min: number; max: number; onChange: (v: number) => void; less: string; more: string }) {
  const btn = 'flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent';
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-0.5">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={less}>
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="text-base font-semibold tabular-nums text-gray-900" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={more}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  error,
  group,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  error?: string;
  /** Buttons inside: a <label> would forward every click on it to the first button. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const Tag = group ? 'div' : 'label';
  return (
    <Tag className="block" data-field-error={error ? '1' : undefined} {...(group ? { role: 'group', 'aria-label': label } : {})}>
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span>{label}{required && <span className="text-red-500"> *</span>}</span>
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </Tag>
  );
}

function messageFor(t: (key: string) => string, code: string): string | null {
  if (!code) return null;
  try {
    return t(`error.${code}`);
  } catch {
    return null;
  }
}
