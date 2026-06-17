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
  Sparkles, Camera, Clock, AlertCircle, CheckCircle2, ChevronDown,
} from 'lucide-react';
import { HostPagePromoBanner } from '@/components/dashboard/HostPagePromoBanner';

// Below this character count the public listing page emits robots noindex
// (see src/lib/seo.ts `thinThreshold` hook + listings/[slug] metadata),
// so Google won't surface it in search. We nudge owners to enrich the
// description so their property becomes discoverable again.
const THIN_DESCRIPTION_THRESHOLD = 300;
// Below this photo count the listing presents as visually thin to both
// guests and Google's image search. Five is the threshold the literature
// (and the booking-platform UX defaults) consistently agree on.
const THIN_PHOTO_THRESHOLD = 5;
// How long a listing can go without an update before we surface a gentle
// freshness hint. Six months covers the seasonal-content edge case where
// prices, hours, and policies typically drift.
const STALE_LISTING_DAYS = 180;

interface Img { image_url: string; is_cover: boolean; sort_order: number; }

interface DbListing {
  id: string;
  slug: string;
  title_el: string;
  title_en: string;
  description_el: string | null;
  area: string;
  location_name: string | null;
  price_per_night: number;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string | null;
  listing_images: Img[];
  // Optional completeness fields — all-strings, all nullable
  tagline_el: string | null;
  owner_story_el: string | null;
  how_to_reach_el: string | null;
  wifi_info_el: string | null;
  parking_info_el: string | null;
  check_in_info_el: string | null;
  check_in_time: string | null;
  check_out_time: string | null;
  amenities: string[] | null;
  rule_smoking: boolean | null;
  rule_pets: boolean | null;
  rule_parties: boolean | null;
  rule_kids: boolean | null;
}

// ─────────────────────────────────────────────────────────────────────
// Completeness scoring
// ─────────────────────────────────────────────────────────────────────
// Weighted across the fields that drive both SEO surfacing and guest
// confidence. The three "critical" items (description, photos, amenities)
// carry most of the weight because they're what the public detail page
// actually renders prominently — and what the AdSense / Helpful Content
// evaluators sample against.
type MissingKey =
  | 'description' | 'photos' | 'amenities'
  | 'tagline' | 'ownerStory' | 'howToReach' | 'wifi' | 'parking'
  | 'checkInInfo' | 'checkInOutTimes' | 'price' | 'capacity' | 'houseRules';

interface Completeness {
  score: number;        // 0-100
  missing: MissingKey[];
  photoCount: number;
}

function computeCompleteness(l: DbListing): Completeness {
  const photoCount = Array.isArray(l.listing_images) ? l.listing_images.length : 0;
  const missing: MissingKey[] = [];
  let earned = 0;
  let total = 0;

  const credit = (cond: boolean, w: number, key: MissingKey) => {
    total += w;
    if (cond) earned += w;
    else missing.push(key);
  };

  // Critical (heavy weight) — what Google + AdSense reviewer + guests all see first
  credit((l.description_el || '').length >= THIN_DESCRIPTION_THRESHOLD, 3, 'description');
  credit(photoCount >= THIN_PHOTO_THRESHOLD, 3, 'photos');
  credit((l.amenities?.length || 0) >= 5, 2, 'amenities');

  // Important (medium weight) — guest-facing detail that builds trust
  credit(Boolean(l.check_in_info_el?.trim()), 1, 'checkInInfo');
  credit(Boolean(l.wifi_info_el?.trim()), 1, 'wifi');
  credit(Boolean(l.parking_info_el?.trim()), 1, 'parking');
  credit(Boolean(l.how_to_reach_el?.trim()), 1, 'howToReach');
  credit(Boolean(l.owner_story_el?.trim()), 1, 'ownerStory');
  credit(Boolean(l.tagline_el?.trim()), 1, 'tagline');
  credit(Boolean(l.check_in_time && l.check_out_time), 1, 'checkInOutTimes');

  // Basic (lightweight) — the must-fill numerical fields that every listing needs
  credit(Boolean(l.price_per_night), 1, 'price');
  credit(Boolean(l.guests_max && l.bedrooms && l.bathrooms), 1, 'capacity');
  // At least one house rule expressed (any of smoking/pets/parties/kids)
  credit(
    [l.rule_smoking, l.rule_pets, l.rule_parties, l.rule_kids].some((v) => v !== null && v !== undefined),
    1,
    'houseRules',
  );

  const score = total > 0 ? Math.round((earned / total) * 100) : 0;
  return { score, missing, photoCount };
}

