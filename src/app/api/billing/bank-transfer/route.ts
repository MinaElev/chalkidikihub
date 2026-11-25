// Guard: signed-in owner of the listing (checked below).
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { planByKey } from '@/lib/billing';
import { sendMail } from '@/lib/email/mailer';
import { bankTransferEmail } from '@/lib/email/bank-transfer-email';

/**
 * Owner declares they'll pay the annual fee by bank transfer (IBAN deposit).
 * Flags the listing; the admin confirms the deposit later to activate it.
 * No money moves here — this just puts the listing in the admin's
 * "pending bank transfers" queue.
 */
export async function POST(req: NextRequest) {
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const listingId = typeof body.listing_id === 'string' ? body.listing_id : null;
  const plan = planByKey(body.plan);   // 'annual' (default) or 'premium'
  if (!listingId) return NextResponse.json({ error: 'listing_id required' }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'service_not_configured' }, { status: 500 });
  const svc = createServiceClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: listing } = await svc
    .from('listings').select('id, owner_id, title_el, billing_exempt, plan, plan_status, bank_transfer_requested_at').eq('id', listingId).maybeSingle();
  if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
  if (listing.owner_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (listing.billing_exempt) return NextResponse.json({ error: 'listing_exempt' }, { status: 409 });
  if (listing.plan_status === 'active') return NextResponse.json({ error: 'already_paid' }, { status: 409 });

  // Record the requested tier on the listing (service role bypasses the owner
  // billing-lock trigger) so the admin confirms the RIGHT amount. plan_status
  // stays untouched — the listing isn't active until the deposit is confirmed.
  await svc.from('listings')
    .update({ bank_transfer_requested_at: new Date().toISOString(), plan: plan.key })
    .eq('id', listingId);

  // Return the IBAN instructions + the amount to deposit for the chosen tier.
  const { data: settings } = await svc
    .from('site_settings').select('key, value').in('key', ['billing_iban', 'billing_beneficiary', 'billing_bank', 'billing_bic']);
  const m: Record<string, string> = {};
  settings?.forEach((s) => { m[s.key] = s.value; });
  // Email the owner the deposit details + the reference to write. Only on the
  // first request (or a change of package), not when the page merely shows
  // the details again.
  const isNewRequest = !listing.bank_transfer_requested_at || listing.plan !== plan.key;
  if (isNewRequest) {
    const { data: owner } = await svc.from('profiles').select('email, full_name').eq('id', listing.owner_id).maybeSingle();
    if (owner?.email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
      const mail = bankTransferEmail({
        ownerName: owner.full_name || null,
        listingTitle: listing.title_el || '',
        amountLabel: plan.priceLabel,
        planLabel: plan.key === 'premium' ? 'Premium, 1 έτος' : 'Βασικό, 1 έτος',
        renewal: listing.plan_status === 'past_due' || listing.plan_status === 'expired',
        bank: { iban: m.billing_iban || '', beneficiary: m.billing_beneficiary || '', bank: m.billing_bank || '', bic: m.billing_bic || '' },
        dashboardUrl: `${siteUrl}/dashboard/billing?pay=${listing.id}`,
      });
      // Fire and forget: the owner already sees the details on screen.
      void sendMail({ to: owner.email, replyTo: 'mnc@hotmail.gr', ...mail });
    }
  }

  return NextResponse.json({
    ok: true,
    iban: m.billing_iban || '', beneficiary: m.billing_beneficiary || '', bank: m.billing_bank || '', bic: m.billing_bic || '',
    amount_cents: plan.priceCents, amount_label: plan.priceLabel, plan: plan.key,
  });
}
