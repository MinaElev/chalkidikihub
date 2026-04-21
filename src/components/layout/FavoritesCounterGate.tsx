'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { hasSupabaseAuthCookie } from '@/lib/auth-cookie';

// Raw import() inside the auth branch avoids the <script async> preload that
// next/dynamic emits — anonymous visitors never download the Supabase client.
export function FavoritesCounterGate() {
  const [Component, setComponent] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (!hasSupabaseAuthCookie()) return;
    let cancelled = false;
    import('./FavoritesCounter').then((m) => {
      if (!cancelled) setComponent(() => m.FavoritesCounter);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Component) return null;
  return <Component />;
}
