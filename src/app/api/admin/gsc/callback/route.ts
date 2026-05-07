import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/api-helpers';
import { exchangeCode, tokenInfo, REQUIRED_SCOPE } from '@/lib/gsc';

// GET /api/admin/gsc/callback?code=...&state=...
//
// Receives the OAuth response from Google, exchanges the code for tokens,
// and stores the refresh_token in gsc_credentials. Then redirects the
// admin to /admin/seo-gsc.

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${url.origin}/admin/seo-gsc?error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${url.origin}/admin/seo-gsc?error=missing_code`);
  }

  const cookieState = req.cookies.get('gsc_oauth_state')?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${url.origin}/admin/seo-gsc?error=state_mismatch`);
  }

  const redirectUri = `${url.origin}/api/admin/gsc/callback`;

  try {
    const tokens = await exchangeCode(code, redirectUri);
    if (!tokens.refresh_token) {
      // Happens when the user previously authorised — Google reuses the
      // existing grant and skips refresh_token. We forced prompt=consent
      // in the authorize URL precisely to avoid this; if we still hit it,
      // ask the user to revoke + retry.
      return NextResponse.redirect(`${url.origin}/admin/seo-gsc?error=no_refresh_token`);
    }
    if (tokens.scope && !tokens.scope.includes(REQUIRED_SCOPE)) {
      return NextResponse.redirect(`${url.origin}/admin/seo-gsc?error=missing_scope`);
    }

    const info = await tokenInfo(tokens.access_token);

    const supabase = createAdminClient();
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    const { error: upsertErr } = await supabase
      .from('gsc_credentials')
      .upsert(
        {
          id: 1,
          refresh_token: tokens.refresh_token,
          access_token: tokens.access_token,
          expires_at: expiresAt,
          email: info.email || null,
          scope: tokens.scope || REQUIRED_SCOPE,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );

    if (upsertErr) {
      return NextResponse.redirect(
        `${url.origin}/admin/seo-gsc?error=${encodeURIComponent('db:' + upsertErr.message)}`,
      );
    }

    const res = NextResponse.redirect(`${url.origin}/admin/seo-gsc?connected=1`);
    res.cookies.delete('gsc_oauth_state');
    return res;
  } catch (e) {
    return NextResponse.redirect(
      `${url.origin}/admin/seo-gsc?error=${encodeURIComponent(String(e).slice(0, 200))}`,
    );
  }
}
