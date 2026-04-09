'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Building, Eye, EyeOff, Trash2, Loader2, Search, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { AREA_SLUGS } from '@/lib/constants';

interface AdminSale {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  area: string;
  price: number;
  size_sqm: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  owner: { full_name: string; phone: string; role: string } | null;
  sale_images: { id: string; image_url: string; is_cover: boolean }[];
}

const PROPERTY_TYPES = ['house', 'apartment', 'land', 'commercial', 'other'];
const TYPE_LABELS: Record<string, string> = {
  house: 'Κατοικία',
  apartment: 'Διαμέρισμα',
  land: 'Γη',
  commercial: 'Επαγγελματικό',
  other: 'Λοιπά',
};

export default function AdminSalesPage() {
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadSales(); }, []);

  async function loadSales() {
    try {
      const res = await fetch('/api/admin/sales');
      const data = await res.json();
      if (Array.isArray(data)) setSales(data as AdminSale[]);
    } catch {}
    setLoading(false);
  }

  async function toggleStatus(id: string) {
    await fetch('/api/admin/sales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'toggle' }),
    });
    loadSales();
  }

  async function deleteSale(id: string) {
    if (!confirm('Διαγραφή αυτού του ακινήτου ΜΟΝΙΜΑ;')) return;
    await fetch('/api/admin/sales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'delete' }),
    });
    loadSales();
  }

  const filtered = sales.filter((s) => {
    if (filterArea && s.area !== filterArea) return false;
    if (filterType && s.property_type !== filterType) return false;
    if (filterStatus && s.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.title_el?.toLowerCase().includes(q) ||
        s.title_en?.toLowerCase().includes(q) ||
        s.owner?.full_name?.toLowerCase().includes(q);
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">All Sales ({filtered.length}/{sales.length})</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση τίτλου, ιδιοκτήτη..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι περιοχές</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλοι οι τύποι</option>
          {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{TYPE_LABELS[pt] || pt}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλα τα status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Sales list */}
      <div className="space-y-3">
        {filtered.map((sale) => {
          const isExpanded = expanded === sale.id;
          return (
            <div key={sale.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(isExpanded ? null : sale.id)}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {sale.sale_images?.[0] ? (
                      <img src={sale.sale_images[0].image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-400 font-bold text-xs">S</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{sale.title_el}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{sale.area}</span>
                      <span>·</span>
                      <span>{TYPE_LABELS[sale.property_type] || sale.property_type}</span>
                      <span>·</span>
                      <span>{sale.price ? `€${sale.price.toLocaleString()}` : '-'}</span>
                      {sale.size_sqm > 0 && <><span>·</span><span>{sale.size_sqm} m²</span></>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{sale.owner?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{sale.owner?.role || 'owner'}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sale.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{sale.status}</span>

                  <div className="flex items-center gap-1">
                    <Link href={`/admin/sales/${sale.id}/edit`} onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Επεξεργασία">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(sale.id); }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      title={sale.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {sale.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSale(sale.id); }}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Διαγραφή">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Ακίνητο</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{sale.id}</span></div>
                        <div><span className="text-gray-500">Slug:</span> <span className="font-mono text-xs">{sale.slug}</span></div>
                        <div><span className="text-gray-500">Τίτλος EL:</span> {sale.title_el}</div>
                        <div><span className="text-gray-500">Τίτλος EN:</span> {sale.title_en || '-'}</div>
                        <div><span className="text-gray-500">Τύπος:</span> {TYPE_LABELS[sale.property_type] || sale.property_type}</div>
                        <div><span className="text-gray-500">Περιοχή:</span> <span className="capitalize">{sale.area}</span></div>
                        <div><span className="text-gray-500">Τιμή:</span> {sale.price ? `€${sale.price.toLocaleString()}` : '-'}</div>
                        <div><span className="text-gray-500">Εμβαδόν:</span> {sale.size_sqm ? `${sale.size_sqm} m²` : '-'}</div>
                        <div><span className="text-gray-500">Δωμάτια:</span> {sale.bedrooms || 0} bed / {sale.bathrooms || 0} bath</div>
                        <div><span className="text-gray-500">Δημιουργία:</span> {new Date(sale.created_at).toLocaleString('el')}</div>
                        <div><span className="text-gray-500">Ενημέρωση:</span> {sale.updated_at ? new Date(sale.updated_at).toLocaleString('el') : '-'}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Ιδιοκτήτης</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Όνομα:</span> <span className="font-medium">{sale.owner?.full_name || 'Δεν συμπληρώθηκε'}</span></div>
                        <div><span className="text-gray-500">User ID:</span> <span className="font-mono text-xs">{sale.owner_id}</span></div>
                        <div><span className="text-gray-500">Ρόλος:</span> <span className="capitalize">{sale.owner?.role || 'owner'}</span></div>
                        <div><span className="text-gray-500">Τηλ:</span> {sale.owner?.phone || '-'}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Φωτογραφίες ({sale.sale_images?.length || 0})</h3>
                      {sale.sale_images?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sale.sale_images.map((img) => (
                            <img key={img.id} src={img.image_url} alt=""
                              className={`w-20 h-16 rounded-lg object-cover ${img.is_cover ? 'ring-2 ring-primary-500' : ''}`} />
                          ))}
                        </div>
                      ) : <div className="text-gray-400 text-sm">Χωρίς φωτογραφίες</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">Δεν βρέθηκαν ακίνητα</p>
          </div>
        )}
      </div>
    </div>
  );
}
