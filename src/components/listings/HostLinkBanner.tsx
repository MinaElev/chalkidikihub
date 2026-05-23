import { createApiClient } from '@/lib/api-helpers';
import { Link } from '@/i18n/navigation';
import { Users } from 'lucide-react';

type Props = {
  ownerId: string;
  locale: string;
  /** Current listing slug — excluded from the count so the CTA only appears
   *  when the host has OTHER published properties beyond this one. */
  excludeSlug?: string;
};

const LABEL: Record<string, (n: number, name: string) => string> = {
  el: (n, name) => `${name} φιλοξενεί ${n} ακόμα ${n === 1 ? 'κατάλυμα' : 'καταλύματα'} στη Χαλκιδική`,
  en: (n, name) => `${name} hosts ${n} more ${n === 1 ? 'property' : 'properties'} in Halkidiki`,
  de: (n, name) => `${name} verwaltet ${n} weitere Unterkünfte in Chalkidiki`,
  bg: (n, name) => `${name} управлява още ${n} имота в Халкидики`,
  ru: (n, name) => `${name} управляет ещё ${n} объектами в Халкидиках`,
  ro: (n, name) => `${name} găzduiește alte ${n} proprietăți în Halkidiki`,
  sr: (n, name) => `${name} ima još ${n} smeštaja u Halkidikiju`,
};
const CTA: Record<string, string> = {
  el: 'Δες όλα →', en: 'View all →', de: 'Alle ansehen →',
  bg: 'Виж всички →', ru: 'Все объекты →', ro: 'Vezi toate →', sr: 'Vidi sve →',
};

/**
 * Server component. Renders a small CTA linking to the host's public page,
 * but only if the owner has public_page_enabled, a slug, and ≥2 published
 * listings (i.e. there is something to show on the host page).
 */
export async function HostLinkBanner({ ownerId, locale, excludeSlug }: Props) {
  if (!ownerId) return null;
  const supabase = createApiClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('public_slug, public_page_enabled, public_display_name, full_name')
    .eq('id', ownerId)
    .single();

  if (!profile?.public_slug || !profile.public_page_enabled) return null;

  const { count } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', ownerId)
    .eq('status', 'published');

  if (!count || count < 2) return null;

  const otherCount = excludeSlug ? Math.max(0, count - 1) : count;
  if (otherCount < 1) return null;

  const displayName =
    (profile.public_display_name as string) || (profile.full_name as string) || 'Host';
  const label = (LABEL[locale] || LABEL.en)(otherCount, displayName);

  return (
    <Link
      href={`/host/${profile.public_slug}`}
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary-50 hover:bg-primary-100 ring-1 ring-primary-100 transition group"
    >
      <Users className="w-5 h-5 text-primary-600 flex-shrink-0" />
      <span className="text-sm text-gray-800">{label}</span>
      <span className="text-sm font-semibold text-primary-700 group-hover:translate-x-0.5 transition">
        {CTA[locale] || CTA.en}
      </span>
    </Link>
  );
}
