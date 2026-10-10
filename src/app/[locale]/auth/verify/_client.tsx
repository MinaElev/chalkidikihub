'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/logger';
import { Loader2, MailCheck } from 'lucide-react';
import { AuthShell } from '@/legacy/components/auth/AuthShell';
import { OtpInput, SubmitButton, Alert } from '@/legacy/components/auth/fields';

const CODE_LENGTH = 4;

export default function VerifyClient() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login');
        return;
      }
      setEmail(data.user.email || '');
      const { data: profile } = await supabase
        .from('profiles')
        .select('email_verified_at')
        .eq('id', data.user.id)
        .single();
      if (profile?.email_verified_at) {
        router.push('/dashboard');
        return;
      }
      setChecking(false);
    });
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function submitCode(value: string) {
    if (value.length !== CODE_LENGTH || loading) return;
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: value }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || t('common.somethingWrong'));
      if (data.expired) setCode('');
      setLoading(false);
      return;
    }

    logEvent('user_action', 'info', 'Email verified', { email });
    router.push('/dashboard');
  }

  async function handleResend() {
    setError('');
    setInfo('');
    const res = await fetch('/api/auth/send-verification', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t('verify.failedSend'));
      return;
    }
    setCooldown(60);
    setInfo(t('verify.sent'));
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <AuthShell
      asideTitle={t('verify.asideTitle')}
      asideSub={t('verify.asideSub')}
      bullets={[t('verify.b1'), t('verify.b2'), t('verify.b3')]}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 ring-1 ring-primary-100 flex items-center justify-center">
          <MailCheck className="w-7 h-7 text-primary-600" />
        </div>
        <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-2">{t('verify.title')}</h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {t('verify.sentTo')}<br />
          <strong className="text-gray-900">{email}</strong>
          {' '}{t('verify.expires')}
        </p>

        {error && <Alert tone="error">{error}</Alert>}
        {info && <Alert tone="success">{info}</Alert>}

        <form onSubmit={(e) => { e.preventDefault(); submitCode(code); }}>
          <OtpInput
            value={code}
            onChange={setCode}
            label={t('verify.codeLabel')}
            length={CODE_LENGTH}
            // Submitting on the 4th digit saves a tap; the button stays for
            // anyone who pastes and for keyboard submits.
            onComplete={submitCode}
          />
          <div className="mt-7">
            <SubmitButton loading={loading} disabled={code.length !== CODE_LENGTH}>
              {t('verify.submit')}
            </SubmitButton>
          </div>
        </form>

        <p className="mt-5 text-[13px] text-gray-500">
          {t('verify.noCode')}{' '}
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-primary-600 font-semibold hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {cooldown > 0 ? t('verify.resendIn', { s: cooldown }) : t('verify.resend')}
          </button>
        </p>

        {/* Wrong address typed at signup was previously a dead end. */}
        <button onClick={handleSignOut} className="mt-6 text-xs text-gray-400 hover:text-gray-600">
          {t('verify.wrongEmail')}
        </button>
      </div>
    </AuthShell>
  );
}
