'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  ArrowLeft, Loader2, Save, Check, Wand2, Eye, Sparkles, BookOpen,
  Search, Info, ShieldCheck,
} from 'lucide-react';
import {
  MultilangField, LOCALES, type LocaleCode,
} from '@/components/admin/MultilangField';

type L = Record<LocaleCode, string>;

const emptyL = (): L => Object.fromEntries(LOCALES.map(l => [l, ''])) as L;

interface BrandData {
  tagline: L;
  owner_story: L;
  house_rules_extra: L;
  how_to_reach: L;
  wifi_info: L;
  parking_info: L;
  check_in_info: L;
  meta_title: L;
  meta_description: L;
}

const FIELD_KEYS: (keyof BrandData)[] = [
  'tagline', 'owner_story', 'house_rules_extra',
  'how_to_reach', 'wifi_info', 'parking_info', 'check_in_info',
  'meta_title', 'meta_description',
];

export default function AdminBrandEditorPage() {
  const { id } = useParams();
  const listingId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [fillingAll, setFillingAll] = useState(false);
  const [fillingField, setFillingField] = useState<keyof BrandData | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [titleMap, setTitleMap] = useState<L>(emptyL());
  const [descriptionMap, setDescriptionMap] = useState<L>(emptyL());
  const [data, setData] = useState<BrandData>({
    tagline: emptyL(), owner_story: emptyL(), house_rules_extra: emptyL(),
    how_to_reach: emptyL(), wifi_info: emptyL(), parking_info: emptyL(), check_in_info: emptyL(),
    meta_title: emptyL(), meta_description: emptyL(),
  });
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: row, error } = await supabase.from('listings').select('*').eq('id', listingId).single() as any;
    if (error || !row) {
      setError(error?.message || 'Δεν βρέθηκε');
      setLoading(false);
      return;
    }
    setSlug(row.slug || '');
    setTitle(row.title_el || row.title_en || '');

    const pick = (prefix: string): L =>
      Object.fromEntries(LOCALES.map(l => [l, (row[`${prefix}_${l}`] as string) || ''])) as L;

    setTitleMap(pick('title'));
    setDescriptionMap(pick('description'));
    setData({
      tagline:           pick('tagline'),
      owner_story:       pick('owner_story'),
      house_rules_extra: pick('house_rules_extra'),
      how_to_reach:      pick('how_to_reach'),
      wifi_info:         pick('wifi_info'),
      parking_info:      pick('parking_info'),
      check_in_info:     pick('check_in_info'),
      meta_title:        pick('meta_title'),
      meta_description:  pick('meta_description'),
    });
    setLoading(false);
  }, [listingId]);

  useEffect(() => { load(); }, [load]);

  function updateField(field: keyof BrandData, lang: LocaleCode, value: string) {
    setData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    setDirty(true);
  }

  async function fillMissing(field: keyof BrandData, sourceLocale: LocaleCode) {
    const values = data[field];
    const sourceText = values[sourceLocale]?.trim();
    if (!sourceText) {
      alert(`Γράψε πρώτα κείμενο στα ${sourceLocale.toUpperCase()}.`);
      return;
    }
    const missingLangs = LOCALES.filter(l => l !== sourceLocale && !(values[l] || '').trim());
    if (missingLangs.length === 0) {
      alert('Όλες οι γλώσσες έχουν ήδη περιεχόμενο. Αν θες να τις ξαναγράψεις, σβήσε τις πρώτα.');
      return;
    }

    setFillingField(field);
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLocale,
          fields: { [field]: sourceText },
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const translations = (json[field] || {}) as Record<string, string>;
      setData(prev => {
        const next: L = { ...prev[field] };
        missingLangs.forEach(l => {
          if (translations[l]) next[l] = translations[l];
        });
        return { ...prev, [field]: next };
      });
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setFillingField(null);
    }
  }

  async function fillAllMissing() {
    setFillingAll(true);
    try {
      // For each field: if source (el) has content, translate to missing langs
      for (const field of FIELD_KEYS) {
        const values = data[field];
        const sourceLocale: LocaleCode = values.el.trim() ? 'el' : (values.en.trim() ? 'en' : 'el');
        const sourceText = values[sourceLocale]?.trim();
        if (!sourceText) continue;
        const missingLangs = LOCALES.filter(l => l !== sourceLocale && !(values[l] || '').trim());
        if (missingLangs.length === 0) continue;

        const res = await fetch('/api/ai/translate-fields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceLocale, fields: { [field]: sourceText } }),
        });
        const json = await res.json();
        if (json.error) {
          console.warn('translate error', field, json.error);
          continue;
        }
        const translations = (json[field] || {}) as Record<string, string>;
        setData(prev => {
          const next: L = { ...prev[field] };
          missingLangs.forEach(l => { if (translations[l]) next[l] = translations[l]; });
          return { ...prev, [field]: next };
        });
      }
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setFillingAll(false);
    }
  }

  async function generateSeo() {
    setSeoLoading(true);
    try {
      const res = await fetch('/api/ai/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleMap.el || titleMap.en || title,
          tagline: data.tagline.el || data.tagline.en,
          description: descriptionMap.el || descriptionMap.en,
          location: 'Halkidiki',
          category: 'accommodation',
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setData(prev => ({
        ...prev,
        meta_title: Object.fromEntries(LOCALES.map(l => [l, json[`meta_title_${l}`] || prev.meta_title[l]])) as L,
        meta_description: Object.fromEntries(LOCALES.map(l => [l, json[`meta_description_${l}`] || prev.meta_description[l]])) as L,
      }));
      setDirty(true);
    } catch (err) {
      alert('Αποτυχία SEO: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setSeoLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    const payload: Record<string, string | null> = {};
    FIELD_KEYS.forEach(field => {
      LOCALES.forEach(l => {
        const v = data[field][l]?.trim();
        payload[`${field}_${l}`] = v ? v : null;
      });
    });

    const { error } = await supabase.from('listings').update(payload).eq('id', listingId);
    if (error) {
      setError(error.message);
    } else {
      setError('');
      setSuccess(true);
      setDirty(false);
      setTimeout(() => setSuccess(false), 2500);
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      <Link href="/admin/brand-sites" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4">
        <ArrowLeft className="w-4 h-4" />Brand Sites
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary-600" />
            Brand Editor
          </h1>
          {title && <p className="text-sm text-gray-600 mt-1">{title}</p>}
        </div>
        {slug && (
          <Link href={`/stay/${slug}`} target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Eye className="w-4 h-4" /> Preview stay page
          </Link>
        )}
      </div>

      {/* Bulk actions bar */}
      <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-4 mb-5 flex flex-wrap items-center gap-3">
        <Info className="w-5 h-5 text-primary-700 shrink-0" />
        <div className="text-sm text-gray-700 flex-1 min-w-0">
          <strong>Bulk actions</strong>: Συμπλήρωσε όλες τις ελλείπουσες γλώσσες με AI ή δημιούργησε SEO meta για 7 γλώσσες.
        </div>
        <button type="button" onClick={fillAllMissing} disabled={fillingAll}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl disabled:opacity-50">
          {fillingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Translate missing (all fields × 6 langs)
        </button>
        <button type="button" onClick={generateSeo} disabled={seoLoading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl disabled:opacity-50">
          {seoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Generate SEO meta (7 langs)
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      {/* Section: Brand content */}
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary-500" /> Brand content
      </h2>
      <div className="space-y-3 mb-6">
        <MultilangField
          label="Tagline / Σλόγκαν"
          description="Μικρή φράση που εμφανίζεται κάτω από τον τίτλο (~80 χαρακτήρες)."
          values={data.tagline}
          onChange={(lang, v) => updateField('tagline', lang, v)}
          type="input"
          maxLength={120}
          onFillMissing={(src) => fillMissing('tagline', src)}
          filling={fillingField === 'tagline'}
        />
        <MultilangField
          label="Η ιστορία μας"
          description="Προσωπική αφήγηση για το κατάλυμα και τον ιδιοκτήτη."
          values={data.owner_story}
          onChange={(lang, v) => updateField('owner_story', lang, v)}
          type="textarea" rows={5}
          onFillMissing={(src) => fillMissing('owner_story', src)}
          filling={fillingField === 'owner_story'}
        />
      </div>

      {/* Section: House Rules extras */}
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-blue-500" /> House Rules — Επιπλέον σημειώσεις
      </h2>
      <div className="space-y-3 mb-6">
        <MultilangField
          label="Επιπλέον κανόνες"
          description="Ελεύθερο κείμενο πέρα από τα structured rules (smoking/pets/kids…)."
          values={data.house_rules_extra}
          onChange={(lang, v) => updateField('house_rules_extra', lang, v)}
          type="textarea" rows={4}
          onFillMissing={(src) => fillMissing('house_rules_extra', src)}
          filling={fillingField === 'house_rules_extra'}
        />
      </div>

      {/* Section: Practical info */}
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-indigo-500" /> Practical info
      </h2>
      <div className="space-y-3 mb-6">
        <MultilangField
          label="Πώς θα φτάσετε" values={data.how_to_reach}
          onChange={(lang, v) => updateField('how_to_reach', lang, v)}
          type="textarea" rows={3}
          onFillMissing={(src) => fillMissing('how_to_reach', src)}
          filling={fillingField === 'how_to_reach'}
        />
        <MultilangField
          label="Οδηγίες check-in" values={data.check_in_info}
          onChange={(lang, v) => updateField('check_in_info', lang, v)}
          type="textarea" rows={3}
          onFillMissing={(src) => fillMissing('check_in_info', src)}
          filling={fillingField === 'check_in_info'}
        />
        <MultilangField
          label="Wi-Fi" values={data.wifi_info}
          onChange={(lang, v) => updateField('wifi_info', lang, v)}
          type="textarea" rows={2}
          onFillMissing={(src) => fillMissing('wifi_info', src)}
          filling={fillingField === 'wifi_info'}
        />
        <MultilangField
          label="Στάθμευση" values={data.parking_info}
          onChange={(lang, v) => updateField('parking_info', lang, v)}
          type="textarea" rows={2}
          onFillMissing={(src) => fillMissing('parking_info', src)}
          filling={fillingField === 'parking_info'}
        />
      </div>

      {/* Section: SEO meta */}
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
        <Search className="w-5 h-5 text-violet-500" /> SEO meta
      </h2>
      <div className="space-y-3 mb-10">
        <MultilangField
          label="Meta title"
          description="55-60 characters. Τι βλέπει ο χρήστης στα Google search results."
          values={data.meta_title}
          onChange={(lang, v) => updateField('meta_title', lang, v)}
          type="input" maxLength={70}
          onFillMissing={(src) => fillMissing('meta_title', src)}
          filling={fillingField === 'meta_title'}
        />
        <MultilangField
          label="Meta description"
          description="140-160 characters. Περιγραφή που εμφανίζεται κάτω από το title στα SERP."
          values={data.meta_description}
          onChange={(lang, v) => updateField('meta_description', lang, v)}
          type="textarea" rows={3} maxLength={200}
          onFillMissing={(src) => fillMissing('meta_description', src)}
          filling={fillingField === 'meta_description'}
        />
      </div>

      {/* Sticky save bar */}
      <div className={`sticky bottom-4 bg-white border rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3 ${dirty ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'}`}>
        <div className="text-sm">
          {dirty
            ? <span className="text-primary-700 font-medium">Μη αποθηκευμένες αλλαγές</span>
            : <span className="text-gray-600">Δεν υπάρχουν αλλαγές.</span>}
        </div>
        <button type="button" onClick={save} disabled={saving || !dirty}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση
        </button>
      </div>

      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" /> Αποθηκεύτηκε!
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
        <strong>Σημείωση</strong>: Αυτός ο editor διαχειρίζεται τα πεδία της στήλης <code className="bg-amber-100 px-1 rounded">listings</code>.
        Για multilang editing των FAQs / Emergency contacts / Extras / Photo captions, χρησιμοποίησε τον editor του ιδιοκτήτη
        (<Link href={`/dashboard/listings/${listingId}/brand`} className="underline">/dashboard/listings/{listingId}/brand</Link>)
        — ο admin επίσης έχει πρόσβαση μέσω των RLS policies.
      </div>
    </div>
  );
}
