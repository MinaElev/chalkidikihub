import 'server-only';
import { htmlLang, isLocale, type Locale } from '@/i18n/config';
import { emailLayout, escapeHtml, sendMail } from '@/lib/email/mailer';
import { formatPrice } from '@/lib/content/format';
import { SITE_URL } from '@/lib/inquiry';
import { AREA_OF } from '@/lib/content/place-names';

/**
 * The owner's one-click answer to a listing request, mailed to the guest in
 * the language they used on the site. Replies go straight to the owner.
 */

type Copy = {
  subject: (name: string, yes: boolean) => string;
  hello: (n: string) => string;
  yes: (name: string, dates: string) => string;
  no: (name: string, dates: string) => string;
  dates: (a: string, b: string) => string;
  price: string;
  ownerMessage: string;
  replyHint: string;
  ctaYes: string;
  noMore: string;
  ctaNo: string;
  /** The whole-area box: title, text, button (where = "of Sithonia"). */
  areaTitle: (where: string) => string;
  areaText: string;
  areaCta: string;
  /** Above area stays whose calendars we don't know: never "free". */
  others: (where: string) => string;
  ask: string;
};

const COPY: Record<Locale, Copy> = {
  el: {
    subject: (n, yes) => (yes ? `${n}: είναι διαθέσιμο για τις ημερομηνίες σας` : `${n}: δεν είναι διαθέσιμο για τις ημερομηνίες σας`),
    hello: (n) => `Γεια σας ${n},`,
    yes: (n, d) => `Καλά νέα! Ο ιδιοκτήτης του <strong>${n}</strong> επιβεβαίωσε ότι το κατάλυμα είναι διαθέσιμο ${d}.`,
    no: (n, d) => `Δυστυχώς ο ιδιοκτήτης του <strong>${n}</strong> μας ενημέρωσε ότι το κατάλυμα δεν είναι διαθέσιμο ${d}.`,
    dates: (a, b) => `από ${a} έως ${b}`,
    price: 'Τιμή για τη διαμονή σας',
    ownerMessage: 'Μήνυμα από τον ιδιοκτήτη',
    replyHint: 'Απαντήστε σε αυτό το email για να μιλήσετε απευθείας με τον ιδιοκτήτη. Κλείνετε και πληρώνετε απευθείας σε εκείνον, χωρίς προμήθεια.',
    ctaYes: 'Δείτε το κατάλυμα',
    noMore: 'Άλλα καταλύματα στη Χαλκιδική είναι ακόμα ελεύθερα τις ημερομηνίες σας.',
    ctaNo: 'Δείτε άλλα καταλύματα',
    areaTitle: (w) => `Ρωτήστε με ένα κλικ όλα τα καταλύματα ${w}`,
    areaText: 'Στέλνουμε το ίδιο αίτημα, με τις ίδιες ημερομηνίες, σε όλους τους ιδιοκτήτες της περιοχής. Όσοι είναι διαθέσιμοι σας απαντούν με τιμή.',
    areaCta: 'Αίτημα σε όλη την περιοχή',
    others: (w) => `Μερικά ακόμα καταλύματα ${w}:`,
    ask: 'Ζητήστε διαθεσιμότητα',
  },
  en: {
    subject: (n, yes) => (yes ? `${n} is available for your dates` : `${n} is not available for your dates`),
    hello: (n) => `Hello ${n},`,
    yes: (n, d) => `Good news! The owner of <strong>${n}</strong> has confirmed it is available ${d}.`,
    no: (n, d) => `Unfortunately, the owner of <strong>${n}</strong> has let us know it is not available ${d}.`,
    dates: (a, b) => `from ${a} to ${b}`,
    price: 'Price for your stay',
    ownerMessage: 'Message from the owner',
    replyHint: 'Reply to this email to talk to the owner directly. You book and pay the owner directly, with no booking fees.',
    ctaYes: 'View the property',
    noMore: 'Other stays in Chalkidiki are still free on your dates.',
    ctaNo: 'See other stays',
    areaTitle: (w) => `Ask every stay ${w} in one click`,
    areaText: 'We send the same request, with the same dates, to every owner in the area. Those who are free reply with a price.',
    areaCta: 'Ask the whole area',
    others: (w) => `A few more stays ${w}:`,
    ask: 'Ask about availability',
  },
  de: {
    subject: (n, yes) => (yes ? `${n} ist für Ihren Zeitraum verfügbar` : `${n} ist für Ihren Zeitraum leider nicht verfügbar`),
    hello: (n) => `Hallo ${n},`,
    yes: (n, d) => `Gute Nachrichten! Der Vermieter von <strong>${n}</strong> hat bestätigt, dass die Unterkunft ${d} verfügbar ist.`,
    no: (n, d) => `Leider hat uns der Vermieter von <strong>${n}</strong> mitgeteilt, dass die Unterkunft ${d} nicht verfügbar ist.`,
    dates: (a, b) => `vom ${a} bis ${b}`,
    price: 'Preis für Ihren Aufenthalt',
    ownerMessage: 'Nachricht des Vermieters',
    replyHint: 'Antworten Sie einfach auf diese E-Mail, um direkt mit dem Vermieter zu sprechen. Sie buchen und bezahlen direkt beim Vermieter, ohne Buchungsgebühren.',
    ctaYes: 'Unterkunft ansehen',
    noMore: 'Andere Unterkünfte auf Chalkidiki sind in Ihrem Zeitraum noch frei.',
    ctaNo: 'Weitere Unterkünfte ansehen',
    areaTitle: (w) => `Alle Unterkünfte ${w} mit einem Klick anfragen`,
    areaText: 'Wir senden dieselbe Anfrage mit denselben Daten an alle Vermieter der Gegend. Wer frei ist, antwortet Ihnen mit einem Preis.',
    areaCta: 'Die ganze Gegend anfragen',
    others: (w) => `Weitere Unterkünfte ${w}:`,
    ask: 'Verfügbarkeit anfragen',
  },
  ro: {
    subject: (n, yes) => (yes ? `${n}: disponibil în perioada aleasă` : `${n}: indisponibil în perioada aleasă`),
    hello: (n) => `Bună, ${n},`,
    yes: (n, d) => `Vești bune! Proprietarul locuinței <strong>${n}</strong> a confirmat că este disponibilă ${d}.`,
    no: (n, d) => `Din păcate, proprietarul locuinței <strong>${n}</strong> ne-a anunțat că nu este disponibilă ${d}.`,
    dates: (a, b) => `între ${a} și ${b}`,
    price: 'Prețul sejurului tău',
    ownerMessage: 'Mesaj de la proprietar',
    replyHint: 'Răspunde la acest e-mail ca să vorbești direct cu proprietarul. Rezervi și plătești direct proprietarului, fără comisioane.',
    ctaYes: 'Vezi locuința',
    noMore: 'Alte cazări din Halkidiki sunt încă libere în perioada aleasă.',
    ctaNo: 'Vezi alte cazări',
    areaTitle: (w) => `Întreabă cu un clic toate cazările ${w}`,
    areaText: 'Trimitem aceeași cerere, cu aceleași date, tuturor proprietarilor din zonă. Cei care sunt liberi îți răspund cu un preț.',
    areaCta: 'Întreabă toată zona',
    others: (w) => `Alte câteva cazări ${w}:`,
    ask: 'Cere disponibilitatea',
  },
  bg: {
    subject: (n, yes) => (yes ? `${n}: свободно за вашите дати` : `${n}: не е свободно за вашите дати`),
    hello: (n) => `Здравейте, ${n},`,
    yes: (n, d) => `Добри новини! Собственикът на <strong>${n}</strong> потвърди, че мястото за настаняване е свободно ${d}.`,
    no: (n, d) => `За съжаление собственикът на <strong>${n}</strong> ни уведоми, че мястото за настаняване не е свободно ${d}.`,
    dates: (a, b) => `от ${a} до ${b}`,
    price: 'Цена за престоя ви',
    ownerMessage: 'Съобщение от собственика',
    replyHint: 'Отговорете на този имейл, за да говорите директно със собственика. Резервирате и плащате директно на него, без комисиони.',
    ctaYes: 'Вижте мястото за настаняване',
    noMore: 'Други места за настаняване в Халкидики все още са свободни за вашите дати.',
    ctaNo: 'Вижте други места',
    areaTitle: (w) => `Попитайте с едно щракване всички места за настаняване ${w}`,
    areaText: 'Изпращаме същото запитване, със същите дати, до всички собственици в района. Свободните ви отговарят с цена.',
    areaCta: 'Попитайте целия район',
    others: (w) => `Още няколко места за настаняване ${w}:`,
    ask: 'Попитайте за наличност',
  },
  sr: {
    subject: (n, yes) => (yes ? `${n}: slobodno za vaše datume` : `${n}: nije slobodno za vaše datume`),
    hello: (n) => `Zdravo, ${n},`,
    yes: (n, d) => `Dobre vesti! Vlasnik smeštaja <strong>${n}</strong> je potvrdio da je smeštaj slobodan ${d}.`,
    no: (n, d) => `Nažalost, vlasnik smeštaja <strong>${n}</strong> nas je obavestio da smeštaj nije slobodan ${d}.`,
    dates: (a, b) => `od ${a} do ${b}`,
    price: 'Cena za vaš boravak',
    ownerMessage: 'Poruka vlasnika',
    replyHint: 'Odgovorite na ovaj imejl da biste razgovarali direktno sa vlasnikom. Rezervišete i plaćate direktno vlasniku, bez provizije.',
    ctaYes: 'Pogledajte smeštaj',
    noMore: 'Drugi smeštaji na Halkidikiju su još slobodni za vaše datume.',
    ctaNo: 'Pogledajte druge smeštaje',
    areaTitle: (w) => `Pitajte jednim klikom sve smeštaje ${w}`,
    areaText: 'Šaljemo isti upit, sa istim datumima, svim vlasnicima u kraju. Oni koji su slobodni odgovaraju vam sa cenom.',
    areaCta: 'Pitajte ceo kraj',
    others: (w) => `Još nekoliko smeštaja ${w}:`,
    ask: 'Pitajte za dostupnost',
  },
  ru: {
    subject: (n, yes) => (yes ? `${n}: свободно на ваши даты` : `${n}: занято на ваши даты`),
    hello: (n) => `Здравствуйте, ${n}!`,
    yes: (n, d) => `Хорошие новости! Владелец <strong>${n}</strong> подтвердил, что жильё свободно ${d}.`,
    no: (n, d) => `К сожалению, владелец <strong>${n}</strong> сообщил, что жильё занято ${d}.`,
    dates: (a, b) => `с ${a} по ${b}`,
    price: 'Стоимость проживания',
    ownerMessage: 'Сообщение от владельца',
    replyHint: 'Ответьте на это письмо, чтобы связаться с владельцем напрямую. Бронирование и оплата — напрямую у владельца, без комиссий.',
    ctaYes: 'Посмотреть жильё',
    noMore: 'Другие варианты жилья на Халкидиках ещё свободны на ваши даты.',
    ctaNo: 'Посмотреть другие варианты',
    areaTitle: (w) => `Спросите всё жильё ${w} одним нажатием`,
    areaText: 'Мы отправим тот же запрос, на те же даты, всем владельцам района. Свободные ответят вам с ценой.',
    areaCta: 'Спросить весь район',
    others: (w) => `Ещё несколько вариантов жилья ${w}:`,
    ask: 'Узнать о наличии',
  },
};

