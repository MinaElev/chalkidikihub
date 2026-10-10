/**
 * PMS — Owner-facing email notifications
 * -----------------------------------------------------------------------
 * Small wrapper over the dispatch email helpers that adds:
 *   • Idempotency via pms_notifications (UNIQUE owner_id/kind/ref_id/ref_date)
 *   • Bilingual body (EL primary + EN below, one message)
 *   • Success/failure record so the cron can re-try only actual failures
 *
 * Used by the /api/cron/pms-notifications route. Owners get pinged for:
 *   • new_inquiry   — a booking lands with status=inquiry
 *   • new_booking   — a booking is confirmed or becomes pending
 *   • overdue_task  — a pms_tasks row whose scheduled_at passed (daily)
 *   • check_in_today  — a booking's check_in == today
 *   • check_out_today — a booking's check_out == today
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { loadGmailCreds, sendTemplateEmail, bodyToHtml } from './dispatch';

export type NotificationKind =
  | 'new_inquiry'
  | 'new_booking'
  | 'overdue_task'
  | 'check_in_today'
  | 'check_out_today';

export interface OwnerAlertOptions {
  ownerId: string;
  kind: NotificationKind;
  refId: string;
  refDate?: string | null; // YYYY-MM-DD; null for one-shot kinds
  emailTo: string;
  subjectEl: string;
  subjectEn: string;
  bodyEl: string;
  bodyEn: string;
  /** Optional pre-loaded Gmail creds so cron loops don't re-hit site_settings each call. */
  creds?: { user: string; pass: string } | null;
  /** Shown in the email footer, usually the listing name or "ChalkidikiHub". */
  footer?: string;
}

export type AlertResult =
  | 'sent'
  | 'skipped_duplicate'
  | 'skipped_no_email'
  | 'skipped_no_creds'
  | 'failed';

const SENTINEL_DATE = '1970-01-01';

/**
 * Attempts to send an owner alert. Performs its own duplicate check against
 * pms_notifications and records the outcome. Safe to call repeatedly with
 * the same tuple — it will skip after the first successful send.
 */
export async function sendOwnerAlert(
  supabase: SupabaseClient,
  opts: OwnerAlertOptions,
): Promise<AlertResult> {
  if (!opts.emailTo) return 'skipped_no_email';

  const refDate = opts.refDate || SENTINEL_DATE;

  // Duplicate check — service client bypasses RLS so this sees all rows.
  const { data: existing } = await supabase
    .from('pms_notifications')
    .select('id')
    .eq('owner_id', opts.ownerId)
    .eq('kind', opts.kind)
    .eq('ref_id', opts.refId)
    .eq('ref_date', refDate)
    .is('error', null)
    .limit(1);
  if (existing && existing.length > 0) return 'skipped_duplicate';

  let creds = opts.creds;
  if (!creds) creds = await loadGmailCreds(supabase);
  if (!creds) {
    await recordAttempt(supabase, opts, refDate, 'no_creds');
    return 'skipped_no_creds';
  }

  const subject = `${opts.subjectEl} / ${opts.subjectEn}`;
  const combinedBody =
    opts.bodyEl +
    '\n\n' +
    '─────────────\n\n' +
    opts.bodyEn;
  const html = bodyToHtml(combinedBody, opts.footer || 'ChalkidikiHub PMS');

  try {
    await sendTemplateEmail({
      to: opts.emailTo,
      subject,
      html,
      fromName: 'ChalkidikiHub PMS',
      creds,
    });
  } catch (err) {
    await recordAttempt(supabase, opts, refDate, (err as Error).message || 'send_failed');
    return 'failed';
  }

  await recordAttempt(supabase, opts, refDate, null);
  return 'sent';
}

async function recordAttempt(
  supabase: SupabaseClient,
  opts: OwnerAlertOptions,
  refDate: string,
  error: string | null,
) {
  await supabase.from('pms_notifications').upsert({
    owner_id: opts.ownerId,
    kind: opts.kind,
    ref_id: opts.refId,
    ref_date: refDate,
    email_to: opts.emailTo,
    subject: `${opts.subjectEl} / ${opts.subjectEn}`,
    error,
  }, { onConflict: 'owner_id,kind,ref_id,ref_date' });
}
