import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { getBeaches } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const beaches = await getBeaches();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl">ChalkidikiHub</h1>
      <p>{beaches.length} beaches</p>
      <ul>{beaches.slice(0, 5).map((b) => <li key={b.id}>{pick(b, 'name', locale as Locale)}</li>)}</ul>
    </div>
  );
}
