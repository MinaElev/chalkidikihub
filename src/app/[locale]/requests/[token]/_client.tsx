'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, Phone, Calendar, Users, MapPin, Loader2, RefreshCw, Home, MessageCircle } from 'lucide-react';

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

interface ResponseRow {
  id: string;
  status: 'available' | 'unavailable';
  price: number | null;
  message: string | null;
  contact_phone: string | null;
  created_at: string;
  owner_name: string;
  listings: { slug: string; title_el: string; title_en: string; location_name: string } | null;
}

interface RequestRow {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  area: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  property_type: string | null;
  budget_min: number | null;
  budget_max: number | null;
  notes: string | null;
  status: 'active' | 'closed' | 'expired';
  recipients_count: number;
  responses_count: number;
  created_at: string;
  expires_at: string;
}

export default function GuestDashboardClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [responses, setResponses] = useState<ResponseRow[]>([]);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/availability-request/${token}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error === 'not_found' ? 'Το αίτημα δεν βρέθηκε.' : 'Σφάλμα φόρτωσης.');
        setLoading(false);
        return;
      }
      setRequest(json.request);
      setResponses(json.responses || []);
      setError(null);
    } catch {
      setError('Σφάλμα δικτύου.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    // Auto-refresh every 60s while active
    const id = setInterval(() => load(), 60_000);
    return () => clearInterval(id);
  }, [load]);

  async function close() {
    if (!confirm('Σίγουρα θέλεις να κλείσεις το αίτημα; Οι ιδιοκτήτες δεν θα μπορούν να απαντήσουν πια.')) return;
    setClosing(true);
    await fetch(`/api/availability-request/${token}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'close' }),
    });
    setClosing(false);
    load();
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Δεν βρέθηκε</h1>
        <p className="text-gray-600">{error || 'Το αίτημα δεν υπάρχει ή το link είναι λάθος.'}</p>
      </div>
    );
  }

  const available = responses.filter(r => r.status === 'available');
  const unavailable = responses.filter(r => r.status === 'unavailable');
  const noReply = Math.max(0, (request.recipients_count || 0) - responses.length);
  const isClosed = request.status !== 'active';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header / status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Το αίτημά σου για {AREA_LABELS[request.area] || request.area}
            </h1>
            <div className="text-sm text-gray-500 mt-1">
              {isClosed ? (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  {request.status === 'closed' ? 'Κλειστό' : 'Έληξε'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  Ενεργό
                </span>
              )}
            </div>
          </div>
          <button onClick={load} className="text-gray-500 hover:text-gray-700" title="Ανανέωση">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <Stat icon={Calendar} label="Άφιξη" value={fmt(request.check_in)} />
          <Stat icon={Calendar} label="Αναχώρηση" value={fmt(request.check_out)} />
          <Stat icon={Users} label="Άτομα" value={`${request.adults}${request.children ? `+${request.children}` : ''}`} />
          <Stat icon={MapPin} label="Πόδι" value={AREA_LABELS[request.area] || request.area} />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Counter label="Διαθέσιμα" value={available.length} color="emerald" />
          <Counter label="Όχι διαθέσιμα" value={unavailable.length} color="gray" />
          <Counter label="Αναμένουν" value={noReply} color="amber" />
        </div>

        {!isClosed && (
          <button
            onClick={close}
            disabled={closing}
            className="mt-5 w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
          >
            ✓ Βρήκα κατάλυμα / Ακύρωση αιτήματος
          </button>
        )}
      </div>

      {/* Available */}
      {available.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Διαθέσιμοι ιδιοκτήτες ({available.length})
          </h2>
          <div className="space-y-3">
            {available.map(r => <AvailableCard key={r.id} r={r} />)}
          </div>
        </section>
      )}

      {/* No available yet */}
      {available.length === 0 && !isClosed && (
        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 text-center">
          <div className="text-blue-900 font-semibold mb-1">Δεν έχει απαντήσει ακόμα κανείς διαθέσιμος</div>
          <p className="text-sm text-blue-800 leading-relaxed">
            Στείλαμε το αίτημα σε {request.recipients_count} ιδιοκτήτες. Οι περισσότεροι απαντούν εντός 24h. Θα λάβεις email μόλις απαντήσει ο πρώτος.
          </p>
        </section>
      )}

      {/* Unavailable list (collapsed feel) */}
      {unavailable.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Δεν είναι διαθέσιμοι ({unavailable.length})
          </h2>
          <div className="text-sm text-gray-500 italic">
            {unavailable.map(r => r.owner_name).join(', ')}
          </div>
        </section>
      )}
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function Stat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="font-semibold text-gray-900 text-sm">{value}</div>
    </div>
  );
}

function Counter({ label, value, color }: { label: string; value: number; color: 'emerald' | 'gray' | 'amber' }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    gray: 'bg-gray-50 text-gray-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`${colors[color]} rounded-lg py-2.5`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

function AvailableCard({ r }: { r: ResponseRow }) {
  const title = r.listings?.title_el || r.listings?.title_en;
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="font-semibold text-gray-900">{r.owner_name}</div>
          {title && (
            <div className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
              <Home className="w-3.5 h-3.5" />
              {title}
              {r.listings?.location_name && <span className="text-gray-400"> · {r.listings.location_name}</span>}
            </div>
          )}
        </div>
        {r.price != null && (
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-700">{r.price}€</div>
            <div className="text-xs text-gray-500">/ βράδυ</div>
          </div>
        )}
      </div>

      {r.message && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3 leading-relaxed flex gap-2">
          <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span>{r.message}</span>
        </div>
      )}

      {r.contact_phone && (
        <a
          href={`tel:${r.contact_phone}`}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          <Phone className="w-4 h-4" />
          {r.contact_phone}
        </a>
      )}

      {r.listings?.slug && (
        <a
          href={`/stay/${r.listings.slug}`}
          target="_blank"
          rel="noopener"
          className="ml-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
        >
          Δες το κατάλυμα →
        </a>
      )}
    </div>
  );
}
