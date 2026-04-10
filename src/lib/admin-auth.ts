import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createApiClient } from './api-helpers';

// Verify caller is superadmin — returns user or error response
// Only use in API routes (server-side)
export async function requireSuperAdmin(): Promise<{ userId: string } | NextResponse> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Try multiple Supabase cookie formats
    let accessToken = '';

    // Format 1: sb-{ref}-auth-token (chunked or single)
    const authCookie = allCookies.find(c => c.name.includes('auth-token'));
    if (authCookie) {
      try {
        // Could be JSON with access_token inside
        const parsed = JSON.parse(authCookie.value);
        accessToken = parsed?.access_token || parsed?.[0]?.access_token || '';
      } catch {
        accessToken = authCookie.value;
      }
    }

    // Format 2: chunked cookies sb-{ref}-auth-token.0, .1, etc
    if (!accessToken) {
      const chunks = allCookies
        .filter(c => c.name.includes('auth-token.'))
        .sort((a, b) => a.name.localeCompare(b.name));
      if (chunks.length > 0) {
        const combined = chunks.map(c => c.value).join('');
        try {
          const parsed = JSON.parse(combined);
          accessToken = parsed?.access_token || '';
        } catch {
          accessToken = combined;
        }
      }
    }

    // Format 3: base64 encoded JSON
    if (!accessToken && authCookie) {
      try {
        const decoded = Buffer.from(authCookie.value, 'base64').toString();
        const parsed = JSON.parse(decoded);
        accessToken = parsed?.access_token || '';
      } catch {}
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
