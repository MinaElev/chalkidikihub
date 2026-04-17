'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Loader2, Save, Check, Sparkles, BookOpen, Wand2, Eye, Info,
  HelpCircle, AlertTriangle, Calendar, ShieldCheck, Image as ImageIcon,
  Sparkle, MapPin, Lock,
} from 'lucide-react';
import { FaqsEditor } from '@/components/dashboard/FaqsEditor';
import { EmergencyContactsEditor } from '@/components/dashboard/EmergencyContactsEditor';
import { HouseRulesEditor } from '@/components/dashboard/HouseRulesEditor';
import { PracticalInfoEditor } from '@/components/dashboard/PracticalInfoEditor';
import { ExtrasEditor } from '@/components/dashboard/ExtrasEditor';
import { PhotoCaptionsEditor } from '@/components/dashboard/PhotoCaptionsEditor';
import { NearbyOverridesEditor } from '@/components/dashboard/NearbyOverridesEditor';
import { ClosedStateEditor } from '@/components/dashboard/ClosedStateEditor';

export default function BrandPage() {
  const { id } = useParams();
  const listingId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [listingTitle, setListingTitle] = useState('');
  const [slug, setSlug] = useState('');

  // Source-of-truth (Greek). The platform handles other-language translations.
  const [taglineEl, setTaglineEl] = useState('');
  const [storyEl, setStoryEl] = useState('');
  const [dirty, setDirty] = useState(false);

  // Load listing
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('listings')
        .select('slug, title_el, title_en, tagline_el, owner_story_el')
        .eq('id', listingId)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setListingTitle(data.title_el || data.title_en || '');
        setSlug(data.slug || '');
        setTaglineEl(data.tagline_el || '');
        setStoryEl(data.owner_story_el || '');
      }
      setLoading(false);
    })();
  }, [listingId]);

  async function handleSave() {
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({
        tagline_el: taglineEl.trim() || null,
        owner_story_el: storyEl.trim() || null,
      })
      .eq('id', listingId);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setDirty(false);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Πίσω στα καταλύματα
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary-600" />
            Σελίδα καταλύματος
          </h1>
          {listingTitle && <p className="text-sm text-gray-600 mt-1">{listingTitle}</p>}
        </div>
        {slug && (
          <Link
            href={`/stay/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            Προβολή σελίδας
          </Link>
        )}
      </div>

      {/* Intro card */}
      <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-5 mb-6 flex gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-100 text-primary-700 shrink-0">
          <Info className="w-5 h-5" />
        </span>
        <div className="text-sm text-gray-700 leading-relaxed">
          Αυτά τα στοιχεία κάνουν τη σελίδα του καταλύματός σου να ξεχωρίζει και βοηθάνε
          τους επισκέπτες να συνδεθούν μαζί σου πριν καν κάνουν κράτηση. Γράψε στα{' '}
          <strong>ελληνικά</strong> — η ομάδα της πλατφόρμας αναλαμβάνει τη μετάφραση στις υπόλοιπες γλώσσες.
          Μπορείς να γυρίσεις εδώ όποτε θες για να τα ενημερώσεις.
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Open / Closed state */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700">
            <Lock className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Κατάσταση καταλύματος</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Αν το κατάλυμα είναι προσωρινά κλειστό (σεζόν, ανακαίνιση, προσωπικοί λόγοι),
          ενεργοποίησε το κλείσιμο. Η δημόσια σελίδα θα δείχνει banner και οι επισκέπτες
          θα μπορούν να επικοινωνήσουν για μελλοντικές κρατήσεις.
        </p>
        <ClosedStateEditor listingId={listingId} />
      </section>

      {/* Tagline */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Tagline / Σλόγκαν
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Μικρή φράση (έως ~80 χαρακτήρες) που εμφανίζεται κάτω από τον τίτλο.
          </p>
        </div>
        <input
          type="text"
          maxLength={120}
          value={taglineEl}
          onChange={(e) => { setTaglineEl(e.target.value); setDirty(true); }}
          placeholder="π.χ. Βίλα με ιδιωτική πισίνα 30 μέτρα από τη θάλασσα"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{taglineEl.length} / 120</div>
      </section>

      {/* Our Story */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-500" />
            Η ιστορία μας
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Μίλα για σένα και το κατάλυμα. Τι το κάνει ξεχωριστό; Τι αγαπάς εσύ εδώ;
            Μια προσωπική αφήγηση χτίζει εμπιστοσύνη.
          </p>
        </div>
        <textarea
          rows={8}
          value={storyEl}
          onChange={(e) => { setStoryEl(e.target.value); setDirty(true); }}
          placeholder="Γράψε λίγα λόγια για σένα και το κατάλυμα. Γιατί το αγαπάς; Τι το κάνει ξεχωριστό; Ποιες είναι οι αγαπημένες σου στιγμές εδώ;"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <div className="text-right text-xs text-gray-400 mt-1">{storyEl.length} χαρακτήρες</div>
      </section>

      {/* FAQs */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700">
            <HelpCircle className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Συχνές ερωτήσεις</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Πρόσθεσε τις ερωτήσεις που σου κάνουν πιο συχνά οι επισκέπτες. Γράψε στα ελληνικά — οι μεταφράσεις γίνονται από τη διαχείριση.
        </p>
        <FaqsEditor listingId={listingId} />
      </section>

      {/* Emergency Contacts */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Τηλέφωνα έκτακτης ανάγκης</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Τα βασικά τηλέφωνα Ελλάδας / ΕΕ εμφανίζονται ήδη αυτόματα. Εδώ πρόσθεσε τοπικές επαφές
          (αστυνομικό τμήμα, ιατρείο, φαρμακείο, ταξί, δικό σου τηλέφωνο ως οικοδεσπότη).
        </p>
        <EmergencyContactsEditor listingId={listingId} />
      </section>

      {/* House Rules */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Κανόνες του καταλύματος</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Check-in/out, κάπνισμα, κατοικίδια, πάρτι, παιδιά. Οι επισκέπτες βλέπουν ξεκάθαρα τι ισχύει πριν κλείσουν.
        </p>
        <HouseRulesEditor listingId={listingId} />
      </section>

      {/* Practical Info */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700">
            <Info className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Χρήσιμες πληροφορίες</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Πώς θα φτάσουν στο κατάλυμα, οδηγίες check-in (π.χ. keybox), Wi-Fi, parking. Γράψε στα ελληνικά.
        </p>
        <PracticalInfoEditor listingId={listingId} />
      </section>

      {/* Extras */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-100 text-teal-700">
            <Sparkle className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Πρόσθετες υπηρεσίες</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Πρωινό, μεταφορά από αεροδρόμιο, καθαριότητα, ενοικίαση ποδηλάτων κ.λπ.
          Μπορείς να ορίσεις τιμή ή να δηλώσεις ότι περιλαμβάνονται δωρεάν.
        </p>
        <ExtrasEditor listingId={listingId} />
      </section>

      {/* Photo captions */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-pink-100 text-pink-700">
            <ImageIcon className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Λεζάντες φωτογραφιών</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Γράψε τι δείχνει κάθε φωτογραφία. Εμφανίζονται σε hover στη gallery της προσωπικής σελίδας.
        </p>
        <PhotoCaptionsEditor listingId={listingId} />
      </section>

      {/* Nearby overrides */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-700">
            <MapPin className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Τι υπάρχει γύρω</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Οι κοντινές τοποθεσίες υπολογίζονται αυτόματα βάσει απόστασης.
          Εδώ μπορείς να αποκρύψεις όσες δεν θέλεις να εμφανίζονται.
        </p>
        <NearbyOverridesEditor listingId={listingId} />
      </section>

      {/* Availability calendar shortcut */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700">
            <Calendar className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Ημερολόγιο διαθεσιμότητας</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Σημάδεψε τις μέρες που το κατάλυμα είναι δεσμευμένο ή κλειστό.
        </p>
        <Link
          href={`/dashboard/listings/${listingId}/availability`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-xl text-sm"
        >
          <Calendar className="w-4 h-4" />
          Διαχείριση ημερολογίου →
        </Link>
      </section>

      {/* Sticky save bar (tagline + story only) */}
      <div className={`sticky bottom-4 bg-white border rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 ${
        dirty ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'
      }`}>
        <div className="text-sm">
          {dirty
            ? <span className="text-primary-700 font-medium">Μη αποθηκευμένες αλλαγές</span>
            : <span className="text-gray-600">Οι αλλαγές ισχύουν μετά την αποθήκευση.</span>}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση
        </button>
      </div>

      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" />
          Αποθηκεύτηκε!
        </div>
      )}
    </div>
  );
}
