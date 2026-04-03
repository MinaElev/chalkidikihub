'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, Landmark } from 'lucide-react';

interface Activity {
  id: string;
  name_el: string;
  area: string;
  category: string;
  rating: number;
  reviews_count: number;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities() {
    const supabase = createClient();
    const { data } = await supabase.from('activities').select('*').order('name_el');
    setActivities(data || []);
    setLoading(false);
  }

  async function deleteActivity(id: string) {
    if (!confirm('Διαγραφή αυτής της δραστηριότητας ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('activities').delete().eq('id', id);
    loadActivities();
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Activities ({activities.length})</h1>
        </div>
        <Link href="/admin/activities/new"
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
              <th className="text-left px-4 py-3 font-semibold text-red-900">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Rating</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Reviews</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{a.name_el}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{a.area}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{a.category}</td>
                <td className="px-4 py-3 text-gray-600">{a.rating}</td>
                <td className="px-4 py-3 text-gray-600">{a.reviews_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/activities/${a.id}/edit`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteActivity(a.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No activities found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
