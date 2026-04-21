import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  // Disable locale cookie — it forces `Cache-Control: private, no-store` on
  // every response and breaks Vercel ISR. URL already carries the locale, so
  // the cookie adds no value for SEO/navigation and kills the cache.
  localeCookie: false,
});
