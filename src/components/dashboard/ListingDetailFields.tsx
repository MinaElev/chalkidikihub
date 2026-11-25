'use client';

/**
 * Controlled field groups for the listing edit page: house rules & times and
 * practical info. They used to live on the separate
 * "Site καταλύματος" page, each with its own load and save; now the edit page
 * owns the state and saves everything with one button.
 */
import { Navigation, KeyRound, Wifi, ParkingCircle } from 'lucide-react';

// ── House rules & times ─────────────────────────────────────────────────

export type HouseRules = {
  check_in_time: string;
  check_out_time: string;
  rule_smoking: string;
  rule_pets: string;
  rule_parties: string;
  rule_kids: string;
  quiet_hours_from: string;
  quiet_hours_to: string;
  house_rules_extra_el: string;
};

type Row = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : '');

export function houseRulesFromRow(r: Row): HouseRules {
  return {
    check_in_time: str(r.check_in_time).slice(0, 5),
    check_out_time: str(r.check_out_time).slice(0, 5),
    rule_smoking: str(r.rule_smoking),
    rule_pets: str(r.rule_pets),
    rule_parties: str(r.rule_parties),
    rule_kids: str(r.rule_kids),
    quiet_hours_from: str(r.quiet_hours_from).slice(0, 5),
    quiet_hours_to: str(r.quiet_hours_to).slice(0, 5),
    house_rules_extra_el: str(r.house_rules_extra_el),
  };
}

export function houseRulesPayload(s: HouseRules) {
  return {
    check_in_time: s.check_in_time || null,
    check_out_time: s.check_out_time || null,
    rule_smoking: s.rule_smoking || null,
    rule_pets: s.rule_pets || null,
    rule_parties: s.rule_parties || null,
    rule_kids: s.rule_kids || null,
    quiet_hours_from: s.quiet_hours_from || null,
    quiet_hours_to: s.quiet_hours_to || null,
    house_rules_extra_el: s.house_rules_extra_el.trim() || null,
  };
}

type Opt = { value: string; label: string };
const SMOKING: Opt[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπεται' },
  { value: 'outside', label: 'Μόνο εξωτερικά' },
  { value: 'allowed', label: 'Επιτρέπεται' },
];
const PETS: Opt[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπονται' },
  { value: 'on_request', label: 'Κατόπιν συνεννόησης' },
  { value: 'allowed', label: 'Επιτρέπονται' },
];
const PARTIES: Opt[] = [
  { value: 'not_allowed', label: 'Δεν επιτρέπονται' },
  { value: 'allowed', label: 'Επιτρέπονται' },
];
const KIDS: Opt[] = [
  { value: 'welcome', label: 'Καλωσορίζονται' },
  { value: 'on_request', label: 'Κατόπιν συνεννόησης' },
  { value: 'not_suitable', label: 'Μη κατάλληλο' },
];

const input = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none';

export function HouseRulesFields({ value, onChange }: { value: HouseRules; onChange: (v: HouseRules) => void }) {
  const set = <K extends keyof HouseRules>(k: K, v: HouseRules[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TimeField label="Ώρα άφιξης (check-in)" value={value.check_in_time} onChange={(v) => set('check_in_time', v)} />
        <TimeField label="Ώρα αναχώρησης (check-out)" value={value.check_out_time} onChange={(v) => set('check_out_time', v)} />
      </div>
      <RuleChoice label="Κάπνισμα" value={value.rule_smoking} options={SMOKING} onChange={(v) => set('rule_smoking', v)} />
      <RuleChoice label="Κατοικίδια" value={value.rule_pets} options={PETS} onChange={(v) => set('rule_pets', v)} />
      <RuleChoice label="Πάρτι / εκδηλώσεις" value={value.rule_parties} options={PARTIES} onChange={(v) => set('rule_parties', v)} />
      <RuleChoice label="Παιδιά" value={value.rule_kids} options={KIDS} onChange={(v) => set('rule_kids', v)} />
      <div className="grid grid-cols-2 gap-3">
        <TimeField label="Κοινή ησυχία από" value={value.quiet_hours_from} onChange={(v) => set('quiet_hours_from', v)} />
        <TimeField label="έως" value={value.quiet_hours_to} onChange={(v) => set('quiet_hours_to', v)} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Επιπλέον κανόνες / σημειώσεις</label>
        <textarea rows={3} value={value.house_rules_extra_el} onChange={(e) => set('house_rules_extra_el', e.target.value)}
          placeholder="π.χ. Μέγιστος αριθμός επισκεπτών στο σπίτι, κανόνες για την πισίνα, ανακύκλωση κ.λπ."
          className={input} />
      </div>
    </div>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type="time" value={value} onChange={(e) => onChange(e.target.value)} className={input} />
    </div>
  );
}

function RuleChoice({ label, value, options, onChange }: { label: string; value: string; options: Opt[]; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="block text-xs font-medium text-gray-600 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value}
            onClick={() => onChange(value === o.value ? '' : o.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              value === o.value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Practical info ──────────────────────────────────────────────────────

export type PracticalInfo = { how_to_reach_el: string; check_in_info_el: string; wifi_info_el: string; parking_info_el: string };

export function practicalFromRow(r: Row): PracticalInfo {
  return {
    how_to_reach_el: str(r.how_to_reach_el),
    check_in_info_el: str(r.check_in_info_el),
    wifi_info_el: str(r.wifi_info_el),
    parking_info_el: str(r.parking_info_el),
  };
}

export function practicalPayload(s: PracticalInfo) {
  return {
    how_to_reach_el: s.how_to_reach_el.trim() || null,
    check_in_info_el: s.check_in_info_el.trim() || null,
    wifi_info_el: s.wifi_info_el.trim() || null,
    parking_info_el: s.parking_info_el.trim() || null,
  };
}

const PRACTICAL: { key: keyof PracticalInfo; label: string; placeholder: string; icon: React.ElementType }[] = [
  { key: 'how_to_reach_el', label: 'Πώς θα φτάσετε', placeholder: 'π.χ. Από το αεροδρόμιο Θεσσαλονίκης, 70 χλμ προς Κασσάνδρα…', icon: Navigation },
  { key: 'check_in_info_el', label: 'Οδηγίες άφιξης (check-in)', placeholder: 'π.χ. Η είσοδος γίνεται με keybox· τον κωδικό τον στέλνουμε 24 ώρες πριν…', icon: KeyRound },
  { key: 'wifi_info_el', label: 'Wi-Fi', placeholder: 'π.χ. Δωρεάν Wi-Fi σε όλους τους χώρους· ο κωδικός δίνεται στην άφιξη', icon: Wifi },
  { key: 'parking_info_el', label: 'Στάθμευση', placeholder: 'π.χ. Δωρεάν ιδιωτικό πάρκινγκ για 2 αυτοκίνητα στην αυλή', icon: ParkingCircle },
];

export function PracticalInfoFields({ value, onChange }: { value: PracticalInfo; onChange: (v: PracticalInfo) => void }) {
  return (
    <div className="space-y-4">
      {PRACTICAL.map(({ key, label, placeholder, icon: Icon }) => (
        <div key={key}>
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
            <Icon className="w-3.5 h-3.5 text-indigo-500" />{label}
          </label>
          <textarea rows={3} value={value[key]} placeholder={placeholder}
            onChange={(e) => onChange({ ...value, [key]: e.target.value })} className={input} />
        </div>
      ))}
    </div>
  );
}
