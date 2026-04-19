'use client';

/**
 * Picks a message template + sends it to a specific booking.
 * Scoped to the listing of the booking (or "all listings" templates).
 * Shows a preview of the rendered subject/body before send so the owner can
 * sanity-check variable substitution.
 */
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Send, CheckCircle2, AlertCircle, Sparkles, Eye, Pencil, Calendar, Clock, LogIn, LogOut, MessageSquare, Star, XCircle, Bot } from 'lucide-react';

type Trigger =
  | 'manual' | 'on_inquiry' | 'on_book'
  | '3days_before' | '1day_before'
  | 'on_checkin' | 'on_checkout'
  | '7days_after' | 'on_cancel';

interface TemplateRow {
  id: string;
  name: string;
  trigger: Trigger;
  subject_locales: Record<string, string> | null;
  body_locales: Record<string, string> | null;
  active: boolean;
  listing_ids: string[] | null;
}

const TRIGGER_META: Record<Trigger, { icon: React.ComponentType<{ className?: string }>; el: string; en: string }> = {
  manual:        { icon: Pencil,       el: 'Χειροκίνητο',     en: 'Manual' },
  on_inquiry:    { icon: MessageSquare,el: 'Νέο ερώτημα',     en: 'On inquiry' },
  on_book:       { icon: Calendar,     el: 'Κράτηση',          en: 'On booking' },
  '3days_before':{ icon: Clock,        el: '3 μέρες πριν',     en: '3 days before' },
  '1day_before': { icon: Clock,        el: '1 μέρα πριν',      en: '1 day before' },
  on_checkin:    { icon: LogIn,        el: 'Check-in',         en: 'On check-in' },
  on_checkout:   { icon: LogOut,       el: 'Check-out',        en: 'On check-out' },
  '7days_after': { icon: Star,         el: '7 μέρες μετά',     en: '7 days after' },
  on_cancel:     { icon: XCircle,      el: 'Ακύρωση',          en: 'On cancel' },
};

export interface TemplatePickerProps {
  bookingId: string;
  listingId: string;
  guestEmail: string | null;
  guestCountry?: string | null;
  el: boolean;
  onSent?: () => void;
}

// Client-side render mirror of server `renderTemplate`. We duplicate the regex
// here only for the preview — the real send always happens server-side via the
// shared lib, so variable substitution stays authoritative there.
function renderPreview(tpl: string, vars: Record<string, string>): string {
  return (tpl || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k) => vars[k] ?? `{{${k}}}`);
}

function pickLocaleClient(
  locales: Record<string, string> | null | undefined,
  preferred: string,
): { locale: string; text: string } | null {
  if (!locales) return null;
  for (const c of [preferred, 'en', 'el']) {
    if (locales[c]?.trim()) return { locale: c, text: locales[c] };
  }
  for (const [k, v] of Object.entries(locales)) if (v?.trim()) return { locale: k, text: v };
  return null;
}

function guessLocale(country: string | null | undefined): string {
  const c = (country || '').trim().toUpperCase();
  if (c === 'GR' || c === 'CY') return 'el';
  if (c === 'DE' || c === 'AT' || c === 'CH') return 'de';
  if (c === 'FR' || c === 'BE' || c === 'LU') return 'fr';
  if (c === 'IT') return 'it';
  if (c === 'ES' || c === 'MX' || c === 'AR') return 'es';
  return 'en';
}

