import { NextResponse } from 'next/server';

// Redirect /favicon.ico → /icons/icon-192.png to eliminate 404s
// Browsers request /favicon.ico by convention; this serves our existing icon
export async function GET() {
  return NextResponse.redirect(
    new URL('/icons/icon-192.png', process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr'),
    { status: 308 } // Permanent redirect — browsers cache this
  );
}
