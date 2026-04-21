'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Cookie, X } from 'lucide-react';

export function CookieConsent() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShouldShow(true);
      requestAnimationFrame(() => setMounted(true));
    }
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setMounted(false);
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    setMounted(false);
  }

  if (!shouldShow) return null;

  const isGreek = locale === 'el';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6 transition-transform duration-300 ease-out ${mounted ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ willChange: 'transform' }}
      role="dialog"
      aria-label="Cookie consent"
      aria-hidden={!mounted}
      data-nosnippet
    >
      <div className="max-w-xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl p-4 border border-gray-700">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">🍪</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {isGreek ? 'Ψιτ... θέλεις μπισκότο;' : 'Psst... want a cookie?'}
            </h3>
            <p className="text-sm text-gray-300 mb-1">
              {isGreek
                ? 'Δυστυχώς δεν έχουμε από αυτά τα νόστιμα. Έχουμε μόνο τα βαρετά ψηφιακά cookies που κρατάνε τη σύνδεσή σου και τη γλώσσα σου.'
                : 'Unfortunately, we don\'t have the tasty kind. We only have boring digital cookies that remember your login and language.'}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {isGreek
                ? '🏖️ Κανένα cookie παρακολούθησης - μόνο τα απαραίτητα. Υπόσχεση! Πάμε παραλία;'
                : '🏖️ No tracking cookies - only the essentials. Promise! Shall we go to the beach?'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={accept}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors">
                {isGreek ? '🍪 Ναι, δώσε μπισκότο!' : '🍪 Yes, give me a cookie!'}
              </button>
              <button onClick={decline}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-xl text-sm transition-colors">
                {isGreek ? '😢 Όχι, κάνω δίαιτα' : '😢 No, I\'m on a diet'}
              </button>
            </div>
          </div>
          <button onClick={accept} className="text-gray-500 hover:text-white shrink-0" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
