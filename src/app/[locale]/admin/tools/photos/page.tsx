'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, Loader2, CheckCircle, Image, Waves, UtensilsCrossed, Landmark, FileText } from 'lucide-react';
import { UnsplashPicker } from '@/components/admin/UnsplashPicker';

interface MissingPhoto {
  table: string;
  id: string;
  slug: string;
  name: string;
  area: string;
  image_url: string;
}

const typeConfig: Record<string, { icon: typeof Waves; color: string; label: string; folder: string }> = {
  beaches: { icon: Waves, color: 'text-cyan-600 bg-cyan-50', label: 'Παραλία', folder: 'beaches' },
  restaurants: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-50', label: 'Φαγητό & Ποτό', folder: 'restaurants' },
  activities: { icon: Landmark, color: 'text-amber-600 bg-amber-50', label: 'Δραστηριότητα', folder: 'activities' },
  blog_articles: { icon: FileText, color: 'text-indigo-600 bg-indigo-50', label: 'Άρθρο', folder: 'blog' },
};

export default function PhotoFillerPage() {
  const [items, setItems] = useState<MissingPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function scan() {
      const supabase = createClient();
      const found: MissingPhoto[] = [];

      const tables = [
        { table: 'beaches', nameField: 'name_el', areaField: 'area' },
        { table: 'restaurants', nameField: 'name_el', areaField: 'area' },
        { table: 'activities', nameField: 'name_el', areaField: 'area' },
        { table: 'blog_articles', nameField: 'title_el', areaField: 'category' },
      ];

      for (const t of tables) {
        const { data } = await supabase.from(t.table).select('*');
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any[]).forEach((row: any) => {
            const imageUrl = row.image_url || '';
            if (!imageUrl || imageUrl.length < 5) {
              found.push({
                table: t.table,
                id: row.id,
                slug: row.slug,
                name: row[t.nameField] || '',
                area: row[t.areaField] || '',
                image_url: '',
              });
            }
          });
        }
      }

      setItems(found);
      setLoading(false);
    }
    scan();
  }, []);

  async function handlePhotoSelected(item: MissingPhoto, url: string) {
    const supabase = createClient();
    await supabase.from(item.table).update({ image_url: url }).eq('id', item.id);
    setSaved(prev => new Set(prev).add(item.id));
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.table === filter);
  const withoutSaved = filtered.filter(i => !saved.has(i.id));

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Camera className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Photo Filler</h1>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Βρείτε σελίδες χωρίς φωτογραφία και προσθέστε μέσω Unsplash (δωρεάν, πραγματικές φωτό).
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-red-600">{items.length}</div>
          <div className="text-xs text-gray-500">Χωρίς φωτό</div>
        </div>
        {Object.entries(typeConfig).map(([table, config]) => {
          const count = items.filter(i => i.table === table).length;
          return (
            <div key={table} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500">{config.label}</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Όλα ({items.filter(i => !saved.has(i.id)).length})
        </button>
        {Object.entries(typeConfig).map(([table, config]) => (
          <button key={table} onClick={() => setFilter(table)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === table ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {config.label} ({items.filter(i => i.table === table && !saved.has(i.id)).length})
          </button>
        ))}
      </div>

      {/* Items */}
      {withoutSaved.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Όλες οι σελίδες έχουν φωτογραφία!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {withoutSaved.map(item => {
            const config = typeConfig[item.table] || typeConfig.beaches;
            const Icon = config.icon;
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">{config.label} · {item.area} · {item.slug}</p>
                  </div>
                </div>

                <UnsplashPicker
                  defaultQuery={`${item.name} ${item.table === 'beaches' ? 'beach' : item.table === 'restaurants' ? 'restaurant' : item.table === 'activities' ? 'attraction' : ''} halkidiki greece`}
                  folder={config.folder}
                  slug={item.slug}
                  onSelect={(url) => handlePhotoSelected(item, url)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
