'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Calendar, Users, Wallet, Phone, User, MessageCircle, CheckCircle2, XCircle, Home } from 'lucide-react';

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα Χαλκιδικής',
};

interface ReqData {
  request: {
    id: string;
    guest_name: string;
    guest_phone: string;
    area: string;
    check_in: string;
    check_out: string;
    adults: number;
    children: number;
    budget_min: number | null;
    budget_max: number | null;
    property_type: string | null;
    notes: string | null;
  };
  existing: {
    status: 'available' | 'unavailable';
    price: number | null;
    message: string | null;
    contact_phone: string | null;
  } | null;
  expired: boolean;
  listings: Array<{ id: string; slug: string; title_el: string; title_en: string; guests_max: number; price_per_night: number }>;
  owner: { full_name: string; phone: string };
}

export default function OwnerResponseClient({
  token,
  initialAction,
}: {
  token: string;
  initialAction: string;
}) {
  const [data, setData] = useState<ReqData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<'available' | 'unavailable' | ''>('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [listingId, setListingId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/availability-response/${token}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error === 'not_found' ? 'Το αίτημα δεν βρέθηκε.' : 'Σφάλμα.');
          return;
        }
        setData(json);
        // Prefill
        if (json.existing) {
          setStatus(json.existing.status);
          setPrice(json.existing.price?.toString() || '');
          setMessage(json.existing.message || '');
          setContactPhone(json.existing.contact_phone || json.owner?.phone || '');
        } else {
          setContactPhone(json.owner?.phone || '');
          if (json.listings?.length === 1) setListingId(json.listings[0].id);
        }
        if (initialAction === 'available' || initialAction === 'unavailable') {
          setStatus(initialAction);
        }
      } catch {
        setError('Σφάλμα δικτύου.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, initialAction]);

  async function submit() {
    if (!status) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/availability-response/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          price: status === 'available' && price ? Number(price) : null,
          message: status === 'available' ? message : null,
          contact_phone: status === 'available' ? contactPhone : null,
          listing_id: status === 'available' ? listingId || null : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Σφάλμα αποστολής.');
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError('Σφάλμα δικτύου.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Δεν βρέθηκε</h1>
        <p className="text-gray-600">{error || 'Το αίτημα δεν υπάρχει.'}</p>
      </div>
    );
  }

  if (data.expired) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Το αίτημα έχει κλείσει</h1>
        <p className="text-gray-600">Ο επισκέπτης βρήκε κατάλυμα ή το αίτημα έληξε. Δεν μπορείς πια να απαντήσεις.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Η απάντησή σου καταγράφηκε</h1>
        <p className="text-gray-600 leading-relaxed">
          {status === 'available'
            ? `Ο επισκέπτης θα δει την προσφορά σου και μπορεί να σε καλέσει στο ${contactPhone}.`
            : 'Σε ευχαριστούμε για την ενημέρωση. Δεν θα ξαναλάβεις email για αυτό το αίτημα.'}
        </p>
      </div>
    );
  }

  const r = data.request;
  const nights = Math.max(1, Math.round((new Date(r.check_out).getTime() - new Date(r.check_in).getTime()) / 86_400_000));
  const budget =
    r.budget_min && r.budget_max
      ? `${r.budget_min}€ – ${r.budget_max}€`
      : r.budget_min
        ? `από ${r.budget_min}€`
        : r.budget_max
          ? `έως ${r.budget_max}€`
          : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-sm font-semibold text-primary-600 mb-2">CHALKIDIKIHUB · ΑΙΤΗΜΑ ΔΙΑΘΕΣΙΜΟΤΗΤΑΣ</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Νέο αίτημα για {AREA_LABELS[r.area] || r.area}
      </h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Info icon={Calendar} label="Άφιξη" value={fmt(r.check_in)} />
          <Info icon={Calendar} label="Αναχώρηση" value={`${fmt(r.check_out)} (${nights} βρ.)`} />
          <Info icon={Users} label="Άτομα" value={`${r.adults} ενήλ.${r.children ? ` + ${r.children} π.` : ''}`} />
          {budget && <Info icon={Wallet} label="Budget / βράδυ" value={budget} />}
          {r.property_type && <Info icon={Home} label="Τύπος" value={r.property_type} />}
        </div>
        <hr className="my-3 border-gray-100" />
        <Info icon={User} label="Επισκέπτης" value={r.guest_name} />
        <Info icon={Phone} label="Τηλέφωνο" value={r.guest_phone} />
        {r.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="text-xs text-gray-500 mb-1">Σημειώσεις</div>
            <div className="text-sm text-gray-800 leading-relaxed">{r.notes}</div>
          </div>
        )}
      </div>

      {data.existing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-900">
          Είχες απαντήσει «{data.existing.status === 'available' ? 'Διαθέσιμο' : 'Όχι διαθέσιμο'}». Μπορείς να αλλάξεις την απάντηση.
        </div>
      )}

      {/* Status buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => setStatus('available')}
          className={`p-4 rounded-xl border-2 font-semibold transition ${
            status === 'available'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-emerald-300 text-gray-700'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
          Διαθέσιμο
        </button>
        <button
          onClick={() => setStatus('unavailable')}
          className={`p-4 rounded-xl border-2 font-semibold transition ${
            status === 'unavailable'
              ? 'border-gray-700 bg-gray-50 text-gray-800'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <XCircle className="w-6 h-6 mx-auto mb-1" />
          Δεν είμαι διαθέσιμος
        </button>
      </div>

      {/* Available form */}
      {status === 'available' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 space-y-4">
          {data.listings.length > 0 && (
            <FieldLabel label="Ποιο κατάλυμα προσφέρεις;">
              <select value={listingId} onChange={e => setListingId(e.target.value)} className="form-input">
                <option value="">(προαιρετικό)</option>
                {data.listings.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title_el || l.title_en} (χωράει {l.guests_max})
                  </option>
                ))}
              </select>
            </FieldLabel>
          )}

          <FieldLabel label="Τιμή ανά βράδυ (€)" icon={Wallet}>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="form-input"
              placeholder="π.χ. 90"
            />
          </FieldLabel>

          <FieldLabel label="Τηλέφωνο επικοινωνίας" icon={Phone}>
            <input
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="form-input"
              placeholder="69XXXXXXXX"
            />
          </FieldLabel>

          <FieldLabel label="Μήνυμα (προαιρετικό)" icon={MessageCircle}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={1500}
              className="form-input min-h-[90px]"
              placeholder="π.χ. Διαθέσιμο, μπορώ να προσφέρω και πρωινό για +10€..."
            />
          </FieldLabel>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-sm mb-4">{error}</div>
      )}

      <button
        onClick={submit}
        disabled={!status || submitting}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition"
      >
        {submitting ? 'Αποστολή...' : 'Στείλε την απάντηση'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
        Δεν χρειάζεται σύνδεση. Το link σε αυτό το email είναι μοναδικό για το αίτημα αυτό.
        <br />
        <Link href="/dashboard/broadcast-settings" className="text-gray-600 underline">
          Διαχείριση ειδοποιήσεων (opt-out)
        </Link>
      </p>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 0.95rem;
          background: #fff;
          color: #111827;
        }
        .form-input:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }
      `}</style>
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm py-1">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div>
        <span className="text-gray-500">{label}: </span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
      </div>
      {children}
    </label>
  );
}
