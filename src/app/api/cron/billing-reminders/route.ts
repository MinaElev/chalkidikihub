// Guard: Vercel cron bearer secret.
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createAdminClient } from '@/lib/api-helpers';
import { ANNUAL_PLAN } from '@/lib/billing';

export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const ADMIN_EMAIL = 'mnc@hotmail.gr';
const GRACE_DAYS = 30;          // past_due window before archiving
const REMIND_WITHIN_DAYS = 30;  // start reminding this many days before expiry
const REMIND_COOLDOWN_DAYS = 10; // don't re-remind more often than this

function escapeHtml(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
const DAY = 86400000;

type Row = {
  id: string; title_el: string | null; owner_id: string | null;
  plan_status: string; plan_expires_at: string | null; renewal_reminded_at: string | null;
};

/**
 * Daily billing lifecycle cron:
 *   • active + ≤30 days to expiry → renewal reminder email (cooldown-guarded)
 *   • active + expired            → plan_status 'past_due' (grace begins)
 *   • past_due + grace elapsed    → archive listing + plan_status 'expired'
 * All renewals target 90€/έτος; owners renew from /dashboard/billing.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const now = Date.now();

    const { data: rows } = await supabase
      .from('listings')
      .select('id, title_el, owner_id, plan_status, plan_expires_at, renewal_reminded_at')
      .in('plan_status', ['active', 'past_due'])
      .not('plan_expires_at', 'is', null);
    const listings = (rows as Row[]) || [];

    // Email transport (best-effort; lifecycle transitions still run without it).
    const { data: settings } = await supabase
      .from('site_settings').select('key, value').in('key', ['gmail_address', 'gmail_app_password']);
    const map: Record<string, string> = {};
    settings?.forEach((s) => { map[s.key] = s.value; });
    const transporter = (map.gmail_address && map.gmail_app_password)
      ? nodemailer.createTransport({ service: 'gmail', auth: { user: map.gmail_address, pass: map.gmail_app_password.replace(/\s/g, '') } })
      : null;

    const ownerCache: Record<string, { email: string | null; name: string | null }> = {};
    async function owner(id: string | null) {
      if (!id) return { email: null, name: null };
      if (ownerCache[id]) return ownerCache[id];
      const { data } = await supabase.from('profiles').select('email, full_name').eq('id', id).maybeSingle();
      return (ownerCache[id] = { email: data?.email || null, name: data?.full_name || null });
    }

    async function sendMail(to: string, name: string | null, title: string, phase: 'remind' | 'past_due' | 'archived', days: number) {
      if (!transporter) return;
      const t = escapeHtml(title);
      const nm = escapeHtml(name || '');
      const url = `${SITE_URL}/el/dashboard/billing`;
      const head = phase === 'remind'
        ? `Η ετήσια καταχώρησή σας λήγει σε ${days} μέρες`
        : phase === 'past_due'
          ? 'Η ετήσια καταχώρησή σας έληξε — περίοδος χάριτος'
          : 'Η καταχώρησή σας αποσύρθηκε';
      const body = phase === 'remind'
        ? `Η ετήσια καταχώρηση για το «${t}» λήγει σε <strong>${days} μέρες</strong>. Ανανεώστε την για ${ANNUAL_PLAN.priceLabel}/έτος ώστε να παραμείνει δημοσιευμένη.`
        : phase === 'past_due'
          ? `Η ετήσια καταχώρηση για το «${t}» έληξε. Έχετε <strong>${GRACE_DAYS} μέρες</strong> περίοδο χάριτος για ανανέωση (${ANNUAL_PLAN.priceLabel}/έτος) πριν αποσυρθεί.`
          : `Η καταχώρηση «${t}» αποσύρθηκε λόγω μη ανανέωσης. Μπορείτε να την επαναφέρετε ανανεώνοντας από το dashboard.`;
      await transporter.sendMail({
        from: `ChalkidikiHub <${map.gmail_address}>`, to, replyTo: ADMIN_EMAIL,
        subject: `${phase === 'archived' ? '⚠️' : '🔔'} ${head} — ${title}`,
        html: `<!DOCTYPE html><html lang="el"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#b45309,#d97706);padding:22px 26px;color:#fff;font-size:20px;font-weight:700;">${escapeHtml(head)}</td></tr>
      <tr><td style="padding:22px 26px;">
        <p style="margin:0 0 10px;font-size:15px;color:#374151;">${nm ? `Γεια σας, ${nm}.` : 'Γεια σας,'}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#374151;">${body}</p>
        <a href="${url}" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:600;">Ανανέωση τώρα</a>
      </td></tr>
      <tr><td style="padding:18px 26px;border-top:1px solid #f3f4f6;font-size:12px;color:#9ca3af;text-align:center;">ChalkidikiHub · <a href="${SITE_URL}" style="color:#0284c7;text-decoration:none;">chalkidikihub.gr</a></td></tr>
    </table>
  </td></tr></table></body></html>`,
      }).catch((e) => { console.error('reminder mail failed', e); });
    }

    let reminded = 0, pastDue = 0, archived = 0;

    for (const l of listings) {
      const exp = l.plan_expires_at ? new Date(l.plan_expires_at).getTime() : null;
      if (exp == null) continue;
      const days = Math.round((exp - now) / DAY);

      if (l.plan_status === 'active' && days <= 0) {
        // Just lapsed → grace period.
        await supabase.from('listings').update({ plan_status: 'past_due' }).eq('id', l.id);
        pastDue++;
        const o = await owner(l.owner_id);
        if (o.email) await sendMail(o.email, o.name, l.title_el || '', 'past_due', days);
      } else if (l.plan_status === 'past_due' && days <= -GRACE_DAYS) {
        // Grace elapsed → archive.
        await supabase.from('listings').update({ status: 'archived', plan_status: 'expired' }).eq('id', l.id);
        archived++;
        const o = await owner(l.owner_id);
        if (o.email) await sendMail(o.email, o.name, l.title_el || '', 'archived', days);
      } else if (l.plan_status === 'active' && days > 0 && days <= REMIND_WITHIN_DAYS) {
        // Upcoming expiry → reminder, cooldown-guarded.
        const lastRemind = l.renewal_reminded_at ? new Date(l.renewal_reminded_at).getTime() : 0;
        if (now - lastRemind >= REMIND_COOLDOWN_DAYS * DAY) {
          const o = await owner(l.owner_id);
          if (o.email) await sendMail(o.email, o.name, l.title_el || '', 'remind', days);
          await supabase.from('listings').update({ renewal_reminded_at: new Date().toISOString() }).eq('id', l.id);
          reminded++;
        }
      }
    }

    // Housekeeping: archive listings stuck unpaid (pending_payment) for >14 days.
    const staleBefore = new Date(now - 14 * DAY).toISOString();
    const { data: stale } = await supabase
      .from('listings').select('id').eq('status', 'pending_payment').lt('created_at', staleBefore);
    let cleaned = 0;
    if (stale?.length) {
      await supabase.from('listings').update({ status: 'archived' })
        .eq('status', 'pending_payment').lt('created_at', staleBefore);
      cleaned = stale.length;
    }

    return NextResponse.json({ ok: true, checked: listings.length, reminded, pastDue, archived, cleaned });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
