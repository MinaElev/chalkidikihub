'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MessageSquare, Loader2, CheckCircle, LogIn, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { logEvent } from '@/lib/logger';

interface Comment {
  id: string;
  author_name: string;
  comment: string;
  created_at: string;
}

export function CommentSection({ articleId, articleSlug }: { articleId: string; articleSlug: string }) {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ id: u.id, name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User' });
    });

    // Fetch approved comments
    fetch(`/api/comments?article_id=${articleId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setComments(data); })
      .catch(() => {});
  }, [articleId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot || !user || !newComment.trim()) return;
    setSending(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, comment: newComment, authorName: user.name }),
      });
      if (res.ok) {
        logEvent('user_action', 'info', 'Blog comment submitted', { articleSlug });
        setSuccess(true);
        setNewComment('');
      }
    } catch {}
    setSending(false);
  }

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary-600" />
        Σχόλια {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{c.author_name}</span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString('el')}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center mb-4">
          <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-sm font-semibold text-green-800">Το σχόλιό σας υποβλήθηκε!</p>
          <p className="text-xs text-green-600">Θα δημοσιευτεί μετά από έγκριση.</p>
        </div>
      )}

      {/* Comment form or login prompt */}
      {!user ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
          <p className="text-sm text-gray-600 mb-2">Θέλετε να αφήσετε σχόλιο;</p>
          <Link href="/auth/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium">
            <LogIn className="w-4 h-4" /> Συνδεθείτε
          </Link>
        </div>
      ) : !success && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <input type="text" name="homepage" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <textarea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="Γράψτε το σχόλιό σας..."
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Ως {user.name}</p>
            <button type="submit" disabled={sending || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              {sending ? 'Αποστολή...' : 'Σχολιάστε'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
