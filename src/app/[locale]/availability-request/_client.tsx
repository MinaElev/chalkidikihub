'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { CalendarDays, Users, Wallet, Home, Send, CheckCircle2, AlertCircle, MapPin, Phone, Mail, User } from 'lucide-react';

const AREAS = [
  { value: 'kassandra', label: 'Κασσάνδρα (1ο πόδι)' },
  { value: 'sithonia', label: 'Σιθωνία (2ο πόδι)' },
  { value: 'athos', label: 'Άθως (3ο πόδι)' },
  { value: 'mainland', label: 'Ενδοχώρα Χαλκιδικής' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'Όλοι οι τύποι' },
  { value: 'rooms', label: 'Δωμάτια' },
  { value: 'studio', label: 'Studio' },
  { value: 'apartment', label: 'Διαμέρισμα' },
  { value: 'house', label: 'Κατοικία' },
  { value: 'villa', label: 'Βίλα' },
];

export default function AvailabilityRequestClient({ initialArea }: { initialArea: string }) {
  const router = useRouter();
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ url: string; recipients: number; no_matches: boolean } | null>(null);

  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    area: AREAS.find(a => a.value === initialArea)?.value || '',
    check_in: '',
    check_out: '',
    adults: 2,
    children: 0,
    budget_min: '',
    budget_max: '',
    property_type: '',
    notes: '',
    website: '', // honeypot
  });

  const minCheckIn = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const minCheckOut = useMemo(() => {
    if (!form.check_in) return minCheckIn;
    const d = new Date(form.check_in);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [form.check_in, minCheckIn]);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/availability-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || messageFor(json.error) || 'Κάτι πήγε στραβά.');
        setSubmitting(false);
        return;
      }
      setDone({
        url: json.dashboard_url,
        recipients: json.recipients_count,
        no_matches: !!json.no_matches,
      });
    } catch {
      setError('Σφάλμα δικτύου. Δοκίμασε ξανά.');
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {done.no_matches ? 'Λάβαμε το αίτημά σου' : `Στάλθηκε σε ${done.recipients} ιδιοκτήτες`}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {done.no_matches
              ? 'Δεν βρήκαμε ιδιοκτήτες με διαθέσιμα καταλύματα που να ταιριάζουν αυτή τη στιγμή. Το αίτημά σου παραμένει ενεργό και θα δοκιμάσουμε ξανά αν προκύψει κάτι.'
              : 'Οι ιδιοκτήτες θα δουν το αίτημά σου και όσοι έχουν διαθέσιμο θα απαντήσουν εδώ ή θα σε καλέσουν απευθείας στο τηλέφωνο που έδωσες.'}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Σημαντικό:</strong> Αποθήκευσε αυτό το link για να βλέπεις τις απαντήσεις. Δεν χρειάζεται λογαριασμός — το link είναι μοναδικό και ασφαλές για εσένα.
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(done.url as never)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Δες τις απαντήσεις σου →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Ζήτα διαθεσιμότητα σε όλη την περιοχή
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Συμπλήρωσε μία φόρμα και θα ειδοποιηθούν αυτόματα ιδιοκτήτες καταλυμάτων στο πόδι που επιλέγεις. Όσοι έχουν διαθέσιμο θα σε ενημερώσουν.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-5">
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          aria-hidden="true"
        />

        {/* Area */}
        <Field label="Πόδι Χαλκιδικής" icon={MapPin} required>
          <select
            required
            value={form.area}
            onChange={e => setForm({ ...form, area: e.target.value })}
            className="input"
          >
            <option value="">Διάλεξε πόδι...</option>
            {AREAS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </Field>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Check-in" icon={CalendarDays} required>
            <input
              type="date"
              required
              min={minCheckIn}
              value={form.check_in}
              onChange={e => {
                const v = e.target.value;
                setForm(f => ({
                  ...f,
                  check_in: v,
                  check_out: f.check_out && f.check_out <= v ? '' : f.check_out,
                }));
              }}
              className="input"
            />
          </Field>
          <Field label="Check-out" icon={CalendarDays} required>
            <input
              type="date"
              required
              min={minCheckOut}
              value={form.check_out}
              onChange={e => setForm({ ...form, check_out: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        {/* Guests */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ενήλικες" icon={Users} required>
            <input
              type="number"
              required
              min={1}
              max={20}
              value={form.adults}
              onChange={e => setForm({ ...form, adults: parseInt(e.target.value, 10) || 1 })}
              className="input"
            />
          </Field>
          <Field label="Παιδιά" icon={Users}>
            <input
              type="number"
              min={0}
              max={15}
              value={form.children}
              onChange={e => setForm({ ...form, children: parseInt(e.target.value, 10) || 0 })}
              className="input"
            />
          </Field>
        </div>

        {/* Property type */}
        <Field label="Τύπος καταλύματος (προαιρετικό)" icon={Home}>
          <select
            value={form.property_type}
            onChange={e => setForm({ ...form, property_type: e.target.value })}
            className="input"
          >
            {PROPERTY_TYPES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </Field>

        {/* Budget */}
        <Field label="Budget ανά βράδυ σε € (προαιρετικό)" icon={Wallet}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Από"
              min={0}
              value={form.budget_min}
              onChange={e => setForm({ ...form, budget_min: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Έως"
              min={0}
              value={form.budget_max}
              onChange={e => setForm({ ...form, budget_max: e.target.value })}
              className="input"
            />
          </div>
        </Field>

        <hr className="border-gray-100" />

        {/* Contact */}
        <Field label="Όνομα" icon={User} required>
          <input
            type="text"
            required
            value={form.guest_name}
            onChange={e => setForm({ ...form, guest_name: e.target.value })}
            className="input"
            placeholder="Το όνομά σου"
          />
        </Field>

        <Field label="Email" icon={Mail} required>
          <input
            type="email"
            required
            value={form.guest_email}
            onChange={e => setForm({ ...form, guest_email: e.target.value })}
            className="input"
            placeholder="email@example.com"
          />
        </Field>

        <Field label="Τηλέφωνο (κινητό ελληνικό)" icon={Phone} required>
          <input
            type="tel"
            required
            value={form.guest_phone}
            onChange={e => setForm({ ...form, guest_phone: e.target.value })}
            className="input"
            placeholder="69XXXXXXXX"
          />
        </Field>

        {/* Notes */}
        <Field label="Σημειώσεις (προαιρετικό)">
          <textarea
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className="input min-h-[100px]"
            placeholder="π.χ. προτίμηση για θέα, parking, κατοικίδιο..."
            maxLength={1000}
          />
        </Field>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? 'Αποστολή...' : (
            <>
              <Send className="w-4 h-4" />
              Στείλε το αίτημα
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Με την υποβολή συμφωνείς ότι τα στοιχεία σου θα κοινοποιηθούν στους ιδιοκτήτες καταλυμάτων που ταιριάζουν με το αίτημά σου, ώστε να επικοινωνήσουν μαζί σου.
        </p>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          font-size: 0.95rem;
          background: #fff;
          color: #111827;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <span>{label}{required && <span className="text-red-500"> *</span>}</span>
      </div>
      {children}
    </label>
  );
}

function messageFor(code: string): string | null {
  const map: Record<string, string> = {
    missing_name: 'Συμπλήρωσε το όνομά σου.',
    invalid_email: 'Μη έγκυρο email.',
    disposable_email: 'Παρακαλώ χρησιμοποίησε προσωπικό email.',
    invalid_phone: 'Δώσε ένα έγκυρο ελληνικό τηλέφωνο (κινητό ή σταθερό).',
    invalid_area: 'Επίλεξε πόδι.',
    invalid_dates: 'Οι ημερομηνίες δεν είναι έγκυρες.',
    checkout_before_checkin: 'Η αναχώρηση πρέπει να είναι μετά την άφιξη.',
    checkin_in_past: 'Η άφιξη δεν μπορεί να είναι στο παρελθόν.',
    checkin_too_far: 'Η άφιξη μπορεί να είναι μέχρι 1 έτος μπροστά.',
    submitted_too_fast: 'Παρακαλώ ξαναπροσπάθησε.',
    invalid_property_type: 'Μη έγκυρος τύπος καταλύματος.',
  };
  return map[code] || null;
}
