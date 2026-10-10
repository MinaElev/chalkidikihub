'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  QrCode, Send, Loader2, Eye, CheckCircle, AlertTriangle, Clock,
  Search, Check, ChevronsUpDown, Info,
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';

interface ListingOwner {
  listingId: string;
  listingSlug: string;
  listingTitle: string;
  locationName: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  status: string;
}

const DEFAULT_MESSAGE = `<p>Αγαπητέ/ή <strong>{owner_name}</strong>,</p>

<p>Σας στέλνουμε το <strong>QR Code</strong> του καταλύματός σας <strong>"{listing_title}"</strong> στο ChalkidikiHub.</p>

<p>Τοποθετήστε το σε κάθε δωμάτιο, στη reception ή σε κοινόχρηστους χώρους. Οι πελάτες σας σκανάρουν με το κινητό τους και αμέσως βλέπουν:</p>

<ul>
  <li>🏖️ Κοντινές παραλίες με αξιολογήσεις</li>
  <li>🍽️ Εστιατόρια & ταβέρνες της περιοχής</li>
  <li>🎯 Δραστηριότητες & αξιοθέατα</li>
  <li>🗺️ Χάρτη & οδηγίες</li>
</ul>

<p>Λειτουργεί αυτόματα σε <strong>7 γλώσσες</strong> (Ελληνικά, Αγγλικά, Γερμανικά, Βουλγαρικά, Ρωσικά, Ρουμανικά, Σερβικά) — ο κάθε επισκέπτης βλέπει τη δική του γλώσσα!</p>

<p>Αν χρειάζεστε εκτυπωμένη εκδοχή σε υψηλή ανάλυση, μπορείτε να κατεβάσετε το QR code και από τον <a href="${SITE_URL}/dashboard/listings">πίνακα ελέγχου σας</a>.</p>

<p>Με εκτίμηση,<br><strong>Η ομάδα ChalkidikiHub</strong></p>`;

