// Guard: answers only about the signed-in caller; anonymous callers get { signedIn: false }.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/api-helpers';

/**
 * GET /api/auth/me — who the header should show. The page HTML is cached for
 * everyone, so the header asks here after it finds a session cookie. Only the
 * role decides whether the "Admin" link appears; /admin and /api/admin/*
 * check the role again on their own.
 */
export async function GET() {
  const noStore = { headers: { 'Cache-Control': 'private, no-store' } };
  const { data: { user } } = await (await createClient()).auth.getUser();
  if (!user) return NextResponse.json({ signedIn: false }, noStore);
  const { data: profile } = await createAdminClient().from('profiles').select('role, full_name').eq('id', user.id).maybeSingle();
  return NextResponse.json(
    {
      signedIn: true,
      name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      email: user.email,
      isAdmin: profile?.role === 'superadmin',
    },
    noStore,
  );
}
