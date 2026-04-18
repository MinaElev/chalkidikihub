'use client';
import { Wrench } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsTasksPage() {
  return (
    <PmsModulePlaceholder
      icon={Wrench}
      accent="rose"
      title={{ el: 'Καθαριότητα & Εργασίες', en: 'Cleaning & Tasks' }}
      lede={{
        el: 'Auto-scheduling καθαρισμών ανά checkout. Ενημέρωση συνεργατών, ιστορικό, κόστος. Προαιρετικά SMS στους cleaners με οδηγίες.',
        en: 'Auto-schedule cleanings on every checkout. Notify vendors, keep history, track cost. Optional SMS to cleaners with instructions.',
      }}
      competitorPitch={{
        el: 'Hostfully & Breezeway χρεώνουν €20-40/μήνα για task management. Εδώ: δωρεάν + integrated με το booking system.',
        en: 'Hostfully & Breezeway charge €20-40/mo for task management. Here: free + integrated with the booking system.',
      }}
      roadmap={{
        el: [
          { title: 'Λίστα συνεργατών (cleaners)', desc: 'Όνομα, τηλέφωνο, email, default rate. Ανάθεση σε tasks.', eta: 'Phase 3' },
          { title: 'Auto-create task στο checkout', desc: 'Όταν μια κράτηση τελειώνει, δημιουργείται task καθαρισμού αυτόματα.', eta: 'Phase 3' },
          { title: 'Task list + calendar view', desc: 'Εβδομαδιαία προβολή όλων των tasks, φιλτραρισμένη ανά cleaner.', eta: 'Phase 3' },
          { title: 'SMS / email στον cleaner', desc: 'Όταν δημιουργείται task, auto-μήνυμα με διεύθυνση, ώρα, notes.', eta: 'Phase 3' },
          { title: 'Cost tracking per task', desc: 'Συνολικό κόστος καθαριότητας ανά μήνα, integration στο Finance module.', eta: 'Phase 3' },
          { title: 'Photo proof of completion', desc: 'Ο cleaner ανεβάζει φωτό μετά το task — δεν αμφισβητείται η δουλειά.', eta: 'Phase 4' },
        ],
        en: [
          { title: 'Vendors list (cleaners)', desc: 'Name, phone, email, default rate. Assign to tasks.', eta: 'Phase 3' },
          { title: 'Auto-create task on checkout', desc: 'When a booking ends, a cleaning task is created automatically.', eta: 'Phase 3' },
          { title: 'Task list + calendar view', desc: 'Weekly view of all tasks, filterable by cleaner.', eta: 'Phase 3' },
          { title: 'SMS / email to vendor', desc: 'On task creation, auto-send address, time, notes.', eta: 'Phase 3' },
          { title: 'Cost tracking per task', desc: 'Monthly cleaning cost total, integrated into the Finance module.', eta: 'Phase 3' },
          { title: 'Photo proof of completion', desc: 'Vendor uploads a photo after the task — no disputes.', eta: 'Phase 4' },
        ],
      }}
    />
  );
}
