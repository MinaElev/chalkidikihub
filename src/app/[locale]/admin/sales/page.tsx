'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Building, Eye, EyeOff, Trash2, Loader2, Search, ChevronDown, ChevronUp, Pencil, ExternalLink } from 'lucide-react';
import Image from 'next/image';
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
  const locale = useLocale();
  const [sales, setSales] = useState<AdminSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadSales(); }, []);

  async function loadSales() {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from('sales')
        .select(`
          id, slug, title_el, title_en, area, price, size_sqm, property_type,
          bedrooms, bathrooms, status, created_at, updated_at, owner_id,
          sale_images(id, image_url, is_cover)
        `)
        .order('created_at', { ascending: false });
      if (dbError) {
        setError(`DB error: ${dbError.message}`);
        return;
      }
      setSales((data as unknown as AdminSale[]) || []);
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id: string) {
    const supabase = createClient();
    const { data: sale } = await supabase.from('sales').select('status').eq('id', id).single();
    if (sale) {
      await supabase.from('sales').update({ status: sale.status === 'published' ? 'draft' : 'published' }).eq('id', id);
    }
    loadSales();
  }

  async function deleteSale(id: string) {
    if (!confirm('Διαγραφή αυτού του ακινήτου ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('sale_images').delete().eq('sale_id', id);
    await supabase.from('sales').delete().eq('id', id);
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
        s.owner_id?.toLowerCase().includes(q);
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

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <strong>Σφάλμα:</strong> {error}
          <button onClick={loadSales} className="ml-3 underline hover:no-underline">Δοκίμασε ξανά</button>
        </div>
      )}

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
                      <Image src={sale.sale_images[0].image_url || '/images/placeholder.svg'} alt="" width={48} height={48} className="w-full h-full object-cover" />
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
                    <div className="text-sm font-medium text-gray-700 font-mono text-xs">{sale.owner_id?.slice(0, 8)}…</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sale.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{sale.status}</span>

                  <div className="flex items-center gap-1">
                    {sale.slug && (
                      <a href={`/${locale}/sales/${sale.slug}`} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Preview">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
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
                        <div><span className="text-gray-500">User ID:</span> <span className="font-mono text-xs">{sale.owner_id}</span></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Φωτογραφίες ({sale.sale_images?.length || 0})</h3>
                      {sale.sale_images?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sale.sale_images.map((img) => (
                            <Image key={img.id} src={img.image_url || '/images/placeholder.svg'} alt="" width={80} height={64}
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

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">Δεν βρέθηκαν ακίνητα</p>
          </div>
        )}
      </div>
    </div>
  );
}
