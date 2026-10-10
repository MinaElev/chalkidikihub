import { getTranslations } from 'next-intl/server';
import { Languages } from 'lucide-react';
import { localeNames, type Locale } from '@/i18n/config';

/**
 * Honest label when a text is shown through the fallback chain. Such pages are
 * also noindexed in this locale (see lib/seo/quality.ts).
 */
export async function LocaleNotice({ locale, from }: { locale: Locale; from: Locale }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  return (
    <p className="mb-6 flex items-start gap-2 rounded-xl bg-sand-100 px-4 py-3 text-sm text-slate-700" lang={locale}>
      <Languages className="mt-0.5 size-4 shrink-0 text-sand-600" aria-hidden />
      {t('machineNotice', { language: localeNames[from] })}
    </p>
  );
}
