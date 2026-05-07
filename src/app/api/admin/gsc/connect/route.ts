import { NextRequest, NextResponse } from 'next/server';
import { buildAuthorizeUrl } from '@/lib/gsc';
import crypto from 'node:crypto';

// GET /api/admin/gsc/connect
//
// Starts the OAuth flow: redirects the admin to Google's consent screen.
// Google will redirect back to /api/admin/gsc/callback with ?code=...
// where we exchange the code for a refresh_token and store it.
//
// Auth: same as the rest of /api/admin/* — no token check (security flagged
// for separate review).

export async function GET(req: NextRequest) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID not configured. Set it in Vercel env vars.' },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const redirectUri = `${url.origin}/api/admin/gsc/callback`;
  const state = crypto.randomBytes(16).toString('hex');

  const authorizeUrl = buildAuthorizeUrl(redirectUri, state);

  // Store state in a short-lived cookie for CSRF check on callback.
  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set('gsc_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
    maxAge: 600, // 10 min
    path: '/',
  });
  return res;
}
