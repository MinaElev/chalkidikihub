'use client';
import { DollarSign } from 'lucide-react';
import { PmsModulePlaceholder } from '@/components/pms/PmsModulePlaceholder';

export default function PmsPricingPage() {
  return (
    <PmsModulePlaceholder
      icon={DollarSign}
      accent="amber"
      title={{ el: 'Κανόνες Τιμολόγησης', en: 'Pricing Rules' }}
      lede={{
        el: 'Seasonal rates, Σ/Κ premium, LOS discounts, last-minute deals — όλα configurable. Επιπλέον, AI suggestions βασισμένα σε market data της Χαλκιδικής.',
        en: 'Seasonal rates, weekend premiums, LOS discounts, last-minute deals — all configurable. Plus AI suggestions based on Halkidiki market data.',
      }}
      competitorPitch={{
        el: 'PriceLabs €30-50/μήνα, Wheelhouse €50+, Beyond Pricing 5% προμήθεια σε κάθε κράτηση! Εδώ: δωρεάν + τοπικά δεδομένα που μόνο εμείς έχουμε.',
        en: 'PriceLabs €30-50/mo, Wheelhouse €50+, Beyond Pricing charges 5% per booking! Here: free + local data only we have.',
      }}
      roadmap={{
        el: [
          { title: 'Base rate per listing', desc: 'Συνδέεται με το υπάρχον price_per_night — κληρονομεί αν δεν υπάρχει rule.', eta: 'Phase 3' },
          { title: 'Seasonal rules', desc: 'π.χ. Peak Ιουλ-Αυγ +40%, Low Οκτ-Μαρ -30%. Ημερομηνιακά αλεπάλληλα.', eta: 'Phase 3' },
          { title: 'Weekend premium', desc: 'Παρ-Κυρ +15-20%. Configurable ανά listing.', eta: 'Phase 3' },
          { title: 'Length-of-stay discounts', desc: '7+ βράδια → -10%, 14+ → -15%, monthly → -25%.', eta: 'Phase 3' },
          { title: 'Last-minute deals', desc: '<7 days away → -15% για να γεμίσει κενά.', eta: 'Phase 3' },
          { title: 'Smart Pricing AI', desc: 'Suggestions βασισμένα σε occupancy γειτονικών listings + events + seasonality.', eta: 'Phase 4' },
          { title: 'Calendar preview with live rates', desc: 'Όταν ρυθμίζεις rules, βλέπεις το τελικό €/βράδυ πάνω στο ημερολόγιο.', eta: 'Phase 3' },
        ],
        en: [
          { title: 'Base rate per listing', desc: 'Wired to the existing price_per_night — inherits when no rule matches.', eta: 'Phase 3' },
          { title: 'Seasonal rules', desc: 'e.g. Peak Jul-Aug +40%, Low Oct-Mar -30%. Date ranges with priorities.', eta: 'Phase 3' },
          { title: 'Weekend premium', desc: 'Fri-Sun +15-20%. Configurable per listing.', eta: 'Phase 3' },
          { title: 'Length-of-stay discounts', desc: '7+ nights → -10%, 14+ → -15%, monthly → -25%.', eta: 'Phase 3' },
          { title: 'Last-minute deals', desc: '<7 days away → -15% to fill gaps.', eta: 'Phase 3' },
          { title: 'Smart Pricing AI', desc: 'Suggestions based on neighbor occupancy + events + seasonality.', eta: 'Phase 4' },
          { title: 'Calendar preview with live rates', desc: 'As you tune rules, the final €/night renders on the calendar.', eta: 'Phase 3' },
        ],
      }}
    />
  );
}
