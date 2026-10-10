// Guard: signed-in user (the account that just registered).
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { notifyAdminOfNewUser } from '@/lib/notify-new-user';

/**
 * Kept so the register form can still trigger the notice immediately. The real
 * guarantee lives in send-verification, which runs server-side; this is just
 * the fast path. Takes no body — identity comes from the session, so nobody can
 * inject invented details into the admin's inbox.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const result = await notifyAdminOfNewUser(
      user.id,
      user.email,
      (user.user_metadata || {}) as Record<string, string>,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error('notify-new-user failed', err);
    return NextResponse.json({ error: 'Failed to notify' }, { status: 500 });
  }
}
