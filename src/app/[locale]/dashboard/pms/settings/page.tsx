'use client';
import { Settings } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsSettingsPage() {
  return (
    <PmsModulePlaceholder
      icon={Settings}
      accent="slate"
      title={{ el: 'Ρυθμίσεις PMS', en: 'PMS Settings' }}
      lede={{
        el: 'Πολιτικές κράτησης (check-in ώρες, min nights, προετοιμασία), Stripe Connect για direct payments, φορολογικά στοιχεία (ΑΜΑ, ΑΦΜ, ΦΠΑ), SMS notifications.',
        en: 'Booking policies (check-in times, min nights, buffer), Stripe Connect for direct payments, tax info (AMA, AFM, VAT), SMS notifications.',
      }}
      competitorPitch={{
        el: 'Κάθε PMS έχει settings screen. Ο δικός μας είναι ο μοναδικός που ξέρει την ΑΜΑ και αυτόματα προσθέτει 13% ΦΠΑ στα timologia τουριστικής χρήσης.',
        en: 'Every PMS has a settings screen. Ours is the only one that understands AMA and auto-applies Greek 13% tourism VAT to invoices.',
      }}
      roadmap={{
        el: [
          { title: 'Πολιτικές κράτησης', desc: 'Check-in/out times, min/max nights, advance notice, preparation buffer.', eta: 'Phase 1' },
          { title: 'Cancellation policy', desc: 'Flexible (refund 24h) / Moderate (refund 7d) / Strict (no refund) / Custom.', eta: 'Phase 1' },
          { title: 'Stripe Connect onboarding', desc: 'Σύνδεση Stripe account για να λαμβάνεις direct payments (0% προμήθεια).', eta: 'Phase 1' },
          { title: 'ΑΜΑ, ΑΦΜ, ΦΠΑ', desc: 'Τα περιλαμβάνουμε αυτόματα στα email confirmations για νόμιμη τιμολόγηση.', eta: 'Phase 1' },
          { title: 'Τουριστικός φόρος ανά listing', desc: 'Προαιρετικό, αυτόματο rate based στην κατηγορία καταλύματος.', eta: 'Phase 2' },
          { title: 'SMS/email notification preferences', desc: 'Ποια events θέλεις να σε ειδοποιούν (νέα κράτηση, message, κλπ).', eta: 'Phase 2' },
          { title: 'Bulk settings import', desc: 'Αν έχεις πολλά listings, εφάρμοσε τις ίδιες πολιτικές παντού με 1 κλικ.', eta: 'Phase 3' },
        ],
        en: [
          { title: 'Booking policies', desc: 'Check-in/out times, min/max nights, advance notice, preparation buffer.', eta: 'Phase 1' },
          { title: 'Cancellation policy', desc: 'Flexible (24h refund) / Moderate (7d refund) / Strict (no refund) / Custom.', eta: 'Phase 1' },
          { title: 'Stripe Connect onboarding', desc: 'Link your Stripe account to receive direct payments (0% commission).', eta: 'Phase 1' },
          { title: 'AMA, AFM, VAT', desc: 'Auto-included in email confirmations for compliant Greek invoicing.', eta: 'Phase 1' },
          { title: 'Per-listing tourism tax', desc: 'Optional, auto-rate based on accommodation category.', eta: 'Phase 2' },
          { title: 'SMS/email notification preferences', desc: 'Pick which events notify you (new booking, message, etc).', eta: 'Phase 2' },
          { title: 'Bulk settings import', desc: 'Many listings? Apply the same policies everywhere with 1 click.', eta: 'Phase 3' },
        ],
      }}
    />
  );
}
