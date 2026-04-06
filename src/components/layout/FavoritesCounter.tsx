'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import { Heart } from 'lucide-react';

export function FavoritesCounter() {
  const [count, setCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setLoggedIn(true);
      const { count: c } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      setCount(c || 0);
    });
  }, []);

  if (!loggedIn) return null;

  return (
    <Link href="/favorites" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Αγαπημένα">
      <Heart className={`w-5 h-5 ${count > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
