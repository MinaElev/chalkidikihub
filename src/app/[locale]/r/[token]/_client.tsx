'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Calendar, CalendarClock, Users, Wallet, Phone, User, MessageCircle, CheckCircle2, XCircle, Home } from 'lucide-react';

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
    guest_phone?: string; // only present after the owner has earned it
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
    status: 'available' | 'unavailable' | 'alternative';
    price: number | null;
    message: string | null;
    contact_phone: string | null;
    alt_check_in: string | null;
    alt_check_out: string | null;
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

  const [status, setStatus] = useState<'available' | 'unavailable' | 'alternative' | ''>('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [listingId, setListingId] = useState('');
  const [altCheckIn, setAltCheckIn] = useState('');
  const [altCheckOut, setAltCheckOut] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [guestPhone, setGuestPhone] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);

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
        // If the owner already earned the guest's phone (responded available
        // with a price), the API returns it — surface it on revisit.
        if (json.request?.guest_phone) {
          setGuestPhone(json.request.guest_phone);
          setGuestName(json.request.guest_name || null);
        }
        // Alternative-date pickers default to the guest's requested range so
        // the owner only has to nudge the day that differs.
        const reqIn = toDateInput(json.request?.check_in);
        const reqOut = toDateInput(json.request?.check_out);
        // Prefill
        if (json.existing) {
          setStatus(json.existing.status);
          setPrice(json.existing.price?.toString() || '');
          setMessage(json.existing.message || '');
          setContactPhone(json.existing.contact_phone || json.owner?.phone || '');
          setAltCheckIn(toDateInput(json.existing.alt_check_in) || reqIn);
          setAltCheckOut(toDateInput(json.existing.alt_check_out) || reqOut);
        } else {
          setContactPhone(json.owner?.phone || '');
          setAltCheckIn(reqIn);
          setAltCheckOut(reqOut);
          if (json.listings?.length === 1) setListingId(json.listings[0].id);
        }
        if (initialAction === 'available' || initialAction === 'unavailable' || initialAction === 'alternative') {
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
          price: isOffer(status) && price ? Number(price) : null,
          message: isOffer(status) ? message : null,
          contact_phone: isOffer(status) ? contactPhone : null,
          listing_id: isOffer(status) ? listingId || null : null,
          alt_check_in: status === 'alternative' ? altCheckIn : null,
          alt_check_out: status === 'alternative' ? altCheckOut : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Σφάλμα αποστολής.');
        setSubmitting(false);
        return;
      }
      if (json.guest_phone) {
        setGuestPhone(json.guest_phone);
        setGuestName(json.guest_name || null);
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
        {isOffer(status) ? (
          <>
            <p className="text-gray-600 leading-relaxed mb-5">
              {status === 'alternative'
                ? 'Η προσφορά σου με τις εναλλακτικές ημερομηνίες εμφανίζεται τώρα στη σελίδα του επισκέπτη. Μπορείς να τον καλέσεις απευθείας:'
                : 'Η προσφορά σου εμφανίζεται τώρα στη σελίδα του επισκέπτη. Μπορείς να τον καλέσεις απευθείας:'}
            </p>
            {guestPhone && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 max-w-sm mx-auto">
                {guestName && <div className="text-sm text-gray-600 mb-1">{guestName}</div>}
                <div className="text-2xl font-bold text-gray-900 tracking-wide mb-3">{guestPhone}</div>
                <a
                  href={`tel:${guestPhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  <Phone className="w-5 h-5" />
                  Κάλεσε τώρα
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-600 leading-relaxed">
            Σε ευχαριστούμε για την ενημέρωση. Δεν θα ξαναλάβεις email για αυτό το αίτημα.
          </p>
        )}
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
        {guestPhone ? (
          <Info icon={Phone} label="Τηλέφωνο" value={guestPhone} />
        ) : (
          <div className="flex items-start gap-2 text-sm py-1 text-gray-400">
            <Phone className="w-4 h-4 mt-0.5" />
            <span>Τηλέφωνο: εμφανίζεται μόλις δηλώσεις διαθεσιμότητα (ή κοντινές ημερομηνίες) &amp; τιμή</span>
          </div>
        )}
        {r.notes && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="text-xs text-gray-500 mb-1">Σημειώσεις</div>
            <div className="text-sm text-gray-800 leading-relaxed">{r.notes}</div>
          </div>
        )}
      </div>

      {data.existing && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-900">
          Είχες απαντήσει «{data.existing.status === 'available' ? 'Διαθέσιμο' : data.existing.status === 'alternative' ? 'Κοντινές ημερομηνίες' : 'Όχι διαθέσιμο'}». Μπορείς να αλλάξεις την απάντηση.
        </div>
      )}

      {/* Status buttons */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => setStatus('available')}
          className={`p-3 rounded-xl border-2 font-semibold text-sm transition ${
            status === 'available'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 hover:border-emerald-300 text-gray-700'
          }`}
        >
          <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
          Διαθέσιμο
        </button>
        <button
          onClick={() => setStatus('alternative')}
          className={`p-3 rounded-xl border-2 font-semibold text-sm transition ${
            status === 'alternative'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-primary-300 text-gray-700'
          }`}
        >
          <CalendarClock className="w-6 h-6 mx-auto mb-1" />
          Κοντινές ημερομηνίες
        </button>
        <button
          onClick={() => setStatus('unavailable')}
          className={`p-3 rounded-xl border-2 font-semibold text-sm transition ${
            status === 'unavailable'
              ? 'border-gray-700 bg-gray-50 text-gray-800'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          <XCircle className="w-6 h-6 mx-auto mb-1" />
          Μη διαθέσιμος
        </button>
      </div>

      {/* Offer form (available or alternative dates) */}
      {isOffer(status) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5 space-y-4">
          {status === 'alternative' && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-800 mb-1">
                <CalendarClock className="w-4 h-4" />
                Ποιες ημερομηνίες μπορείς να προσφέρεις;
              </div>
              <div className="text-xs text-gray-600 mb-3">
                Ο επισκέπτης ζήτησε {fmt(r.check_in)} → {fmt(r.check_out)}. Άλλαξε ό,τι χρειάζεται.
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldLabel label="Άφιξη" icon={Calendar}>
                  <input
                    type="date"
                    value={altCheckIn}
                    onChange={e => setAltCheckIn(e.target.value)}
                    className="form-input"
                  />
                </FieldLabel>
                <FieldLabel label="Αναχώρηση" icon={Calendar}>
                  <input
                    type="date"
                    value={altCheckOut}
                    min={altCheckIn || undefined}
                    onChange={e => setAltCheckOut(e.target.value)}
                    className="form-input"
                  />
                </FieldLabel>
              </div>
            </div>
          )}
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

          <FieldLabel label="Τιμή ανά βράδυ (€) — υποχρεωτικό" icon={Wallet}>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="form-input"
              placeholder="π.χ. 90"
            />
            <div className="text-xs text-gray-500 mt-1.5">
              Μόλις καταχωρήσεις τιμή, θα δεις το τηλέφωνο του επισκέπτη για να τον καλέσεις.
            </div>
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
        disabled={
          !status ||
          submitting ||
          (isOffer(status) && !price) ||
          (status === 'alternative' && (!altCheckIn || !altCheckOut || altCheckOut <= altCheckIn))
        }
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition"
      >
        {submitting
          ? 'Αποστολή...'
          : isOffer(status)
            ? 'Καταχώρησε & δες το τηλέφωνο'
            : 'Στείλε την απάντηση'}
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
  return new Date(iso).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Athens' });
}

function isOffer(s: string): boolean {
  return s === 'available' || s === 'alternative';
}

// Normalise a date/datetime string to the YYYY-MM-DD a <input type="date"> wants.
function toDateInput(v?: string | null): string {
  if (!v) return '';
  const m = /^\d{4}-\d{2}-\d{2}/.exec(v);
  if (m) return m[0];
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
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
