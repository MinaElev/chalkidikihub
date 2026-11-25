import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getArticles, getBeaches, getListings, getLiveCalendarListingIds } from '@/lib/db/content';
import { pick } from '@/lib/i18n/localize';
import { closestVillagesFor, displayName, ratingProps } from '@/lib/content/nearby';
import { formatPrice, greekAlt } from '@/lib/content/format';
import { Card, CardGrid, type CardFact } from '@/components/ui/Card';
import { Container } from '@/components/ui/Layout';
import { pickHomeStays } from '@/content/home-stays';
import { getGuideMedia } from '@/lib/guide-media';

/**
 * What a guide page shows besides its text, so a reader has somewhere to go
 * next: a cover photo, the availability-request band mid-text, and after the
 * text three stays, three articles and the other guides as photo cards.
 *
 * On for every page under /guide. Covers are photos the site already has; an
 * admin page for choosing them is the next step.
 */

/** Default covers (files in /public), used until a photo is chosen in Admin → Guides. Guides with neither get one of the site's most-reviewed beach photos. */
const COVERS: Record<string, string> = {
  'best-time-to-visit': '/images/hero/halkidiki-hero.webp',
};

/** A cover for every guide in `slugs`: the admin's photo, else the default, else a beach photo (each used once). */
export async function guideCovers(slugs: string[]): Promise<Record<string, string>> {
  const media = await getGuideMedia();
  const ranked = (await getBeaches())
    .filter((b) => b.image_url)
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0) || (b.rating ?? 0) - (a.rating ?? 0));
  const out: Record<string, string> = {};
  let next = 0;
  for (const slug of slugs) {
    const image = media[slug]?.image ?? COVERS[slug] ?? (ranked[next++]?.image_url as string | undefined);
    if (image) out[slug] = image;
  }
  return out;
}

const CARD_FACTS: CardFact['key'][] = ['pool', 'seaView', 'airConditioning', 'wifi', 'petsAllowed', 'parking'];
const SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

function Head({ id, title, lead, href, cta }: { id: string; title: string; lead?: string; href?: string; cta?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
        {lead && <p className="mt-2 text-slate-500">{lead}</p>}
      </div>
      {href && cta && (
        <Link href={href} className="inline-flex items-center gap-1.5 rounded-xl bg-sea-50 px-4 py-2 text-sm font-semibold text-sea-700 transition-colors hover:bg-sea-100">
          {cta} <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Stays, articles and the other guides, as cards. Rendered after the guide's text. */
export async function GuideAfter({ slug, locale, others, othersLabel }: {
  /** The guide being read: its hand-picked articles come first. */
  slug: string;
  locale: Locale;
  /** The other guides of the same family, with their covers. */
  others: Array<{ href: string; label: string; image?: string }>;
  othersLabel: string;
}) {
  const [t, common, stayT, amenityT, listings, liveIds, articles, media] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'amenities' }),
    getListings(),
    getLiveCalendarListingIds(),
    getArticles(),
    getGuideMedia(),
  ]);
  const live = new Set(liveIds);
  const stays = pickHomeStays(listings.filter((l) => l.cover_url), live, 3);
  const villages = await closestVillagesFor(stays, locale, 6);
  // The articles chosen in Admin → Guides, topped up with the newest ones that have a photo.
  const chosen = (media[slug]?.articles ?? []).map((s) => articles.find((a) => a.slug === s)).filter((a): a is (typeof articles)[number] => Boolean(a));
  const reads = [...chosen, ...articles.filter((a) => a.image_url && !chosen.includes(a))].slice(0, 3);

  return (
    <div className="mt-14 space-y-14">
      {stays.length > 0 && (
        <section aria-labelledby="guide-stays">
          <Container>
            <Head id="guide-stays" title={t('guideStaysTitle')} lead={t('guideStaysLead')} href="/listings" cta={t('guideStaysAll')} />
            <CardGrid cols={3}>
              {stays.map((l) => (
                <Card
                  key={l.slug}
                  href={`/listings/${l.slug}`}
                  favorite={{ type: 'listing', slug: l.slug }}
                  title={displayName(l, locale, 'listing')}
                  eyebrow={villages.get(l.slug)}
                  image={l.cover_url}
                  live={live.has(l.id) ? stayT('liveAvailability') : undefined}
                  meta={stayT('guests', { count: l.guests_max })}
                  facts={CARD_FACTS.filter((k) => (l.amenities ?? []).includes(k)).slice(0, 3).map((key) => ({ key, label: amenityT(key) }))}
                  price={l.price_per_night ? `${common('from')} ${formatPrice(Number(l.price_per_night), locale)} ${common('perNight')}` : undefined}
                  sizes={SIZES}
                  {...ratingProps(l, 'listing')}
                />
              ))}
            </CardGrid>
          </Container>
        </section>
      )}

      {reads.length > 0 && (
        <section aria-labelledby="guide-reads">
          <Container>
            <Head id="guide-reads" title={t('guideReadsTitle')} href="/blog" cta={t('allArticles')} />
            <CardGrid cols={3}>
              {reads.map((a) => (
                <Card key={a.slug} href={`/blog/${a.slug}`} title={pick(a, 'title', locale)} image={a.image_url} imageAlt={greekAlt(a.image_alt, locale)} sizes={SIZES} />
              ))}
            </CardGrid>
          </Container>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="guide-others">
          <Container>
            <Head id="guide-others" title={othersLabel} />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {others.map((o) => (
                <li key={o.href}>
                  <Link href={o.href} className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-sea-800 p-4 text-white shadow-sm">
                    {o.image && <Image src={o.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" />}
                    <span className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/85 via-gray-900/20 to-transparent" aria-hidden />
                    <span className="line-clamp-3 text-sm font-bold leading-snug sm:text-base">{o.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </div>
  );
}
