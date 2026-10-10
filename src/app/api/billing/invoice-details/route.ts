// Guard: signed-in user; own profile only.
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Save/replace the owner's invoicing details (ΑΦΜ etc.) on their profile.
 * Collected once and reused across listings so we can issue proper τιμολόγια.
 * GET returns the current values (to prefill the form).
 */
function svcClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET() {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const svc = svcClient();
  if (!svc) return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  const { data } = await svc.from('profiles')
    .select('invoice_name, invoice_vat, invoice_tax_office, invoice_address').eq('id', user.id).maybeSingle();
  return NextResponse.json({ details: data || {} });
}

export async function POST(req: NextRequest) {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const svc = svcClient();
  if (!svc) return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });

  const b = await req.json().catch(() => ({}));
  const s = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, 200) || null : null);
  const { error } = await svc.from('profiles').update({
    invoice_name: s(b.invoice_name),
    invoice_vat: s(b.invoice_vat),
    invoice_tax_office: s(b.invoice_tax_office),
    invoice_address: s(b.invoice_address),
  }).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
