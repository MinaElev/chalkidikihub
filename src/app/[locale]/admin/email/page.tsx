'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Send, Loader2, Users, UserX, Eye, CheckCircle, AlertTriangle, Clock, Home, Building, UserCheck, AtSign, Globe, Copy, Check, FileText } from 'lucide-react';
import { EMAIL_TEMPLATES } from './templates';
import { QualityCampaign } from './QualityCampaign';
import { ResponseCampaign } from './ResponseCampaign';

interface Recipient {
  id: string;
  email: string;
  name: string;
  role: string;
  listingCount: number;
  publicHostEnabled: boolean;
}

type ListType = 'all' | 'no_listing' | 'has_listing' | 'multi_listing' | 'multi_no_host' | 'manual' | 'external';

export default function AdminEmailPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [listType, setListType] = useState<ListType>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; errors?: string[] } | null>(null);
  // Live progress across batches, and the addresses that bounced so they can be
  // retried without re-mailing everyone who already received it.
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [failedEmails, setFailedEmails] = useState<string[]>([]);
  const [copiedFailed, setCopiedFailed] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ id: string; message: string; details: Record<string, unknown>; created_at: string }>>([]);
  const [selectedManual, setSelectedManual] = useState<Set<string>>(new Set());
  const [externalEmails, setExternalEmails] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch all profiles with email
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('created_at', { ascending: false });

      // Count PUBLISHED listings per user — matches host-page eligibility logic
      const { data: listings } = await supabase
        .from('listings')
        .select('owner_id')
        .eq('status', 'published');

      const listingCounts = new Map<string, number>();
      (listings || []).forEach(l => {
        listingCounts.set(l.owner_id, (listingCounts.get(l.owner_id) || 0) + 1);
      });

      // Get emails from auth (profiles don't have email, use id to match)
      // We'll use the profiles + auth user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For superadmin, fetch all users via profiles
      // Email is stored in auth.users but accessible via user_metadata or we need to query differently
      // Workaround: use the profiles table which should have email from registration
      const enriched: Recipient[] = (profiles || []).map(p => ({
        id: p.id,
        email: '',
        name: p.full_name || '',
        role: p.role || 'owner',
        listingCount: listingCounts.get(p.id) || 0,
        publicHostEnabled: false,
      }));

      // Pull email + public_page_enabled in the same query
      const { data: profilesWithEmail } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, public_page_enabled, public_slug')
        .order('created_at', { ascending: false });

      if (profilesWithEmail) {
        const byId = new Map(profilesWithEmail.map(p => [p.id, p]));
        enriched.forEach(r => {
          const p = byId.get(r.id);
          if (p) {
            r.email = (p as { email?: string }).email || '';
            r.name = (p as { full_name?: string }).full_name || '';
            // Treat as "enabled" only when both flag is true AND a slug is set
            r.publicHostEnabled = Boolean(
              (p as { public_page_enabled?: boolean }).public_page_enabled &&
              (p as { public_slug?: string | null }).public_slug
            );
          }
        });
      }

      // Filter out users without email
      setRecipients(enriched.filter(r => r.email));

      // Fetch email history from activity_logs
      const { data: logs } = await supabase
        .from('activity_logs')
        .select('id, message, details, created_at')
        .eq('type', 'admin_action')
        .like('message', 'Mass email%')
        .order('created_at', { ascending: false })
        .limit(20);
      setHistory(logs || []);

      setLoading(false);
    }
    load();
  }, []);

  const parsedExternal = externalEmails
    .split(/[,\n;]+/)
    .map(e => e.trim())
    .filter(e => e.includes('@'));

  const filtered = listType === 'all' ? recipients
    : listType === 'no_listing' ? recipients.filter(r => r.listingCount === 0)
    : listType === 'has_listing' ? recipients.filter(r => r.listingCount > 0)
    : listType === 'multi_listing' ? recipients.filter(r => r.listingCount > 1)
    : listType === 'multi_no_host' ? recipients.filter(r => r.listingCount > 1 && !r.publicHostEnabled)
    : listType === 'manual' ? recipients.filter(r => selectedManual.has(r.id))
    : listType === 'external' ? parsedExternal.map((email, i) => ({ id: `ext-${i}`, email, name: '', role: 'external', listingCount: 0, publicHostEnabled: false }))
    : recipients;

  // Gmail needs an SMTP handshake and a moment per message. Sending the whole
  // list inside one request meant the serverless function was killed halfway
  // through, with no record of who had already received it. Batches keep every
  // request short, and each one is logged the moment it finishes.
  const BATCH_SIZE = 25;

  async function sendTo(targets: Array<{ email: string; name: string }>) {
    setSending(true);
    setError('');
    setResult(null);
    setFailedEmails([]);
    setProgress({ done: 0, total: targets.length });

    let sent = 0;
    const failures: string[] = [];
    const errorLines: string[] = [];
    const batchTotal = Math.ceil(targets.length / BATCH_SIZE);

    try {
      for (let i = 0; i < batchTotal; i++) {
        const slice = targets.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        const res = await fetch('/api/admin/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipients: slice.map((r) => ({ email: r.email, name: r.name })),
            subject,
            body,
            batchIndex: i,
            batchTotal,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          // Stop, but keep what earlier batches achieved — everyone not yet
          // reached is listed so they can be picked up afterwards.
          setError((data.error || 'Αποτυχία αποστολής') + ' (διακοπή στο πακέτο ' + (i + 1) + '/' + batchTotal + ')');
          slice.forEach((r) => failures.push(r.email));
          targets.slice((i + 1) * BATCH_SIZE).forEach((r) => failures.push(r.email));
          break;
        }

        sent += data.sent || 0;
        const rows = data.results as Array<{ email: string; ok: boolean; error?: string }> | undefined;
        rows?.filter((r) => !r.ok).forEach((r) => {
          failures.push(r.email);
          errorLines.push(r.email + ': ' + r.error);
        });

        setProgress({ done: Math.min((i + 1) * BATCH_SIZE, targets.length), total: targets.length });
        setResult({ sent, failed: failures.length, errors: errorLines });
      }

      setFailedEmails(failures);
      setResult({ sent, failed: failures.length, errors: errorLines });

      const supabase = createClient();
      const { data: logs } = await supabase
        .from('activity_logs')
        .select('id, message, details, created_at')
        .eq('type', 'admin_action')
        .like('message', 'Mass email%')
        .order('created_at', { ascending: false })
        .limit(20);
      setHistory(logs || []);
    } catch (err) {
      setError((err as Error).message);
    }
    setProgress(null);
    setSending(false);
  }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Συμπληρώστε θέμα και μήνυμα');
      return;
    }
    if (filtered.length === 0) {
      setError('Δεν υπάρχουν παραλήπτες');
      return;
    }
    if (!confirm('Αποστολή email σε ' + filtered.length + ' χρήστες;\n\nΘέμα: ' + subject)) return;
    await sendTo(filtered.map((r) => ({ email: r.email, name: r.name })));
  }

  async function handleRetryFailed() {
    if (failedEmails.length === 0) return;
    if (!confirm('Επανάληψη μόνο στις ' + failedEmails.length + ' διευθύνσεις που απέτυχαν;')) return;
    await sendTo(failedEmails.map((email) => ({ email, name: '' })));
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mass Email</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {progress && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-blue-900">
              Αποστολή σε εξέλιξη… {progress.done} / {progress.total}
            </p>
            <span className="text-xs text-blue-700 tabular-nums">
              {Math.round((progress.done / Math.max(progress.total, 1)) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: ((progress.done / Math.max(progress.total, 1)) * 100) + '%' }}
            />
          </div>
          <p className="mt-2 text-xs text-blue-700">Μην κλείσετε τη σελίδα μέχρι να ολοκληρωθεί.</p>
        </div>
      )}

      {result && (
        <div className={`mb-6 p-4 border rounded-xl ${result.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2">
            {result.failed === 0 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
            <p className="font-semibold text-gray-800">
              Αποστολή: {result.sent} επιτυχημένα
              {result.failed > 0 && <span className="text-amber-700">, {result.failed} απέτυχαν</span>}
            </p>
          </div>

          {failedEmails.length > 0 && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Δεν παραδόθηκαν ({failedEmails.length})
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(failedEmails.join('\n'));
                        setCopiedFailed(true);
                        setTimeout(() => setCopiedFailed(false), 2000);
                      } catch { /* clipboard blocked */ }
                    }}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {copiedFailed ? 'Αντιγράφηκαν ✓' : 'Αντιγραφή'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRetryFailed}
                    disabled={sending}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50"
                  >
                    Επανάληψη σε αυτές
                  </button>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {failedEmails.map((em) => (
                  <p key={em} className="text-xs text-gray-700 font-mono py-0.5">{em}</p>
                ))}
              </div>
              {result.errors && result.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">Αιτίες</summary>
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-[11px] text-red-600 font-mono mt-1 break-all">{err}</p>
                  ))}
                </details>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recipients */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Παραλήπτες</h2>

            {/* List type selector */}
            <div className="space-y-2 mb-4">
              {[
                { type: 'all' as ListType, icon: Users, color: 'text-primary-600', label: 'Όλοι οι χρήστες', count: recipients.length },
                { type: 'has_listing' as ListType, icon: Home, color: 'text-green-600', label: 'Με κατάλυμα', count: recipients.filter(r => r.listingCount > 0).length },
                { type: 'multi_listing' as ListType, icon: Building, color: 'text-blue-600', label: 'Με 2+ καταλύματα', count: recipients.filter(r => r.listingCount > 1).length },
                { type: 'multi_no_host' as ListType, icon: Globe, color: 'text-indigo-600', label: '2+ καταλύματα χωρίς host page', count: recipients.filter(r => r.listingCount > 1 && !r.publicHostEnabled).length },
                { type: 'no_listing' as ListType, icon: UserX, color: 'text-amber-600', label: 'Χωρίς κατάλυμα', count: recipients.filter(r => r.listingCount === 0).length },
                { type: 'manual' as ListType, icon: UserCheck, color: 'text-purple-600', label: 'Χειροκίνητη επιλογή', count: selectedManual.size },
                { type: 'external' as ListType, icon: AtSign, color: 'text-pink-600', label: 'Εξωτερικά emails', count: parsedExternal.length },
              ].map(opt => (
                <label key={opt.type} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                  listType === opt.type ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="list" checked={listType === opt.type} onChange={() => setListType(opt.type)}
                    className="text-primary-600 focus:ring-primary-500" />
                  <opt.icon className={`w-4 h-4 ${opt.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.count} χρήστες</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Manual selection checkboxes */}
            {listType === 'manual' && (
              <div className="border-t border-gray-100 pt-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Επιλέξτε χρήστες:</p>
                  <button type="button" onClick={() => setSelectedManual(selectedManual.size === recipients.length ? new Set() : new Set(recipients.map(r => r.id)))}
                    className="text-[10px] text-primary-600 hover:underline">
                    {selectedManual.size === recipients.length ? 'Αποεπιλογή όλων' : 'Επιλογή όλων'}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {recipients.map(r => (
                    <label key={r.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-50 cursor-pointer text-xs">
                      <input type="checkbox" checked={selectedManual.has(r.id)}
                        onChange={() => {
                          const next = new Set(selectedManual);
                          next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                          setSelectedManual(next);
                        }}
                        className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="text-gray-700 truncate flex-1">{r.name || r.email}</span>
                      {r.listingCount > 0 && <span className="text-[9px] bg-green-100 text-green-600 px-1 rounded">{r.listingCount}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* External emails textarea */}
            {listType === 'external' && (
              <div className="border-t border-gray-100 pt-3 mb-3">
                <p className="text-xs text-gray-500 mb-2">Εισάγετε emails (ένα ανά γραμμή ή χωρισμένα με κόμμα):</p>
                <textarea rows={5} value={externalEmails}
                  onChange={(e) => setExternalEmails(e.target.value)}
                  placeholder="info@example.com&#10;owner@hotel.gr&#10;contact@beach-bar.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-primary-500" />
                <p className="text-[10px] text-gray-400 mt-1">{parsedExternal.length} έγκυρα emails</p>
              </div>
            )}

            {/* Recipients list */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 mb-2">{filtered.length} παραλήπτες:</p>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filtered.map(r => (
                  <div key={r.id} className="flex items-center gap-2 py-1 px-2 rounded text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${r.listingCount > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-gray-700 truncate flex-1">{r.name || r.email}</span>
                    {r.listingCount > 0 && <span className="text-[9px] bg-green-100 text-green-600 px-1 rounded">{r.listingCount}</span>}
                    {r.role === 'superadmin' && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded">admin</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Compose */}
        <div className="lg:col-span-2 space-y-4">

          {/* Personalised quality reminder — its own recipients and send flow. */}
          <QualityCampaign />

          {/* Response rate per owner + polite "press not available" reminder. */}
          <ResponseCampaign />

          {/* Template library — «Χρήση» fills the composer, «Αντιγραφή» puts the
              raw HTML on the clipboard for use outside this panel. */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">Έτοιμα templates</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Συμπληρώνουν θέμα και μήνυμα. Μετά τα επεξεργάζεσαι κανονικά πριν την αποστολή.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {EMAIL_TEMPLATES.map((tpl) => (
                <div key={tpl.id} className="border border-gray-200 rounded-xl p-3.5 hover:border-primary-300 transition-colors">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <span className="text-xl leading-none mt-0.5" aria-hidden="true">{tpl.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 leading-snug">{tpl.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 leading-snug">{tpl.hint}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setSubject(tpl.subject); setBody(tpl.body); setPreview(true); }}
                      className="flex-1 min-h-[36px] px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors"
                    >
                      Χρήση
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(tpl.body);
                          setCopiedId(tpl.id);
                          setTimeout(() => setCopiedId((c) => (c === tpl.id ? null : c)), 2000);
                        } catch { /* clipboard blocked — «Χρήση» still works */ }
                      }}
                      title="Αντιγραφή HTML"
                      className="min-h-[36px] px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {copiedId === tpl.id
                        ? <Check className="w-3.5 h-3.5 text-green-600" />
                        : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Σύνταξη Email</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Θέμα *</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="π.χ. Καλωσορίσατε στο ChalkidikiHub!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Μήνυμα * <span className="text-xs text-gray-400">(υποστηρίζει HTML)</span></label>
                <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)}
                  placeholder="Γράψτε το μήνυμά σας εδώ...

Μπορείτε να χρησιμοποιήσετε HTML:
<p>Παράγραφος</p>
<strong>Bold</strong>
<a href='https://chalkidikihub.gr'>Link</a>
<br> για νέα γραμμή"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
              </div>

              {/* Preview */}
              <button type="button" onClick={() => setPreview(!preview)}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                <Eye className="w-4 h-4" />
                {preview ? 'Κλείσιμο preview' : 'Preview email'}
              </button>

              {preview && body && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
                  </div>
                </div>
              )}

              {/* Send */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button onClick={handleSend} disabled={sending || !subject.trim() || !body.trim() || filtered.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl disabled:opacity-50 transition-colors">
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {sending ? `Αποστολή...` : `Αποστολή σε ${filtered.length} χρήστες`}
                </button>
                {filtered.length === 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    Δεν υπάρχουν παραλήπτες
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send History */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Ιστορικό Αποστολών</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {history.map((log) => {
              const d = log.details as { subject?: string; recipientCount?: number; sent?: number; failed?: number; emails?: string[] };
              const emails = Array.isArray(d.emails) ? d.emails : [];
              const isOpen = expandedHistory.has(log.id);
              return (
                <div key={log.id} className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{d.subject || 'No subject'}</p>
                      <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString('el')}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">{d.recipientCount || 0} παραλήπτες</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">{d.sent || 0} sent</span>
                      {(d.failed || 0) > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">{d.failed} failed</span>
                      )}
                      {emails.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const next = new Set(expandedHistory);
                            next.has(log.id) ? next.delete(log.id) : next.add(log.id);
                            setExpandedHistory(next);
                          }}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          {isOpen ? 'Απόκρυψη' : 'Προβολή emails'}
                        </button>
                      )}
                    </div>
                  </div>
                  {isOpen && emails.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                        <p className="text-xs text-gray-500">{emails.length} emails:</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(emails.join(', '))}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Αντιγραφή
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExternalEmails(emails.join('\n'));
                              setListType('external');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Επαναχρήση παραληπτών
                          </button>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        value={emails.join('\n')}
                        rows={Math.min(8, emails.length)}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
