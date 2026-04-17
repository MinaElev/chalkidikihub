'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, QrCode, Calendar, Wand2 } from 'lucide-react';

interface DbListing {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  area: string;
  price_per_night: number;
  status: string;
  created_at: string;
}

export default function MyListingsPage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('listings')
      .select('id, slug, title_el, title_en, area, price_per_night, status, created_at')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setListings(data || []);
    setLoading(false);
  }

  async function deleteListing(id: string) {
    if (!confirm('Are you sure?')) return;
    const supabase = createClient();
    await supabase.from('listings').delete().eq('id', id);
    loadListings();
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const supabase = createClient();
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await supabase.from('listings').update({ status: newStatus }).eq('id', id);
    loadListings();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('myListings')}</h1>
        <Link
          href="/dashboard/listings/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl"
          >
            <Plus className="w-5 h-5" />
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">
                  {locale === 'el' ? listing.title_el : listing.title_en || listing.title_el}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="capitalize">{listing.area}</span>
                  <span>&euro;{listing.price_per_night}/night</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    listing.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/listings/${listing.id}/brand`}
                  className="p-2 rounded-lg hover:bg-primary-50 text-primary-600"
                  title="Σελίδα καταλύματος (Brand Page)"
                >
                  <Wand2 className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/listings/${listing.id}/availability`}
                  className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600"
                  title="Ημερολόγιο Διαθεσιμότητας"
                >
                  <Calendar className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/listings/${listing.id}/qr`}
                  className="p-2 rounded-lg hover:bg-purple-50 text-purple-500"
                  title="QR Guest Guide"
                >
                  <QrCode className="w-4 h-4" />
                </Link>
                <Link
                  href={`/dashboard/listings/${listing.id}/edit`}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => toggleStatus(listing.id, listing.status)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                  title={listing.status === 'published' ? 'Unpublish' : 'Publish'}
                >
                  {listing.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteListing(listing.id)}
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
