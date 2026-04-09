'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, MapPin, CheckCircle, XCircle, ImageIcon, ExternalLink } from 'lucide-react';

interface Village {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  area: string;
  population: number;
  image_url: string;
  image_alt: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
}

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα', sithonia: 'Σιθωνία', athos: 'Άθως', mainland: 'Ενδοχώρα',
};

export default function AdminVillagesPage() {
  const locale = useLocale();
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState('');

  useEffect(() => { loadVillages(); }, []);

  async function loadVillages() {
    const supabase = createClient();
    const { data } = await supabase.from('villages')
      .select('id, slug, name_el, name_en, area, population, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
      .order('sort_order');
    setVillages((data as Village[]) || []);
    setLoading(false);
  }

  async function deleteVillage(id: string) {
    if (!confirm('Διαγραφή αυτού του χωριού ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('villages').delete().eq('id', id);
    loadVillages();
  }

  function getSeoStatus(v: Village) {
    const issues: string[] = [];
    if (!v.image_url) issues.push('Image');
    if (!v.image_alt) issues.push('Alt');
    if (!v.meta_title_el) issues.push('Title EL');
    if (!v.meta_title_en) issues.push('Title EN');
    if (!v.meta_description_el) issues.push('Desc EL');
    if (!v.name_en) issues.push('Name EN');
    return issues;
  }

  const filtered = filterArea ? villages.filter(v => v.area === filterArea) : villages;
  const totalComplete = villages.filter(v => getSeoStatus(v).length === 0).length;

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Villages ({filtered.length}/{villages.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === villages.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{villages.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">All areas</option>
            {Object.entries(AREA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <Link href="/admin/villages/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
            <Plus className="w-4 h-4" />Add New
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Area</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">Pop.</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((v) => {
              const issues = getSeoStatus(v);
              return (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{v.name_el}</div>
                    {v.name_en && <div className="text-xs text-gray-400">{v.name_en}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{AREA_LABELS[v.area] || v.area}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{v.population || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    {v.image_url
                      ? <span className="text-green-600"><ImageIcon className="w-3.5 h-3.5 inline" /> ✓</span>
                      : <span className="text-red-500"><ImageIcon className="w-3.5 h-3.5 inline" /> ✗</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {issues.length === 0
                      ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      : <span title={issues.join(', ')}><XCircle className="w-4 h-4 text-red-500 mx-auto" /><span className="text-[10px] text-red-500 ml-0.5">{issues.length}</span></span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/${locale}/places/${v.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link href={`/admin/villages/${v.id}/edit`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteVillage(v.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No villages found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