function formatRelativeTime(dateStr: string | null, locale: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return locale === 'el' ? 'σήμερα' : 'today';
  if (days < 7) return locale === 'el' ? `${days} μέρες` : `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return locale === 'el' ? `${weeks} ${weeks === 1 ? 'εβδομάδα' : 'εβδομάδες'}` : `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return locale === 'el' ? `${months} ${months === 1 ? 'μήνα' : 'μήνες'}` : `${months} ${months === 1 ? 'month' : 'months'} ago`;
  const years = Math.floor(days / 365);
  return locale === 'el' ? `${years} ${years === 1 ? 'χρόνο' : 'χρόνια'}` : `${years} ${years === 1 ? 'year' : 'years'} ago`;
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
    // Fire the "your listing is live" email on every transition to published.
    // If the owner self-publishes (vs admin approval) they still get the
    // platform-benefits walkthrough, which is the higher-signal scenario
    // to optimise for — a missing email is worse than a duplicate one.
    if (newStatus === 'published') {
      try {
        await fetch('/api/listings/notify-published', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: id }),
        });
      } catch (e) {
        console.error('notify-published failed', e);
      }
    }
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
      {/* Marketing banner — owners with 2+ published listings get a CTA to enable their public host page */}
      <HostPagePromoBanner />

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
          {/* Aggregated health summary — surfaces the most impactful issues
              across the whole portfolio so owners don't have to scan every
              card to find what needs attention. */}
          <ListingHealthBanner listings={listings} locale={locale} />

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
              const completeness = computeCompleteness(listing);
              const updatedRelative = formatRelativeTime(listing.updated_at, locale);
              const isStale = listing.updated_at
                ? (Date.now() - new Date(listing.updated_at).getTime()) / (1000 * 60 * 60 * 24) > STALE_LISTING_DAYS
                : false;

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
                      {/* Title + status + completeness */}
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
                        <CompletenessBadge completeness={completeness} locale={locale} />
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
                        {updatedRelative && (
                          <span
                            className={`inline-flex items-center gap-1 ${isStale ? 'text-amber-700' : 'text-gray-400'}`}
                            title={isStale
                              ? (locale === 'el'
                                  ? 'Δεν έχει ενημερωθεί εδώ και πολύ καιρό — έλεγξε αν οι πληροφορίες είναι ακόμα ακριβείς.'
                                  : 'Hasn’t been touched in a while — double-check the info is still accurate.')
                              : (locale === 'el' ? 'Τελευταία ενημέρωση' : 'Last updated')}
                          >
                            <Clock className="w-3 h-3" />
                            {updatedRelative}
                          </span>
                        )}
                        {listing.price_per_night != null && (
                          <span className="font-semibold text-gray-900 ml-auto">
                            €{listing.price_per_night}<span className="font-normal text-gray-500 text-[10px]">{L.perNight}</span>
                          </span>
                        )}
                      </div>

                      {/* Nudges — friendly reminders for the two most impactful
                          quality gaps (description + photos). */}
                      <ThinDescriptionNudge
                        listingId={listing.id}
                        descriptionLength={(listing.description_el || '').length}
                        locale={locale}
                      />
                      <PhotoCountNudge
                        listingId={listing.id}
                        photoCount={completeness.photoCount}
                        locale={locale}
                      />

                      {/* Actions — primary row stays inline on desktop, scrolls
                          horizontally on narrow screens so the user keeps full
                          access without ugly wrap. Inline publish toggle
                          surfaces the most common action; preview + overflow
                          menu stay pinned to the right on desktop. */}
                      <div className="mt-auto pt-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible">
                        <div className="flex items-center gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                          <Link
                            href={`/dashboard/listings/${listing.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-medium rounded-lg whitespace-nowrap"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            {L.details}
                          </Link>
                          <Link
                            href={`/dashboard/listings/${listing.id}/brand`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            {L.siteEditor}
                          </Link>
                          <Link
                            href={`/dashboard/listings/${listing.id}/availability`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 whitespace-nowrap"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            {L.calendar}
                          </Link>
                          <Link
                            href={`/dashboard/listings/${listing.id}/qr`}
                            className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap"
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold rounded-lg shadow-sm whitespace-nowrap"
                            title={locale === 'el' ? 'Έτοιμα γραφιστικά για Instagram, Facebook, TikTok' : 'Ready-made graphics for Instagram, Facebook, TikTok'}
                          >
                            <Palette className="w-3.5 h-3.5" />
                            {locale === 'el' ? 'Social Kit' : 'Social Kit'}
                          </Link>
                          <Link
                            href={`/dashboard/listings/${listing.id}/analytics`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 hover:text-sky-700 text-xs font-medium rounded-lg border border-gray-200 whitespace-nowrap"
                            title={locale === 'el' ? 'Στατιστικά & επισκεψιμότητα (υπό δημιουργία)' : 'Analytics & traffic (beta)'}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-700 uppercase tracking-wide">
                              Beta
                            </span>
                          </Link>

                          {/* Inline publish/unpublish toggle — the most-used
                              action gets pulled out of the overflow menu. */}
                          <button
                            type="button"
                            onClick={() => toggleStatus(listing.id, listing.status)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors ${
                              isPublished
                                ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                            }`}
                            title={isPublished ? L.unpublish : L.publish}
                          >
                            {isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{isPublished ? L.unpublish : L.publish}</span>
                          </button>

                          {/* Preview */}
                          <Link
                            href={`/stay/${listing.slug}`}
                            target="_blank"
                            className="sm:ml-auto p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary-700 shrink-0"
                            title={L.preview}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Overflow menu — delete only now that publish
                              has been promoted out. */}
                          <div className="relative shrink-0">
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

