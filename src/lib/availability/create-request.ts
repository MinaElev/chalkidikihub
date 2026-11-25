import 'server-only';
import crypto from 'crypto';
import { after } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  prepareBroadcast,
  sendBroadcast,
  sendGuestConfirmation,
  generatePublicToken,
  MAX_REQUESTS_PER_DAY,
  type AvailabilityRequestRow,
} from '@/lib/availability/dispatch';

/**
 * Creates a mass availability request (one area, all matching owners) and
 * mails the owners after the response. Shared by the request form and the
 * one-click "ask the whole area" link in guest emails. Input is validated by
 * the caller; the rate limits live here so every way in obeys them.
 */
export type NewAreaRequest = {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  area: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  budget_min: number | null;
  budget_max: number | null;
  property_type: string | null;
  notes: string | null;
  locale: string;
};

export type AreaRequestResult =
  | { ok: true; public_token: string; recipients_count: number; no_matches: boolean }
  | { ok: false; status: number; error: string; message?: string };

export function hashIp(ip: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + (process.env.NEXT_PUBLIC_SITE_URL || ''))
    .digest('hex')
    .slice(0, 32);
}

export function requestIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() || headers.get('x-real-ip') || 'unknown';
}

export async function createAreaRequest(supabase: SupabaseClient, r: NewAreaRequest, ipHash: string): Promise<AreaRequestResult> {
  const day = new Date(Date.now() - 86_400_000).toISOString();
  const month = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const [emailDayRes, ipDayRes, emailMonthRes, totalDayRes] = await Promise.all([
    supabase.from('availability_requests').select('id', { count: 'exact', head: true }).eq('guest_email', r.guest_email).gte('created_at', day),
    supabase.from('availability_requests').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', day),
    supabase.from('availability_requests').select('id', { count: 'exact', head: true }).eq('guest_email', r.guest_email).gte('created_at', month),
    supabase.from('availability_requests').select('id', { count: 'exact', head: true }).gte('created_at', day),
  ]);

  if ((emailDayRes.count || 0) >= 1) {
    return { ok: false, status: 429, error: 'rate_limit_email_day', message: 'Έχεις ήδη στείλει αίτημα τις τελευταίες 24 ώρες.' };
  }
  if ((ipDayRes.count || 0) >= 3) {
    return { ok: false, status: 429, error: 'rate_limit_ip_day', message: 'Πολλά αιτήματα από αυτή τη συσκευή. Δοκίμασε ξανά αύριο.' };
  }
  if ((emailMonthRes.count || 0) >= 5) {
    return { ok: false, status: 429, error: 'rate_limit_email_month', message: 'Έχεις ξεπεράσει το όριο αιτημάτων ανά μήνα.' };
  }
  if ((totalDayRes.count || 0) >= MAX_REQUESTS_PER_DAY) {
    return {
      ok: false, status: 429, error: 'platform_daily_cap',
      message: 'Η πλατφόρμα δέχεται περιορισμένο αριθμό αιτημάτων ημερησίως. Δοκίμασε ξανά αύριο.',
    };
  }

  const public_token = generatePublicToken();
  const expires_at = new Date(new Date(r.check_out).getTime() + 7 * 86_400_000).toISOString();

  const { data: inserted, error: insErr } = await supabase
    .from('availability_requests')
    .insert({ ...r, public_token, status: 'active', expires_at, ip_hash: ipHash })
    .select('id, public_token, guest_name, guest_email, guest_phone, area, check_in, check_out, adults, children, budget_min, budget_max, property_type, notes, locale')
    .single();
  if (insErr || !inserted) return { ok: false, status: 500, error: 'insert_failed', message: insErr?.message };

  const requestRow = inserted as AvailabilityRequestRow;

  // Only the matching runs now, so the visitor hears how many owners were asked;
  // the emails (up to 50 sequential sends) go out after the response.
  const { creds, candidates } = await prepareBroadcast(supabase, requestRow);
  const recipientCount = candidates.length;
  if (recipientCount > 0) {
    await supabase.from('availability_requests').update({ recipients_count: recipientCount }).eq('id', inserted.id);
  }

  after(async () => {
    try {
      let sent = 0;
      let failed = 0;
      if (creds && candidates.length > 0) {
        const res = await sendBroadcast(supabase, requestRow, candidates, creds);
        sent = res.sent;
        failed = res.failed;
        if (sent !== recipientCount) {
          await supabase.from('availability_requests').update({ recipients_count: sent }).eq('id', inserted.id);
        }
      }
      await sendGuestConfirmation(supabase, requestRow, sent).catch(() => {});
      await supabase.from('activity_logs').insert({
        type: 'user_action',
        severity: 'info',
        message: `Availability request submitted (${r.area}, ${sent} owners notified)`,
        details: { request_id: inserted.id, area: r.area, sent, failed },
      });
    } catch {
      // The request row is saved; the guest can still follow it from their link.
    }
  });

  return { ok: true, public_token, recipients_count: recipientCount, no_matches: recipientCount === 0 && !!creds };
}
