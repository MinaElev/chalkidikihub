'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Loader2, UtensilsCrossed, CheckCircle, XCircle, ImageIcon, ExternalLink, Search } from 'lucide-react';
import { AREA_SLUGS } from '@/lib/constants';

interface Restaurant {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  name_de: string;
  name_sr: string;
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

const PRICE_LEVELS = ['budget', 'moderate', 'premium', 'luxury'];

export default function AdminRestaurantsPage() {
  const locale = useLocale();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterSeo, setFilterSeo] = useState('');

  useEffect(() => { loadRestaurants(); }, []);

  async function loadRestaurants() {
    const supabase = createClient();
    const { data } = await supabase.from('restaurants')
      .select('id, slug, name_el, name_en, name_de, name_sr, area, cuisine, price_level, rating, image_url, image_alt, meta_title_el, meta_title_en, meta_description_el')
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
    if (!r.name_sr) issues.push('Name SR');
    if (!r.name_de) issues.push('Name DE');
    return issues;
  }

  const totalComplete = restaurants.filter(r => getSeoStatus(r).length === 0).length;

  const filtered = restaurants.filter((r) => {
    if (filterArea && r.area !== filterArea) return false;
    if (filterPrice && r.price_level !== filterPrice) return false;
    if (filterSeo === 'complete' && getSeoStatus(r).length !== 0) return false;
    if (filterSeo === 'incomplete' && getSeoStatus(r).length === 0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return r.name_el?.toLowerCase().includes(q) || r.name_en?.toLowerCase().includes(q) ||
        (r.cuisine || []).some(c => c.toLowerCase().includes(q));
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Restaurants ({filtered.length}/{restaurants.length})</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${totalComplete === restaurants.length ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            SEO: {totalComplete}/{restaurants.length}
          </span>
        </div>
        <Link href="/admin/restaurants/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium">
          <Plus className="w-4 h-4" />Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση ονόματος, κουζίνας..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500" />
        </div>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι περιοχές</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι τιμές</option>
          {PRICE_LEVELS.map((p) => <option key={p} value={p}>{p}</option>)}
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
              <th className="text-left px-4 py-3 font-semibold text-red-900">Cuisine</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-red-900">Rating</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">Image</th>
              <th className="text-center px-4 py-3 font-semibold text-red-900">SEO</th>
              <th className="text-right px-4 py-3 font-semibold text-red-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => {
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
                    <a href={`/${locale}/restaurants/${r.slug || r.id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-500" title="Preview">
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">Δεν βρέθηκαν εστιατόρια</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
