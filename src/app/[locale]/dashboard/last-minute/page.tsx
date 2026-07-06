'use client';

/**
 * Last-Minute Deals — owner dashboard
 * -----------------------------------------------------------------------
 * The owner publishes availability that opened up from a cancellation: pick a
 * room, a date range, an optional note. Rows are written *directly* to Supabase
 * from the browser (anon key + RLS) — no Next.js/Vercel compute. A Supabase
 * Edge Function (fb-post-deal) auto-posts each new deal to Facebook.
 */

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Zap, Loader2, Plus, Trash2, Calendar as CalendarIcon, Share2, Info, CheckCircle2 } from 'lucide-react';

interface OwnerListing {
  id: string;
  title_el: string;
  title_en: string;
  slug: string;
  area: string;
  listing_images?: { image_url: string; is_cover: boolean; sort_order: number }[] | null;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

// Greek area labels for the Facebook caption (no article, so no grammar traps).
const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Χαλκιδική',
};

function coverImage(l: OwnerListing): string | null {
  const imgs = l.listing_images || [];
  const cover = imgs.find(i => i.is_cover) || [...imgs].sort((a, b) => a.sort_order - b.sort_order)[0];
  return cover?.image_url || null;
}

// Ready-to-post Facebook caption. Kept in one place so wording/hashtags are
// easy to tweak — the Make.com scenario just posts {{fb_message}} verbatim.
function buildFbMessage(l: OwnerListing, startDate: string, endDate: string, note: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const sd = new Date(startDate + 'T00:00:00').toLocaleDateString('el-GR', opts);
  const ed = new Date(endDate + 'T00:00:00').toLocaleDateString('el-GR', opts);
  const range = startDate === endDate ? sd : `${sd} – ${ed}`;
  const area = AREA_LABELS[l.area] || 'Χαλκιδική';
  const link = `${SITE_URL}/el/listings/${l.slug}`;

  const lines = [
    '⚡ Διαθεσιμότητα τελευταίας στιγμής!',
    `📍 ${area}, Χαλκιδική`,
    '',
    `🏠 ${l.title_el || l.title_en}`,
    `📅 ${range}`,
  ];
  if (note.trim()) lines.push(`📝 ${note.trim()}`);
  lines.push('', '👉 Δες διαθεσιμότητα & κράτηση:', link, '', '#Χαλκιδική #ChalkidikiHub #LastMinute #διακοπές');
  return lines.join('\n');
}

