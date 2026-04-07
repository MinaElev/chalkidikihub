'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send, Loader2, CheckCircle, Mail, MapPin, MessageSquare } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isGreek = locale === 'el';

  const texts = {
    title: isGreek ? 'Επικοινωνία' : 'Contact Us',
    subtitle: isGreek ? 'Έχετε ερωτήσεις; Στείλτε μας μήνυμα και θα σας απαντήσουμε σύντομα.' : 'Have questions? Send us a message and we\'ll get back to you soon.',
    name: isGreek ? 'Όνομα' : 'Name',
    email: 'Email',
    subject: isGreek ? 'Θέμα' : 'Subject',
    message: isGreek ? 'Μήνυμα' : 'Message',
    send: isGreek ? 'Αποστολή' : 'Send',
    sending: isGreek ? 'Αποστολή...' : 'Sending...',
    successTitle: isGreek ? 'Ευχαριστούμε!' : 'Thank you!',
    successMsg: isGreek ? 'Το μήνυμά σας στάλθηκε. Θα σας απαντήσουμε σύντομα.' : 'Your message was sent. We\'ll get back to you soon.',
    sendAnother: isGreek ? 'Νέο μήνυμα' : 'Send another',
    infoTitle: isGreek ? 'Στοιχεία επικοινωνίας' : 'Contact info',
    emailLabel: 'Email',
    locationLabel: isGreek ? 'Τοποθεσία' : 'Location',
    locationValue: isGreek ? 'Χαλκιδική, Ελλάδα' : 'Halkidiki, Greece',
    subjectOptions: isGreek
      ? ['Γενικό ερώτημα', 'Καταχώρηση καταλύματος', 'Αναφορά προβλήματος', 'Συνεργασία', 'Άλλο']
      : ['General inquiry', 'List a property', 'Report a problem', 'Partnership', 'Other'],
    placeholder: isGreek ? 'Γράψτε το μήνυμά σας εδώ...' : 'Write your message here...',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: err } = await supabase.from('contact_messages').insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        locale,
      });

      if (err) throw new Error(err.message);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{texts.successTitle}</h2>
        <p className="text-gray-600 mb-6">{texts.successMsg}</p>
        <button onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
          {texts.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{texts.title}</h1>
        <p className="mt-2 text-gray-600">{texts.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">{texts.infoTitle}</h2>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">{texts.emailLabel}</div>
              <a href="mailto:mnc@hotmail.gr" className="text-sm font-medium text-gray-900 hover:text-primary-600">mnc@hotmail.gr</a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">{texts.locationLabel}</div>
              <div className="text-sm font-medium text-gray-900">{texts.locationValue}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">{isGreek ? 'Απάντηση' : 'Response time'}</div>
              <div className="text-sm font-medium text-gray-900">{isGreek ? 'Εντός 24 ωρών' : 'Within 24 hours'}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <input type="text" name="company" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{texts.name} *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{texts.email} *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{texts.subject} *</label>
              <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="">--</option>
                {texts.subjectOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{texts.message} *</label>
              <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={texts.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl transition-colors">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{texts.sending}</> : <><Send className="w-4 h-4" />{texts.send}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
