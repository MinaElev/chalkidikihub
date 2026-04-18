'use client';
import { Sparkles } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsAutomationsPage() {
  return (
    <PmsModulePlaceholder
      icon={Sparkles}
      accent="fuchsia"
      title={{ el: 'Αυτοματισμοί Μηνυμάτων', en: 'Message Automations' }}
      lede={{
        el: 'Templates με triggers: welcome, check-in reminder, house rules, review request. Σε 6 γλώσσες, με auto-detection της γλώσσας του guest.',
        en: 'Templates with triggers: welcome, check-in reminder, house rules, review request. In 6 languages, with auto-detection of the guest\'s language.',
      }}
      competitorPitch={{
        el: 'Hospitable/Guesty χρεώνουν €30-50/μήνα για automations. Εδώ: δωρεάν. Και το auto-translate σε 6 γλώσσες κοστίζει ξεχωριστά (+€20/μήνα) αλλού.',
        en: 'Hospitable/Guesty charge €30-50/mo for automations. Here: free. And the 6-language auto-translate costs extra (+€20/mo) elsewhere.',
      }}
      roadmap={{
        el: [
          { title: 'Library με 8 default templates', desc: 'Welcome · 3 days before · 1 day before · Check-in · Mid-stay · Check-out · Review request · Come back.', eta: 'Phase 2' },
          { title: 'Drag-and-drop template editor', desc: 'Variables: {{guest_name}} {{check_in}} {{property_address}} {{wifi}} κλπ.', eta: 'Phase 2' },
          { title: 'Trigger engine (pg_cron)', desc: 'Scheduled job βλέπει bookings κάθε ώρα και στέλνει τα messages που ταιριάζουν.', eta: 'Phase 2' },
          { title: 'Per-listing overrides', desc: 'Ένα template μπορεί να απενεργοποιηθεί σε συγκεκριμένο κατάλυμα.', eta: 'Phase 2' },
          { title: 'Preview σε όλες τις γλώσσες', desc: 'Πριν ενεργοποιήσεις template, βλέπεις πώς θα φαίνεται σε EN/DE/BG/RU/RO.', eta: 'Phase 2' },
          { title: 'Delivery tracking', desc: 'Στατιστικά: τι στάλθηκε, ανοίχτηκε, απαντήθηκε.', eta: 'Phase 3' },
        ],
        en: [
          { title: 'Library with 8 default templates', desc: 'Welcome · 3 days before · 1 day before · Check-in · Mid-stay · Check-out · Review request · Come back.', eta: 'Phase 2' },
          { title: 'Drag-and-drop template editor', desc: 'Variables: {{guest_name}} {{check_in}} {{property_address}} {{wifi}} etc.', eta: 'Phase 2' },
          { title: 'Trigger engine (pg_cron)', desc: 'Scheduled job checks bookings hourly and fires matching messages.', eta: 'Phase 2' },
          { title: 'Per-listing overrides', desc: 'A template can be disabled on a specific property.', eta: 'Phase 2' },
          { title: 'Preview in all languages', desc: 'Before activating, see how the template renders in EN/DE/BG/RU/RO.', eta: 'Phase 2' },
          { title: 'Delivery tracking', desc: 'Stats on sent / opened / replied.', eta: 'Phase 3' },
        ],
      }}
    />
  );
}
