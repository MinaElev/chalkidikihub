'use client';
import { Inbox } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsMessagesPage() {
  return (
    <PmsModulePlaceholder
      icon={Inbox}
      accent="violet"
      title={{ el: 'Ενοποιημένα Μηνύματα', en: 'Unified Messages' }}
      lede={{
        el: 'Ένα inbox για όλα τα μηνύματα — direct, email, Airbnb, Booking, WhatsApp. Ένα thread ανά κράτηση, με αυτόματη μετάφραση στη γλώσσα του guest.',
        en: 'One inbox for every message — direct, email, Airbnb, Booking, WhatsApp. One thread per booking, with auto-translation to the guest\'s language.',
      }}
      competitorPitch={{
        el: 'Hospitable & Guesty χρεώνουν €30-50/μήνα για unified inbox. 75% των κρατήσεων πάνε στον πρώτο που απαντά — αυτό εδώ είναι revenue, όχι feature.',
        en: 'Hospitable & Guesty charge €30-50/month for a unified inbox. 75% of bookings go to whoever replies first — this is revenue, not just a feature.',
      }}
      roadmap={{
        el: [
          { title: 'Inbox UI με threads ανά κράτηση', desc: 'Αριστερά λίστα, δεξιά conversation, read/unread indicators.', eta: 'Phase 2' },
          { title: 'Auto-translate guest ↔ owner', desc: 'Ο guest γράφει DE, εσύ διαβάζεις EL, απαντάς EL, αυτός παίρνει DE. Seamless.', eta: 'Phase 2' },
          { title: 'SMS notifications', desc: 'Twilio push → owner παίρνει SMS όταν έρχεται νέο μήνυμα.', eta: 'Phase 2' },
          { title: 'WhatsApp Business API', desc: 'Συνομιλίες με guests που προτιμούν WhatsApp, μέσα από το ίδιο inbox.', eta: 'Phase 3' },
          { title: 'Airbnb/Booking message sync', desc: 'Μέσω email parsing (platforms forwardάρουν messages σε email).', eta: 'Phase 3' },
          { title: 'Quick-reply με templates', desc: '1-click insertion από template library, με personalization.', eta: 'Phase 2' },
        ],
        en: [
          { title: 'Inbox UI with per-booking threads', desc: 'List on left, conversation on right, read/unread indicators.', eta: 'Phase 2' },
          { title: 'Auto-translate guest ↔ owner', desc: 'Guest writes DE, you read EL, reply EL, they get DE. Seamless.', eta: 'Phase 2' },
          { title: 'SMS notifications', desc: 'Twilio push — owner gets an SMS when a new message arrives.', eta: 'Phase 2' },
          { title: 'WhatsApp Business API', desc: 'Chat with guests who prefer WhatsApp, from the same inbox.', eta: 'Phase 3' },
          { title: 'Airbnb/Booking message sync', desc: 'Via email forwarding (the platforms forward messages to email).', eta: 'Phase 3' },
          { title: 'Quick-reply with templates', desc: '1-click insertion from template library, with personalization.', eta: 'Phase 2' },
        ],
      }}
    />
  );
}
