// Guard: superadmin session, or the cron bearer secret.
import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Admin billing health: surfaces whether the payment plumbing is configured
 * (env secrets are server-only, so the client can't check them directly) plus
 * the last billing webhook we processed. Read-only, admin-gated.
 */
export async function GET() {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { data: profile } = await authed.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!profile || !['admin', 'superadmin'].includes(profile.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let iban = false, lastWebhook: string | null = null;
  if (url && key) {
    const svc = createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: s } = await svc.from('site_settings').select('key, value').eq('key', 'billing_iban').maybeSingle();
    iban = !!(s?.value && String(s.value).trim());
    const { data: log } = await svc.from('activity_logs')
      .select('created_at').ilike('message', 'Billing:%').order('created_at', { ascending: false }).limit(1).maybeSingle();
    lastWebhook = log?.created_at || null;
  }

  return NextResponse.json({
    stripe_secret: !!process.env.STRIPE_SECRET_KEY,
    webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    cron_secret: !!process.env.CRON_SECRET,
    iban_set: iban,
    last_billing_event: lastWebhook,
  });
}
