'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { logEvent } from '@/lib/logger';

interface Props {
  type: 'beach' | 'restaurant' | 'activity';
  itemId: string;
  itemName: string;
}

// Localised strings — el/en fully, other (noindex) locales fall back to en.
type Dict = Record<string, string>;
const pick = (d: Dict, l: string) => d[l] || d.en;
const T = {
  heading: { el: 'Αφήστε κριτική', en: 'Leave a review' },
  ratingLabel: { el: 'Βαθμολογία', en: 'Rating' },
  nameLabel: { el: 'Το όνομά σας', en: 'Your name' },
  namePlaceholder: { el: 'π.χ. Μαρία Κ.', en: 'e.g. Maria K.' },
  commentLabel: { el: 'Σχόλιο', en: 'Comment' },
  commentPlaceholder: { el: 'Πείτε μας την εμπειρία σας…', en: 'Tell us about your experience…' },
  submit: { el: 'Υποβολή', en: 'Submit' },
  sending: { el: 'Αποστολή…', en: 'Sending…' },
  as: { el: 'Ως', en: 'As' },
  thanks: { el: 'Ευχαριστούμε για την κριτική σας!', en: 'Thank you for your review!' },
  afterModeration: { el: 'Θα δημοσιευτεί μετά από έγκριση.', en: 'It will be published after moderation.' },
} satisfies Record<string, Dict>;

export function ReviewForm({ type, itemId, itemName }: Props) {
  const locale = useLocale();
  const t = (d: Dict) => pick(d, locale);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill the name for signed-in users; guests type their own. Login is NOT
  // required — reviews are moderated (status: pending) and honeypot-guarded, so
  // gating on auth only suppressed collection (the whole catalogue had 0 reviews).
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setName(u.user_metadata?.full_name || u.email?.split('@')[0] || '');
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || rating === 0 || !name.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId, rating, comment, authorName: name.trim(), website: honeypot }),
      });
      if (res.ok) {
        logEvent('user_action', 'info', 'Review submitted', { type, itemId, rating });
        setSuccess(true);
      }
    } catch {}
    setSending(false);
  }

  if (success) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="font-semibold text-green-800">{t(T.thanks)}</p>
        <p className="text-sm text-green-600">{t(T.afterModeration)}</p>
      </div>
    );
  }

  return (
    <div id="review-form" className="mt-6 scroll-mt-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t(T.heading)}</h3>
      <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
        {/* Honeypot — bots fill this; humans never see it */}
        <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        </div>

        {/* Stars */}
        <div>
          <p className="text-sm text-gray-700 mb-1">{t(T.ratingLabel)} *</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button"
                aria-label={`${s}/5`}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="p-0.5">
                <Star className={`w-7 h-7 transition-colors ${
                  s <= (hoverRating || rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                }`} />
              </button>
            ))}
            {rating > 0 && <span className="text-sm text-gray-500 ml-2 self-center">{rating}/5</span>}
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="review-name" className="block text-sm text-gray-700 mb-1">{t(T.nameLabel)} *</label>
          <input id="review-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t(T.namePlaceholder)} maxLength={100} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm text-gray-700 mb-1">{t(T.commentLabel)}</label>
          <textarea id="review-comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder={t(T.commentPlaceholder)} maxLength={2000}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{itemName}</p>
          <button type="submit" disabled={sending || rating === 0 || !name.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            {sending ? t(T.sending) : t(T.submit)}
          </button>
        </div>
      </form>
    </div>
  );
}
