import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

/**
 * Ships only the named message namespaces to the browser, for the client
 * components that need them. v3 sent the entire 36 KB catalogue with every
 * page; that was a large part of its 1 MB homepage HTML.
 */
export async function ClientIntl({ namespaces, children }: { namespaces: string[]; children: React.ReactNode }) {
  const all = (await getMessages()) as Record<string, unknown>;
  const messages = Object.fromEntries(namespaces.filter((n) => n in all).map((n) => [n, all[n]]));
  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
