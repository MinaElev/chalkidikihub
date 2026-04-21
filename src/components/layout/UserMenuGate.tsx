'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { hasSupabaseAuthCookie } from '@/lib/auth-cookie';

type State = { kind: 'unknown' } | { kind: 'anonymous' } | { kind: 'authed'; Component: ComponentType };

// Authed UserMenu pulls in @supabase/supabase-js (~53KB). next/dynamic would
// emit a preload <script async> tag regardless of state — Turbopack treats
// dynamic() chunks as prefetch candidates. Using a raw import() inside the
// auth branch defers the network request until we know the user is logged in.
export function UserMenuGate() {
  const t = useTranslations('nav');
  const [state, setState] = useState<State>({ kind: 'unknown' });

  useEffect(() => {
    if (!hasSupabaseAuthCookie()) {
      setState({ kind: 'anonymous' });
      return;
    }
    let cancelled = false;
    import('./UserMenu').then((m) => {
      if (!cancelled) setState({ kind: 'authed', Component: m.UserMenu });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === 'unknown') return null;

  if (state.kind === 'anonymous') {
    return (
      <>
        <Link
          href="/auth/login"
          className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          {t('login')}
        </Link>
        <Link
          href="/auth/register"
          className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          {t('register')}
        </Link>
      </>
    );
  }

  const { Component } = state;
  return <Component />;
}
