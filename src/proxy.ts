import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Match any locale-prefixed or unprefixed path under /admin, /dashboard, /auth.
// Examples: /admin, /admin/users, /en/dashboard, /de/auth/login, etc.
const PRIVATE_PATH = /^\/(?:(?:el|en|de|bg|ru|ro|sr)\/)?(?:admin|dashboard|auth)(?:\/|$)/;

export default function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  // Convert temporary redirects (307) to permanent (308) for SEO
  // Google treats 307 as "temporary" and won't update its index
  // 308 tells Google "this URL permanently redirects, index the target"
  if (response.status === 307) {
    const location = response.headers.get('location');
    if (location) {
      const permanentResponse = NextResponse.redirect(
        new URL(location, request.url),
        308
      );
      // Copy all headers from the original response
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'location') {
          permanentResponse.headers.set(key, value);
        }
      });
      return permanentResponse;
    }
  }

  // Defense-in-depth: tell search engines never to index private areas even
  // if they somehow discover the URL (robots.txt is advisory; X-Robots-Tag
  // is authoritative at the HTTP layer).
  if (PRIVATE_PATH.test(request.nextUrl.pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  // Match all paths EXCEPT static files, api routes, and Next.js internals
  matcher: ['/', '/(el|en|de|bg|ru|ro|sr)/:path*', '/((?!api|_next|images|favicon|robots|sitemap|ads\\.txt|.*\\..*).*)+'],
};
