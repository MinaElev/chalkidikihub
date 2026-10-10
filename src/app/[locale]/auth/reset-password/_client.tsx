'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Loader2, KeyRound, CheckCircle2, Lock, Check } from 'lucide-react';
import { AuthShell } from '@/legacy/components/auth/AuthShell';
import { PasswordField, StrengthMeter, SubmitButton, Alert, passwordScore } from '@/legacy/components/auth/fields';

export default function ResetPasswordClient() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  // Kept as a flag, not a translated string: the effect below must not depend
  // on `t`, or a changed translator identity would re-run verifyOtp.
  const [invalidLink, setInvalidLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // The recovery email links straight here with ?token_hash=...&type=recovery.
  // We verify the OTP, which establishes a session, then let the user pick a new
  // password. Falls back to the legacy hash-based flow (#access_token=...) for any
  // older emails still in flight.
  useEffect(() => {
    const supabase = createClient();
    if (typeof window === 'undefined') return;

    const query = new URLSearchParams(window.location.search);
    const token_hash = query.get('token_hash');
    const queryType = query.get('type');

    if (token_hash && queryType === 'recovery') {
      supabase.auth.verifyOtp({ token_hash, type: 'recovery' }).then(({ error }) => {
        if (error) setError(error.message);
        else setReady(true);
        // Clean the URL so the token isn't visible in the address bar
        window.history.replaceState(null, '', window.location.pathname);
      });
      return;
    }

    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');
    const hashType = hashParams.get('type');

    if (access_token && refresh_token && hashType === 'recovery') {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) setError(error.message);
        else setReady(true);
        window.history.replaceState(null, '', window.location.pathname);
      });
      return;
    }

    // Maybe the user already has a session (e.g. logged-in user opened the page)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setInvalidLink(true);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError(t('reset.tooShort'));
      return;
    }
    if (password !== confirm) {
      setError(t('reset.mismatch'));
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updErr) {
      setError(updErr.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/auth/login'), 2500);
  }

  const matches = confirm.length > 0 && password === confirm;
  const shownError = error || (invalidLink ? t('reset.invalidLink') : '');

  return (
    <AuthShell
      asideTitle={t('reset.asideTitle')}
      asideSub={t('reset.asideSub')}
      bullets={[t('reset.b1'), t('reset.b2'), t('reset.b3')]}
      trust={{ encrypted: t('common.encrypted'), gdpr: t('common.gdpr') }}
    >
      <div className="mb-7 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent-400/15 ring-1 ring-accent-300/50 flex items-center justify-center">
          <KeyRound className="w-7 h-7 text-accent-600" />
        </div>
        <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight">{t('reset.title')}</h1>
        <p className="text-sm text-gray-500 mt-1.5">{t('reset.sub')}</p>
      </div>

      {done ? (
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
          <p className="font-medium text-gray-900">{t('reset.done')}</p>
          <p className="text-sm text-gray-500">{t('reset.redirecting')}</p>
        </div>
      ) : !ready && !shownError ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <>
          {shownError && <Alert tone="error">{shownError}</Alert>}
          {ready && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <PasswordField
                  id="password"
                  label={t('reset.newPassword')}
                  icon={Lock}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  showLabel={t('common.showPassword')}
                  hideLabel={t('common.hidePassword')}
                />
                <StrengthMeter
                  score={passwordScore(password)}
                  labels={[t('strength.weak'), t('strength.medium'), t('strength.strong')]}
                />
              </div>
              <div>
                <PasswordField
                  id="confirm"
                  label={t('reset.confirmPassword')}
                  icon={Lock}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  showLabel={t('common.showPassword')}
                  hideLabel={t('common.hidePassword')}
                />
                {/* Live feedback beats finding out only after submitting. */}
                {confirm.length > 0 && (
                  <p className={`mt-1.5 text-xs font-medium flex items-center gap-1.5 ${matches ? 'text-green-600' : 'text-gray-400'}`}>
                    {matches && <Check className="w-3.5 h-3.5" />}
                    {matches ? t('reset.match') : t('reset.mismatch')}
                  </p>
                )}
              </div>
              <SubmitButton loading={loading}>{t('reset.submit')}</SubmitButton>
            </form>
          )}
        </>
      )}
    </AuthShell>
  );
}
