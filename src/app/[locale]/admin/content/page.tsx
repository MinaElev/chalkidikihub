'use client';

import { useEffect, useState } from 'react';
import { FileText, Waves, UtensilsCrossed, Landmark, Zap, MapPin, Loader2 } from 'lucide-react';
import { AREAS } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { Beach, Restaurant, Activity, EvCharger, BlogArticle } from '@/types';

type ContentItem = { name: string; extra: string };
type Section = { title: string; icon: typeof FileText; color: string; items: ContentItem[] };

export default function AdminContentPage() {
  const locale = useLocale();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const [beachesRes, restaurantsRes, activitiesRes, chargersRes, articlesRes] = await Promise.allSettled([
        fetch('/api/beaches').then((r) => r.json()),
        fetch('/api/restaurants').then((r) => r.json()),
        fetch('/api/activities').then((r) => r.json()),
        fetch('/api/chargers').then((r) => r.json()),
        fetch('/api/blog').then((r) => r.json()),
      ]);

      const beaches: Beach[] = beachesRes.status === 'fulfilled' && Array.isArray(beachesRes.value) ? beachesRes.value : [];
      const restaurants: Restaurant[] = restaurantsRes.status === 'fulfilled' && Array.isArray(restaurantsRes.value) ? restaurantsRes.value : [];
      const activities: Activity[] = activitiesRes.status === 'fulfilled' && Array.isArray(activitiesRes.value) ? activitiesRes.value : [];
      const chargers: EvCharger[] = chargersRes.status === 'fulfilled' && Array.isArray(chargersRes.value) ? chargersRes.value : [];
      const articles: BlogArticle[] = articlesRes.status === 'fulfilled' && Array.isArray(articlesRes.value) ? articlesRes.value : [];

      setSections([
        { title: 'Areas', icon: MapPin, color: 'text-primary-600', items: AREAS.map((a) => ({ name: a.name[locale], extra: a.slug })) },
        { title: 'Beaches', icon: Waves, color: 'text-cyan-600', items: beaches.map((b) => ({ name: b.name[locale] || b.name.en, extra: `${b.area} | ${b.rating}★` })) },
        { title: 'Restaurants', icon: UtensilsCrossed, color: 'text-red-600', items: restaurants.map((r) => ({ name: r.name[locale] || r.name.en, extra: `${r.area} | ${r.rating}★` })) },
        { title: 'Activities', icon: Landmark, color: 'text-orange-600', items: activities.map((a) => ({ name: a.name[locale] || a.name.en, extra: `${a.area} | ${a.category}` })) },
        { title: 'EV Chargers', icon: Zap, color: 'text-green-600', items: chargers.map((c) => ({ name: c.name[locale] || c.name.en, extra: `${c.area} | ${c.provider}` })) },
        { title: 'Blog Articles', icon: FileText, color: 'text-indigo-600', items: articles.map((a) => ({ name: a.title[locale] || a.title.en, extra: a.category })) },
      ]);
      setLoading(false);
    }
    loadContent();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        All content is managed via the database. Use the admin sections to add/edit content.
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon className={`w-5 h-5 ${section.color}`} />
              <h2 className="text-lg font-semibold text-gray-900">{section.title} ({section.items.length})</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {section.items.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400">No items</div>
              ) : (
                section.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.extra}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
