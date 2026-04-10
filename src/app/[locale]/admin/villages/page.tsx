'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, MapPin, CheckCircle, XCircle, ImageIcon, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Village {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  name_de: string;
  name_sr: string;
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

type SortKey = 'name' | 'area' | 'population' | 'image' | 'seo';
type SortDir = 'asc' | 'desc';

function getSeoStatus(v: Village) {
  const issues: string[] = [];
  if (!v.image_url) issues.push('Image');
  if (!v.image_alt) issues.push('Alt');
  if (!v.meta_title_el) issues.push('Title EL');
  if (!v.meta_title_en) issues.push('Title EN');
  if (!v.meta_description_el) issues.push('Desc EL');
  if (!v.name_en) issues.push('Name EN');
  if (!v.name_sr) issues.push('Name SR');
  if (!v.name_de) issues.push('Name DE');
  return issues;
}

export default function AdminVillagesPage() {
  const locale = useLocale();
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterImage, setFilterImage] = useState<'' | 'yes' | 'no'>('');
  const [filterSeo, setFilterSeo] = useState<'' | 'complete' | 'issues'>('');
  const [filterPop, setFilterPop] = useState<'' | 'yes' | 'no'>('');

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => { loadVillages(); }, []);

  async function loadVillages() {
    const supabase = createClient();
    const { data } = await supabase.from('villages')
      .select('id, slug, name_el, name_en, name_de, name_sr, area, population, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
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

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = useMemo(() => {
    let result = [...villages];

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name_el?.toLowerCase().includes(q) ||
        v.name_en?.toLowerCase().includes(q) ||
        v.slug?.includes(q)
      );
    }

    // Area filter
    if (filterArea) result = result.filter(v => v.area === filterArea);

    // Image filter
    if (filterImage === 'yes') result = result.filter(v => !!v.image_url);
    if (filterImage === 'no') result = result.filter(v => !v.image_url);

    // SEO filter
    if (filterSeo === 'complete') result = result.filter(v => getSeoStatus(v).length === 0);
    if (filterSeo === 'issues') result = result.filter(v => getSeoStatus(v).length > 0);

    // Population filter
    if (filterPop === 'yes') result = result.filter(v => v.population && v.population > 0);
    if (filterPop === 'no') result = result.filter(v => !v.population || v.population === 0);

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name': cmp = (a.name_el || '').localeCompare(b.name_el || '', 'el'); break;
        case 'area': cmp = (a.area || '').localeCompare(b.area || ''); break;
        case 'population': cmp = (a.population || 0) - (b.population || 0); break;
        case 'image': cmp = (a.image_url ? 1 : 0) - (b.image_url ? 1 : 0); break;
        case 'seo': cmp = getSeoStatus(a).length - getSeoStatus(b).length; break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [villages, searchQuery, filterArea, filterImage, filterSeo, filterPop, sortKey, sortDir]);

  const totalComplete = villages.filter(v => getSeoStatus(v).length === 0).length;
  const hasImage = villages.filter(v => !!v.image_url).length;
  const hasPop = villages.filter(v => v.population && v.population > 0).length;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-red-600" /> : <ArrowDown className="w-3 h-3 text-red-600" />;
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Villages ({filtered.length}/{villages.length})</h1>
        </div>
        <Link href="/admin/villages/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
          <Plus className="w-4 h-4" />Add New
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-bold text-gray-900">{villages.length}</div>
          <div className="text-[10px] text-gray-500">Total</div>
        </div>
        <div className={`border rounded-lg px-3 py-2 text-center ${totalComplete === villages.length ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="text-lg font-bold">{totalComplete}/{villages.length}</div>
          <div className="text-[10px] text-gray-500">SEO OK</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-bold text-gray-900">{hasImage}/{villages.length}</div>
          <div className="text-[10px] text-gray-500">With Image</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-center">
          <div className="text-lg font-bold text-gray-900">{hasPop}/{villages.length}</div>
          <div className="text-[10px] text-gray-500">With Pop.</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση ονόματος..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι περιοχές</option>
          {Object.entries(AREA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterImage} onChange={e => setFilterImage(e.target.value as '' | 'yes' | 'no')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">Image: Όλα</option>
          <option value="yes">Με εικόνα</option>
          <option value="no">Χωρίς εικόνα</option>
        </select>
        <select value={filterSeo} onChange={e => setFilterSeo(e.target.value as '' | 'complete' | 'issues')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">SEO: Όλα</option>
          <option value="complete">SEO OK</option>
          <option value="issues">SEO Issues</option>
        </select>
        <select value={filterPop} onChange={e => setFilterPop(e.target.value as '' | 'yes' | 'no')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">Pop: Όλα</option>
          <option value="yes">Με πληθυσμό</option>
          <option value="no">Χωρίς πληθυσμό</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-red-900 cursor-pointer select-none" onClick={() => handleSort('name')}>
                <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
              </th>
              <th className="text-left px-4 py-3 font-semibold text-red-900 cursor-pointer select-none" onClick={() => handleSort('area')}>
                <span className="flex items-center gap-1">Area <SortIcon col="area" /></span>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-red-900 cursor-pointer select-none" onClick={() => handleSort('population')}>
                <span className="flex items-center justify-center gap-1">Pop. <SortIcon col="population" /></span>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-red-900 cursor-pointer select-none" onClick={() => handleSort('image')}>
                <span className="flex items-center justify-center gap-1">Image <SortIcon col="image" /></span>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-red-900 cursor-pointer select-none" onClick={() => handleSort('seo')}>
                <span className="flex items-center justify-center gap-1">SEO <SortIcon col="seo" /></span>
              </th>
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
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      v.area === 'kassandra' ? 'bg-blue-100 text-blue-700' :
                      v.area === 'sithonia' ? 'bg-green-100 text-green-700' :
                      v.area === 'athos' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{AREA_LABELS[v.area] || v.area}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{v.population ? v.population.toLocaleString() : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    {v.image_url
                      ? <span className="text-green-600"><ImageIcon className="w-3.5 h-3.5 inline" /> ✓</span>
                      : <span className="text-red-400"><ImageIcon className="w-3.5 h-3.5 inline" /> ✗</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {issues.length === 0
                      ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      : <span className="inline-flex items-center gap-0.5" title={issues.join(', ')}><XCircle className="w-4 h-4 text-red-500" /><span className="text-[10px] text-red-500">{issues.length}</span></span>}
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
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Δεν βρέθηκαν χωριά</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
