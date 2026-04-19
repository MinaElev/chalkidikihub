import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Disconnect Stripe — clears stripe_account_id + stripe_onboarded.
 * Does NOT revoke on Stripe's side; the owner can revoke there themselves
 * from the Stripe dashboard. This just unlinks from our side so future
 * bookings won't offer Stripe checkout.
 */
export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { error } = await supabase
    .from('pms_owner_settings')
    .update({
      stripe_account_id: null,
      stripe_onboarded: false,
      stripe_connect_state: null,
    })
    .eq('owner_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
