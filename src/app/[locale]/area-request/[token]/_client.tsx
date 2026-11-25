'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { PhoneField } from '@/components/forms/PhoneField';
import { trackEvent } from '@/components/layout/TrafficCounter';
import type { Locale } from '@/i18n/config';

type Copy = {
  title: (where: string) => string;
  intro: (where: string, n: number) => string;
  checkIn: string; checkOut: string; guests: string; contact: string;
  phone: string; phoneNote: string; search: string;
  send: string; sending: string;
  doneTitle: string; done: string; track: string;
  already: string; past: string; invalid: string; newRequest: string;
  limit: string; error: string;
};

const COPY: Record<Locale, Copy> = {
  el: {
    title: (w) => `Ρωτήστε όλα τα καταλύματα ${w}`,
    intro: (w, n) => `Στέλνουμε το αίτημά σας σε όλους τους ιδιοκτήτες ${w} που φιλοξενούν ${n} ${n === 1 ? 'άτομο' : 'άτομα'}. Όσοι είναι διαθέσιμοι σας απαντούν με τιμή. Κλείνετε απευθείας μαζί τους, χωρίς προμήθεια.`,
    checkIn: 'Άφιξη', checkOut: 'Αναχώρηση', guests: 'Άτομα', contact: 'Στοιχεία επικοινωνίας',
    phone: 'Τηλέφωνο', phoneNote: 'Για να σας καλέσουν οι ιδιοκτήτες που είναι διαθέσιμοι.', search: 'Αναζήτηση χώρας',
    send: 'Αποστολή σε όλη την περιοχή', sending: 'Αποστολή…',
    doneTitle: 'Το αίτημά σας στάλθηκε!',
    done: 'Οι ιδιοκτήτες της περιοχής ειδοποιούνται τώρα. Θα σας στείλουμε email μόλις απαντήσει κάποιος διαθέσιμος, και όλες οι απαντήσεις φαίνονται στη σελίδα του αιτήματος.',
    track: 'Δείτε την πορεία του αιτήματος',
    already: 'Έχετε ήδη στείλει αυτό το αίτημα σε όλη την περιοχή.',
    past: 'Οι ημερομηνίες αυτού του αιτήματος έχουν περάσει.',
    invalid: 'Ο σύνδεσμος δεν ισχύει.',
    newRequest: 'Νέο αίτημα διαθεσιμότητας',
    limit: 'Έχετε ήδη στείλει αίτημα σε περιοχή τις τελευταίες 24 ώρες. Δοκιμάστε ξανά αύριο.',
    error: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
  },
  en: {
    title: (w) => `Ask every stay ${w}`,
    intro: (w, n) => `We send your request to every owner ${w} with room for ${n} ${n === 1 ? 'guest' : 'guests'}. Those who are free reply with a price. You book directly with them, with no booking fees.`,
    checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests', contact: 'Your details',
    phone: 'Phone', phoneNote: 'So owners who are free can call you.', search: 'Search country',
    send: 'Send to the whole area', sending: 'Sending…',
    doneTitle: 'Your request has been sent!',
    done: 'Owners in the area are being notified now. We will email you as soon as one who is free replies, and every answer appears on your request page.',
    track: 'Follow your request',
    already: 'You have already sent this request to the whole area.',
    past: 'The dates of this request have passed.',
    invalid: 'This link is not valid.',
    newRequest: 'New availability request',
    limit: 'You already sent an area request in the last 24 hours. Please try again tomorrow.',
    error: 'Something went wrong. Please try again.',
  },
  de: {
    title: (w) => `Alle Unterkünfte ${w} anfragen`,
    intro: (w, n) => `Wir senden Ihre Anfrage an alle Vermieter ${w}, die Platz für ${n} ${n === 1 ? 'Person' : 'Personen'} haben. Wer frei ist, antwortet Ihnen mit einem Preis. Sie buchen direkt beim Vermieter, ohne Buchungsgebühren.`,
    checkIn: 'Anreise', checkOut: 'Abreise', guests: 'Personen', contact: 'Ihre Kontaktdaten',
    phone: 'Telefon', phoneNote: 'Damit freie Vermieter Sie anrufen können.', search: 'Land suchen',
    send: 'An die ganze Gegend senden', sending: 'Wird gesendet…',
    doneTitle: 'Ihre Anfrage wurde gesendet!',
    done: 'Die Vermieter der Gegend werden jetzt benachrichtigt. Sobald ein freier Vermieter antwortet, schreiben wir Ihnen, und alle Antworten sehen Sie auf der Seite Ihrer Anfrage.',
    track: 'Anfrage verfolgen',
    already: 'Sie haben diese Anfrage bereits an die ganze Gegend gesendet.',
    past: 'Die Daten dieser Anfrage liegen in der Vergangenheit.',
    invalid: 'Dieser Link ist nicht gültig.',
    newRequest: 'Neue Verfügbarkeitsanfrage',
    limit: 'Sie haben in den letzten 24 Stunden bereits eine Anfrage gesendet. Bitte versuchen Sie es morgen erneut.',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
  },
  ro: {
    title: (w) => `Întreabă toate cazările ${w}`,
    intro: (w, n) => `Trimitem cererea ta tuturor proprietarilor ${w} care au loc pentru ${n} ${n === 1 ? 'persoană' : 'persoane'}. Cei care sunt liberi îți răspund cu un preț. Rezervi direct cu ei, fără comisioane.`,
    checkIn: 'Sosire', checkOut: 'Plecare', guests: 'Persoane', contact: 'Datele tale',
    phone: 'Telefon', phoneNote: 'Ca proprietarii liberi să te poată suna.', search: 'Caută țara',
    send: 'Trimite în toată zona', sending: 'Se trimite…',
    doneTitle: 'Cererea ta a fost trimisă!',
    done: 'Proprietarii din zonă sunt anunțați acum. Îți scriem imediat ce răspunde cineva care e liber, iar toate răspunsurile apar pe pagina cererii tale.',
    track: 'Urmărește cererea',
    already: 'Ai trimis deja această cerere în toată zona.',
    past: 'Datele acestei cereri au trecut.',
    invalid: 'Acest link nu este valid.',
    newRequest: 'Cerere nouă de disponibilitate',
    limit: 'Ai trimis deja o cerere în ultimele 24 de ore. Încearcă din nou mâine.',
    error: 'Ceva n-a mers. Încearcă din nou.',
  },
  bg: {
    title: (w) => `Попитайте всички места за настаняване ${w}`,
    intro: (w, n) => `Изпращаме запитването ви до всички собственици ${w}, които могат да настанят ${n} ${n === 1 ? 'човек' : 'души'}. Свободните ви отговарят с цена. Резервирате директно при тях, без комисиони.`,
    checkIn: 'Настаняване', checkOut: 'Напускане', guests: 'Гости', contact: 'Вашите данни',
    phone: 'Телефон', phoneNote: 'За да могат свободните собственици да ви се обадят.', search: 'Търсене на държава',
    send: 'Изпрати до целия район', sending: 'Изпращане…',
    doneTitle: 'Запитването ви е изпратено!',
    done: 'Собствениците в района получават известие сега. Ще ви пишем веднага щом отговори някой свободен, а всички отговори се виждат на страницата на запитването.',
    track: 'Проследете запитването',
    already: 'Вече сте изпратили това запитване до целия район.',
    past: 'Датите на това запитване са минали.',
    invalid: 'Тази връзка не е валидна.',
    newRequest: 'Ново запитване за наличност',
    limit: 'Вече сте изпратили запитване през последните 24 часа. Опитайте отново утре.',
    error: 'Нещо се обърка. Опитайте отново.',
  },
  sr: {
    title: (w) => `Pitajte sve smeštaje ${w}`,
    intro: (w, n) => `Šaljemo vaš upit svim vlasnicima ${w} koji imaju mesta za ${n} ${n === 1 ? 'osobu' : 'osobe'}. Oni koji su slobodni odgovaraju vam sa cenom. Rezervišete direktno kod njih, bez provizije.`,
    checkIn: 'Dolazak', checkOut: 'Odlazak', guests: 'Osobe', contact: 'Vaši podaci',
    phone: 'Telefon', phoneNote: 'Da bi vas slobodni vlasnici mogli pozvati.', search: 'Pretraga zemlje',
    send: 'Pošalji celom kraju', sending: 'Slanje…',
    doneTitle: 'Vaš upit je poslat!',
    done: 'Vlasnici iz kraja upravo dobijaju obaveštenje. Pisaćemo vam čim odgovori neko ko je slobodan, a svi odgovori se vide na stranici vašeg upita.',
    track: 'Pratite upit',
    already: 'Već ste poslali ovaj upit celom kraju.',
    past: 'Datumi ovog upita su prošli.',
    invalid: 'Ovaj link nije važeći.',
    newRequest: 'Novi upit za dostupnost',
    limit: 'Već ste poslali upit u poslednja 24 sata. Pokušajte ponovo sutra.',
    error: 'Nešto nije u redu. Pokušajte ponovo.',
  },
  ru: {
    title: (w) => `Спросить всё жильё ${w}`,
    intro: (w, n) => `Мы отправим ваш запрос всем владельцам ${w}, у которых есть место для ${n} ${n === 1 ? 'гостя' : 'гостей'}. Свободные ответят вам с ценой. Бронирование напрямую у владельца, без комиссий.`,
    checkIn: 'Заезд', checkOut: 'Выезд', guests: 'Гости', contact: 'Ваши данные',
    phone: 'Телефон', phoneNote: 'Чтобы свободные владельцы могли вам позвонить.', search: 'Поиск страны',
    send: 'Отправить всему району', sending: 'Отправка…',
    doneTitle: 'Ваш запрос отправлен!',
    done: 'Владельцы района сейчас получают уведомление. Мы напишем вам, как только ответит кто-то свободный, а все ответы видны на странице вашего запроса.',
    track: 'Следить за запросом',
    already: 'Вы уже отправили этот запрос всему району.',
    past: 'Даты этого запроса уже прошли.',
    invalid: 'Ссылка недействительна.',
    newRequest: 'Новый запрос о наличии',
    limit: 'Вы уже отправляли запрос за последние 24 часа. Попробуйте завтра.',
    error: 'Что-то пошло не так. Попробуйте ещё раз.',
  },
};

