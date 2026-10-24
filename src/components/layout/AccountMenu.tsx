'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Heart, Home, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Labels = { login: string; register: string; dashboard: string; listings: string; profile: string; favourites: string; logout: string; account: string };
type Who = { name: string; email: string };

/**
 * Pages are cached for everyone, so the server can't know who is looking.
 * The Supabase session lives in a readable cookie (sb-<ref>-auth-token,
 * "base64-" + JSON, sometimes split into .0/.1 chunks); reading it here
 * avoids loading the Supabase client on every page just to draw the header.
 */
function sessionUser(): Who | null {
  const jar = Object.fromEntries(document.cookie.split('; ').map((c) => {
    const i = c.indexOf('=');
    return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))];
  }));
  const base = Object.keys(jar).find((k) => /^sb-.+-auth-token(\.0)?$/.test(k))?.replace(/\.0$/, '');
  if (!base) return null;
  let raw = jar[base] ?? '';
  for (let i = 0; jar[`${base}.${i}`] !== undefined; i++) raw += jar[`${base}.${i}`];
  try {
    if (raw.startsWith('base64-')) {
      const b64 = raw.slice(7).replace(/-/g, '+').replace(/_/g, '/');
      raw = new TextDecoder().decode(Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0)));
    }
    const s = JSON.parse(raw);
    const user = s?.user ?? s?.currentSession?.user;
    if (!user?.email) return null;
    // An expired refresh is still a signed-in visitor: the dashboard refreshes the token itself.
    const name = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0]).trim();
    return { name, email: user.email };
  } catch {
    return null;
  }
}

export function AccountMenu({ labels }: { labels: Labels }) {
  const [who, setWho] = useState<Who | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the cookie only exists in the browser; reading it during render would break hydration
  useEffect(() => setWho(sessionUser()), []);

  if (!who) {
    return (
      <>
        {/* /dashboard sends signed-out visitors to the login form and signed-in ones straight in. */}
        <Link prefetch={false} href="/dashboard" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-sea-600 transition-colors hover:bg-sea-50 xl:block">
          {labels.login}
        </Link>
        <Link prefetch={false} href="/auth/register" className="hidden rounded-lg bg-sea-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sea-700 xl:block">
          {labels.register}
        </Link>
      </>
    );
  }

  const first = who.name.split(/\s+/)[0];
  const initials = who.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  const item = 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sea-700';

  async function signOut() {
    const { browserDb } = await import('@/lib/supabase/browser');
    await browserDb().auth.signOut();
    window.location.reload();
  }

  return (
    <details className="group relative">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100 [&::-webkit-details-marker]:hidden"
        aria-label={labels.account}
        title={who.email}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-sea-600 text-xs font-bold text-white" aria-hidden>
          {initials || <User className="size-4" />}
        </span>
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-gray-800 xl:block">{first}</span>
        <ChevronDown className="hidden size-3.5 text-gray-500 transition-transform group-open:rotate-180 xl:block" aria-hidden />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
        <div className="border-b border-gray-100 px-3 pb-2.5 pt-1.5">
          <p className="truncate text-sm font-semibold text-gray-900">{who.name}</p>
          <p className="truncate text-xs text-gray-500">{who.email}</p>
        </div>
        <nav className="py-1.5" aria-label={labels.account}>
          <Link prefetch={false} href="/dashboard" className={item}><LayoutDashboard className="size-4" aria-hidden />{labels.dashboard}</Link>
          <Link prefetch={false} href="/dashboard/listings" className={item}><Home className="size-4" aria-hidden />{labels.listings}</Link>
          <Link prefetch={false} href="/dashboard/profile" className={item}><User className="size-4" aria-hidden />{labels.profile}</Link>
          <Link prefetch={false} href="/favorites" className={item}><Heart className="size-4" aria-hidden />{labels.favourites}</Link>
        </nav>
        <button type="button" onClick={signOut} className={`${item} w-full border-t border-gray-100 pt-2.5 text-red-600 hover:bg-red-50 hover:text-red-700`}>
          <LogOut className="size-4" aria-hidden />{labels.logout}
        </button>
      </div>
    </details>
  );
}