export function TemplatePicker({ bookingId, listingId, guestEmail, guestCountry, el, onSent }: TemplatePickerProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [previewFor, setPreviewFor] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{
    guest_name: string | null; check_in: string; check_out: string;
    total_amount: number | null; currency: string | null;
  } | null>(null);
  const [listingTitle, setListingTitle] = useState<string>('');
  const [override, setOverride] = useState<Record<string, { subject: string; body: string }>>({});

  const t = {
    title: el ? 'Στείλε με template' : 'Send with template',
    sub: el ? 'Επίλεξε έτοιμο template για να σταλεί email στον guest τώρα.' : 'Pick a template and send an email to the guest now.',
    noTemplates: el ? 'Δεν υπάρχουν διαθέσιμα templates για αυτό το listing.' : 'No templates available for this listing.',
    noEmail: el ? 'Η κράτηση δεν έχει email guest.' : 'This booking has no guest email.',
    preview: el ? 'Προεπισκόπηση' : 'Preview',
    subjectLabel: el ? 'Θέμα' : 'Subject',
    bodyLabel: el ? 'Μήνυμα' : 'Body',
    send: el ? 'Αποστολή' : 'Send',
    sending: el ? 'Αποστολή…' : 'Sending…',
    sent: el ? 'Εστάλη' : 'Sent',
    alreadySent: el ? 'Έχει ήδη σταλεί' : 'Already sent',
    resend: el ? 'Επανάποστολή' : 'Re-send',
    collapse: el ? 'Κλείσιμο' : 'Close',
    loading: el ? 'Φόρτωση templates…' : 'Loading templates…',
    cannotSend: el ? 'Δεν επιτρέπεται' : 'Cannot send',
  };

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const [tRes, bRes, lRes] = await Promise.all([
          supabase.from('pms_message_templates')
            .select('id, name, trigger, subject_locales, body_locales, active, listing_ids')
            .eq('owner_id', user.id)
            .eq('active', true)
            .order('name', { ascending: true }),
          supabase.from('pms_bookings')
            .select('guest_name, check_in, check_out, total_amount, currency')
            .eq('id', bookingId)
            .maybeSingle(),
          supabase.from('listings')
            .select('title_el, title_en')
            .eq('id', listingId)
            .maybeSingle(),
        ]);

        const all = (tRes.data || []) as TemplateRow[];
        const filtered = all.filter(tpl =>
          !tpl.listing_ids || tpl.listing_ids.length === 0 || tpl.listing_ids.includes(listingId),
        );
        setTemplates(filtered);
        if (bRes.data) setBooking(bRes.data as typeof booking);
        if (lRes.data) setListingTitle((el ? lRes.data.title_el : lRes.data.title_en) || lRes.data.title_el || lRes.data.title_en || '');

        const { data: alreadySent } = await supabase
          .from('pms_messages')
          .select('template_id')
          .eq('owner_id', user.id)
          .eq('booking_id', bookingId)
          .not('template_id', 'is', null);
        setSentIds(new Set((alreadySent || []).map(r => r.template_id as string).filter(Boolean)));
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId, listingId, el]);

  const locale = useMemo(() => guessLocale(guestCountry), [guestCountry]);

  const vars = useMemo<Record<string, string>>(() => {
    if (!booking) return {};
    const nights = Math.max(1, Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86_400_000));
    const currency = booking.currency || 'EUR';
    const total = booking.total_amount != null ? `${Number(booking.total_amount).toFixed(2)} ${currency}` : '';
    return {
      guest_name: booking.guest_name || '',
      listing_name: listingTitle,
      check_in: booking.check_in,
      check_out: booking.check_out,
      nights: String(nights),
      total,
      owner_name: '',
      owner_phone: '',
      owner_email: '',
    };
  }, [booking, listingTitle]);

  async function handleSend(tpl: TemplateRow, force: boolean) {
    setSending(tpl.id);
    setError(null);
    try {
      const res = await fetch('/api/pms/messages/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: tpl.id, booking_id: bookingId, force }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || data?.skipped || `HTTP ${res.status}`);
        return;
      }
      setSentIds(prev => new Set(prev).add(tpl.id));
      setPreviewFor(null);
      onSent?.();
    } finally {
      setSending(null);
    }
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> {t.loading}
      </div>
    );
  }

  if (!guestEmail) {
    return (
      <div className="inline-flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        <AlertCircle className="w-4 h-4" /> {t.noEmail}
      </div>
    );
  }

  if (templates.length === 0) {
    return <div className="text-xs text-slate-500 italic">{t.noTemplates}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-semibold text-slate-800">{t.title}</div>
          <div className="text-xs text-slate-500">{t.sub}</div>
        </div>
      </div>

      <ul className="space-y-2">
        {templates.map(tpl => {
          const Icon = TRIGGER_META[tpl.trigger].icon;
          const isSent = sentIds.has(tpl.id);
          const isPreviewing = previewFor === tpl.id;
          const subjLoc = pickLocaleClient(tpl.subject_locales, locale);
          const bodyLoc = pickLocaleClient(tpl.body_locales, locale);
          const previewSubject = override[tpl.id]?.subject ?? renderPreview(subjLoc?.text || tpl.name, vars);
          const previewBody = override[tpl.id]?.body ?? renderPreview(bodyLoc?.text || '', vars);
          const langCode = bodyLoc?.locale || '—';

          return (
            <li key={tpl.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-fuchsia-100 text-fuchsia-700 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 truncate">{tpl.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{el ? TRIGGER_META[tpl.trigger].el : TRIGGER_META[tpl.trigger].en}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase text-[10px] font-mono">{langCode}</span>
                    {isSent && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> {t.sent}
                      </span>
                    )}
                  </div>
                </div>
                <button type="button" onClick={() => setPreviewFor(isPreviewing ? null : tpl.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <Eye className="w-3 h-3" /> {t.preview}
                </button>
                <button type="button" disabled={sending === tpl.id || !bodyLoc}
                  onClick={() => handleSend(tpl, isSent)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 ${
                    isSent
                      ? 'bg-white border border-violet-200 text-violet-700 hover:bg-violet-50'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}>
                  {sending === tpl.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  {sending === tpl.id ? t.sending : (isSent ? t.resend : t.send)}
                </button>
              </div>

              {isPreviewing && (
                <div className="border-t border-slate-100 bg-slate-50 px-3 py-3 space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.subjectLabel}</label>
                    <input type="text" value={previewSubject}
                      onChange={e => setOverride(prev => ({ ...prev, [tpl.id]: { subject: e.target.value, body: prev[tpl.id]?.body ?? previewBody } }))}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{t.bodyLabel}</label>
                    <textarea rows={6} value={previewBody}
                      onChange={e => setOverride(prev => ({ ...prev, [tpl.id]: { subject: prev[tpl.id]?.subject ?? previewSubject, body: e.target.value } }))}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-mono leading-relaxed" />
                    <div className="text-[10px] text-slate-500 mt-1 inline-flex items-center gap-1">
                      <Bot className="w-3 h-3" /> {el ? 'Η προσαρμογή εδώ αφορά μόνο το UI — το αποστελλόμενο email χρησιμοποιεί το αποθηκευμένο template με μεταβλητές.' : 'Edits here are UI-only — the sent email always uses the saved template with live variables.'}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {error && (
        <div className="inline-flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4" /> {t.cannotSend}: <span className="font-mono">{error}</span>
        </div>
      )}
    </div>
  );
}
