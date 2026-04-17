'use client';

import { useLocale } from 'next-intl';
import { Lock, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
}

const HEADLINE: Record<string, string> = {
  el: 'Το κατάλυμα είναι προσωρινά κλειστό',
  en: 'This property is temporarily closed',
  de: 'Diese Unterkunft ist vorübergehend geschlossen',
  bg: 'Този имот е временно затворен',
  ru: 'Этот объект временно закрыт',
  ro: 'Această proprietate este temporar închisă',
  sr: 'Ovaj smeštaj je privremeno zatvoren',
};

const REOPENING_LABEL: Record<string, string> = {
  el: 'Επαναλειτουργεί',
  en: 'Reopening on',
  de: 'Wiedereröffnung',
  bg: 'Отваря отново',
  ru: 'Открывается снова',
  ro: 'Redeschidere',
  sr: 'Ponovno otvaranje',
};

const STILL_CAN: Record<string, string> = {
  el: 'Μπορείς ακόμα να επικοινωνήσεις για μελλοντική κράτηση.',
  en: 'You can still reach out for a future booking.',
  de: 'Sie können uns dennoch für eine zukünftige Buchung kontaktieren.',
  bg: 'Все още можете да се свържете за бъдеща резервация.',
  ru: 'Вы всё ещё можете связаться для будущего бронирования.',
  ro: 'Puteți contacta pentru o rezervare viitoare.',
  sr: 'Još uvek možete kontaktirati za buduću rezervaciju.',
};

function formatDate(d: string, locale: string): string {
  try {
    return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d;
  }
}

export function ClosedBanner({ listing }: Props) {
  const locale = useLocale();
  if (!listing?.is_closed) return null;

  const reason: string =
    (listing.closed_reason?.[locale] as string) ||
    (listing.closed_reason?.el as string) ||
    (listing.closed_reason?.en as string) ||
    '';
  const reopening: string | null = listing.reopening_date || null;

  return (
    <div className="relative z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm">
            <Lock className="w-4 h-4" />
          </span>
          <span className="font-semibold">{HEADLINE[locale] || HEADLINE.en}</span>
        </div>
        <div className="flex-1 min-w-0 text-white/95">
          {reason && <span className="mr-2">· {reason}</span>}
          {reopening && (
            <span className="inline-flex items-center gap-1 mr-2">
              <CalendarIcon className="w-3.5 h-3.5 inline" />
              <strong>{REOPENING_LABEL[locale] || REOPENING_LABEL.en}:</strong> {formatDate(reopening, locale)}
            </span>
          )}
        </div>
        <span className="text-xs text-white/80 italic">{STILL_CAN[locale] || STILL_CAN.en}</span>
      </div>
    </div>
  );
}
