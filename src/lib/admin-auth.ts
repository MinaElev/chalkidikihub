import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from './api-helpers';

// Verify caller is superadmin — returns user or error response
// Only use in API routes (server-side)
export async function requireSuperAdmin(): Promise<{ userId: string } | NextResponse> {
  try {
    // Use the Supabase SSR server client — handles cookies automatically
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized — invalid token' }, { status: 401 });
    }

    // Use admin client to check role (bypasses RLS on profiles table)
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'superadmin') {
      return NextResponse.json({ error: `Forbidden — role is "${profile?.role || 'unknown'}"` }, { status: 403 });
    }

    return { userId: user.id };
  } catch (err) {
    return NextResponse.json({ error: `Auth check failed: ${(err as Error).message}` }, { status: 401 });
  }
}
