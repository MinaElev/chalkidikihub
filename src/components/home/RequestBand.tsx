import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getAreas, getBeaches } from '@/lib/db/content';
import { AREA_NAMES } from '@/lib/content/place-names';
import { ClientIntl } from '@/components/ClientIntl';
import { AvailabilityQuickForm } from './AvailabilityQuickForm';

/**
 * The compact "one request, many options" band with everything it needs:
 * area names, a real photo and its texts (home.req* messages). Used on the
 * home page and on guide pages.
 */
export async function RequestBand({ locale }: { locale: Locale }) {
  const [areas, beaches, t] = await Promise.all([getAreas(), getBeaches(), getTranslations({ locale, namespace: 'home' })]);
  const image =
    (areas.find((a) => a.slug === 'sithonia')?.image_url as string | undefined) ||
    beaches.find((b) => b.area === 'sithonia' && b.image_url)?.image_url ||
    null;
  return (
    <ClientIntl namespaces={['availabilityRequest']}>
      <AvailabilityQuickForm
        areas={Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]]))}
        image={image}
        labels={{
          titleA: t('reqTitleA'), titleB: t('reqTitleB'), lead: t('reqLead'), area: t('reqArea'), anyArea: t('reqAny'),
          checkIn: t('reqIn'), checkOut: t('reqOut'), adults: t('reqAdults'), submit: t('reqSubmit'), note: t('reqNote'),
        }}
      />
    </ClientIntl>
  );
}
