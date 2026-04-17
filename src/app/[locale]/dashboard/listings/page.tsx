'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Loader2, QrCode, Calendar,
  Users, BedDouble, Bath, Wand2, MapPin, ExternalLink,
  MoreHorizontal, Lock, Search,
} from 'lucide-react';

interface Img { image_url: string; is_cover: boolean; sort_order: number; }

interface DbListing {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  area: string;
  location_name: string | null;
  price_per_night: number;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  is_closed: boolean;
  created_at: string;
  listing_images: Img[];
}

export default function MyListingsPage() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'closed'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  useEffect(() => {
    const close = () => setMenuOpenId(null);
    if (menuOpenId) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [menuOpenId]);

  async function loadListings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('listings')
      .select(`
        id, slug, title_el, title_en, area, location_name,
        price_per_night, guests_max, bedrooms, bathrooms,
        status, is_closed, created_at,
        listing_images (image_url, is_cover, sort_order)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    setListings((data || []) as unknown as DbListing[]);
    setLoading(false);
  }

  async function deleteListing(id: string) {
    if (!confirm(locale === 'el' ? 'Σίγουρα θες να διαγραφεί αυτό το κατάλυμα;' : 'Are you sure?')) return;
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

  const stats = useMemo(() => {
    const total = listings.length;
    const published = listings.filter(l => l.status === 'published').length;
    const drafts = listings.filter(l => l.status === 'draft').length;
    const closed = listings.filter(l => l.is_closed).length;
    return { total, published, drafts, closed };
  }, [listings]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return listings.filter(l => {
      if (statusFilter === 'published' && l.status !== 'published') return false;
      if (statusFilter === 'draft' && l.status !== 'draft') return false;
      if (statusFilter === 'closed' && !l.is_closed) return false;
      if (needle) {
        const hay = [l.title_el, l.title_en, l.location_name, l.area].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [listings, q, statusFilter]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  const L = {
    heading: t('myListings'),
    add: locale === 'el' ? 'Νέο κατάλυμα' : 'Add listing',
    empty: locale === 'el' ? 'Δεν έχεις καταλύματα ακόμα' : 'No listings yet',
    createFirst: locale === 'el' ? 'Δημιούργησε το πρώτο σου' : 'Create your first listing',
    all: locale === 'el' ? 'Όλα' : 'All',
    published: locale === 'el' ? 'Δημοσιευμένα' : 'Published',
    drafts: locale === 'el' ? 'Προσχέδια' : 'Drafts',
    closed: locale === 'el' ? 'Κλειστά' : 'Closed',
    active: locale === 'el' ? 'Ενεργό' : 'Active',
    searchPlaceholder: locale === 'el' ? 'Αναζήτηση...' : 'Search…',
    guests: locale === 'el' ? 'άτομα' : 'guests',
    beds: locale === 'el' ? 'κρεβ.' : 'beds',
    baths: locale === 'el' ? 'μπάνια' : 'baths',
    perNight: locale === 'el' ? '/νύχτα' : '/night',
    details: locale === 'el' ? 'Στοιχεία' : 'Details',
    siteEditor: locale === 'el' ? 'Site καταλύματος' : 'Brand site',
    calendar: locale === 'el' ? 'Ημερολόγιο' : 'Calendar',
    preview: locale === 'el' ? 'Προβολή' : 'Preview',
    qr: 'QR',
    publish: locale === 'el' ? 'Δημοσίευση' : 'Publish',
    unpublish: locale === 'el' ? 'Απόσυρση' : 'Unpublish',
    delete: locale === 'el' ? 'Διαγραφή' : 'Delete',
    noImage: locale === 'el' ? 'Χωρίς εικόνα' : 'No image',
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{L.heading}</h1>
          {listings.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {stats.total} {stats.total === 1 ? 'κατάλυμα' : 'καταλύματα'} ·{' '}
              <span className="text-green-700">{stats.published} δημοσιευμένα</span>{stats.drafts > 0 && <>, <span className="text-amber-700">{stats.drafts} προσχέδια</span></>}{stats.closed > 0 && <>, <span className="text-orange-700">{stats.closed} κλειστά</span></>}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/listings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          {L.add}
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">{L.empty}</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {L.createFirst}
          </Link>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={L.searchPlaceholder}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-xl text-sm w-60 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {([
                { k: 'all',       label: L.all,       n: stats.total },
                { k: 'published', label: L.published, n: stats.published },
                { k: 'draft',     label: L.drafts,    n: stats.drafts },
                { k: 'closed',    label: L.closed,    n: stats.closed },
              ] as const).map(f => (
                <button
                  key={f.k}
                  type="button"
                  onClick={() => setStatusFilter(f.k)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === f.k
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.label} <span className="text-gray-400 tabular-nums">{f.n}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((listing) => {
              const title = locale === 'el' ? listing.title_el : (listing.title_en || listing.title_el);
              const cover = listing.listing_images?.find(i => i.is_cover)?.image_url
                         || listing.listing_images?.[0]?.image_url;
              const isPublished = listing.status === 'published';
              const isClosed = !!listing.is_closed;

              return (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Cover */}
                    <div className="relative w-full sm:w-44 sm:h-auto h-40 bg-gray-100 shrink-0">
                      {cover ? (
                        <Image src={cover} alt={title} fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          {L.noImage}
                        </div>
                      )}
                      {isClosed && (
                        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-600/90 text-white text-[10px] font-semibold backdrop-blur-sm">
                          <Lock className="w-3 h-3" /> {L.closed}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 p-4 flex flex-col">
                      {/* Title + status */}
                      <div className="flex items-start gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900 min-w-0 flex-1 truncate">{title}</h3>
                        {!isClosed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {L.active}
                          </span>
                        )}
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                          isPublished ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {listing.status}
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="capitalize">{listing.area}</span>
                          {listing.location_name && <span className="text-gray-400">· {listing.location_name}</span>}
                        </span>
                        <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {listing.guests_max}</span>
                        <span className="inline-flex items-center gap-1"><BedDouble className="w-3 h-3" /> {listing.bedrooms}</span>
                        <span className="inline-flex items-center gap-1"><Bath className="w-3 h-3" /> {listing.bathrooms}</span>
                        <span className="font-semibold text-gray-900 ml-auto">
                          €{listing.price_per_night}<span className="font-normal text-gray-500 text-[10px]">{L.perNight}</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/listings/${listing.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium rounded-lg"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          {L.details}
                        </Link>
                        <Link
                          href={`/dashboard/listings/${listing.id}/brand`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          {L.siteEditor}
                        </Link>
                        <Link
                          href={`/dashboard/listings/${listing.id}/availability`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {L.calendar}
                        </Link>

                        {/* Preview */}
                        <Link
                          href={`/stay/${listing.slug}`}
                          target="_blank"
                          className="ml-auto p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-700"
                          title={L.preview}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {/* QR */}
                        <Link
                          href={`/dashboard/listings/${listing.id}/qr`}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600"
                          title={L.qr}
                        >
                          <QrCode className="w-4 h-4" />
                        </Link>

                        {/* Overflow menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === listing.id ? null : listing.id); }}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {menuOpenId === listing.id && (
                            <div
                              className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 w-48"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => { toggleStatus(listing.id, listing.status); setMenuOpenId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {isPublished ? L.unpublish : L.publish}
                              </button>
                              <div className="my-1 border-t border-gray-100" />
                              <button
                                type="button"
                                onClick={() => { deleteListing(listing.id); setMenuOpenId(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {L.delete}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-10 text-sm text-gray-500 bg-white border border-gray-200 rounded-2xl">
                {locale === 'el' ? 'Δεν βρέθηκαν αποτελέσματα.' : 'No matches.'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
