'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import {
  LayoutDashboard, Users, List, MapPin, Waves, UtensilsCrossed,
  Landmark, Zap, FileText, Settings, Home, LogOut, Loader2, Shield,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role !== 'superadmin') { router.push('/dashboard'); return; }
      setRole(data.role);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  if (role !== 'superadmin') return null;

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/listings', icon: List, label: 'Listings' },
    { href: '/admin/areas', icon: MapPin, label: 'Areas' },
    { href: '/admin/beaches', icon: Waves, label: 'Beaches' },
    { href: '/admin/restaurants', icon: UtensilsCrossed, label: 'Restaurants' },
    { href: '/admin/activities', icon: Landmark, label: 'Activities' },
    { href: '/admin/blog', icon: FileText, label: 'Blog' },
    { href: '/admin/messages', icon: FileText, label: 'Messages' },
    { href: '/admin/images', icon: FileText, label: 'Images' },
    { href: '/admin/seo', icon: FileText, label: 'SEO' },
    { href: '/admin/tools', icon: Zap, label: 'Tools' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <div className="bg-white border border-red-200 rounded-2xl p-4 sticky top-24">
            <div className="mb-4 pb-4 border-b border-red-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-600">Super Admin</span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700">
                  <item.icon className="w-4 h-4" />{item.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
                <Home className="w-4 h-4" />Owner Dashboard
              </Link>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">
                <Home className="w-4 h-4" />View Site
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />Logout
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
