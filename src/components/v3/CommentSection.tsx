'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { hasSupabaseAuthCookie } from '@/lib/auth-cookie';
import { MessageSquare, Loader2, CheckCircle, LogIn, User } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface Comment {
  id: string;
  author_name: string;
  comment: string;
  created_at: string;
}

type Dict = Record<string, string>;
const T = {
  heading: { el: 'Σχόλια', en: 'Comments', de: 'Kommentare', ro: 'Comentarii', bg: 'Коментари', sr: 'Komentari', ru: 'Комментарии' },
  submitted: { el: 'Το σχόλιό σας υποβλήθηκε!', en: 'Your comment has been submitted!', de: 'Ihr Kommentar wurde gesendet!', ro: 'Comentariul a fost trimis!', bg: 'Коментарът ви е изпратен!', sr: 'Vaš komentar je poslat!', ru: 'Ваш комментарий отправлен!' },
  afterModeration: { el: 'Θα δημοσιευτεί μετά από έγκριση.', en: 'It will be published after moderation.', de: 'Er wird nach Prüfung veröffentlicht.', ro: 'Va fi publicat după aprobare.', bg: 'Ще бъде публикуван след одобрение.', sr: 'Biće objavljen nakon odobrenja.', ru: 'Он будет опубликован после проверки.' },
  wantToComment: { el: 'Θέλετε να αφήσετε σχόλιο;', en: 'Want to leave a comment?', de: 'Möchten Sie einen Kommentar schreiben?', ro: 'Doriți să lăsați un comentariu?', bg: 'Искате ли да оставите коментар?', sr: 'Želite da ostavite komentar?', ru: 'Хотите оставить комментарий?' },
  login: { el: 'Συνδεθείτε', en: 'Log in', de: 'Anmelden', ro: 'Autentificați-vă', bg: 'Влезте', sr: 'Prijavite se', ru: 'Войти' },
  placeholder: { el: 'Γράψτε το σχόλιό σας...', en: 'Write your comment...', de: 'Schreiben Sie Ihren Kommentar...', ro: 'Scrieți comentariul...', bg: 'Напишете коментара си...', sr: 'Napišite komentar...', ru: 'Напишите комментарий...' },
  as: { el: 'Ως', en: 'As', de: 'Als', ro: 'Ca', bg: 'Като', sr: 'Kao', ru: 'Как' },
  sending: { el: 'Αποστολή...', en: 'Sending...', de: 'Wird gesendet...', ro: 'Se trimite...', bg: 'Изпращане...', sr: 'Slanje...', ru: 'Отправка...' },
  submit: { el: 'Σχολιάστε', en: 'Comment', de: 'Kommentieren', ro: 'Comentează', bg: 'Коментирай', sr: 'Komentariši', ru: 'Комментировать' },
} satisfies Record<string, Dict>;

/** v3's blog comments: approved comments are listed; signed-in readers can post one for moderation. */
export function CommentSection({ articleId }: { articleId: string }) {
  const locale = useLocale();
  const t = (d: Dict) => d[locale] || d.en;
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (hasSupabaseAuthCookie()) {
      import('@/lib/supabase/client').then(({ createClient }) =>
        createClient().auth.getUser().then(({ data: { user: u } }) => {
          if (u) setUser({ id: u.id, name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User' });
        }),
      );
    }
    fetch(`/api/comments?article_id=${articleId}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setComments(data); })
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
        setSuccess(true);
        setNewComment('');
      }
    } catch {}
    setSending(false);
  }

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
        <MessageSquare className="size-5 text-sea-600" aria-hidden />
        {t(T.heading)} {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length > 0 && (
        <div className="mb-8 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sea-100">
                <User className="size-4 text-sea-600" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{c.author_name}</span>
                  <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString(locale, { timeZone: 'Europe/Athens' })}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
          <CheckCircle className="mx-auto mb-1 size-6 text-green-600" aria-hidden />
          <p className="text-sm font-semibold text-green-800">{t(T.submitted)}</p>
          <p className="text-xs text-green-700">{t(T.afterModeration)}</p>
        </div>
      )}

      {!user ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="mb-2 text-sm text-gray-600">{t(T.wantToComment)}</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 rounded-lg bg-sea-600 px-4 py-2 text-sm font-medium text-white hover:bg-sea-700">
            <LogIn className="size-4" aria-hidden /> {t(T.login)}
          </Link>
        </div>
      ) : !success && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
            <input type="text" name="homepage" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
          </div>
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t(T.placeholder)}
            aria-label={t(T.heading)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sea-500"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">{t(T.as)} {user.name}</p>
            <button type="submit" disabled={sending || !newComment.trim()} className="flex items-center gap-2 rounded-lg bg-sea-600 px-4 py-2 text-sm font-medium text-white hover:bg-sea-700 disabled:opacity-50">
              {sending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <MessageSquare className="size-4" aria-hidden />}
              {sending ? t(T.sending) : t(T.submit)}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
