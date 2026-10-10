import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

/** Full message catalogue — only for private areas (dashboard, admin, auth). */
export async function ClientIntlAll({ children }: { children: React.ReactNode }) {
  return <NextIntlClientProvider messages={await getMessages()}>{children}</NextIntlClientProvider>;
}