export function AreaRequestButton({
  token, locale, state, existing, needsPhone, where, summary,
}: {
  token: string;
  locale: Locale;
  state: 'ready' | 'sent' | 'past' | 'invalid';
  existing: string | null;
  needsPhone: boolean;
  where: string;
  summary: { name: string; email: string; phone: string | null; checkIn: string; checkOut: string; guests: number } | null;
}) {
  const c = COPY[locale];
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<string | null>(state === 'sent' ? existing : null);
  const prefix = locale === 'el' ? '' : `/${locale}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true); setError('');
    const phone = new FormData(e.currentTarget).get('phone');
    try {
      const res = await fetch(`/api/area-request/${encodeURIComponent(token)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.public_token) {
        if (!j.already) trackEvent('availability_request');
        setDone(j.public_token);
      } else setError(String(j.error || '').startsWith('rate_limit') ? c.limit : c.error);
    } catch { setError(c.error); }
    setSending(false);
  }

  const box = 'rounded-2xl border border-slate-200 bg-white p-6';
  if (state === 'invalid' || state === 'past') {
    return (
      <div className={`${box} text-slate-700`}>
        <p>{state === 'past' ? c.past : c.invalid}</p>
        <a href={`${prefix}/availability-request`} className="mt-4 inline-block font-semibold text-sky-700 hover:underline">{c.newRequest} →</a>
      </div>
    );
  }
  if (done) {
    return (
      <div className={`${box} text-center`}>
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h1 className="mt-3 text-xl font-bold text-slate-900">{state === 'sent' ? c.already : c.doneTitle}</h1>
        {state !== 'sent' && <p className="mt-2 text-slate-600">{c.done}</p>}
        <a href={`${prefix}/requests/${done}`} className="mt-5 inline-block rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800">{c.track}</a>
      </div>
    );
  }
  if (!summary) return null;
  return (
    <form onSubmit={submit} className={box}>
      <h1 className="text-xl font-bold text-slate-900">{c.title(where)}</h1>
      <p className="mt-2 text-slate-600">{c.intro(where, summary.guests)}</p>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm">
        <div><dt className="text-slate-500">{c.checkIn}</dt><dd className="font-semibold text-slate-900">{summary.checkIn}</dd></div>
        <div><dt className="text-slate-500">{c.checkOut}</dt><dd className="font-semibold text-slate-900">{summary.checkOut}</dd></div>
        <div><dt className="text-slate-500">{c.guests}</dt><dd className="font-semibold text-slate-900">{summary.guests}</dd></div>
        <div className="col-span-2 min-w-0"><dt className="text-slate-500">{c.contact}</dt><dd className="break-words font-semibold text-slate-900">{summary.name}<br /><span className="font-normal text-slate-600">{summary.email}{summary.phone ? ` · ${summary.phone}` : ''}</span></dd></div>
      </dl>
      {needsPhone && (
        <div className="mt-4">
          <PhoneField name="phone" label={c.phone} locale={locale} searchLabel={c.search}
            inputClassName="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
          <p className="mt-1 text-xs text-slate-500">{c.phoneNote}</p>
        </div>
      )}
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={sending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3.5 font-semibold text-white hover:bg-sky-800 disabled:opacity-60">
        {sending ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {sending ? c.sending : c.send}
      </button>
    </form>
  );
}
