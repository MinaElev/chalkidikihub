import { createAdminClient } from '@/lib/api-helpers';
import { createMailTransport, mailFrom } from '@/lib/email/mailer';
import { buildNewUserEmail } from '@/lib/emails/new-user';

const ADMIN_EMAIL = 'mnc@hotmail.gr';

/** Marker row in activity_logs, so the same account is only announced once. */
const LOG_MESSAGE = 'Admin notified: new user registered';

/**
 * Tell the admin a new account exists.
 *
 * Server-side and idempotent on purpose. The first version of this fired from
 * the register form, which meant it silently did nothing whenever the browser
 * was running an older bundle — exactly what happened on the first real signup,
 * because the page had been loaded a minute before the deploy went live (and
 * the PWA service worker caches those chunks anyway). Anything that depends on
 * fresh client code to notify the operator will eventually miss.
 *
 * Safe to call more than once and from more than one place: the activity_logs
 * marker collapses repeats into a single email.
 */
export async function notifyAdminOfNewUser(
  userId: string,
  fallbackEmail: string,
  fallbackMeta?: Record<string, string>,
): Promise<{ sent: true } | { skipped: string }> {
  const admin = createAdminClient();

  // Already told them about this account? Don't tell them twice.
  const { data: already } = await admin
    .from('activity_logs')
    .select('id')
    .eq('message', LOG_MESSAGE)
    .contains('details', { user_id: userId })
    .maybeSingle();
  if (already) {
    return { skipped: 'already_notified' as const };
  }

  // The profiles row is written by a trigger on signup; fall back to the
  // signup metadata in case this runs before the trigger has landed.
  const { data: profile } = await admin
    .from('profiles')
    .select('full_name, phone, email, created_at, email_verified_at')
    .eq('id', userId)
    .maybeSingle();

  const meta = fallbackMeta || {};
  const name = profile?.full_name || meta.full_name || '—';
  const email = profile?.email || fallbackEmail;
  const phone = profile?.phone || meta.phone || '';
  const verified = Boolean(profile?.email_verified_at);

  const { count: totalUsers } = await admin
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const when = new Date(profile?.created_at || Date.now())
    .toLocaleString('el-GR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Athens' });

  const { data: settings } = await admin
    .from('site_settings')
    .select('key, value')
    .in('key', ['gmail_address', 'gmail_app_password']);
  const settingsMap: Record<string, string> = {};
  settings?.forEach((s) => { settingsMap[s.key] = s.value; });
  const gmailAddress = settingsMap.gmail_address;
  const gmailPassword = settingsMap.gmail_app_password;

  if (!gmailAddress || !gmailPassword) {
    return { skipped: 'email_not_configured' as const };
  }

  const transporter = await createMailTransport(gmailAddress, gmailPassword.replace(/\s/g, ''));

  const html = buildNewUserEmail({
    name, email, phone, when, verified, totalUsers: totalUsers ?? null,
  });

  await transporter.sendMail({
    from: await mailFrom(gmailAddress),
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: `Νέα εγγραφή: ${name !== '—' ? name : email}`,
    html,
  });

  await admin.from('activity_logs').insert({
    type: 'system',
    severity: 'info',
    message: LOG_MESSAGE,
    details: { user_id: userId, email },
  });

  return { sent: true };
}
