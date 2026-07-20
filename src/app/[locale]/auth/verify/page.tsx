'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/logger';
import { Loader2, MailCheck } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const locale = useLocale();
  const el = locale === 'el';
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
      inputRef.current?.focus();
    });
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 4) return;
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || (el ? 'Κάτι πήγε στραβά.' : 'Something went wrong.'));
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
      setError(data.error || (el ? 'Η αποστολή απέτυχε.' : 'Failed to send.'));
      return;
    }
    setCooldown(60);
    setInfo(el ? 'Στείλαμε νέο κωδικό στο email σας.' : 'A new code was sent to your email.');
  }

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
        <MailCheck className="w-14 h-14 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {el ? 'Επιβεβαίωση email' : 'Verify your email'}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {el ? 'Στείλαμε έναν 4-ψήφιο κωδικό στο ' : 'We sent a 4-digit code to '}
          <strong>{email}</strong>.
          {el ? ' Ισχύει για 15 λεπτά.' : ' It expires in 15 minutes.'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-48 mx-auto block text-center text-3xl font-bold tracking-[0.5em] px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••"
          />
          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="mt-6 w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {el ? 'Επιβεβαίωση' : 'Verify'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          {el ? 'Δεν λάβατε κωδικό;' : "Didn't get a code?"}{' '}
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-primary-600 hover:underline disabled:text-gray-400 disabled:no-underline font-medium"
          >
            {cooldown > 0
              ? (el ? `Νέα αποστολή σε ${cooldown}″` : `Resend in ${cooldown}s`)
              : (el ? 'Αποστολή ξανά' : 'Resend')}
          </button>
        </p>
      </div>
    </div>
  );
}
