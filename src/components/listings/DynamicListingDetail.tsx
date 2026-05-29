'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Listing } from '@/types';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
  Phone,
  Mail,
  Loader2,
  ExternalLink,
  Calendar,
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { logEvent } from '@/lib/logger';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AmenityBadge } from './AmenityBadge';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RelatedContent } from './RelatedContent';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { generateListingFaqs } from '@/lib/faq-generators';
import { FaqSection } from '@/components/ui/FaqSection';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateLodgingLD } from '@/lib/seo';
import { LocationMap } from '@/components/ui/LocationMap';
import { PublicAvailabilityCalendar } from './PublicAvailabilityCalendar';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';
import { addRecentlyViewed } from '@/lib/use-recently-viewed';
import { RecentlyViewed } from '@/components/ui/RecentlyViewed';

export function DynamicListingDetail({ slug, locale, initialData }: { slug: string; locale: string; initialData?: Listing | null }) {
  const [listing, setListing] = useState<Listing | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const t = useTranslations('listings.details');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tDetail = useTranslations('detail');
  const tInquiry = useTranslations('inquiry');

  useEffect(() => {
    if (!initialData) {
      fetch(`/api/listings?slug=${slug}`)
        .then((r) => r.json())
        .then((data) => { if (data && data.id) setListing(data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug, initialData]);

  useEffect(() => {
    if (listing) {
      addRecentlyViewed({
        type: 'listing',
        slug: listing.slug,
        title: listing.title[locale] || listing.title.en,
        image: listing.images?.[0]?.image_url,
      });
    }
  }, [listing, locale]);

  if (loading) return <DetailSkeleton />;

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-500">{tCommon('error')}</p>
        <Link href="/listings" className="mt-4 inline-flex text-primary-600 hover:underline">
          {tCommon('backToHome')}
        </Link>
      </div>
    );
  }

  const area = AREAS.find((a) => a.slug === listing.area);
  const title = listing.title[locale] || listing.title.en || listing.title.el;
  const description = listing.description[locale] || listing.description.en || listing.description.el;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = listing as any;
  const bookingUrl = ext.booking_url as string | null;
  const airbnbUrl = ext.airbnb_url as string | null;
  const websiteUrl = ext.website_url as string | null;
  const contactPhone = ext.contact_phone as string | null;
  const contactEmail = ext.contact_email as string | null;
  const verified = Boolean(ext.verified);
  const hasExternal = Boolean(bookingUrl || airbnbUrl || websiteUrl);
  const hasBrandPage = Boolean(
    (ext.tagline?.el as string)?.trim() ||
    (ext.tagline?.en as string)?.trim() ||
    (ext.owner_story?.el as string)?.trim() ||
    (ext.owner_story?.en as string)?.trim()
  );
  const visitSiteLabels: Record<string, string> = {
    el: 'Δείτε το site του καταλύματος →',
    en: 'Visit this property\'s site →',
    de: 'Website der Unterkunft →',
    bg: 'Посетете сайта на имота →',
    ru: 'Посетить сайт →',
    ro: 'Vizitați site-ul proprietății →',
    sr: 'Posetite sajt →',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JsonLd data={generateLodgingLD(listing as unknown as Record<string, unknown>, locale)} />
      <Breadcrumbs items={[{ label: tNav('listings'), href: '/listings' }, { label: title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery with Lightbox */}
          <ImageGallery images={listing.images || []} alt={title} />

          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {({ el: 'Επαληθευμένο', en: 'Verified', de: 'Verifiziert', bg: 'Потвърдено', ru: 'Проверено', ro: 'Verificat', sr: 'Verifikovano' } as Record<string, string>)[locale] || 'Verified'}
                  </span>
                )}
              </div>
              <ShareButtons title={title} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" /><span>{listing.location_name}</span>
              {area && (<><span className="text-gray-300">|</span>
                <Link href={`/areas/${listing.area}`} className="text-primary-600 hover:underline">{area.name[locale]}</Link>
              </>)}
            </div>
            {hasBrandPage && (
              <Link
                href={`/stay/${listing.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-medium rounded-xl transition-colors"
              >
                ✨ {visitSiteLabels[locale] || visitSiteLabels.en}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-6 py-4 border-y border-gray-200">
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.guests_max} {tCommon('guests')}</span></div>
            <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.bedrooms} {tCommon('bedrooms')}</span></div>
            <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-gray-400" /><span className="text-sm">{listing.bathrooms} {tCommon('bathrooms')}</span></div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('description')}</h2>
            <AutoLinkedContent content={description} />
          </div>

          {listing.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('amenities')}</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (<AmenityBadge key={amenity} amenity={amenity} />))}
              </div>
            </div>
          )}

          {/* Map */}
          {listing.latitude && listing.longitude && listing.latitude !== 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('location')}</h2>
              <LocationMap latitude={listing.latitude} longitude={listing.longitude} name={title} />
            </div>
          )}

          {/* Availability Calendar (only shown if owner enabled it and has set dates) */}
          <PublicAvailabilityCalendar
            listingId={listing.id}
            enabled={Boolean((listing as unknown as { show_calendar?: boolean }).show_calendar)}
          />

          <ShareButtons title={title} description={description} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            {/* Price block */}
            <div>
              <div className="text-sm text-gray-500">{tCommon('from')}</div>
              <div className="text-3xl font-bold text-gray-900">
                &euro;{listing.price_per_night}
                <span className="text-lg font-normal text-gray-500">{tCommon('perNight')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{tDetail('priceNote')}</p>
            </div>

            {/* Trust signals */}
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>{tDetail('trustNoFees')}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{tDetail('trustDirectOwner')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{tDetail('trustFastReply')}</span>
              </li>
            </ul>

            <hr />

            {/* PRIMARY CTA — direct inquiry to owner */}
            <button
              onClick={() => {
                setInquiryOpen(true);
                logEvent('user_action', 'info', 'Inquiry opened', { listing_slug: slug });
              }}
              className="w-full flex flex-col items-center justify-center gap-1 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              <span className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5" />
                {tInquiry('requestAvailability')}
              </span>
              <span className="text-[11px] font-normal text-white/85">
                {tInquiry('instantResponse')}
              </span>
            </button>

            {/* Direct phone (still prominent but secondary) */}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'phone' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />{contactPhone}
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'email' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 border border-primary-600 text-primary-600 hover:bg-primary-50 text-sm font-medium rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />{contactEmail}
              </a>
            )}

            {/* External (de-emphasised) */}
            {hasExternal && (
              <div className="pt-2">
                <div className="text-xs text-gray-400 mb-2 text-center">{tDetail('alsoAvailableOn')}</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {websiteUrl && (
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                      onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'website' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <ExternalLink className="w-3 h-3" />Website
                    </a>
                  )}
                  {bookingUrl && (
                    <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                      onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'booking.com' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <ExternalLink className="w-3 h-3" />Booking.com
                    </a>
                  )}
                  {airbnbUrl && (
                    <a href={airbnbUrl} target="_blank" rel="noopener noreferrer"
                      onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'airbnb' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <ExternalLink className="w-3 h-3" />Airbnb
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedContent area={listing.area} currentSlug={listing.slug} />

      <RecentlyViewed currentSlug={slug} />

      {/* Mobile sticky booking bar — primary = inquiry */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-3">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <div className="flex-shrink-0">
            <span className="text-lg font-bold text-gray-900">&euro;{listing.price_per_night}</span>
            <span className="text-xs text-gray-500 block leading-none">{tCommon('perNight')}</span>
          </div>
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'phone' })}
              aria-label={tInquiry('call')}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-green-600 text-white rounded-xl"
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={() => {
              setInquiryOpen(true);
              logEvent('user_action', 'info', 'Inquiry opened', { listing_slug: slug, source: 'mobile_sticky' });
            }}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {tInquiry('requestAvailability')}
          </button>
        </div>
      </div>
      <FaqSection faqs={generateListingFaqs(listing as unknown as Record<string, unknown>, locale)} />

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        slug={slug}
        title={title}
      />
    </div>
  );
}

function InquiryModal({ open, onClose, slug, title }: { open: boolean; onClose: () => void; slug: string; title: string }) {
  const tInquiry = useTranslations('inquiry');
  const [step, setStep] = useState<1 | 2>(1);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', checkin: '', checkout: '', guests: '2', message: '' });
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reset on open
      setStep(1);
      setSuccess(false);
      // Autofocus
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [open]);

  async function submitInquiry() {
    if (honeypot) return;
    setSending(true);
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_slug: slug, listing_title: title }),
      });
      logEvent('user_action', 'info', 'Inquiry submitted', { listing_slug: slug, has_phone: !!form.phone, has_message: !!form.message });
      setSuccess(true);
    } catch {
      // swallow; in real prod we'd surface an error toast
    }
    setSending(false);
  }

  function step1Valid() {
    return form.name.trim().length > 0 && /\S+@\S+\.\S+/.test(form.email);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">{tInquiry('requestAvailability')}</h3>
            {!success && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {tInquiry('stepOf', { current: step, total: 2 })}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-gray-900">{tInquiry('requestSent')}</h4>
            <p className="text-sm text-gray-500 mt-1">{tInquiry('ownerWillContact')}</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg">OK</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) {
                if (step1Valid()) setStep(2);
              } else {
                submitInquiry();
              }
            }}
            className="p-4 space-y-3"
          >
            <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
              <input type="text" name="fax" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{tInquiry('checkIn')}</label>
                    <input type="date" required value={form.checkin} onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">{tInquiry('checkOut')}</label>
                    <input type="date" required value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{tInquiry('guests')}</label>
                  <input type="number" min="1" required value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{tInquiry('name')}</label>
                  <input ref={firstInputRef} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{tInquiry('email')}</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <button
                  type="submit"
                  disabled={!step1Valid()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  {tInquiry('continueLabel')}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {tInquiry('phone').replace(/\s*\*\s*$/, '')} <span className="text-gray-400 font-normal">({tInquiry('optional')})</span>
                  </label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {tInquiry('message').replace(/\s*\*\s*$/, '')} <span className="text-gray-400 font-normal">({tInquiry('optional')})</span>
                  </label>
                  <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={tInquiry('messagePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl"
                  >
                    {tInquiry('back')}
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? tInquiry('sending') : tInquiry('send')}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
