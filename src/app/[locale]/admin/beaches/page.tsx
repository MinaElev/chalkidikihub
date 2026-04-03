'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, Waves } from 'lucide-react';

interface Beach {
  id: string;
  name_el: string;
  area: string;
  rating: number;
  reviews_count: number;
}

export default function AdminBeachesPage() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBeaches(); }, []);

  async function loadBeaches() {
    const supabase = createClient();
    const { data } = await supabase.from('beaches').select('*').order('name_el');
    setBeaches(data || []);
    setLoading(false);
  }

  async function deleteBeach(id: string) {
    if (!confirm('Διαγραφή αυτής της παραλίας ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('beaches').delete().eq('id', id);
    loadBeaches();
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Waves className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Beaches ({beaches.length})</h1>
        </div>
        <Link href="/admin/beaches/new"
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
              <th className="text-left px-4 py-3 font-semibold text-red-900">Rating</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Reviews</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {beaches.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{b.name_el}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{b.area}</td>
                <td className="px-4 py-3 text-gray-600">{b.rating}</td>
                <td className="px-4 py-3 text-gray-600">{b.reviews_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/beaches/${b.id}/edit`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteBeach(b.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {beaches.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No beaches found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
