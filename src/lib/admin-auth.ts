import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createApiClient } from './api-helpers';

// Verify caller is superadmin — returns user or error response
// Only use in API routes (server-side)
export async function requireSuperAdmin(): Promise<{ userId: string } | NextResponse> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const authCookie = allCookies.find(c => c.name.includes('auth-token'));

    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the auth token
    let accessToken = '';
    try {
      const parsed = JSON.parse(authCookie.value);
      accessToken = parsed?.access_token || parsed?.[0]?.access_token || '';
    } catch {
      accessToken = authCookie.value;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createApiClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return { userId: user.id };
  } catch {
    return NextResponse.json({ error: 'Auth check failed' }, { status: 401 });
  }
}