export default function AdminQREmailPage() {
  const [listings, setListings] = useState<ListingOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState('🏠 Το QR Code του καταλύματός σας — {listing_title}');
  const [messageHtml, setMessageHtml] = useState(DEFAULT_MESSAGE);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; errors?: string[] } | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<Array<{ id: string; message: string; details: Record<string, unknown>; created_at: string }>>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published'>('published');

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch all listings with owner info
      const { data: listingsData } = await supabase
        .from('listings')
        .select('id, slug, title_el, title_en, location_name, owner_id, status')
        .order('created_at', { ascending: false });

      if (!listingsData) { setLoading(false); return; }

      // Get unique owner IDs
      const ownerIds = [...new Set(listingsData.map(l => l.owner_id))];

      // Fetch owner profiles with emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', ownerIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.id, { name: p.full_name || '', email: p.email || '' }])
      );

      const enriched: ListingOwner[] = listingsData
        .filter(l => profileMap.get(l.owner_id)?.email) // Only listings with owner email
        .map(l => {
          const owner = profileMap.get(l.owner_id)!;
          return {
            listingId: l.id,
            listingSlug: l.slug,
            listingTitle: l.title_el || l.title_en || l.slug,
            locationName: l.location_name || '',
            ownerName: owner.name,
            ownerEmail: owner.email,
            ownerId: l.owner_id,
            status: l.status,
          };
        });

      setListings(enriched);

      // Fetch QR email history
      const { data: logs } = await supabase
        .from('activity_logs')
        .select('id, message, details, created_at')
        .eq('type', 'admin_action')
        .like('message', 'QR email%')
        .order('created_at', { ascending: false })
        .limit(20);
      setHistory(logs || []);

      setLoading(false);
    }
    load();
  }, []);

  const filtered = listings
    .filter(l => filterStatus === 'all' || l.status === 'published')
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return l.listingTitle.toLowerCase().includes(q) ||
             l.ownerName.toLowerCase().includes(q) ||
             l.ownerEmail.toLowerCase().includes(q) ||
             l.locationName.toLowerCase().includes(q);
    });

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(l => l.listingId)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  const selectedListings = listings.filter(l => selected.has(l.listingId));

  async function handleSend() {
    if (!subject.trim() || !messageHtml.trim()) {
      setError('Συμπληρώστε θέμα και μήνυμα');
      return;
    }
    if (selectedListings.length === 0) {
      setError('Επιλέξτε τουλάχιστον ένα κατάλυμα');
      return;
    }
    if (!confirm(
      `Αποστολή QR code email σε ${selectedListings.length} καταλύματα;\n\n` +
      selectedListings.slice(0, 5).map(l => `• ${l.listingTitle} → ${l.ownerEmail}`).join('\n') +
      (selectedListings.length > 5 ? `\n... και ${selectedListings.length - 5} ακόμα` : '')
    )) return;

    setSending(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/send-qr-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: selectedListings.map(l => ({
            email: l.ownerEmail,
            ownerName: l.ownerName,
            listingTitle: l.listingTitle,
            listingSlug: l.listingSlug,
            listingId: l.listingId,
          })),
          subject,
          messageHtml,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ sent: data.sent, failed: data.failed, errors: data.errors });
        // Refresh history
        const supabase = createClient();
        const { data: logs } = await supabase
          .from('activity_logs')
          .select('id, message, details, created_at')
          .eq('type', 'admin_action')
          .like('message', 'QR email%')
          .order('created_at', { ascending: false })
          .limit(20);
        setHistory(logs || []);
      } else {
        setError(data.error || 'Αποτυχία αποστολής');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSending(false);
  }

  // Preview: replace variables with sample data
  const previewHtml = messageHtml
    .replace(/\{owner_name\}/g, 'Γιώργος Παπαδόπουλος')
    .replace(/\{listing_title\}/g, 'Πολυτελές Σπίτι στην Κασσάνδρα')
    .replace(/\{guest_url\}/g, `${SITE_URL}/guest/luxury-house-kassandra`)
    .replace(/\{listing_url\}/g, `${SITE_URL}/listings/luxury-house-kassandra`);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-6 h-6 text-teal-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Code Email</h1>
          <p className="text-sm text-gray-500">Στείλτε το QR Guest Guide στους ιδιοκτήτες</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {result && (
        <div className={`mb-6 p-4 border rounded-xl ${result.sent > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center gap-2">
            {result.sent > 0 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-red-600" />}
            <p className="font-semibold text-gray-800">
              Στάλθηκαν: {result.sent} επιτυχημένα
              {result.failed > 0 && <span className="text-red-600">, {result.failed} αποτυχημένα</span>}
            </p>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-red-700 mb-1">Σφάλματα:</p>
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600 font-mono">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Select Listings */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24 max-h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Καταλύματα</h2>
              <span className="text-xs text-gray-500">
                {selected.size}/{filtered.length} επιλεγμένα
              </span>
            </div>

            {/* Status filter */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setFilterStatus('published')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                Published ({listings.filter(l => l.status === 'published').length})
              </button>
              <button onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === 'all' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                Όλα ({listings.length})
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Αναζήτηση..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500" />
            </div>

            {/* Select all */}
            <button onClick={toggleAll}
              className="flex items-center gap-2 px-3 py-2 mb-2 text-xs font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
              <ChevronsUpDown className="w-3.5 h-3.5" />
              {selected.size === filtered.length ? 'Αποεπιλογή όλων' : 'Επιλογή όλων'}
            </button>

            {/* Listing list */}
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {filtered.map(l => (
                <label key={l.listingId}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    selected.has(l.listingId) ? 'bg-teal-50 border border-teal-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}>
                  <input type="checkbox" checked={selected.has(l.listingId)}
                    onChange={() => toggleOne(l.listingId)}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{l.listingTitle}</p>
                    <p className="text-[11px] text-gray-500 truncate">{l.locationName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{l.ownerName} — {l.ownerEmail}</p>
                  </div>
                  {l.status !== 'published' && (
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                      {l.status}
                    </span>
                  )}
                </label>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Δεν βρέθηκαν καταλύματα</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Compose */}
        <div className="lg:col-span-2 space-y-4">
          {/* Variables hint */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-semibold text-teal-800">Μεταβλητές</h3>
            </div>
            <p className="text-xs text-teal-700 leading-relaxed">
              Χρησιμοποιήστε αυτές τις μεταβλητές — αντικαθίστανται αυτόματα ανά κατάλυμα:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { var: '{owner_name}', desc: 'Όνομα ιδιοκτήτη' },
                { var: '{listing_title}', desc: 'Τίτλος καταλύματος' },
                { var: '{guest_url}', desc: 'Guest page URL' },
                { var: '{listing_url}', desc: 'Listing page URL' },
              ].map(v => (
                <span key={v.var} className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-md text-xs border border-teal-200">
                  <code className="font-mono text-teal-700 font-semibold">{v.var}</code>
                  <span className="text-gray-500">= {v.desc}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Compose form */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Σύνταξη Email</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Θέμα * <span className="text-xs text-gray-400">(υποστηρίζει {'{listing_title}'})</span>
                </label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Μήνυμα * <span className="text-xs text-gray-400">(HTML — το QR code επισυνάπτεται αυτόματα)</span>
                </label>
                <textarea rows={14} value={messageHtml} onChange={(e) => setMessageHtml(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
              </div>

              {/* Preview */}
              <button type="button" onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium">
                <Eye className="w-4 h-4" />
                {preview ? 'Κλείσιμο preview' : 'Preview email'}
              </button>

              {preview && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <p className="text-xs text-gray-500">
                      Preview (μεταβλητές αντικαταστάθηκαν με δοκιμαστικά δεδομένα):
                    </p>
                  </div>
                  <div className="p-4 bg-white">
                    {/* Subject preview */}
                    <p className="text-sm font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-100">
                      Θέμα: {subject.replace(/\{listing_title\}/g, 'Πολυτελές Σπίτι στην Κασσάνδρα')}
                    </p>
                    {/* Body preview */}
                    <div className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    {/* QR preview placeholder */}
                    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                      <QrCode className="w-32 h-32 text-gray-300 mx-auto" />
                      <p className="text-xs text-gray-500 mt-2">Εδώ θα εμφανίζεται το QR code του κάθε καταλύματος</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Send */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button onClick={handleSend}
                  disabled={sending || !subject.trim() || !messageHtml.trim() || selectedListings.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? 'Αποστολή...' : `Αποστολή σε ${selectedListings.length} ιδιοκτήτες`}
                </button>
                {selectedListings.length === 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    Επιλέξτε καταλύματα
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected summary */}
          {selectedListings.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Θα σταλεί σε {selectedListings.length} ιδιοκτήτες:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedListings.map(l => (
                  <div key={l.listingId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{l.listingTitle}</p>
                      <p className="text-[11px] text-gray-500 truncate">{l.ownerEmail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Ιστορικό QR Αποστολών</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {history.map((log) => {
              const d = log.details as { subject?: string; recipientCount?: number; sent?: number; failed?: number };
              return (
                <div key={log.id} className="px-4 py-3 flex items-center gap-4">
                  <QrCode className="w-4 h-4 text-teal-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.subject || 'QR email'}</p>
                    <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString('el')}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-500">{d.recipientCount || 0} παραλήπτες</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {d.sent || 0} sent
                    </span>
                    {(d.failed || 0) > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                        {d.failed} failed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
