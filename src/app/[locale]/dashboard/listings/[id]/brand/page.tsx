'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Loader2, Save, Check, Sparkles, BookOpen, Wand2, Eye, Info,
  HelpCircle, AlertTriangle, Calendar, ShieldCheck, Image as ImageIcon,
  Sparkle, MapPin,
} from 'lucide-react';
import { FaqsEditor } from '@/components/dashboard/FaqsEditor';
import { EmergencyContactsEditor } from '@/components/dashboard/EmergencyContactsEditor';
import { HouseRulesEditor } from '@/components/dashboard/HouseRulesEditor';
import { PracticalInfoEditor } from '@/components/dashboard/PracticalInfoEditor';
import { ExtrasEditor } from '@/components/dashboard/ExtrasEditor';
import { PhotoCaptionsEditor } from '@/components/dashboard/PhotoCaptionsEditor';
import { NearbyOverridesEditor } from '@/components/dashboard/NearbyOverridesEditor';

type FieldName = 'tagline' | 'owner_story';

const LANGS = ['en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

export default function BrandPage() {
  const { id } = useParams();
  const listingId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [listingTitle, setListingTitle] = useState('');
  const [slug, setSlug] = useState('');

  // EL source fields
  const [taglineEl, setTaglineEl] = useState('');
  const [storyEl, setStoryEl] = useState('');

  // AI translation overrides: flat keys like tagline_en / owner_story_de
  const [translated, setTranslated] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState<Record<FieldName, boolean>>({
    tagline: false, owner_story: false,
  });
  const [lastTranslatedAt, setLastTranslatedAt] = useState<Record<FieldName, number | null>>({
    tagline: null, owner_story: null,
  });

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

  async function translateField(fieldName: FieldName) {
    const source = fieldName === 'tagline' ? taglineEl : storyEl;
    if (!source.trim()) {
      alert('Γράψε πρώτα το κείμενο στα ελληνικά.');
      return;
    }
    setTranslating(prev => ({ ...prev, [fieldName]: true }));
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceLocale: 'el', fields: { [fieldName]: source } }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const translations = data[fieldName] as Record<string, string> | undefined;
      if (!translations) throw new Error('Invalid response');

      setTranslated(prev => {
        const next = { ...prev };
        Object.entries(translations).forEach(([loc, text]) => {
          next[`${fieldName}_${loc}`] = text;
        });
        return next;
      });
      setLastTranslatedAt(prev => ({ ...prev, [fieldName]: Date.now() }));
    } catch (err) {
      alert('Αποτυχία μετάφρασης: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setTranslating(prev => ({ ...prev, [fieldName]: false }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    const supabase = createClient();

    const payload: Record<string, string | null> = {
      tagline_el: taglineEl.trim() || null,
      owner_story_el: storyEl.trim() || null,
      ...translated,
    };

    const { error } = await supabase
      .from('listings')
      .update(payload)
      .eq('id', listingId);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Clear translated cache so the user doesn't double-save stale data
      setTranslated({});
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

  const hasUnsavedTranslations = Object.keys(translated).length > 0;

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
          {listingTitle && (
            <p className="text-sm text-gray-600 mt-1">{listingTitle}</p>
          )}
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
          <strong>ελληνικά</strong> και πάτα «<strong>Μετάφραση με AI</strong>» για να
          γεμίσουν αυτόματα και οι 6 άλλες γλώσσες. Μπορείς να γυρίσεις εδώ όποτε θες
          για να τα ενημερώσεις.
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Tagline */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-end justify-between mb-2 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              Tagline / Σλόγκαν
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Μικρή φράση (έως ~80 χαρακτήρες) που εμφανίζεται κάτω από τον τίτλο.
            </p>
          </div>
          <button
            type="button"
            onClick={() => translateField('tagline')}
            disabled={!taglineEl.trim() || translating.tagline}
            className="text-xs flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {translating.tagline ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            Μετάφραση με AI
          </button>
        </div>
        <input
          type="text"
          maxLength={120}
          value={taglineEl}
          onChange={(e) => setTaglineEl(e.target.value)}
          placeholder="π.χ. Βίλα με ιδιωτική πισίνα 30 μέτρα από τη θάλασσα"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-gray-400">{taglineEl.length} / 120</span>
          {lastTranslatedAt.tagline && (
            <span className="text-green-700 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Μεταφράστηκε σε 6 γλώσσες — πάτα «Αποθήκευση»
            </span>
          )}
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="flex items-end justify-between mb-2 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-500" />
              Η ιστορία μας
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Μίλα για σένα και το κατάλυμα. Τι το κάνει ξεχωριστό; Τι αγαπάς εσύ εδώ;
              Μια προσωπική αφήγηση χτίζει εμπιστοσύνη.
            </p>
          </div>
          <button
            type="button"
            onClick={() => translateField('owner_story')}
            disabled={!storyEl.trim() || translating.owner_story}
            className="text-xs flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {translating.owner_story ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
            Μετάφραση με AI
          </button>
        </div>
        <textarea
          rows={8}
          value={storyEl}
          onChange={(e) => setStoryEl(e.target.value)}
          placeholder="Γράψε λίγα λόγια για σένα και το κατάλυμα. Γιατί το αγαπάς; Τι το κάνει ξεχωριστό; Ποιες είναι οι αγαπημένες σου στιγμές εδώ;"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-gray-400">{storyEl.length} χαρακτήρες</span>
          {lastTranslatedAt.owner_story && (
            <span className="text-green-700 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Μεταφράστηκε σε 6 γλώσσες — πάτα «Αποθήκευση»
            </span>
          )}
        </div>
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
          Πρόσθεσε τις ερωτήσεις που σου κάνουν πιο συχνά οι επισκέπτες. Γράψε στα ελληνικά και
          πάτα «Μετάφραση με AI» για να γίνουν αυτόματα και στις 6 άλλες γλώσσες.
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
          Πώς θα φτάσουν στο κατάλυμα, οδηγίες check-in (π.χ. keybox), Wi-Fi, parking.
          Γράψε στα ελληνικά και μετάφρασε με AI.
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
          Σημάδεψε τις μέρες που το κατάλυμα είναι δεσμευμένο ή κλειστό. Από την
          σελίδα «Ημερολόγια» επίσης ελέγχεις αν εμφανίζεται δημόσια.
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
        hasUnsavedTranslations ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'
      }`}>
        <div className="text-sm">
          {hasUnsavedTranslations ? (
            <span className="text-primary-700 font-medium">
              Έχεις {Object.keys(translated).length} μεταφράσεις χωρίς αποθήκευση
            </span>
          ) : (
            <span className="text-gray-600">
              Αλλαγές ισχύουν μετά την αποθήκευση.
            </span>
          )}
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

      {/* Translation previews (read-only) */}
      {Object.keys(translated).length > 0 && (
        <details className="mt-6 bg-white border border-gray-200 rounded-2xl p-5">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Προεπισκόπηση μεταφράσεων ({Object.keys(translated).length})
          </summary>
          <div className="mt-4 space-y-4 text-sm">
            {(['tagline', 'owner_story'] as FieldName[]).map(fieldName => {
              const entries = LANGS
                .map(lang => ({ lang, text: translated[`${fieldName}_${lang}`] }))
                .filter(e => e.text);
              if (entries.length === 0) return null;
              return (
                <div key={fieldName}>
                  <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                    {fieldName === 'tagline' ? 'Tagline' : 'Η ιστορία μας'}
                  </h3>
                  <ul className="space-y-1.5 pl-3 border-l-2 border-primary-200">
                    {entries.map(({ lang, text }) => (
                      <li key={lang} className="text-gray-700">
                        <span className="inline-block w-8 font-mono text-[10px] uppercase text-gray-400">{lang}</span>
                        <span className="whitespace-pre-line">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
