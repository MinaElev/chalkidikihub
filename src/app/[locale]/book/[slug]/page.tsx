import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createApiClient } from '@/lib/api-helpers';
import {
  Wrench, Phone, Mail, MessageCircle, Globe, ArrowLeft, Sparkles, Clock,
} from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string; slug: string }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const el = locale === 'el';
  return {
    title: el ? 'Online κρατήσεις — υπό κατασκευή' : 'Online booking — under construction',
    robots: { index: false, follow: true },
  };
}

const T: Record<string, Record<string, string>> = {
  underConstruction: {
    el: 'Οι online κρατήσεις είναι υπό κατασκευή',
    en: 'Online booking is under construction',
    de: 'Online-Buchungen in Arbeit',
    bg: 'Онлайн резервациите са в процес на разработка',
    ru: 'Онлайн-бронирование в разработке',
    ro: 'Rezervările online sunt în construcție',
    sr: 'Online rezervacije su u izradi',
  },
  comingSoon: {
    el: 'Σύντομα κοντά σας!',
    en: 'Coming soon!',
    de: 'Bald verfügbar!',
    bg: 'Очаквайте скоро!',
    ru: 'Скоро!',
    ro: 'În curând!',
    sr: 'Uskoro!',
  },
  meanwhile: {
    el: 'Προς το παρόν, επικοινωνήστε απευθείας με τον ιδιοκτήτη:',
    en: 'For now, please contact the owner directly:',
    de: 'Bitte kontaktieren Sie vorerst den Eigentümer direkt:',
    bg: 'Междувременно се свържете директно със собственика:',
    ru: 'А пока свяжитесь с владельцем напрямую:',
    ro: 'Deocamdată, contactați direct proprietarul:',
    sr: 'Za sada kontaktirajte direktno vlasnika:',
  },
  call: {
    el: 'Κλήση', en: 'Call', de: 'Anrufen', bg: 'Обаждане',
    ru: 'Позвонить', ro: 'Sunați', sr: 'Pozovi',
  },
  whatsapp: {
    el: 'WhatsApp', en: 'WhatsApp', de: 'WhatsApp', bg: 'WhatsApp',
    ru: 'WhatsApp', ro: 'WhatsApp', sr: 'WhatsApp',
  },
  email: {
    el: 'Email', en: 'Email', de: 'E-Mail', bg: 'Имейл',
    ru: 'Email', ro: 'Email', sr: 'Email',
  },
  website: {
    el: 'Ιστοσελίδα', en: 'Website', de: 'Webseite', bg: 'Уебсайт',
    ru: 'Сайт', ro: 'Site web', sr: 'Sajt',
  },
  backToListing: {
    el: 'Πίσω στο κατάλυμα',
    en: 'Back to the listing',
    de: 'Zurück zur Unterkunft',
    bg: 'Обратно към имота',
    ru: 'Назад к объявлению',
    ro: 'Înapoi la anunț',
    sr: 'Nazad na smeštaj',
  },
  noContact: {
    el: 'Τα στοιχεία επικοινωνίας δεν είναι διαθέσιμα αυτή τη στιγμή.',
    en: 'Contact details are not available at the moment.',
    de: 'Kontaktdaten sind derzeit nicht verfügbar.',
    bg: 'Данните за контакт в момента не са налични.',
    ru: 'Контактные данные в данный момент недоступны.',
    ro: 'Datele de contact nu sunt disponibile momentan.',
    sr: 'Kontakt podaci trenutno nisu dostupni.',
  },
};

const tr = (k: string, locale: string) => T[k]?.[locale] || T[k]?.en || k;

export default async function BookingUnderConstructionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = createApiClient();
  const { data: listing, error } = await supabase
    .from('listings')
    .select('slug, title_el, title_en, contact_phone, contact_email, website_url, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !listing) notFound();

  const el = locale === 'el';
  const title = el
    ? (listing.title_el || listing.title_en || slug)
    : (listing.title_en || listing.title_el || slug);

  const phone = listing.contact_phone as string | null;
  const email = listing.contact_email as string | null;
  const website = listing.website_url as string | null;
  const waHref = phone ? `https://wa.me/${String(phone).replace(/[^0-9]/g, '')}` : null;
  const hasContact = Boolean(phone || email || website);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-5">
        {/* Header card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {tr('underConstruction', locale)}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            {tr('comingSoon', locale)}
          </div>
          <div className="mt-5 text-sm text-slate-600 leading-relaxed">
            <div className="font-semibold text-slate-800 mb-1">{title}</div>
            <p className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {tr('meanwhile', locale)}
            </p>
          </div>
        </div>

        {/* Contact card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          {hasContact ? (
            <div className="space-y-2.5">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white inline-flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {tr('call', locale)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">{phone}</div>
                  </div>
                </a>
              )}

              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-green-50 hover:bg-green-100 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500 text-white inline-flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                      {tr('whatsapp', locale)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">{phone}</div>
                  </div>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-sky-50 hover:bg-sky-100 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white inline-flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                      {tr('email', locale)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">{email}</div>
                  </div>
                </a>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-4 py-3 bg-violet-50 hover:bg-violet-100 rounded-2xl transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500 text-white inline-flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      {tr('website', locale)}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 truncate">{website}</div>
                  </div>
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600 text-center py-4">{tr('noContact', locale)}</p>
          )}
        </div>

        <Link
          href={`/stay/${slug}`}
          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('backToListing', locale)}
        </Link>
      </div>
    </div>
  );
}
