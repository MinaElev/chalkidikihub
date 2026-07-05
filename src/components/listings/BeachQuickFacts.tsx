'use client';

import { useLocale } from 'next-intl';
import { Waves, Umbrella, Car, Wine, Baby, Anchor, ShieldCheck, Accessibility, Users, Heart, Info } from 'lucide-react';
import type { Beach } from '@/types';

/**
 * Scannable "at a glance" facts box for a beach. Rendered high on the detail
 * page so Google can lift it into a featured snippet and LLM crawlers can
 * extract structured attributes without parsing prose. Only asserts POSITIVE
 * facts (a missing feature flag ≠ "no"), so nothing here is misleading.
 *
 * Localised for the two indexed locales (el/en); hidden machine-translated
 * locales fall back to English labels — consistent with the rest of the SEO
 * surface, which only advertises el/en.
 */

type Dict = Record<string, string>;
const pick = (d: Dict, locale: string) => d[locale] || d.en;

const L = {
  title: { el: 'Με μια ματιά', en: 'At a glance' },
  area: { el: 'Περιοχή', en: 'Area' },
  type: { el: 'Τύπος', en: 'Type' },
  access: { el: 'Πρόσβαση', en: 'Access' },
  sunbeds: { el: 'Ξαπλώστρες & ομπρέλες', en: 'Sunbeds & umbrellas' },
  beachBar: { el: 'Beach bar', en: 'Beach bar' },
  parking: { el: 'Πάρκινγκ', en: 'Parking' },
  shallow: { el: 'Ρηχά νερά', en: 'Shallow water' },
  watersports: { el: 'Θαλάσσια σπορ', en: 'Water sports' },
  lifeguard: { el: 'Ναυαγοσώστης', en: 'Lifeguard' },
  accessible: { el: 'Πρόσβαση ΑμεΑ', en: 'Wheelchair access' },
  bestFor: { el: 'Ιδανική για', en: 'Best for' },
  yes: { el: 'Ναι', en: 'Yes' },
  sandy: { el: 'Αμμώδης', en: 'Sandy' },
  pebble: { el: 'Βότσαλα', en: 'Pebble' },
  sandyPebble: { el: 'Άμμος & βότσαλα', en: 'Sand & pebble' },
  organized: { el: 'Οργανωμένη', en: 'Organized' },
  freeAccess: { el: 'Ελεύθερη', en: 'Free / unorganized' },
  mixed: { el: 'Οργανωμένη & ελεύθερα τμήματα', en: 'Organized & free sections' },
  families: { el: 'Οικογένειες με παιδιά', en: 'Families with kids' },
  couples: { el: 'Ζευγάρια & ησυχία', en: 'Couples & quiet' },
  sportsFans: { el: 'Θαλάσσια σπορ', en: 'Water sports' },
  nudists: { el: 'Γυμνιστές', en: 'Naturists' },
} satisfies Record<string, Dict>;

const areaNames: Record<string, Dict> = {
  kassandra: { el: 'Κασσάνδρα', en: 'Kassandra' },
  sithonia: { el: 'Σιθωνία', en: 'Sithonia' },
  athos: { el: 'Άθως', en: 'Athos' },
  mainland: { el: 'Ηπειρωτική Χαλκιδική', en: 'Mainland Halkidiki' },
};

export function BeachQuickFacts({ beach }: { beach: Beach }) {
  const locale = useLocale();
  const f = new Set(beach.features || []);
  const t = (d: Dict) => pick(d, locale);

  // Beach type
  let typeVal = '';
  if (f.has('sandy') && f.has('pebble')) typeVal = t(L.sandyPebble);
  else if (f.has('sandy')) typeVal = t(L.sandy);
  else if (f.has('pebble')) typeVal = t(L.pebble);

  // Access
  let accessVal = '';
  if (f.has('organized') && f.has('free')) accessVal = t(L.mixed);
  else if (f.has('organized')) accessVal = t(L.organized);
  else if (f.has('free')) accessVal = t(L.freeAccess);

  // Best for (derived, 1–3 tags)
  const bestFor: string[] = [];
  if (f.has('shallowWater') || (f.has('organized') && !f.has('nudist'))) bestFor.push(t(L.families));
  if (f.has('waterSports')) bestFor.push(t(L.sportsFans));
  if (f.has('free') && !f.has('organized')) bestFor.push(t(L.couples));
  if (f.has('nudist')) bestFor.push(t(L.nudists));

  const areaLabel = beach.area ? (areaNames[beach.area]?.[locale] || areaNames[beach.area]?.en || '') : '';
  const areaVal = [beach.location_name, areaLabel].filter(Boolean).join(' · ');

  const rows: Array<{ icon: React.ElementType; label: string; value: string }> = [];
  if (areaVal) rows.push({ icon: Info, label: t(L.area), value: areaVal });
  if (typeVal) rows.push({ icon: Waves, label: t(L.type), value: typeVal });
  if (accessVal) rows.push({ icon: Umbrella, label: t(L.access), value: accessVal });
  if (f.has('sunbeds') || f.has('organized')) rows.push({ icon: Umbrella, label: t(L.sunbeds), value: t(L.yes) });
  if (f.has('beachBar')) rows.push({ icon: Wine, label: t(L.beachBar), value: t(L.yes) });
  if (f.has('waterSports')) rows.push({ icon: Anchor, label: t(L.watersports), value: t(L.yes) });
  if (f.has('shallowWater')) rows.push({ icon: Baby, label: t(L.shallow), value: t(L.yes) });
  if (f.has('parking')) rows.push({ icon: Car, label: t(L.parking), value: t(L.yes) });
  if (f.has('lifeguard')) rows.push({ icon: ShieldCheck, label: t(L.lifeguard), value: t(L.yes) });
  if (f.has('accessible')) rows.push({ icon: Accessibility, label: t(L.accessible), value: t(L.yes) });

  // Nothing assertable (no features + no location) → don't render an empty box.
  if (rows.length === 0 && bestFor.length === 0) return null;

  return (
    <section aria-label={t(L.title)} className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">{t(L.title)}</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-center gap-2.5 text-sm">
              <Icon className="w-4 h-4 text-primary-500 shrink-0" />
              <dt className="text-gray-500">{r.label}:</dt>
              <dd className="font-semibold text-gray-900 ml-auto text-right">{r.value}</dd>
            </div>
          );
        })}
      </dl>
      {bestFor.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
            {bestFor.includes(t(L.couples)) ? <Heart className="w-4 h-4 text-primary-500" /> : <Users className="w-4 h-4 text-primary-500" />}
            {t(L.bestFor)}:
          </span>
          {bestFor.map((b) => (
            <span key={b} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{b}</span>
          ))}
        </div>
      )}
    </section>
  );
}
