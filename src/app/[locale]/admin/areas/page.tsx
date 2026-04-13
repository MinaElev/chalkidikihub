'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { MapPin, Edit, Loader2 } from 'lucide-react';

interface AreaRow { id: string; slug: string; name_el: string; name_en: string; image_url: string; sort_order: number; }

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('areas').select('id, slug, name_el, name_en, image_url, sort_order')
      .order('sort_order').then(({ data }) => { setAreas(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-900">Areas ({areas.length})</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => (
          <Link key={area.id} href={`/admin/areas/${area.id}/edit`}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative aspect-[16/9] bg-gray-200">
              {area.image_url ? (
                <Image src={area.image_url || '/images/placeholder.svg'} alt={area.name_el} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary-300" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <Edit className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">{area.name_el}</h3>
              <p className="text-sm text-gray-500">{area.name_en} | {area.slug}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
