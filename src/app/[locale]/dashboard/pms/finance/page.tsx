'use client';
import { TrendingUp } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsFinancePage() {
  return (
    <PmsModulePlaceholder
      icon={TrendingUp}
      accent="teal"
      title={{ el: 'Οικονομικά & Αναφορές', en: 'Finance & Reports' }}
      lede={{
        el: 'Έσοδα, έξοδα, occupancy, average daily rate. Ελληνικά tax-ready reports (ΦΠΑ, ΑΜΑ) που μπορείς να δώσεις στον λογιστή σου.',
        en: 'Revenue, expenses, occupancy, ADR. Greek tax-ready reports (VAT, AMA) you can hand straight to your accountant.',
      }}
      competitorPitch={{
        el: 'AirDNA €40/μήνα για market data. QuickBooks integrations €25+/μήνα. Εδώ: δωρεάν, με ελληνική φορολογική δομή built-in.',
        en: 'AirDNA €40/mo for market data. QuickBooks integrations €25+/mo. Here: free, with Greek tax structure built-in.',
      }}
      roadmap={{
        el: [
          { title: 'Dashboard με KPIs ανά μήνα/έτος', desc: 'Revenue · ADR · RevPAR · Occupancy % · Cancellations rate.', eta: 'Phase 3' },
          { title: 'Breakdown ανά listing / πηγή', desc: 'Δες ποιο κατάλυμα φέρνει τα περισσότερα, και από ποια πλατφόρμα.', eta: 'Phase 3' },
          { title: 'Έξοδα (καθαριότητα, service fees)', desc: 'Από το Tasks module + manual entries. Net revenue calculation.', eta: 'Phase 3' },
          { title: 'ΦΠΑ report (13% τουριστικός)', desc: 'Μηνιαίο/τριμηνιαίο για ΑΑΔΕ, με breakdown ανά listing.', eta: 'Phase 4' },
          { title: 'CSV export για λογιστή', desc: 'Όλες οι κρατήσεις σε CSV με τιμολόγηση, πληρωμές, επιστροφές.', eta: 'Phase 3' },
          { title: 'Year-over-year comparison', desc: 'Βλέπεις αν αυτό το καλοκαίρι τα πας καλύτερα από πέρσι.', eta: 'Phase 4' },
          { title: 'Forecast για επόμενη σεζόν', desc: 'Με βάση current bookings + historic rate, προβλέπει revenue.', eta: 'Phase 4' },
        ],
        en: [
          { title: 'Dashboard with monthly/yearly KPIs', desc: 'Revenue · ADR · RevPAR · Occupancy % · Cancellation rate.', eta: 'Phase 3' },
          { title: 'Breakdown by listing / source', desc: 'See which property earns most, and which platform drives it.', eta: 'Phase 3' },
          { title: 'Expenses (cleaning, service fees)', desc: 'From the Tasks module + manual entries. Net revenue calc.', eta: 'Phase 3' },
          { title: 'VAT report (13% Greek tourism)', desc: 'Monthly/quarterly for ΑΑΔΕ, broken down by listing.', eta: 'Phase 4' },
          { title: 'CSV export for accountant', desc: 'All bookings in CSV with pricing, payments, refunds.', eta: 'Phase 3' },
          { title: 'Year-over-year comparison', desc: 'See whether this summer is beating last summer.', eta: 'Phase 4' },
          { title: 'Next-season forecast', desc: 'Based on current bookings + historical rate, projects revenue.', eta: 'Phase 4' },
        ],
      }}
    />
  );
}
