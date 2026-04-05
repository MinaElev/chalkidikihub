'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, List, Eye, FileText, Waves, UtensilsCrossed, Landmark, Zap } from 'lucide-react';

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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