// ─────────────────────────────────────────────────────────────────────
// Friendly nudge shown on listing cards whose description is below the
// thin-content threshold. When the description is too short the public
// listing page emits robots noindex, so Google won't show it. We frame
// the message around what the owner gains, not what the platform needs.
// ─────────────────────────────────────────────────────────────────────
function ThinDescriptionNudge({
  listingId,
  descriptionLength,
  locale,
}: {
  listingId: string;
  descriptionLength: number;
  locale: string;
}) {
  if (descriptionLength >= THIN_DESCRIPTION_THRESHOLD) return null;

  const remaining = THIN_DESCRIPTION_THRESHOLD - descriptionLength;
  const isGreek = locale === 'el';

  const text = isGreek
    ? {
        title: 'Λίγη επιπλέον περιγραφή κάνει μεγάλη διαφορά',
        body:
          descriptionLength === 0
            ? `Δεν έχεις προσθέσει ακόμα περιγραφή. Πρόσθεσε τουλάχιστον ${THIN_DESCRIPTION_THRESHOLD} χαρακτήρες — βοηθάει την Google να εντοπίσει το κατάλυμά σου και να το προτείνει σε ταξιδιώτες που ψάχνουν για διαμονή στη Χαλκιδική.`
            : `Η περιγραφή σου έχει ${descriptionLength} χαρακτήρες. Πρόσθεσε ακόμα ~${remaining} — βοηθάει την Google να εντοπίσει το κατάλυμά σου και να το προτείνει σε ταξιδιώτες που ψάχνουν για διαμονή στη Χαλκιδική.`,
        cta: 'Επεξεργασία περιγραφής',
      }
    : {
        title: 'A bit more detail makes a big difference',
        body:
          descriptionLength === 0
            ? `You haven't added a description yet. Aim for at least ${THIN_DESCRIPTION_THRESHOLD} characters — it helps Google discover your property and recommend it to travellers searching for places to stay in Halkidiki.`
            : `Your description has ${descriptionLength} characters. Add about ${remaining} more — it helps Google discover your property and recommend it to travellers searching for places to stay in Halkidiki.`,
        cta: 'Edit description',
      };

  return (
    <div className="mt-3 flex items-start gap-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
      <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-900">{text.title}</p>
        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{text.body}</p>
      </div>
      <Link
        href={`/dashboard/listings/${listingId}/edit`}
        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg self-center"
      >
        {text.cta}
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Photo count nudge — same pattern as ThinDescriptionNudge, applied to
// the visual side of the listing. Listings with <5 photos consistently
// underperform on guest-facing platforms and Google image search.
// ─────────────────────────────────────────────────────────────────────
function PhotoCountNudge({
  listingId,
  photoCount,
  locale,
}: {
  listingId: string;
  photoCount: number;
  locale: string;
}) {
  if (photoCount >= THIN_PHOTO_THRESHOLD) return null;

  const remaining = THIN_PHOTO_THRESHOLD - photoCount;
  const isGreek = locale === 'el';
  const text = isGreek
    ? {
        title: 'Λίγες ακόμα φωτογραφίες κάνουν τη διαφορά',
        body:
          photoCount === 0
            ? `Δεν έχεις ανεβάσει φωτογραφίες ακόμα. Πρόσθεσε τουλάχιστον ${THIN_PHOTO_THRESHOLD} — listings με 5+ φωτό προσελκύουν σταθερά περισσότερα views & αιτήματα κράτησης.`
            : `Έχεις ${photoCount} ${photoCount === 1 ? 'φωτογραφία' : 'φωτογραφίες'}. Πρόσθεσε άλλες ${remaining} — listings με 5+ φωτό προσελκύουν σταθερά περισσότερα views & αιτήματα κράτησης.`,
        cta: 'Προσθήκη φωτογραφιών',
      }
    : {
        title: 'A few more photos make a difference',
        body:
          photoCount === 0
            ? `No photos yet. Aim for at least ${THIN_PHOTO_THRESHOLD} — listings with 5+ photos consistently attract more views and booking requests.`
            : `You have ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}. Add ${remaining} more — listings with 5+ photos consistently attract more views and booking requests.`,
        cta: 'Add photos',
      };

  return (
    <div className="mt-2 flex items-start gap-2.5 p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
      <Camera className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-sky-900">{text.title}</p>
        <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">{text.body}</p>
      </div>
      <Link
        href={`/dashboard/listings/${listingId}/edit`}
        className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold rounded-lg self-center"
      >
        {text.cta}
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Completeness % badge — small chip in the title row, color-coded by
// bucket. Click expands a popover with the itemized missing list so the
// owner immediately knows what to fix. Click-outside closes it.
// ─────────────────────────────────────────────────────────────────────
const MISSING_LABELS_EL: Record<MissingKey, string> = {
  description: 'Περιγραφή',
  photos: '5+ φωτογραφίες',
  amenities: 'Παροχές (5+)',
  tagline: 'Σύντομο tagline',
  ownerStory: 'Ιστορία ιδιοκτήτη',
  howToReach: 'Οδηγίες πρόσβασης',
  wifi: 'Στοιχεία Wi-Fi',
  parking: 'Πληροφορίες parking',
  checkInInfo: 'Οδηγίες check-in',
  checkInOutTimes: 'Ώρες check-in / check-out',
  price: 'Τιμή / βράδυ',
  capacity: 'Άτομα / δωμάτια / μπάνια',
  houseRules: 'Κανόνες καταλύματος',
};
const MISSING_LABELS_EN: Record<MissingKey, string> = {
  description: 'Description',
  photos: '5+ photos',
  amenities: 'Amenities (5+)',
  tagline: 'Short tagline',
  ownerStory: 'Owner story',
  howToReach: 'How to reach',
  wifi: 'Wi-Fi details',
  parking: 'Parking info',
  checkInInfo: 'Check-in instructions',
  checkInOutTimes: 'Check-in / check-out times',
  price: 'Price per night',
  capacity: 'Guests / bedrooms / baths',
  houseRules: 'House rules',
};

function CompletenessBadge({
  completeness,
  locale,
}: {
  completeness: Completeness;
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const { score, missing } = completeness;

  // Bucket: red <50, amber 50-79, green 80+
  const tone =
    score >= 80
      ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
      : score >= 50
        ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
        : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
  const dotTone =
    score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  const labelMap = locale === 'el' ? MISSING_LABELS_EL : MISSING_LABELS_EN;
  const tooltipTitle = locale === 'el' ? 'Συμπληρωσιμότητα' : 'Completeness';
  const allFilled = locale === 'el' ? 'Όλα τα πεδία είναι συμπληρωμένα.' : 'All fields are filled.';
  const missingHeading = locale === 'el' ? 'Λείπουν:' : 'Missing:';

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${tone}`}
        title={tooltipTitle}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotTone}`} />
        {score}%
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-30 w-56 text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-900">{tooltipTitle}</span>
            <span className="text-xs font-bold text-gray-700">{score}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all ${
                score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          {missing.length === 0 ? (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> {allFilled}
            </p>
          ) : (
            <>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{missingHeading}</p>
              <ul className="space-y-1">
                {missing.map((key) => (
                  <li key={key} className="text-xs text-gray-700 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                    {labelMap[key]}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Health summary banner — aggregates the most common issues across all
// listings so the owner sees the punch list at the top of the page,
// rather than having to scan every card. Dismissible for 7 days to keep
// it from becoming noise.
// ─────────────────────────────────────────────────────────────────────
function ListingHealthBanner({ listings, locale }: { listings: DbListing[]; locale: string }) {
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const until = Number(localStorage.getItem('listings-health-dismissed-until') || 0);
    if (until && Date.now() < until) setDismissed(true);
  }, []);

  function dismiss() {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      const until = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem('listings-health-dismissed-until', String(until));
    }
  }

  const issues = useMemo(() => {
    let thinDesc = 0;
    let noPhotos = 0;
    let lowPhotos = 0;
    let stale = 0;
    let veryIncomplete = 0;
    for (const l of listings) {
      if ((l.description_el || '').length < THIN_DESCRIPTION_THRESHOLD) thinDesc++;
      const pc = Array.isArray(l.listing_images) ? l.listing_images.length : 0;
      if (pc === 0) noPhotos++;
      else if (pc < THIN_PHOTO_THRESHOLD) lowPhotos++;
      if (l.updated_at && (Date.now() - new Date(l.updated_at).getTime()) / (1000 * 60 * 60 * 24) > STALE_LISTING_DAYS) stale++;
      if (computeCompleteness(l).score < 50) veryIncomplete++;
    }
    return { thinDesc, noPhotos, lowPhotos, stale, veryIncomplete };
  }, [listings]);

  const total =
    issues.thinDesc + issues.noPhotos + issues.lowPhotos + issues.stale + issues.veryIncomplete;
  if (dismissed || total === 0) return null;

  const isGreek = locale === 'el';
  const lines: string[] = [];
  if (issues.noPhotos > 0) lines.push(isGreek ? `${issues.noPhotos} χωρίς φωτογραφίες` : `${issues.noPhotos} without any photos`);
  if (issues.lowPhotos > 0) lines.push(isGreek ? `${issues.lowPhotos} με λιγότερες από ${THIN_PHOTO_THRESHOLD} φωτό` : `${issues.lowPhotos} with fewer than ${THIN_PHOTO_THRESHOLD} photos`);
  if (issues.thinDesc > 0) lines.push(isGreek ? `${issues.thinDesc} με σύντομη περιγραφή` : `${issues.thinDesc} with a short description`);
  if (issues.veryIncomplete > 0) lines.push(isGreek ? `${issues.veryIncomplete} με συμπληρωσιμότητα < 50%` : `${issues.veryIncomplete} below 50% completeness`);
  if (issues.stale > 0) lines.push(isGreek ? `${issues.stale} χωρίς ενημέρωση πάνω από 6 μήνες` : `${issues.stale} not updated in 6+ months`);

  const heading = isGreek
    ? 'Λίγες βελτιώσεις θα βοηθούσαν τα καταλύματά σου'
    : 'A few touch-ups would help your listings';
  const sub = isGreek
    ? 'Όσο πιο συμπληρωμένο είναι ένα κατάλυμα, τόσο πιο εύκολα το βρίσκουν οι ταξιδιώτες στο Google και τόσο πιο πιθανό είναι να καταλήξουν σε κράτηση.'
    : 'The more complete a listing is, the more easily travellers find it on Google and the more likely they are to book.';
  const dismissLabel = isGreek ? 'Κρύψε για 7 ημέρες' : 'Hide for 7 days';

  return (
    <div className="mb-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-900">{heading}</h3>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{sub}</p>
          {lines.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {lines.map((line, i) => (
                <li key={i} className="text-xs text-amber-900 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-600" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-[11px] font-medium text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline self-start"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
