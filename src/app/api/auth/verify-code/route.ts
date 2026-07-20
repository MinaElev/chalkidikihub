import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/api-helpers';
import { hashVerificationCode, MAX_VERIFY_ATTEMPTS } from '@/lib/email-verification';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || !/^\d{4}$/.test(String(code))) {
      return NextResponse.json({ error: 'Μη έγκυρος κωδικός.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from('profiles')
      .select('email_verified_at')
      .eq('id', user.id)
      .single();
    if (profile?.email_verified_at) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    const { data: verification } = await admin
      .from('email_verifications')
      .select('code_hash, expires_at, attempts')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!verification || new Date(verification.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Ο κωδικός έληξε. Ζητήστε νέο κωδικό.', expired: true },
        { status: 400 }
      );
    }

    if (verification.attempts >= MAX_VERIFY_ATTEMPTS) {
      await admin.from('email_verifications').delete().eq('user_id', user.id);
      return NextResponse.json(
        { error: 'Πολλές λανθασμένες προσπάθειες. Ζητήστε νέο κωδικό.', expired: true },
        { status: 400 }
      );
    }

    if (verification.code_hash !== hashVerificationCode(String(code), user.id)) {
      await admin
        .from('email_verifications')
        .update({ attempts: verification.attempts + 1 })
        .eq('user_id', user.id);
      const remaining = MAX_VERIFY_ATTEMPTS - verification.attempts - 1;
      return NextResponse.json(
        {
          error: remaining > 0
            ? `Λάθος κωδικός. Απομένουν ${remaining} προσπάθειες.`
            : 'Πολλές λανθασμένες προσπάθειες. Ζητήστε νέο κωδικό.',
          expired: remaining <= 0,
        },
        { status: 400 }
      );
    }

    await admin
      .from('profiles')
      .update({ email_verified_at: new Date().toISOString() })
      .eq('id', user.id);
    await admin.from('email_verifications').delete().eq('user_id', user.id);

    await admin.from('activity_logs').insert({
      type: 'user_action',
      severity: 'info',
      message: 'Email verified via 4-digit code',
      details: { user_id: user.id, email: user.email },
    });

    // Any listings submitted before verification were held back from the
    // admin-review notification — release them now.
    const { data: heldListings } = await admin
      .from('listings')
      .select('id')
      .eq('owner_id', user.id)
      .eq('status', 'pending');
    if (heldListings && heldListings.length > 0) {
      const origin = request.nextUrl.origin;
      await Promise.allSettled(
        heldListings.map((l) =>
          fetch(`${origin}/api/listings/notify-new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: l.id }),
          })
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
