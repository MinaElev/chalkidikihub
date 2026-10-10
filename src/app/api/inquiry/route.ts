import { NextResponse, type NextRequest } from 'next/server';
import { adminDb } from '@/lib/supabase/clients';
import { allowRequest } from '@/lib/rate-limit';
import { emailLayout, escapeHtml, sendMail } from '@/lib/email/mailer';
import { isLocale } from '@/i18n/config';

/**
 * POST /api/inquiry — a visitor asks an owner about availability.
 * Guard: public form → honeypot + per-IP rate limit (5 per 30 min) + strict
 * validation. The owner's address is looked up server-side; nothing the
 * client sends decides who receives the email.
 *
 * Stored in contact_messages with v3's exact subject/body format, so owners'
 * existing inbox (and its read state in inquiry_reads) keeps working.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  // Bots fill every field, people never see this one.
  if (clip(body.website, 200)) return NextResponse.json({ ok: true });

  const slug = clip(body.slug, 200).replace(/[^a-z0-9-]/g, '');
  const name = clip(body.name, 120);
  const email = clip(body.email, 200).replace(/[\r\n]/g, '');
  const phone = clip(body.phone, 30).replace(/[^\d+()\s-]/g, '');
  const message = clip(body.message, 2000);
  const checkIn = clip(body.checkIn, 10);
  const checkOut = clip(body.checkOut, 10);
  const guests = Math.min(Math.max(Number(body.guests) || 0, 1), 30);
  const locale = isLocale(clip(body.locale, 5)) ? clip(body.locale, 5) : 'el';

  if (!slug || !name || !EMAIL.test(email) || (checkIn && !DATE.test(checkIn)) || (checkOut && !DATE.test(checkOut))) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  if (checkIn && checkOut && checkOut <= checkIn) return NextResponse.json({ error: 'invalid-dates' }, { status: 400 });

  if (!(await allowRequest(request, 'inquiry', 5, 30))) {
    return NextResponse.json({ error: 'too-many' }, { status: 429 });
  }

  const db = adminDb();
  const { data: listing } = await db
    .from('listings')
    .select('id, slug, title_el, owner_id, contact_email, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (!listing) return NextResponse.json({ error: 'not-found' }, { status: 404 });

  const title = listing.title_el || slug;
  const { error } = await db.from('contact_messages').insert({
    name,
    email,
    subject: `Αίτημα διαθεσιμότητας: ${title}`,
    message: `Κατάλυμα: ${title} (${slug})\nCheck-in: ${checkIn || '-'}\nCheck-out: ${checkOut || '-'}\nΆτομα: ${guests}\nΤηλέφωνο: ${phone || '-'}\n\n${message}`,
    locale,
  });
  if (error) return NextResponse.json({ error: 'store-failed' }, { status: 500 });

  const { data: owner } = await db.from('profiles').select('email, full_name').eq('id', listing.owner_id).maybeSingle();
  const to = owner?.email || listing.contact_email;
  if (to) {
    const nights =
      checkIn && checkOut ? Math.round((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000) : null;
    const rows = [
      ['Κατάλυμα', title],
      ['Άφιξη', checkIn || '-'],
      ['Αναχώρηση', checkOut || '-'],
      ...(nights ? [['Βράδια', String(nights)]] : []),
      ['Άτομα', String(guests)],
      ['Όνομα', name],
      ['Email', email],
      ['Τηλέφωνο', phone || '-'],
      ['Γλώσσα επισκέπτη', locale.toUpperCase()],
    ];
    await sendMail({
      to,
      replyTo: email,
      subject: `Νέο αίτημα διαθεσιμότητας — ${title}`,
      html: emailLayout(
        'Νέο αίτημα διαθεσιμότητας',
        `<p>${owner?.full_name ? `Γεια σας, ${escapeHtml(owner.full_name)}.` : 'Γεια σας,'}</p>
         <p>Ένας επισκέπτης ρώτησε για διαθεσιμότητα μέσω του ChalkidikiHub. Απαντήστε απευθείας σε αυτό το email.</p>
         <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px">${rows
           .map(([k, v]) => `<tr><td style="color:#64748b;width:40%">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
           .join('')}</table>
         ${message ? `<p style="margin-top:16px;padding:12px;background:#f1f5f9;border-radius:8px">${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : ''}`,
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
