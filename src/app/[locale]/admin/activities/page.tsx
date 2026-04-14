'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, Landmark, CheckCircle, XCircle, ImageIcon, ExternalLink, Search } from 'lucide-react';
import { AREA_SLUGS } from '@/lib/constants';

interface Activity {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  name_de: string;
  name_sr: string;
  area: string;
  category: string;
  rating: number;
  reviews_count: number;
  image_url: string;
  image_alt: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
}

export default function AdminActivitiesPage() {
  const locale = useLocale();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSeo, setFilterSeo] = useState('');

  useEffect(() => { loadActivities(); }, []);

  async function loadActivities() {
    const supabase = createClient();
    const { data } = await supabase.from('activities')
      .select('id, slug, name_el, name_en, name_de, name_sr, area, category, rating, reviews_count, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
      .order('name_el');
    setActivities(data || []);
    setLoading(false);
  }

  async function deleteActivity(id: string) {
    if (!confirm('Διαγραφή αυτής της δραστηριότητας ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('activities').delete().eq('id', id);
    loadActivities();
  }

  function getSeoStatus(a: Activity) {
    const issues: string[] = [];
    if (!a.image_url) issues.push('Image');
    if (!a.image_alt) issues.push('Alt');
    if (!a.meta_title_el) issues.push('Title EL');
    if (!a.meta_title_en) issues.push('Title EN');
    if (!a.meta_description_el) issues.push('Desc EL');
    if (!a.name_en) issues.push('Name EN');
    if (!a.name_sr) issues.push('Name SR');
    if (!a.name_de) issues.push('Name DE');
    return issues;
  }

  const totalComplete = activities.filter(a => getSeoStatus(a).length === 0).length;

  // Extract unique categories from data
  const allCategories = [...new Set(activities.map(a => a.category).filter(Boolean))].sort();

  const filtered = activities.filter((a) => {
    if (filterArea && a.area !== filterArea) return false;
    if (filterCategory && a.category !== filterCategory) return false;
    if (filterSeo === 'complete' && getSeoStatus(a).length !== 0) return false;
    if (filterSeo === 'incomplete' && getSeoStatus(a).length === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.name_el?.toLowerCase().includes(q) || a.name_en?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Activities ({filtered.length}/{activities.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === activities.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{activities.length}
          </span>
        </div>
        <Link href="/admin/activities/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
          <Plus className="w-4 h-4" />Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση ονόματος, κατηγορίας..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        </div>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι περιοχές</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι κατηγορίες</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterSeo} onChange={(e) => setFilterSeo(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλα τα SEO</option>
          <option value="complete">SEO OK ✓</option>
          <option value="incomplete">SEO ελλιπές ✗</option>
        </select>
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
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((a) => {
              const issues = getSeoStatus(a);
              const isComplete = issues.length === 0;
              return (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{a.name_el}</div>
                  {a.name_en && <div className="text-xs text-gray-400">{a.name_en}</div>}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">{a.area}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{a.category}</td>
                <td className="px-4 py-3 text-gray-600">{a.rating}</td>
                <td className="px-4 py-3 text-gray-600">{a.reviews_count}</td>
                <td className="px-4 py-3 text-center">
                    {a.image_url ? (
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
                    <a href={`/${locale}/activities/${a.slug || a.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">Δεν βρέθηκαν δραστηριότητες</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
