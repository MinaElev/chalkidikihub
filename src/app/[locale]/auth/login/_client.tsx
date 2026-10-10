'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/logger';
import { AuthShell } from '@/legacy/components/auth/AuthShell';
import { Field, PasswordField, SubmitButton, Alert } from '@/legacy/components/auth/fields';
import type { SiteStats } from '@/lib/site-stats';

export default function LoginClient({ stats }: { stats: SiteStats }) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      logEvent('error', 'warning', 'Login failed', { email, error: error.message });
      setError(error.message);
      setLoading(false);
      return;
    }

    logEvent('user_action', 'info', 'User logged in', { email });
    // Check role for redirect
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'superadmin') {
        router.push('/admin');
        return;
      }
    }

    router.push('/dashboard');
  }

  async function handleForgotPassword() {
    if (!email) {
      setError(t('login.enterEmailFirst'));
      return;
    }
    setError('');
    setResetSending(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('common.somethingWrong'));
      } else {
        setResetSent(true);
      }
    } catch {
      setError(t('common.somethingWrong'));
    }
    setResetSending(false);
  }

  return (
    <AuthShell
      asideTitle={t('login.asideTitle')}
      asideSub={t('login.asideSub')}
      bullets={[t('login.b1'), t('login.b2'), t('login.b3')]}
      stats={[
        { value: `${stats.listings}`, label: t('stats.listings') },
        { value: `${stats.villages}`, label: t('stats.villages') },
        { value: `${stats.languages}`, label: t('stats.languages') },
      ]}
      trust={{ encrypted: t('common.encrypted'), gdpr: t('common.gdpr') }}
    >
      <div className="mb-8">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] font-semibold uppercase tracking-[0.1em] mb-4">
          {t('login.eyebrow')}
        </span>
        <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight">{t('login.title')}</h1>
        <p className="text-sm text-gray-500 mt-1.5">
          {t('login.noAccount')}{' '}
          <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">
            {t('login.createAccount')}
          </Link>
        </p>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      {resetSent && <Alert tone="success">{t('login.resetSent', { email })}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <PasswordField
          id="password"
          label={t('common.password')}
          icon={Lock}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          showLabel={t('common.showPassword')}
          hideLabel={t('common.hidePassword')}
          // Always reachable: the old page only revealed this after two failed
          // attempts, which left a locked-out owner with no way forward.
          action={
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetSending}
              className="text-xs text-primary-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {t('login.forgot')}
            </button>
          }
        />
        <SubmitButton loading={loading}>{t('login.submit')}</SubmitButton>
      </form>
    </AuthShell>
  );
}
