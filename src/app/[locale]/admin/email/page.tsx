'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Send, Loader2, Users, UserX, Eye, CheckCircle, AlertTriangle, Clock, Home, Building, UserCheck } from 'lucide-react';

interface Recipient {
  id: string;
  email: string;
  name: string;
  role: string;
  listingCount: number;
}

type ListType = 'all' | 'no_listing' | 'has_listing' | 'multi_listing' | 'manual';

export default function AdminEmailPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [listType, setListType] = useState<ListType>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ id: string; message: string; details: Record<string, unknown>; created_at: string }>>([]);
  const [selectedManual, setSelectedManual] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch all profiles with email
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('created_at', { ascending: false });

      // Count listings per user
      const { data: listings } = await supabase
        .from('listings')
        .select('owner_id');

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
      }));

      // Try to get emails - profiles might have them or we get from a different query
      // Let's check if profiles has email column
      const { data: profilesWithEmail } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('created_at', { ascending: false });

      if (profilesWithEmail) {
        const emailMap = new Map(profilesWithEmail.map(p => [p.id, p.email || '']));
        enriched.forEach(r => {
          r.email = emailMap.get(r.id) || '';
          const profile = profilesWithEmail.find(p => p.id === r.id);
          if (profile) r.name = profile.full_name || '';
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

  const filtered = listType === 'all' ? recipients
    : listType === 'no_listing' ? recipients.filter(r => r.listingCount === 0)
    : listType === 'has_listing' ? recipients.filter(r => r.listingCount > 0)
    : listType === 'multi_listing' ? recipients.filter(r => r.listingCount > 1)
    : listType === 'manual' ? recipients.filter(r => selectedManual.has(r.id))
    : recipients;

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      setError('Συμπληρώστε θέμα και μήνυμα');
      return;
    }
    if (filtered.length === 0) {
      setError('Δεν υπάρχουν παραλήπτες');
      return;
    }
    if (!confirm(`Αποστολή email σε ${filtered.length} χρήστες;\n\nΘέμα: ${subject}`)) return;

    setSending(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: filtered.map(r => ({ email: r.email, name: r.name })),
          subject,
          body,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ sent: data.sent, failed: data.failed });
        // Refresh history
        const supabase = createClient();
        const { data: logs } = await supabase
          .from('activity_logs')
          .select('id, message, details, created_at')
          .eq('type', 'admin_action')
          .like('message', 'Mass email%')
          .order('created_at', { ascending: false })
          .limit(20);
        setHistory(logs || []);
      } else {
        setError(data.error || 'Αποτυχία αποστολής');
      }
    } catch (err) {
      setError((err as Error).message);
    }
    setSending(false);
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mass Email</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">
              Αποστολή ολοκληρώθηκε: {result.sent} επιτυχημένα
              {result.failed > 0 && <span className="text-red-600">, {result.failed} αποτυχημένα</span>}
            </p>
          </div>
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
                { type: 'no_listing' as ListType, icon: UserX, color: 'text-amber-600', label: 'Χωρίς κατάλυμα', count: recipients.filter(r => r.listingCount === 0).length },
                { type: 'manual' as ListType, icon: UserCheck, color: 'text-purple-600', label: 'Χειροκίνητη επιλογή', count: selectedManual.size },
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
                    <div style={{ textAlign: 'center', padding: '12px 0', borderBottom: '2px solid #0284c7' }}>
                      <h3 style={{ color: '#0284c7', margin: 0 }}>ChalkidikiHub</h3>
                    </div>
                    <div className="py-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
                    <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                      ChalkidikiHub - chalkidikihub.gr
                    </div>
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
              const d = log.details as { subject?: string; recipientCount?: number; sent?: number; failed?: number };
              return (
                <div key={log.id} className="px-4 py-3 flex items-center gap-4">
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
