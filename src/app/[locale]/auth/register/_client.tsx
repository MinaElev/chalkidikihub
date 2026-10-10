'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/logger';
import { AuthShell } from '@/legacy/components/auth/AuthShell';
import {
  Field, PasswordField, PhoneField, StrengthMeter, SubmitButton, Alert,
  passwordScore, normalizePhone, isValidPhone, DEFAULT_DIAL,
} from '@/legacy/components/auth/fields';
import type { SiteStats } from '@/lib/site-stats';

export default function RegisterClient({ stats }: { stats: SiteStats }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dial, setDial] = useState(DEFAULT_DIAL);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Honeypot check — bots fill hidden fields
    if (honeypot) {
      setError(t('register.failed'));
      return;
    }

    // Phone is now required: it is the channel guests actually reach owners on.
    if (!isValidPhone(phone)) {
      setError(t('register.phoneInvalid'));
      return;
    }

    setLoading(true);

    // Rate limit check
    const rateRes = await fetch('/api/auth/rate-limit', { method: 'POST' });
    if (!rateRes.ok) {
      const data = await rateRes.json();
      setError(data.error || t('register.tooMany'));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Stored in E.164 so it matches the existing phone values and stays
        // usable in tel: links regardless of how the owner typed it.
        data: { full_name: fullName, phone: normalizePhone(dial, phone) },
      },
    });

    if (error) {
      logEvent('error', 'error', 'Registration failed', { email, error: error.message });
      setError(error.message);
      setLoading(false);
      return;
    }

    logEvent('user_action', 'info', 'New user registered', { email });
    // Supabase email confirmation is OFF — user is auto-logged-in. Our own
    // 4-digit code flow takes over: send the code, then ask for it.
    await fetch('/api/auth/send-verification', { method: 'POST' }).catch(() => {});
    // Admin heads-up. Fire-and-forget and deliberately not awaited: a mail
    // problem must never hold up the person who just signed up.
    fetch('/api/auth/notify-new-user', { method: 'POST' }).catch(() => {});
    router.push('/auth/verify');
  }

  const score = passwordScore(password);

  return (
    <AuthShell
      asideTitle={t('register.asideTitle')}
      asideSub={t('register.asideSub')}
      bullets={[t('register.b1'), t('register.b2'), t('register.b3')]}
      stats={[
        { value: `${stats.listings}`, label: t('stats.listings') },
        { value: `${stats.villages}`, label: t('stats.villages') },
        { value: `${stats.languages}`, label: t('stats.languages') },
      ]}
    >
      <div className="mb-7">
        <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{t('register.title')}</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          {t('register.haveAccount')}{' '}
          <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">
            {t('register.signIn')}
          </Link>
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Honeypot — invisible to users, bots fill it */}
        <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label>Website</label>
          <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        </div>

        <Field
          id="fullName"
          label={t('register.fullName')}
          icon={User}
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t('register.fullNamePlaceholder')}
        />
        <Field
          id="email"
          label={t('common.email')}
          icon={Mail}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
        <PhoneField
          id="phone"
          label={t('register.phone')}
          help={t('register.phoneHelp')}
          placeholder={t('register.phonePlaceholder')}
          countryCodeLabel={t('register.countryCode')}
          dial={dial}
          onDialChange={setDial}
          value={phone}
          onChange={setPhone}
        />
        <div className="space-y-2">
          <PasswordField
            id="password"
            label={t('common.password')}
            icon={Lock}
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('register.passwordPlaceholder')}
            showLabel={t('common.showPassword')}
            hideLabel={t('common.hidePassword')}
          />
          <StrengthMeter score={score} labels={[t('strength.weak'), t('strength.medium'), t('strength.strong')]} />
        </div>

        <div className="pt-1">
          <SubmitButton loading={loading}>{t('register.submit')}</SubmitButton>
        </div>

        <p className="text-[11.5px] text-gray-400 text-center leading-relaxed">
          {t.rich('register.terms', {
            terms: (chunks) => <Link href="/terms" className="underline hover:text-gray-600">{chunks}</Link>,
            privacy: (chunks) => <Link href="/privacy" className="underline hover:text-gray-600">{chunks}</Link>,
          })}
        </p>
      </form>
    </AuthShell>
  );
}
