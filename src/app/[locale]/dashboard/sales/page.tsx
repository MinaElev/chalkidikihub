'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface DbSale {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  area: string;
  price: number;
  size_sqm: number;
  property_type: string;
  status: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  house: 'Κατοικία', apartment: 'Διαμέρισμα', land: 'Γη', commercial: 'Επαγγελματικό', other: 'Λοιπά',
};

export default function MySalesPage() {
  const locale = useLocale();
  const [sales, setSales] = useState<DbSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('sales')
      .select('id, slug, title_el, title_en, area, price, size_sqm, property_type, status, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setSales(data || []);
    setLoading(false);
  }

  async function deleteSale(id: string) {
    if (!confirm('Are you sure?')) return;
    const supabase = createClient();
    await supabase.from('sales').delete().eq('id', id);
    loadSales();
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const supabase = createClient();
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await supabase.from('sales').update({ status: newStatus }).eq('id', id);
    loadSales();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Τα Ακίνητά μου</h1>
        <Link
          href="/dashboard/sales/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Νέο Ακίνητο
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">Δεν έχετε ακίνητα ακόμα</p>
          <Link
            href="/dashboard/sales/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl"
          >
            <Plus className="w-5 h-5" />
            Καταχωρίστε το πρώτο σας ακίνητο
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {locale === 'el' ? sale.title_el : sale.title_en || sale.title_el}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="capitalize">{sale.area}</span>
                  <span>&euro;{sale.price.toLocaleString()}</span>
                  {sale.size_sqm > 0 && <span>{sale.size_sqm} τ.μ.</span>}
                  <span className="text-xs">{TYPE_LABELS[sale.property_type] || sale.property_type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sale.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/sales/${sale.id}/edit`}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => toggleStatus(sale.id, sale.status)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  title={sale.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {sale.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteSale(sale.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
