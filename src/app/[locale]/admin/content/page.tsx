'use client';

import { FileText, Waves, UtensilsCrossed, Landmark, Zap, MapPin } from 'lucide-react';
import { seedBeaches } from '@/lib/seed-beaches';
import { seedRestaurants } from '@/lib/seed-restaurants';
import { seedActivities } from '@/lib/seed-activities';
import { seedChargers } from '@/lib/seed-chargers';
import { seedArticles } from '@/lib/seed-blog';
import { AREAS } from '@/lib/constants';
import { useLocale } from 'next-intl';

export default function AdminContentPage() {
  const locale = useLocale();

  const sections = [
    { title: 'Areas', icon: MapPin, color: 'text-primary-600', items: AREAS.map((a) => ({ name: a.name[locale], extra: a.slug })) },
    { title: 'Beaches', icon: Waves, color: 'text-cyan-600', items: seedBeaches.map((b) => ({ name: b.name[locale] || b.name.en, extra: `${b.area} | ${b.rating}★` })) },
    { title: 'Restaurants', icon: UtensilsCrossed, color: 'text-red-600', items: seedRestaurants.map((r) => ({ name: r.name[locale] || r.name.en, extra: `${r.area} | ${r.rating}★` })) },
    { title: 'Activities', icon: Landmark, color: 'text-orange-600', items: seedActivities.map((a) => ({ name: a.name[locale] || a.name.en, extra: `${a.area} | ${a.category}` })) },
    { title: 'EV Chargers', icon: Zap, color: 'text-green-600', items: seedChargers.map((c) => ({ name: c.name[locale] || c.name.en, extra: `${c.area} | ${c.provider}` })) },
    { title: 'Blog Articles', icon: FileText, color: 'text-indigo-600', items: seedArticles.map((a) => ({ name: a.title[locale] || a.title.en, extra: a.category })) },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        Seed content (beaches, restaurants, activities, chargers, blog) is managed via code.
        User-submitted listings are in the &quot;All Listings&quot; page.
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <section.icon className={`w-5 h-5 ${section.color}`} />
              <h2 className="text-lg font-semibold text-gray-900">{section.title} ({section.items.length})</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <span className="text-xs text-gray-400">{item.extra}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
