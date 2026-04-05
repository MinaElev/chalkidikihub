'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, UtensilsCrossed, CheckCircle, XCircle, ImageIcon } from 'lucide-react';

interface Restaurant {
  id: string;
  name_el: string;
  name_en: string;
  area: string;
  cuisine: string[];
  price_level: string;
  rating: number;
  image_url: string;
  image_alt: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRestaurants(); }, []);

  async function loadRestaurants() {
    const supabase = createClient();
    const { data } = await supabase.from('restaurants')
      .select('id, name_el, name_en, area, cuisine, price_level, rating, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
      .order('name_el');
    setRestaurants(data || []);
    setLoading(false);
  }

  async function deleteRestaurant(id: string) {
    if (!confirm('Διαγραφή αυτού του εστιατορίου ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('restaurants').delete().eq('id', id);
    loadRestaurants();
  }

  function getSeoStatus(r: Restaurant) {
    const issues: string[] = [];
    if (!r.image_url) issues.push('Image');
    if (!r.image_alt) issues.push('Alt');
    if (!r.meta_title_el) issues.push('Title EL');
    if (!r.meta_title_en) issues.push('Title EN');
    if (!r.meta_description_el) issues.push('Desc EL');
    if (!r.name_en) issues.push('Name EN');
    return issues;
  }

  const totalComplete = restaurants.filter(r => getSeoStatus(r).length === 0).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Restaurants ({restaurants.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === restaurants.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{restaurants.length}
          </span>
        </div>
        <Link href="/admin/restaurants/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
          <Plus className="w-4 h-4" />Add New
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Area</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Cuisine</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Rating</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {restaurants.map((r) => {
              const issues = getSeoStatus(r);
              const isComplete = issues.length === 0;
              return (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.name_el}</div>
                  {r.name_en && <div className="text-xs text-gray-400">{r.name_en}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">{r.area}</td>
                <td className="px-4 py-3 text-gray-600">{(r.cuisine || []).join(', ')}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{r.price_level}</td>
                <td className="px-4 py-3 text-gray-600">{r.rating}</td>
                <td className="px-4 py-3 text-center">
                    {r.image_url ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><ImageIcon className="w-3.5 h-3.5" />✓</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500"><ImageIcon className="w-3.5 h-3.5" />✗</span>
                    )}
                </td>
                <td className="px-4 py-3 text-center">
                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4" /></span>
                    ) : (
                      <span className="inline-flex items-center gap-1" title={issues.join(', ')}>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-[10px] text-red-500">{issues.length}</span>
                      </span>
                    )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/restaurants/${r.id}/edit`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteRestaurant(r.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
            {restaurants.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">No restaurants found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
