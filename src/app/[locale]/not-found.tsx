import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Narrow } from '@/components/ui/Layout';

export default async function NotFound() {
  const locale = await getLocale();
  const [t, shell] = await Promise.all([
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'shell' }),
  ]);
  const links = [
    { href: '/beaches', label: shell('beaches') },
    { href: '/places', label: shell('places') },
    { href: '/listings', label: shell('stay') },
    { href: '/restaurants', label: shell('food') },
    { href: '/guide', label: shell('guides') },
  ];
  return (
    <Narrow className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-sea-700">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">{t('notFoundTitle')}</h1>
      <p className="mt-4 text-slate-600">{t('notFoundText')}</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block rounded-full bg-sand-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-sea-100">{l.label}</Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="mt-8 inline-block font-semibold text-sea-700 hover:underline">{t('backHome')}</Link>
    </Narrow>
  );
}
