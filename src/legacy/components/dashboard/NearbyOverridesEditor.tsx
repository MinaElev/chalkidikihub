'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Loader2, Save, Eye, EyeOff, Waves, UtensilsCrossed, MountainSnow, MapPin, Check,
} from 'lucide-react';

interface NearbyEntity {
  id: string;
  type: 'beach' | 'restaurant' | 'activity' | 'village';
  slug: string;
  name: Record<string, string>;
  distance_km: number;
}

interface OverrideRow {
  listing_id: string;
  entity_type: string;
  entity_id: string;
  is_hidden: boolean;
  sort_order: number;
}

interface Draft {
  hidden: boolean;
  dirty: boolean;
}

const GROUPS: { key: 'beaches' | 'restaurants' | 'activities' | 'villages'; label: string; Icon: React.ElementType }[] = [
  { key: 'beaches',     label: 'Παραλίες',     Icon: Waves },
  { key: 'restaurants', label: 'Εστιατόρια',   Icon: UtensilsCrossed },
  { key: 'activities',  label: 'Δραστηριότητες', Icon: MountainSnow },
  { key: 'villages',    label: 'Χωριά',        Icon: MapPin },
];

export function NearbyOverridesEditor({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nearby, setNearby] = useState<Record<string, NearbyEntity[]>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [anyDirty, setAnyDirty] = useState(false);

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    // 1) Fetch computed nearby + 2) fetch owner overrides
    const supabase = createClient();
    const [nearbyRes, overridesRes] = await Promise.all([
      fetch(`/api/nearby?listing_id=${listingId}`).then(r => r.json()),
      supabase.from('listing_nearby_overrides').select('*').eq('listing_id', listingId),
    ]);

    const grouped: Record<string, NearbyEntity[]> = {
      beaches: nearbyRes.beaches || [],
      restaurants: nearbyRes.restaurants || [],
      activities: nearbyRes.activities || [],
      villages: nearbyRes.villages || [],
    };
    setNearby(grouped);

    const d: Record<string, Draft> = {};
    (overridesRes.data as OverrideRow[] | null || []).forEach(r => {
      d[`${r.entity_type}:${r.entity_id}`] = { hidden: r.is_hidden, dirty: false };
    });
    setDrafts(d);
    setLoading(false);
  }

  function toggle(type: string, id: string) {
    const key = `${type}:${id}`;
    setDrafts(prev => ({
      ...prev,
      [key]: { hidden: !(prev[key]?.hidden), dirty: true },
    }));
    setAnyDirty(true);
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();

    const toUpsert: Array<{ listing_id: string; entity_type: string; entity_id: string; is_hidden: boolean; sort_order: number }> = [];
    const toDelete: Array<{ entity_type: string; entity_id: string }> = [];

    Object.entries(drafts).forEach(([key, d]) => {
      if (!d.dirty) return;
      const [entity_type, entity_id] = key.split(':');
      if (d.hidden) {
        toUpsert.push({ listing_id: listingId, entity_type, entity_id, is_hidden: true, sort_order: 0 });
      } else {
        toDelete.push({ entity_type, entity_id });
      }
    });

    try {
      if (toUpsert.length > 0) {
        const { error } = await supabase
          .from('listing_nearby_overrides')
          .upsert(toUpsert, { onConflict: 'listing_id,entity_type,entity_id' });
        if (error) throw error;
      }
      for (const d of toDelete) {
        await supabase
          .from('listing_nearby_overrides')
          .delete()
          .eq('listing_id', listingId)
          .eq('entity_type', d.entity_type)
          .eq('entity_id', d.entity_id);
      }
      setDrafts(prev => {
        const next: Record<string, Draft> = {};
        Object.entries(prev).forEach(([k, v]) => { next[k] = { ...v, dirty: false }; });
        return next;
      });
      setAnyDirty(false);
    } catch (err) {
      alert('Σφάλμα: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
    setSaving(false);
  }

  if (loading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;

  const totalItems = Object.values(nearby).reduce((acc, arr) => acc + arr.length, 0);

  if (totalItems === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
        Δεν βρέθηκαν κοντινές τοποθεσίες (έλεγξε ότι το κατάλυμα έχει σωστό γεωγραφικό στίγμα).
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-600">
        Τα παρακάτω υπολογίζονται αυτόματα βάσει απόστασης. Κάνε κλικ στο 👁️ για να αποκρύψεις ή να εμφανίσεις κάθε τοποθεσία στην προσωπική σου σελίδα.
      </p>

      {GROUPS.map(({ key, label, Icon }) => {
        const items = nearby[key] || [];
        if (items.length === 0) return null;
        return (
          <div key={key}>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
              <Icon className="w-4 h-4 text-primary-600" />
              {label}
            </h3>
            <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {items.map((e) => {
                const k = `${e.type}:${e.id}`;
                const draft = drafts[k];
                const hidden = !!draft?.hidden;
                return (
                  <li key={e.id} className={`flex items-center gap-3 p-3 text-sm ${hidden ? 'opacity-50' : ''}`}>
                    <span className="flex-1 min-w-0 truncate">
                      {e.name.el || e.name.en}
                    </span>
                    <span className="text-xs text-gray-500 tabular-nums">
                      {e.distance_km < 1 ? `${Math.round(e.distance_km * 1000)}m` : `${e.distance_km.toFixed(1)}km`}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggle(e.type, e.id)}
                      className={`p-1.5 rounded-lg ${hidden ? 'text-gray-400 hover:bg-gray-100' : 'text-primary-600 hover:bg-primary-50'}`}
                      title={hidden ? 'Εμφάνιση' : 'Απόκρυψη'}
                    >
                      {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        {anyDirty && <span className="text-xs text-amber-700">Μη αποθηκευμένες αλλαγές</span>}
        <button type="button" onClick={save} disabled={saving || !anyDirty}
          className="text-sm flex items-center gap-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Αποθήκευση
        </button>
      </div>
    </div>
  );
}
