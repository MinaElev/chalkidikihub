'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Heart } from 'lucide-react';
import { hasSupabaseAuthCookie } from '@/lib/auth-cookie';
import { localePath } from '@/lib/seo/site';
import type { Locale } from '@/i18n/config';

export type FavoriteType = 'listing' | 'beach' | 'restaurant' | 'activity';

const LABELS: Record<string, { add: string; remove: string }> = {
  el: { add: 'Προσθήκη στα αγαπημένα', remove: 'Αφαίρεση από τα αγαπημένα' },
  en: { add: 'Add to favourites', remove: 'Remove from favourites' },
  de: { add: 'Zu Favoriten hinzufügen', remove: 'Aus Favoriten entfernen' },
  ro: { add: 'Adaugă la favorite', remove: 'Elimină din favorite' },
  bg: { add: 'Добави в любими', remove: 'Премахни от любими' },
  sr: { add: 'Dodaj u omiljene', remove: 'Ukloni iz omiljenih' },
  ru: { add: 'Добавить в избранное', remove: 'Удалить из избранного' },
};

// One lookup per page, shared by every heart on it. v3 asked Supabase twice
// per card (auth + favourite check): 260 requests on the beaches page.
type State = { userId: string | null; keys: Set<string> };
let loading: Promise<State> | null = null;
const listeners = new Set<() => void>();
function load(): Promise<State> {
  return (loading ??= (async () => {
    // Anonymous visitors (no sb-* cookie) never download the Supabase client.
    if (!hasSupabaseAuthCookie()) return { userId: null, keys: new Set<string>() };
    const supabase = (await import('@/lib/supabase/client')).createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user.id ?? null;
    if (!userId) return { userId, keys: new Set<string>() };
    const { data } = await supabase.from('favorites').select('item_type, item_slug').eq('user_id', userId);
    return { userId, keys: new Set((data ?? []).map((f) => `${f.item_type}:${f.item_slug}`)) };
  })());
}

/** v3's heart: signed-in visitors save beaches, stays, restaurants and activities to /favorites. */
export function FavoriteButton({ itemType, itemSlug, size = 'sm' }: { itemType: FavoriteType; itemSlug: string; size?: 'sm' | 'md' }) {
  const locale = useLocale() as Locale;
  const key = `${itemType}:${itemSlug}`;
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    const sync = () => load().then((s) => alive && setState({ userId: s.userId, keys: new Set(s.keys) }));
    sync();
    listeners.add(sync);
    return () => { alive = false; listeners.delete(sync); };
  }, []);

  const on = Boolean(state?.keys.has(key));
  const t = LABELS[locale] ?? LABELS.en;

  async function toggle() {
    const s = await load();
    if (!s.userId) {
      window.location.href = localePath(locale, '/auth/login');
      return;
    }
    setBusy(true);
    const supabase = (await import('@/lib/supabase/client')).createClient();
    if (s.keys.has(key)) {
      await supabase.from('favorites').delete().eq('user_id', s.userId).eq('item_type', itemType).eq('item_slug', itemSlug);
      s.keys.delete(key);
    } else {
      await supabase.from('favorites').insert({ user_id: s.userId, item_type: itemType, item_slug: itemSlug });
      s.keys.add(key);
    }
    listeners.forEach((l) => l());
    setBusy(false);
  }

  const box = size === 'sm' ? 'size-8' : 'size-10';
  const icon = size === 'sm' ? 'size-4' : 'size-5';
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={busy}
      aria-pressed={on}
      aria-label={on ? t.remove : t.add}
      title={on ? t.remove : t.add}
      className={`relative z-10 ${box} flex items-center justify-center rounded-full shadow-sm transition-all ${on ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/85 text-gray-500 backdrop-blur-sm hover:bg-white hover:text-red-500'}`}
    >
      <Heart className={`${icon} ${on ? 'fill-red-500' : ''}`} aria-hidden />
    </button>
  );
}
