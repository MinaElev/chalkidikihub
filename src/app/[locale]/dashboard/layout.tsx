'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LayoutDashboard, Home, List, User, LogOut, Loader2, UtensilsCrossed, Landmark, FileText, ClipboardList, Menu, X } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tSub = useTranslations('submissions');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login');
      } else {
        setUser(data.user);
        // Fetch pending submission count
        const { count } = await supabase
          .from('user_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', data.user.id)
          .eq('status', 'pending');
        setPendingCount(count || 0);
      }
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) return null;

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const navSections = [
    {
      title: t('myListings'),
      items: [
        { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
        { href: '/dashboard/listings', icon: List, label: t('myListings') },
        { href: '/dashboard/profile', icon: User, label: t('profile') },
      ],
    },
    {
      title: tSub('suggestRestaurant').split(' ')[0],
      items: [
        { href: '/dashboard/suggest-restaurant', icon: UtensilsCrossed, label: tSub('suggestRestaurant') },
        { href: '/dashboard/suggest-activity', icon: Landmark, label: tSub('suggestActivity') },
        { href: '/dashboard/suggest-blog', icon: FileText, label: tSub('suggestBlog') },
        { href: '/dashboard/submissions', icon: ClipboardList, label: tSub('mySubmissions') },
      ],
    },
  ];

  function NavContent() {
    return (
      <>
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="font-semibold text-gray-900 truncate">
            {user!.user_metadata?.full_name || user!.email}
          </p>
          <p className="text-xs text-gray-500 truncate">{user!.email}</p>
        </div>

        <nav className="space-y-4">
          {navSections.map((section, i) => (
            <div key={i}>
              {i > 0 && <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{section.title}</p>}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                      <item.icon className="w-4 h-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.href === '/dashboard/submissions' && pendingCount > 0 && (
                        <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${
                          active ? 'bg-white/30 text-white' : 'bg-amber-100 text-amber-700'
                        }`}>{pendingCount}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <hr className="my-3" />

        <div className="space-y-0.5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
            <Home className="w-4 h-4" />{t('home')}
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" />{t('logout')}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
        <div className="truncate">
          <p className="font-semibold text-gray-900 text-sm truncate">{user.user_metadata?.full_name || user.email}</p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <p className="font-semibold text-gray-900 text-sm truncate">{user.user_metadata?.full_name || 'Dashboard'}</p>
              <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <NavContent />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sticky top-24">
            <NavContent />
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
