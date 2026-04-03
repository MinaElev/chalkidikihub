'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface AIHelperProps {
  titleEl: string;
  descriptionEl: string;
  category?: string;
  location?: string;
  onComplete: (data: {
    translations: {
      title_en: string; title_de: string; title_bg: string; title_ru: string; title_ro: string;
      description_en: string; description_de: string; description_bg: string; description_ru: string; description_ro: string;
    };
    seo: {
      meta_title_el: string; meta_title_en: string; meta_title_de: string;
      meta_title_bg: string; meta_title_ru: string; meta_title_ro: string;
      meta_description_el: string; meta_description_en: string; meta_description_de: string;
      meta_description_bg: string; meta_description_ru: string; meta_description_ro: string;
      tags: string[];
      image_alt: string;
    };
  }) => void;
}

export function AIHelper({ titleEl, descriptionEl, category, location, onComplete }: AIHelperProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleFullAuto() {
    if (!titleEl) {
      setError('Βάλε πρώτα τίτλο στα ελληνικά');
      return;
    }
    setError('');
    setDone(false);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'full_auto',
          title: titleEl,
          description: descriptionEl,
          category,
          location,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onComplete(data);
      setDone(true);
      setTimeout(() => setDone(false), 5000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">AI Auto-Complete</h3>
          </div>
          <p className="text-sm text-purple-700">
            Γράψε τίτλο & περιγραφή στα ελληνικά → ΕΝΑ κλικ → γεμίζουν ΟΛΑ σε 6 γλώσσες + SEO
          </p>
        </div>

        <button
          type="button"
          onClick={handleFullAuto}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" />Δημιουργία...</>
          ) : done ? (
            <><CheckCircle className="w-5 h-5" />Ολοκληρώθηκε!</>
          ) : (
            <><Sparkles className="w-5 h-5" />AI Auto-Complete</>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-3 bg-red-50 p-2 rounded-lg">{error}</p>}
      {done && <p className="text-sm text-green-600 mt-3 bg-green-50 p-2 rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" />Μεταφράσεις (5 γλώσσες) + SEO (6 γλώσσες) + Tags + Image Alt → Ολοκληρώθηκε!</p>}
    </div>
  );
}
