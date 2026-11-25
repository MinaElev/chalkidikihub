import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/ui/Layout';
import { isLocale, type Locale } from '@/i18n/config';
import { AREA_OF } from '@/lib/content/place-names';
import { loadAreaInvite } from '@/lib/area-invite';
import { AreaRequestButton } from './_client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Where "Ask every stay on Sithonia" in a guest email lands: the guest's
 * details are already known, so this is one button. Opening the page sends
 * nothing (mail scanners open links); the button does.
 */
export default async function Page({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale: raw, token } = await params;
  setRequestLocale(raw);
  const locale: Locale = isLocale(raw) ? raw : 'en';
  const invite = await loadAreaInvite(token);

  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' });
  return (
    <Container>
      <div className="mx-auto max-w-xl py-10">
        <AreaRequestButton
          token={token}
          locale={locale}
          state={!invite ? 'invalid' : invite.past ? 'past' : invite.existing ? 'sent' : 'ready'}
          existing={invite?.existing ?? null}
          needsPhone={!invite?.phone}
          where={invite ? AREA_OF[invite.area as keyof typeof AREA_OF][locale] : ''}
          summary={invite ? {
            name: invite.name,
            email: invite.email,
            phone: invite.phone,
            checkIn: fmt.format(new Date(invite.checkIn)),
            checkOut: fmt.format(new Date(invite.checkOut)),
            guests: invite.guests,
          } : null}
        />
      </div>
    </Container>
  );
}
