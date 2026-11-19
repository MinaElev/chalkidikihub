import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BedDouble, Bath, Check, Phone, Users } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';
import { getListing, getListings, type ListingCard } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { inPageScript, localize, pick } from '@/lib/i18n/localize';
import { closestVillage, displayName, nearBeaches, nearRestaurants, ratingProps } from '@/lib/content/nearby';
import { AREA_NAMES, inPlace, placeName } from '@/lib/content/place-names';
import { formatDate, formatDistance, formatPrice, greekAlt } from '@/lib/content/format';
import { plainText, renderRichText } from '@/lib/content/render';
import { genuineReviews, ratingOf, type ReviewRow } from '@/lib/content/reviews';
import { buildMetadata } from '@/lib/seo/metadata';
import { listingIndex } from '@/lib/seo/indexability';
import { addressLd, geoLd, ratingLd, type Faq as FaqItem } from '@/lib/seo/jsonld';
import { localeUrl } from '@/lib/seo/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card, CardGrid } from '@/components/ui/Card';
import { Faq } from '@/components/ui/Faq';
import { Container, PageIntro, Prose, Section } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Reviews } from '@/components/ui/Reviews';
import { Gallery, type Photo } from '@/components/stay/Gallery';
import { AvailabilityCalendar } from '@/components/stay/AvailabilityCalendar';
import { InquiryForm, type InquiryLabels } from '@/components/stay/InquiryForm';
import { ReviewForm } from '@/components/v3/ReviewForm';
import { ShareButtons } from '@/components/v3/ShareButtons';
import { RecentlyViewed } from '@/components/v3/RecentlyViewed';
import { renderLinked } from '@/lib/content/autolink';

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

type Row = ListingCard & Record<string, unknown> & {
  listing_images?: Array<Record<string, unknown> & { image_url: string; is_cover: boolean; sort_order: number }>;
  listing_reviews?: ReviewRow[];
  listing_faqs?: Array<Record<string, unknown> & { sort_order: number }>;
  listing_extras?: Array<Record<string, unknown> & { sort_order: number; price: number | null; currency: string | null; price_unit: string | null; included: boolean }>;
};


async function load(slug: string) {
  const l = (await getListing(slug)) as Row | null;
  if (!l) return null;
  const village = hasCoords(l) ? await closestVillage(l, 6) : null;
  const reviews = genuineReviews(l.listing_reviews);
  return { l, village, reviews, rating: ratingOf(reviews) };
}

function photos(l: Row, locale: Locale, name: string): Photo[] {
  const imgs = [...(l.listing_images ?? [])].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);
  const list = imgs.map((i, idx) => ({ url: i.image_url, alt: pick(i, 'caption', locale) || `${name} — ${idx + 1}` }));
  if (!list.length && l.image_url) list.push({ url: l.image_url as string, alt: name });
  return list;
}


export async function generateMetadata({ params }: PageProps<'/[locale]/listings/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const data = await load(slug);
  if (!data) return {};
  const { l, village } = data;
  const t = await getTranslations({ locale, namespace: 'stay' });
  const name = displayName(l, locale, 'listing');
  const ip = village ? inPlace(village.item.slug, locale) : AREA_NAMES[l.area][locale];
  const pics = photos(l, locale, name);
  const price = l.price_per_night ? t('priceFromMeta', { price: formatPrice(Number(l.price_per_night), locale) }) : '';
  return buildMetadata({
    locale,
    path: `/listings/${slug}`,
    title: t('metaTitle', { name, inPlace: ip, guests: l.guests_max }),
    description: t('metaDesc', { name, inPlace: ip, bedrooms: l.bedrooms, guests: l.guests_max, price }),
    image: pics[0]?.url,
    indexableLocales: l.is_closed ? [] : ((await listingIndex())[slug] ?? []),
  });
}

