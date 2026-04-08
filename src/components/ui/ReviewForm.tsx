'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Star, Loader2, CheckCircle, LogIn } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { logEvent } from '@/lib/logger';

interface Props {
  type: 'beach' | 'restaurant' | 'activity';
  itemId: string;
  itemName: string;
}

export function ReviewForm({ type, itemId, itemName }: Props) {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ id: u.id, name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User' });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || !user || rating === 0) return;
    setSending(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId, rating, comment, authorName: user.name }),
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
        <p className="font-semibold text-green-800">Ευχαριστούμε για την κριτική σας!</p>
        <p className="text-sm text-green-600">Θα δημοσιευτεί μετά από έγκριση.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
        <p className="text-sm text-gray-600 mb-2">Θέλετε να αφήσετε κριτική;</p>
        <Link href="/auth/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
          <LogIn className="w-4 h-4" /> Συνδεθείτε
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Αφήστε κριτική</h3>
      <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
        {/* Honeypot */}
        <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <input type="text" name="url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
        </div>

        {/* Stars */}
        <div>
          <p className="text-sm text-gray-700 mb-1">Βαθμολογία *</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button"
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

        {/* Comment */}
        <div>
          <p className="text-sm text-gray-700 mb-1">Σχόλιο</p>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Πείτε μας την εμπειρία σας..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Ως {user.name}</p>
          <button type="submit" disabled={sending || rating === 0}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
            {sending ? 'Αποστολή...' : 'Υποβολή'}
          </button>
        </div>
      </form>
    </div>
  );
}
