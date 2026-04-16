'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { User, LayoutDashboard, List, LogOut, ChevronDown, Shield } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function UserMenu() {
  const t = useTranslations('nav');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<string>('owner');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile) setRole(profile.role);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
  }

  // Before mount: render nothing (matches server render — no hydration mismatch)
  if (!mounted) return null;

  if (!user) {
    return (
      <>
        <Link href="/auth/login" className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
          {t('login')}
        </Link>
        <Link href="/auth/register" className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          {t('register')}
        </Link>
      </>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600" />
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          {role === 'superadmin' && (
            <Link href="/admin" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
              <Shield className="w-4 h-4" />Admin Panel
            </Link>
          )}
          <Link href="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <LayoutDashboard className="w-4 h-4" />{t('dashboard')}
          </Link>
          <Link href="/dashboard/listings" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <List className="w-4 h-4" />{t('myListings')}
          </Link>
          <hr className="my-1" />
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />{t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}
