'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  MapPin, Users, BedDouble, Bath, Phone, Mail, MessageCircle,
  BookOpen, Sparkles, Home as HomeIcon, ExternalLink, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { AREAS } from '@/lib/constants';
import { AmenityBadge } from '@/components/listings/AmenityBadge';
import type { Amenity } from '@/types';
import { LocationMap } from '@/components/ui/LocationMap';
import { NearbySection } from '@/components/listings/NearbySection';
import { ListingFaqs } from '@/components/listings/ListingFaqs';
import { EmergencyContacts } from '@/components/listings/EmergencyContacts';
import { PublicAvailabilityCalendar } from '@/components/listings/PublicAvailabilityCalendar';
import { AutoLinkedContent } from '@/components/blog/AutoLinkedContent';
import { ShareButtons } from '@/components/ui/ShareButtons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listing = any;

const LABELS: Record<string, Record<string, string>> = {
  ourStory: {
    el: 'Η ιστορία μας', en: 'Our Story', de: 'Unsere Geschichte',
    bg: 'Нашата история', ru: 'Наша история', ro: 'Povestea noastră', sr: 'Naša priča',
  },
  amenities: {
    el: 'Τι θα βρείτε', en: 'What you\'ll find', de: 'Was Sie finden',
    bg: 'Какво ще намерите', ru: 'Что вас ждёт', ro: 'Ce veți găsi', sr: 'Šta ćete naći',
  },
  description: {
    el: 'Για το κατάλυμα', en: 'About the place', de: 'Über die Unterkunft',
    bg: 'За имота', ru: 'О жилье', ro: 'Despre locuință', sr: 'O smeštaju',
  },
  location: {
    el: 'Τοποθεσία', en: 'Location', de: 'Lage',
    bg: 'Местоположение', ru: 'Расположение', ro: 'Locație', sr: 'Lokacija',
  },
  availability: {
    el: 'Διαθεσιμότητα', en: 'Availability', de: 'Verfügbarkeit',
    bg: 'Наличност', ru: 'Доступность', ro: 'Disponibilitate', sr: 'Dostupnost',
  },
  contact: {
    el: 'Επικοινωνήστε μαζί μας', en: 'Get in touch', de: 'Kontakt aufnehmen',
    bg: 'Свържете се с нас', ru: 'Связаться с нами', ro: 'Contactați-ne', sr: 'Kontaktirajte nas',
  },
  contactHelp: {
    el: 'Έχετε ερωτήσεις; Στείλτε μας ένα μήνυμα και θα απαντήσουμε άμεσα.',
    en: 'Got questions? Send us a message and we\'ll get back to you right away.',
    de: 'Fragen? Schicken Sie uns eine Nachricht und wir melden uns umgehend.',
    bg: 'Имате въпроси? Изпратете ни съобщение и ще отговорим възможно най-бързо.',
    ru: 'Есть вопросы? Напишите нам, и мы свяжемся с вами.',
    ro: 'Aveți întrebări? Trimiteți-ne un mesaj și vă vom răspunde.',
    sr: 'Imate pitanja? Pošaljite nam poruku i javićemo vam se.',
  },
  perNight: {
    el: '/βράδυ', en: '/night', de: '/Nacht', bg: '/нощ', ru: '/ночь', ro: '/noapte', sr: '/noć',
  },
  fromLabel: {
    el: 'Από', en: 'From', de: 'Ab', bg: 'От', ru: 'От', ro: 'De la', sr: 'Od',
  },
  scrollDown: {
    el: 'Συνεχίστε', en: 'Scroll down', de: 'Weiter', bg: 'Превъртете',
    ru: 'Прокрутите', ro: 'Derulați', sr: 'Nastavite',
  },
  guests: {
    el: 'επισκέπτες', en: 'guests', de: 'Gäste', bg: 'гости', ru: 'гостей', ro: 'oaspeți', sr: 'gostiju',
  },
  bedrooms: {
    el: 'υπνοδωμάτια', en: 'bedrooms', de: 'Schlafzimmer', bg: 'спални',
    ru: 'спален', ro: 'dormitoare', sr: 'spavaćih soba',
  },
  bathrooms: {
    el: 'μπάνια', en: 'bathrooms', de: 'Bäder', bg: 'бани', ru: 'ванных', ro: 'băi', sr: 'kupatila',
  },
  alsoOn: {
    el: 'Επίσης στο directory', en: 'Also on our directory', de: 'Auch in unserem Verzeichnis',
    bg: 'Също в нашата директория', ru: 'Также в каталоге', ro: 'Și în directorul nostru', sr: 'Takođe u direktoriju',
  },
};

const lbl = (key: string, locale: string) =>
  LABELS[key]?.[locale] || LABELS[key]?.en || key;

