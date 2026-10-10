import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // messages/{locale}.json holds the v3 strings still used by the ported
  // forms; messages/v4/{locale}.json holds everything written for v4.
  const [legacy, v4] = await Promise.all([
    import(`../../messages/${locale}.json`).then((m) => m.default),
    import(`../../messages/v4/${locale}.json`).then((m) => m.default),
  ]);

  const messages: Record<string, unknown> = { ...legacy };
  for (const [ns, value] of Object.entries(v4 as Record<string, Record<string, unknown>>)) {
    messages[ns] = { ...(legacy[ns] ?? {}), ...value };
  }

  return {
    locale,
    messages,
    timeZone: 'Europe/Athens',
  };
});
