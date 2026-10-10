'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, ExternalLink } from 'lucide-react';

type HostForm = {
  full_name: string;
  phone: string;

  public_page_enabled: boolean;
  public_slug: string;
  public_display_name: string;
  public_avatar_url: string;
  public_email: string;
  public_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_website: string;
  bio_el: string;
  bio_en: string;
  bio_de: string;
  bio_bg: string;
  bio_ru: string;
  bio_ro: string;
  bio_sr: string;
};

const EMPTY: HostForm = {
  full_name: '', phone: '',
  public_page_enabled: false,
  public_slug: '', public_display_name: '', public_avatar_url: '',
  public_email: '', public_phone: '',
  social_facebook: '', social_instagram: '', social_website: '',
  bio_el: '', bio_en: '', bio_de: '', bio_bg: '', bio_ru: '', bio_ro: '', bio_sr: '',
};

const BIO_LANGS: Array<{ code: keyof HostForm; label: string }> = [
  { code: 'bio_el', label: 'Ελληνικά' },
  { code: 'bio_en', label: 'English' },
  { code: 'bio_de', label: 'Deutsch' },
  { code: 'bio_bg', label: 'Български' },
  { code: 'bio_ru', label: 'Русский' },
  { code: 'bio_ro', label: 'Română' },
  { code: 'bio_sr', label: 'Srpski' },
];

function slugify(s: string) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function ProfilePage() {
  const t = useTranslations('nav');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HostForm>(EMPTY);
  const [listingCount, setListingCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from('profiles')
        .select('full_name, phone, public_page_enabled, public_slug, public_display_name, public_avatar_url, public_email, public_phone, social_facebook, social_instagram, social_website, bio_el, bio_en, bio_de, bio_bg, bio_ru, bio_ro, bio_sr')
        .eq('id', user.id).single();

      if (data) {
        setForm({
          ...EMPTY,
          ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ''])),
          public_page_enabled: Boolean(data.public_page_enabled),
        } as HostForm);
      }

      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'published');
      setListingCount(count || 0);

      setLoading(false);
    });
  }, []);

  function update<K extends keyof HostForm>(key: K, val: HostForm[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSuccess(false); setError(null);
    if (!userId) { setSaving(false); return; }

    // Auto-slug if enabling without one
    const payload = { ...form };
    if (payload.public_page_enabled && !payload.public_slug) {
      payload.public_slug = slugify(payload.public_display_name || payload.full_name) || `host-${userId.slice(0, 6)}`;
    }
    if (payload.public_slug) payload.public_slug = slugify(payload.public_slug);

    const supabase = createClient();
    const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
    if (error) {
      setError(error.message);
    } else {
      setForm(payload);
      setSuccess(true);
      // Trigger revalidation of the public host page
      if (payload.public_slug) {
        fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'host', slug: payload.public_slug }),
        }).catch(() => {});
      }
    }
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  const eligibleForHostPage = listingCount >= 2;
  const slugPreview = form.public_slug ? slugify(form.public_slug) : '';

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('profile')}</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={form.full_name} onChange={(e) => update('full_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (private)</label>
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="+30 69..." />
          </div>
        </section>

        {/* Public host page */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Public host page</h2>
            {slugPreview && form.public_page_enabled && (
              <a href={`/host/${slugPreview}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
                View page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {!eligibleForHostPage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              A public host page is available when you have <strong>at least 2 published listings</strong>.
              You currently have {listingCount}.
            </div>
          )}

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.public_page_enabled}
              disabled={!eligibleForHostPage}
              onChange={(e) => update('public_page_enabled', e.target.checked)}
              className="w-5 h-5 rounded text-primary-600" />
            <span className="text-sm text-gray-800">Enable my public host page at <code>/host/[slug]</code></span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL slug (manual)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/host/</span>
              <input type="text" value={form.public_slug} onChange={(e) => update('public_slug', e.target.value)}
                placeholder="e.g. maria-villas"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
            </div>
            {slugPreview && slugPreview !== form.public_slug && (
              <p className="mt-1 text-xs text-gray-500">Will be saved as: <code>{slugPreview}</code></p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
            <input type="text" value={form.public_display_name} onChange={(e) => update('public_display_name', e.target.value)}
              placeholder="e.g. Maria's Villas"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar / logo URL</label>
            <input type="url" value={form.public_avatar_url} onChange={(e) => update('public_avatar_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public email</label>
              <input type="email" value={form.public_email} onChange={(e) => update('public_email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public phone</label>
              <input type="tel" value={form.public_phone} onChange={(e) => update('public_phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="+30 69..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="url" value={form.social_website} onChange={(e) => update('social_website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input type="url" value={form.social_facebook} onChange={(e) => update('social_facebook', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://facebook.com/..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="url" value={form.social_instagram} onChange={(e) => update('social_instagram', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </section>

        {/* Bio (7 languages) */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Bio (7 languages)</h2>
          <p className="text-sm text-gray-500">Short story about yourself or your business. Shown on your public host page.</p>
          {BIO_LANGS.map(({ code, label }) => (
            <div key={code}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <textarea rows={3} value={form[code] as string}
                onChange={(e) => update(code, e.target.value as never)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" />
            </div>
          ))}
        </section>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </form>
    </div>
  );
}
