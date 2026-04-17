'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';

interface ImageRow {
  id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
  caption_el: string | null;
}

interface Draft {
  caption_el: string;
  isDirty: boolean;
}

export function PhotoCaptionsEditor({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => { load(); }, [listingId]); // eslint-disable-line

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from('listing_images')
      .select('id, image_url, sort_order, is_cover, caption_el')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true });
    const list = (data || []) as ImageRow[];
    setImages(list);
    const d: Record<string, Draft> = {};
    list.forEach(i => { d[i.id] = { caption_el: i.caption_el || '', isDirty: false }; });
    setDrafts(d);
    setLoading(false);
  }

  function updateDraft(id: string, val: string) {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], caption_el: val, isDirty: true } }));
  }

  async function save(id: string) {
    const d = drafts[id];
    setSaving(prev => ({ ...prev, [id]: true }));
    const supabase = createClient();
    const payload: Record<string, string | null> = {
      caption_el: d.caption_el.trim() || null,
    };
    const { error } = await supabase.from('listing_images').update(payload).eq('id', id);
    if (error) alert('Σφάλμα: ' + error.message);
    else setDrafts(prev => ({ ...prev, [id]: { ...prev[id], isDirty: false } }));
    setSaving(prev => ({ ...prev, [id]: false }));
  }

  if (loading) return <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-primary-600" /></div>;

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        Δεν έχεις φωτογραφίες ακόμα. Πρόσθεσε φωτογραφίες από την «Επεξεργασία καταλύματος».
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {images.map((img) => {
        const d = drafts[img.id];
        if (!d) return null;
        return (
          <div key={img.id} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <Image src={img.image_url} alt="" fill sizes="112px" className="object-cover" />
              {img.is_cover && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary-600/80 text-white text-[10px] text-center py-0.5 font-medium">
                  Cover
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-600 mb-1">Λεζάντα (ελληνικά)</label>
              <input type="text" value={d.caption_el} onChange={(e) => updateDraft(img.id, e.target.value)}
                placeholder="π.χ. Κύρια κρεβατοκάμαρα με θέα θάλασσα"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none" />
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="ml-auto flex items-center gap-2">
                  {d.isDirty && <span className="text-[10px] text-amber-700">Μη αποθηκευμένη</span>}
                  <button type="button" onClick={() => save(img.id)} disabled={saving[img.id] || !d.isDirty}
                    className="text-xs flex items-center gap-1 px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-40">
                    {saving[img.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Αποθήκευση
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <p className="mt-3 text-[11px] text-gray-500 italic">
        💡 Οι λεζάντες εμφανίζονται σε hover πάνω στη gallery της προσωπικής σελίδας.
      </p>
    </div>
  );
}
