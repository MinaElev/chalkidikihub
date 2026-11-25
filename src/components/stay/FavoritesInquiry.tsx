'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { PhoneField } from '@/components/forms/PhoneField';
import { trackEvent } from '@/components/layout/TrafficCounter';
import { setStayDates, useStayDates } from './stayDates';
import { saveGuestDetails, useGuestDetails } from './guestDetails';

type Copy = {
  title: string; intro: string; checkIn: string; checkOut: string; guests: string; name: string; email: string;
  phone: string; message: string; send: string; sent: string; error: string; tooMany: string; search: string;
};

/** The favourites page carries its own words (its layout ships no message catalogue). */
const COPY: Record<string, Copy> = {
  el: { title: 'Ρωτήστε όλα τα αγαπημένα σας μαζί', intro: 'Ένα αίτημα, σε όσα καταλύματα διαλέξετε. Κάθε ιδιοκτήτης θα σας απαντήσει χωριστά.', checkIn: 'Άφιξη', checkOut: 'Αναχώρηση', guests: 'Άτομα', name: 'Ονοματεπώνυμο', email: 'Email', phone: 'Τηλέφωνο (προαιρετικό)', message: 'Μήνυμα (προαιρετικό)', send: 'Αποστολή σε {count}', sent: 'Στάλθηκε! Κάθε ιδιοκτήτης θα σας απαντήσει χωριστά.', error: 'Δεν στάλθηκε. Δοκιμάστε ξανά σε λίγο.', tooMany: 'Πολλά αιτήματα σε λίγο χρόνο. Δοκιμάστε ξανά αργότερα.', search: 'Αναζήτηση' },
  en: { title: 'Ask all your favourites at once', intro: 'One request to the stays you pick. Each owner will reply to you separately.', checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests', name: 'Full name', email: 'Email', phone: 'Phone (optional)', message: 'Message (optional)', send: 'Send to {count}', sent: 'Sent! Each owner will reply to you separately.', error: 'Not sent. Please try again shortly.', tooMany: 'Too many requests in a short time. Please try again later.', search: 'Search' },
  de: { title: 'Alle Favoriten auf einmal anfragen', intro: 'Eine Anfrage an die Unterkünfte Ihrer Wahl. Jeder Vermieter antwortet Ihnen einzeln.', checkIn: 'Anreise', checkOut: 'Abreise', guests: 'Personen', name: 'Vor- und Nachname', email: 'E-Mail', phone: 'Telefon (optional)', message: 'Nachricht (optional)', send: 'An {count} senden', sent: 'Gesendet! Jeder Vermieter antwortet Ihnen einzeln.', error: 'Nicht gesendet. Bitte versuchen Sie es gleich noch einmal.', tooMany: 'Zu viele Anfragen in kurzer Zeit. Bitte später erneut versuchen.', search: 'Suchen' },
  ro: { title: 'Întreabă toate favoritele deodată', intro: 'O singură cerere către cazările pe care le alegi. Fiecare proprietar îți va răspunde separat.', checkIn: 'Sosire', checkOut: 'Plecare', guests: 'Persoane', name: 'Nume și prenume', email: 'E-mail', phone: 'Telefon (opțional)', message: 'Mesaj (opțional)', send: 'Trimite la {count}', sent: 'Trimis! Fiecare proprietar îți va răspunde separat.', error: 'Nu s-a trimis. Încearcă din nou în curând.', tooMany: 'Prea multe cereri într-un timp scurt. Încearcă mai târziu.', search: 'Caută' },
  bg: { title: 'Попитайте всички любими наведнъж', intro: 'Едно запитване до местата, които изберете. Всеки собственик ще ви отговори поотделно.', checkIn: 'Пристигане', checkOut: 'Заминаване', guests: 'Гости', name: 'Име и фамилия', email: 'Имейл', phone: 'Телефон (по желание)', message: 'Съобщение (по желание)', send: 'Изпращане до {count}', sent: 'Изпратено! Всеки собственик ще ви отговори поотделно.', error: 'Не е изпратено. Опитайте отново след малко.', tooMany: 'Твърде много запитвания за кратко време. Опитайте по-късно.', search: 'Търсене' },
  sr: { title: 'Pitajte sve omiljene odjednom', intro: 'Jedan upit za smeštaje koje izaberete. Svaki vlasnik će vam odgovoriti posebno.', checkIn: 'Dolazak', checkOut: 'Odlazak', guests: 'Osobe', name: 'Ime i prezime', email: 'Imejl', phone: 'Telefon (opciono)', message: 'Poruka (opciono)', send: 'Pošalji ({count})', sent: 'Poslato! Svaki vlasnik će vam odgovoriti posebno.', error: 'Nije poslato. Pokušajte ponovo uskoro.', tooMany: 'Previše upita za kratko vreme. Pokušajte kasnije.', search: 'Pretraga' },
  ru: { title: 'Спросите сразу все избранные', intro: 'Один запрос в выбранные варианты жилья. Каждый владелец ответит вам отдельно.', checkIn: 'Заезд', checkOut: 'Выезд', guests: 'Гости', name: 'Имя и фамилия', email: 'Эл. почта', phone: 'Телефон (необязательно)', message: 'Сообщение (необязательно)', send: 'Отправить ({count})', sent: 'Отправлено! Каждый владелец ответит вам отдельно.', error: 'Не отправлено. Попробуйте ещё раз чуть позже.', tooMany: 'Слишком много запросов за короткое время. Попробуйте позже.', search: 'Поиск' },
};

const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-200';

/**
 * Top of the favourites page: one request to several favourite stays. Dates
 * and the visitor's details come prefilled from what they used last (kept on
 * their device); all stays are ticked, and they untick the ones they don't want.
 */
export function FavoritesInquiry({
  locale, stays, accountEmail,
}: {
  locale: string;
  stays: Array<{ slug: string; title: string }>;
  accountEmail?: string;
}) {
  const c = COPY[locale] ?? COPY.en;
  const dates = useStayDates();
  const saved = useGuestDetails();
  const [chosen, setChosen] = useState<string[]>(() => stays.map((s) => s.slug));
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'limited'>('idle');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens' }).format(new Date());

  if (state === 'done') {
    return (
      <p role="status" className="mb-8 flex items-start gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />{c.sent}
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState('sending');
    try {
      const res = await fetch('/api/inquiry/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, checkIn: dates.checkIn, checkOut: dates.checkOut, slugs: chosen, locale }),
      });
      const json = (await res.json().catch(() => ({}))) as { sent?: number };
      if (res.ok) {
        for (let i = 0; i < (json.sent ?? 0); i++) trackEvent('inquiry');
        saveGuestDetails({ name: data.name ?? '', email: data.email ?? '', phone: data.phone ?? '' });
      }
      setState(res.ok ? 'done' : res.status === 429 ? 'limited' : 'error');
    } catch {
      setState('error');
    }
  }

  const setDate = (key: 'checkIn' | 'checkOut', v: string) =>
    setStayDates({ ...dates, [key]: v, ...(key === 'checkIn' && dates.checkOut && dates.checkOut <= v ? { checkOut: '' } : {}), fromCalendar: false });

  return (
    <form onSubmit={onSubmit} className="mb-8 space-y-4 rounded-2xl border border-sea-200 bg-sea-50/40 p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{c.intro}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {stays.map((s) => {
          const on = chosen.includes(s.slug);
          return (
            <li key={s.slug}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setChosen((x) => (on ? x.filter((y) => y !== s.slug) : [...x, s.slug]))}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${on ? 'border-sea-600 bg-sea-600 text-white' : 'border-slate-300 bg-white text-slate-600'}`}
              >
                {on ? '✓ ' : ''}{s.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-xs font-medium text-slate-700">
          {c.checkIn}
          <input type="date" required min={today} value={dates.checkIn} onChange={(e) => setDate('checkIn', e.target.value)} className={field} />
        </label>
        <label className="block text-xs font-medium text-slate-700">
          {c.checkOut}
          <input type="date" required min={dates.checkIn || today} value={dates.checkOut} onChange={(e) => setDate('checkOut', e.target.value)} className={field} />
        </label>
        <label className="block text-xs font-medium text-slate-700">
          {c.guests}
          <input type="number" name="guests" min={1} max={30} defaultValue={2} required className={field} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-slate-700">
          {c.name}
          <input name="name" autoComplete="name" required maxLength={120} className={field} value={name ?? saved?.name ?? ''} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-xs font-medium text-slate-700">
          {c.email}
          <input type="email" name="email" autoComplete="email" required maxLength={200} className={field} value={email ?? saved?.email ?? accountEmail ?? ''} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>
      <PhoneField name="phone" label={c.phone} locale={locale} inputClassName={field} searchLabel={c.search} defaultValue={saved?.phone} />
      <label className="block text-xs font-medium text-slate-700">
        {c.message}
        <textarea name="message" rows={2} maxLength={2000} className={field} />
      </label>
      <button
        type="submit"
        disabled={!chosen.length || state === 'sending'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sea-600 px-4 py-3 font-semibold text-white hover:bg-sea-700 disabled:opacity-50"
      >
        {state === 'sending' ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {c.send.replace('{count}', String(chosen.length))}
      </button>
      {(state === 'error' || state === 'limited') && <p role="alert" className="text-sm text-red-700">{state === 'limited' ? c.tooMany : c.error}</p>}
    </form>
  );
}
