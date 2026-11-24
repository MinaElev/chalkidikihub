import type { Locale } from '@/i18n/config';
import { AREA_SLUGS, getAreas, getBeaches } from '@/lib/db/content';
import { AREA_NAMES } from '@/lib/content/place-names';
import { ClientIntl } from '@/components/ClientIntl';
import { AvailabilityQuickForm } from './AvailabilityQuickForm';

/**
 * The compact "one request, many options" band with everything it needs:
 * area names, a real photo and its texts. Used on the test home page and on
 * guide pages. Its strings live here until the design is approved and they
 * move to messages/v4 (other locales fall back to English).
 */
const COPY = {
  el: {
    titleA: 'Ένα αίτημα.', titleB: 'Πολλές επιλογές.',
    lead: 'Πες μας πού και πότε. Οι ιδιοκτήτες σου απαντούν απευθείας.',
    area: 'Περιοχή', anyArea: 'Όλη η Χαλκιδική', checkIn: 'Άφιξη', checkOut: 'Αναχώρηση', adults: 'Ενήλικες', submit: 'Στείλε αίτημα',
    note: 'Δωρεάν. Στο επόμενο βήμα βάζεις τα στοιχεία επικοινωνίας σου και το αίτημα φεύγει.',
  },
  en: {
    titleA: 'One request.', titleB: 'Many options.',
    lead: 'Tell us where and when. The owners reply to you directly.',
    area: 'Area', anyArea: 'All of Halkidiki', checkIn: 'Check-in', checkOut: 'Check-out', adults: 'Adults', submit: 'Send request',
    note: 'Free. You add your contact details in the next step, and then the request is sent.',
  },
} as const;

export async function RequestBand({ locale }: { locale: Locale }) {
  const [areas, beaches] = await Promise.all([getAreas(), getBeaches()]);
  const image =
    (areas.find((a) => a.slug === 'sithonia')?.image_url as string | undefined) ||
    beaches.find((b) => b.area === 'sithonia' && b.image_url)?.image_url ||
    null;
  return (
    <ClientIntl namespaces={['availabilityRequest']}>
      <AvailabilityQuickForm
        areas={Object.fromEntries(AREA_SLUGS.map((a) => [a, AREA_NAMES[a][locale]]))}
        image={image}
        labels={COPY[locale === 'el' ? 'el' : 'en']}
      />
    </ClientIntl>
  );
}
