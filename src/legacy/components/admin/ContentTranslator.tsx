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

  const [progress, setProgress] = useState('');

  async function translateBatch(content: string, languages: string[]): Promise<Record<string, string>> {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'translate_content',
        content,
        languages,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  async function handleTranslate() {
    if (!contentEl || contentEl.length < 10) {
      setError('Βάλε πρώτα content στα ελληνικά');
      return;
    }
    setError('');
    setDone(false);
    setLoading(true);

    try {
      // Translate in 3 batches of 2 languages to avoid token limits & timeouts
      const batches: string[][] = [['en', 'de'], ['bg', 'ru'], ['ro', 'sr']];
      const allTranslations: Record<string, string> = {};

      for (let i = 0; i < batches.length; i++) {
        setProgress(`Μετάφραση ${batches[i].join(', ').toUpperCase()}... (${i + 1}/3)`);
        const result = await translateBatch(contentEl, batches[i]);
        Object.assign(allTranslations, result);
      }

      onTranslated(allTranslations);
      setDone(true);
      setProgress('');
      setTimeout(() => setDone(false), 5000);
    } catch (err) {
      setError((err as Error).message);
      setProgress('');
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
          <><Loader2 className="w-4 h-4 animate-spin" />{progress || 'Μετάφραση content...'}</>
        ) : done ? (
          <><CheckCircle className="w-4 h-4" />Μεταφράστηκε!</>
        ) : (
          <><Languages className="w-4 h-4" />Μετάφραση Content σε 6+SR γλώσσες</>
        )}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
