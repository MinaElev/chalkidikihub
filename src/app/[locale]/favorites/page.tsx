'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link, useRouter } from '@/i18n/navigation';
import { Heart, Loader2, Home, Waves, UtensilsCrossed, Landmark, Trash2 } from 'lucide-react';

interface Favorite {
  id: string;
  item_type: string;
  item_slug: string;
  created_at: string;
  title?: string;
}

const typeConfig: Record<string, { icon: typeof Heart; color: string; label: string; path: string }> = {
  listing: { icon: Home, color: 'text-primary-600 bg-primary-50', label: 'Κατάλυμα', path: '/listings' },
  beach: { icon: Waves, color: 'text-cyan-600 bg-cyan-50', label: 'Παραλία', path: '/beaches' },
  restaurant: { icon: UtensilsCrossed, color: 'text-red-600 bg-red-50', label: 'Εστιατόριο', path: '/restaurants' },
  activity: { icon: Landmark, color: 'text-amber-600 bg-amber-50', label: 'Δραστηριότητα', path: '/activities' },
};

export default function FavoritesPage() {
  const locale = useLocale();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setFavorites((data as Favorite[]) || []);
      setLoading(false);
    });
  }, [router]);

  async function removeFavorite(id: string) {
    const supabase = createClient();
    await supabase.from('favorites').delete().eq('id', id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'el' ? 'Τα αγαπημένα μου' : 'My Favorites'} ({favorites.length})
        </h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{locale === 'el' ? 'Δεν έχετε αγαπημένα ακόμα' : 'No favorites yet'}</p>
          <Link href="/listings" className="inline-flex px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
            {locale === 'el' ? 'Εξερευνήστε καταλύματα' : 'Explore listings'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => {
            const conf = typeConfig[fav.item_type] || typeConfig.listing;
            const Icon = conf.icon;
            return (
              <div key={fav.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <Link href={`${conf.path}/${fav.item_slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${conf.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{fav.item_slug.replace(/-/g, ' ')}</div>
                    <div className="text-xs text-gray-500">{conf.label} • {new Date(fav.created_at).toLocaleDateString(locale)}</div>
                  </div>
                </Link>
                <button onClick={() => removeFavorite(fav.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
