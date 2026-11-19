'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Link2, Loader2, RefreshCw, Trash2 } from 'lucide-react';

interface Feed {
  id: string;
  source: 'airbnb' | 'booking';
  url: string;
  last_synced_at: string | null;
  last_status: 'ok' | 'error' | null;
  last_error: string | null;
  busy_days: number;
}

const SOURCE_LABEL: Record<Feed['source'], string> = { airbnb: 'Airbnb', booking: 'Booking.com' };

const ERRORS: Record<string, string> = {
  invalid: 'Το URL δεν είναι έγκυρο.',
  https: 'Το URL πρέπει να ξεκινά με https://',
  host: 'Δεχόμαστε μόνο URLs εξαγωγής ημερολογίου από Airbnb ή Booking.com.',
  duplicate: 'Αυτό το URL έχει ήδη προστεθεί.',
  too_many: 'Μπορείς να προσθέσεις έως 5 ημερολόγια ανά κατάλυμα.',
  not_configured: 'Η λειτουργία δεν είναι ακόμη διαθέσιμη. Δοκίμασε ξανά αργότερα.',
};

function fmt(ts: string | null) {
  if (!ts) return 'ποτέ';
  return new Date(ts).toLocaleString('el-GR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

/**
 * Owner-side list of Airbnb / Booking.com iCal export URLs. Imported days are
 * written by the server; `onChanged` lets the calendar below reload them.
 */
export function IcalFeeds({ listingId, onChanged }: { listingId: string; onChanged: () => void }) {
  const [feeds, setFeeds] = useState<Feed[] | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState<'add' | 'sync' | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchFeeds = useCallback(async (): Promise<{ feeds: Feed[]; error?: string }> => {
    const res = await fetch(`/api/listings/${listingId}/ical-feeds`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return { feeds: json.feeds };
    return { feeds: [], error: ERRORS[json.error] ?? 'Δεν φορτώθηκαν τα συνδεδεμένα ημερολόγια.' };
  }, [listingId]);

  const load = useCallback(async () => {
    const r = await fetchFeeds();
    setFeeds(r.feeds);
    if (r.error) setError(r.error);
  }, [fetchFeeds]);

  useEffect(() => {
    let live = true;
    fetchFeeds().then((r) => {
      if (!live) return;
      setFeeds(r.feeds);
      if (r.error) setError(r.error);
    });
    return () => {
      live = false;
    };
  }, [fetchFeeds]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy('add');
    const res = await fetch(`/api/listings/${listingId}/ical-feeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError(ERRORS[json.error] ?? 'Η αποθήκευση απέτυχε.');
      return;
    }
    setUrl('');
    setFeeds(json.feeds);
    setNotice(json.result?.ok ? `Συνδέθηκε. Βρέθηκαν ${json.result.busyDays} κλεισμένες μέρες.` : 'Αποθηκεύτηκε, αλλά ο πρώτος συγχρονισμός απέτυχε. Έλεγξε το URL.');
    onChanged();
  }

  async function remove(feed: Feed) {
    if (!confirm(`Να αφαιρεθεί το ημερολόγιο ${SOURCE_LABEL[feed.source]}; Οι μέρες που ήρθαν από αυτό θα ελευθερωθούν.`)) return;
    setBusy(feed.id);
    const res = await fetch(`/api/listings/${listingId}/ical-feeds?feed=${feed.id}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) {
      setFeeds(json.feeds);
      onChanged();
    } else setError('Η αφαίρεση απέτυχε.');
  }

  async function syncNow() {
    setError(null);
    setNotice(null);
    setBusy('sync');
    const res = await fetch(`/api/listings/${listingId}/ical-feeds/sync`, { method: 'POST' });
    const json = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError('Ο συγχρονισμός απέτυχε.');
      return;
    }
    setNotice(json.synced ? 'Ο συγχρονισμός ολοκληρώθηκε.' : 'Τα ημερολόγια συγχρονίστηκαν πριν από λίγο. Δοκίμασε ξανά σε 2 λεπτά.');
    await load();
    onChanged();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-start gap-3">
          <Link2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900">Συγχρονισμός με Airbnb / Booking.com</p>
            <p className="text-sm text-gray-600 mt-0.5">
              Επικόλλησε το URL εξαγωγής ημερολογίου (iCal). Οι κρατήσεις σου εμφανίζονται αυτόματα ως κλεισμένες μέρες και
              ενημερώνονται κάθε λίγες ώρες. Οι μέρες που σημειώνεις μόνος σου δεν αλλάζουν.
            </p>
          </div>
        </div>
        {feeds && feeds.length > 0 && (
          <button
            type="button"
            onClick={syncNow}
            disabled={busy !== null}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors disabled:opacity-50"
          >
            {busy === 'sync' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Συγχρονισμός τώρα
          </button>
        )}
      </div>

      {feeds === null ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      ) : (
        feeds.length > 0 && (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl mb-3">
            {feeds.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 p-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {SOURCE_LABEL[f.source]} <span className="font-normal text-gray-500 break-all">{f.url}</span>
                  </p>
                  <p className="text-xs mt-0.5 flex items-center gap-1">
                    {f.last_status === 'error' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        <span className="text-red-700">Σφάλμα: {f.last_error} · {fmt(f.last_synced_at)}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-gray-600">{f.busy_days} κλεισμένες μέρες · τελευταίος συγχρονισμός {fmt(f.last_synced_at)}</span>
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(f)}
                  disabled={busy !== null}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-40"
                >
                  {busy === f.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Αφαίρεση
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      <form onSubmit={add} className="flex gap-2 flex-wrap">
        <input
          type="url"
          required
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.airbnb.com/calendar/ical/….ics"
          className="flex-1 min-w-[240px] px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={busy !== null || !url.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {busy === 'add' && <Loader2 className="w-4 h-4 animate-spin" />}
          Προσθήκη
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        <strong>Airbnb:</strong> Ημερολόγιο → το κατάλυμα → Διαθεσιμότητα → Σύνδεση ημερολογίων → Σύνδεση με άλλον ιστότοπο → αντιγραφή
        του συνδέσμου Airbnb. <strong>Booking.com:</strong>{' '}Extranet → Τιμές &amp; Διαθεσιμότητα → Συγχρονισμός ημερολογίων → Αντιγραφή
        συνδέσμου.
      </p>

      {error && <p className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</p>}
      {notice && <p className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">{notice}</p>}
    </div>
  );
}
