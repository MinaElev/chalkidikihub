'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Send, Loader2, CheckCircle, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Breadcrumbs } from '@/compat/Breadcrumbs';
import { createClient } from '@/lib/supabase/client';

const CONTACT_TEXTS: Record<string, { title: string; subtitle: string; name: string; subject: string; message: string; send: string; sending: string; successTitle: string; successMsg: string; sendAnother: string; infoTitle: string; locationLabel: string; locationValue: string; subjectOptions: string[]; placeholder: string; responseLabel: string; responseValue: string }> = {
  "el": {
    "title": "Επικοινωνία",
    "subtitle": "Έχετε ερωτήσεις; Στείλτε μας μήνυμα και θα σας απαντήσουμε σύντομα.",
    "name": "Όνομα",
    "subject": "Θέμα",
    "message": "Μήνυμα",
    "send": "Αποστολή",
    "sending": "Αποστολή...",
    "successTitle": "Ευχαριστούμε!",
    "successMsg": "Το μήνυμά σας στάλθηκε. Θα σας απαντήσουμε σύντομα.",
    "sendAnother": "Νέο μήνυμα",
    "infoTitle": "Στοιχεία επικοινωνίας",
    "locationLabel": "Τοποθεσία",
    "locationValue": "Χαλκιδική, Ελλάδα",
    "subjectOptions": [
      "Γενικό ερώτημα",
      "Καταχώρηση καταλύματος",
      "Ιστοσελίδα καταλύματος (mdeploy)",
      "Αναφορά προβλήματος",
      "Συνεργασία",
      "Άλλο"
    ],
    "placeholder": "Γράψτε το μήνυμά σας εδώ...",
    "responseLabel": "Απάντηση",
    "responseValue": "Εντός 24 ωρών"
  },
  "en": {
    "title": "Contact Us",
    "subtitle": "Have questions? Send us a message and we'll get back to you soon.",
    "name": "Name",
    "subject": "Subject",
    "message": "Message",
    "send": "Send",
    "sending": "Sending...",
    "successTitle": "Thank you!",
    "successMsg": "Your message was sent. We'll get back to you soon.",
    "sendAnother": "Send another",
    "infoTitle": "Contact info",
    "locationLabel": "Location",
    "locationValue": "Halkidiki, Greece",
    "subjectOptions": [
      "General inquiry",
      "List a property",
      "Property website (mdeploy)",
      "Report a problem",
      "Partnership",
      "Other"
    ],
    "placeholder": "Write your message here...",
    "responseLabel": "Response time",
    "responseValue": "Within 24 hours"
  },
  "de": {
    "title": "Kontakt",
    "subtitle": "Haben Sie Fragen? Schreiben Sie uns, wir antworten Ihnen bald.",
    "name": "Name",
    "subject": "Betreff",
    "message": "Nachricht",
    "send": "Senden",
    "sending": "Wird gesendet...",
    "successTitle": "Vielen Dank!",
    "successMsg": "Ihre Nachricht wurde gesendet. Wir melden uns bald.",
    "sendAnother": "Neue Nachricht",
    "infoTitle": "Kontaktdaten",
    "locationLabel": "Standort",
    "locationValue": "Chalkidiki, Griechenland",
    "subjectOptions": [
      "Allgemeine Anfrage",
      "Unterkunft eintragen",
      "Website für Unterkünfte (mdeploy)",
      "Problem melden",
      "Zusammenarbeit",
      "Sonstiges"
    ],
    "placeholder": "Schreiben Sie hier Ihre Nachricht...",
    "responseLabel": "Antwortzeit",
    "responseValue": "Innerhalb von 24 Stunden"
  },
  "bg": {
    "title": "Контакт",
    "subtitle": "Имате въпроси? Изпратете ни съобщение и ще ви отговорим скоро.",
    "name": "Име",
    "subject": "Тема",
    "message": "Съобщение",
    "send": "Изпрати",
    "sending": "Изпращане...",
    "successTitle": "Благодарим ви!",
    "successMsg": "Съобщението ви е изпратено. Ще ви отговорим скоро.",
    "sendAnother": "Ново съобщение",
    "infoTitle": "Данни за контакт",
    "locationLabel": "Местоположение",
    "locationValue": "Халкидики, Гърция",
    "subjectOptions": [
      "Общ въпрос",
      "Добавяне на обект",
      "Уебсайт за обект (mdeploy)",
      "Съобщаване за проблем",
      "Партньорство",
      "Друго"
    ],
    "placeholder": "Напишете съобщението си тук...",
    "responseLabel": "Време за отговор",
    "responseValue": "До 24 часа"
  },
  "ru": {
    "title": "Контакты",
    "subtitle": "Есть вопросы? Напишите нам, и мы скоро ответим.",
    "name": "Имя",
    "subject": "Тема",
    "message": "Сообщение",
    "send": "Отправить",
    "sending": "Отправка...",
    "successTitle": "Спасибо!",
    "successMsg": "Ваше сообщение отправлено. Мы скоро ответим.",
    "sendAnother": "Новое сообщение",
    "infoTitle": "Контактная информация",
    "locationLabel": "Местоположение",
    "locationValue": "Халкидики, Греция",
    "subjectOptions": [
      "Общий вопрос",
      "Добавить объект",
      "Сайт для объекта (mdeploy)",
      "Сообщить о проблеме",
      "Сотрудничество",
      "Другое"
    ],
    "placeholder": "Напишите здесь ваше сообщение...",
    "responseLabel": "Время ответа",
    "responseValue": "В течение 24 часов"
  },
  "ro": {
    "title": "Contact",
    "subtitle": "Aveți întrebări? Trimiteți-ne un mesaj și vă vom răspunde în curând.",
    "name": "Nume",
    "subject": "Subiect",
    "message": "Mesaj",
    "send": "Trimite",
    "sending": "Se trimite...",
    "successTitle": "Vă mulțumim!",
    "successMsg": "Mesajul a fost trimis. Vă vom răspunde în curând.",
    "sendAnother": "Mesaj nou",
    "infoTitle": "Date de contact",
    "locationLabel": "Locație",
    "locationValue": "Halkidiki, Grecia",
    "subjectOptions": [
      "Întrebare generală",
      "Adăugați o unitate de cazare",
      "Site pentru unitatea de cazare (mdeploy)",
      "Raportați o problemă",
      "Colaborare",
      "Altele"
    ],
    "placeholder": "Scrieți mesajul aici...",
    "responseLabel": "Timp de răspuns",
    "responseValue": "În 24 de ore"
  },
  "sr": {
    "title": "Kontakt",
    "subtitle": "Imate pitanja? Pošaljite nam poruku i uskoro ćemo vam odgovoriti.",
    "name": "Ime",
    "subject": "Tema",
    "message": "Poruka",
    "send": "Pošalji",
    "sending": "Slanje...",
    "successTitle": "Hvala vam!",
    "successMsg": "Vaša poruka je poslata. Uskoro ćemo vam odgovoriti.",
    "sendAnother": "Nova poruka",
    "infoTitle": "Kontakt podaci",
    "locationLabel": "Lokacija",
    "locationValue": "Halkidiki, Grčka",
    "subjectOptions": [
      "Opšte pitanje",
      "Dodavanje smeštaja",
      "Sajt za smeštaj (mdeploy)",
      "Prijava problema",
      "Saradnja",
      "Ostalo"
    ],
    "placeholder": "Ovde napišite svoju poruku...",
    "responseLabel": "Vreme odgovora",
    "responseValue": "U roku od 24 sata"
  }
};

export default function ContactClient() {
  const locale = useLocale();
  // Campaign links can arrive pre-addressed, e.g. the mass-mail template for
  // the mdeploy.gr website offer sends owners to
  // /contact?subject=…&message=… so declaring interest is one tap and the
  // reply lands in Admin → Μηνύματα already labelled.
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: params.get('subject') || '',
    message: params.get('message') || '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const texts = { email: 'Email', emailLabel: 'Email', ...(CONTACT_TEXTS[locale] ?? CONTACT_TEXTS.en) };

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
      <Breadcrumbs items={[{ label: texts.title }]} />
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
              <div className="text-sm text-gray-500">{texts.responseLabel}</div>
              <div className="text-sm font-medium text-gray-900">{texts.responseValue}</div>
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
                {form.subject && !texts.subjectOptions.includes(form.subject) && (
                  <option value={form.subject}>{form.subject}</option>
                )}
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
