'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Listing } from '@/types';
import { AREAS } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { MapPin, Users, BedDouble, Bath, Phone, Mail, Loader2, ExternalLink, Calendar, MessageSquare, X, Send } from 'lucide-react';
import { logEvent } from '@/lib/logger';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AmenityBadge } from './AmenityBadge';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { RelatedContent } from './RelatedContent';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { JsonLd } from '@/components/ui/JsonLd';
import { generateLodgingLD } from '@/lib/seo';
import { LocationMap } from '@/components/ui/LocationMap';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';
import { addRecentlyViewed } from '@/lib/use-recently-viewed';
import { RecentlyViewed } from '@/components/ui/RecentlyViewed';

export function DynamicListingDetail({ slug, locale }: { slug: string; locale: string }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('listings.details');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  useEffect(() => {
    fetch(`/api/listings?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => { if (data && data.id) setListing(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

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
  const coverImage = listing.images?.find((img) => img.is_cover) || listing.images?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext = listing as any;
  const bookingUrl = ext.booking_url as string | null;
  const airbnbUrl = ext.airbnb_url as string | null;
  const contactPhone = ext.contact_phone as string | null;
  const contactEmail = ext.contact_email as string | null;

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
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <ShareButtons title={title} compact />
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" /><span>{listing.location_name}</span>
              {area && (<><span className="text-gray-300">|</span>
                <Link href={`/areas/${listing.area}`} className="text-primary-600 hover:underline">{area.name[locale]}</Link>
              </>)}
            </div>
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

          <ShareButtons title={title} description={description} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <div className="text-sm text-gray-500">{tCommon('from')}</div>
              <div className="text-3xl font-bold text-gray-900">
                &euro;{listing.price_per_night}
                <span className="text-lg font-normal text-gray-500">{tCommon('perNight')}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">* Η τελική τιμή μπορεί να διαφέρει ανάλογα την εποχή</p>
            </div>
            <hr />
            {/* Booking buttons with tracking */}
            {(listing as any).website_url && (
              <a href={(listing as any).website_url} target="_blank" rel="noopener noreferrer"
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'website' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Website
              </a>
            )}
            {bookingUrl && (
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'booking.com' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#003580] hover:bg-[#00264d] text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Booking.com
              </a>
            )}
            {airbnbUrl && (
              <a href={airbnbUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'airbnb' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5A5F] hover:bg-[#e04e53] text-white font-medium rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" />Airbnb
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone}`}
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'phone' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors">
                <Phone className="w-4 h-4" />{contactPhone}
              </a>
            )}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`}
                onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'email' })}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
                <Mail className="w-4 h-4" />{contactEmail}
              </a>
            )}
            <hr />
            <InquiryButton slug={slug} title={title} />
          </div>
        </div>
      </div>

      <RelatedContent area={listing.area} currentSlug={listing.slug} />

      <RecentlyViewed currentSlug={slug} />

      {/* Mobile sticky booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <span className="text-xl font-bold text-gray-900">&euro;{listing.price_per_night}</span>
            <span className="text-sm text-gray-500"> {tCommon('perNight')}</span>
          </div>
          {bookingUrl ? (
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'booking.com' })}
              className="px-6 py-2.5 bg-[#003580] text-white font-semibold rounded-xl text-sm">
              Κράτηση
            </a>
          ) : contactPhone ? (
            <a href={`tel:${contactPhone}`}
              onClick={() => logEvent('user_action', 'info', 'Booking click', { listing_slug: slug, type: 'phone' })}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm flex items-center gap-2">
              <Phone className="w-4 h-4" /> Κλήση
            </a>
          ) : (
            <a href={`mailto:${contactEmail || ''}`}
              className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl text-sm">
              Επικοινωνία
            </a>
          )}
        </div>
      </div>
      {/* Spacer for mobile sticky bar */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}

function InquiryButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', checkin: '', checkout: '', guests: '2', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    setSending(true);
    try {
      await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, listing_slug: slug, listing_title: title }),
      });
      logEvent('user_action', 'info', 'Inquiry submitted', { listing_slug: slug });
      setSuccess(true);
    } catch {}
    setSending(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors">
        <Calendar className="w-4 h-4" />
        Ζητήστε Διαθεσιμότητα
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Ζητήστε Διαθεσιμότητα</h3>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-gray-900">Το αίτημά σας στάλθηκε!</h4>
                <p className="text-sm text-gray-500 mt-1">Ο ιδιοκτήτης θα επικοινωνήσει μαζί σας σύντομα.</p>
                <button onClick={() => setOpen(false)} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg">OK</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div className="absolute opacity-0 -z-10" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                  <input type="text" name="fax" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Όνομα *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Τηλέφωνο</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
                    <input type="date" value={form.checkin} onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Check-out</label>
                    <input type="date" value={form.checkout} onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Άτομα</label>
                    <input type="number" min="1" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Μήνυμα</label>
                  <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="π.χ. Θα ήθελα να μάθω αν είναι διαθέσιμο..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl disabled:opacity-50">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Αποστολή...' : 'Αποστολή'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