const localePath = (locale: Locale, path: string) => `${SITE_URL}${locale === 'el' ? '' : `/${locale}`}${path}`;

type GuestReply = {
  guestEmail: string;
  guestName: string;
  locale: string;
  ownerEmail: string | null;
  listingName: string;
  listingSlug: string;
  checkIn: string | null;
  checkOut: string | null;
  available: boolean;
  price: number | null;
  message: string;
  /** Other stays free on the same dates, shown when the answer is no. */
  stays?: Stay[];
  /** When none is known to be free: other stays in the area (calendars unknown). */
  others?: Stay[];
  /** "Ask the whole area" link, when the answer is no. */
  invite?: AreaLink | null;
};

export async function mailGuestReply(o: GuestReply): Promise<boolean> {
  const m = guestReplyMail(o);
  return sendMail({ to: o.guestEmail, ...(o.ownerEmail ? { replyTo: o.ownerEmail } : {}), ...m });
}

/** The guest's email, built but not sent (also used for previews). */
export function guestReplyMail(o: GuestReply): { subject: string; html: string } {
  const locale: Locale = isLocale(o.locale) ? o.locale : 'en';
  const c = COPY[locale];
  const fmt = new Intl.DateTimeFormat(htmlLang[locale], { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const dates = o.checkIn && o.checkOut ? c.dates(fmt.format(new Date(o.checkIn)), fmt.format(new Date(o.checkOut))) : '';
  const name = escapeHtml(o.listingName);
  const btn = 'display:inline-block;margin-top:16px;padding:12px 22px;border-radius:10px;background:#0369a1;color:#fff;font-weight:600;text-decoration:none';
  const body = `
    <p>${c.hello(escapeHtml(o.guestName))}</p>
    <p>${o.available ? c.yes(name, dates) : c.no(name, dates)}</p>
    ${o.available && o.price ? `<p style="padding:12px;background:#ecfdf5;border-radius:8px"><span style="color:#64748b">${c.price}:</span> <strong>${escapeHtml(formatPrice(o.price, locale))}</strong></p>` : ''}
    ${o.message ? `<p style="margin:0 0 4px;color:#64748b">${c.ownerMessage}:</p><p style="margin-top:0;padding:12px;background:#f1f5f9;border-radius:8px">${escapeHtml(o.message).replace(/\n/g, '<br>')}</p>` : ''}
    ${o.available
      ? `<p>${c.replyHint}</p><p><a href="${localePath(locale, `/listings/${o.listingSlug}`)}" style="${btn}">${c.ctaYes}</a></p>`
      : alternativesHtml(locale, o, btn)}`;
  return { subject: c.subject(o.listingName, o.available), html: emailLayout(c.subject(o.listingName, o.available), body) };
}

// ── Free stays, for the guest whose owner said no or hasn't answered ───────

export type AreaLink = { url: string; area: string };

/** The big "ask every stay in the area" box: the guest's next step in one click. */
function areaBoxHtml(locale: Locale, invite: AreaLink): string {
  const c = COPY[locale];
  const where = AREA_OF[invite.area as keyof typeof AREA_OF]?.[locale] ?? '';
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0;background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px"><tr><td style="padding:16px 18px">
    <strong style="font-size:16px;color:#0c4a6e">${escapeHtml(c.areaTitle(where))}</strong>
    <p style="margin:6px 0 0;color:#334155">${c.areaText}</p>
    <a href="${invite.url}" style="display:inline-block;margin-top:12px;padding:12px 22px;border-radius:10px;background:#0369a1;color:#fff;font-weight:700;text-decoration:none">${c.areaCta} →</a>
  </td></tr></table>`;
}

/**
 * What a guest without a stay sees next: the whole-area box, then stays that
 * are free on their dates, or else other stays in the area with photos (never
 * called free, since their calendars aren't known), or else a link to all stays.
 */
function alternativesHtml(locale: Locale, o: { stays?: Stay[]; others?: Stay[]; invite?: AreaLink | null; checkIn: string | null; checkOut: string | null }, btn: string): string {
  const c = COPY[locale];
  const where = o.invite ? AREA_OF[o.invite.area as keyof typeof AREA_OF]?.[locale] ?? '' : '';
  const box = o.invite ? areaBoxHtml(locale, o.invite) : '';
  if (o.stays?.length) return `${box}<p>${c.noMore}</p>${stayCardsHtml(locale, o.stays, o.checkIn, o.checkOut, c.ask)}`;
  if (o.others?.length) return `${box}<p>${escapeHtml(where ? c.others(where) : c.ctaNo)}</p>${stayCardsHtml(locale, o.others, o.checkIn, o.checkOut, c.ask)}`;
  return `${box}<p><a href="${localePath(locale, '/listings')}" style="${box ? btn.replace('background:#0369a1;color:#fff', 'background:#f1f5f9;color:#0f172a') : btn}">${c.ctaNo}</a></p>`;
}

type Stay = { slug: string; name: string; image: string | null; price: string | null; guests: string };

/** Stay cards linking to each listing with the guest's dates prefilled (?in=&out=). */
export function stayCardsHtml(locale: Locale, stays: Stay[], checkIn: string | null, checkOut: string | null, cta: string): string {
  const q = checkIn && checkOut ? `?in=${checkIn}&out=${checkOut}` : '';
  return stays
    .map((s) => {
      const href = `${localePath(locale, `/listings/${s.slug}`)}${q}#inquiry`;
      const img = s.image ? `<img src="${SITE_URL}${s.image}" alt="" width="128" height="96" style="width:128px;height:96px;object-fit:cover;border-radius:8px;display:block">` : '';
      return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:10px 0;border:1px solid #e2e8f0;border-radius:12px"><tr>
        ${img ? `<td style="padding:10px;width:128px">${img}</td>` : ''}
        <td style="padding:10px;vertical-align:top">
          <strong style="color:#0f172a">${escapeHtml(s.name)}</strong><br>
          <span style="color:#64748b;font-size:13px">${escapeHtml([s.guests, s.price].filter(Boolean).join(' · '))}</span><br>
          <a href="${href}" style="display:inline-block;margin-top:8px;color:#0369a1;font-weight:600;text-decoration:none">${cta} →</a>
        </td></tr></table>`;
    })
    .join('');
}

/** pending = the same news without "these are free", for when none is known to be free. */
const FOLLOW: Record<Locale, { subject: (dates: string) => string; intro: (name: string) => string; pending: (name: string) => string; cta: string }> = {
  el: {
    subject: (d) => `Ψάχνετε ακόμα κατάλυμα ${d}; Αυτά είναι ελεύθερα`,
    intro: (n) => `Ο ιδιοκτήτης του <strong>${n}</strong> δεν έχει απαντήσει ακόμα στο αίτημά σας. Αν απαντήσει, θα το δείτε στο email σας. Στο μεταξύ, αυτά τα καταλύματα της ίδιας περιοχής είναι ελεύθερα τις ημερομηνίες σας:`,
    pending: (n) => `Ο ιδιοκτήτης του <strong>${n}</strong> δεν έχει απαντήσει ακόμα στο αίτημά σας. Αν απαντήσει, θα το δείτε στο email σας.`,
    cta: 'Ζητήστε διαθεσιμότητα',
  },
  en: {
    subject: (d) => `Still looking for a stay ${d}? These are free`,
    intro: (n) => `The owner of <strong>${n}</strong> hasn't replied to your request yet. If they do, you'll see it in your inbox. Meanwhile, these stays in the same area are free on your dates:`,
    pending: (n) => `The owner of <strong>${n}</strong> hasn't replied to your request yet. If they do, you'll see it in your inbox.`,
    cta: 'Ask about availability',
  },
  de: {
    subject: (d) => `Noch auf der Suche nach einer Unterkunft ${d}? Diese sind frei`,
    intro: (n) => `Der Vermieter von <strong>${n}</strong> hat auf Ihre Anfrage noch nicht geantwortet. Sobald er antwortet, finden Sie die Antwort in Ihrem Postfach. In der Zwischenzeit sind diese Unterkünfte in derselben Gegend in Ihrem Zeitraum frei:`,
    pending: (n) => `Der Vermieter von <strong>${n}</strong> hat auf Ihre Anfrage noch nicht geantwortet. Sobald er antwortet, finden Sie die Antwort in Ihrem Postfach.`,
    cta: 'Verfügbarkeit anfragen',
  },
  ro: {
    subject: (d) => `Încă îți cauți cazare ${d}? Acestea sunt libere`,
    intro: (n) => `Proprietarul locuinței <strong>${n}</strong> nu ți-a răspuns încă. Dacă îți răspunde, vei vedea mesajul în e-mail. Între timp, aceste cazări din aceeași zonă sunt libere în perioada aleasă:`,
    pending: (n) => `Proprietarul locuinței <strong>${n}</strong> nu ți-a răspuns încă. Dacă îți răspunde, vei vedea mesajul în e-mail.`,
    cta: 'Cere disponibilitatea',
  },
  bg: {
    subject: (d) => `Още търсите настаняване ${d}? Тези места са свободни`,
    intro: (n) => `Собственикът на <strong>${n}</strong> все още не е отговорил на запитването ви. Ако отговори, ще го видите в имейла си. Междувременно тези места в същия район са свободни за вашите дати:`,
    pending: (n) => `Собственикът на <strong>${n}</strong> все още не е отговорил на запитването ви. Ако отговори, ще го видите в имейла си.`,
    cta: 'Попитайте за наличност',
  },
  sr: {
    subject: (d) => `Još tražite smeštaj ${d}? Ovi su slobodni`,
    intro: (n) => `Vlasnik smeštaja <strong>${n}</strong> još nije odgovorio na vaš upit. Ako odgovori, videćete to u svom imejlu. U međuvremenu, ovi smeštaji u istom kraju su slobodni za vaše datume:`,
    pending: (n) => `Vlasnik smeštaja <strong>${n}</strong> još nije odgovorio na vaš upit. Ako odgovori, videćete to u svom imejlu.`,
    cta: 'Pitajte za dostupnost',
  },
  ru: {
    subject: (d) => `Всё ещё ищете жильё ${d}? Эти варианты свободны`,
    intro: (n) => `Владелец <strong>${n}</strong> пока не ответил на ваш запрос. Если он ответит, письмо придёт вам на почту. А пока — эти варианты в том же районе свободны на ваши даты:`,
    pending: (n) => `Владелец <strong>${n}</strong> пока не ответил на ваш запрос. Если он ответит, письмо придёт вам на почту.`,
    cta: 'Узнать о наличии',
  },
};

function datesPhrase(locale: Locale, checkIn: string | null, checkOut: string | null): string {
  const fmt = new Intl.DateTimeFormat(htmlLang[locale], { day: 'numeric', month: 'long', timeZone: 'UTC' });
  return checkIn && checkOut ? COPY[locale].dates(fmt.format(new Date(checkIn)), fmt.format(new Date(checkOut))) : '';
}

/** 48 hours without an answer: other stays free on the guest's dates. */
export async function mailGuestFollowup(o: {
  guestEmail: string;
  guestName: string;
  locale: string;
  listingName: string;
  checkIn: string | null;
  checkOut: string | null;
  stays: Stay[];
  others?: Stay[];
  invite?: AreaLink | null;
}): Promise<boolean> {
  const locale: Locale = isLocale(o.locale) ? o.locale : 'en';
  const f = FOLLOW[locale];
  if (!o.stays.length && !o.invite) return false;
  const subject = o.stays.length ? f.subject(datesPhrase(locale, o.checkIn, o.checkOut)) : COPY[locale].areaTitle(o.invite ? AREA_OF[o.invite.area as keyof typeof AREA_OF]?.[locale] ?? '' : '').replace(/<[^>]+>/g, '');
  return sendMail({
    to: o.guestEmail,
    subject,
    html: emailLayout(
      subject,
      `<p>${COPY[locale].hello(escapeHtml(o.guestName))}</p>
       ${o.stays.length
         ? `${o.invite ? `<p>${f.pending(escapeHtml(o.listingName))}</p>${areaBoxHtml(locale, o.invite)}<p>${COPY[locale].noMore}</p>` : `<p>${f.intro(escapeHtml(o.listingName))}</p>`}${stayCardsHtml(locale, o.stays, o.checkIn, o.checkOut, f.cta)}`
         : `<p>${f.pending(escapeHtml(o.listingName))}</p>${alternativesHtml(locale, { others: o.others, invite: o.invite, checkIn: o.checkIn, checkOut: o.checkOut }, 'display:inline-block;margin-top:16px;padding:12px 22px;border-radius:10px;background:#0369a1;color:#fff;font-weight:600;text-decoration:none')}`}`,
    ),
  });
}
