import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Greek stays unprefixed — every existing indexed Greek URL keeps working.
  localePrefix: 'as-needed',
  // The URL is the only locale signal. A locale cookie forces
  // `Cache-Control: private` on every response and breaks ISR.
  localeCookie: false,
  // Never redirect a visitor away from the URL they asked for based on
  // Accept-Language: crawlers send none, and hreflang does this job.
  localeDetection: false,
});
