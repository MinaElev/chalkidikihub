import 'server-only';
import { htmlLang, isLocale, type Locale } from '@/i18n/config';
import { emailLayout, escapeHtml, sendMail } from '@/lib/email/mailer';
import { formatPrice } from '@/lib/content/format';
import { SITE_URL } from '@/lib/inquiry';

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
  },
};

const localePath = (locale: Locale, path: string) => `${SITE_URL}${locale === 'el' ? '' : `/${locale}`}${path}`;

export async function mailGuestReply(o: {
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
}): Promise<boolean> {
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
      : o.stays?.length
        ? `<p>${c.noMore}</p>${stayCardsHtml(locale, o.stays, o.checkIn, o.checkOut, FOLLOW[locale].cta)}`
        : `<p>${c.noMore}</p><p><a href="${localePath(locale, '/listings')}" style="${btn}">${c.ctaNo}</a></p>`}`;
  return sendMail({
    to: o.guestEmail,
    ...(o.ownerEmail ? { replyTo: o.ownerEmail } : {}),
    subject: c.subject(o.listingName, o.available),
    html: emailLayout(c.subject(o.listingName, o.available), body),
  });
}

// ── Free stays, for the guest whose owner said no or hasn't answered ───────

type Stay = { slug: string; name: string; image: string | null; price: string | null; guests: string };

/** Stay cards linking to each listing with the guest's dates prefilled (?in=&out=). */
export function stayCardsHtml(locale: Locale, stays: Stay[], checkIn: string | null, checkOut: string | null, cta: string): string {
  const q = checkIn && checkOut ? `?in=${checkIn}&out=${checkOut}` : '';
  return stays
    .map((s) => {
      const href = `${localePath(locale, `/listings/${s.slug}`)}${q}#inquiry`;
      const img = s.image ? `<img src="${SITE_URL}${s.image}" alt="" width="96" height="72" style="width:96px;height:72px;object-fit:cover;border-radius:8px;display:block">` : '';
      return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:10px 0;border:1px solid #e2e8f0;border-radius:12px"><tr>
        ${img ? `<td style="padding:10px;width:96px">${img}</td>` : ''}
        <td style="padding:10px;vertical-align:top">
          <strong style="color:#0f172a">${escapeHtml(s.name)}</strong><br>
          <span style="color:#64748b;font-size:13px">${escapeHtml([s.guests, s.price].filter(Boolean).join(' · '))}</span><br>
          <a href="${href}" style="display:inline-block;margin-top:8px;color:#0369a1;font-weight:600;text-decoration:none">${cta} →</a>
        </td></tr></table>`;
    })
    .join('');
}

const FOLLOW: Record<Locale, { subject: (dates: string) => string; intro: (name: string) => string; cta: string }> = {
  el: {
    subject: (d) => `Ψάχνετε ακόμα κατάλυμα ${d}; Αυτά είναι ελεύθερα`,
    intro: (n) => `Ο ιδιοκτήτης του <strong>${n}</strong> δεν έχει απαντήσει ακόμα στο αίτημά σας. Αν απαντήσει, θα το δείτε στο email σας. Στο μεταξύ, αυτά τα καταλύματα της ίδιας περιοχής είναι ελεύθερα τις ημερομηνίες σας:`,
    cta: 'Ζητήστε διαθεσιμότητα',
  },
  en: {
    subject: (d) => `Still looking for a stay ${d}? These are free`,
    intro: (n) => `The owner of <strong>${n}</strong> hasn't replied to your request yet. If they do, you'll see it in your inbox. Meanwhile, these stays in the same area are free on your dates:`,
    cta: 'Ask about availability',
  },
  de: {
    subject: (d) => `Noch auf der Suche nach einer Unterkunft ${d}? Diese sind frei`,
    intro: (n) => `Der Vermieter von <strong>${n}</strong> hat auf Ihre Anfrage noch nicht geantwortet. Sobald er antwortet, finden Sie die Antwort in Ihrem Postfach. In der Zwischenzeit sind diese Unterkünfte in derselben Gegend in Ihrem Zeitraum frei:`,
    cta: 'Verfügbarkeit anfragen',
  },
  ro: {
    subject: (d) => `Încă îți cauți cazare ${d}? Acestea sunt libere`,
    intro: (n) => `Proprietarul locuinței <strong>${n}</strong> nu ți-a răspuns încă. Dacă îți răspunde, vei vedea mesajul în e-mail. Între timp, aceste cazări din aceeași zonă sunt libere în perioada aleasă:`,
    cta: 'Cere disponibilitatea',
  },
  bg: {
    subject: (d) => `Още търсите настаняване ${d}? Тези места са свободни`,
    intro: (n) => `Собственикът на <strong>${n}</strong> все още не е отговорил на запитването ви. Ако отговори, ще го видите в имейла си. Междувременно тези места в същия район са свободни за вашите дати:`,
    cta: 'Попитайте за наличност',
  },
  sr: {
    subject: (d) => `Još tražite smeštaj ${d}? Ovi su slobodni`,
    intro: (n) => `Vlasnik smeštaja <strong>${n}</strong> još nije odgovorio na vaš upit. Ako odgovori, videćete to u svom imejlu. U međuvremenu, ovi smeštaji u istom kraju su slobodni za vaše datume:`,
    cta: 'Pitajte za dostupnost',
  },
  ru: {
    subject: (d) => `Всё ещё ищете жильё ${d}? Эти варианты свободны`,
    intro: (n) => `Владелец <strong>${n}</strong> пока не ответил на ваш запрос. Если он ответит, письмо придёт вам на почту. А пока — эти варианты в том же районе свободны на ваши даты:`,
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
}): Promise<boolean> {
  const locale: Locale = isLocale(o.locale) ? o.locale : 'en';
  const f = FOLLOW[locale];
  const subject = f.subject(datesPhrase(locale, o.checkIn, o.checkOut));
  return sendMail({
    to: o.guestEmail,
    subject,
    html: emailLayout(
      subject,
      `<p>${COPY[locale].hello(escapeHtml(o.guestName))}</p>
       <p>${f.intro(escapeHtml(o.listingName))}</p>
       ${stayCardsHtml(locale, o.stays, o.checkIn, o.checkOut, f.cta)}`,
    ),
  });
}
