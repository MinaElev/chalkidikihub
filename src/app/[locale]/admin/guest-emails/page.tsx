'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2, Mail, Phone, Copy, Check, Download, Search, Radio, MessageSquare, MapPin, Info,
} from 'lucide-react';

const AREA_LABELS: Record<string, string> = {
  kassandra: 'Κασσάνδρα',
  sithonia: 'Σιθωνία',
  athos: 'Άθως',
  mainland: 'Ενδοχώρα',
};

type Source = 'broadcast' | 'inquiry';

interface Contact {
  email: string;
  name: string;
  phone: string;
  area: string;
  count: number;
  lastAt: string;
  sources: Set<Source>;
}

// Broadcast requests: the mass "availability request" form (availability_requests).
interface AvailRow {
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  area: string | null;
  created_at: string;
}

// Per-listing inquiries: contact_messages with subject "Αίτημα διαθεσιμότητας…".
interface MsgRow {
  name: string | null;
  email: string | null;
  message: string | null;
  created_at: string;
}

function parsePhone(message: string | null): string {
  if (!message) return '';
  const m = message.match(/Τηλέφωνο:\s*([^\n]+)/);
  return m ? m[1].trim() : '';
}

function csvField(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export default function AdminGuestEmailsPage() {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | Source>('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const [availRes, msgRes] = await Promise.all([
        supabase
          .from('availability_requests')
          .select('guest_name, guest_email, guest_phone, area, created_at')
          .order('created_at', { ascending: false })
          .limit(5000),
        supabase
          .from('contact_messages')
          .select('name, email, message, created_at')
          .like('subject', 'Αίτημα διαθεσιμότητας%')
          .order('created_at', { ascending: false })
          .limit(5000),
      ]);

      const combined: Array<{
        email: string; name: string; phone: string; area: string; created_at: string; source: Source;
      }> = [
        ...(((availRes.data as AvailRow[] | null) || []).map(r => ({
          email: r.guest_email || '',
          name: r.guest_name || '',
          phone: r.guest_phone || '',
          area: r.area || '',
          created_at: r.created_at,
          source: 'broadcast' as Source,
        }))),
        ...(((msgRes.data as MsgRow[] | null) || []).map(r => ({
          email: r.email || '',
          name: r.name || '',
          phone: parsePhone(r.message),
          area: '',
          created_at: r.created_at,
          source: 'inquiry' as Source,
        }))),
      ];

      // Most recent first → first occurrence per email wins for name/phone/lastAt.
      combined.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      const map = new Map<string, Contact>();
      for (const row of combined) {
        const key = row.email.trim().toLowerCase();
        if (!key || !key.includes('@')) continue;
        let c = map.get(key);
        if (!c) {
          c = { email: key, name: '', phone: '', area: '', count: 0, lastAt: row.created_at, sources: new Set() };
          map.set(key, c);
        }
        c.count++;
        c.sources.add(row.source);
        if (!c.name && row.name) c.name = row.name;
        if (!c.phone && row.phone) c.phone = row.phone;
        if (!c.area && row.area) c.area = row.area;
      }

      setContacts(Array.from(map.values()));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter(c => {
      if (sourceFilter !== 'all' && !c.sources.has(sourceFilter)) return false;
      if (!q) return true;
      return (
        c.email.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    });
  }, [contacts, search, sourceFilter]);

  const stats = useMemo(() => ({
    total: contacts.length,
    broadcast: contacts.filter(c => c.sources.has('broadcast')).length,
    inquiry: contacts.filter(c => c.sources.has('inquiry')).length,
    withPhone: contacts.filter(c => c.phone).length,
  }), [contacts]);

  function copyAll() {
    const emails = filtered.map(c => c.email).join(', ');
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function exportCsv() {
    const header = ['Email', 'Όνομα', 'Τηλέφωνο', 'Περιοχή', 'Αιτήματα', 'Πηγή', 'Τελευταίο αίτημα'];
    const lines = filtered.map(c => [
      c.email,
      c.name,
      c.phone,
      AREA_LABELS[c.area] || c.area,
      String(c.count),
      Array.from(c.sources).map(s => (s === 'broadcast' ? 'Broadcast' : 'Κατάλυμα')).join(' + '),
      new Date(c.lastAt).toLocaleDateString('el-GR'),
    ].map(csvField).join(','));
    // BOM so Excel reads UTF-8 (Greek) correctly.
    const csv = '﻿' + [header.map(csvField).join(','), ...lines].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-emails-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-7 h-7 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-1">
        <Mail className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Emails Επισκεπτών</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Όλα τα emails επισκεπτών που έκαναν αίτημα διαθεσιμότητας — ενοποιημένα &amp; χωρίς διπλότυπα, έτοιμα για newsletter.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Μοναδικά emails" value={stats.total} />
        <StatCard label="Από broadcast" value={stats.broadcast} />
        <StatCard label="Από κατάλυμα" value={stats.inquiry} />
        <StatCard label="Με τηλέφωνο" value={stats.withPhone} />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Αναζήτηση email, όνομα ή τηλέφωνο…"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          {([
            { v: 'all' as const, label: 'Όλα' },
            { v: 'broadcast' as const, label: 'Broadcast' },
            { v: 'inquiry' as const, label: 'Κατάλυμα' },
          ]).map(f => (
            <button
              key={f.v}
              onClick={() => setSourceFilter(f.v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                sourceFilter === f.v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyAll}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Αντιγράφηκαν!' : `Αντιγραφή (${filtered.length})`}
          </button>
          <button
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* GDPR note */}
      <div className="flex items-start gap-2 mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Οι επαφές συλλέχθηκαν μέσω αιτημάτων διαθεσιμότητας. Για GDPR συμμόρφωση, κάθε newsletter πρέπει να έχει
          link απεγγραφής (unsubscribe) και αναφορά στην πολιτική απορρήτου. Χρησιμοποίησε το «Αντιγραφή» ή το CSV
          και επικόλλησέ τα στο <span className="font-medium">Mass Email → Εξωτερικά emails</span>.
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Όνομα</th>
                <th className="px-4 py-3">Τηλέφωνο</th>
                <th className="px-4 py-3 text-center">Αιτήματα</th>
                <th className="px-4 py-3">Πηγή</th>
                <th className="px-4 py-3 whitespace-nowrap">Τελευταίο</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">Καμία επαφή.</td>
                </tr>
              )}
              {filtered.map(c => (
                <tr key={c.email} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <a href={`mailto:${c.email}`} className="text-primary-600 hover:underline font-medium inline-flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />{c.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{c.name || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3">
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} className="text-gray-700 hover:text-gray-900 inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />{c.phone}
                      </a>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block min-w-[24px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold tabular-nums">
                      {c.count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.sources.has('broadcast') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                          <Radio className="w-3 h-3" /> Broadcast
                        </span>
                      )}
                      {c.sources.has('inquiry') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          <MessageSquare className="w-3 h-3" /> Κατάλυμα
                        </span>
                      )}
                      {c.area && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 text-xs">
                          <MapPin className="w-3 h-3" /> {AREA_LABELS[c.area] || c.area}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(c.lastAt).toLocaleDateString('el-GR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}
