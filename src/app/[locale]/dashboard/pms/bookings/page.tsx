'use client';
import { ClipboardList } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsBookingsPage() {
  return (
    <PmsModulePlaceholder
      icon={ClipboardList}
      accent="emerald"
      title={{ el: 'Κρατήσεις', en: 'Bookings' }}
      lede={{
        el: 'Direct booking engine + unified view από όλες τις πλατφόρμες. Ο guest κλείνει, πληρώνει με Stripe, εσύ παίρνεις 100% — 0% προμήθεια.',
        en: 'Direct booking engine + unified view across every platform. The guest books, pays via Stripe, you keep 100% — 0% commission.',
      }}
      competitorPitch={{
        el: 'Airbnb κρατάει 14-17% προμήθεια. Booking.com 15-18%. Εδώ: 0%. Σε 60 βράδια/χρόνο στα €100 → €840-1080 στην τσέπη σου.',
        en: 'Airbnb takes 14-17% commission. Booking.com 15-18%. Here: 0%. Over 60 nights/year at €100 → €840-1080 back to you.',
      }}
      roadmap={{
        el: [
          { title: 'Λίστα κρατήσεων με φίλτρα', desc: 'Ταξινόμηση ανά listing, ημερομηνία, πηγή, status. Search με όνομα/email.', eta: 'Phase 1' },
          { title: 'Quote builder — guest-facing', desc: 'Στο /listings/[slug] επιλέγεις dates + guests → live breakdown (rate × nights + cleaning + tax).', eta: 'Phase 1' },
          { title: 'Stripe Connect integration', desc: 'Owner συνδέει Stripe account, guest πληρώνει, money goes directly to owner.', eta: 'Phase 1' },
          { title: 'Deposit + balance flow', desc: '20% deposit στην κράτηση, balance auto-charge 14 μέρες πριν το check-in.', eta: 'Phase 1' },
          { title: 'Confirmation emails (6 γλώσσες)', desc: 'Auto-generated email με ICS attachment, QR, house rules.', eta: 'Phase 1' },
          { title: 'Cancellation & refund flows', desc: 'Flexible / moderate / strict policies με αυτόματο refund calculation.', eta: 'Phase 2' },
          { title: 'Inquiry → booking pipeline', desc: 'Όταν κάποιος ρωτάει, ο owner μπορεί να στείλει custom quote προς αποδοχή.', eta: 'Phase 2' },
        ],
        en: [
          { title: 'Bookings list with filters', desc: 'Sort by listing, date, source, status. Search by name/email.', eta: 'Phase 1' },
          { title: 'Quote builder — guest-facing', desc: 'On /listings/[slug] pick dates + guests → live breakdown (rate × nights + cleaning + tax).', eta: 'Phase 1' },
          { title: 'Stripe Connect integration', desc: 'Owner connects Stripe account, guest pays, money goes directly to owner.', eta: 'Phase 1' },
          { title: 'Deposit + balance flow', desc: '20% deposit on book, balance auto-charged 14 days before check-in.', eta: 'Phase 1' },
          { title: 'Confirmation emails (6 languages)', desc: 'Auto-generated email with ICS attachment, QR, house rules.', eta: 'Phase 1' },
          { title: 'Cancellation & refund flows', desc: 'Flexible / moderate / strict policies with automatic refund calculation.', eta: 'Phase 2' },
          { title: 'Inquiry → booking pipeline', desc: 'When someone inquires, owner sends a custom quote to accept.', eta: 'Phase 2' },
        ],
      }}
    />
  );
}
