'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Plus, Trash2, Loader2, Wand2, Check, HelpCircle, ChevronDown, ChevronUp, Save,
} from 'lucide-react';

interface FaqRow {
  id: string;
  sort_order: number;
  question_el: string | null; question_en: string | null;
  question_de: string | null; question_bg: string | null;
  question_ru: string | null; question_ro: string | null;
  question_sr: string | null;
  answer_el: string | null; answer_en: string | null;
  answer_de: string | null; answer_bg: string | null;
  answer_ru: string | null; answer_ro: string | null;
  answer_sr: string | null;
}

interface LocalDraft {
  question_el: string;
  answer_el: string;
  isDirty: boolean;
  translations?: Record<string, string>; // flat: question_en, answer_de, ...
  translating: boolean;
  expanded: boolean;
}

export function FaqsEditor({ listingId, canTranslate = false }: { listingId: string; canTranslate?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, LocalDraft>>({});
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listing_faqs')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true });

    const rows = (data || []) as FaqRow[];
    setFaqs(rows);
    // Initialise editable drafts
    const newDrafts: Record<string, LocalDraft> = {};
    rows.forEach(r => {
      newDrafts[r.id] = {
        question_el: r.question_el || '',
        answer_el: r.answer_el || '',
        isDirty: false,
        translating: false,
        expanded: false,
      };
    });
    setDrafts(newDrafts);
    setLoading(false);
  }

  async function addFaq() {
    setAdding(true);
    const supabase = createClient();
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from('listing_faqs')
      .insert({ listing_id: listingId, sort_order: nextOrder })
      .select('*')
      .single();
    if (!error && data) {
      const row = data as FaqRow;
      setFaqs(prev => [...prev, row]);
      setDrafts(prev => ({
        ...prev,
        [row.id]: { question_el: '', answer_el: '', isDirty: false, translating: false, expanded: true },
      }));
    }
    setAdding(false);
  }

  async function deleteFaq(id: string) {
    if (!confirm('Σίγουρα να διαγραφεί αυτή η ερώτηση;')) return;
    const supabase = createClient();
    await supabase.from('listing_faqs').delete().eq('id', id);
    setFaqs(prev => prev.filter(f => f.id !== id));
    setDrafts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateDraft(id: string, patch: Partial<LocalDraft>) {
    setDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch, isDirty: true },
    }));
  }

  async function translate(id: string) {
    const d = drafts[id];
    if (!d?.question_el.trim() || !d?.answer_el.trim()) {
      alert('Γράψε πρώτα την ερώτηση και την απάντηση στα ελληνικά.');
      return;
    }
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], translating: true } }));
    try {
      const res = await fetch('/api/ai/translate-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceLocale: 'el',
          fields: { question: d.question_el, answer: d.answer_el },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const flat: Record<string, string> = {};
      Object.entries((data.question || {}) as Record<string, string>).forEach(([k, v]) => {
        flat[`question_${k}`] = v;
      });
      Object.entries((data.answer || {}) as Record<string, string>).forEach(([k, v]) => {
        flat[`answer_${k}`] = v;
      });

      setDrafts(prev => ({
        ...prev,
        [id]: { ...prev[id], translations: flat, translating: false, isDirty: true },
      }));
    } catch (err) {
      setDrafts(prev => ({ ...prev, [id]: { ...prev[id], translating: false } }));
      alert('Αποτυχία μετάφρασης: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  }

  async function saveFaq(id: string) {
    const d = drafts[id];
    if (!d) return;
    setSaving(prev => ({ ...prev, [id]: true }));
    const supabase = createClient();
    const payload: Record<string, string | null> = {
      question_el: d.question_el.trim() || null,
      answer_el: d.answer_el.trim() || null,
      ...(d.translations || {}),
    };
    const { error } = await supabase.from('listing_faqs').update(payload).eq('id', id);
    if (error) {
      alert('Σφάλμα: ' + error.message);
    } else {
      setDrafts(prev => ({
        ...prev,
        [id]: { ...prev[id], isDirty: false, translations: undefined },
      }));
      // Update local faqs snapshot to avoid stale UI
      setFaqs(prev => prev.map(f => f.id === id ? { ...f, question_el: d.question_el, answer_el: d.answer_el } : f));
    }
    setSaving(prev => ({ ...prev, [id]: false }));
  }

  function toggleExpand(id: string) {
    setDrafts(prev => ({
      ...prev,
      [id]: { ...prev[id], expanded: !prev[id].expanded },
    }));
  }

  if (loading) {
    return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;
  }

  return (
    <div>
      {faqs.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
          Δεν έχεις προσθέσει ερωτήσεις ακόμα.
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const d = drafts[faq.id];
          if (!d) return null;
          return (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-700 text-sm font-semibold">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="flex-1 text-left text-sm font-medium text-gray-900 truncate"
                >
                  {d.question_el || <span className="italic text-gray-400">(Κενή ερώτηση — κλικ για επεξεργασία)</span>}
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  {d.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => deleteFaq(faq.id)}
                  className="p-1 rounded hover:bg-red-50 text-red-500"
                  title="Διαγραφή"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {d.expanded && (
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ερώτηση (ελληνικά)</label>
                    <input
                      type="text"
                      value={d.question_el}
                      onChange={(e) => updateDraft(faq.id, { question_el: e.target.value })}
                      placeholder="π.χ. Υπάρχει χώρος στάθμευσης;"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Απάντηση (ελληνικά)</label>
                    <textarea
                      rows={3}
                      value={d.answer_el}
                      onChange={(e) => updateDraft(faq.id, { answer_el: e.target.value })}
                      placeholder="π.χ. Ναι, υπάρχει δωρεάν ιδιωτικό parking για 2 αυτοκίνητα."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                    {canTranslate && (
                      <>
                        <button
                          type="button"
                          onClick={() => translate(faq.id)}
                          disabled={d.translating || !d.question_el.trim() || !d.answer_el.trim()}
                          className="text-xs flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 font-medium rounded-lg disabled:opacity-40"
                        >
                          {d.translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                          Μετάφραση με AI
                        </button>
                        {d.translations && (
                          <span className="text-xs text-green-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> 6 γλώσσες έτοιμες
                          </span>
                        )}
                      </>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      {d.isDirty && <span className="text-xs text-amber-700">Μη αποθηκευμένες αλλαγές</span>}
                      <button
                        type="button"
                        onClick={() => saveFaq(faq.id)}
                        disabled={saving[faq.id] || !d.isDirty}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40"
                      >
                        {saving[faq.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Αποθήκευση
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addFaq}
        disabled={adding}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-50"
      >
        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        Προσθήκη ερώτησης
      </button>

      <p className="mt-3 text-[11px] text-gray-500 italic">
        💡 Οι ερωτήσεις εμφανίζονται στο κάτω μέρος της σελίδας και στέλνονται στο Google ως FAQ schema — αυξάνει τις πιθανότητες να εμφανιστείς ως «rich result».
      </p>
    </div>
  );
}
