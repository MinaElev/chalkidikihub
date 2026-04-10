'use client';

import { useState } from 'react';
import { Languages, Loader2, CheckCircle } from 'lucide-react';

interface ContentTranslatorProps {
  contentEl: string;
  onTranslated: (translations: Record<string, string>) => void;
}

export function ContentTranslator({ contentEl, onTranslated }: ContentTranslatorProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleTranslate() {
    if (!contentEl || contentEl.length < 10) {
      setError('Βάλε πρώτα content στα ελληνικά');
      return;
    }
    setError('');
    setDone(false);
    setLoading(true);

    try {
      // Split content into chunks if very long (>2000 chars per language)
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate_content',
          content: contentEl,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onTranslated(data);
      setDone(true);
      setTimeout(() => setDone(false), 5000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleTranslate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Μετάφραση content...</>
        ) : done ? (
          <><CheckCircle className="w-4 h-4" />Μεταφράστηκε!</>
        ) : (
          <><Languages className="w-4 h-4" />Μετάφραση Content σε 6 γλώσσες</>
        )}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