export function StayPage({ listing, locale }: { listing: Listing; locale: string }) {
  const [heroLoaded, setHeroLoaded] = useState(false);

  const title = listing.title[locale] || listing.title.en || listing.title.el || '';
  const description = listing.description[locale] || listing.description.en || listing.description.el || '';
  const tagline: string = listing.tagline?.[locale] || listing.tagline?.en || listing.tagline?.el || '';
  const ownerStory: string =
    listing.owner_story?.[locale] || listing.owner_story?.en || listing.owner_story?.el || '';

  const area = AREAS.find(a => a.slug === listing.area);
  const areaName = area?.name[locale] || area?.name.en || listing.area;
  const coverImage = listing.images?.find((i: { is_cover: boolean }) => i.is_cover) || listing.images?.[0];
  const galleryImages: { id: string; image_url: string }[] =
    (listing.images || []).filter((i: { id: string; image_url: string }) => Boolean(i.image_url));

  const contactPhone = listing.contact_phone;
  const contactEmail = listing.contact_email;
  const waHref = contactPhone
    ? `https://wa.me/${String(contactPhone).replace(/[^0-9]/g, '')}`
    : null;

  return (
    <div className="bg-white">
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative w-full h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden">
        {coverImage?.image_url ? (
          <Image
            src={coverImage.image_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setHeroLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-700" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />

        {/* Breadcrumb on top */}
        <div className="absolute top-4 left-0 right-0 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-white/90 hover:text-white text-sm backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              ChalkidikiHub
            </Link>
            <ShareButtons title={title} compact />
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 px-4 sm:px-8 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              {title}
            </h1>
            {tagline && (
              <p className="mt-3 text-lg md:text-2xl italic font-light text-white/95 max-w-3xl drop-shadow">
                {tagline}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2 text-white/90 text-sm md:text-base">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {listing.location_name}
              </span>
              <span className="text-white/50">·</span>
              <Link
                href={`/areas/${listing.area}`}
                className="underline decoration-white/40 hover:decoration-white"
              >
                {areaName}
              </Link>
            </div>

            {/* CTA bar */}
            <div className="mt-6 flex flex-wrap gap-2">
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              )}
              {contactPhone && (
                <a
                  href={`tel:${contactPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl transition-colors shadow-lg"
                >
                  <Phone className="w-4 h-4" /> {contactPhone}
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/90 hover:bg-white text-gray-900 font-medium rounded-xl transition-colors shadow-lg"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/70 text-xs animate-bounce">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ══════════════ QUICK FACTS ══════════════ */}
      <section className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-400" /> {listing.guests_max} {lbl('guests', locale)}</div>
          <div className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-gray-400" /> {listing.bedrooms} {lbl('bedrooms', locale)}</div>
          <div className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-gray-400" /> {listing.bathrooms} {lbl('bathrooms', locale)}</div>
          <div className="ml-auto font-semibold text-gray-900">
            <span className="text-xs font-normal text-gray-500">{lbl('fromLabel', locale)} </span>
            €{listing.price_per_night}
            <span className="text-xs font-normal text-gray-500">{lbl('perNight', locale)}</span>
          </div>
        </div>
      </section>

      {/* ══════════════ OUR STORY ══════════════ */}
      {ownerStory && (
        <section className="py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              {lbl('ourStory', locale)}
            </div>
            <div className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-line font-light">
              {ownerStory}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ GALLERY ══════════════ */}
      {galleryImages.length > 1 && (
        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {galleryImages.slice(0, 8).map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden bg-gray-100 ${
                    idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ DESCRIPTION ══════════════ */}
      {description && (
        <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              {lbl('description', locale)}
            </h2>
            <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
              <AutoLinkedContent content={description} />
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ AMENITIES ══════════════ */}
      {listing.amenities?.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              {lbl('amenities', locale)}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {(listing.amenities as Amenity[]).map((a) => (
                <AmenityBadge key={a} amenity={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ NEARBY (auto) ══════════════ */}
      {listing.latitude && listing.longitude && listing.latitude !== 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <NearbySection listingId={listing.id} />
          </div>
        </section>
      )}

      {/* ══════════════ LOCATION MAP ══════════════ */}
      {listing.latitude && listing.longitude && listing.latitude !== 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary-500" />
              {lbl('location', locale)}
            </h2>
            <LocationMap latitude={listing.latitude} longitude={listing.longitude} name={title} />
          </div>
        </section>
      )}

      {/* ══════════════ AVAILABILITY ══════════════ */}
      {/* Always shown on the /stay brand page — the show_calendar flag only
          governs whether it appears on the simpler /listings directory page. */}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <PublicAvailabilityCalendar
            listingId={listing.id}
            enabled={true}
          />
        </div>
      </section>

      {/* ══════════════ FAQs ══════════════ */}
      <section className="py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <ListingFaqs listingId={listing.id} />
        </div>
      </section>

      {/* ══════════════ EMERGENCY CONTACTS ══════════════ */}
      <section className="py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <EmergencyContacts listingId={listing.id} />
        </div>
      </section>

      {/* ══════════════ CONTACT CTA ══════════════ */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{lbl('contact', locale)}</h2>
          <p className="text-white/90 mb-7 max-w-xl mx-auto">{lbl('contactHelp', locale)}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-lg"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-primary-700 font-medium rounded-xl shadow-lg"
              >
                <Phone className="w-5 h-5" /> {contactPhone}
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-primary-700 font-medium rounded-xl shadow-lg"
              >
                <Mail className="w-5 h-5" /> {contactEmail}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER — directory link ══════════════ */}
      <section className="py-8 px-4 sm:px-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <Link
            href={`/listings/${listing.slug}`}
            className="inline-flex items-center gap-1 hover:text-primary-600"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {lbl('alsoOn', locale)}
          </Link>
        </div>
      </section>
    </div>
  );
}
