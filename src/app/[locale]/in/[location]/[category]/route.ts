import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale } from '@/i18n/config';
import { resolveInLocation } from '@/lib/seo/redirects';

// Legacy v3 URL family. Public read-only redirect: no guard needed (no data,
// no side effects). See lib/seo/redirects.ts.
export async function GET(request: NextRequest, ctx: RouteContext<'/[locale]/in/[location]/[category]'>) {
  const { locale, location, category } = await ctx.params;
  const target = resolveInLocation(location, category);
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return NextResponse.redirect(new URL(`${prefix}${target ?? '/places'}`, request.url), 301);
}