export default async function ListingPage({ params }: PageProps<'/[locale]/listings/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const data = await load(slug);
  if (!data) notFound();
  const { l, village, reviews, rating } = data;

  const [t, shell, common, amenityT] = await Promise.all([
    getTranslations({ locale, namespace: 'stay' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'amenities' }),
  ]);

  const name = displayName(l, locale, 'listing');
  // Only a tagline written for this language, in its alphabet (no English
  // fallback on a German page, no English line typed into the Greek field).
  const taglineL = localize(l, 'tagline', locale);
  const tagline = taglineL.native && inPageScript(taglineL.text, locale) ? taglineL.text : '';
  const body = localize(l, 'description', locale);
  const story = localize(l, 'owner_story', locale);
  const pics = photos(l, locale, name);
  const geo = hasCoords(l);
  const villageName = village ? placeName(village.item.slug, locale, village.item) : null;
  const phone = String(l.contact_phone ?? '').trim();
  const amenities = (l.amenities ?? []).filter((a) => amenityT.has(a));

  const ruleValue = (v: unknown) => {
    const map: Record<string, string> = { allowed: 'rule_allowed', welcome: 'rule_allowed', not_allowed: 'rule_not_allowed', on_request: 'rule_on_request', outside: 'rule_outside_only' };
    return typeof v === 'string' && map[v] ? t(map[v]) : null;
  };
  const rules = [
    { label: t('checkIn'), value: (l.check_in_time as string) || null },
    { label: t('checkOut'), value: (l.check_out_time as string) || null },
    { label: t('quietHours'), value: l.quiet_hours_from && l.quiet_hours_to ? `${l.quiet_hours_from}–${l.quiet_hours_to}` : null },
    { label: t('rule_smoking'), value: ruleValue(l.rule_smoking) },
    { label: t('rule_pets'), value: ruleValue(l.rule_pets) },
    { label: t('rule_parties'), value: ruleValue(l.rule_parties) },
    { label: t('rule_kids'), value: ruleValue(l.rule_kids) },
  ].filter((r) => r.value);
  const rulesExtra = localize(l, 'house_rules_extra', locale);

  const faqs: FaqItem[] = [...(l.listing_faqs ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((f) => ({ q: pick(f, 'question', locale), a: pick(f, 'answer', locale) }))
    .filter((f) => f.q && f.a);
  const extras = [...(l.listing_extras ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  const [beaches, food] = geo ? await Promise.all([nearBeaches(l, 4), nearRestaurants(l, 4)]) : [[], []];

  const labels = Object.fromEntries(
    (['formTitle', 'formIntro', 'formCheckIn', 'formCheckOut', 'formGuests', 'formName', 'formEmail', 'formPhone', 'formMessage', 'formMessagePlaceholder', 'formSubmit', 'formSending', 'formSuccess', 'formError', 'formTooMany', 'formPrivacy'] as const).map((k) => [k, t(k)]),
  ) as InquiryLabels;

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: shell('home'), path: '/' },
              { name: shell('stay'), path: '/listings' },
              ...(village ? [{ name: villageName!, path: `/places/${village.item.slug}` }] : []),
              { name, path: `/listings/${slug}` },
            ]}
          />
        }
        title={name}
        lead={tagline || undefined}
      >
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
          <li className="inline-flex items-center gap-1.5"><Users className="size-4 text-sea-600" aria-hidden />{t('guests', { count: l.guests_max })}</li>
          <li className="inline-flex items-center gap-1.5"><BedDouble className="size-4 text-sea-600" aria-hidden />{t('bedrooms', { count: l.bedrooms })}</li>
          <li className="inline-flex items-center gap-1.5"><Bath className="size-4 text-sea-600" aria-hidden />{t('bathrooms', { count: l.bathrooms })}</li>
          <li>{villageName ? `${villageName}, ${AREA_NAMES[l.area][locale]}` : AREA_NAMES[l.area][locale]}</li>
        </ul>
      </PageIntro>

      <Gallery photos={pics} label={t('photos')} labels={{ close: shell('close'), previous: shell('previous'), next: shell('next') }} />

      {l.is_closed && (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-amber-900">
          {t('closedNotice')} {l.reopening_date ? t('reopens', { date: formatDate(l.reopening_date as string, locale) }) : ''}
        </p>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={await renderLinked(body.text, locale, `/listings/${slug}`)} />

          {/* The host's own words: shown in the page language, or in English as a fallback — not in Greek on a foreign page. */}
          {story.text && (story.native || story.from === 'en') && (
            <section className="mt-10 rounded-2xl bg-sand-50 p-6" lang={story.native ? undefined : story.from ?? undefined}>
              <h2 className="font-display text-xl font-semibold text-slate-900">{t('aboutHost')}</h2>
              <Prose html={await renderLinked(story.text, locale, `/listings/${slug}`)} className="mt-3" />
            </section>
          )}

          {amenities.length > 0 && (
            <section aria-labelledby="amenities" className="mt-10">
              <h2 id="amenities" className="font-display text-2xl font-semibold text-slate-900">{t('amenities')}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-slate-700"><Check className="size-4 text-emerald-600" aria-hidden />{amenityT(a)}</li>
                ))}
              </ul>
            </section>
          )}

          {(rules.length > 0 || rulesExtra.text) && (
            <section aria-labelledby="rules" className="mt-10">
              <h2 id="rules" className="font-display text-2xl font-semibold text-slate-900">{t('houseRules')}</h2>
              {rules.length > 0 && (
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  {rules.map((r) => (
                    <div key={r.label}><dt className="text-slate-500">{r.label}</dt><dd className="font-medium text-slate-900">{r.value}</dd></div>
                  ))}
                </dl>
              )}
              {rulesExtra.text && <Prose html={renderRichText(rulesExtra.text, locale)} className="mt-4" />}
            </section>
          )}

          {extras.length > 0 && (
            <section aria-labelledby="extras" className="mt-10">
              <h2 id="extras" className="font-display text-2xl font-semibold text-slate-900">{t('extras')}</h2>
              <ul className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">
                {extras.map((e) => (
                  <li key={String(e.id)} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
                    <span><span className="font-medium text-slate-900">{pick(e, 'label', locale)}</span>{pick(e, 'description', locale) && <span className="block text-slate-600">{pick(e, 'description', locale)}</span>}</span>
                    <span className="shrink-0 font-medium text-slate-800">{e.included ? t('included') : e.price ? formatPrice(Number(e.price), locale, e.currency || 'EUR') : ''}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div id="inquiry" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {l.price_per_night ? (
              <p className="text-slate-600">
                {common('from')}{' '}
                <span className="text-3xl font-semibold text-slate-900">{formatPrice(Number(l.price_per_night), locale)}</span>{' '}
                {t('perNight')}
              </p>
            ) : null}
            {l.price_per_night ? <p className="mt-1 text-xs text-slate-500">{t('priceNote')}</p> : null}
            <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
              <li className="flex items-center gap-2"><Check className="size-4 text-emerald-600" aria-hidden />{t('noFees')}</li>
              <li className="flex items-center gap-2"><Check className="size-4 text-emerald-600" aria-hidden />{t('directOwner')}</li>
            </ul>
            <hr className="my-5 border-slate-200" />
            {!l.is_closed && <InquiryForm slug={slug} locale={locale} maxGuests={l.guests_max} labels={labels} />}
            {phone && (
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-sea-200 px-4 py-3 font-semibold text-sea-800 hover:bg-sea-50">
                <Phone className="size-4" aria-hidden />{t('call')}: {phone}
              </a>
            )}
          </div>
          {geo && <MapEmbed lat={l.latitude!} lng={l.longitude!} title={name} directionsLabel={common('directions')} />}
        </aside>
      </div>

      {Boolean(l.show_calendar) && <AvailabilityCalendar listingId={l.id} locale={locale} title={t('availability')} labels={{ free: t('availabilityFree'), busy: t('availabilityBusy'), updated: t.raw('availabilityUpdated') as string }} />}
      {reviews.length > 0 && <Reviews locale={locale} title={t('reviews')} empty={t('noReviews')} reviews={reviews} rating={rating} />}
      <div className="max-w-2xl">
        <ReviewForm type="listing" itemId={String(l.id)} itemName={name} />
      </div>
      <div className="mt-8">
        <ShareButtons title={name} />
      </div>
      <RecentlyViewed type="listing" slug={slug} title={name} image={pics[0]?.url} />

      {/* Phones: the price and the request form sit after the whole description, so they stay one tap away.
          Takes the place of the site's bottom bar on this page (BottomNav hides itself here). */}
      {(!l.is_closed || phone) && (
        <>
          <div className="h-20 md:hidden" aria-hidden />
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
            <div className="flex items-center gap-3">
              {l.price_per_night ? (
                <p className="min-w-0 flex-1 text-sm leading-tight text-slate-600">
                  {common('from')} <span className="text-lg font-semibold text-slate-900">{formatPrice(Number(l.price_per_night), locale)}</span>
                  <span className="block text-xs">{t('perNight')}</span>
                </p>
              ) : <span className="flex-1" />}
              {phone && (
                <a href={`tel:${phone.replace(/s+/g, '')}`} aria-label={`${t('call')}: ${phone}`} className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-sea-200 text-sea-800">
                  <Phone className="size-5" aria-hidden />
                </a>
              )}
              {!l.is_closed && (
                <a href="#inquiry" className="shrink-0 rounded-xl bg-sea-600 px-4 py-3 text-sm font-semibold text-white">{t('formTitle')}</a>
              )}
            </div>
          </div>
        </>
      )}
      <Faq title={t('faqTitle')} items={faqs} />

      {beaches.length > 0 && (
        <Section id="nearby-beaches" title={t('nearbyBeaches')}>
          <CardGrid>
            {beaches.map(({ item, km }) => (
              <Card key={item.slug} href={`/beaches/${item.slug}`}
                favorite={{ type: 'beach', slug: item.slug }} title={displayName(item, locale, 'beach')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'beach')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {food.length > 0 && (
        <Section id="nearby-food" title={t('nearbyFood')}>
          <CardGrid>
            {food.map(({ item, km }) => (
              <Card key={item.slug} href={`/restaurants/${item.slug}`}
                favorite={{ type: 'restaurant', slug: item.slug }} title={displayName(item, locale, 'restaurant')} image={item.image_url} imageAlt={greekAlt(item.image_alt, locale)} distance={formatDistance(km, locale)} {...ratingProps(item, 'restaurant')} />
            ))}
          </CardGrid>
        </Section>
      )}
      {village && (
        <p className="mt-10 text-sm">
          <Link href={`/places/${village.item.slug}`} className="font-semibold text-sea-700 hover:underline">{villageName} →</Link>
        </p>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          '@id': `${localeUrl(locale, `/listings/${slug}`)}#lodging`,
          name,
          description: plainText(body.text, 300),
          image: pics.slice(0, 6).map((p) => p.url),
          url: localeUrl(locale, `/listings/${slug}`),
          address: addressLd(villageName),
          geo: geoLd(l),
          telephone: phone || undefined,
          numberOfRooms: l.bedrooms,
          priceRange: l.price_per_night ? `${formatPrice(Number(l.price_per_night), 'en')}+` : undefined,
          checkinTime: (l.check_in_time as string) || undefined,
          checkoutTime: (l.check_out_time as string) || undefined,
          petsAllowed: l.rule_pets === 'allowed' ? true : l.rule_pets === 'not_allowed' ? false : undefined,
          amenityFeature: amenities.map((a) => ({ '@type': 'LocationFeatureSpecification', name: amenityT(a), value: true })),
          aggregateRating: ratingLd(rating.rating, rating.count),
        }}
      />
    </Container>
  );
}
