import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, Phone } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { getSales } from '@/lib/db/content';
import { hasCoords } from '@/lib/geo';
import { localize, pick } from '@/lib/i18n/localize';
import { AREA_NAMES } from '@/lib/content/place-names';
import { formatPrice } from '@/lib/content/format';
import { plainText, renderRichText } from '@/lib/content/render';
import { saleImages } from '@/lib/content/sales';
import { buildMetadata } from '@/lib/seo/metadata';
import { assessQuality } from '@/lib/seo/quality';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container, FactList, PageIntro, Prose } from '@/components/ui/Layout';
import { LocaleNotice } from '@/components/ui/LocaleNotice';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { Gallery } from '@/components/stay/Gallery';
import { detailParams } from '@/lib/build-params';

export const revalidate = 3600;

export async function generateStaticParams() {
  return detailParams(async () => (await getSales()).map((s) => ({ slug: s.slug })));
}

const load = async (slug: string) => (await getSales()).find((s) => s.slug === slug) ?? null;

export async function generateMetadata({ params }: PageProps<'/[locale]/sales/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const s = await load(slug);
  if (!s) return {};
  const body = localize(s, 'description', locale);
  const imgs = saleImages(s);
  const passes = assessQuality({ body: body.text, nativeBody: body.native, hasImage: imgs.length > 0, locale }, 'detail').indexable;
  return buildMetadata({
    locale,
    path: `/sales/${slug}`,
    title: pick(s, 'meta_title', locale) || pick(s, 'title', locale),
    description: pick(s, 'meta_description', locale) || plainText(body.text, 155),
    image: imgs[0]?.image_url,
    indexableLocales: passes ? [locale] : [],
  });
}

export default async function SalePage({ params }: PageProps<'/[locale]/sales/[slug]'>) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const s = await load(slug);
  if (!s) notFound();
  const [t, shell, types, feats, common] = await Promise.all([
    getTranslations({ locale, namespace: 'sales' }),
    getTranslations({ locale, namespace: 'shell' }),
    getTranslations({ locale, namespace: 'propertyTypes' }),
    getTranslations({ locale, namespace: 'saleFeatures' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const title = pick(s, 'title', locale);
  const body = localize(s, 'description', locale);
  const photos = saleImages(s).map((i, n) => ({ url: i.image_url, alt: `${title} — ${n + 1}` }));
  const features = ((s.features as string[]) ?? []).filter((f) => feats.has(f)).map((f) => feats(f));
  const price = Number(s.price) || 0;
  const size = Number(s.size_sqm) || 0;
  const phone = String(s.contact_phone ?? '').trim();
  const email = String(s.contact_email ?? '').trim();
  const point = { latitude: (s.latitude as number) ?? null, longitude: (s.longitude as number) ?? null };

  return (
    <Container>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            crumbs={[{ name: shell('home'), path: '/' }, { name: shell('sales'), path: '/sales' }, { name: title, path: `/sales/${slug}` }]}
          />
        }
        title={title}
      >
        {price > 0 && <p className="mt-2 text-2xl font-semibold text-sea-800">{formatPrice(price, locale)}</p>}
      </PageIntro>
      <Gallery photos={photos} label={title} labels={{ close: shell('close'), previous: shell('previous'), next: shell('next') }} />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {!body.native && body.from && <LocaleNotice locale={locale} from={body.from} />}
          <Prose html={renderRichText(body.text, locale)} />
          {features.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold text-slate-900">{t('features')}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {features.map((f) => (
                  <li key={f} className="rounded-full bg-sea-50 px-3 py-1 text-sm text-sea-800">{f}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FactList
            items={[
              { label: t('price'), value: price ? formatPrice(price, locale) : null },
              { label: t('pricePerSqm'), value: price && size ? formatPrice(Math.round(price / size), locale) : null },
              { label: t('size'), value: size ? `${size} ${t('sqm')}` : null },
              { label: t('bedrooms'), value: (s.bedrooms as number) || null },
              { label: t('bathrooms'), value: (s.bathrooms as number) || null },
              { label: t('floor'), value: (s.floor as number | null) ?? null },
              { label: t('yearBuilt'), value: (s.year_built as number) || null },
              { label: t('energyClass'), value: (s.energy_class as string) || null },
              { label: shell('areas'), value: AREA_NAMES[s.area as keyof typeof AREA_NAMES]?.[locale] ?? null },
              { label: t('allTypes'), value: types.has(String(s.property_type)) ? types(String(s.property_type)) : null },
            ]}
          />
          {phone && (
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center justify-center gap-2 rounded-xl bg-sea-600 px-4 py-3 font-semibold text-white hover:bg-sea-700">
              <Phone className="size-4" aria-hidden /> {phone}
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 rounded-xl border border-sea-200 px-4 py-3 font-semibold text-sea-800 hover:bg-sea-50">
              <Mail className="size-4" aria-hidden /> {t('contact')}
            </a>
          )}
          {hasCoords(point) && (
            <MapEmbed lat={point.latitude} lng={point.longitude} title={title} directionsLabel={common('directions')} />
          )}
        </aside>
      </div>
    </Container>
  );
}
