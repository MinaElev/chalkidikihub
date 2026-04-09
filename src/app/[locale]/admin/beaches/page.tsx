'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, Waves, CheckCircle, XCircle, ImageIcon, Search, ExternalLink } from 'lucide-react';

interface Beach {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  area: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  image_alt: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
}

export default function AdminBeachesPage() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadBeaches(); }, []);

  async function loadBeaches() {
    const supabase = createClient();
    const { data } = await supabase.from('beaches')
      .select('id, slug, name_el, name_en, area, rating, reviews_count, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
      .order('name_el');
    setBeaches((data as Beach[]) || []);
    setLoading(false);
  }

  async function deleteBeach(id: string) {
    if (!confirm('Διαγραφή αυτής της παραλίας ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('beaches').delete().eq('id', id);
    loadBeaches();
  }

  function getSeoStatus(b: Beach) {
    const issues: string[] = [];
    if (!b.image_url) issues.push('Image');
    if (!b.image_alt) issues.push('Alt');
    if (!b.meta_title_el) issues.push('Title EL');
    if (!b.meta_title_en) issues.push('Title EN');
    if (!b.meta_description_el) issues.push('Desc EL');
    if (!b.name_en) issues.push('Name EN');
    return issues;
  }

  const totalComplete = beaches.filter(b => getSeoStatus(b).length === 0).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Waves className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Beaches ({beaches.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === beaches.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{beaches.length}
          </span>
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
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {beaches.map((b) => {
              const issues = getSeoStatus(b);
              const isComplete = issues.length === 0;
              return (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{b.name_el}</div>
                    {b.name_en && <div className="text-xs text-gray-400">{b.name_en}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{b.area}</td>
                  <td className="px-4 py-3 text-gray-600">{b.rating} ★</td>
                  <td className="px-4 py-3 text-center">
                    {b.image_url ? (
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
                      <a href={`/beaches/${b.slug || b.id}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
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
              );
            })}
            {beaches.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No beaches found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
