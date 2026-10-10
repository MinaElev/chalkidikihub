'use client';

import { useEffect } from 'react';

// No translations available here (an error may come from the i18n layer
// itself), so the copy is bilingual.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Κάτι δεν πήγε καλά · Something went wrong</h1>
      <p className="mt-4 text-slate-600">Δοκιμάστε ξανά σε λίγα δευτερόλεπτα. · Please try again in a few seconds.</p>
      <button onClick={reset} className="mt-8 rounded-xl bg-sea-600 px-5 py-3 font-semibold text-white hover:bg-sea-700">
        Ξανά · Retry
      </button>
    </div>
  );
}
