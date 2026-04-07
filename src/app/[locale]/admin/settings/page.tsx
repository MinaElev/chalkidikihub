'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Settings, Key, Globe, Cloud, Sparkles, Save, Loader2, Eye, EyeOff, CheckCircle, ImageIcon, Mail } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  placeholder: string;
  description: string;
  secret: boolean;
}

const SETTINGS_CONFIG: Setting[] = [
  {
    key: 'openai_api_key', value: '', label: 'OpenAI API Key',
    icon: Sparkles, color: 'text-purple-600 bg-purple-100',
    placeholder: 'sk-proj-...',
    description: 'Χρησιμοποιείται για AI μεταφράσεις και SEO generation',
    secret: true,
  },
  {
    key: 'ocm_api_key', value: '', label: 'Open Charge Map API Key',
    icon: Key, color: 'text-green-600 bg-green-100',
    placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    description: 'Live δεδομένα φορτιστών EV',
    secret: true,
  },
  {
    key: 'owm_api_key', value: '', label: 'OpenWeatherMap API Key',
    icon: Cloud, color: 'text-blue-600 bg-blue-100',
    placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Live καιρός για Beach Crowd estimation',
    secret: true,
  },
  {
    key: 'resend_api_key', value: '', label: 'Resend API Key',
    icon: Mail, color: 'text-pink-600 bg-pink-100',
    placeholder: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Για μαζική αποστολή email σε χρήστες (resend.com)',
    secret: true,
  },
  {
    key: 'site_name', value: '', label: 'Site Name',
    icon: Globe, color: 'text-primary-600 bg-primary-100',
    placeholder: 'Halkidiki Hub',
    description: 'Όνομα site (εμφανίζεται σε title, footer κλπ)',
    secret: false,
  },
  {
    key: 'site_description', value: '', label: 'Site Description',
    icon: Globe, color: 'text-primary-600 bg-primary-100',
    placeholder: 'Η πλατφόρμα ενοικιαζόμενων δωματίων της Χαλκιδικής',
    description: 'Περιγραφή site για SEO',
    secret: false,
  },
  {
    key: 'image_quality', value: '', label: 'Image Quality (%)',
    icon: ImageIcon, color: 'text-cyan-600 bg-cyan-100',
    placeholder: '72',
    description: 'Ποιότητα compression εικόνων (1-100). Default: 72%. Χαμηλότερο = μικρότερο μέγεθος.',
    secret: false,
  },
  {
    key: 'image_max_width', value: '', label: 'Image Max Width (px)',
    icon: ImageIcon, color: 'text-cyan-600 bg-cyan-100',
    placeholder: '1200',
    description: 'Μέγιστο πλάτος εικόνας σε pixels. Default: 1200px.',
    secret: false,
  },
  {
    key: 'image_max_height', value: '', label: 'Image Max Height (px)',
    icon: ImageIcon, color: 'text-cyan-600 bg-cyan-100',
    placeholder: '800',
    description: 'Μέγιστο ύψος εικόνας σε pixels. Default: 800px.',
    secret: false,
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('site_settings').select('key, value');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row) => { map[row.key] = row.value; });
        setSettings(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSuccess(false);

    const supabase = createClient();
    for (const [key, value] of Object.entries(settings)) {
      const { error: err } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (err) {
        setError(`Error saving ${key}: ${err.message}`);
        setSaving(false);
        return;
      }
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  function toggleVisible(key: string) {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function maskValue(value: string): string {
    if (!value || value.length < 10) return value;
    return value.slice(0, 8) + '••••••••••••' + value.slice(-4);
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />Αποθηκεύτηκαν!
        </div>
      )}

      <div className="space-y-4">
        {SETTINGS_CONFIG.map((config) => {
          const Icon = config.icon;
          const isVisible = visibleKeys.has(config.key);
          const currentValue = settings[config.key] || '';

          return (
            <div key={config.key} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{config.label}</h3>
                    {currentValue && config.secret && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{config.description}</p>

                  <div className="flex items-center gap-2">
                    <input
                      type={config.secret && !isVisible ? 'password' : 'text'}
                      value={currentValue}
                      onChange={(e) => setSettings({ ...settings, [config.key]: e.target.value })}
                      placeholder={config.placeholder}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                    {config.secret && (
                      <button type="button" onClick={() => toggleVisible(config.key)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title={isVisible ? 'Hide' : 'Show'}>
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-xl transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση Settings
        </button>
      </div>
    </div>
  );
}
