'use client';

import { useEffect, useState } from 'react';
import { Star, Check, X, Loader2, Waves, UtensilsCrossed, Landmark, MessageSquare, ChevronDown, ChevronUp, Home } from 'lucide-react';

interface PendingItem {
  id: string;
  table: string;
  type: string;
  author_name: string;
  rating?: number;
  comment: string;
  item_name: string;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof Waves; color: string; label: string }> = {
  beach: { icon: Waves, color: 'bg-cyan-100 text-cyan-700', label: 'Παραλία' },
  restaurant: { icon: UtensilsCrossed, color: 'bg-red-100 text-red-700', label: 'Εστιατόριο' },
  activity: { icon: Landmark, color: 'bg-amber-100 text-amber-700', label: 'Δραστηριότητα' },
  listing: { icon: Home, color: 'bg-emerald-100 text-emerald-700', label: 'Κατάλυμα' },
  comment: { icon: MessageSquare, color: 'bg-indigo-100 text-indigo-700', label: 'Blog Comment' },
};

export default function AdminReviewsPage() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { loadPending(); }, []);

  async function loadPending() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data as PendingItem[]);
    } catch {}
    setLoading(false);
  }

  async function handleAction(item: PendingItem, action: 'approved' | 'rejected') {
    setActionLoading(item.id);
    try {
      await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, table: item.table, action }),
      });
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch {}
    setActionLoading(null);
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Comments ({items.length})</h1>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: `Όλα (${items.length})` },
          { key: 'beach', label: `Παραλίες (${items.filter(i => i.type === 'beach').length})` },
          { key: 'restaurant', label: `Εστιατόρια (${items.filter(i => i.type === 'restaurant').length})` },
          { key: 'activity', label: `Δραστηριότητες (${items.filter(i => i.type === 'activity').length})` },
          { key: 'listing', label: `Καταλύματα (${items.filter(i => i.type === 'listing').length})` },
          { key: 'comment', label: `Blog (${items.filter(i => i.type === 'comment').length})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f.key ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Δεν υπάρχουν pending reviews/comments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const config = typeConfig[item.type] || typeConfig.beach;
            const isExpanded = expanded === item.id;
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isExpanded ? null : item.id)}>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.color}`}>{config.label}</span>
                  {item.rating && (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= item.rating! ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900 flex-1 truncate">{item.author_name}</span>
                  <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('el')}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 mb-1">Για: <strong>{item.item_name}</strong></p>
                    <p className="text-sm text-gray-700 mb-4">{item.comment || '(χωρίς σχόλιο)'}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(item, 'approved')} disabled={actionLoading === item.id}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                        {actionLoading === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Έγκριση
                      </button>
                      <button onClick={() => handleAction(item, 'rejected')} disabled={actionLoading === item.id}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                        <X className="w-4 h-4" /> Απόρριψη
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
