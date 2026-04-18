'use client';
import { CalendarDays } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsCalendarPage() {
  return (
    <PmsModulePlaceholder
      icon={CalendarDays}
      accent="sky"
      title={{ el: 'Ημερολόγιο & iCal Sync', en: 'Calendar & iCal Sync' }}
      lede={{
        el: 'Ένα multi-listing ημερολόγιο που συγχρονίζεται αμφίδρομα με Airbnb, Booking.com, VRBO. Manual blocks, notes, προετοιμασία μεταξύ κρατήσεων.',
        en: 'A multi-listing calendar that two-way-syncs with Airbnb, Booking.com and VRBO. Manual blocks, notes, turnaround buffers.',
      }}
      competitorPitch={{
        el: 'Smoobu & Hostaway χρεώνουν €20-50/μήνα για iCal channel sync. Εδώ: €0, χωρίς όρια καταλυμάτων.',
        en: 'Smoobu & Hostaway charge €20-50/month for iCal channel sync. Here: €0, unlimited listings.',
      }}
      roadmap={{
        el: [
          { title: 'iCal import από Airbnb/Booking/VRBO', desc: 'Ο owner κολλάει το iCal URL και εμείς τραβάμε events κάθε 1-4 ώρες.', eta: 'Phase 1' },
          { title: 'iCal export endpoint', desc: 'Αυτό-παραγόμενο .ics URL ανά listing για paste σε άλλες πλατφόρμες.', eta: 'Phase 1' },
          { title: 'Multi-listing month view', desc: 'Grid όλων των καταλυμάτων σε timeline — βλέπεις πότε είναι γεμάτα.', eta: 'Phase 1' },
          { title: 'Manual block + drag-drop', desc: 'Πατάς μέρα → block για συντήρηση ή προσωπική χρήση.', eta: 'Phase 1' },
          { title: 'Conflict detection', desc: 'Ειδοποίηση αν iCal event επικαλύπτεται με direct booking.', eta: 'Phase 2' },
          { title: 'Turnaround buffer per listing', desc: 'Αυτόματο block X ημερών ανάμεσα σε κρατήσεις για καθάρισμα.', eta: 'Phase 2' },
        ],
        en: [
          { title: 'iCal import from Airbnb/Booking/VRBO', desc: 'Owner pastes iCal URL; we pull events every 1-4 hours.', eta: 'Phase 1' },
          { title: 'iCal export endpoint', desc: 'Auto-generated .ics URL per listing for pasting into other platforms.', eta: 'Phase 1' },
          { title: 'Multi-listing month view', desc: 'Grid of all properties on a timeline — see everything at once.', eta: 'Phase 1' },
          { title: 'Manual block + drag-drop', desc: 'Click a day → block for maintenance or personal use.', eta: 'Phase 1' },
          { title: 'Conflict detection', desc: 'Alert when an iCal event overlaps a direct booking.', eta: 'Phase 2' },
          { title: 'Per-listing turnaround buffer', desc: 'Auto-block N days between bookings for cleaning.', eta: 'Phase 2' },
        ],
      }}
    />
  );
}
