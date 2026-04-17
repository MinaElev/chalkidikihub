'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Loader2, QrCode, Calendar,
  Users, BedDouble, Bath, Wand2, MapPin, ExternalLink,
  MoreHorizontal, Lock, Search, TrendingUp, Palette,
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

  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadListings() {
    setLoadError(null);
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      setLoadError(authErr?.message || 'Not signed in');
      setLoading(false);
      return;
    }

    // Use '*' so the query survives schema drift (e.g. if a migration
    // hasn't been applied yet, the page still renders the listings).
    const { data, error } = await supabase
      .from('listings')
      .select('*, listing_images(image_url, is_cover, sort_order)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[MyListings] load error:', error);
      setLoadError(error.message);
      setListings([]);
    } else {
      setListings((data || []) as unknown as DbListing[]);
    }
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

      {loadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Σφάλμα φόρτωσης:</strong> {loadError}
          <div className="mt-2 text-xs text-red-600">
            Δοκίμασε hard refresh (Ctrl+Shift+R). Αν επιμένει, στείλε μου screenshot.
          </div>
        </div>
      )}

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
          {/* QR Code promo banner — owner's biggest traffic driver */}
          <QrPromoBanner locale={locale} />

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
              const images = Array.isArray(listing.listing_images) ? listing.listing_images : [];
              const cover = images.find(i => i.is_cover)?.image_url || images[0]?.image_url;
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
                          <span className="capitalize">{listing.area || '—'}</span>
                          {listing.location_name && <span className="text-gray-400">· {listing.location_name}</span>}
                        </span>
                        {listing.guests_max != null && <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {listing.guests_max}</span>}
                        {listing.bedrooms != null && <span className="inline-flex items-center gap-1"><BedDouble className="w-3 h-3" /> {listing.bedrooms}</span>}
                        {listing.bathrooms != null && <span className="inline-flex items-center gap-1"><Bath className="w-3 h-3" /> {listing.bathrooms}</span>}
                        {listing.price_per_night != null && (
                          <span className="font-semibold text-gray-900 ml-auto">
                            €{listing.price_per_night}<span className="font-normal text-gray-500 text-[10px]">{L.perNight}</span>
                          </span>
                        )}
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
                        <Link
                          href={`/dashboard/listings/${listing.id}/qr`}
                          className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                          title={locale === 'el' ? 'Φτιάξε QR Code για τους επισκέπτες σου' : 'Create a QR code for your guests'}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          {locale === 'el' ? 'QR για επισκέπτες' : 'Guest QR'}
                          <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                        </Link>
                        <Link
                          href={`/dashboard/listings/${listing.id}/social-kit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm"
                          title={locale === 'el' ? 'Έτοιμα γραφιστικά για Instagram, Facebook, TikTok' : 'Ready-made graphics for Instagram, Facebook, TikTok'}
                        >
                          <Palette className="w-3.5 h-3.5" />
                          {locale === 'el' ? 'Social Kit' : 'Social Kit'}
                        </Link>
                        <Link
                          href={`/dashboard/listings/${listing.id}/analytics`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 hover:text-sky-700 text-xs font-medium rounded-lg border border-gray-200"
                          title={locale === 'el' ? 'Στατιστικά & επισκεψιμότητα (υπό δημιουργία)' : 'Analytics & traffic (beta)'}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-700 uppercase tracking-wide">
                            Beta
                          </span>
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

// ─────────────────────────────────────────────────────────────────────
// QR promo banner — dismissible, encourages owners to print & display
// their guest QR code (biggest on-site traffic driver for the platform)
// ─────────────────────────────────────────────────────────────────────
function QrPromoBanner({ locale }: { locale: string }) {
  const [dismissed, setDismissed] = useState(false);

  // Persist dismissal in localStorage so it stays dismissed across visits
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('qr-promo-dismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    if (typeof window !== 'undefined') localStorage.setItem('qr-promo-dismissed', '1');
  }

  if (dismissed) return null;

  const T = {
    el: {
      badge: 'Νέο · Δωρεάν',
      title: 'Φτιάξε QR Code για τους επισκέπτες σου',
      body: 'Τοποθέτησέ το στο χώρο σου (είσοδος, κουζίνα, welcome card) — κάθε σκανάρισμα οδηγεί στη σελίδα σου με τοπικές προτάσεις. Περισσότεροι επισκέπτες στο site, περισσότερες κρατήσεις, αναγνωρισιμότητα για το κατάλυμά σου.',
      cta: 'Δες το QR μου',
      points: ['✨ Δωρεάν εκτύπωση', '📍 Οδηγός περιοχής', '🌍 7 γλώσσες'],
    },
    en: {
      badge: 'New · Free',
      title: 'Create a QR code for your guests',
      body: 'Place it around your property (entrance, kitchen, welcome card) — every scan drives guests to your page with local recommendations. More traffic, more bookings, more visibility for your property.',
      cta: 'See my QR',
      points: ['✨ Free print', '📍 Area guide', '🌍 7 languages'],
    },
  };
  const t = T[locale as 'el' | 'en'] || T.en;

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-2xl p-5 md:p-6 mb-4 overflow-hidden shadow-sm">
      {/* Decorative pattern */}
      <div className="absolute -right-8 -bottom-8 opacity-10">
        <QrCode className="w-48 h-48" />
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Κλείσιμο"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative flex flex-col md:flex-row md:items-center gap-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
          <QrCode className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-300 text-amber-900 mb-1.5 tracking-wide uppercase">
            {t.badge}
          </span>
          <h3 className="text-lg md:text-xl font-bold mb-1">{t.title}</h3>
          <p className="text-sm text-white/90 leading-relaxed max-w-2xl">{t.body}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {t.points.map((p, i) => (
              <span key={i} className="text-xs bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