interface DealRow {
  id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  note: string | null;
  status: string;
  fb_post_id: string | null;
  fb_posted_at: string | null;
  created_at: string;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LastMinuteDealsPage() {
  const locale = useLocale();
  const el = locale === 'el';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [deals, setDeals] = useState<DealRow[]>([]);

  // Form state
  const [listingId, setListingId] = useState('');
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [note, setNote] = useState('');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const [{ data: listingData }, { data: dealData }] = await Promise.all([
        supabase
          .from('listings')
          .select('id, title_el, title_en, slug, area, listing_images(image_url, is_cover, sort_order)')
          .eq('owner_id', user.id)
          .eq('status', 'published')
          .order('title_el'),
        supabase
          .from('last_minute_deals')
          .select('*')
          .eq('owner_id', user.id)
          .order('start_date', { ascending: true }),
      ]);

      if (listingData) {
        setListings(listingData as OwnerListing[]);
        if (listingData.length > 0) setListingId((listingData[0] as OwnerListing).id);
      }
      if (dealData) setDeals(dealData as DealRow[]);
      setLoading(false);
    })();
  }, []);

  const titleById = useMemo(() => {
    const m = new Map<string, string>();
    listings.forEach(l => m.set(l.id, (el ? l.title_el : l.title_en) || l.title_en || l.title_el));
    return m;
  }, [listings, el]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!listingId) { setError(el ? 'Διάλεξε δωμάτιο.' : 'Pick a room.'); return; }
    if (endDate < startDate) {
      setError(el ? 'Η λήξη δεν μπορεί να είναι πριν την έναρξη.' : 'End date cannot be before start date.');
      return;
    }
    if (startDate < todayStr()) {
      setError(el ? 'Η έναρξη δεν μπορεί να είναι στο παρελθόν.' : 'Start date cannot be in the past.');
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    // Denormalise the Facebook payload so the Make.com webhook is self-contained.
    const listing = listings.find(l => l.id === listingId)!;
    const { data, error: insErr } = await supabase
      .from('last_minute_deals')
      .insert({
        listing_id: listingId,
        owner_id: user.id,
        start_date: startDate,
        end_date: endDate,
        note: note.trim() || null,
        fb_message: buildFbMessage(listing, startDate, endDate, note),
        fb_link: `${SITE_URL}/el/listings/${listing.slug}`,
        image_url: coverImage(listing),
      })
      .select('*')
      .single();

    setSaving(false);
    if (insErr) { setError(insErr.message); return; }
    if (data) {
      setDeals(prev => [...prev, data as DealRow].sort((a, b) => a.start_date.localeCompare(b.start_date)));
      setNote('');
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 4000);
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error: delErr } = await supabase.from('last_minute_deals').delete().eq('id', id);
    if (!delErr) setDeals(prev => prev.filter(d => d.id !== id));
  }

  function fmtRange(s: string, e: string): string {
    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const locStr = el ? 'el-GR' : 'en-GB';
    const sd = new Date(s + 'T00:00:00').toLocaleDateString(locStr, opts);
    const ed = new Date(e + 'T00:00:00').toLocaleDateString(locStr, opts);
    return s === e ? sd : `${sd} → ${ed}`;
  }

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-600">
          <Zap className="w-5 h-5" />
        </span>
        <h1 className="text-xl font-bold text-slate-900">
          {el ? 'Διαθεσιμότητα τελευταίας στιγμής' : 'Last-minute availability'}
        </h1>
      </div>
      <p className="text-sm text-slate-500 mb-6 ml-[52px]">
        {el
          ? 'Άνοιξε ξαφνικά διαθεσιμότητα από ακύρωση; Δημοσίευσέ την εδώ — εμφανίζεται στην αρχική σελίδα και ποστάρεται αυτόματα στο Facebook.'
          : 'Got a last-minute opening from a cancellation? Publish it here — it shows on the homepage and auto-posts to Facebook.'}
      </p>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          {el
            ? 'Δεν έχεις δημοσιευμένα καταλύματα ακόμη.'
            : 'You have no published listings yet.'}
          <div className="mt-3">
            <Link href="/dashboard/listings" className="text-emerald-600 font-medium hover:underline">
              {el ? 'Πήγαινε στα καταλύματά μου →' : 'Go to my listings →'}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Add form */}
          <form onSubmit={handleAdd} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {el ? 'Δωμάτιο / Κατάλυμα' : 'Room / Listing'}
                </label>
                <select
                  value={listingId}
                  onChange={e => setListingId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>{titleById.get(l.id)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {el ? 'Από' : 'From'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={todayStr()}
                  onChange={e => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate(e.target.value); }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {el ? 'Έως' : 'To'}
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                  {el ? 'Σημείωση (προαιρετικό)' : 'Note (optional)'}
                </label>
                <input
                  type="text"
                  value={note}
                  maxLength={140}
                  placeholder={el ? 'π.χ. Θέα θάλασσα, ιδανικό για ζευγάρι' : 'e.g. Sea view, perfect for a couple'}
                  onChange={e => setNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
            {justAdded && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                {el ? 'Δημοσιεύτηκε! Θα εμφανιστεί στην αρχική & στο Facebook σε λίγο.' : 'Published! It will appear on the homepage & Facebook shortly.'}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {el ? 'Δημοσίευση' : 'Publish'}
            </button>
          </form>

          {/* Existing deals */}
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
            {el ? 'Ενεργές διαθεσιμότητες' : 'Active openings'}
          </h2>
          {deals.length === 0 ? (
            <p className="text-sm text-slate-400">{el ? 'Καμία ακόμη.' : 'None yet.'}</p>
          ) : (
            <ul className="space-y-2">
              {deals.map(d => (
                <li key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 truncate">{titleById.get(d.listing_id) || '—'}</div>
                    <div className="text-xs text-slate-500">
                      {fmtRange(d.start_date, d.end_date)}
                      {d.note ? ` · ${d.note}` : ''}
                    </div>
                  </div>
                  {d.fb_post_id ? (
                    <span title={el ? 'Ποστάρισμα στο Facebook έγινε' : 'Posted to Facebook'}>
                      <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
                    </span>
                  ) : null}
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title={el ? 'Διαγραφή' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
