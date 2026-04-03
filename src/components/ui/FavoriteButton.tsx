'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FavoriteButtonProps {
  itemType: 'listing' | 'beach' | 'restaurant' | 'activity';
  itemSlug: string;
  size?: 'sm' | 'md';
}

export function FavoriteButton({ itemType, itemSlug, size = 'md' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        // Check if already favorited
        supabase.from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_slug', itemSlug)
          .single()
          .then(({ data }) => {
            if (data) setIsFavorite(true);
          });
      }
    });
  }, [itemType, itemSlug]);

  async function toggle() {
    if (!userId) {
      // Not logged in - redirect to login
      window.location.href = '/el/auth/login';
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isFavorite) {
      await supabase.from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('item_type', itemType)
        .eq('item_slug', itemSlug);
      setIsFavorite(false);
    } else {
      await supabase.from('favorites').insert({
        user_id: userId,
        item_type: itemType,
        item_slug: itemSlug,
      });
      setIsFavorite(true);
    }
    setLoading(false);
  }

  const sizeClasses = size === 'sm'
    ? 'w-8 h-8'
    : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      disabled={loading}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all ${
        isFavorite
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white'
      } shadow-sm`}
      title={isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`${iconSize} ${isFavorite ? 'fill-red-500' : ''}`} />
    </button>
  );
}
