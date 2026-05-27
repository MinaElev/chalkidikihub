'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { CalendarDays, Users, Wallet, Home, Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail, User, Search, Sparkles, MailCheck, Loader2 } from 'lucide-react';

const AREA_KEYS = ['kassandra', 'sithonia', 'athos', 'mainland'] as const;
const PROPERTY_TYPE_KEYS = ['', 'rooms', 'studio', 'apartment', 'house', 'villa'] as const;

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
    budget_min: '',
    budget_max: '',
    property_type: '',
    notes: '',
    website: '', // honeypot
  });

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

  const minCheckIn = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const minCheckOut = useMemo(() => {
    if (!form.check_in) return minCheckIn;
    const d = new Date(form.check_in);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [form.check_in, minCheckIn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
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

        {/* Area */}
        <Field label={t('areaLabel')} icon={MapPin} required>
          <select
            required
            value={form.area}
            onChange={e => setForm({ ...form, area: e.target.value })}
            className="input"
          >
            <option value="">{t('areaPlaceholder')}</option>
            {AREA_KEYS.map(a => (
              <option key={a} value={a}>{t(`area.${a}`)}</option>
            ))}
          </select>
        </Field>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('checkIn')} icon={CalendarDays} required>
            <input
              type="date"
              required
              min={minCheckIn}
              value={form.check_in}
              onChange={e => {
                const v = e.target.value;
                setForm(f => ({
                  ...f,
                  check_in: v,
                  check_out: f.check_out && f.check_out <= v ? '' : f.check_out,
                }));
              }}
              className="input"
            />
          </Field>
          <Field label={t('checkOut')} icon={CalendarDays} required>
            <input
              type="date"
              required
              min={minCheckOut}
              value={form.check_out}
              onChange={e => setForm({ ...form, check_out: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        {/* Guests */}
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('adults')} icon={Users} required>
            <input
              type="number"
              required
              min={1}
              max={20}
              value={form.adults}
              onChange={e => setForm({ ...form, adults: parseInt(e.target.value, 10) || 1 })}
              className="input"
            />
          </Field>
          <Field label={t('children')} icon={Users}>
            <input
              type="number"
              min={0}
              max={15}
              value={form.children}
              onChange={e => setForm({ ...form, children: parseInt(e.target.value, 10) || 0 })}
              className="input"
            />
          </Field>
        </div>

        {/* Property type */}
        <Field label={t('propertyTypeLabel')} icon={Home}>
          <select
            value={form.property_type}
            onChange={e => setForm({ ...form, property_type: e.target.value })}
            className="input"
          >
            {PROPERTY_TYPE_KEYS.map(p => (
              <option key={p} value={p}>{p === '' ? t('propertyType.any') : t(`propertyType.${p}`)}</option>
            ))}
          </select>
        </Field>

        {/* Budget */}
        <Field label={t('budgetLabel')} icon={Wallet}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder={t('budgetFrom')}
              min={0}
              value={form.budget_min}
              onChange={e => setForm({ ...form, budget_min: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder={t('budgetTo')}
              min={0}
              value={form.budget_max}
              onChange={e => setForm({ ...form, budget_max: e.target.value })}
              className="input"
            />
          </div>
        </Field>

        <hr className="border-gray-100" />

        {/* Contact */}
        <Field label={t('nameLabel')} icon={User} required>
          <input
            type="text"
            required
            value={form.guest_name}
            onChange={e => setForm({ ...form, guest_name: e.target.value })}
            className="input"
            placeholder={t('namePlaceholder')}
          />
        </Field>

        <Field label={t('emailLabel')} icon={Mail} required>
          <input
            type="email"
            required
            value={form.guest_email}
            onChange={e => setForm({ ...form, guest_email: e.target.value })}
            className="input"
            placeholder="email@example.com"
          />
        </Field>

        <Field label={t('phoneLabel')} icon={Phone} required>
          <input
            type="tel"
            required
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
    // Advance through steps. Last step stays "active" until the request resolves
    // (parent unmounts this overlay on success/error).
    const timers = [
      setTimeout(() => setActiveStep(1), 1400),
      setTimeout(() => setActiveStep(2), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

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
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-primary-200 animate-ping opacity-30" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{t('loading.title')}</h1>
          <p className="text-sm text-gray-500">{t('loading.subtitle')}</p>
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

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span>{label}{required && <span className="text-red-500"> *</span>}</span>
      </div>
      {children}
    </label>
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
