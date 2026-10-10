import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';

const intl = createIntlMiddleware(routing);

const PRIVATE = /^\/(?:(?:en|de|ro|bg|sr|ru)\/)?(?:admin|dashboard|auth)(?:\/|$)/;

export async function proxy(request: NextRequest) {
  let response = intl(request);

  // Locale normalisation redirects are permanent moves, not temporary ones.
  if (response.status === 307) {
    const location = response.headers.get('location');
    if (location) response = NextResponse.redirect(new URL(location, request.url), 308);
  }

  if (PRIVATE.test(request.nextUrl.pathname)) {
    // Refresh the Supabase session cookie only where a session matters, so
    // public pages stay cookie-free and fully cacheable.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (toSet) => {
            toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    await supabase.auth.getUser();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
