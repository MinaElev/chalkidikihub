'use client';

import { useEffect, useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Loader2, Church, CheckCircle, XCircle, ExternalLink, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Monastery {
  id: string;
  slug: string;
  rank: number;
  founded: number;
  nation: string;
  name_el: string;
  name_en: string;
  image_url: string;
  meta_title_el: string;
  meta_title_en: string;
  meta_description_el: string;
  description_el: string;
}

const NATION_LABELS: Record<string, string> = { el: 'Ελληνική', rs: 'Σερβική', bg: 'Βουλγαρική', ru: 'Ρωσική' };

type SortKey = 'rank' | 'name' | 'nation' | 'seo';
type SortDir = 'asc' | 'desc';

function getSeoStatus(m: Monastery) {
  const issues: string[] = [];
  if (!m.description_el) issues.push('Desc EL');
  if (!m.meta_title_el) issues.push('Title EL');
  if (!m.meta_title_en) issues.push('Title EN');
  if (!m.meta_description_el) issues.push('Desc SEO');
  if (!m.name_en) issues.push('Name EN');
  return issues;
}

export default function AdminMonasteriesPage() {
  const locale = useLocale();
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeo, setFilterSeo] = useState<'' | 'complete' | 'issues'>('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const supabase = createClient();
    const { data } = await supabase.from('monasteries')
      .select('id, slug, rank, founded, nation, name_el, name_en, image_url, meta_title_el, meta_title_en, meta_description_el, description_el')
      .order('rank');
    setMonasteries((data as Monastery[]) || []);
    setLoading(false);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    let result = [...monasteries];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.name_el?.toLowerCase().includes(q) || m.name_en?.toLowerCase().includes(q));
    }
    if (filterSeo === 'complete') result = result.filter(m => getSeoStatus(m).length === 0);
    if (filterSeo === 'issues') result = result.filter(m => getSeoStatus(m).length > 0);
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'rank': cmp = a.rank - b.rank; break;
        case 'name': cmp = (a.name_el || '').localeCompare(b.name_el || '', 'el'); break;
        case 'nation': cmp = (a.nation || '').localeCompare(b.nation || ''); break;
        case 'seo': cmp = getSeoStatus(a).length - getSeoStatus(b).length; break;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return result;
  }, [monasteries, searchQuery, filterSeo, sortKey, sortDir]);

  const totalComplete = monasteries.filter(m => getSeoStatus(m).length === 0).length;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-gray-300" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-red-600" /> : <ArrowDown className="w-3 h-3 text-red-600" />;
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Church className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Monasteries ({filtered.length}/{monasteries.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === monasteries.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{monasteries.length}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-gray-200 rounded-xl p-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση μονής..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterSeo} onChange={e => setFilterSeo(e.target.value as '' | 'complete' | 'issues')}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
          <option value="">SEO: Όλα</option>
          <option value="complete">SEO OK</option>
          <option value="issues">SEO Issues</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-red-50 border-b border-red-100">
            <tr>
              <th className="text-center px-3 py-3 font-semibold text-red-900 cursor-pointer" onClick={() => handleSort('rank')}><span className="flex items-center justify-center gap-1"># <SortIcon col="rank" /></span></th>
              <th className="text-left px-4 py-3 font-semibold text-red-900 cursor-pointer" onClick={() => handleSort('name')}><span className="flex items-center gap-1">Name <SortIcon col="name" /></span></th>
              <th className="text-center px-3 py-3 font-semibold text-red-900">Founded</th>
              <th className="text-center px-3 py-3 font-semibold text-red-900 cursor-pointer" onClick={() => handleSort('nation')}><span className="flex items-center justify-center gap-1">Nation <SortIcon col="nation" /></span></th>
              <th className="text-center px-3 py-3 font-semibold text-red-900 cursor-pointer" onClick={() => handleSort('seo')}><span className="flex items-center justify-center gap-1">SEO <SortIcon col="seo" /></span></th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => {
              const issues = getSeoStatus(m);
              return (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="text-center px-3 py-3 text-gray-500 font-medium">{m.rank}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{m.name_el}</div>
                    {m.name_en && <div className="text-xs text-gray-400">{m.name_en}</div>}
                  </td>
                  <td className="text-center px-3 py-3 text-gray-600">{m.founded}</td>
                  <td className="text-center px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.nation !== 'el' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {NATION_LABELS[m.nation] || m.nation}
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    {issues.length === 0
                      ? <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                      : <span className="inline-flex items-center gap-0.5" title={issues.join(', ')}><XCircle className="w-4 h-4 text-red-500" /><span className="text-[10px] text-red-500">{issues.length}</span></span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/${locale}/mount-athos/monasteries/${m.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Link href={`/admin/monasteries/${m.id}/edit`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
