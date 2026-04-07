'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users, List, Eye, FileText, Waves, UtensilsCrossed, Landmark, Zap, AlertTriangle,
  ClipboardList, MessageSquare, MapPin, Image, BarChart3, Settings, ScrollText, Mail, Wrench,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    publishedListings: 0,
    draftListings: 0,
    beaches: 0,
    restaurants: 0,
    activities: 0,
    chargers: 0,
    articles: 0,
  });
  const [recentErrors, setRecentErrors] = useState<Array<{ id: string; message: string; severity: string; created_at: string }>>([]);
  const [pendingSubs, setPendingSubs] = useState(0);
  const [unreadMsgs, setUnreadMsgs] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: listings } = await supabase.from('listings').select('status');
      const { count: beachCount } = await supabase.from('beaches').select('*', { count: 'exact', head: true });
      const { count: restaurantCount } = await supabase.from('restaurants').select('*', { count: 'exact', head: true });
      const { count: activityCount } = await supabase.from('activities').select('*', { count: 'exact', head: true });
      const { count: articleCount } = await supabase.from('blog_articles').select('*', { count: 'exact', head: true });

      // Chargers from API
      let chargerCount = 0;
      try {
        const res = await fetch('/api/chargers');
        const data = await res.json();
        if (Array.isArray(data)) chargerCount = data.length;
      } catch {}

      // Recent errors
      const { data: errors } = await supabase
        .from('activity_logs')
        .select('id, message, severity, created_at')
        .in('severity', ['error', 'warning'])
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentErrors(errors || []);

      // Pending submissions + unread messages
      const { count: pendingCount } = await supabase
        .from('user_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingSubs(pendingCount || 0);

      const { count: msgCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);
      setUnreadMsgs(msgCount || 0);

      setStats({
        totalUsers: userCount || 0,
        totalListings: listings?.length || 0,
        publishedListings: listings?.filter((l) => l.status === 'published').length || 0,
        draftListings: listings?.filter((l) => l.status === 'draft').length || 0,
        beaches: beachCount || 0,
        restaurants: restaurantCount || 0,
        activities: activityCount || 0,
        chargers: chargerCount,
        articles: articleCount || 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Listings', value: stats.totalListings, icon: List, color: 'bg-purple-100 text-purple-600' },
    { label: 'Published', value: stats.publishedListings, icon: Eye, color: 'bg-green-100 text-green-600' },
    { label: 'Draft', value: stats.draftListings, icon: FileText, color: 'bg-amber-100 text-amber-600' },
    { label: 'Beaches', value: stats.beaches, icon: Waves, color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Restaurants', value: stats.restaurants, icon: UtensilsCrossed, color: 'bg-red-100 text-red-600' },
    { label: 'Activities', value: stats.activities, icon: Landmark, color: 'bg-orange-100 text-orange-600' },
    { label: 'EV Chargers', value: stats.chargers, icon: Zap, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Blog Articles', value: stats.articles, icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>

      {/* Urgent notifications */}
      {(pendingSubs > 0 || unreadMsgs > 0) && (
        <div className="space-y-2 mb-6">
          {pendingSubs > 0 && (
            <Link href="/admin/submissions"
              className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800">{pendingSubs} νέες προτάσεις περιμένουν έγκριση</p>
                <p className="text-xs text-amber-600">Πατήστε για να τις δείτε</p>
              </div>
              <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-bold">{pendingSubs}</span>
            </Link>
          )}
          {unreadMsgs > 0 && (
            <Link href="/admin/messages"
              className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-800">{unreadMsgs} αδιάβαστα μηνύματα</p>
                <p className="text-xs text-blue-600">Πατήστε για να τα δείτε</p>
              </div>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-bold">{unreadMsgs}</span>
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-500">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Γρήγορες Ενέργειες</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/admin/listings', icon: List, color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Διαχείριση Καταλυμάτων', desc: 'Προβολή, έγκριση, επεξεργασία listings' },
            { href: '/admin/beaches', icon: Waves, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', label: 'Παραλίες', desc: 'Προσθήκη/επεξεργασία παραλιών' },
            { href: '/admin/restaurants', icon: UtensilsCrossed, color: 'text-red-600 bg-red-50 border-red-200', label: 'Φαγητό & Ποτό', desc: 'Εστιατόρια, μπαρ, beach bars' },
            { href: '/admin/activities', icon: Landmark, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Δραστηριότητες', desc: 'Αξιοθέατα, εκδρομές, sports' },
            { href: '/admin/blog', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', label: 'Blog', desc: 'Δημιουργία/επεξεργασία άρθρων' },
            { href: '/admin/areas', icon: MapPin, color: 'text-primary-600 bg-primary-50 border-primary-200', label: 'Περιοχές', desc: 'Κασσάνδρα, Σιθωνία, Άθως' },
            { href: '/admin/submissions', icon: ClipboardList, color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Moderation Προτάσεων', desc: 'Έγκριση/απόρριψη user submissions' },
            { href: '/admin/messages', icon: MessageSquare, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Μηνύματα', desc: 'Inbox φόρμας επικοινωνίας' },
            { href: '/admin/email', icon: Mail, color: 'text-pink-600 bg-pink-50 border-pink-200', label: 'Mass Email', desc: 'Αποστολή email σε χρήστες' },
            { href: '/admin/users', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Χρήστες', desc: 'Ρόλοι, διαγραφή, προβολή' },
            { href: '/admin/images', icon: Image, color: 'text-teal-600 bg-teal-50 border-teal-200', label: 'Εικόνες', desc: 'Gallery, bulk optimizer' },
            { href: '/admin/seo', icon: BarChart3, color: 'text-green-600 bg-green-50 border-green-200', label: 'SEO Dashboard', desc: 'Meta tags, keywords, rankings' },
            { href: '/admin/tools', icon: Wrench, color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Εργαλεία', desc: 'Internal links, bulk operations' },
            { href: '/admin/logs', icon: ScrollText, color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Activity Logs', desc: 'Errors, user actions, system logs' },
            { href: '/admin/settings', icon: Settings, color: 'text-gray-600 bg-gray-50 border-gray-200', label: 'Ρυθμίσεις', desc: 'API keys, compression, site info' },
          ].map((action) => (
            <Link key={action.href} href={action.href}
              className={`flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition-all ${action.color}`}>
              <action.icon className="w-5 h-5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500 truncate">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      {recentErrors.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Recent Issues
            </h2>
            <Link href="/admin/logs" className="text-sm text-red-600 hover:underline">View all →</Link>
          </div>
          <div className="bg-white border border-red-100 rounded-xl divide-y divide-gray-100">
            {recentErrors.map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  log.severity === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>{log.severity}</span>
                <span className="text-sm text-gray-700 flex-1 truncate">{log.message}</span>
                <span className="text-xs text-gray-400 shrink-0">{new Date(log.created_at).toLocaleString('el')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
