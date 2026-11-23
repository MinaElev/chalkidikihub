import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';
import { greekActivityRedirect } from '@/lib/seo/redirects';

const intl = createIntlMiddleware(routing);

// Signed-in areas plus token links (guest guides, availability replies, bookings).
const PRIVATE = /^\/(?:(?:en|de|ro|bg|sr|ru)\/)?(?:admin|dashboard|auth|requests|r|book|guest|favorites)(?:\/|$)/;

export async function proxy(request: NextRequest) {
  // One URL per page: v3 linked some slugs with capitals (/blog/BARbatolis).
  // Every public slug is lower case, so fold the path and redirect once.
  // Token links (/r/, /requests/, /guest/ ...) keep their case.
  // Percent-escapes (%CE%B1) are left alone: their hex case means nothing.
  const { pathname } = request.nextUrl;
  const greek = greekActivityRedirect(pathname);
  if (greek) return NextResponse.redirect(new URL(greek, request.url), 308);
  if (/[A-Z]/.test(pathname.replace(/%[0-9A-F]{2}/gi, '')) && !PRIVATE.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/(%[0-9A-F]{2})|[^%]+/gi, (part, esc) => esc ?? part.toLowerCase());
    return NextResponse.redirect(url, 308);
  }

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
