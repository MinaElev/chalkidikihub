'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logEvent } from '@/lib/logger';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const el = locale === 'el';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failCount, setFailCount] = useState(0);
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
      setFailCount((c) => c + 1);
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
      setError(el ? 'Συμπλήρωσε πρώτα το email σου.' : 'Enter your email first.');
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
        setError(data.error || (el ? 'Κάτι πήγε στραβά.' : 'Something went wrong.'));
      } else {
        setResetSent(true);
      }
    } catch {
      setError(el ? 'Κάτι πήγε στραβά.' : 'Something went wrong.');
    }
    setResetSending(false);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('login')}</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            {el
              ? <>Αν υπάρχει λογαριασμός με το email <strong>{email}</strong>, σου στείλαμε σύνδεσμο επαναφοράς κωδικού. Έλεγξε τα εισερχόμενα (και τα spam).</>
              : <>If an account exists for <strong>{email}</strong>, we sent a password reset link. Check your inbox (and spam).</>}
          </div>
        )}

        {failCount >= 2 && !resetSent && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center justify-between gap-3">
            <span>{el ? 'Ξέχασες τον κωδικό σου;' : 'Forgot your password?'}</span>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetSending}
              className="shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              {resetSending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {el ? 'Επαναφορά κωδικού' : 'Reset password'}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('login')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/auth/register" className="text-primary-600 hover:underline">
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
