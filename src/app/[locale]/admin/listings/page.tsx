'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { List, Eye, EyeOff, Trash2, Loader2, ExternalLink, ChevronDown, ChevronUp, Phone, Mail, Search, Filter, Pencil } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Area } from '@/types';
import { AREA_SLUGS } from '@/lib/constants';

interface AdminListing {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  description_el: string;
  area: string;
  location_name: string;
  price_per_night: number;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: string;
  contact_phone: string | null;
  contact_email: string | null;
  booking_url: string | null;
  airbnb_url: string | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
  profiles: { full_name: string; phone: string; role: string } | null;
  listing_images: { id: string; image_url: string; is_cover: boolean }[];
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadListings(); }, []);

  async function loadListings() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listings')
      .select(`
        id, slug, title_el, title_en, description_el, area, location_name,
        price_per_night, guests_max, bedrooms, bathrooms, amenities,
        status, contact_phone, contact_email, booking_url, airbnb_url,
        created_at, updated_at, owner_id,
        profiles(full_name, phone, role),
        listing_images(id, image_url, is_cover)
      `)
      .order('created_at', { ascending: false });
    setListings((data as unknown as AdminListing[]) || []);
    setLoading(false);
  }

  async function toggleStatus(id: string, current: string) {
    const supabase = createClient();
    await supabase.from('listings').update({ status: current === 'published' ? 'draft' : 'published' }).eq('id', id);
    loadListings();
  }

  async function deleteListing(id: string) {
    if (!confirm('Διαγραφή αυτού του listing ΜΟΝΙΜΑ;')) return;
    const supabase = createClient();
    await supabase.from('listing_images').delete().eq('listing_id', id);
    await supabase.from('listings').delete().eq('id', id);
    loadListings();
  }

  const filtered = listings.filter((l) => {
    if (filterArea && l.area !== filterArea) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.title_el.toLowerCase().includes(q) ||
        l.location_name.toLowerCase().includes(q) ||
        l.profiles?.full_name?.toLowerCase().includes(q) ||
        l.contact_email?.toLowerCase().includes(q) ||
        l.contact_phone?.includes(q);
    }
    return true;
  });

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <List className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">All Listings ({filtered.length}/{listings.length})</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση τίτλου, ιδιοκτήτη, email, τηλεφώνου..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500" />
        </div>
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλες οι περιοχές</option>
          {AREA_SLUGS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Όλα τα status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Listings */}
      <div className="space-y-3">
        {filtered.map((listing) => {
          const isExpanded = expanded === listing.id;
          return (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Row */}
              <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(isExpanded ? null : listing.id)}>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {listing.listing_images?.[0] ? (
                      <Image src={listing.listing_images[0].image_url || '/images/placeholder.svg'} alt="" width={48} height={48} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-400 font-bold text-xs">H</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">{listing.title_el}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{listing.area}</span>
                      <span>•</span>
                      <span>{listing.location_name}</span>
                      <span>•</span>
                      <span>&euro;{listing.price_per_night}/night</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Owner */}
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-medium text-gray-700">{listing.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{listing.profiles?.role || 'owner'}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    listing.status === 'published' ? 'bg-green-100 text-green-700' :
                    listing.status === 'archived' ? 'bg-gray-100 text-gray-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{listing.status}</span>

                  <div className="flex items-center gap-1">
                    <Link href={`/admin/listings/${listing.id}/edit`} onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center gap-1 text-xs font-medium" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />Edit
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(listing.id, listing.status); }}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                      title={listing.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {listing.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteListing(listing.id); }}
                      className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Διαγραφή">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Στοιχεία Καταλύματος */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Κατάλυμα</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">ID:</span> <span className="font-mono text-xs">{listing.id}</span></div>
                        <div><span className="text-gray-500">Slug:</span> <span className="font-mono text-xs">{listing.slug}</span></div>
                        <div><span className="text-gray-500">Τίτλος EL:</span> {listing.title_el}</div>
                        <div><span className="text-gray-500">Τίτλος EN:</span> {listing.title_en || '-'}</div>
                        <div><span className="text-gray-500">Περιοχή:</span> <span className="capitalize">{listing.area}</span></div>
                        <div><span className="text-gray-500">Τοποθεσία:</span> {listing.location_name}</div>
                        <div><span className="text-gray-500">Τιμή:</span> &euro;{listing.price_per_night}/night</div>
                        <div><span className="text-gray-500">Επισκέπτες:</span> {listing.guests_max}</div>
                        <div><span className="text-gray-500">Δωμάτια:</span> {listing.bedrooms} bed / {listing.bathrooms} bath</div>
                        <div><span className="text-gray-500">Παροχές:</span> {(listing.amenities || []).join(', ') || '-'}</div>
                        <div><span className="text-gray-500">Δημιουργία:</span> {new Date(listing.created_at).toLocaleString('el')}</div>
                        <div><span className="text-gray-500">Ενημέρωση:</span> {new Date(listing.updated_at).toLocaleString('el')}</div>
                      </div>
                    </div>

                    {/* Στοιχεία Ιδιοκτήτη */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Ιδιοκτήτης</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-500">Όνομα:</span> <span className="font-medium">{listing.profiles?.full_name || 'Δεν συμπληρώθηκε'}</span></div>
                        <div><span className="text-gray-500">User ID:</span> <span className="font-mono text-xs">{listing.owner_id}</span></div>
                        <div><span className="text-gray-500">Ρόλος:</span> <span className="capitalize">{listing.profiles?.role || 'owner'}</span></div>
                        <div><span className="text-gray-500">Τηλ. προφίλ:</span> {listing.profiles?.phone || '-'}</div>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3 uppercase tracking-wide">Επικοινωνία Listing</h3>
                      <div className="space-y-2 text-sm">
                        {listing.contact_phone ? (
                          <a href={`tel:${listing.contact_phone}`} className="flex items-center gap-2 text-green-700 hover:underline">
                            <Phone className="w-3.5 h-3.5" />{listing.contact_phone}
                          </a>
                        ) : <div className="text-gray-400">Δεν δόθηκε τηλέφωνο</div>}
                        {listing.contact_email ? (
                          <a href={`mailto:${listing.contact_email}`} className="flex items-center gap-2 text-primary-600 hover:underline">
                            <Mail className="w-3.5 h-3.5" />{listing.contact_email}
                          </a>
                        ) : <div className="text-gray-400">Δεν δόθηκε email</div>}
                      </div>

                      <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3 uppercase tracking-wide">Links Κρατήσεων</h3>
                      <div className="space-y-2 text-sm">
                        {listing.booking_url ? (
                          <a href={listing.booking_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                            <ExternalLink className="w-3.5 h-3.5" />Booking.com
                          </a>
                        ) : <div className="text-gray-400">Χωρίς Booking link</div>}
                        {listing.airbnb_url ? (
                          <a href={listing.airbnb_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-600 hover:underline">
                            <ExternalLink className="w-3.5 h-3.5" />Airbnb
                          </a>
                        ) : <div className="text-gray-400">Χωρίς Airbnb link</div>}
                      </div>
                    </div>

                    {/* Φωτογραφίες & Περιγραφή */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Φωτογραφίες ({listing.listing_images?.length || 0})</h3>
                      {listing.listing_images?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {listing.listing_images.map((img) => (
                            <Image key={img.id} src={img.image_url || '/images/placeholder.svg'} alt="" width={80} height={64}
                              className={`w-20 h-16 rounded-lg object-cover ${img.is_cover ? 'ring-2 ring-primary-500' : ''}`} />
                          ))}
                        </div>
                      ) : <div className="text-gray-400 text-sm">Χωρίς φωτογραφίες</div>}

                      <h3 className="text-sm font-semibold text-gray-700 mt-5 mb-3 uppercase tracking-wide">Περιγραφή</h3>
                      <p className="text-sm text-gray-600 line-clamp-5">{listing.description_el || 'Χωρίς περιγραφή'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
            <p className="text-gray-500">Δεν βρέθηκαν listings</p>
          </div>
        )}
      </div>
    </div>
  );
}
