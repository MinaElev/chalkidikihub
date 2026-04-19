'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Loader2, KeyRound, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Supabase recovery flow puts access_token + refresh_token in the URL hash.
  // We pick them up, set the session, then let the user choose a new password.
  useEffect(() => {
    const supabase = createClient();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');

    if (access_token && refresh_token && type === 'recovery') {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) setError(error.message);
        else setReady(true);
        // Clean the hash so tokens aren't visible in the URL bar
        window.history.replaceState(null, '', window.location.pathname);
      });
    } else {
      // Maybe the user already has a session (e.g. logged-in user opened the page)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
        else setError('Μη έγκυρος ή ληγμένος σύνδεσμος επαναφοράς. Ζήτησε νέο email επαναφοράς.');
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }
    if (password !== confirm) {
      setError('Οι κωδικοί δεν ταιριάζουν.');
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

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full">
          <KeyRound className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Επαναφορά κωδικού</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Όρισε νέο κωδικό για τον λογαριασμό σου.</p>

        {done ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
            <p className="font-medium text-gray-900">Ο κωδικός άλλαξε επιτυχώς.</p>
            <p className="text-sm text-gray-500">Μεταφέρεσαι στη σελίδα σύνδεσης…</p>
          </div>
        ) : !ready && !error ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            {ready && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Νέος κωδικός</label>
                  <input
                    type="password" required minLength={6} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Επιβεβαίωση κωδικού</label>
                  <input
                    type="password" required minLength={6} value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Αλλαγή κωδικού
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
